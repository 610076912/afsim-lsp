import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve("./packages/core/src/lexer/wsf-tokens.ts");
let text = readFileSync(filePath, "utf8");

// 1. Fix WSF_SUFFIX_ASSERTION
text = text.replace(/const WSF_SUFFIX_ASSERTION = ".+?";/, 'const WSF_SUFFIX_ASSERTION = "(?![A-Za-z0-9_\\\\-\\\\/\\\\.\\\\$])";');

// 2. Fix WsfIdentifier Regex
text = text.replace(/name: "WsfIdentifier",[\s\S]+?pattern: \/.+?\/,/, 'name: "WsfIdentifier",\n  // Permissive: allows -, /, ., $, { } for paths and variables like "${SCNRIO}" or "observer.txt"\n  pattern: /[a-zA-Z_.$][a-zA-Z0-9_\\-\\/.\\$\\{\\}:\\<\\>\\(\\)#]*/,');

// 3. Fix duplicate categories for Precondition and ScriptVariables
text = text.replace(/export const Precondition = createWsfToken\("Precondition", "precondition", \{ (.+?) \}\);/g, (match, options) => {
  if (options.includes("categories")) {
    return 'export const Precondition = createWsfToken("Precondition", "precondition", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });';
  }
  return match;
});
text = text.replace(/export const ScriptVariables = createWsfToken\("ScriptVariables", "script_variables", \{ (.+?) \}\);/g, (match, options) => {
  if (options.includes("categories")) {
    return 'export const ScriptVariables = createWsfToken("ScriptVariables", "script_variables", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });';
  }
  return match;
});

writeFileSync(filePath, text, "utf8");
console.log("Final cleanup of wsf-tokens.ts completed.");
