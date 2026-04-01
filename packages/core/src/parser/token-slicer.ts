import { IToken, TokenType } from "chevrotain";
import { ScriptBlockEntry, ExecuteScriptEntry } from "../lexer/custom-matchers.js";
import {
  EndOnInitialize, EndOnUpdate, EndOnEntry, EndOnExit, EndOnMessage,
  EndOnInit, EndOnTrackDrop, EndOnBingo, EndOnEmpty, EndOnRefuel,
  EndOnReserve, EndOnNewExecute, EndOnNewFail, EndPrecondition,
  EndNextState, EndScriptVariables, EndExecute, EndScript,
} from "../lexer/script-tokens.js";
import {
  OnInitialize, OnUpdate, OnEntry, OnExit, OnMessage, OnInit,
  OnTrackDrop, OnBingo, OnEmpty, OnRefuel, OnReserve,
  OnNewExecute, OnNewFail, Precondition, NextState, ScriptVariables,
} from "../lexer/wsf-tokens.js";
import { ScriptHeuristicEscape } from "../lexer/custom-matchers.js";

// ============================================================================
// Token Slice — a subsequence of tokens representing one script block
// ============================================================================

export interface TokenSlice {
  /** The script entry token (e.g., OnInitialize, ScriptBlockEntry) */
  entryToken: IToken;
  /** The script exit token (e.g., EndOnInitialize, EndScript) — may be null if missing */
  exitToken: IToken | null;
  /** The tokens between entry and exit (the script body) */
  bodyTokens: IToken[];
  /** Whether this is a function-definition block (script...end_script) */
  isFuncBlock: boolean;
  /** The WSF context identifier for injected context awareness */
  injectedContextType: string | null;
  /** Whether the block was terminated by heuristic escape (missing end_*) */
  escapedByHeuristic: boolean;
}

// ============================================================================
// Script entry/exit token sets
// ============================================================================

/** All token types that push to SCRIPT_MODE */
const SCRIPT_ENTRY_TOKENS: ReadonlySet<TokenType> = new Set([
  OnInitialize, OnUpdate, OnEntry, OnExit, OnMessage, OnInit,
  OnTrackDrop, OnBingo, OnEmpty, OnRefuel, OnReserve,
  OnNewExecute, OnNewFail, Precondition, NextState, ScriptVariables,
  ExecuteScriptEntry,
]);

/** All token types that push to SCRIPT_FUNC_MODE */
const SCRIPT_FUNC_ENTRY_TOKENS: ReadonlySet<TokenType> = new Set([
  ScriptBlockEntry,
]);

/** All token types that pop from script modes */
const SCRIPT_EXIT_TOKENS: ReadonlySet<TokenType> = new Set([
  EndOnInitialize, EndOnUpdate, EndOnEntry, EndOnExit, EndOnMessage,
  EndOnInit, EndOnTrackDrop, EndOnBingo, EndOnEmpty, EndOnRefuel,
  EndOnReserve, EndOnNewExecute, EndOnNewFail, EndPrecondition,
  EndNextState, EndScriptVariables, EndExecute, EndScript,
  ScriptHeuristicEscape,
]);

// ============================================================================
// Token Slicer — extracts script blocks from the token stream
// ============================================================================

/**
 * Determine the WSF context type from the parent block.
 * This is used for script auto-completion to know which
 * built-in variables/methods are available.
 */
function inferContextType(tokens: IToken[], entryIndex: number): string | null {
  // Walk backwards from the entry token to find the enclosing WSF block keyword
  for (let i = entryIndex - 1; i >= 0; i--) {
    const name = tokens[i].tokenType.name;
    // Look for major block keywords that define context
    if (name === "Processor" || name === "Sensor" || name === "Comm" ||
        name === "Mover" || name === "Platform" || name === "PlatformType" ||
        name === "Router" || name === "Network" || name === "Fuel" ||
        name === "Behavior" || name === "AdvancedBehavior" ||
        name === "State" || name === "Transmitter" || name === "Receiver") {
      return name;
    }
  }
  return null;
}

/**
 * Extracts all script token slices from a flat token array.
 * Also returns a placeholder map: entryToken → index in slices array.
 *
 * The slicer walks the token stream and:
 * 1. Detects script entry tokens (push_mode)
 * 2. Collects body tokens until the matching exit token (pop_mode)
 * 3. Handles heuristic escape (missing end_*)
 * 4. Returns slices and a "cleaned" WSF token stream with ScriptBodyPlaceholder
 */
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

export function sliceTokens(allTokens: IToken[]): SliceResult {
  const slices: TokenSlice[] = [];
  const wsfTokens: IToken[] = [];

  let i = 0;
  const len = allTokens.length;

  while (i < len) {
    const token = allTokens[i];
    const tokenType = token.tokenType;

    if (SCRIPT_ENTRY_TOKENS.has(tokenType) || SCRIPT_FUNC_ENTRY_TOKENS.has(tokenType)) {
      const isFuncBlock = SCRIPT_FUNC_ENTRY_TOKENS.has(tokenType);
      const entryToken = token;
      const contextType = inferContextType(allTokens, i);

      // Add entry token to WSF stream as placeholder
      wsfTokens.push(entryToken);

      // Collect body tokens
      const bodyTokens: IToken[] = [];
      let exitToken: IToken | null = null;
      let escapedByHeuristic = false;
      i++; // move past entry token

      while (i < len) {
        const current = allTokens[i];
        if (SCRIPT_EXIT_TOKENS.has(current.tokenType)) {
          if (current.tokenType === ScriptHeuristicEscape) {
            escapedByHeuristic = true;
            // Don't consume the heuristic escape token — it becomes a WSF token
            // The heuristic escape token text is a WSF keyword that should be re-processed
            exitToken = null;
          } else {
            exitToken = current;
            // Add exit token to WSF stream
            wsfTokens.push(exitToken);
            i++; // move past exit token
          }
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
        injectedContextType: contextType,
        escapedByHeuristic,
      });
    } else {
      wsfTokens.push(token);
      i++;
    }
  }

  return { slices, wsfTokens };
}
