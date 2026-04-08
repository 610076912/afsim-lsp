import { readFileSync } from "fs";
import { resolve } from "path";
import { getWsfParser } from "./packages/core/src/parser/wsf-parser.js";
import { createMultiModeLexer } from "./packages/core/src/lexer/multi-mode-lexer.js";
import { extractScriptSlices } from "./packages/core/src/parser/token-slicer.js";

const file = resolve("./packages/core/test/fixtures/Phase1_Basic/long_range_radar.txt");
const text = readFileSync(file, "utf8");

const lexer = createMultiModeLexer();
const lexResult = lexer.tokenize(text);
if (lexResult.errors.length > 0) {
  console.log("Lex Errors:");
  console.log(lexResult.errors);
  process.exit(1);
}

const { slices, wsfTokens } = extractScriptSlices(lexResult.tokens);

const parser = getWsfParser();
parser.input = wsfTokens;
parser.wsfFile();

if (parser.errors.length > 0) {
  console.log("Parse Errors:");
  for (const err of parser.errors) {
    console.log(`L${err.token.startLine}:${err.token.startColumn} ${err.message}`);
  }
} else {
  console.log("Parsed successfully!");
}
