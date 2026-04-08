import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve("./packages/core/src/parser/wsf-parser.ts");
let text = readFileSync(filePath, "utf8");

// We need to add `{ ALT: () => this.SUBRULE(this.genericBlock) },` to the MANY loops of:
// moverBlock, fuelBlock, routerBlock, networkBlock, visualPartBlock, thermalSystemBlock

const blocks = ["moverBlock", "fuelBlock", "routerBlock", "networkBlock", "visualPartBlock", "thermalSystemBlock", "nextStateBlock"];

for (const block of blocks) {
  const regex = new RegExp(`private ${block} = this\\.RULE\\("${block}", \\(\\).+?this\\.MANY\\(\\(\\) => \\{\\s+this\\.OR\\(\\[([\\s\\S]+?)\\]\\);\\s+\\}\\);`, "sg");
  text = text.replace(regex, (match, inner) => {
    if (!inner.includes("this.genericBlock")) {
      const newInner = inner + `        { ALT: () => this.SUBRULE(this.genericBlock) },\n`;
      return match.replace(inner, newInner);
    }
    return match;
  });
}

// Add includeDirective to platformTypeContent
if (!text.includes("{ ALT: () => this.SUBRULE(this.includeDirective) }") && text.includes("platformTypeContent")) {
  text = text.replace(
    `{ ALT: () => this.SUBRULE(this.thermalSystemBlock) },`,
    `{ ALT: () => this.SUBRULE(this.thermalSystemBlock) },\n      { ALT: () => this.SUBRULE(this.includeDirective) },`
  );
}

writeFileSync(filePath, text, "utf8");
console.log("Fixed generic blocks and include directives.");
