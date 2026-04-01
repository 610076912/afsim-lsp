import { describe, it, expect, beforeAll } from "vitest";
import { Lexer, IToken } from "chevrotain";
import { createMultiModeLexer } from "../../src/lexer/index.js";
import { sliceTokens } from "../../src/parser/token-slicer.js";
import { ScriptParser, getScriptParser } from "../../src/parser/script-parser.js";

let lexer: Lexer;
let scriptParser: ScriptParser;

beforeAll(() => {
  lexer = createMultiModeLexer();
  scriptParser = getScriptParser();
});

/**
 * Helper: lex a full document, slice out the first script block's body tokens,
 * then parse them with ScriptParser using the appropriate entry point.
 */
function parseScriptBody(wsfWrapper: string) {
  const lexResult = lexer.tokenize(wsfWrapper);
  expect(lexResult.errors).toHaveLength(0);
  const { slices } = sliceTokens(lexResult.tokens);
  expect(slices.length).toBeGreaterThanOrEqual(1);
  const slice = slices[0];
  scriptParser.input = slice.bodyTokens;
  const cst = slice.isFuncBlock
    ? scriptParser.scriptFuncDefs()
    : scriptParser.scriptBody();
  return { cst, errors: scriptParser.errors, slice };
}

// ============================================================================
// ScriptParser — scriptBody entry point
// ============================================================================

describe("ScriptParser — scriptBody", () => {
  it("parses a simple variable declaration", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_initialize
          int x = 42;
        end_on_initialize
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.name).toBe("scriptBody");
    expect(cst.children.statement).toHaveLength(1);
  });

  it("parses multiple statements", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_initialize
          int x = 10;
          double y = 3.14;
          string s = "hello";
        end_on_initialize
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toHaveLength(3);
  });

  it("parses if/else statement", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          if (x > 0) {
            y = 1;
          } else {
            y = 0;
          }
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
    const stmts = cst.children.statement!;
    expect(stmts).toHaveLength(1);
  });

  it("parses while loop", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          while (i < 10) {
            i = i + 1;
          }
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toHaveLength(1);
  });

  it("parses for loop", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          for (i = 0; i < 10; i = i + 1) {
            DoSomething();
          }
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toHaveLength(1);
  });

  it("parses foreach loop", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          foreach (WsfTrack track in tracks) {
            track.Drop();
          }
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toHaveLength(1);
  });

  it("parses do-while loop", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          do {
            count = count - 1;
          } while (count > 0);
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toHaveLength(1);
  });

  it("parses return statement", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          return;
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toHaveLength(1);
  });

  it("parses return with value", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          return x + 1;
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses break and continue", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          while (true) {
            if (done) {
              break;
            }
            continue;
          }
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses method call chain", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          platform.Track(0).Position().Latitude();
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses assignment expression", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          x = y + z * 2;
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses complex expression with operators", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          bool result = (a > 0 && b < 10) || c == 5;
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses array indexing", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          arr[0] = arr[1] + arr[2];
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses unary operators", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          int neg = -x;
          bool notB = !flag;
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toHaveLength(2);
  });

  it("parses global and static variable declarations", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_initialize
          global int counter = 0;
          static double rate = 1.5;
        end_on_initialize
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toHaveLength(2);
  });

  it("parses initializer list", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_initialize
          Array items = {1, 2, 3};
        end_on_initialize
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses multiple variable declarations in one line", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_initialize
          int a, b = 5, c;
        end_on_initialize
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses empty body", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_initialize
        end_on_initialize
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toBeUndefined();
  });

  it("parses nested blocks", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          if (x > 0) {
            while (y < 10) {
              if (z == 0) {
                break;
              }
              y = y + 1;
            }
          }
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses arrow access (dynamic attributes)", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          obj->GetValue();
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses string concatenation", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          string msg = "Hello " + name + "!";
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses parenthesized expression", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          int val = (a + b) * (c - d);
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });
});

// ============================================================================
// ScriptParser — scriptFuncDefs entry point
// ============================================================================

describe("ScriptParser — scriptFuncDefs", () => {
  it("parses a simple function definition", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        script
          void MyFunc() {
            return;
          }
        end_script
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.name).toBe("scriptFuncDefs");
    expect(cst.children.funcDef).toHaveLength(1);
  });

  it("parses function with parameters", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        script
          int Add(int a, int b) {
            return a + b;
          }
        end_script
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses multiple function definitions", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        script
          void Init() {
            int x = 0;
          }
          double Calculate(double val) {
            return val * 2.0;
          }
        end_script
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.funcDef).toHaveLength(2);
  });

  it("parses function with complex body", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        script
          bool CheckRange(double min, double max, double val) {
            if (val >= min && val <= max) {
              return true;
            }
            return false;
          }
        end_script
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses function with custom type return", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        script
          WsfTrack FindTrack(int id) {
            return tracks.Find(id);
          }
        end_script
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses empty script block", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        script
        end_script
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.funcDef).toBeUndefined();
  });
});

// ============================================================================
// ScriptParser — expression edge cases
// ============================================================================

describe("ScriptParser — expression edge cases", () => {
  it("parses chained comparison operators", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          bool r = a < b && b < c;
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses xor expression", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          int r = a ^ b;
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses compound assignment operators", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          x.val += 1;
          y.val -= 2;
          z.val *= 3;
          w.val /= 4;
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toHaveLength(4);
  });

  it("parses null and boolean literals", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          WsfTrack t = null;
          bool a = true;
          bool b = false;
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
    expect(cst.children.statement).toHaveLength(3);
  });

  it("parses deeply nested method call", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          a.b().c().d(1, "x").e();
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });

  it("parses function call with multiple arguments", () => {
    const { cst, errors } = parseScriptBody(`
      processor foo WSF_SCRIPT_PROCESSOR
        on_update
          DoSomething(a, b + c, "text", 42);
        end_on_update
      end_processor
    `);
    expect(errors).toHaveLength(0);
  });
});
