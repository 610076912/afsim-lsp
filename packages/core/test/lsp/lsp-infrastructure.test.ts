import { describe, it, expect } from "vitest";
import { PositionMapper } from "../../src/lsp/position-mapper.js";
import { DocumentStateManager } from "../../src/lsp/document-state.js";

// ============================================================================
// PositionMapper tests
// ============================================================================

describe("PositionMapper", () => {
  it("handles single-line text", () => {
    const mapper = new PositionMapper("hello");
    expect(mapper.lineCount).toBe(1);
    expect(mapper.offsetToPosition(0)).toEqual({ line: 0, character: 0 });
    expect(mapper.offsetToPosition(3)).toEqual({ line: 0, character: 3 });
    expect(mapper.positionToOffset({ line: 0, character: 0 })).toBe(0);
    expect(mapper.positionToOffset({ line: 0, character: 3 })).toBe(3);
  });

  it("handles multi-line text", () => {
    const text = "line0\nline1\nline2";
    const mapper = new PositionMapper(text);
    expect(mapper.lineCount).toBe(3);

    // Start of each line
    expect(mapper.offsetToPosition(0)).toEqual({ line: 0, character: 0 });
    expect(mapper.offsetToPosition(6)).toEqual({ line: 1, character: 0 });
    expect(mapper.offsetToPosition(12)).toEqual({ line: 2, character: 0 });

    // Middle of lines
    expect(mapper.offsetToPosition(3)).toEqual({ line: 0, character: 3 });
    expect(mapper.offsetToPosition(9)).toEqual({ line: 1, character: 3 });

    // Position to offset
    expect(mapper.positionToOffset({ line: 1, character: 0 })).toBe(6);
    expect(mapper.positionToOffset({ line: 2, character: 4 })).toBe(16);
  });

  it("handles empty text", () => {
    const mapper = new PositionMapper("");
    expect(mapper.lineCount).toBe(1);
    expect(mapper.offsetToPosition(0)).toEqual({ line: 0, character: 0 });
  });

  it("handles trailing newline", () => {
    const mapper = new PositionMapper("abc\n");
    expect(mapper.lineCount).toBe(2);
    expect(mapper.offsetToPosition(4)).toEqual({ line: 1, character: 0 });
  });

  it("converts Chevrotain token range to LSP range", () => {
    const text = "first\nsecond\nthird";
    const mapper = new PositionMapper(text);
    // "second" starts at offset 6, ends at offset 11 (inclusive)
    const range = mapper.tokenToRange(6, 11);
    expect(range.start).toEqual({ line: 1, character: 0 });
    expect(range.end).toEqual({ line: 1, character: 6 }); // endOffset+1 for exclusive
  });

  it("returns -1 for invalid position", () => {
    const mapper = new PositionMapper("line");
    expect(mapper.positionToOffset({ line: -1, character: 0 })).toBe(-1);
    expect(mapper.positionToOffset({ line: 5, character: 0 })).toBe(-1);
  });

  it("returns line start offset correctly", () => {
    const mapper = new PositionMapper("aa\nbb\ncc");
    expect(mapper.lineStartOffset(0)).toBe(0);
    expect(mapper.lineStartOffset(1)).toBe(3);
    expect(mapper.lineStartOffset(2)).toBe(6);
    expect(mapper.lineStartOffset(3)).toBe(-1);
  });
});

// ============================================================================
// DocumentStateManager tests
// ============================================================================

describe("DocumentStateManager", () => {
  it("opens a document and returns parsed state", () => {
    const manager = new DocumentStateManager();
    const state = manager.openDocument("file:///test.wsf", `
      platform_type Foo
      end_platform_type
    `, 1);

    expect(state.uri).toBe("file:///test.wsf");
    expect(state.version).toBe(1);
    expect(state.parseResult.lexErrors).toHaveLength(0);
    expect(state.parseResult.wsfErrors).toHaveLength(0);
    expect(state.positionMapper.lineCount).toBeGreaterThan(1);
  });

  it("retrieves an open document", () => {
    const manager = new DocumentStateManager();
    manager.openDocument("file:///a.wsf", "platform_type X\nend_platform_type", 1);
    const doc = manager.getDocument("file:///a.wsf");
    expect(doc).not.toBeNull();
    expect(doc!.uri).toBe("file:///a.wsf");
  });

  it("returns null for unknown documents", () => {
    const manager = new DocumentStateManager();
    expect(manager.getDocument("file:///unknown.wsf")).toBeNull();
  });

  it("updates a document and re-parses", () => {
    const manager = new DocumentStateManager();
    manager.openDocument("file:///test.wsf", "platform_type A\nend_platform_type", 1);
    const updated = manager.updateDocument("file:///test.wsf",
      "platform_type B\nend_platform_type", 2);

    expect(updated.version).toBe(2);
    expect(updated.parseResult.wsfErrors).toHaveLength(0);
  });

  it("closes a document", () => {
    const manager = new DocumentStateManager();
    manager.openDocument("file:///test.wsf", "", 1);
    expect(manager.getDocument("file:///test.wsf")).not.toBeNull();
    manager.closeDocument("file:///test.wsf");
    expect(manager.getDocument("file:///test.wsf")).toBeNull();
  });

  it("lists open documents", () => {
    const manager = new DocumentStateManager();
    manager.openDocument("file:///a.wsf", "", 1);
    manager.openDocument("file:///b.wsf", "", 1);
    const docs = manager.getOpenDocuments();
    expect(docs).toContain("file:///a.wsf");
    expect(docs).toContain("file:///b.wsf");
    expect(docs).toHaveLength(2);
  });

  it("parses document with script blocks correctly", () => {
    const manager = new DocumentStateManager();
    const state = manager.openDocument("file:///s.wsf", `
      platform_type Tank
        processor ai WSF_SCRIPT_PROCESSOR
          on_initialize
            int x = 0;
          end_on_initialize
        end_processor
      end_platform_type
    `, 1);

    expect(state.parseResult.scriptEntries.size).toBe(1);
    const entry = [...state.parseResult.scriptEntries.values()][0];
    expect(entry.errors).toHaveLength(0);
    expect(entry.slice.contextTag).toBe("Processor");
  });
});
