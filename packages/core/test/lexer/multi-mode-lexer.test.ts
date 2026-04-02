import { describe, it, expect, beforeAll } from "vitest";
import { Lexer, IToken } from "chevrotain";
import { createMultiModeLexer } from "../../src/lexer/index.js";

// Import token types for assertion
import {
  WhiteSpace, BlockComment, LineComment, HashComment,
  RealLiteral, IntegerLiteral, StringLiteral, CharLiteral,
} from "../../src/lexer/shared-tokens.js";
import {
  PlatformType, Platform, Sensor, Processor, Comm,
  EndPlatformType, EndPlatform, EndSensor,
  OnInitialize, OnUpdate, OnEntry, OnExit,
  WsfIdentifier, WsfTrue, WsfFalse,
} from "../../src/lexer/wsf-tokens.js";
import {
  ScriptIf, ScriptElse, ScriptWhile, ScriptFor, ScriptForeach,
  ScriptReturn, ScriptBreak, ScriptContinue,
  ScriptInt, ScriptDouble, ScriptString, ScriptBool,
  ScriptNull, ScriptTrue, ScriptFalse,
  ScriptGlobal, ScriptStatic, ScriptExtern,
  EqEq, NotEq, GtEq, LtEq, AndAnd, OrOr,
  PlusAssign, MinusAssign, Assign, Plus, Minus, Star, Slash,
  LParen, RParen, LBrace, RBrace, LBracket, RBracket,
  Semicolon, Comma, Dot, RArrow, Colon,
  ScriptIdentifier,
  EndOnInitialize, EndOnUpdate, EndExecute, EndScript,
} from "../../src/lexer/script-tokens.js";
import {
  ScriptFuncEntry, ExecuteScriptEntry,
} from "../../src/lexer/custom-matchers.js";

let lexer: Lexer;

beforeAll(() => {
  lexer = createMultiModeLexer();
});

/** Helper: lex text and return non-skipped tokens */
function lex(input: string): IToken[] {
  const result = lexer.tokenize(input);
  return result.tokens;
}

/** Helper: lex and also return errors */
function lexFull(input: string) {
  return lexer.tokenize(input);
}

/** Helper: get token type names from result */
function tokenNames(input: string): string[] {
  return lex(input).map((t) => t.tokenType.name);
}

// ============================================================================
// Basic shared token tests
// ============================================================================

describe("Shared Tokens", () => {
  it("should lex integer literals", () => {
    const names = tokenNames("42 0 12345");
    expect(names).toEqual(["IntegerLiteral", "IntegerLiteral", "IntegerLiteral"]);
  });

  it("should lex real number literals", () => {
    const names = tokenNames("3.14 .5 1.0e10 2.5E-3");
    expect(names).toEqual([
      "RealLiteral", "RealLiteral", "RealLiteral", "RealLiteral",
    ]);
  });

  it("should lex string literals with escapes", () => {
    const tokens = lex('"hello" "world\\\\" "with\\"quote"');
    expect(tokens).toHaveLength(3);
    expect(tokens.every((t) => t.tokenType === StringLiteral)).toBe(true);
  });

  it("should lex char literals", () => {
    const names = tokenNames("'a' 'b' '\\n'");
    expect(names).toEqual(["CharLiteral", "CharLiteral", "CharLiteral"]);
  });

  it("should skip line comments", () => {
    const names = tokenNames("platform // this is a comment\nsensor");
    expect(names).toEqual(["Platform", "Sensor"]);
  });

  it("should skip hash comments", () => {
    const names = tokenNames("platform # hash comment\nsensor");
    expect(names).toEqual(["Platform", "Sensor"]);
  });

  it("should skip block comments", () => {
    const names = tokenNames("platform /* block */ sensor");
    expect(names).toEqual(["Platform", "Sensor"]);
  });

  it("should handle nested block comments", () => {
    const names = tokenNames("platform /* outer /* inner */ still comment */ sensor");
    expect(names).toEqual(["Platform", "Sensor"]);
  });
});

// ============================================================================
// WSF_MODE token tests
// ============================================================================

describe("WSF_MODE Tokens", () => {
  it("should lex platform_type and end_platform_type", () => {
    const names = tokenNames("platform_type MyPlat end_platform_type");
    expect(names).toEqual(["PlatformType", "WsfIdentifier", "EndPlatformType"]);
  });

  it("should distinguish platform from platform_type", () => {
    const names = tokenNames("platform myPlat platform_type MyType");
    expect(names).toEqual(["Platform", "WsfIdentifier", "PlatformType", "WsfIdentifier"]);
  });

  it("should lex various WSF block keywords", () => {
    const input = "sensor processor comm network router mover fuel";
    const names = tokenNames(input);
    expect(names).toEqual([
      "Sensor", "Processor", "Comm", "Network", "Router", "Mover", "Fuel",
    ]);
  });

  it("should lex WSF end keywords", () => {
    const input = "end_sensor end_processor end_comm end_network end_router";
    const names = tokenNames(input);
    expect(names).toEqual([
      "EndSensor", "EndProcessor", "EndComm", "EndNetwork", "EndRouter",
    ]);
  });

  it("should lex boolean keywords as identifiers (降维后)", () => {
    const names = tokenNames("true false");
    expect(names).toEqual(["WsfIdentifier", "WsfIdentifier"]);
  });

  it("should lex identifiers for unknown words", () => {
    const names = tokenNames("some_random_word another_one");
    expect(names).toEqual(["WsfIdentifier", "WsfIdentifier"]);
  });

  it("should lex numeric values in WSF context", () => {
    const names = tokenNames("platform_type MyPlat\n  range 100.5\nend_platform_type");
    expect(names).toEqual([
      "PlatformType", "WsfIdentifier",
      "WsfIdentifier", "RealLiteral",
      "EndPlatformType",
    ]);
  });
});

// ============================================================================
// Mode transition tests
// ============================================================================

describe("Mode Transitions — WSF Container Blocks", () => {
  it("should keep OnInitialize in WSF_MODE (not push to script mode)", () => {
    const input = `on_initialize
  update_interval 0.1
end_on_initialize`;
    const names = tokenNames(input);
    // OnXXX are now WSF containers, tokens inside are WSF tokens
    expect(names).toEqual([
      "OnInitialize",
      "WsfIdentifier", "RealLiteral",  // update_interval 0.1 as WSF command
      "EndOnInitialize",
    ]);
  });

  it("should handle pure script blocks inside OnXXX containers", () => {
    const input = `on_initialize
  precondition
    return true;
  end_precondition
end_on_initialize`;
    const names = tokenNames(input);
    // Precondition pushes to SCRIPT_MODE, but OnInitialize doesn't
    expect(names).toEqual([
      "OnInitialize",
      "Precondition",
      "ScriptReturn", "ScriptTrue", "Semicolon",
      "EndPrecondition",
      "EndOnInitialize",
    ]);
  });

  it("should handle on_entry / end_on_entry as WSF container", () => {
    const input = `on_entry
  timeout_ms 5000
end_on_entry`;
    const names = tokenNames(input);
    expect(names).toEqual([
      "OnEntry",
      "WsfIdentifier", "IntegerLiteral",  // timeout_ms 5000
      "EndOnEntry",
    ]);
  });

  it("should return to WSF_MODE after OnXXX block exit", () => {
    const input = `on_initialize
  interval 0.1
end_on_initialize
sensor MySensor end_sensor`;
    const names = tokenNames(input);
    expect(names).toEqual([
      "OnInitialize",
      "WsfIdentifier", "RealLiteral",
      "EndOnInitialize",
      "Sensor", "WsfIdentifier", "EndSensor",
    ]);
  });

  it("should handle nested WSF blocks with OnXXX containers", () => {
    const input = `platform_type MyPlat
  sensor MySensor
    on_initialize
      timeout_ms 5000
    end_on_initialize
  end_sensor
end_platform_type`;
    const names = tokenNames(input);
    expect(names).toEqual([
      "PlatformType", "WsfIdentifier",
      "Sensor", "WsfIdentifier",
      "OnInitialize",
      "WsfIdentifier", "IntegerLiteral",  // timeout_ms 5000
      "EndOnInitialize",
      "EndSensor",
      "EndPlatformType",
    ]);
  });
});

// ============================================================================
// Script language tokens
// ============================================================================

describe("SCRIPT_MODE Tokens", () => {
  it("should lex control flow keywords", () => {
    const input = `precondition
  if (x == 1) {
    while (true) {
      break;
    }
  } else {
    continue;
  }
end_precondition`;
    const names = tokenNames(input);
    expect(names).toContain("ScriptIf");
    expect(names).toContain("ScriptElse");
    expect(names).toContain("ScriptWhile");
    expect(names).toContain("ScriptBreak");
    expect(names).toContain("ScriptContinue");
  });

  it("should lex for/foreach loops", () => {
    const input = `precondition
  for (int i = 0; i < 10; i += 1) {}
  foreach (int x in myList) {}
end_precondition`;
    const names = tokenNames(input);
    expect(names).toContain("ScriptFor");
    expect(names).toContain("ScriptForeach");
    expect(names).toContain("ScriptIn");
  });

  it("should lex type keywords", () => {
    const input = `precondition
  int a = 0;
  double b = 1.0;
  string c = "hello";
  bool d = true;
  char e = 'x';
end_precondition`;
    const names = tokenNames(input);
    expect(names).toContain("ScriptInt");
    expect(names).toContain("ScriptDouble");
    expect(names).toContain("ScriptString");
    expect(names).toContain("ScriptBool");
    expect(names).toContain("ScriptChar");
  });

  it("should lex all operators", () => {
    const input = `precondition
  x == y; x != y; x >= y; x <= y;
  x && y; x || y;
  x += 1; x -= 1; x *= 2; x /= 2;
  x = y; x + y; x - y; x * y; x / y;
  obj->method();
  obj.field;
end_precondition`;
    const names = tokenNames(input);
    expect(names).toContain("EqEq");
    expect(names).toContain("NotEq");
    expect(names).toContain("GtEq");
    expect(names).toContain("LtEq");
    expect(names).toContain("AndAnd");
    expect(names).toContain("OrOr");
    expect(names).toContain("PlusAssign");
    expect(names).toContain("MinusAssign");
    expect(names).toContain("TimesAssign");
    expect(names).toContain("DivAssign");
    expect(names).toContain("Assign");
    expect(names).toContain("RArrow");
    expect(names).toContain("Dot");
  });

  it("should lex null and NULL as ScriptNull", () => {
    const input = `precondition
  x = null;
  y = NULL;
end_precondition`;
    const tokens = lex(input);
    const nullTokens = tokens.filter((t) => t.tokenType === ScriptNull);
    expect(nullTokens).toHaveLength(2);
  });

  it("should lex storage class specifiers", () => {
    const input = `precondition
  global int g = 0;
  static double s = 1.0;
  extern int e;
end_precondition`;
    const names = tokenNames(input);
    expect(names).toContain("ScriptGlobal");
    expect(names).toContain("ScriptStatic");
    expect(names).toContain("ScriptExtern");
  });
});

// ============================================================================
// Custom matcher tests — script/execute disambiguation
// ============================================================================

describe("Custom Matchers — script block entry", () => {
  it("should push to SCRIPT_FUNC_MODE on 'script' keyword with function signature", () => {
    const input = `script
  int myFunc(int x) {
    return x + 1;
  }
end_script`;
    const names = tokenNames(input);
    expect(names[0]).toBe("ScriptFuncEntry");
    expect(names).toContain("ScriptReturn");
    expect(names[names.length - 1]).toBe("EndScript");
  });

  it("should return to WSF_MODE after end_script", () => {
    const input = `script
  int add(int a, int b) { return a + b; }
end_script
platform MyPlat end_platform`;
    const names = tokenNames(input);
    expect(names[0]).toBe("ScriptFuncEntry");
    expect(names).toContain("EndScript");
    expect(names).toContain("Platform");
    expect(names).toContain("EndPlatform");
  });
});

describe("Custom Matchers — execute disambiguation", () => {
  it("should push to SCRIPT_MODE for 'execute' with at_time", () => {
    const input = `execute at_time 5.0 relative
  int x = 1;
end_execute`;
    const names = tokenNames(input);
    expect(names[0]).toBe("ExecuteScriptEntry");
    expect(names).toContain("EndExecute");
  });

  it("should push to SCRIPT_MODE for 'execute' with at_interval_of", () => {
    const input = `execute at_interval_of 1.0
  int x = 1;
end_execute`;
    const names = tokenNames(input);
    expect(names[0]).toBe("ExecuteScriptEntry");
  });

  it("should NOT push to SCRIPT_MODE for 'execute name in' (WSF command)", () => {
    const input = "execute myProcessor in processors";
    const names = tokenNames(input);
    // Should be lexed as regular WSF identifiers since custom matcher returns null
    expect(names[0]).toBe("WsfIdentifier"); // "execute" falls through to WsfIdentifier
    expect(names).not.toContain("ExecuteScriptEntry");
  });
});

// ============================================================================
// Error recovery / edge cases
// ============================================================================

describe("Edge Cases", () => {
  it("should handle empty input", () => {
    const result = lexFull("");
    expect(result.tokens).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  it("should handle WSF-only input without script blocks", () => {
    const input = `platform_type Simple
  sensor mySensor
  end_sensor
end_platform_type`;
    const result = lexFull(input);
    expect(result.errors).toHaveLength(0);
    const names = tokenNames(input);
    expect(names).toEqual([
      "PlatformType", "WsfIdentifier",
      "Sensor", "WsfIdentifier",
      "EndSensor",
      "EndPlatformType",
    ]);
  });

  it("should handle on_initialize2 variant", () => {
    const input = `on_initialize2
  int x = 0;
end_on_initialize2`;
    const names = tokenNames(input);
    expect(names[0]).toBe("OnInitialize"); // pattern matches on_initialize2?
    expect(names[names.length - 1]).toBe("EndOnInitialize");
  });

  it("should lex multiple script blocks in sequence", () => {
    const input = `precondition
  int a = 1;
end_precondition
script_variables
  double b = 2.0;
end_script_variables`;
    const result = lexFull(input);
    expect(result.errors).toHaveLength(0);
    const names = tokenNames(input);
    expect(names).toContain("Precondition");
    expect(names).toContain("EndPrecondition");
    expect(names).toContain("ScriptVariables");
    expect(names).toContain("EndScriptVariables");
  });

  it("should produce no lexer errors for well-formed mixed WSF+Script", () => {
    const input = `platform_type Fighter
  processor MyProc WSF_SCRIPT_PROCESSOR
    script
      int helper(int v) {
        return v * 2;
      }
    end_script
    precondition
      return helper(5) > 0;
    end_precondition
  end_processor
end_platform_type`;
    const result = lexFull(input);
    expect(result.errors).toHaveLength(0);
  });
});
