export interface Position {
    /** 0-based line number */
    line: number;
    /** 0-based character offset within the line */
    character: number;
}
export interface Range {
    start: Position;
    end: Position;
}
export declare class PositionMapper {
    /** Offset where each line begins (sorted, first element is always 0) */
    private readonly lineStarts;
    constructor(text: string);
    /** Total number of lines in the document */
    get lineCount(): number;
    /** Convert an absolute offset to a Position (0-based line and character) */
    offsetToPosition(offset: number): Position;
    /** Convert a Position (0-based line and character) to an absolute offset */
    positionToOffset(pos: Position): number;
    /** Convert a Chevrotain token location to an LSP Range */
    tokenToRange(startOffset: number, endOffset: number): Range;
    /** Get the offset where a given line starts */
    lineStartOffset(line: number): number;
}
//# sourceMappingURL=position-mapper.d.ts.map