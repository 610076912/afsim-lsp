import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve("./packages/core/src/parser/wsf-parser.ts");
let text = readFileSync(filePath, "utf8");

// 1. Extract the topLevelDecl and wsfFile logic
const wsfFileRule = `  public wsfFile = this.RULE("wsfFile", () => {
    this.MANY(() => {
      this.SUBRULE(this.topLevelDecl);
    });
  });`;

const topLevelDeclRule = `  private topLevelDecl = this.RULE("topLevelDecl", () => {
    const isSpecificBlock = () => SPECIFIC_BLOCK_OPENS.has(this.LA(1).tokenType);
    const isAnyBlock = () => tokenMatcher(this.LA(1), WsfBlockOpen) || tokenMatcher(this.LA(1), WsfBlockClose);

    this.OR([
      { ALT: () => this.SUBRULE(this.platformTypeBlock) },
      { ALT: () => this.SUBRULE(this.platformBlock) },
      { ALT: () => this.SUBRULE(this.includeDirective) },
      // Standalone components at top level
      { ALT: () => this.SUBRULE(this.sensorBlock) },
      { ALT: () => this.SUBRULE(this.processorBlock) },
      { ALT: () => this.SUBRULE(this.commBlock) },
      { ALT: () => this.SUBRULE(this.moverBlock) },
      { ALT: () => this.SUBRULE(this.fuelBlock) },
      { ALT: () => this.SUBRULE(this.routerBlock) },
      { ALT: () => this.SUBRULE(this.networkBlock) },
      { ALT: () => this.SUBRULE(this.visualPartBlock) },
      { ALT: () => this.SUBRULE(this.thermalSystemBlock) },
      // Top-level commands or blocks
      { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
      { 
        GATE: () => !isAnyBlock(),
        ALT: () => this.SUBRULE(this.wsfCommand) 
      },
      { 
        GATE: () => !isSpecificBlock() && tokenMatcher(this.LA(1), WsfBlockOpen),
        ALT: () => this.SUBRULE(this.genericBlock) 
      },
    ]);
  });`;

// 2. Remove them from where they currently are
// We'll look for them roughly and remove the matches
text = text.replace(/public wsfFile = this\.RULE\("wsfFile"[\s\S]+?\}\);/g, "");
text = text.replace(/private topLevelDecl = this\.RULE\("topLevelDecl"[\s\S]+?\}\);/g, "");

// 3. Find the end of the class (the last rule is usually valueAtom)
const classEndIndex = text.lastIndexOf("}");
const beforeEnd = text.substring(0, classEndIndex);
const afterEnd = text.substring(classEndIndex);

// 4. Reconstruct with rules at the end
const newText = beforeEnd + "\n" + wsfFileRule + "\n\n" + topLevelDeclRule + "\n" + afterEnd;

writeFileSync(filePath, newText, "utf8");
console.log("Reorganized WsfParser: moved top-level rules to the end.");
