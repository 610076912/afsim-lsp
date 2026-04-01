import { createToken } from "chevrotain";
import { WSF_END_KEYWORDS, WSF_TOP_LEVEL_KEYWORDS, ScriptEntryCategory } from "./wsf-tokens.js";

// ============================================================================
// Custom Token Matchers for `script` and `execute` disambiguation
//
// Problem:
//   `script` can mean:
//     (a) Function definition block → `script void foo() { ... } end_script` (SCRIPT_FUNC_MODE)
//     (b) Statement block → `script { ... } end_script` (SCRIPT_MODE)
//     (c) Part of `end_script`, `script_variables`, etc. — handled by longer_alt
//
//   `execute` can mean:
//     (a) Script entry → `execute <ScriptBlock>* end_execute` (push SCRIPT_MODE)
//     (b) WSF command ref → `execute <string> in <processors>` (no mode change)
//     (c) `execute at_time ...` or `execute at_interval_of ...` (push SCRIPT_MODE)
//
// Solution: Custom Token Matcher at lexer level with forward lookahead
// ============================================================================

// ---------------------------------------------------------------------------
// Helper: peek at next non-whitespace token text
// ---------------------------------------------------------------------------

interface PeekResult {
  word: string;
  /** Offset in the original text where the word ends */
  endOffset: number;
}

function peekNextWord(text: string, afterOffset: number): PeekResult | null {
  // Skip whitespace
  let i = afterOffset;
  const len = text.length;
  while (i < len && /[ \t\r\n]/.test(text[i])) {
    i++;
  }
  if (i >= len) return null;

  // Read identifier-like word (strict C-like pattern for peek)
  const match = /[a-zA-Z_][a-zA-Z0-9_]*/.exec(text.substring(i));
  if (match && match.index === 0) {
    return { word: match[0], endOffset: i + match[0].length };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Helper: create RegExpExecArray result
// ---------------------------------------------------------------------------

function makeMatchResult(matchedText: string, startOffset: number, text: string): RegExpExecArray {
  const result = [matchedText] as RegExpExecArray;
  result.index = startOffset;
  result.input = text;
  return result;
}

// ---------------------------------------------------------------------------
// Script Entry Tokens — two modes:
//   1. ScriptFuncEntry: function definitions (script void foo() {...})
//      → push SCRIPT_FUNC_MODE
//   2. ScriptStmtEntry: statement blocks (script {...})
//      → push SCRIPT_MODE (fallback/default)
//
// Function definition pattern: script <Type> <Name> ( ... )
//   - <Type> can be: built-in type, modifier, OR any custom identifier
//   - <Name> is the function name (identifier)
//   - followed by '(' for parameter list
//
// Disambiguation strategy:
//   1. If next word is a known type keyword → function definition
//   2. If pattern matches `<identifier> <identifier> (` → function definition
//   3. Otherwise → statement block (fallback)
// ---------------------------------------------------------------------------

/** Built-in type keywords that indicate a function definition */
const FUNC_TYPE_INDICATORS = new Set([
  "void", "string", "int", "double", "char", "bool",
  "global", "static", "extern",
]);

/**
 * Checks if the pattern after `script` matches a function definition.
 * Pattern: <identifier> <identifier> (
 *
 * @param text - Full input text
 * @param afterScript - Offset right after "script" keyword
 * @returns true if the pattern matches a function signature
 */
function looksLikeFunctionSignature(text: string, afterScript: number): boolean {
  // Peek first word (type name or modifier)
  const first = peekNextWord(text, afterScript);
  if (!first) return false;

  // If first word is a known type keyword, it's a function definition
  if (FUNC_TYPE_INDICATORS.has(first.word)) {
    return true;
  }

  // For custom types, check if followed by <identifier> (
  // Pattern: <TypeIdentifier> <NameIdentifier> (
  const second = peekNextWord(text, first.endOffset);
  if (!second) return false;

  // Check if second word is followed by '(' (parameter list start)
  let j = second.endOffset;
  while (j < text.length && /[ \t\r\n]/.test(text[j])) j++;

  if (j < text.length && text[j] === '(') {
    return true; // Looks like: script <Type> <Name> (...)
  }

  return false;
}

/**
 * Matches `script` when followed by function signature pattern.
 * Must be placed BEFORE ScriptStmtEntry in the lexer token list.
 */
function matchScriptFuncEntry(
  text: string,
  startOffset: number
): RegExpExecArray | null {
  const remaining = text.substring(startOffset);
  // Use WSF suffix assertion to prevent matching "script-xxx"
  const m = /^script(?![A-Za-z0-9_\-\/])/.exec(remaining);
  if (!m) return null;

  const afterScript = startOffset + 6; // length of "script"

  if (looksLikeFunctionSignature(text, afterScript)) {
    return makeMatchResult(m[0], startOffset, text);
  }

  return null; // Let ScriptStmtEntry handle it
}

/**
 * Matches `script` as the default fallback for statement blocks.
 * Only matches if it does NOT look like a function definition.
 */
function matchScriptStmtEntry(
  text: string,
  startOffset: number
): RegExpExecArray | null {
  const remaining = text.substring(startOffset);
  // Use WSF suffix assertion to prevent matching "script-xxx"
  const m = /^script(?![A-Za-z0-9_\-\/])/.exec(remaining);
  if (!m) return null;

  const afterScript = startOffset + 6; // length of "script"

  // Only match if it does NOT look like a function signature
  if (looksLikeFunctionSignature(text, afterScript)) {
    return null; // Let ScriptFuncEntry handle it
  }

  // Default fallback: match standalone "script" keyword for statement blocks
  return makeMatchResult(m[0], startOffset, text);
}

/** Script function definition entry → SCRIPT_FUNC_MODE */
export const ScriptFuncEntry = createToken({
  name: "ScriptFuncEntry",
  pattern: matchScriptFuncEntry,
  push_mode: "SCRIPT_FUNC_MODE",
  line_breaks: false,
  categories: ScriptEntryCategory,
});

/** Script statement block entry → SCRIPT_MODE (default fallback) */
export const ScriptStmtEntry = createToken({
  name: "ScriptStmtEntry",
  pattern: matchScriptStmtEntry,
  push_mode: "SCRIPT_MODE",
  line_breaks: false,
  categories: ScriptEntryCategory,
});

// Legacy export for backward compatibility (will be removed)
export const ScriptBlockEntry = ScriptFuncEntry;

// ---------------------------------------------------------------------------
// Custom matcher for `execute` as a script entry keyword
//   Matches `execute` when followed by:
//     - `at_time` → `execute at_time <TimeValue> ... <ScriptBlock>* end_execute`
//     - `at_interval_of` → `execute at_interval_of <TimeValue> <ScriptBlock>* end_execute`
//     - direct script body → `execute <ScriptBlock>* end_execute` (behavior tree)
//   Does NOT match when followed by:
//     - `<string>` then `in` → WSF command reference `execute <name> in <proc>`
//     - `<string>` (just a name) → WSF command reference
// ---------------------------------------------------------------------------

/** Words that indicate `execute` starts a script block */
const EXECUTE_SCRIPT_FOLLOWERS = new Set([
  "at_time", "at_interval_of",
]);

function matchExecuteScriptEntry(
  text: string,
  startOffset: number
): RegExpExecArray | null {
  const remaining = text.substring(startOffset);
  const m = /^execute(?![A-Za-z0-9_\-\/])/.exec(remaining);
  if (!m) return null;

  const afterExecute = startOffset + 7; // length of "execute"
  const peek = peekNextWord(text, afterExecute);

  if (peek === null) {
    // execute at EOF — treat as script entry for error recovery
    return makeMatchResult(m[0], startOffset, text);
  }

  const nextWord = peek.word;

  // If followed by at_time or at_interval_of → definitely script entry
  if (EXECUTE_SCRIPT_FOLLOWERS.has(nextWord)) {
    return makeMatchResult(m[0], startOffset, text);
  }

  const SCRIPT_INDICATORS = new Set([
    "string", "int", "double", "char", "bool",
    "if", "while", "do", "for", "foreach", "return", "break", "continue",
    "global", "static", "extern",
    "true", "false", "null", "NULL",
  ]);

  if (SCRIPT_INDICATORS.has(nextWord)) {
    return makeMatchResult(m[0], startOffset, text);
  }

  // If next word is a known end_* keyword or top-level WSF keyword,
  // it's definitely NOT a script entry
  if (WSF_END_KEYWORDS.has(nextWord) || WSF_TOP_LEVEL_KEYWORDS.has(nextWord)) {
    return null;
  }

  // For ambiguous cases (next word is an identifier), check second word
  // `execute myName in processors` → WSF command (null)
  // `execute myVar = 5;` → script entry (match)
  let j = peek.endOffset;
  while (j < text.length && /[ \t]/.test(text[j])) j++;

  if (j < text.length) {
    const charAfter = text[j];
    // If followed by operator-like chars, it's likely script code
    if ("=+-*/<>!&|;({[".includes(charAfter)) {
      return makeMatchResult(m[0], startOffset, text);
    }

    // Check for `in` keyword → WSF command pattern
    const secondPeek = peekNextWord(text, j);
    if (secondPeek?.word === "in") {
      return null; // `execute <name> in ...` → WSF command
    }
  }

  // Default: treat as script entry for the behavior tree case
  return makeMatchResult(m[0], startOffset, text);
}

export const ExecuteScriptEntry = createToken({
  name: "ExecuteScriptEntry",
  pattern: matchExecuteScriptEntry,
  push_mode: "SCRIPT_MODE",
  line_breaks: false,
  categories: ScriptEntryCategory,
});

// When execute custom matcher returns null, it falls through to WsfIdentifier
// which captures `execute` as a regular WSF identifier token
