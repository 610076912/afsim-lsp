import { IToken } from "chevrotain";
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
export declare function sliceTokens(allTokens: IToken[]): SliceResult;
//# sourceMappingURL=token-slicer.d.ts.map