export { createMultiModeLexer } from "./lexer/index.js";
export { sliceTokens, getWsfParser, getScriptParser, parseDocument } from "./parser/index.js";
export type { TokenSlice, SliceResult, ParseResult, ScriptCstEntry } from "./parser/index.js";
export { PositionMapper, DocumentStateManager, computeDiagnostics, DiagnosticSeverity, computeDocumentSymbols, SymbolKind, computeFoldingRanges, FoldingRangeKind, computeCompletions, CompletionItemKind, } from "./lsp/index.js";
export type { Position, Range, DocumentState, Diagnostic, DocumentSymbol, FoldingRange, CompletionItem, } from "./lsp/index.js";
export * from "./data/index.js";
export { TraceLogger, LogLevel } from "./infra/logger.js";
//# sourceMappingURL=index.d.ts.map