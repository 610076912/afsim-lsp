import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, relative } from "path";
import { parseDocument } from "../../src/parser/orchestrator.js";

// ============================================================================
// AFSIM Fixture-based Parser Tests
// Full pipeline: lexer → slicer → WSF parser (+ Script parser)
//
// Usage:
//   Run all fixtures:
//     npx vitest run test/parser/parser.test.ts
//
//   Run a single fixture file (substring match):
//     FIXTURE=1v1_entry npx vitest run test/parser/parser.test.ts
//     FIXTURE=Phase1_Basic/1v1_entry.txt npx vitest run test/parser/parser.test.ts
//
//   Run all fixtures in a phase:
//     FIXTURE=Phase1 npx vitest run test/parser/parser.test.ts
//     FIXTURE=Phase2 npx vitest run test/parser/parser.test.ts
// ============================================================================

const fixturesDir = join(__dirname, "../fixtures");
const fixtureFilter = process.env.FIXTURE ?? "";

const phases = [
  { name: "Phase 1: Basic Syntax", dir: "Phase1_Basic" },
  { name: "Phase 2: Intermediate Syntax", dir: "Phase2_Intermediate" },
  { name: "Phase 3: Advanced Syntax", dir: "Phase3_Advanced" },
];

function loadFixture(phase: string, file: string): string {
  return readFileSync(join(fixturesDir, phase, file), "utf-8");
}

function listFiles(phaseDir: string): string[] {
  const dir = join(fixturesDir, phaseDir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => f.endsWith(".txt")).sort();
}

function matchesFilter(phaseDir: string, file: string): boolean {
  if (!fixtureFilter) return true;
  const fullPath = `${phaseDir}/${file}`;
  return fullPath.includes(fixtureFilter) || file.includes(fixtureFilter);
}

describe("AFSIM LSP Parser Compatibility Tests", () => {
  for (const phase of phases) {
    describe(phase.name, () => {
      const files = listFiles(phase.dir).filter(f => matchesFilter(phase.dir, f));

      if (files.length === 0 && fixtureFilter) {
        it.skip(`no fixtures matching "${fixtureFilter}"`, () => {});
        return;
      }

      files.forEach(file => {
        it(`should parse ${file} without errors`, () => {
          const content = loadFixture(phase.dir, file);
          const result = parseDocument(content);

          if (result.lexErrors.length > 0) {
            const msgs = result.lexErrors.map(e =>
              `  L${e.line}:${e.column} ${e.message}`
            ).join("\n");
            expect.fail(
              `${result.lexErrors.length} lex error(s) in ${file}:\n${msgs}`
            );
          }

          if (result.wsfErrors.length > 0) {
            const msgs = result.wsfErrors.map(e => {
              const loc = e.token?.startLine
                ? `L${e.token.startLine}:${e.token.startColumn}`
                : "?";
              return `  ${loc} ${e.message}`;
            }).join("\n");
            expect.fail(
              `${result.wsfErrors.length} parse error(s) in ${file}:\n${msgs}`
            );
          }

          expect(result.wsfCst.name).toBe("wsfFile");
        });
      });
    });
  }
});
