import type { DocumentState } from "./document-state.js";
import type { Position } from "./position-mapper.js";
export declare const enum CompletionItemKind {
    Keyword = 14,
    Function = 3,
    Variable = 6,
    Class = 7,
    Method = 2,
    Unit = 12,// maps to LSP "Unit"
    Property = 10,
    TypeParameter = 25,
    Snippet = 15
}
export interface CompletionItem {
    label: string;
    kind: CompletionItemKind;
    detail?: string;
    /** Insert text (if different from label) */
    insertText?: string;
    /** Sort priority (lower = higher priority) */
    sortText?: string;
}
export declare const enum TriggerKind {
    /** User typed or invoked completion manually */
    Invoked = 0,
    /** Triggered by '.' */
    Dot = 1,
    /** Triggered by '->' */
    Arrow = 2
}
/**
 * Compute completion items for a given document and cursor position.
 */
export declare function computeCompletions(state: DocumentState, position: Position, triggerCharacter?: string): CompletionItem[];
//# sourceMappingURL=completions.d.ts.map