/** A WSF struct type with its inheritance and available sub-types */
export interface WsfStructType {
    /** The struct name as used in type position (e.g. "WSF_AIR_MOVER") */
    name: string;
    /** Human-readable description */
    description: string;
    /** Base type (if this struct inherits from another) */
    baseType?: string;
}
export declare const WSF_SENSOR_TYPES: readonly WsfStructType[];
export declare const WSF_PROCESSOR_TYPES: readonly WsfStructType[];
export declare const WSF_MOVER_TYPES: readonly WsfStructType[];
export declare const WSF_COMM_TYPES: readonly WsfStructType[];
export declare const WSF_NETWORK_TYPES: readonly WsfStructType[];
export declare const WSF_FUEL_TYPES: readonly WsfStructType[];
export declare const WSF_FILTER_TYPES: readonly WsfStructType[];
export declare const WSF_FOV_TYPES: readonly WsfStructType[];
export declare const WSF_PROPAGATION_TYPES: readonly WsfStructType[];
export declare const WSF_ATTENUATION_TYPES: readonly WsfStructType[];
export type ComponentKeyword = "sensor" | "processor" | "mover" | "comm" | "network" | "fuel" | "filter" | "field_of_view" | "propagation" | "attenuation";
/**
 * Get available struct types for a given component keyword.
 */
export declare function getTypesForComponent(keyword: ComponentKeyword): readonly WsfStructType[];
//# sourceMappingURL=wsf-structs.d.ts.map