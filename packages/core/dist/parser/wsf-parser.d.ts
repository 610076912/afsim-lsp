import { CstParser, CstNode } from "chevrotain";
export declare class WsfParser extends CstParser {
    constructor();
    wsfFile: import("chevrotain").ParserMethod<[], CstNode>;
    private topLevelDecl;
    private platformTypeBlock;
    private platformTypeContent;
    private platformBlock;
    private sensorBlock;
    private processorBlock;
    private commBlock;
    private moverBlock;
    private fuelBlock;
    private routerBlock;
    private networkBlock;
    private visualPartBlock;
    private thermalSystemBlock;
    private includeDirective;
    private scriptPlaceholder;
    private wsfCommand;
    private valueAtom;
}
export declare function getWsfParser(): WsfParser;
//# sourceMappingURL=wsf-parser.d.ts.map