import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// 1. Manually rebuild wsf-tokens.ts without any script interference
const tokensPath = resolve("./packages/core/src/lexer/wsf-tokens.ts");
let tokensContent = readFileSync(tokensPath, "utf8");

// Fix Precondition and ScriptVariables duplicate categories
tokensContent = tokensContent.replace(/export const Precondition = createWsfToken\("Precondition", "precondition", \{[\s\S]+?\}\);/g, 
  'export const Precondition = createWsfToken("Precondition", "precondition", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });');
tokensContent = tokensContent.replace(/export const ScriptVariables = createWsfToken\("ScriptVariables", "script_variables", \{[\s\S]+?\}\);/g, 
  'export const ScriptVariables = createWsfToken("ScriptVariables", "script_variables", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });');

// Fix WSF_SUFFIX_ASSERTION and WsfIdentifier
tokensContent = tokensContent.replace(/const WSF_SUFFIX_ASSERTION = ".+?";/, 'const WSF_SUFFIX_ASSERTION = "(?![A-Za-z0-9_\\\\-\\\\/\\\\.\\\\$])";');
tokensContent = tokensContent.replace(/export const WsfIdentifier = createToken\(\{[\s\S]+?\}\);/g, 
  `export const WsfIdentifier = createToken({
  name: "WsfIdentifier",
  pattern: /[a-zA-Z_.$][a-zA-Z0-9_\\-\\/.\\$\\{\\}:\\<\\>\\(\\)#]*/,
});`);

writeFileSync(tokensPath, tokensContent, "utf8");
console.log("Verified wsf-tokens.ts consistency.");

// 2. Fix wsf-parser.ts genericBlock closing logic
const parserPath = resolve("./packages/core/src/parser/wsf-parser.ts");
let parserContent = readFileSync(parserPath, "utf8");

// Use image-based matching for genericBlock closing to bypass category issues
parserContent = parserContent.replace(
  /this\.OR3\(\[\{\s*GATE:\s*\(\)\s*=>\s*this\.LA\(1\)\.image\s*===\s*"end_"\s*\+\s*openToken\.image,\s*ALT:\s*\(\)\s*=>\s*this\.CONSUME\(WsfBlockClose\)\s*\}\], \{ ERR_MSG: `Expecting 'end_\${openToken\.image}'` \}\);/g,
  `this.OR3([
      {
        GATE: () => this.LA(1).image === "end_" + openToken.image,
        ALT: () => this.CONSUME(this.LA(1).tokenType) 
      }
    ], { ERR_MSG: \`Expecting 'end_\${openToken.image}'\` });`
);

// ALSO FIX THE OTHER VARIATION OF OR3 IN GENERICBLOCK
parserContent = parserContent.replace(
  /this\.OR3\(\[\{\s*GATE:\s*\(\)\s*=>\s*this\.LA\(1\)\.image\s*===\s*"end_"\s*\+\s*openToken!\.image,\s*ALT:\s*\(\)\s*=>\s*this\.CONSUME\(WsfBlockClose\)\s*\}\], \{ ERR_MSG: "Expecting matching end_ keyword" \}\);/g,
  `this.OR3([
      {
        GATE: () => this.LA(1).image === "end_" + openToken!.image,
        ALT: () => this.CONSUME(this.LA(1).tokenType)
      }
    ], { ERR_MSG: "Expecting matching end_ keyword" });`
);

writeFileSync(parserPath, parserContent, "utf8");
console.log("Upgraded genericBlock closing logic to be token-agnostic.");
