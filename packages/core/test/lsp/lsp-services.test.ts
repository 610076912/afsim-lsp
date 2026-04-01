import { describe, it, expect } from "vitest";
import { DocumentStateManager } from "../../src/lsp/document-state.js";
import { computeDiagnostics, DiagnosticSeverity } from "../../src/lsp/diagnostics.js";
import { computeDocumentSymbols, SymbolKind } from "../../src/lsp/document-symbols.js";
import { computeFoldingRanges, FoldingRangeKind } from "../../src/lsp/folding-ranges.js";

const manager = new DocumentStateManager();

function openDoc(text: string) {
  return manager.openDocument("file:///test.wsf", text, 1);
}

// ============================================================================
// Diagnostics tests
// ============================================================================

describe("Diagnostics Service", () => {
  it("returns no diagnostics for valid document", () => {
    const state = openDoc(`
      platform_type MyType
        sensor mySensor WSF_SENSOR
          range 100.0
        end_sensor
      end_platform_type
    `);
    const diags = computeDiagnostics(state);
    expect(diags).toHaveLength(0);
  });

  it("returns no diagnostics for valid document with script", () => {
    const state = openDoc(`
      platform_type MyType
        processor myProc WSF_SCRIPT_PROCESSOR
          on_initialize
            int x = 42;
          end_on_initialize
        end_processor
      end_platform_type
    `);
    const diags = computeDiagnostics(state);
    expect(diags).toHaveLength(0);
  });

  it("returns diagnostics for WSF parse errors", () => {
    // Missing end_platform_type
    const state = openDoc(`
      platform_type MyType
        sensor mySensor WSF_SENSOR
        end_sensor
    `);
    const diags = computeDiagnostics(state);
    expect(diags.length).toBeGreaterThan(0);
    // Should have at least one error-level diagnostic
    expect(diags.some(d => d.severity === DiagnosticSeverity.Error)).toBe(true);
  });

  it("diagnostics have correct source field", () => {
    const state = openDoc(`
      platform_type MyType
        sensor mySensor WSF_SENSOR
        end_sensor
    `);
    const diags = computeDiagnostics(state);
    // All should have afsim-related source
    for (const d of diags) {
      expect(d.source).toMatch(/^afsim/);
    }
  });

  it("diagnostics have valid ranges", () => {
    const state = openDoc(`
      platform_type MyType
        sensor mySensor WSF_SENSOR
        end_sensor
    `);
    const diags = computeDiagnostics(state);
    for (const d of diags) {
      expect(d.range.start.line).toBeGreaterThanOrEqual(0);
      expect(d.range.start.character).toBeGreaterThanOrEqual(0);
      expect(d.range.end.line).toBeGreaterThanOrEqual(d.range.start.line);
    }
  });
});

// ============================================================================
// Document Symbols tests
// ============================================================================

describe("Document Symbols Service", () => {
  it("returns symbols for platform_type block", () => {
    const state = openDoc(`
      platform_type Tank
        sensor radar WSF_SENSOR
          range 100.0
        end_sensor
      end_platform_type
    `);
    const symbols = computeDocumentSymbols(state);
    expect(symbols.length).toBeGreaterThanOrEqual(1);
    const ptSymbol = symbols.find(s => s.name.includes("Tank"));
    expect(ptSymbol).toBeDefined();
    expect(ptSymbol!.kind).toBe(SymbolKind.Class);
  });

  it("returns nested symbols for components", () => {
    const state = openDoc(`
      platform_type Ship
        sensor sonar WSF_SENSOR
          range 200.0
        end_sensor
        processor ai WSF_SCRIPT_PROCESSOR
          on_initialize
            int x = 0;
          end_on_initialize
        end_processor
      end_platform_type
    `);
    const symbols = computeDocumentSymbols(state);
    expect(symbols.length).toBeGreaterThanOrEqual(1);
    const ship = symbols.find(s => s.name.includes("Ship"));
    expect(ship).toBeDefined();
    expect(ship!.children).toBeDefined();
    expect(ship!.children!.length).toBeGreaterThanOrEqual(2);
  });

  it("returns symbols for script function definitions", () => {
    const state = openDoc(`
      platform_type Jet
        processor ai WSF_SCRIPT_PROCESSOR
          script
            void DoStuff() { return; }
            int Calculate(int a) { return a + 1; }
          end_script
        end_processor
      end_platform_type
    `);
    const symbols = computeDocumentSymbols(state);
    // Find the script block symbol
    const jet = symbols.find(s => s.name.includes("Jet"));
    expect(jet).toBeDefined();

    // Search recursively for function symbols
    function findFunctions(syms: typeof symbols): typeof symbols {
      const result: typeof symbols = [];
      for (const s of syms) {
        if (s.kind === SymbolKind.Function) result.push(s);
        if (s.children) result.push(...findFunctions(s.children));
      }
      return result;
    }
    const funcs = findFunctions(symbols);
    expect(funcs.length).toBeGreaterThanOrEqual(2);
    expect(funcs.some(f => f.name === "DoStuff")).toBe(true);
    expect(funcs.some(f => f.name === "Calculate")).toBe(true);
  });

  it("returns script entry block symbols", () => {
    const state = openDoc(`
      platform_type X
        processor p WSF_SCRIPT_PROCESSOR
          on_update
            int x = 1;
          end_on_update
        end_processor
      end_platform_type
    `);
    const symbols = computeDocumentSymbols(state);
    function findMethods(syms: typeof symbols): typeof symbols {
      const result: typeof symbols = [];
      for (const s of syms) {
        if (s.kind === SymbolKind.Method) result.push(s);
        if (s.children) result.push(...findMethods(s.children));
      }
      return result;
    }
    const methods = findMethods(symbols);
    expect(methods.length).toBeGreaterThanOrEqual(1);
    expect(methods.some(m => m.name === "on_update")).toBe(true);
  });

  it("returns empty array for empty document", () => {
    const state = openDoc("");
    const symbols = computeDocumentSymbols(state);
    expect(symbols).toHaveLength(0);
  });
});

// ============================================================================
// Folding Ranges tests
// ============================================================================

describe("Folding Ranges Service", () => {
  it("returns folding range for platform_type block", () => {
    const state = openDoc(
`platform_type MyType
  sensor s WSF_SENSOR
    range 100
  end_sensor
end_platform_type`
    );
    const ranges = computeFoldingRanges(state);
    expect(ranges.length).toBeGreaterThanOrEqual(1);
    // platform_type spans line 0 to line 4
    const ptFold = ranges.find(r => r.startLine === 0);
    expect(ptFold).toBeDefined();
    expect(ptFold!.endLine).toBe(4);
    expect(ptFold!.kind).toBe(FoldingRangeKind.Region);
  });

  it("returns folding range for script block", () => {
    const state = openDoc(
`platform_type X
  processor p WSF_SCRIPT_PROCESSOR
    on_initialize
      int x = 0;
    end_on_initialize
  end_processor
end_platform_type`
    );
    const ranges = computeFoldingRanges(state);
    // Should have folds for: platform_type, processor, on_initialize
    expect(ranges.length).toBeGreaterThanOrEqual(2);
    // on_initialize fold: line 2 to line 4
    const scriptFold = ranges.find(r => r.startLine === 2);
    expect(scriptFold).toBeDefined();
    expect(scriptFold!.endLine).toBe(4);
  });

  it("returns folding range for block comments", () => {
    const state = openDoc(
`/* This is a
   multi-line
   comment */
platform_type X
end_platform_type`
    );
    const ranges = computeFoldingRanges(state);
    const commentFold = ranges.find(r => r.kind === FoldingRangeKind.Comment);
    expect(commentFold).toBeDefined();
    expect(commentFold!.startLine).toBe(0);
    expect(commentFold!.endLine).toBe(2);
  });

  it("returns no folds for single-line blocks", () => {
    const state = openDoc("platform_type X\nend_platform_type");
    const ranges = computeFoldingRanges(state);
    // platform_type on line 0, end on line 1 → fold exists
    expect(ranges.length).toBeGreaterThanOrEqual(1);
  });

  it("returns empty array for empty document", () => {
    const state = openDoc("");
    const ranges = computeFoldingRanges(state);
    expect(ranges).toHaveLength(0);
  });
});
