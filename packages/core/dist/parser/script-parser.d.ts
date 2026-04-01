import { CstParser } from "chevrotain";
export declare class ScriptParser extends CstParser {
    constructor();
    /** Parse a script body (statements) */
    scriptBody: import("chevrotain").ParserMethod<[], import("chevrotain").CstNode>;
    /** Parse function definitions */
    scriptFuncDefs: import("chevrotain").ParserMethod<[], import("chevrotain").CstNode>;
    private funcDef;
    private formalParamList;
    private typeRef;
    private block;
    private statement;
    /** Lookahead gate: check if current position looks like a variable declaration */
    private isVarDecl;
    private isTypeToken;
    private ifStatement;
    private whileStatement;
    private doStatement;
    private forStatement;
    private foreachStatement;
    private returnStatement;
    private breakStatement;
    private continueStatement;
    private externStatement;
    private varDeclStatement;
    private varDecl;
    private expressionStatement;
    private assignOp;
    private expression;
    private orExpression;
    private andExpression;
    private xorExpression;
    private eqExpression;
    private cmpExpression;
    private addExpression;
    private mulExpression;
    private unaryExpression;
    private postfixExpression;
    private trailer;
    private atom;
    private initializerList;
    private initializerEntry;
    private argList;
}
export declare function getScriptParser(): ScriptParser;
//# sourceMappingURL=script-parser.d.ts.map