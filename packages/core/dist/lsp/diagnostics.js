// ============================================================================
// Diagnostics Service — converts parse errors to LSP Diagnostics
//
// Collects errors from:
// 1. Lexer errors (unrecognized characters)
// 2. WSF parser errors (structural issues)
// 3. Script parser errors (per-slice)
// ============================================================================
export var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    DiagnosticSeverity[DiagnosticSeverity["Error"] = 1] = "Error";
    DiagnosticSeverity[DiagnosticSeverity["Warning"] = 2] = "Warning";
    DiagnosticSeverity[DiagnosticSeverity["Information"] = 3] = "Information";
    DiagnosticSeverity[DiagnosticSeverity["Hint"] = 4] = "Hint";
})(DiagnosticSeverity || (DiagnosticSeverity = {}));
export function computeDiagnostics(state) {
    const diagnostics = [];
    const { parseResult, positionMapper } = state;
    // 1. Lexer errors
    for (const err of parseResult.lexErrors) {
        diagnostics.push(lexErrorToDiagnostic(err, positionMapper));
    }
    // 2. WSF parser errors
    for (const err of parseResult.wsfErrors) {
        diagnostics.push(parseErrorToDiagnostic(err, positionMapper, "wsf"));
    }
    // 3. Script parser errors (per slice)
    for (const entry of parseResult.scriptEntries.values()) {
        for (const err of entry.errors) {
            diagnostics.push(parseErrorToDiagnostic(err, positionMapper, "script"));
        }
        // Warn about heuristic escape (missing end_* keyword)
        if (entry.slice.escapedByHeuristic) {
            const tok = entry.slice.entryToken;
            diagnostics.push({
                range: positionMapper.tokenToRange(tok.startOffset, tok.endOffset ?? tok.startOffset),
                severity: DiagnosticSeverity.Warning,
                message: `Missing closing keyword for '${tok.image}' — script block terminated by heuristic escape`,
                source: "afsim",
            });
        }
    }
    return diagnostics;
}
function lexErrorToDiagnostic(err, mapper) {
    const startOffset = err.offset;
    const endOffset = err.offset + (err.length ?? 1) - 1;
    return {
        range: mapper.tokenToRange(startOffset, endOffset),
        severity: DiagnosticSeverity.Error,
        message: err.message,
        source: "afsim-lexer",
    };
}
function parseErrorToDiagnostic(err, mapper, source) {
    const tok = err.token;
    const startOffset = Number.isFinite(tok.startOffset) ? tok.startOffset : 0;
    const endOffset = Number.isFinite(tok.endOffset) ? tok.endOffset : startOffset;
    return {
        range: mapper.tokenToRange(startOffset, endOffset),
        severity: DiagnosticSeverity.Error,
        message: err.message,
        source: `afsim-${source}`,
    };
}
//# sourceMappingURL=diagnostics.js.map