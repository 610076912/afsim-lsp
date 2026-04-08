import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { parseDocument } from "../src/parser/orchestrator.js";

describe("debug radar", () => {
  it("should parse radar", () => {
    const file = resolve(__dirname, "../test/fixtures/Phase1_Basic/long_range_radar.txt");
    const text = readFileSync(file, "utf8");

    const result = parseDocument(text);

    if (result.wsfErrors.length > 0) {
      console.log("WSF Parse Errors:");
      for (const err of result.wsfErrors) {
        console.log(`L${err.token.startLine}:${err.token.startColumn} (Type: ${err.token.tokenType.name}, Image: '${err.token.image}') ${err.message}`);
      }
    }
    
    // Check if transmitter block was closed correctly
    expect(result.wsfErrors).toHaveLength(0);
  });
});
