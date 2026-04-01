import * as vscode from "vscode";
import { DocumentStateManager, computeDiagnostics, computeDocumentSymbols, computeFoldingRanges, computeCompletions, DiagnosticSeverity as CoreSeverity, SymbolKind as CoreSymbolKind, } from "@afsim-lsp/core";
const stateManager = new DocumentStateManager();
let diagnosticCollection;
export function activate(context) {
    diagnosticCollection = vscode.languages.createDiagnosticCollection("afsim");
    context.subscriptions.push(diagnosticCollection);
    // --- Document lifecycle ---
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((doc) => {
        if (doc.languageId !== "afsim")
            return;
        const state = stateManager.openDocument(doc.uri.toString(), doc.getText(), doc.version);
        publishDiagnostics(doc.uri, state);
    }), vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.languageId !== "afsim")
            return;
        const state = stateManager.updateDocument(e.document.uri.toString(), e.document.getText(), e.document.version);
        publishDiagnostics(e.document.uri, state);
    }), vscode.workspace.onDidCloseTextDocument((doc) => {
        stateManager.closeDocument(doc.uri.toString());
        diagnosticCollection.delete(doc.uri);
    }));
    // --- Document Symbols provider ---
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "afsim" }, {
        provideDocumentSymbols(doc) {
            const state = stateManager.getDocument(doc.uri.toString());
            if (!state)
                return [];
            const symbols = computeDocumentSymbols(state);
            return symbols.map(convertSymbol);
        },
    }));
    // --- Folding Range provider ---
    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: "afsim" }, {
        provideFoldingRanges(doc) {
            const state = stateManager.getDocument(doc.uri.toString());
            if (!state)
                return [];
            const ranges = computeFoldingRanges(state);
            return ranges.map(convertFoldingRange);
        },
    }));
    // --- Completion provider ---
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: "afsim" }, {
        provideCompletionItems(doc, position, _token, ctx) {
            const state = stateManager.getDocument(doc.uri.toString());
            if (!state)
                return [];
            const coreItems = computeCompletions(state, { line: position.line, character: position.character }, ctx.triggerCharacter);
            return coreItems.map(convertCompletionItem);
        },
    }, ".", ">", "/"));
    // Process already-open documents
    for (const doc of vscode.workspace.textDocuments) {
        if (doc.languageId === "afsim") {
            const state = stateManager.openDocument(doc.uri.toString(), doc.getText(), doc.version);
            publishDiagnostics(doc.uri, state);
        }
    }
}
export function deactivate() {
    // cleanup handled by disposables
}
// ============================================================================
// Conversion helpers: core types → VSCode types
// ============================================================================
function publishDiagnostics(uri, state) {
    const coreDiags = computeDiagnostics(state);
    diagnosticCollection.set(uri, coreDiags.map(convertDiagnostic));
}
function convertDiagnostic(d) {
    const range = new vscode.Range(d.range.start.line, d.range.start.character, d.range.end.line, d.range.end.character);
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
function convertSymbol(s) {
    const range = new vscode.Range(s.range.start.line, s.range.start.character, s.range.end.line, s.range.end.character);
    const selRange = new vscode.Range(s.selectionRange.start.line, s.selectionRange.start.character, s.selectionRange.end.line, s.selectionRange.end.character);
    const kind = mapSymbolKind(s.kind);
    const sym = new vscode.DocumentSymbol(s.name, "", kind, range, selRange);
    if (s.children) {
        sym.children = s.children.map(convertSymbol);
    }
    return sym;
}
function mapSymbolKind(k) {
    const map = {
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
function convertFoldingRange(r) {
    const kind = r.kind === "comment"
        ? vscode.FoldingRangeKind.Comment
        : r.kind === "imports"
            ? vscode.FoldingRangeKind.Imports
            : vscode.FoldingRangeKind.Region;
    return new vscode.FoldingRange(r.startLine, r.endLine, kind);
}
function convertCompletionItem(item) {
    const ci = new vscode.CompletionItem(item.label, mapCompletionItemKind(item.kind));
    if (item.detail)
        ci.detail = item.detail;
    if (item.insertText)
        ci.insertText = item.insertText;
    if (item.sortText)
        ci.sortText = item.sortText;
    return ci;
}
function mapCompletionItemKind(k) {
    const map = {
        [14 /* CoreCompletionKind.Keyword */]: vscode.CompletionItemKind.Keyword,
        [3 /* CoreCompletionKind.Function */]: vscode.CompletionItemKind.Function,
        [6 /* CoreCompletionKind.Variable */]: vscode.CompletionItemKind.Variable,
        [7 /* CoreCompletionKind.Class */]: vscode.CompletionItemKind.Class,
        [2 /* CoreCompletionKind.Method */]: vscode.CompletionItemKind.Method,
        [12 /* CoreCompletionKind.Unit */]: vscode.CompletionItemKind.Unit,
        [10 /* CoreCompletionKind.Property */]: vscode.CompletionItemKind.Property,
        [25 /* CoreCompletionKind.TypeParameter */]: vscode.CompletionItemKind.TypeParameter,
        [15 /* CoreCompletionKind.Snippet */]: vscode.CompletionItemKind.Snippet,
    };
    return map[k] ?? vscode.CompletionItemKind.Text;
}
//# sourceMappingURL=extension.js.map