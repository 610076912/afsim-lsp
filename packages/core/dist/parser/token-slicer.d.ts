import { IToken } from "chevrotain";
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
export declare function sliceTokens(allTokens: IToken[]): SliceResult;
//# sourceMappingURL=token-slicer.d.ts.map