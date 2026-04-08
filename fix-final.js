import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// 1. Fix wsf-tokens.ts categories once and for all
const tokensPath = resolve("./packages/core/src/lexer/wsf-tokens.ts");
let tokensContent = readFileSync(tokensPath, "utf8");

// Use a very aggressive regex to remove duplicate categories
tokensContent = tokensContent.replace(
  /(Precondition|ScriptVariables)"\s*,\s*".+?"\s*,\s*\{\s*push_mode:\s*"SCRIPT_MODE"\s*,\s*categories:\s*ScriptEntryCategory\s*,\s*categories:\s*WsfBlockOpen\s*\}\s*\)/g,
  (match, name) => `createWsfToken("${name}", "${name === 'Precondition' ? 'precondition' : 'script_variables'}", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory })`
);

// Double check and fix any remaining manual cases
if (tokensContent.includes("categories: ScriptEntryCategory, categories: WsfBlockOpen")) {
    tokensContent = tokensContent.replace(/categories: ScriptEntryCategory, categories: WsfBlockOpen/g, "categories: ScriptEntryCategory");
}

writeFileSync(tokensPath, tokensContent, "utf8");
console.log("Cleaned up wsf-tokens.ts categories.");

// 2. Refactor script-parser.test.ts to use parseDocument
const testPath = resolve("./packages/core/test/parser/script-parser.test.ts");
let testContent = readFileSync(testPath, "utf8");

// Update parseScriptBody to use parseDocument internally
testContent = testContent.replace(
  /function parseScriptBody\(scriptText: string\) \{([\s\S]+?)return \{ cst: result\.cst, errors: result\.errors \};/g,
  `function parseScriptBody(scriptText: string) {
  // Wrap in a standard WSF block to ensure Lexer/Slicer work correctly
  const fullText = \`processor TestProc WSF_SCRIPT_PROCESSOR
    script
      \${scriptText}
    end_script
  end_processor\`;
  
  const result = parseDocument(fullText);
  
  // Find the correct slice
  const scriptEntries = Array.from(result.scriptEntries.values());
  const entry = scriptEntries[0];
  
  return { 
    cst: entry?.cst, 
    errors: entry?.errors || result.lexErrors.concat(result.wsfErrors as any)
  };`
);

writeFileSync(testPath, testContent, "utf8");
console.log("Refactored script-parser.test.ts to use parseDocument.");
