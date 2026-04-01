// ============================================================================
// DocumentStateManager — manages per-document state and parse cache
//
// Responsibilities:
// - Stores current document text and version
// - Triggers re-parse on text changes
// - Caches parse results (ParseResult + PositionMapper)
// - Provides dirty tracking for incremental updates
// ============================================================================
import { parseDocument } from "../parser/orchestrator.js";
import { PositionMapper } from "./position-mapper.js";
export class DocumentStateManager {
    documents = new Map();
    /** Open a document and perform initial parse */
    openDocument(uri, text, version) {
        const state = this.createState(uri, text, version);
        this.documents.set(uri, state);
        return state;
    }
    /** Update a document's text and re-parse */
    updateDocument(uri, text, version) {
        const state = this.createState(uri, text, version);
        this.documents.set(uri, state);
        return state;
    }
    /** Close a document and remove its state */
    closeDocument(uri) {
        this.documents.delete(uri);
    }
    /** Get the current state for a document, or null if not open */
    getDocument(uri) {
        return this.documents.get(uri) ?? null;
    }
    /** Get all open document URIs */
    getOpenDocuments() {
        return [...this.documents.keys()];
    }
    createState(uri, text, version) {
        return {
            uri,
            text,
            version,
            parseResult: parseDocument(text),
            positionMapper: new PositionMapper(text),
        };
    }
}
//# sourceMappingURL=document-state.js.map