import { readFileSync } from "fs";
import { resolve } from "path";
import { createMultiModeLexer } from "./packages/core/src/lexer/multi-mode-lexer.js";

const file = resolve("./packages/core/test/fixtures/Phase1_Basic/long_range_radar.txt");
const text = readFileSync(file, "utf8");
const lexer = createMultiModeLexer();
const tokens = lexer.tokenize(text).tokens;

// 打印 L40 - L60 之间的 Token 类型和 Image
console.log("Tokens around line 50:");
tokens.filter(t => t.startLine >= 40 && t.startLine <= 60).forEach(t => {
  console.log(`L${t.startLine}:${t.startColumn} [${t.tokenType.name}] '${t.image}'`);
});
