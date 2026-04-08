import { describe, it, expect, beforeAll } from "vitest";
import { Lexer, IToken } from "chevrotain";
import { createMultiModeLexer } from "../../src/lexer/index.js";
import { sliceTokens, SliceResult } from "../../src/parser/token-slicer.js";
import { WsfParser, getWsfParser } from "../../src/parser/wsf-parser.js";

let lexer: Lexer;
let parser: WsfParser;

beforeAll(() => {
  lexer = createMultiModeLexer();
  parser = getWsfParser();
});

function tokenize(input: string): IToken[] {
  return lexer.tokenize(input).tokens;
}

function sliceAndParse(input: string) {
  const lexResult = lexer.tokenize(input);
  const { slices, wsfTokens } = sliceTokens(lexResult.tokens);
  parser.input = wsfTokens;
  const cst = parser.wsfFile();
  return { lexResult, slices, wsfTokens, cst, parseErrors: parser.errors };
}

// ============================================================================
// Token Slicer tests
// ============================================================================

describe("Token Slicer", () => {
  it("should keep OnXXX blocks in WSF stream (they are WSF containers)", () => {
    const tokens = tokenize(`on_initialize
  update_interval 0.1
end_on_initialize`);

    const { slices, wsfTokens } = sliceTokens(tokens);
    // OnInitialize is a WSF container, not a script slice
    expect(slices).toHaveLength(0);
    
    // WSF stream should have all tokens
    expect(wsfTokens).toHaveLength(4);
    expect(wsfTokens[0].tokenType.name).toBe("OnInitialize");
    expect(wsfTokens[1].tokenType.name).toBe("WsfIdentifier");
    expect(wsfTokens[2].tokenType.name).toBe("RealLiteral");
    expect(wsfTokens[3].tokenType.name).toBe("EndOnInitialize");
  });

  it("should extract pure script blocks inside OnXXX containers", () => {
    const tokens = tokenize(`on_initialize
  precondition
    return true;
  end_precondition
end_on_initialize`);

    const { slices, wsfTokens } = sliceTokens(tokens);
    // Should extract the precondition block as a script slice
    expect(slices).toHaveLength(1);
    expect(slices[0].entryToken.tokenType.name).toBe("Precondition");
    expect(slices[0].exitToken?.tokenType.name).toBe("EndPrecondition");
    
    // WSF stream should have OnInitialize, EndOnInitialize, and Precondition/EndPrecondition placeholders
    expect(wsfTokens.length).toBeGreaterThan(0);
  });

  it("should preserve WSF tokens for OnXXX blocks", () => {
    const tokens = tokenize(`platform_type MyPlat
  on_initialize
    update_interval 0.1
  end_on_initialize
end_platform_type`);

    const { slices, wsfTokens } = sliceTokens(tokens);
    // No script slices (OnInitialize is a WSF container)
    expect(slices).toHaveLength(0);
    
    // All tokens remain in WSF stream
    const wsfNames = wsfTokens.map(t => t.tokenType.name);
    expect(wsfNames).toEqual([
      "PlatformType", "WsfIdentifier",
      "OnInitialize",
      "WsfIdentifier",  // update_interval
      "RealLiteral",    // 0.1
      "EndOnInitialize",
      "EndPlatformType",
    ]);
  });

  it("should mark function blocks (script...end_script)", () => {
    const tokens = tokenize(`script
  int add(int a, int b) { return a + b; }
end_script`);

    const { slices } = sliceTokens(tokens);
    expect(slices).toHaveLength(1);
    expect(slices[0].isFuncBlock).toBe(true);
    expect(slices[0].entryToken.tokenType.name).toBe("ScriptFuncEntry");
    expect(slices[0].exitToken?.tokenType.name).toBe("EndScript");
  });

  it("should infer context type from enclosing OnXXX block", () => {
    const tokens = tokenize(`processor MyProc WSF_SCRIPT_PROCESSOR
  precondition
    return true;
  end_precondition
end_processor`);

    const { slices } = sliceTokens(tokens);
    // Should extract the precondition with Processor context
    expect(slices).toHaveLength(1);
    expect(slices[0].contextTag).toBe("Processor");
  });

  it("should handle input with no script blocks", () => {
    const tokens = tokenize(`platform_type Simple
  sensor MySensor
  end_sensor
end_platform_type`);

    const { slices, wsfTokens } = sliceTokens(tokens);
    expect(slices).toHaveLength(0);
    expect(wsfTokens).toHaveLength(tokens.length);
  });

  it("should extract correct body tokens from precondition", () => {
    const tokens = tokenize(`precondition
  return true;
end_precondition`);

    const { slices } = sliceTokens(tokens);
    const bodyNames = slices[0].bodyTokens.map(t => t.tokenType.name);
    expect(bodyNames).toEqual([
      "ScriptReturn", "ScriptTrue", "Semicolon",
    ]);
  });
});

// ============================================================================
// WSF Parser tests
// ============================================================================

describe("WSF Parser", () => {
  it("should parse empty input", () => {
    const { parseErrors } = sliceAndParse("");
    expect(parseErrors).toHaveLength(0);
  });

  it("should parse a simple platform_type block", () => {
    const { parseErrors, cst } = sliceAndParse(`platform_type Fighter
end_platform_type`);
    expect(parseErrors).toHaveLength(0);
    expect(cst.name).toBe("wsfFile");
  });

  it("should parse platform_type with sensor sub-block", () => {
    const { parseErrors } = sliceAndParse(`platform_type Fighter
  sensor MySensor SomeSensorType
  end_sensor
end_platform_type`);
    expect(parseErrors).toHaveLength(0);
  });

  it("should parse platform_type with processor and script placeholders", () => {
    const { parseErrors, slices } = sliceAndParse(`platform_type Fighter
  processor MyProc WSF_SCRIPT_PROCESSOR
    precondition
      return true;
    end_precondition
    script_variables
      int x = 0;
    end_script_variables
  end_processor
end_platform_type`);
    expect(parseErrors).toHaveLength(0);
    // Should extract precondition and script_variables as script slices
    expect(slices).toHaveLength(2);
  });

  it("should parse platform_type with script function block", () => {
    const { parseErrors, slices } = sliceAndParse(`platform_type Fighter
  processor MyProc WSF_SCRIPT_PROCESSOR
    script
      int helper(int v) { return v * 2; }
    end_script
  end_processor
end_platform_type`);
    expect(parseErrors).toHaveLength(0);
    expect(slices).toHaveLength(1);
    expect(slices[0].isFuncBlock).toBe(true);
  });

  it("should parse include directive", () => {
    const { parseErrors } = sliceAndParse(`include "path/to/file.wsf"`);
    expect(parseErrors).toHaveLength(0);
  });

  it("should parse platform block with type reference", () => {
    const { parseErrors } = sliceAndParse(`platform MyPlat Fighter
end_platform`);
    expect(parseErrors).toHaveLength(0);
  });

  it("should parse nested component blocks", () => {
    const { parseErrors } = sliceAndParse(`platform_type Battleship
  sensor Radar MySensorType
  end_sensor
  comm DataLink MyCommType
  end_comm
  mover ShipMover MyMoverType
  end_mover
  fuel MainFuel
  end_fuel
end_platform_type`);
    expect(parseErrors).toHaveLength(0);
  });
});
