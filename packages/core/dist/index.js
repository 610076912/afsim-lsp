// Core package entry point
export { createMultiModeLexer } from "./lexer/index.js";
export { sliceTokens, getWsfParser, getScriptParser, parseDocument } from "./parser/index.js";
export { PositionMapper, DocumentStateManager, computeDiagnostics, DiagnosticSeverity, computeDocumentSymbols, SymbolKind, computeFoldingRanges, FoldingRangeKind, computeCompletions, } from "./lsp/index.js";
// Data layer
export * from "./data/index.js";
// Infrastructure
export { TraceLogger, LogLevel } from "./infra/logger.js";
//# sourceMappingURL=index.js.map