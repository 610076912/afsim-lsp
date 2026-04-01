// ============================================================================
// Diagnostics Service — converts parse errors to LSP Diagnostics
//
// Collects errors from:
// 1. Lexer errors (unrecognized characters)
// 2. WSF parser errors (structural issues)
// 3. Script parser errors (per-slice)
// ============================================================================

import { ILexingError, IRecognitionException } from "chevrotain";
import { DocumentState } from "./document-state.js";
import { PositionMapper, Range } from "./position-mapper.js";

export interface Diagnostic {
  range: Range;
  severity: DiagnosticSeverity;
  message: string;
  source: string;
}

export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4,
}

export function computeDiagnostics(state: DocumentState): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
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

function lexErrorToDiagnostic(err: ILexingError, mapper: PositionMapper): Diagnostic {
  const startOffset = err.offset;
  const endOffset = err.offset + (err.length ?? 1) - 1;
  return {
    range: mapper.tokenToRange(startOffset, endOffset),
    severity: DiagnosticSeverity.Error,
    message: err.message,
    source: "afsim-lexer",
  };
}

function parseErrorToDiagnostic(
  err: IRecognitionException,
  mapper: PositionMapper,
  source: "wsf" | "script"
): Diagnostic {
  const tok = err.token;
  const startOffset = Number.isFinite(tok.startOffset) ? tok.startOffset : 0;
  const endOffset = Number.isFinite(tok.endOffset) ? tok.endOffset! : startOffset;
  return {
    range: mapper.tokenToRange(startOffset, endOffset),
    severity: DiagnosticSeverity.Error,
    message: err.message,
    source: `afsim-${source}`,
  };
}
