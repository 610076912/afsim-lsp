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
    private onInitializeBlock;
    private onUpdateBlock;
    private onEntryBlock;
    private onExitBlock;
    private onMessageBlock;
    private onInitBlock;
    private onTrackDropBlock;
    private onBingoBlock;
    private onEmptyBlock;
    private onRefuelBlock;
    private onReserveBlock;
    private onNewExecuteBlock;
    private onNewFailBlock;
    private nextStateBlock;
    private scriptPlaceholder;
    private wsfCommand;
    private valueAtom;
}
export declare function getWsfParser(): WsfParser;
//# sourceMappingURL=wsf-parser.d.ts.map