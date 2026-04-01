// ============================================================================
// Completions — context-aware auto-completion service
//
// Determines the cursor context (WSF vs Script, block type) from the
// cached parse result in DocumentState, then returns relevant completions.
// ============================================================================
import { getWsfKeywordsForContext, WSF_BOOLEAN_KEYWORDS, } from "../data/wsf-keywords.js";
import { getAllUnitStrings } from "../data/unit-definitions.js";
import { getTypesForComponent } from "../data/wsf-structs.js";
import { BUILTIN_FUNCTIONS, SYSTEM_VARIABLES, SCRIPT_TYPE_KEYWORDS, SCRIPT_CONTROL_KEYWORDS, SCRIPT_MODIFIER_KEYWORDS, SCRIPT_LITERAL_KEYWORDS, ALL_SCRIPT_CLASSES, getMethodsForClass, getSystemVariablesForContext, } from "../data/script-builtins.js";
// ---------------------------------------------------------------------------
// Main completion function
// ---------------------------------------------------------------------------
/**
 * Compute completion items for a given document and cursor position.
 */
export function computeCompletions(state, position, triggerCharacter) {
    const offset = state.positionMapper.positionToOffset(position);
    if (offset < 0)
        return [];
    const { parseResult } = state;
    const { allTokens, sliceResult } = parseResult;
    // Determine if the cursor is inside a script block
    const scriptContext = findScriptContext(offset, sliceResult.slices, parseResult.scriptEntries);
    if (scriptContext) {
        // Script mode completions
        if (triggerCharacter === ".") {
            return computeDotCompletions(offset, scriptContext, allTokens, state.text);
        }
        return computeScriptCompletions(scriptContext);
    }
    // WSF mode completions
    return computeWsfCompletions(offset, allTokens, state.text, triggerCharacter);
}
function findScriptContext(offset, slices, scriptEntries) {
    for (const slice of slices) {
        const entryEnd = (slice.entryToken.endOffset ?? slice.entryToken.startOffset) + 1;
        const exitStart = slice.exitToken
            ? slice.exitToken.startOffset
            : Infinity;
        if (offset >= entryEnd && offset <= exitStart) {
            const entry = scriptEntries.get(slice.entryToken);
            if (entry) {
                return {
                    slice,
                    entry,
                    injectedContextType: slice.injectedContextType,
                };
            }
        }
    }
    return null;
}
// ---------------------------------------------------------------------------
// WSF completions
// ---------------------------------------------------------------------------
/** Token names that indicate the preceding token is a block-open keyword */
const BLOCK_KEYWORD_TO_CONTEXT = new Map([
    ["PlatformType", "platform_type"],
    ["Platform", "platform"],
    ["Sensor", "sensor"],
    ["Processor", "processor"],
    ["Comm", "comm"],
    ["Mover", "mover"],
    ["Route", "route"],
    ["State", "state"],
    ["Sequence", "behavior_tree"],
    ["SequenceWithMemory", "behavior_tree"],
    ["Selector", "behavior_tree"],
    ["SelectorWithMemory", "behavior_tree"],
    ["Parallel", "behavior_tree"],
]);
/** Components where we can suggest types */
const COMPONENT_TYPE_KEYWORDS = new Set([
    "sensor", "processor", "comm", "network", "mover", "fuel",
    "filter", "field_of_view", "propagation", "attenuation",
]);
function computeWsfCompletions(offset, allTokens, text, triggerCharacter) {
    // Find the WSF block context at this offset
    const context = determineWsfContext(offset, allTokens);
    // Check if the previous token is a block keyword that expects a type
    const prevToken = findTokenBefore(offset, allTokens);
    if (prevToken) {
        const prevImage = prevToken.image.toLowerCase();
        // After a number, suggest units
        if (prevToken.tokenType.name === "IntegerLiteral" ||
            prevToken.tokenType.name === "RealLiteral") {
            return getUnitCompletions();
        }
        // After component keywords (sensor/processor/etc.), after the name,
        // suggest component types
        const prevPrevToken = findTokenBefore(prevToken.startOffset, allTokens);
        if (prevPrevToken && COMPONENT_TYPE_KEYWORDS.has(prevPrevToken.image.toLowerCase())) {
            const kw = prevPrevToken.image.toLowerCase();
            const types = getTypesForComponent(kw);
            return types.map(t => ({
                label: t.name,
                kind: 7 /* CompletionItemKind.Class */,
                detail: t.description,
                sortText: `0_${t.name}`,
            }));
        }
        // After a boolean command, suggest boolean values
        if (prevImage === "true" || prevImage === "false" ||
            prevImage === "yes" || prevImage === "no") {
            // Don't suggest more booleans after a boolean
        }
    }
    const items = [];
    // Context-specific keywords
    const keywords = getWsfKeywordsForContext(context);
    for (const kw of keywords) {
        items.push({
            label: kw.keyword,
            kind: 14 /* CompletionItemKind.Keyword */,
            detail: kw.detail,
            sortText: `1_${kw.keyword}`,
        });
    }
    // Boolean values
    for (const b of WSF_BOOLEAN_KEYWORDS) {
        items.push({
            label: b,
            kind: 14 /* CompletionItemKind.Keyword */,
            detail: "Boolean value",
            sortText: `3_${b}`,
        });
    }
    return items;
}
function determineWsfContext(offset, allTokens) {
    // Walk backwards through the token stream to find the innermost block context
    // Use a simple stack-based approach: block-open pushes, block-close pops
    const blockStack = [];
    for (const token of allTokens) {
        if (token.startOffset >= offset)
            break;
        const contextType = BLOCK_KEYWORD_TO_CONTEXT.get(token.tokenType.name);
        if (contextType) {
            blockStack.push(contextType);
        }
        // Check for end keywords that pop the stack
        const name = token.tokenType.name;
        if (name.startsWith("End") && name !== "EndTime" && name !== "EndFile") {
            if (blockStack.length > 0) {
                blockStack.pop();
            }
        }
    }
    return blockStack.length > 0 ? blockStack[blockStack.length - 1] : "root";
}
// ---------------------------------------------------------------------------
// Script completions
// ---------------------------------------------------------------------------
function computeScriptCompletions(ctx) {
    const items = [];
    // Type keywords
    for (const kw of SCRIPT_TYPE_KEYWORDS) {
        items.push({
            label: kw,
            kind: 25 /* CompletionItemKind.TypeParameter */,
            detail: "Type keyword",
            sortText: `0_${kw}`,
        });
    }
    // Control flow keywords
    for (const kw of SCRIPT_CONTROL_KEYWORDS) {
        items.push({
            label: kw,
            kind: 14 /* CompletionItemKind.Keyword */,
            detail: "Control flow",
            sortText: `1_${kw}`,
        });
    }
    // Modifier keywords
    for (const kw of SCRIPT_MODIFIER_KEYWORDS) {
        items.push({
            label: kw,
            kind: 14 /* CompletionItemKind.Keyword */,
            detail: "Modifier",
            sortText: `1_${kw}`,
        });
    }
    // Literal keywords
    for (const kw of SCRIPT_LITERAL_KEYWORDS) {
        items.push({
            label: kw,
            kind: 14 /* CompletionItemKind.Keyword */,
            detail: "Literal",
            sortText: `2_${kw}`,
        });
    }
    // Built-in functions
    for (const fn of BUILTIN_FUNCTIONS) {
        items.push({
            label: fn.name,
            kind: 3 /* CompletionItemKind.Function */,
            detail: `${fn.returnType} ${fn.name}(${fn.params})`,
            sortText: `3_${fn.name}`,
        });
    }
    // System variables (context-aware)
    const contextType = mapInjectedContextToType(ctx.injectedContextType);
    const sysVars = getSystemVariablesForContext(contextType);
    for (const v of sysVars) {
        items.push({
            label: v.name,
            kind: 6 /* CompletionItemKind.Variable */,
            detail: `${v.type} — ${v.description}`,
            sortText: `4_${v.name}`,
        });
    }
    // Script class names (for type references / constructors)
    for (const cls of ALL_SCRIPT_CLASSES) {
        items.push({
            label: cls,
            kind: 7 /* CompletionItemKind.Class */,
            detail: "Script class",
            sortText: `5_${cls}`,
        });
    }
    return items;
}
// ---------------------------------------------------------------------------
// Dot-triggered completions (member access)
// ---------------------------------------------------------------------------
function computeDotCompletions(offset, ctx, allTokens, text) {
    // Find the token just before the dot
    const tokenBefore = findTokenBefore(offset - 1, allTokens);
    if (!tokenBefore)
        return [];
    const image = tokenBefore.image;
    // Check if it's a known system variable
    const sysVar = SYSTEM_VARIABLES.find(v => v.name === image);
    if (sysVar) {
        return getMethodCompletions(sysVar.type);
    }
    // Check if it's a known class name (static methods)
    if (ALL_SCRIPT_CLASSES.includes(image)) {
        return getMethodCompletions(image, true);
    }
    // If we can't determine the type, return empty
    // (Future: walk the CST to resolve variable types)
    return [];
}
function getMethodCompletions(className, staticOnly) {
    const methods = getMethodsForClass(className);
    const items = [];
    for (const m of methods) {
        if (staticOnly && !m.isStatic)
            continue;
        items.push({
            label: m.name,
            kind: 2 /* CompletionItemKind.Method */,
            detail: `${m.returnType} ${m.name}(${m.params})`,
            insertText: m.params === "" ? `${m.name}()` : m.name,
            sortText: `0_${m.name}`,
        });
    }
    return items;
}
// ---------------------------------------------------------------------------
// Unit completions
// ---------------------------------------------------------------------------
function getUnitCompletions() {
    return getAllUnitStrings().map(u => ({
        label: u,
        kind: 12 /* CompletionItemKind.Unit */,
        detail: "Unit",
        sortText: `0_${u}`,
    }));
}
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function findTokenBefore(offset, allTokens) {
    let result = null;
    for (const token of allTokens) {
        const endOff = (token.endOffset ?? token.startOffset) + 1;
        if (endOff <= offset) {
            result = token;
        }
        else {
            break;
        }
    }
    return result;
}
function mapInjectedContextToType(injectedContextType) {
    if (!injectedContextType)
        return undefined;
    // Map token type names (from inferContextType in token-slicer.ts)
    // and WSF struct names to script context keys
    const map = {
        // Token type names returned by the slicer
        Sensor: "sensor",
        Processor: "processor",
        Comm: "comm",
        Mover: "mover",
        Platform: "platform",
        PlatformType: "platform",
        Router: "comm",
        Network: "comm",
        Fuel: "fuel",
        Transmitter: "comm",
        Receiver: "comm",
        // WSF struct names (in case the slicer is updated)
        WSF_PLATFORM: "platform",
        WSF_SENSOR: "sensor",
        WSF_SCRIPT_PROCESSOR: "processor",
        WSF_TRACK_PROCESSOR: "track_processor",
        WSF_COMM_TRANSCEIVER: "comm",
    };
    return map[injectedContextType];
}
//# sourceMappingURL=completions.js.map