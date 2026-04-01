/** A unit category with its valid string representations */
export interface UnitCategory {
    /** Category name (e.g. "length", "time") */
    name: string;
    /** Display name for UI */
    displayName: string;
    /** Valid unit strings that can follow a numeric value */
    units: readonly string[];
}
export declare const UNIT_CATEGORIES: readonly UnitCategory[];
/** Set of all valid unit strings across all categories */
export declare const ALL_UNIT_STRINGS: ReadonlySet<string>;
/**
 * Get all valid unit strings for completion suggestions.
 * Returns a flat array of all unit strings.
 */
export declare function getAllUnitStrings(): string[];
/**
 * Check if a string is a valid unit.
 */
export declare function isValidUnit(s: string): boolean;
//# sourceMappingURL=unit-definitions.d.ts.map