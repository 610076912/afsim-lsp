import { createToken } from "chevrotain";
import { IDENTIFIER_PATTERN } from "./shared-tokens.js";
import { WSF_END_KEYWORDS, WSF_TOP_LEVEL_KEYWORDS } from "./wsf-tokens.js";
function peekNextWord(text, afterOffset) {
    // Skip whitespace
    let i = afterOffset;
    const len = text.length;
    while (i < len && /[ \t\r\n]/.test(text[i])) {
        i++;
    }
    if (i >= len)
        return null;
    // Read identifier-like word
    const match = IDENTIFIER_PATTERN.exec(text.substring(i));
    if (match && match.index === 0) {
        return { word: match[0], endOffset: i + match[0].length };
    }
    return null;
}
// ---------------------------------------------------------------------------
// Custom matcher for `script` keyword as a script function block opener
//   Matches `script` only when it should push to SCRIPT_FUNC_MODE
//   i.e., `script` followed by script code (not part of another compound token)
// ---------------------------------------------------------------------------
function matchScriptBlockEntry(text, startOffset) {
    // Check for 'script' at word boundary
    const remaining = text.substring(startOffset);
    const m = /^script(?![A-Za-z0-9_])/.exec(remaining);
    if (!m)
        return null;
    // Peek at next word to disambiguate
    const afterScript = startOffset + 6; // length of "script"
    const nextWord = peekNextWord(text, afterScript);
    // If next word is a known identifier for `script <string>` pattern in WSF commands
    // (e.g., script_variables → handled by longer_alt, not this matcher)
    // But if we get here, `script_variables` would have been matched by its own token first
    // So here we check if it's a plain `script` block entry for function definitions
    // The pattern in wsf.ag: `script <ScriptFunctionBlock>* end_script`
    // vs WSF usage of `script <ScriptBlock>* end_script` which also pushes to script mode
    // Both cases should push to script mode, so we accept this match
    // However we need to check it's not part of a compound keyword that should
    // be handled differently (like end_script which starts with 'end_')
    // The lexer ordering handles that — end_script comes before this token
    const result = [m[0]];
    result.index = startOffset;
    result.input = text;
    return result;
}
export const ScriptBlockEntry = createToken({
    name: "ScriptBlockEntry",
    pattern: matchScriptBlockEntry,
    push_mode: "SCRIPT_FUNC_MODE",
    line_breaks: false,
});
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
function matchExecuteScriptEntry(text, startOffset) {
    const remaining = text.substring(startOffset);
    const m = /^execute(?![A-Za-z0-9_])/.exec(remaining);
    if (!m)
        return null;
    const afterExecute = startOffset + 7; // length of "execute"
    const peek = peekNextWord(text, afterExecute);
    if (peek === null) {
        // execute at EOF — treat as script entry for error recovery
        const result = [m[0]];
        result.index = startOffset;
        result.input = text;
        return result;
    }
    const nextWord = peek.word;
    // If followed by at_time or at_interval_of → definitely script entry
    if (EXECUTE_SCRIPT_FOLLOWERS.has(nextWord)) {
        const result = [m[0]];
        result.index = startOffset;
        result.input = text;
        return result;
    }
    const SCRIPT_INDICATORS = new Set([
        "string", "int", "double", "char", "bool",
        "if", "while", "do", "for", "foreach", "return", "break", "continue",
        "global", "static", "extern",
        "true", "false", "null", "NULL",
    ]);
    if (SCRIPT_INDICATORS.has(nextWord)) {
        const result = [m[0]];
        result.index = startOffset;
        result.input = text;
        return result;
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
    while (j < text.length && /[ \t]/.test(text[j]))
        j++;
    if (j < text.length) {
        const charAfter = text[j];
        // If followed by operator-like chars, it's likely script code
        if ("=+-*/<>!&|;({[".includes(charAfter)) {
            const result = [m[0]];
            result.index = startOffset;
            result.input = text;
            return result;
        }
        // Check for `in` keyword → WSF command pattern
        const secondPeek = peekNextWord(text, j);
        if (secondPeek?.word === "in") {
            return null; // `execute <name> in ...` → WSF command
        }
    }
    // Default: treat as script entry for the behavior tree case
    const result = [m[0]];
    result.index = startOffset;
    result.input = text;
    return result;
}
export const ExecuteScriptEntry = createToken({
    name: "ExecuteScriptEntry",
    pattern: matchExecuteScriptEntry,
    push_mode: "SCRIPT_MODE",
    line_breaks: false,
});
// When execute custom matcher returns null, it falls through to WsfIdentifier
// which captures `execute` as a regular WSF identifier token
// ---------------------------------------------------------------------------
// Heuristic Escape Matcher for SCRIPT_MODE
//
// Problem: If `end_on_initialize` (or any script-exit token) is missing,
// the lexer stays in SCRIPT_MODE and consumes the entire rest of the file.
//
// Solution: In SCRIPT_MODE, use a custom matcher that detects top-level
// WSF keywords that should NOT appear inside script code. When detected,
// emit a synthetic pop_mode token to escape back to WSF_MODE.
//
// This is registered as a low-priority token in SCRIPT_MODE.
// ---------------------------------------------------------------------------
function matchHeuristicEscape(text, startOffset) {
    // Only trigger at word boundary (start of line or after whitespace)
    if (startOffset > 0) {
        const prevChar = text[startOffset - 1];
        if (/[A-Za-z0-9_]/.test(prevChar)) {
            return null;
        }
    }
    const remaining = text.substring(startOffset);
    const m = IDENTIFIER_PATTERN.exec(remaining);
    if (!m || m.index !== 0)
        return null;
    const word = m[0];
    // Check if this word is a top-level WSF keyword or end_* keyword
    // that definitely shouldn't appear inside script code
    if (WSF_TOP_LEVEL_KEYWORDS.has(word) || WSF_END_KEYWORDS.has(word)) {
        // Don't consume the word — emit zero-length token to trigger pop_mode
        // Actually, Chevrotain doesn't support zero-length tokens well.
        // Instead, we let the normal script-exit tokens handle end_* keywords.
        // This heuristic escape only triggers for WSF block-open keywords.
        if (WSF_TOP_LEVEL_KEYWORDS.has(word)) {
            // Emit a zero-width escape token at this position
            // Chevrotain requires non-empty matches, so we use a special approach:
            // We don't match here; instead, the multi-mode-lexer will register
            // specific WSF keywords as pop_mode tokens in SCRIPT_MODE
            return null;
        }
    }
    return null;
}
// The heuristic escape is implemented differently:
// Instead of a custom matcher, we create specific tokens for known
// WSF keywords that appear in SCRIPT_MODE with pop_mode: true
// These act as escape hatches when end_* tokens are missing
export const ScriptHeuristicEscape = createToken({
    name: "ScriptHeuristicEscape",
    pattern: matchHeuristicEscapeNonEmpty,
    pop_mode: true,
    line_breaks: false,
});
/**
 * Non-empty heuristic escape: matches a top-level WSF keyword in script mode
 * and triggers pop_mode. The matched text will be re-lexed in WSF_MODE
 * because we consume it as a special token that the parser can recognize.
 *
 * This is a last-resort fallback — it should be placed after ALL other
 * tokens in SCRIPT_MODE so it only fires when nothing else matches.
 */
function matchHeuristicEscapeNonEmpty(text, startOffset) {
    // Must be at a word boundary
    if (startOffset > 0 && /[A-Za-z0-9_]/.test(text[startOffset - 1])) {
        return null;
    }
    // Check for newline before this position (heuristic: WSF keywords
    // typically appear at the start of a line, possibly with indentation)
    // Look backwards for newline, skipping spaces/tabs
    let k = startOffset - 1;
    while (k >= 0 && (text[k] === ' ' || text[k] === '\t')) {
        k--;
    }
    // k < 0 means start of file (OK), or text[k] should be \n or \r
    if (k >= 0 && text[k] !== '\n' && text[k] !== '\r') {
        return null; // Not at start of line
    }
    const remaining = text.substring(startOffset);
    const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(remaining);
    if (!m)
        return null;
    const word = m[0];
    // Only trigger for top-level WSF keywords (not end_* which have dedicated tokens)
    if (!WSF_TOP_LEVEL_KEYWORDS.has(word)) {
        return null;
    }
    // Check what follows the keyword: if followed by an operator or punctuation
    // character (., =, (, [, +, -, *, /, <, >, !, ;, {), this is likely
    // script code using the keyword as a variable name, not a stray WSF block.
    const afterWord = startOffset + word.length;
    let j = afterWord;
    while (j < text.length && (text[j] === ' ' || text[j] === '\t')) {
        j++;
    }
    if (j < text.length) {
        const ch = text[j];
        if (".=([+\\-*/<>!;{&|^".includes(ch)) {
            return null; // Looks like script code using this as an identifier
        }
    }
    const result = [word];
    result.index = startOffset;
    result.input = text;
    return result;
}
//# sourceMappingURL=custom-matchers.js.map