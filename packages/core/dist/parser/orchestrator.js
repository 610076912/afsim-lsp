import { createMultiModeLexer } from "../lexer/multi-mode-lexer.js";
import { sliceTokens } from "./token-slicer.js";
import { getWsfParser } from "./wsf-parser.js";
import { getScriptParser } from "./script-parser.js";
/**
 * Parse a full AFSIM document.
 *
 * @param text - The full document text
 * @returns Combined parse result with WSF and Script CSTs
 */
export function parseDocument(text) {
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
    const scriptEntries = new Map();
    for (const slice of sliceResult.slices) {
        let cst = null;
        let errors = [];
        if (slice.bodyTokens.length > 0) {
            scriptParser.input = slice.bodyTokens;
            if (slice.isFuncBlock) {
                cst = scriptParser.scriptFuncDefs();
            }
            else {
                cst = scriptParser.scriptBody();
            }
            errors = scriptParser.errors;
        }
        scriptEntries.set(slice.entryToken, { slice, cst, errors });
    }
    return {
        lexErrors: lexResult.errors,
        allTokens: lexResult.tokens,
        commentTokens: lexResult.groups["comments"] ?? [],
        wsfCst,
        wsfErrors,
        scriptEntries,
        sliceResult,
    };
}
//# sourceMappingURL=orchestrator.js.map