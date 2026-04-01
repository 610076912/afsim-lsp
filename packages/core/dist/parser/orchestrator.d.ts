import { IToken, CstNode, ILexingError, IRecognitionException } from "chevrotain";
import { TokenSlice, SliceResult } from "./token-slicer.js";
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
export declare function parseDocument(text: string): ParseResult;
//# sourceMappingURL=orchestrator.d.ts.map