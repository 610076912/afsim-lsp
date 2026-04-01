import { createToken, TokenType, Lexer } from "chevrotain";

// ============================================================================
// Shared tokens used in both WSF_MODE and SCRIPT_MODE
// ============================================================================

// --- Whitespace ---
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t\r\n]+/,
  group: Lexer.SKIPPED,
  line_breaks: true,
});

// --- Comments ---
// Block comment with nesting support: /* ... /* ... */ ... */
// Uses custom matcher to handle nested comments
export const BlockComment = createToken({
  name: "BlockComment",
  pattern: matchNestedBlockComment,
  group: "comments",
  line_breaks: true,
});

function matchNestedBlockComment(
  text: string,
  startOffset: number
): RegExpExecArray | null {
  if (text[startOffset] !== "/" || text[startOffset + 1] !== "*") {
    return null;
  }

  let depth = 1;
  let i = startOffset + 2;
  const len = text.length;

  while (i < len && depth > 0) {
    if (text[i] === "/" && text[i + 1] === "*") {
      depth++;
      i += 2;
    } else if (text[i] === "*" && text[i + 1] === "/") {
      depth--;
      i += 2;
    } else {
      i++;
    }
  }

  if (depth !== 0) {
    // Unterminated block comment — still consume what we have for error recovery
    // (Chevrotain will report lexer error for subsequent tokens)
  }

  const matchedText = text.substring(startOffset, i);
  const result = [matchedText] as RegExpExecArray;
  result.index = startOffset;
  result.input = text;
  return result;
}

// Line comment: // to end of line
export const LineComment = createToken({
  name: "LineComment",
  pattern: /\/\/[^\n\r]*/,
  group: Lexer.SKIPPED,
});

// Hash comment: # to end of line
export const HashComment = createToken({
  name: "HashComment",
  pattern: /#[^\n\r]*/,
  group: Lexer.SKIPPED,
});

// --- Numeric Literals ---
// Real number must be defined before integer to get priority for "1.0" patterns
export const RealLiteral = createToken({
  name: "RealLiteral",
  pattern: /(?:\d+\.\d*|\.\d+)(?:[eE][+-]?\d+)?/,
});

export const IntegerLiteral = createToken({
  name: "IntegerLiteral",
  pattern: /\d+/,
});

// --- String Literals ---
export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(?:[^"\\]|\\.)*"/,
});

export const CharLiteral = createToken({
  name: "CharLiteral",
  pattern: /'(?:[^'\\]|\\.)?'/,
});

// --- Identifier pattern is NOT shared between WSF and Script modes ---
// - WSF identifiers use: /[a-zA-Z_][a-zA-Z0-9_\-\/\.]*/ (allows -, /, . for paths/versions)
//   → defined as WsfIdentifier in wsf-tokens.ts
// - Script identifiers use: /[a-zA-Z_][a-zA-Z0-9_]*/ (strict C-like)
//   → defined as ScriptIdentifier in script-tokens.ts

// Collect all shared tokens for convenient re-use
export const sharedTokens: TokenType[] = [
  BlockComment,
  LineComment,
  HashComment,
  WhiteSpace,
  RealLiteral,
  IntegerLiteral,
  StringLiteral,
  CharLiteral,
];
