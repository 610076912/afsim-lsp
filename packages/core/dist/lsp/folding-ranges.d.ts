import { DocumentState } from "./document-state.js";
export declare enum FoldingRangeKind {
    Comment = "comment",
    Imports = "imports",
    Region = "region"
}
export interface FoldingRange {
    startLine: number;
    endLine: number;
    kind?: FoldingRangeKind;
}
export declare function computeFoldingRanges(state: DocumentState): FoldingRange[];
//# sourceMappingURL=folding-ranges.d.ts.map