import { describe, it, expect } from "vitest";

// Data layer imports
import {
  getWsfKeywordsForContext,
  WSF_TOP_LEVEL_BLOCK_KEYWORDS,
  SCRIPT_ENTRY_KEYWORDS,
  WSF_BOOLEAN_KEYWORDS,
} from "../../src/data/wsf-keywords.js";
import {
  UNIT_CATEGORIES,
  ALL_UNIT_STRINGS,
  getAllUnitStrings,
  isValidUnit,
} from "../../src/data/unit-definitions.js";
import {
  getTypesForComponent,
  WSF_SENSOR_TYPES,
  WSF_PROCESSOR_TYPES,
  WSF_MOVER_TYPES,
} from "../../src/data/wsf-structs.js";
import {
  BUILTIN_FUNCTIONS,
  SYSTEM_VARIABLES,
  ALL_SCRIPT_CLASSES,
  SCRIPT_CLASS_DEFINITIONS,
  getScriptClass,
  getMethodsForClass,
  getSystemVariablesForContext,
} from "../../src/data/script-builtins.js";

// Completion service imports
import { DocumentStateManager } from "../../src/lsp/document-state.js";
import { computeCompletions, CompletionItemKind } from "../../src/lsp/completions.js";
import type { CompletionItem } from "../../src/lsp/completions.js";

const manager = new DocumentStateManager();
function openDoc(text: string) {
  return manager.openDocument("file:///test.wsf", text, 1);
}

// ============================================================================
// Data Layer — WSF Keywords
// ============================================================================

describe("WSF Keywords Data", () => {
  it("top-level keywords include platform_type and sensor", () => {
    const labels = WSF_TOP_LEVEL_BLOCK_KEYWORDS.map(k => k.keyword);
    expect(labels).toContain("platform_type");
    expect(labels).toContain("sensor");
    expect(labels).toContain("route");
    expect(labels).toContain("zone");
  });

  it("getWsfKeywordsForContext returns root keywords for root", () => {
    const keywords = getWsfKeywordsForContext("root");
    const labels = keywords.map(k => k.keyword);
    expect(labels).toContain("platform_type");
    expect(labels).toContain("include");
  });

  it("getWsfKeywordsForContext returns sensor commands for sensor context", () => {
    const keywords = getWsfKeywordsForContext("sensor");
    const labels = keywords.map(k => k.keyword);
    expect(labels).toContain("mode");
    expect(labels).toContain("field_of_view");
    expect(labels).not.toContain("platform_type"); // not a sensor command
  });

  it("platform_type context includes sensor, processor, comm", () => {
    const keywords = getWsfKeywordsForContext("platform_type");
    const labels = keywords.map(k => k.keyword);
    expect(labels).toContain("sensor");
    expect(labels).toContain("processor");
    expect(labels).toContain("comm");
    expect(labels).toContain("mover");
  });

  it("script entry keywords have end keywords", () => {
    for (const entry of SCRIPT_ENTRY_KEYWORDS) {
      expect(entry.endKeyword).toBeDefined();
    }
  });

  it("boolean keywords include true, false, yes, no", () => {
    expect(WSF_BOOLEAN_KEYWORDS).toContain("true");
    expect(WSF_BOOLEAN_KEYWORDS).toContain("false");
    expect(WSF_BOOLEAN_KEYWORDS).toContain("yes");
    expect(WSF_BOOLEAN_KEYWORDS).toContain("no");
  });
});

// ============================================================================
// Data Layer — Unit Definitions
// ============================================================================

describe("Unit Definitions Data", () => {
  it("has multiple unit categories", () => {
    expect(UNIT_CATEGORIES.length).toBeGreaterThan(15);
  });

  it("time units include sec, min, hr", () => {
    const timeCat = UNIT_CATEGORIES.find(c => c.name === "time")!;
    expect(timeCat).toBeDefined();
    expect(timeCat.units).toContain("sec");
    expect(timeCat.units).toContain("min");
    expect(timeCat.units).toContain("hr");
  });

  it("length units include m, km, ft, nm", () => {
    const lengthCat = UNIT_CATEGORIES.find(c => c.name === "length")!;
    expect(lengthCat).toBeDefined();
    expect(lengthCat.units).toContain("m");
    expect(lengthCat.units).toContain("km");
    expect(lengthCat.units).toContain("ft");
    expect(lengthCat.units).toContain("nm");
  });

  it("ALL_UNIT_STRINGS is a flat set of all units", () => {
    expect(ALL_UNIT_STRINGS.has("sec")).toBe(true);
    expect(ALL_UNIT_STRINGS.has("km")).toBe(true);
    expect(ALL_UNIT_STRINGS.has("deg")).toBe(true);
    expect(ALL_UNIT_STRINGS.has("notaunit")).toBe(false);
  });

  it("getAllUnitStrings returns array", () => {
    const all = getAllUnitStrings();
    expect(all.length).toBeGreaterThan(50);
    expect(all).toContain("knots");
  });

  it("isValidUnit works correctly", () => {
    expect(isValidUnit("sec")).toBe(true);
    expect(isValidUnit("SEC")).toBe(true); // case insensitive
    expect(isValidUnit("foobar")).toBe(false);
  });
});

// ============================================================================
// Data Layer — WSF Structs
// ============================================================================

describe("WSF Structs Data", () => {
  it("sensor types include WSF_RADAR_SENSOR", () => {
    const names = WSF_SENSOR_TYPES.map(t => t.name);
    expect(names).toContain("WSF_RADAR_SENSOR");
    expect(names).toContain("WSF_PASSIVE_SENSOR");
  });

  it("processor types include WSF_SCRIPT_PROCESSOR", () => {
    const names = WSF_PROCESSOR_TYPES.map(t => t.name);
    expect(names).toContain("WSF_SCRIPT_PROCESSOR");
    expect(names).toContain("WSF_TRACK_PROCESSOR");
  });

  it("mover types include WSF_AIR_MOVER", () => {
    const names = WSF_MOVER_TYPES.map(t => t.name);
    expect(names).toContain("WSF_AIR_MOVER");
    expect(names).toContain("WSF_GROUND_MOVER");
  });

  it("getTypesForComponent returns correct types", () => {
    const sensors = getTypesForComponent("sensor");
    expect(sensors.length).toBeGreaterThan(0);
    expect(sensors.map(s => s.name)).toContain("WSF_RADAR_SENSOR");

    const movers = getTypesForComponent("mover");
    expect(movers.length).toBeGreaterThan(0);
    expect(movers.map(m => m.name)).toContain("WSF_KINEMATIC_MOVER");
  });
});

// ============================================================================
// Data Layer — Script Builtins
// ============================================================================

describe("Script Builtins Data", () => {
  it("has built-in functions like writeln, assert", () => {
    const names = BUILTIN_FUNCTIONS.map(f => f.name);
    expect(names).toContain("writeln");
    expect(names).toContain("assert");
    expect(names).toContain("has_attr");
    expect(names).toContain("write_str");
  });

  it("has system variables TIME_NOW, PLATFORM, MATH", () => {
    const names = SYSTEM_VARIABLES.map(v => v.name);
    expect(names).toContain("TIME_NOW");
    expect(names).toContain("PLATFORM");
    expect(names).toContain("MATH");
  });

  it("has 100+ script classes", () => {
    expect(ALL_SCRIPT_CLASSES.length).toBeGreaterThan(100);
    expect(ALL_SCRIPT_CLASSES).toContain("WsfPlatform");
    expect(ALL_SCRIPT_CLASSES).toContain("WsfSensor");
    expect(ALL_SCRIPT_CLASSES).toContain("Math");
    expect(ALL_SCRIPT_CLASSES).toContain("Vec3");
  });

  it("getScriptClass returns class definition", () => {
    const plat = getScriptClass("WsfPlatform");
    expect(plat).toBeDefined();
    expect(plat!.methods.length).toBeGreaterThan(10);
    const methodNames = plat!.methods.map(m => m.name);
    expect(methodNames).toContain("Name");
    expect(methodNames).toContain("Location");
    expect(methodNames).toContain("Heading");
  });

  it("getMethodsForClass includes inherited methods", () => {
    const methods = getMethodsForClass("WsfSensor");
    const names = methods.map(m => m.name);
    expect(names).toContain("TurnOn");
    expect(names).toContain("TurnOff");
  });

  it("getSystemVariablesForContext returns context-specific vars", () => {
    // General (no context) should include TIME_NOW, PLATFORM, MATH
    const general = getSystemVariablesForContext();
    const generalNames = general.map(v => v.name);
    expect(generalNames).toContain("TIME_NOW");
    expect(generalNames).toContain("PLATFORM");
    expect(generalNames).toContain("MATH");

    // Sensor context should include SENSOR
    const sensorVars = getSystemVariablesForContext("sensor");
    const sensorNames = sensorVars.map(v => v.name);
    expect(sensorNames).toContain("TIME_NOW");
    expect(sensorNames).toContain("SENSOR");
  });
});

// ============================================================================
// Completion Service — WSF Context
// ============================================================================

describe("Completions — WSF Context", () => {
  it("provides top-level keywords at document root", () => {
    const state = openDoc(`
      platform_type MyType
      end_platform_type
    `);
    // Cursor at the very end (in root context)
    const items = computeCompletions(state, { line: 3, character: 0 });
    const labels = items.map(i => i.label);
    expect(labels).toContain("platform_type");
    expect(labels).toContain("sensor");
    expect(labels).toContain("route");
  });

  it("provides platform sub-keywords inside platform_type", () => {
    const text = `platform_type MyType WSF_PLATFORM
  
end_platform_type`;
    const state = openDoc(text);
    // Cursor on line 1 (inside platform_type block)
    const items = computeCompletions(state, { line: 1, character: 2 });
    const labels = items.map(i => i.label);
    expect(labels).toContain("sensor");
    expect(labels).toContain("processor");
    expect(labels).toContain("mover");
  });

  it("includes boolean keywords in WSF context", () => {
    const state = openDoc(`platform_type MyType WSF_PLATFORM
end_platform_type`);
    const items = computeCompletions(state, { line: 0, character: 40 });
    const labels = items.map(i => i.label);
    expect(labels).toContain("true");
    expect(labels).toContain("false");
  });
});

// ============================================================================
// Completion Service — Script Context
// ============================================================================

describe("Completions — Script Context", () => {
  it("provides script keywords inside on_initialize block", () => {
    const text = `platform_type MyType WSF_PLATFORM
  processor myProc WSF_SCRIPT_PROCESSOR
    on_initialize
      
    end_on_initialize
  end_processor
end_platform_type`;
    const state = openDoc(text);
    // Cursor on the blank line inside on_initialize (line 3)
    const items = computeCompletions(state, { line: 3, character: 6 });
    const labels = items.map(i => i.label);
    // Should have script control flow
    expect(labels).toContain("if");
    expect(labels).toContain("while");
    expect(labels).toContain("for");
    expect(labels).toContain("return");
    // Should have type keywords
    expect(labels).toContain("int");
    expect(labels).toContain("double");
    expect(labels).toContain("string");
    // Should have built-in functions
    expect(labels).toContain("writeln");
    expect(labels).toContain("assert");
    // Should have system variables
    expect(labels).toContain("TIME_NOW");
    expect(labels).toContain("PLATFORM");
    // Should have class names
    expect(labels).toContain("WsfPlatform");
    expect(labels).toContain("Math");
  });

  it("provides context-specific system variables for sensor", () => {
    const text = `sensor mySensor WSF_RADAR_SENSOR
  on_initialize
    
  end_on_initialize
end_sensor`;
    const state = openDoc(text);
    // Cursor inside the script block (line 2)
    const items = computeCompletions(state, { line: 2, character: 4 });
    const labels = items.map(i => i.label);
    expect(labels).toContain("SENSOR");
    expect(labels).toContain("TIME_NOW");
    expect(labels).toContain("PLATFORM");
  });

  it("provides dot completions for PLATFORM.", () => {
    const text = `platform_type MyType WSF_PLATFORM
  processor myProc WSF_SCRIPT_PROCESSOR
    on_initialize
      PLATFORM.
    end_on_initialize
  end_processor
end_platform_type`;
    const state = openDoc(text);
    // Cursor right after the dot on "PLATFORM."
    // "PLATFORM." is at the 6-char indent + "PLATFORM." = 15 chars
    const line3 = text.split("\n")[3]!;
    const dotPos = line3.indexOf(".") + 1;
    const items = computeCompletions(state, { line: 3, character: dotPos }, ".");
    const labels = items.map(i => i.label);
    expect(labels).toContain("Name");
    expect(labels).toContain("Location");
    expect(labels).toContain("Heading");
    expect(labels).toContain("Speed");
    expect(labels).toContain("Sensor");
  });

  it("provides static methods for Math.", () => {
    const text = `platform_type MyType WSF_PLATFORM
  processor myProc WSF_SCRIPT_PROCESSOR
    on_initialize
      Math.
    end_on_initialize
  end_processor
end_platform_type`;
    const state = openDoc(text);
    const line3 = text.split("\n")[3]!;
    const dotPos = line3.indexOf(".") + 1;
    const items = computeCompletions(state, { line: 3, character: dotPos }, ".");
    const labels = items.map(i => i.label);
    // Static methods only
    expect(labels).toContain("Sin");
    expect(labels).toContain("Cos");
    expect(labels).toContain("Sqrt");
    expect(labels).toContain("PI");
    // Instance methods should NOT appear for static dot completion
    expect(labels).not.toContain("RandomUniform");
  });

  it("returns empty for unknown type dot completions", () => {
    const text = `platform_type MyType WSF_PLATFORM
  processor myProc WSF_SCRIPT_PROCESSOR
    on_initialize
      someVar.
    end_on_initialize
  end_processor
end_platform_type`;
    const state = openDoc(text);
    const line3 = text.split("\n")[3]!;
    const dotPos = line3.indexOf(".") + 1;
    const items = computeCompletions(state, { line: 3, character: dotPos }, ".");
    // Can't resolve type of someVar, so returns empty
    expect(items).toHaveLength(0);
  });
});

// ============================================================================
// Completion Service — Edge Cases
// ============================================================================

describe("Completions — Edge Cases", () => {
  it("returns empty for invalid offset", () => {
    const state = openDoc("platform_type MyType\nend_platform_type");
    const items = computeCompletions(state, { line: -1, character: 0 });
    expect(items).toHaveLength(0);
  });

  it("returns completions for empty document", () => {
    const state = openDoc("");
    const items = computeCompletions(state, { line: 0, character: 0 });
    const labels = items.map(i => i.label);
    // Root context — should have top-level keywords
    expect(labels).toContain("platform_type");
  });
});
