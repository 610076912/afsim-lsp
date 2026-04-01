import { DocumentState } from "./document-state.js";
import { Range } from "./position-mapper.js";
export interface Diagnostic {
    range: Range;
    severity: DiagnosticSeverity;
    message: string;
    source: string;
}
export declare enum DiagnosticSeverity {
    Error = 1,
    Warning = 2,
    Information = 3,
    Hint = 4
}
export declare function computeDiagnostics(state: DocumentState): Diagnostic[];
//# sourceMappingURL=diagnostics.d.ts.map