export interface MethodSignature {
    /** Method name */
    name: string;
    /** Return type as string */
    returnType: string;
    /** Parameter list as display string (e.g. "double x, double y") */
    params: string;
    /** Is this a static method? */
    isStatic?: boolean;
    /** Short description */
    description?: string;
}
export interface ScriptClass {
    /** Class name (e.g. "WsfPlatform") */
    name: string;
    /** Base class name if any */
    baseClass?: string;
    /** Short description */
    description: string;
    /** Key methods (representative subset for completion) */
    methods: readonly MethodSignature[];
}
export declare const BUILTIN_FUNCTIONS: readonly MethodSignature[];
export interface SystemVariable {
    name: string;
    type: string;
    description: string;
    /** Available in all contexts, or only specific ones? */
    contexts?: readonly string[];
}
export declare const SYSTEM_VARIABLES: readonly SystemVariable[];
export declare const SCRIPT_TYPE_KEYWORDS: readonly string[];
export declare const SCRIPT_CONTROL_KEYWORDS: readonly string[];
export declare const SCRIPT_MODIFIER_KEYWORDS: readonly string[];
export declare const SCRIPT_LITERAL_KEYWORDS: readonly string[];
export declare const ALL_SCRIPT_CLASSES: readonly string[];
export declare const SCRIPT_CLASS_DEFINITIONS: readonly ScriptClass[];
/**
 * Get a class definition by name.
 */
export declare function getScriptClass(name: string): ScriptClass | undefined;
/**
 * Get methods available for a given class (including inherited).
 */
export declare function getMethodsForClass(name: string): readonly MethodSignature[];
/**
 * Get system variables available in a specific script context.
 * @param contextType - WSF context type (e.g. "sensor", "processor")
 */
export declare function getSystemVariablesForContext(contextType?: string): readonly SystemVariable[];
//# sourceMappingURL=script-builtins.d.ts.map