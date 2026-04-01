import { createToken } from "chevrotain";
import { IDENTIFIER_PATTERN } from "./shared-tokens.js";

// ============================================================================
// SCRIPT_MODE / SCRIPT_FUNC_MODE tokens
// Keywords, operators, punctuation for the C-like scripting language
// Extracted from script.atg grammar
// ============================================================================

// ---------------------------------------------------------------------------
// Script Exit Keywords — pop back to WSF_MODE
// These end_* tokens are only recognized inside script modes
// ---------------------------------------------------------------------------

export const EndOnInitialize = createToken({
  name: "EndOnInitialize",
  pattern: /end_on_initialize2?(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnUpdate = createToken({
  name: "EndOnUpdate",
  pattern: /end_on_update(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnEntry = createToken({
  name: "EndOnEntry",
  pattern: /end_on_entry(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnExit = createToken({
  name: "EndOnExit",
  pattern: /end_on_exit(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnMessage = createToken({
  name: "EndOnMessage",
  pattern: /end_on_message(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnInit = createToken({
  name: "EndOnInit",
  pattern: /end_on_init(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnTrackDrop = createToken({
  name: "EndOnTrackDrop",
  pattern: /end_on_track_drop(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnBingo = createToken({
  name: "EndOnBingo",
  pattern: /end_on_bingo(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnEmpty = createToken({
  name: "EndOnEmpty",
  pattern: /end_on_empty(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnRefuel = createToken({
  name: "EndOnRefuel",
  pattern: /end_on_refuel(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnReserve = createToken({
  name: "EndOnReserve",
  pattern: /end_on_reserve(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnNewExecute = createToken({
  name: "EndOnNewExecute",
  pattern: /end_on_new_execute(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndOnNewFail = createToken({
  name: "EndOnNewFail",
  pattern: /end_on_new_fail(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndPrecondition = createToken({
  name: "EndPrecondition",
  pattern: /end_precondition(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndNextState = createToken({
  name: "EndNextState",
  pattern: /end_next_state(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndScriptVariables = createToken({
  name: "EndScriptVariables",
  pattern: /end_script_variables(?![A-Za-z0-9_])/,
  pop_mode: true,
});

// end_execute and end_script — pop from SCRIPT_MODE / SCRIPT_FUNC_MODE
export const EndExecute = createToken({
  name: "EndExecute",
  pattern: /end_execute(?![A-Za-z0-9_])/,
  pop_mode: true,
});

export const EndScript = createToken({
  name: "EndScript",
  pattern: /end_script(?![A-Za-z0-9_])/,
  pop_mode: true,
});

// ---------------------------------------------------------------------------
// Script Language Keywords (from script.atg TOKENS section)
// ---------------------------------------------------------------------------

export const ScriptIf = createToken({ name: "ScriptIf", pattern: /if(?![A-Za-z0-9_])/ });
export const ScriptElse = createToken({ name: "ScriptElse", pattern: /else(?![A-Za-z0-9_])/ });
export const ScriptWhile = createToken({ name: "ScriptWhile", pattern: /while(?![A-Za-z0-9_])/ });
export const ScriptDo = createToken({ name: "ScriptDo", pattern: /do(?![A-Za-z0-9_])/ });
export const ScriptFor = createToken({ name: "ScriptFor", pattern: /for(?![A-Za-z0-9_])/, longer_alt: undefined });
export const ScriptForeach = createToken({ name: "ScriptForeach", pattern: /foreach(?![A-Za-z0-9_])/ });
export const ScriptIn = createToken({ name: "ScriptIn", pattern: /in(?![A-Za-z0-9_])/ });
export const ScriptBreak = createToken({ name: "ScriptBreak", pattern: /break(?![A-Za-z0-9_])/ });
export const ScriptContinue = createToken({ name: "ScriptContinue", pattern: /continue(?![A-Za-z0-9_])/ });
export const ScriptReturn = createToken({ name: "ScriptReturn", pattern: /return(?![A-Za-z0-9_])/ });
export const ScriptNull = createToken({ name: "ScriptNull", pattern: /(?:null|NULL)(?![A-Za-z0-9_])/ });
export const ScriptTrue = createToken({ name: "ScriptTrue", pattern: /true(?![A-Za-z0-9_])/ });
export const ScriptFalse = createToken({ name: "ScriptFalse", pattern: /false(?![A-Za-z0-9_])/ });

// Type keywords
export const ScriptString = createToken({ name: "ScriptString", pattern: /string(?![A-Za-z0-9_])/ });
export const ScriptInt = createToken({ name: "ScriptInt", pattern: /int(?![A-Za-z0-9_])/ });
export const ScriptDouble = createToken({ name: "ScriptDouble", pattern: /double(?![A-Za-z0-9_])/ });
export const ScriptChar = createToken({ name: "ScriptChar", pattern: /char(?![A-Za-z0-9_])/ });
export const ScriptBool = createToken({ name: "ScriptBool", pattern: /bool(?![A-Za-z0-9_])/ });

// Storage class specifiers
export const ScriptGlobal = createToken({ name: "ScriptGlobal", pattern: /global(?![A-Za-z0-9_])/ });
export const ScriptStatic = createToken({ name: "ScriptStatic", pattern: /static(?![A-Za-z0-9_])/ });
export const ScriptExtern = createToken({ name: "ScriptExtern", pattern: /extern(?![A-Za-z0-9_])/ });

// ---------------------------------------------------------------------------
// Operators (from script.atg TOKENS section)
// Multi-char operators must come before single-char ones
// ---------------------------------------------------------------------------

// Comparison & Equality
export const EqEq = createToken({ name: "EqEq", pattern: /==/ });
export const NotEq = createToken({ name: "NotEq", pattern: /!=/ });
export const GtEq = createToken({ name: "GtEq", pattern: />=/ });
export const LtEq = createToken({ name: "LtEq", pattern: /<=/ });

// Logical
export const AndAnd = createToken({ name: "AndAnd", pattern: /&&/ });
export const OrOr = createToken({ name: "OrOr", pattern: /\|\|/ });
export const Not = createToken({ name: "Not", pattern: /!/ });

// Assignment operators
export const PlusAssign = createToken({ name: "PlusAssign", pattern: /\+=/ });
export const MinusAssign = createToken({ name: "MinusAssign", pattern: /-=/ });
export const TimesAssign = createToken({ name: "TimesAssign", pattern: /\*=/ });
export const DivAssign = createToken({ name: "DivAssign", pattern: /\/=/ });

// Arrow
export const RArrow = createToken({ name: "RArrow", pattern: /->/ });

// Single-char operators
export const Assign = createToken({ name: "Assign", pattern: /=/ });
export const Plus = createToken({ name: "Plus", pattern: /\+/ });
export const Minus = createToken({ name: "Minus", pattern: /-/ });
export const Star = createToken({ name: "Star", pattern: /\*/ });
export const Slash = createToken({ name: "Slash", pattern: /\// });
export const Caret = createToken({ name: "Caret", pattern: /\^/ });
export const LAngle = createToken({ name: "LAngle", pattern: /</ });
export const RAngle = createToken({ name: "RAngle", pattern: />/ });

// ---------------------------------------------------------------------------
// Punctuation
// ---------------------------------------------------------------------------

export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const LBrace = createToken({ name: "LBrace", pattern: /\{/ });
export const RBrace = createToken({ name: "RBrace", pattern: /\}/ });
export const LBracket = createToken({ name: "LBracket", pattern: /\[/ });
export const RBracket = createToken({ name: "RBracket", pattern: /\]/ });
export const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Dot = createToken({ name: "Dot", pattern: /\./ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });

// ---------------------------------------------------------------------------
// Preprocessor variable: $<varName>$ or $<varName:default>$
// ---------------------------------------------------------------------------

export const PreprocessorVar = createToken({
  name: "PreprocessorVar",
  pattern: /\$<[^:\n>]*(?::|\>\$)/,
});

// ---------------------------------------------------------------------------
// Script Identifier — fallback for anything not matched by keywords
// Must be placed LAST in the SCRIPT_MODE token list
// ---------------------------------------------------------------------------

export const ScriptIdentifier = createToken({
  name: "ScriptIdentifier",
  pattern: IDENTIFIER_PATTERN,
});
