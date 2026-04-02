import { tokenMatcher } from "chevrotain";
import { ScriptFuncEntry, ScriptStmtEntry, ExecuteScriptEntry } from "../lexer/custom-matchers.js";
import { EndPrecondition, EndScriptVariables, EndExecute, EndScript, } from "../lexer/script-tokens.js";
import { WsfBlockOpen, WsfBlockClose, ScriptEntryCategory, Precondition, ScriptVariables, } from "../lexer/wsf-tokens.js";
// ============================================================================
// Script entry/exit token sets
// ============================================================================
/** All token types that push to SCRIPT_MODE (pure script blocks only) */
const SCRIPT_STMT_ENTRY_TOKENS = new Set([
    Precondition, ScriptVariables,
    ExecuteScriptEntry,
    ScriptStmtEntry, // Statement block form of `script`
]);
/** All token types that push to SCRIPT_FUNC_MODE (function definitions) */
const SCRIPT_FUNC_ENTRY_TOKENS = new Set([
    ScriptFuncEntry, // Function definition form of `script`
]);
/** All token types that pop from script modes (pure script only) */
const SCRIPT_EXIT_TOKENS = new Set([
    EndPrecondition, EndScriptVariables, EndExecute, EndScript,
]);
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
export function sliceTokens(allTokens) {
    const slices = [];
    const wsfTokens = [];
    const contextStack = []; // Stack of TokenType.name strings
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
            const bodyTokens = [];
            let exitToken = null;
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
//# sourceMappingURL=token-slicer.js.map