// ============================================================================
// DocumentStateManager — manages per-document state and parse cache
//
// Responsibilities:
// - Stores current document text and version
// - Triggers re-parse on text changes
// - Caches parse results (ParseResult + PositionMapper)
// - Provides dirty tracking for incremental updates
// ============================================================================

import { ParseResult, parseDocument } from "../parser/orchestrator.js";
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

export class DocumentStateManager {
  private documents = new Map<string, DocumentState>();

  /** Open a document and perform initial parse */
  openDocument(uri: string, text: string, version: number): DocumentState {
    const state = this.createState(uri, text, version);
    this.documents.set(uri, state);
    return state;
  }

  /** Update a document's text and re-parse */
  updateDocument(uri: string, text: string, version: number): DocumentState {
    const state = this.createState(uri, text, version);
    this.documents.set(uri, state);
    return state;
  }

  /** Close a document and remove its state */
  closeDocument(uri: string): void {
    this.documents.delete(uri);
  }

  /** Get the current state for a document, or null if not open */
  getDocument(uri: string): DocumentState | null {
    return this.documents.get(uri) ?? null;
  }

  /** Get all open document URIs */
  getOpenDocuments(): string[] {
    return [...this.documents.keys()];
  }

  private createState(uri: string, text: string, version: number): DocumentState {
    return {
      uri,
      text,
      version,
      parseResult: parseDocument(text),
      positionMapper: new PositionMapper(text),
    };
  }
}
