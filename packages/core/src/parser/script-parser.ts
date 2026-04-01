import { CstParser, TokenType, IToken } from "chevrotain";
import {
  WhiteSpace, BlockComment, LineComment, HashComment,
  RealLiteral, IntegerLiteral, StringLiteral, CharLiteral,
} from "../lexer/shared-tokens.js";
import {
  ScriptIf, ScriptElse, ScriptWhile, ScriptDo, ScriptFor,
  ScriptForeach, ScriptIn, ScriptBreak, ScriptContinue, ScriptReturn,
  ScriptNull, ScriptTrue, ScriptFalse,
  ScriptString, ScriptInt, ScriptDouble, ScriptChar, ScriptBool,
  ScriptGlobal, ScriptStatic, ScriptExtern,
  EqEq, NotEq, GtEq, LtEq, AndAnd, OrOr, Not,
  PlusAssign, MinusAssign, TimesAssign, DivAssign,
  RArrow, Assign, Plus, Minus, Star, Slash, Caret, LAngle, RAngle,
  LParen, RParen, LBrace, RBrace, LBracket, RBracket,
  Semicolon, Comma, Dot, Colon,
  PreprocessorVar,
  ScriptIdentifier,
} from "../lexer/script-tokens.js";

// ============================================================================
// Script Parser — parses C-like AFSIM script language
//
// Based on script.atg grammar (Coco/R attributed grammar).
// Operates on bodyTokens extracted by the Token Slicer.
//
// Two entry points:
//   - scriptBody(): for statement-level script blocks (on_initialize, etc.)
//   - scriptFuncDefs(): for function definition blocks (script...end_script)
// ============================================================================

const allScriptTokenTypes: TokenType[] = [
  // Shared
  WhiteSpace, BlockComment, LineComment, HashComment,
  StringLiteral, CharLiteral, RealLiteral, IntegerLiteral,
  PreprocessorVar,

  // Multi-char operators (before single-char)
  EqEq, NotEq, GtEq, LtEq, AndAnd, OrOr,
  PlusAssign, MinusAssign, TimesAssign, DivAssign,
  RArrow,

  // Single-char operators
  Assign, Plus, Minus, Star, Slash, Caret, LAngle, RAngle, Not,

  // Punctuation
  LParen, RParen, LBrace, RBrace, LBracket, RBracket,
  Semicolon, Comma, Dot, Colon,

  // Keywords (longer before shorter)
  ScriptForeach, ScriptFor,
  ScriptDouble, ScriptDo,
  ScriptInt, ScriptIn,
  ScriptIf, ScriptElse, ScriptWhile,
  ScriptBreak, ScriptContinue, ScriptReturn,
  ScriptNull, ScriptTrue, ScriptFalse,
  ScriptString, ScriptChar, ScriptBool,
  ScriptGlobal, ScriptStatic, ScriptExtern,

  // Identifier last
  ScriptIdentifier,
];

export class ScriptParser extends CstParser {
  constructor() {
    super(allScriptTokenTypes, {
      recoveryEnabled: true,
      nodeLocationTracking: "full",
      maxLookahead: 3,
    });
    this.performSelfAnalysis();
  }

  // ========================================================================
  // Entry points
  // ========================================================================

  /** Parse a script body (statements) */
  public scriptBody = this.RULE("scriptBody", () => {
    this.MANY(() => {
      this.SUBRULE(this.statement);
    });
  });

  /** Parse function definitions */
  public scriptFuncDefs = this.RULE("scriptFuncDefs", () => {
    this.MANY(() => {
      this.SUBRULE(this.funcDef);
    });
  });

  // ========================================================================
  // Function definitions: type name(params) { body }
  // ========================================================================

  private funcDef = this.RULE("funcDef", () => {
    this.SUBRULE(this.typeRef, { LABEL: "returnType" });
    this.CONSUME(ScriptIdentifier, { LABEL: "funcName" });
    this.SUBRULE(this.formalParamList);
    this.SUBRULE(this.block, { LABEL: "funcBody" });
  });

  private formalParamList = this.RULE("formalParamList", () => {
    this.CONSUME(LParen);
    this.OPTION(() => {
      this.SUBRULE(this.typeRef, { LABEL: "paramType" });
      this.CONSUME(ScriptIdentifier, { LABEL: "paramName" });
      this.MANY(() => {
        this.CONSUME(Comma);
        this.SUBRULE2(this.typeRef, { LABEL: "paramType" });
        this.CONSUME2(ScriptIdentifier, { LABEL: "paramName" });
      });
    });
    this.CONSUME(RParen);
  });

  // ========================================================================
  // Type references
  // ========================================================================

  private typeRef = this.RULE("typeRef", () => {
    this.OR([
      { ALT: () => this.CONSUME(ScriptString) },
      { ALT: () => this.CONSUME(ScriptInt) },
      { ALT: () => this.CONSUME(ScriptDouble) },
      { ALT: () => this.CONSUME(ScriptChar) },
      { ALT: () => this.CONSUME(ScriptBool) },
      { ALT: () => this.CONSUME(ScriptIdentifier, { LABEL: "customType" }) },
    ]);
    // Optional template parameters: Type<T> or Type<T, U>
    this.OPTION(() => {
      this.CONSUME(LAngle);
      this.SUBRULE(this.typeRef, { LABEL: "templateArg1" });
      this.OPTION2(() => {
        this.CONSUME(Comma);
        this.SUBRULE2(this.typeRef, { LABEL: "templateArg2" });
      });
      this.CONSUME(RAngle);
    });
  });

  // ========================================================================
  // Statements
  // ========================================================================

  private block = this.RULE("block", () => {
    this.CONSUME(LBrace);
    this.MANY(() => {
      this.SUBRULE(this.statement);
    });
    this.CONSUME(RBrace);
  });

  private statement = this.RULE("statement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.ifStatement) },
      { ALT: () => this.SUBRULE(this.whileStatement) },
      { ALT: () => this.SUBRULE(this.doStatement) },
      { ALT: () => this.SUBRULE(this.forStatement) },
      { ALT: () => this.SUBRULE(this.foreachStatement) },
      { ALT: () => this.SUBRULE(this.returnStatement) },
      { ALT: () => this.SUBRULE(this.breakStatement) },
      { ALT: () => this.SUBRULE(this.continueStatement) },
      { ALT: () => this.SUBRULE(this.externStatement) },
      { ALT: () => this.SUBRULE(this.block) },
      // varDecl or expression statement — both can start with identifier or type
      // Use GATE to disambiguate
      {
        ALT: () => this.SUBRULE(this.varDeclStatement),
        GATE: () => this.isVarDecl(),
      },
      {
        ALT: () => this.SUBRULE(this.expressionStatement),
        // Exclude LBrace start — that's always a block, never an expression statement
        GATE: () => this.LA(1).tokenType !== LBrace,
      },
    ]);
  });

  /** Lookahead gate: check if current position looks like a variable declaration */
  private isVarDecl(): boolean {
    // var decl starts with: storage_class? type ident
    // storage classes: global, static, extern
    const la1 = this.LA(1);
    if (la1.tokenType === ScriptGlobal ||
        la1.tokenType === ScriptStatic ||
        la1.tokenType === ScriptExtern) {
      return true;
    }
    // If starts with a basic type keyword followed by identifier
    if (this.isTypeToken(la1)) {
      const la2 = this.LA(2);
      // type followed by identifier → var decl
      // type followed by ( → could be cast or constructor, not var decl
      // type followed by . → static method call, not var decl
      if (la2.tokenType === ScriptIdentifier) return true;
      // type<...> template → need to look further, assume var decl if type keyword
      if (la2.tokenType === LAngle) return true;
    }
    return false;
  }

  private isTypeToken(token: IToken): boolean {
    const tt = token.tokenType;
    return tt === ScriptString || tt === ScriptInt || tt === ScriptDouble ||
           tt === ScriptChar || tt === ScriptBool || tt === ScriptIdentifier;
  }

  // --- Control flow statements ---

  private ifStatement = this.RULE("ifStatement", () => {
    this.CONSUME(ScriptIf);
    this.CONSUME(LParen);
    this.SUBRULE(this.expression, { LABEL: "condition" });
    this.CONSUME(RParen);
    this.SUBRULE(this.statement, { LABEL: "thenBranch" });
    this.OPTION(() => {
      this.CONSUME(ScriptElse);
      this.SUBRULE2(this.statement, { LABEL: "elseBranch" });
    });
  });

  private whileStatement = this.RULE("whileStatement", () => {
    this.CONSUME(ScriptWhile);
    this.CONSUME(LParen);
    this.SUBRULE(this.expression, { LABEL: "condition" });
    this.CONSUME(RParen);
    this.SUBRULE(this.statement, { LABEL: "body" });
  });

  private doStatement = this.RULE("doStatement", () => {
    this.CONSUME(ScriptDo);
    this.SUBRULE(this.statement, { LABEL: "body" });
    this.CONSUME(ScriptWhile);
    this.CONSUME(LParen);
    this.SUBRULE(this.expression, { LABEL: "condition" });
    this.CONSUME(RParen);
    this.CONSUME(Semicolon);
  });

  private forStatement = this.RULE("forStatement", () => {
    this.CONSUME(ScriptFor);
    this.CONSUME(LParen);
    this.OPTION(() => {
      this.OR([
        {
          ALT: () => this.SUBRULE(this.varDecl, { LABEL: "forInit" }),
          GATE: () => this.isVarDecl(),
        },
        { ALT: () => this.SUBRULE(this.expression, { LABEL: "forInitExpr" }) },
      ]);
    });
    this.CONSUME(Semicolon);
    this.SUBRULE2(this.expression, { LABEL: "condition" });
    this.CONSUME2(Semicolon);
    this.OPTION2(() => {
      this.SUBRULE3(this.expression, { LABEL: "increment" });
    });
    this.CONSUME(RParen);
    this.SUBRULE(this.statement, { LABEL: "body" });
  });

  private foreachStatement = this.RULE("foreachStatement", () => {
    this.CONSUME(ScriptForeach);
    this.CONSUME(LParen);
    this.SUBRULE(this.typeRef, { LABEL: "varType" });
    this.CONSUME(ScriptIdentifier, { LABEL: "varName" });
    this.OPTION(() => {
      this.CONSUME(Colon);
      this.SUBRULE2(this.typeRef, { LABEL: "var2Type" });
      this.CONSUME2(ScriptIdentifier, { LABEL: "var2Name" });
    });
    this.CONSUME(ScriptIn);
    this.SUBRULE(this.expression, { LABEL: "collection" });
    this.CONSUME(RParen);
    this.SUBRULE(this.statement, { LABEL: "body" });
  });

  private returnStatement = this.RULE("returnStatement", () => {
    this.CONSUME(ScriptReturn);
    this.OPTION(() => {
      this.SUBRULE(this.expression, { LABEL: "returnValue" });
    });
    this.CONSUME(Semicolon);
  });

  private breakStatement = this.RULE("breakStatement", () => {
    this.CONSUME(ScriptBreak);
    this.CONSUME(Semicolon);
  });

  private continueStatement = this.RULE("continueStatement", () => {
    this.CONSUME(ScriptContinue);
    this.CONSUME(Semicolon);
  });

  private externStatement = this.RULE("externStatement", () => {
    this.CONSUME(ScriptExtern);
    this.SUBRULE(this.typeRef, { LABEL: "externType" });
    this.CONSUME(ScriptIdentifier, { LABEL: "externName" });
    this.OR([
      {
        ALT: () => {
          // extern function declaration
          this.SUBRULE(this.formalParamList);
          this.CONSUME(Semicolon);
        },
      },
      {
        ALT: () => {
          // extern variable declaration
          this.CONSUME2(Semicolon);
        },
      },
    ]);
  });

  // --- Variable declarations ---

  private varDeclStatement = this.RULE("varDeclStatement", () => {
    this.SUBRULE(this.varDecl);
    this.CONSUME(Semicolon);
  });

  private varDecl = this.RULE("varDecl", () => {
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(ScriptGlobal) },
        { ALT: () => this.CONSUME(ScriptStatic) },
      ]);
    });
    this.SUBRULE(this.typeRef, { LABEL: "varType" });
    this.CONSUME(ScriptIdentifier, { LABEL: "varName" });
    this.OPTION2(() => {
      this.CONSUME(Assign);
      this.SUBRULE(this.expression, { LABEL: "initializer" });
    });
    // Multiple declarations: int x, y = 5, z;
    this.MANY(() => {
      this.CONSUME(Comma);
      this.CONSUME2(ScriptIdentifier, { LABEL: "varName" });
      this.OPTION3(() => {
        this.CONSUME2(Assign);
        this.SUBRULE2(this.expression, { LABEL: "initializer" });
      });
    });
  });

  // --- Expression statement ---

  private expressionStatement = this.RULE("expressionStatement", () => {
    this.SUBRULE(this.expression);
    this.CONSUME(Semicolon);
  });

  private assignOp = this.RULE("assignOp", () => {
    this.OR([
      { ALT: () => this.CONSUME(Assign) },
      { ALT: () => this.CONSUME(PlusAssign) },
      { ALT: () => this.CONSUME(MinusAssign) },
      { ALT: () => this.CONSUME(TimesAssign) },
      { ALT: () => this.CONSUME(DivAssign) },
    ]);
  });

  // ========================================================================
  // Expression precedence chain (from script.atg)
  // Lowest to highest: assign → || → && → ^ → ==/!= → </>/<=/>=  → +/- → *// → unary → atom.trailer
  // ========================================================================

  private expression = this.RULE("expression", () => {
    this.SUBRULE(this.orExpression, { LABEL: "lhs" });
    // Optional assignment suffix: lhs = expr, lhs += expr, etc.
    this.OPTION(() => {
      this.SUBRULE(this.assignOp);
      this.SUBRULE2(this.expression, { LABEL: "rhs" });
    });
  });

  private orExpression = this.RULE("orExpression", () => {
    this.SUBRULE(this.andExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(OrOr);
      this.SUBRULE2(this.andExpression, { LABEL: "rhs" });
    });
  });

  private andExpression = this.RULE("andExpression", () => {
    this.SUBRULE(this.xorExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(AndAnd);
      this.SUBRULE2(this.xorExpression, { LABEL: "rhs" });
    });
  });

  private xorExpression = this.RULE("xorExpression", () => {
    this.SUBRULE(this.eqExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(Caret);
      this.SUBRULE2(this.eqExpression, { LABEL: "rhs" });
    });
  });

  private eqExpression = this.RULE("eqExpression", () => {
    this.SUBRULE(this.cmpExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(EqEq) },
        { ALT: () => this.CONSUME(NotEq) },
      ]);
      this.SUBRULE2(this.cmpExpression, { LABEL: "rhs" });
    });
  });

  private cmpExpression = this.RULE("cmpExpression", () => {
    this.SUBRULE(this.addExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(LAngle) },
        { ALT: () => this.CONSUME(RAngle) },
        { ALT: () => this.CONSUME(LtEq) },
        { ALT: () => this.CONSUME(GtEq) },
      ]);
      this.SUBRULE2(this.addExpression, { LABEL: "rhs" });
    });
  });

  private addExpression = this.RULE("addExpression", () => {
    this.SUBRULE(this.mulExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Plus) },
        { ALT: () => this.CONSUME(Minus) },
      ]);
      this.SUBRULE2(this.mulExpression, { LABEL: "rhs" });
    });
  });

  private mulExpression = this.RULE("mulExpression", () => {
    this.SUBRULE(this.unaryExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Star) },
        { ALT: () => this.CONSUME(Slash) },
      ]);
      this.SUBRULE2(this.unaryExpression, { LABEL: "rhs" });
    });
  });

  private unaryExpression = this.RULE("unaryExpression", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(Not);
          this.SUBRULE(this.unaryExpression, { LABEL: "operand" });
        },
      },
      {
        ALT: () => {
          this.CONSUME(Minus, { LABEL: "unaryMinus" });
          this.SUBRULE2(this.unaryExpression, { LABEL: "operand" });
        },
      },
      {
        ALT: () => {
          this.CONSUME(Plus, { LABEL: "unaryPlus" });
          this.SUBRULE3(this.unaryExpression, { LABEL: "operand" });
        },
      },
      { ALT: () => this.SUBRULE(this.postfixExpression) },
    ]);
  });

  // ========================================================================
  // Postfix: atom followed by trailers (., ->, [], ())
  // ========================================================================

  private postfixExpression = this.RULE("postfixExpression", () => {
    this.SUBRULE(this.atom);
    this.MANY(() => {
      this.SUBRULE(this.trailer);
    });
  });

  private trailer = this.RULE("trailer", () => {
    this.OR([
      {
        ALT: () => {
          // Method/field access: .ident or .ident(args)
          this.CONSUME(Dot);
          this.CONSUME(ScriptIdentifier, { LABEL: "member" });
          this.OPTION(() => {
            this.CONSUME(LParen);
            this.SUBRULE(this.argList);
            this.CONSUME(RParen);
          });
        },
      },
      {
        ALT: () => {
          // Dynamic attribute: ->ident or ->ident(args)
          this.CONSUME(RArrow);
          this.CONSUME2(ScriptIdentifier, { LABEL: "dynMember" });
          this.OPTION2(() => {
            this.CONSUME2(LParen);
            this.SUBRULE2(this.argList);
            this.CONSUME2(RParen);
          });
        },
      },
      {
        ALT: () => {
          // Array/map indexing: [expr]
          this.CONSUME(LBracket);
          this.SUBRULE(this.expression, { LABEL: "index" });
          this.CONSUME(RBracket);
        },
      },
      {
        ALT: () => {
          // Function call: (args) — for identifiers parsed as atoms
          this.CONSUME3(LParen);
          this.SUBRULE3(this.argList);
          this.CONSUME3(RParen);
        },
      },
    ]);
  });

  // ========================================================================
  // Atoms — primary expressions
  // ========================================================================

  private atom = this.RULE("atom", () => {
    this.OR([
      {
        ALT: () => {
          // Parenthesized expression or cast: (type)expr or (expr)
          this.CONSUME(LParen);
          this.SUBRULE(this.expression);
          this.CONSUME(RParen);
        },
      },
      { ALT: () => this.CONSUME(ScriptNull) },
      { ALT: () => this.CONSUME(ScriptTrue) },
      { ALT: () => this.CONSUME(ScriptFalse) },
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(CharLiteral) },
      { ALT: () => this.CONSUME(RealLiteral) },
      { ALT: () => this.CONSUME(IntegerLiteral) },
      { ALT: () => this.SUBRULE(this.initializerList) },
      { ALT: () => this.CONSUME(ScriptIdentifier) },
    ]);
  });

  private initializerList = this.RULE("initializerList", () => {
    this.CONSUME(LBrace);
    this.OPTION(() => {
      this.SUBRULE(this.initializerEntry);
      this.MANY(() => {
        this.CONSUME(Comma);
        this.SUBRULE2(this.initializerEntry);
      });
      this.OPTION2(() => {
        this.CONSUME2(Comma); // trailing comma
      });
    });
    this.CONSUME(RBrace);
  });

  private initializerEntry = this.RULE("initializerEntry", () => {
    this.SUBRULE(this.expression, { LABEL: "value" });
    this.OPTION(() => {
      this.CONSUME(Colon);
      this.SUBRULE2(this.expression, { LABEL: "mapValue" });
    });
  });

  // ========================================================================
  // Argument list
  // ========================================================================

  private argList = this.RULE("argList", () => {
    this.OPTION(() => {
      this.SUBRULE(this.expression);
      this.MANY(() => {
        this.CONSUME(Comma);
        this.SUBRULE2(this.expression);
      });
    });
  });
}

// Singleton
let _scriptParserInstance: ScriptParser | null = null;

export function getScriptParser(): ScriptParser {
  if (!_scriptParserInstance) {
    _scriptParserInstance = new ScriptParser();
  }
  return _scriptParserInstance;
}
