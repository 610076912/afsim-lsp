import { ScriptBlockEntry, ExecuteScriptEntry } from "../lexer/custom-matchers.js";
import { EndOnInitialize, EndOnUpdate, EndOnEntry, EndOnExit, EndOnMessage, EndOnInit, EndOnTrackDrop, EndOnBingo, EndOnEmpty, EndOnRefuel, EndOnReserve, EndOnNewExecute, EndOnNewFail, EndPrecondition, EndNextState, EndScriptVariables, EndExecute, EndScript, } from "../lexer/script-tokens.js";
import { OnInitialize, OnUpdate, OnEntry, OnExit, OnMessage, OnInit, OnTrackDrop, OnBingo, OnEmpty, OnRefuel, OnReserve, OnNewExecute, OnNewFail, Precondition, NextState, ScriptVariables, } from "../lexer/wsf-tokens.js";
import { ScriptHeuristicEscape } from "../lexer/custom-matchers.js";
// ============================================================================
// Script entry/exit token sets
// ============================================================================
/** All token types that push to SCRIPT_MODE */
const SCRIPT_ENTRY_TOKENS = new Set([
    OnInitialize, OnUpdate, OnEntry, OnExit, OnMessage, OnInit,
    OnTrackDrop, OnBingo, OnEmpty, OnRefuel, OnReserve,
    OnNewExecute, OnNewFail, Precondition, NextState, ScriptVariables,
    ExecuteScriptEntry,
]);
/** All token types that push to SCRIPT_FUNC_MODE */
const SCRIPT_FUNC_ENTRY_TOKENS = new Set([
    ScriptBlockEntry,
]);
/** All token types that pop from script modes */
const SCRIPT_EXIT_TOKENS = new Set([
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
function inferContextType(tokens, entryIndex) {
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
export function sliceTokens(allTokens) {
    const slices = [];
    const wsfTokens = [];
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
            const bodyTokens = [];
            let exitToken = null;
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
                    }
                    else {
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
        }
        else {
            wsfTokens.push(token);
            i++;
        }
    }
    return { slices, wsfTokens };
}
//# sourceMappingURL=token-slicer.js.map