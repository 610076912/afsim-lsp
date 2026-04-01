import { IToken, CstNode, ILexingError, IRecognitionException } from "chevrotain";
import { createMultiModeLexer } from "../lexer/multi-mode-lexer.js";
import { sliceTokens, TokenSlice, SliceResult } from "./token-slicer.js";
import { getWsfParser } from "./wsf-parser.js";
import { getScriptParser } from "./script-parser.js";

// ============================================================================
// Parse Orchestrator — coordinates lexer → slicer → WSF parser + Script parser
//
// Flow:
// 1. Lex the full document with the multi-mode lexer
// 2. Slice the token stream into WSF tokens + script body slices
// 3. Parse WSF tokens with WsfParser
// 4. Parse each script slice with ScriptParser (using appropriate entry point)
// 5. Return combined result with cross-references
// ============================================================================

/** Result of parsing a single script slice */
export interface ScriptCstEntry {
  /** The original token slice metadata */
  slice: TokenSlice;
  /** The parsed CST for this script block (null if bodyTokens was empty) */
  cst: CstNode | null;
  /** Any parsing errors for this script block */
  errors: IRecognitionException[];
}

/** Full result of parsing a document */
export interface ParseResult {
  /** Lexing errors from the multi-mode lexer */
  lexErrors: ILexingError[];
  /** All tokens produced by the lexer (before slicing) */
  allTokens: IToken[];
  /** Comment tokens (block comments captured in named group) */
  commentTokens: IToken[];
  /** The WSF CST */
  wsfCst: CstNode;
  /** WSF parsing errors */
  wsfErrors: IRecognitionException[];
  /** Map from entry token to its parsed script block */
  scriptEntries: Map<IToken, ScriptCstEntry>;
  /** The token slice result (for diagnostics/inspection) */
  sliceResult: SliceResult;
}

/**
 * Parse a full AFSIM document.
 *
 * @param text - The full document text
 * @returns Combined parse result with WSF and Script CSTs
 */
export function parseDocument(text: string): ParseResult {
  // Step 1: Lex
  const lexer = createMultiModeLexer();
  const lexResult = lexer.tokenize(text);

  // Step 2: Slice
  const sliceResult = sliceTokens(lexResult.tokens);

  // Step 3: Parse WSF
  const wsfParser = getWsfParser();
  wsfParser.input = sliceResult.wsfTokens;
  const wsfCst = wsfParser.wsfFile();
  const wsfErrors = wsfParser.errors;

  // Step 4: Parse each script slice
  const scriptParser = getScriptParser();
  const scriptEntries = new Map<IToken, ScriptCstEntry>();

  for (const slice of sliceResult.slices) {
    let cst: CstNode | null = null;
    let errors: IRecognitionException[] = [];

    if (slice.bodyTokens.length > 0) {
      scriptParser.input = slice.bodyTokens;

      if (slice.isFuncBlock) {
        cst = scriptParser.scriptFuncDefs();
      } else {
        cst = scriptParser.scriptBody();
      }
      errors = scriptParser.errors;
    }

    scriptEntries.set(slice.entryToken, { slice, cst, errors });
  }

  return {
    lexErrors: lexResult.errors,
    allTokens: lexResult.tokens,
    commentTokens: (lexResult.groups["comments"] as IToken[] | undefined) ?? [],
    wsfCst,
    wsfErrors,
    scriptEntries,
    sliceResult,
  };
}
