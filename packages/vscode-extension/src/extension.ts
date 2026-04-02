import * as vscode from "vscode";
import {
  DocumentStateManager,
  computeDiagnostics,
  computeDocumentSymbols,
  computeFoldingRanges,
  computeCompletions,
  CompletionItemKind as CoreCompletionKind,
  DiagnosticSeverity as CoreSeverity,
  SymbolKind as CoreSymbolKind,
  TraceLogger,
} from "@afsim-lsp/core";
import type {
  Diagnostic as CoreDiagnostic,
  DocumentSymbol as CoreSymbol,
  FoldingRange as CoreFoldingRange,
  CompletionItem as CoreCompletionItem,
  DocumentState,
} from "@afsim-lsp/core";

const stateManager = new DocumentStateManager();
let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext): void {
  // 创建 OutputChannel 用于日志输出
  const outputChannel = vscode.window.createOutputChannel("AFSIM LSP");
  context.subscriptions.push(outputChannel);

  // 绑定 TraceLogger 的 remoteConsole
  TraceLogger.setRemoteConsole({
    log: (msg: string) => outputChannel.appendLine(msg),
  });

  diagnosticCollection = vscode.languages.createDiagnosticCollection("afsim");
  context.subscriptions.push(diagnosticCollection);

  // --- Document lifecycle ---
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) => {
      if (doc.languageId !== "afsim") return;
      const state = stateManager.openDocument(doc.uri.toString(), doc.getText(), doc.version);
      publishDiagnostics(doc.uri, state);
    }),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.languageId !== "afsim") return;
      const state = stateManager.updateDocument(
        e.document.uri.toString(), e.document.getText(), e.document.version
      );
      publishDiagnostics(e.document.uri, state);
    }),
    vscode.workspace.onDidCloseTextDocument((doc) => {
      stateManager.closeDocument(doc.uri.toString());
      diagnosticCollection.delete(doc.uri);
    }),
  );

  // --- Document Symbols provider ---
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: "afsim" },
      {
        provideDocumentSymbols(doc): vscode.DocumentSymbol[] {
          const state = stateManager.getDocument(doc.uri.toString());
          if (!state) return [];
          const symbols = computeDocumentSymbols(state);
          return symbols.map(convertSymbol);
        },
      }
    ),
  );

  // --- Folding Range provider ---
  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(
      { language: "afsim" },
      {
        provideFoldingRanges(doc): vscode.FoldingRange[] {
          const state = stateManager.getDocument(doc.uri.toString());
          if (!state) return [];
          const ranges = computeFoldingRanges(state);
          return ranges.map(convertFoldingRange);
        },
      }
    ),
  );

  // --- Completion provider ---
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: "afsim" },
      {
        provideCompletionItems(
          doc: vscode.TextDocument,
          position: vscode.Position,
          _token: vscode.CancellationToken,
          ctx: vscode.CompletionContext,
        ): vscode.CompletionItem[] {
          const state = stateManager.getDocument(doc.uri.toString());
          if (!state) return [];
          const coreItems = computeCompletions(
            state,
            { line: position.line, character: position.character },
            ctx.triggerCharacter,
          );
          return coreItems.map(convertCompletionItem);
        },
      },
      ".", ">", "/",  // trigger characters
    ),
  );

  // Process already-open documents
  for (const doc of vscode.workspace.textDocuments) {
    if (doc.languageId === "afsim") {
      const state = stateManager.openDocument(doc.uri.toString(), doc.getText(), doc.version);
      publishDiagnostics(doc.uri, state);
    }
  }
}

export function deactivate(): void {
  // cleanup handled by disposables
}

// ============================================================================
// Conversion helpers: core types → VSCode types
// ============================================================================

function publishDiagnostics(uri: vscode.Uri, state: DocumentState): void {
  const coreDiags = computeDiagnostics(state);
  diagnosticCollection.set(uri, coreDiags.map(convertDiagnostic));
}

function convertDiagnostic(d: CoreDiagnostic): vscode.Diagnostic {
  const range = new vscode.Range(
    d.range.start.line, d.range.start.character,
    d.range.end.line, d.range.end.character
  );
  const severity = d.severity === CoreSeverity.Error
    ? vscode.DiagnosticSeverity.Error
    : d.severity === CoreSeverity.Warning
    ? vscode.DiagnosticSeverity.Warning
    : d.severity === CoreSeverity.Information
    ? vscode.DiagnosticSeverity.Information
    : vscode.DiagnosticSeverity.Hint;

  const diag = new vscode.Diagnostic(range, d.message, severity);
  diag.source = d.source;
  return diag;
}

function convertSymbol(s: CoreSymbol): vscode.DocumentSymbol {
  const range = new vscode.Range(
    s.range.start.line, s.range.start.character,
    s.range.end.line, s.range.end.character
  );
  const selRange = new vscode.Range(
    s.selectionRange.start.line, s.selectionRange.start.character,
    s.selectionRange.end.line, s.selectionRange.end.character
  );
  const kind = mapSymbolKind(s.kind);
  const sym = new vscode.DocumentSymbol(s.name, "", kind, range, selRange);
  if (s.children) {
    sym.children = s.children.map(convertSymbol);
  }
  return sym;
}

function mapSymbolKind(k: CoreSymbolKind): vscode.SymbolKind {
  const map: Record<number, vscode.SymbolKind> = {
    [CoreSymbolKind.File]: vscode.SymbolKind.File,
    [CoreSymbolKind.Module]: vscode.SymbolKind.Module,
    [CoreSymbolKind.Namespace]: vscode.SymbolKind.Namespace,
    [CoreSymbolKind.Class]: vscode.SymbolKind.Class,
    [CoreSymbolKind.Method]: vscode.SymbolKind.Method,
    [CoreSymbolKind.Property]: vscode.SymbolKind.Property,
    [CoreSymbolKind.Function]: vscode.SymbolKind.Function,
    [CoreSymbolKind.Variable]: vscode.SymbolKind.Variable,
    [CoreSymbolKind.Struct]: vscode.SymbolKind.Struct,
    [CoreSymbolKind.Event]: vscode.SymbolKind.Event,
  };
  return map[k] ?? vscode.SymbolKind.Variable;
}

function convertFoldingRange(r: CoreFoldingRange): vscode.FoldingRange {
  const kind = r.kind === "comment"
    ? vscode.FoldingRangeKind.Comment
    : r.kind === "imports"
    ? vscode.FoldingRangeKind.Imports
    : vscode.FoldingRangeKind.Region;
  return new vscode.FoldingRange(r.startLine, r.endLine, kind);
}

function convertCompletionItem(item: CoreCompletionItem): vscode.CompletionItem {
  const ci = new vscode.CompletionItem(item.label, mapCompletionItemKind(item.kind));
  if (item.detail) ci.detail = item.detail;
  if (item.insertText) ci.insertText = item.insertText;
  if (item.sortText) ci.sortText = item.sortText;
  return ci;
}

function mapCompletionItemKind(k: CoreCompletionKind): vscode.CompletionItemKind {
  const map: Record<number, vscode.CompletionItemKind> = {
    [CoreCompletionKind.Keyword]: vscode.CompletionItemKind.Keyword,
    [CoreCompletionKind.Function]: vscode.CompletionItemKind.Function,
    [CoreCompletionKind.Variable]: vscode.CompletionItemKind.Variable,
    [CoreCompletionKind.Class]: vscode.CompletionItemKind.Class,
    [CoreCompletionKind.Method]: vscode.CompletionItemKind.Method,
    [CoreCompletionKind.Unit]: vscode.CompletionItemKind.Unit,
    [CoreCompletionKind.Property]: vscode.CompletionItemKind.Property,
    [CoreCompletionKind.TypeParameter]: vscode.CompletionItemKind.TypeParameter,
    [CoreCompletionKind.Snippet]: vscode.CompletionItemKind.Snippet,
  };
  return map[k] ?? vscode.CompletionItemKind.Text;
}
