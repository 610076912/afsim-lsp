import { ParseResult } from "../parser/orchestrator.js";
import { PositionMapper } from "./position-mapper.js";
export interface DocumentState {
    /** The document URI (unique identifier) */
    uri: string;
    /** Current document text */
    text: string;
    /** Document version (incremented on each change) */
    version: number;
    /** Cached parse result */
    parseResult: ParseResult;
    /** Cached position mapper */
    positionMapper: PositionMapper;
}
export declare class DocumentStateManager {
    private documents;
    /** Open a document and perform initial parse */
    openDocument(uri: string, text: string, version: number): DocumentState;
    /** Update a document's text and re-parse */
    updateDocument(uri: string, text: string, version: number): DocumentState;
    /** Close a document and remove its state */
    closeDocument(uri: string): void;
    /** Get the current state for a document, or null if not open */
    getDocument(uri: string): DocumentState | null;
    /** Get all open document URIs */
    getOpenDocuments(): string[];
    private createState;
}
//# sourceMappingURL=document-state.d.ts.map