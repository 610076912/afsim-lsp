// ============================================================================
// PositionMapper — bidirectional offset ↔ line:col mapping
//
// Precomputes line start offsets for O(log n) lookup.
// Uses 0-based line and 0-based column (LSP convention).
// ============================================================================

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

export class PositionMapper {
  /** Offset where each line begins (sorted, first element is always 0) */
  private readonly lineStarts: number[];

  constructor(text: string) {
    this.lineStarts = [0];
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\n') {
        this.lineStarts.push(i + 1);
      }
    }
  }

  /** Total number of lines in the document */
  get lineCount(): number {
    return this.lineStarts.length;
  }

  /** Convert an absolute offset to a Position (0-based line and character) */
  offsetToPosition(offset: number): Position {
    // Binary search for the line containing this offset
    let lo = 0;
    let hi = this.lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (this.lineStarts[mid] <= offset) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    return {
      line: lo,
      character: offset - this.lineStarts[lo],
    };
  }

  /** Convert a Position (0-based line and character) to an absolute offset */
  positionToOffset(pos: Position): number {
    if (pos.line < 0 || pos.line >= this.lineStarts.length) {
      return -1;
    }
    return this.lineStarts[pos.line] + pos.character;
  }

  /** Convert a Chevrotain token location to an LSP Range */
  tokenToRange(startOffset: number, endOffset: number): Range {
    return {
      start: this.offsetToPosition(startOffset),
      end: this.offsetToPosition(endOffset + 1), // Chevrotain endOffset is inclusive
    };
  }

  /** Get the offset where a given line starts */
  lineStartOffset(line: number): number {
    if (line < 0 || line >= this.lineStarts.length) return -1;
    return this.lineStarts[line];
  }
}
