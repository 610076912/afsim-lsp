// ============================================================================
// PositionMapper — bidirectional offset ↔ line:col mapping
//
// Precomputes line start offsets for O(log n) lookup.
// Uses 0-based line and 0-based column (LSP convention).
// ============================================================================
export class PositionMapper {
    /** Offset where each line begins (sorted, first element is always 0) */
    lineStarts;
    constructor(text) {
        this.lineStarts = [0];
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                this.lineStarts.push(i + 1);
            }
        }
    }
    /** Total number of lines in the document */
    get lineCount() {
        return this.lineStarts.length;
    }
    /** Convert an absolute offset to a Position (0-based line and character) */
    offsetToPosition(offset) {
        // Binary search for the line containing this offset
        let lo = 0;
        let hi = this.lineStarts.length - 1;
        while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (this.lineStarts[mid] <= offset) {
                lo = mid;
            }
            else {
                hi = mid - 1;
            }
        }
        return {
            line: lo,
            character: offset - this.lineStarts[lo],
        };
    }
    /** Convert a Position (0-based line and character) to an absolute offset */
    positionToOffset(pos) {
        if (pos.line < 0 || pos.line >= this.lineStarts.length) {
            return -1;
        }
        return this.lineStarts[pos.line] + pos.character;
    }
    /** Convert a Chevrotain token location to an LSP Range */
    tokenToRange(startOffset, endOffset) {
        return {
            start: this.offsetToPosition(startOffset),
            end: this.offsetToPosition(endOffset + 1), // Chevrotain endOffset is inclusive
        };
    }
    /** Get the offset where a given line starts */
    lineStartOffset(line) {
        if (line < 0 || line >= this.lineStarts.length)
            return -1;
        return this.lineStarts[line];
    }
}
//# sourceMappingURL=position-mapper.js.map