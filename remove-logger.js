import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve("./packages/core/src/parser/wsf-parser.ts");
let text = readFileSync(filePath, "utf8");

// Remove all TraceLogger calls
text = text.replace(/this\.ACTION\(\(\) => TraceLogger\.enterRule\(".+?"\)\);/g, "");
text = text.replace(/this\.ACTION\(\(\) => TraceLogger\.exitRule\(".+?"\)\);/g, "");
text = text.replace(/this\.ACTION\(\(\) => TraceLogger\.consume\(".+?", .+?\)\);/g, "");
// Fix the remaining TraceLogger.consume inside ALT wrappers
text = text.replace(/\{ ALT: \(\) => \{ const t = this\.CONSUME\((.+?)\); this\.ACTION\(\(\) => TraceLogger\.consume\(".+?", t\.image\)\); \} \}/g, "{ ALT: () => this.CONSUME($1) }");
// General cleanup of remaining TraceLogger actions
text = text.replace(/this\.ACTION\(\(\) => TraceLogger\..+?\);/g, "");

writeFileSync(filePath, text, "utf8");
console.log("Removed TraceLogger calls from wsf-parser.ts");
