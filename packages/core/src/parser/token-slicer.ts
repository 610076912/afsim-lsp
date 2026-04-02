import { IToken, TokenType, tokenMatcher } from "chevrotain";
import { ScriptFuncEntry, ScriptStmtEntry, ExecuteScriptEntry } from "../lexer/custom-matchers.js";
import {
  EndPrecondition, EndScriptVariables, EndExecute, EndScript,
} from "../lexer/script-tokens.js";
import {
  WsfBlockOpen, WsfBlockClose, ScriptEntryCategory,
  Precondition, ScriptVariables,
} from "../lexer/wsf-tokens.js";

// ============================================================================
// Token Slice — a subsequence of tokens representing one script block
// ============================================================================

export interface TokenSlice {
  /** The script entry token (e.g., OnInitialize, ScriptFuncEntry, ScriptStmtEntry) */
  entryToken: IToken;
  /** The script exit token (e.g., EndOnInitialize, EndScript) — may be null if missing */
  exitToken: IToken | null;
  /** The tokens between entry and exit (the script body) */
  bodyTokens: IToken[];
  /** Whether this is a function-definition block (script...end_script) */
  isFuncBlock: boolean;
  /** WSF context tag from the enclosing block's TokenType.name (e.g., "Platform", "Sensor") */
  contextTag: string | null;
}

// ============================================================================
// Script entry/exit token sets
// ============================================================================

/** All token types that push to SCRIPT_MODE (pure script blocks only) */
const SCRIPT_STMT_ENTRY_TOKENS: ReadonlySet<TokenType> = new Set([
  Precondition, ScriptVariables,
  ExecuteScriptEntry,
  ScriptStmtEntry,  // Statement block form of `script`
]);

/** All token types that push to SCRIPT_FUNC_MODE (function definitions) */
const SCRIPT_FUNC_ENTRY_TOKENS: ReadonlySet<TokenType> = new Set([
  ScriptFuncEntry,  // Function definition form of `script`
]);

/** All token types that pop from script modes (pure script only) */
const SCRIPT_EXIT_TOKENS: ReadonlySet<TokenType> = new Set([
  EndPrecondition, EndScriptVariables, EndExecute, EndScript,
]);

// ============================================================================
// Token Slicer — extracts script blocks from the token stream
// Uses a context stack for precise parent context tracking
// ============================================================================

export interface SliceResult {
  /** All extracted script slices */
  slices: TokenSlice[];
  /**
   * WSF tokens with script bodies replaced by their entry tokens.
   * Body tokens between entry and exit are removed.
   * The entry token remains as a "placeholder" for the parser.
   */
  wsfTokens: IToken[];
}

/**
 * Extracts all script token slices from a flat token array.
 * 
 * Key feature: Uses a context stack to precisely track the enclosing
 * WSF block context. When a script entry token is encountered, the
 * stack top contains the exact parent context (e.g., "Platform", "Sensor").
 * 
 * This avoids the pitfalls of backward iteration on a flat token array,
 * which cannot correctly handle nested structures.
 */
export function sliceTokens(allTokens: IToken[]): SliceResult {
  const slices: TokenSlice[] = [];
  const wsfTokens: IToken[] = [];
  const contextStack: string[] = []; // Stack of TokenType.name strings

  let i = 0;
  const len = allTokens.length;

  while (i < len) {
    const token = allTokens[i];
    const tokenType = token.tokenType;

    // 1. Maintain context stack (must be done before script entry handling)
    if (tokenMatcher(token, WsfBlockOpen)) {
      contextStack.push(tokenType.name);
      wsfTokens.push(token);
      i++;
      continue;
    }

    if (tokenMatcher(token, WsfBlockClose)) {
      contextStack.pop();
      wsfTokens.push(token);
      i++;
      continue;
    }

    // 2. Handle script entry tokens
    if (tokenMatcher(token, ScriptEntryCategory)) {
      const entryToken = token;
      const isFuncBlock = SCRIPT_FUNC_ENTRY_TOKENS.has(tokenType);
      
      // Stack top is the exact parent context
      const currentContext = contextStack.length > 0 
        ? contextStack[contextStack.length - 1] 
        : null;

      // Add entry token to WSF stream as placeholder
      wsfTokens.push(entryToken);
      i++;

      // Collect body tokens until exit token
      const bodyTokens: IToken[] = [];
      let exitToken: IToken | null = null;

      while (i < len) {
        const current = allTokens[i];
        if (SCRIPT_EXIT_TOKENS.has(current.tokenType)) {
          exitToken = current;
          // Add exit token to WSF stream
          wsfTokens.push(exitToken);
          i++;
          break;
        }
        bodyTokens.push(current);
        i++;
      }

      slices.push({
        entryToken,
        exitToken,
        bodyTokens,
        isFuncBlock,
        contextTag: currentContext,
      });
      continue;
    }

    // 3. Regular token — just add to WSF stream
    wsfTokens.push(token);
    i++;
  }

  return { slices, wsfTokens };
}
