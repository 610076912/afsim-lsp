/** WSF keyword entry with optional detail for completion display */
export interface WsfKeywordEntry {
    /** The keyword text */
    keyword: string;
    /** Short description for completion detail */
    detail?: string;
    /** The corresponding end keyword (if this is a block keyword) */
    endKeyword?: string;
}
export declare const WSF_TOP_LEVEL_BLOCK_KEYWORDS: readonly WsfKeywordEntry[];
export declare const WSF_TOP_LEVEL_COMMANDS: readonly WsfKeywordEntry[];
export declare const WSF_PLATFORM_COMMANDS: readonly WsfKeywordEntry[];
export declare const WSF_PLATFORM_INSTANCE_COMMANDS: readonly WsfKeywordEntry[];
export declare const WSF_SENSOR_COMMANDS: readonly WsfKeywordEntry[];
export declare const WSF_PROCESSOR_COMMANDS: readonly WsfKeywordEntry[];
export declare const WSF_SCRIPT_PROCESSOR_COMMANDS: readonly WsfKeywordEntry[];
export declare const WSF_STATE_COMMANDS: readonly WsfKeywordEntry[];
export declare const WSF_BEHAVIOR_TREE_COMMANDS: readonly WsfKeywordEntry[];
export declare const WSF_COMM_COMMANDS: readonly WsfKeywordEntry[];
export declare const WSF_MOVER_COMMANDS: readonly WsfKeywordEntry[];
export declare const WSF_ROUTE_COMMANDS: readonly WsfKeywordEntry[];
export declare const SCRIPT_ENTRY_KEYWORDS: readonly WsfKeywordEntry[];
export declare const WSF_BOOLEAN_KEYWORDS: readonly string[];
export type WsfBlockContext = "root" | "platform_type" | "platform" | "sensor" | "processor" | "script_processor" | "comm" | "mover" | "route" | "state" | "behavior_tree";
/**
 * Get applicable WSF keywords for a given block context.
 */
export declare function getWsfKeywordsForContext(context: WsfBlockContext): readonly WsfKeywordEntry[];
//# sourceMappingURL=wsf-keywords.d.ts.map