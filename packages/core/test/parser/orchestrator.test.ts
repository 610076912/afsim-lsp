import { describe, it, expect } from "vitest";
import { parseDocument } from "../../src/parser/orchestrator.js";

// ============================================================================
// Parse Orchestrator integration tests
// Full pipeline: lexer → slicer → WSF parser + Script parser
// ============================================================================

describe("Parse Orchestrator — parseDocument", () => {
  it("parses a WSF-only document with no script blocks", () => {
    const result = parseDocument(`
      platform_type MyType
        sensor MySensor WSF_SENSOR
          range 100.0
        end_sensor
      end_platform_type
    `);
    expect(result.lexErrors).toHaveLength(0);
    expect(result.wsfErrors).toHaveLength(0);
    expect(result.scriptEntries.size).toBe(0);
    expect(result.wsfCst.name).toBe("wsfFile");
  });

  it("parses a document with one script block (on_initialize)", () => {
    const result = parseDocument(`
      platform_type MyType
        processor myProc WSF_SCRIPT_PROCESSOR
          on_initialize
            int x = 42;
          end_on_initialize
        end_processor
      end_platform_type
    `);
    expect(result.lexErrors).toHaveLength(0);
    expect(result.wsfErrors).toHaveLength(0);
    expect(result.scriptEntries.size).toBe(1);

    const [entry] = result.scriptEntries.values();
    expect(entry.errors).toHaveLength(0);
    expect(entry.cst).not.toBeNull();
    expect(entry.cst!.name).toBe("scriptBody");
    expect(entry.slice.isFuncBlock).toBe(false);
    expect(entry.slice.injectedContextType).toBe("Processor");
  });

  it("parses a document with a script function block", () => {
    const result = parseDocument(`
      platform_type MyType
        processor myProc WSF_SCRIPT_PROCESSOR
          script
            void DoStuff() {
              int a = 1;
              return;
            }
          end_script
        end_processor
      end_platform_type
    `);
    expect(result.lexErrors).toHaveLength(0);
    expect(result.wsfErrors).toHaveLength(0);
    expect(result.scriptEntries.size).toBe(1);

    const [entry] = result.scriptEntries.values();
    expect(entry.errors).toHaveLength(0);
    expect(entry.cst!.name).toBe("scriptFuncDefs");
    expect(entry.slice.isFuncBlock).toBe(true);
  });

  it("parses a document with multiple script blocks", () => {
    const result = parseDocument(`
      platform_type MyType
        processor myProc WSF_SCRIPT_PROCESSOR
          script
            void Init() { return; }
          end_script
          on_initialize
            int x = 0;
          end_on_initialize
          on_update
            x = x + 1;
          end_on_update
        end_processor
      end_platform_type
    `);
    expect(result.lexErrors).toHaveLength(0);
    expect(result.wsfErrors).toHaveLength(0);
    expect(result.scriptEntries.size).toBe(3);

    const entries = [...result.scriptEntries.values()];
    // script...end_script → scriptFuncDefs
    expect(entries[0].cst!.name).toBe("scriptFuncDefs");
    expect(entries[0].slice.isFuncBlock).toBe(true);
    // on_initialize → scriptBody
    expect(entries[1].cst!.name).toBe("scriptBody");
    // on_update → scriptBody
    expect(entries[2].cst!.name).toBe("scriptBody");

    for (const e of entries) {
      expect(e.errors).toHaveLength(0);
    }
  });

  it("preserves entry token → ScriptCstEntry mapping", () => {
    const result = parseDocument(`
      platform_type MyType
        sensor mySensor WSF_SENSOR
          on_update
            double r = 100.0;
          end_on_update
        end_sensor
      end_platform_type
    `);
    expect(result.lexErrors).toHaveLength(0);
    expect(result.scriptEntries.size).toBe(1);

    const [entryToken, cstEntry] = [...result.scriptEntries.entries()][0];
    expect(entryToken.image).toMatch(/on_update/);
    expect(cstEntry.slice.entryToken).toBe(entryToken);
    expect(cstEntry.slice.injectedContextType).toBe("Sensor");
  });

  it("handles empty script body gracefully", () => {
    const result = parseDocument(`
      platform_type MyType
        processor myProc WSF_SCRIPT_PROCESSOR
          on_initialize
          end_on_initialize
        end_processor
      end_platform_type
    `);
    expect(result.lexErrors).toHaveLength(0);
    expect(result.wsfErrors).toHaveLength(0);
    expect(result.scriptEntries.size).toBe(1);

    const [entry] = result.scriptEntries.values();
    // Empty body → cst is null
    expect(entry.cst).toBeNull();
    expect(entry.errors).toHaveLength(0);
  });

  it("returns allTokens for position mapping", () => {
    const result = parseDocument(`
      platform_type Foo
      end_platform_type
    `);
    expect(result.allTokens.length).toBeGreaterThan(0);
    expect(result.allTokens[0].tokenType.name).toBe("PlatformType");
  });

  it("returns sliceResult for diagnostics", () => {
    const result = parseDocument(`
      platform_type MyType
        processor myProc WSF_SCRIPT_PROCESSOR
          on_update
            int y = 5;
          end_on_update
        end_processor
      end_platform_type
    `);
    expect(result.sliceResult.slices).toHaveLength(1);
    expect(result.sliceResult.wsfTokens.length).toBeGreaterThan(0);
  });

  it("handles complex script with control flow", () => {
    const result = parseDocument(`
      platform_type Tank
        processor ai WSF_SCRIPT_PROCESSOR
          script
            bool CheckTarget(WsfTrack t) {
              if (t.IsValid()) {
                return true;
              }
              return false;
            }
          end_script
          on_update
            foreach (WsfTrack track in GetTracks()) {
              if (CheckTarget(track)) {
                Engage(track);
                break;
              }
            }
          end_on_update
        end_processor
      end_platform_type
    `);
    expect(result.lexErrors).toHaveLength(0);
    expect(result.wsfErrors).toHaveLength(0);
    expect(result.scriptEntries.size).toBe(2);

    for (const entry of result.scriptEntries.values()) {
      expect(entry.errors).toHaveLength(0);
    }
  });

  it("handles nested WSF blocks with script inside", () => {
    const result = parseDocument(`
      platform_type Destroyer
        sensor radar WSF_SENSOR
          on_update
            double range = 150.0;
          end_on_update
        end_sensor
        comm link WSF_COMM
          on_initialize
            string name = "link1";
          end_on_initialize
        end_comm
      end_platform_type
    `);
    expect(result.lexErrors).toHaveLength(0);
    expect(result.wsfErrors).toHaveLength(0);
    expect(result.scriptEntries.size).toBe(2);

    const entries = [...result.scriptEntries.values()];
    expect(entries[0].slice.injectedContextType).toBe("Sensor");
    expect(entries[1].slice.injectedContextType).toBe("Comm");
  });
});
