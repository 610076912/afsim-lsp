// ============================================================================
// Document Symbols Service — produces outline/symbol tree
//
// Extracts:
// - WSF blocks (platform_type, platform, sensor, processor, etc.) as Modules
// - Script entry blocks (on_initialize, on_update, etc.) as Methods
// - Script function definitions as Functions
// - Key-value pairs as Properties
// ============================================================================
export var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["File"] = 1] = "File";
    SymbolKind[SymbolKind["Module"] = 2] = "Module";
    SymbolKind[SymbolKind["Namespace"] = 3] = "Namespace";
    SymbolKind[SymbolKind["Package"] = 4] = "Package";
    SymbolKind[SymbolKind["Class"] = 5] = "Class";
    SymbolKind[SymbolKind["Method"] = 6] = "Method";
    SymbolKind[SymbolKind["Property"] = 7] = "Property";
    SymbolKind[SymbolKind["Field"] = 8] = "Field";
    SymbolKind[SymbolKind["Constructor"] = 9] = "Constructor";
    SymbolKind[SymbolKind["Enum"] = 10] = "Enum";
    SymbolKind[SymbolKind["Interface"] = 11] = "Interface";
    SymbolKind[SymbolKind["Function"] = 12] = "Function";
    SymbolKind[SymbolKind["Variable"] = 13] = "Variable";
    SymbolKind[SymbolKind["Constant"] = 14] = "Constant";
    SymbolKind[SymbolKind["String"] = 15] = "String";
    SymbolKind[SymbolKind["Number"] = 16] = "Number";
    SymbolKind[SymbolKind["Boolean"] = 17] = "Boolean";
    SymbolKind[SymbolKind["Array"] = 18] = "Array";
    SymbolKind[SymbolKind["Object"] = 19] = "Object";
    SymbolKind[SymbolKind["Key"] = 20] = "Key";
    SymbolKind[SymbolKind["Null"] = 21] = "Null";
    SymbolKind[SymbolKind["EnumMember"] = 22] = "EnumMember";
    SymbolKind[SymbolKind["Struct"] = 23] = "Struct";
    SymbolKind[SymbolKind["Event"] = 24] = "Event";
    SymbolKind[SymbolKind["Operator"] = 25] = "Operator";
    SymbolKind[SymbolKind["TypeParameter"] = 26] = "TypeParameter";
})(SymbolKind || (SymbolKind = {}));
export function computeDocumentSymbols(state) {
    const symbols = [];
    const { parseResult, positionMapper } = state;
    const cst = parseResult.wsfCst;
    if (!cst || !cst.children.topLevelDecl)
        return symbols;
    for (const declNode of cst.children.topLevelDecl) {
        const sym = extractSymbolFromDecl(declNode, positionMapper, state);
        if (sym)
            symbols.push(sym);
    }
    return symbols;
}
function extractSymbolFromDecl(node, mapper, state) {
    // Check which alternative was matched
    if (node.children.platformTypeBlock) {
        return extractBlockSymbol(node.children.platformTypeBlock[0], "PlatformType", "typeName", SymbolKind.Class, mapper, state);
    }
    if (node.children.platformBlock) {
        return extractBlockSymbol(node.children.platformBlock[0], "Platform", "platformName", SymbolKind.Module, mapper, state);
    }
    if (node.children.wsfCommand) {
        return extractCommandSymbol(node.children.wsfCommand[0], mapper);
    }
    if (node.children.scriptPlaceholder) {
        return extractScriptPlaceholderSymbol(node.children.scriptPlaceholder[0], mapper, state);
    }
    return null;
}
function extractBlockSymbol(blockNode, blockType, nameLabel, kind, mapper, state) {
    const nameToken = blockNode.children[nameLabel]?.[0];
    const name = nameToken ? `${blockType} ${nameToken.image}` : blockType;
    const range = nodeRange(blockNode, mapper);
    const selectionRange = nameToken
        ? mapper.tokenToRange(nameToken.startOffset, nameToken.endOffset ?? nameToken.startOffset)
        : range;
    const children = [];
    // Extract children from content rules
    const contentKeys = [
        "platformTypeContent", "sensorBlock", "processorBlock",
        "commBlock", "moverBlock", "fuelBlock", "routerBlock",
        "networkBlock", "visualPartBlock", "thermalSystemBlock",
        "scriptPlaceholder", "wsfCommand",
    ];
    for (const key of contentKeys) {
        const childNodes = blockNode.children[key];
        if (!childNodes)
            continue;
        for (const child of childNodes) {
            const childSym = extractContentSymbol(child, key, mapper, state);
            if (childSym)
                children.push(childSym);
        }
    }
    return { name, kind, range, selectionRange, children: children.length > 0 ? children : undefined };
}
function extractContentSymbol(node, key, mapper, state) {
    // Nested block types within platformTypeContent
    if (node.children) {
        // Check for nested blocks inside platformTypeContent
        const nestedBlockKeys = [
            "sensorBlock", "processorBlock", "commBlock", "moverBlock",
            "fuelBlock", "routerBlock", "networkBlock", "visualPartBlock",
            "thermalSystemBlock",
        ];
        for (const bk of nestedBlockKeys) {
            if (node.children[bk]) {
                const innerNode = node.children[bk][0];
                return extractComponentSymbol(innerNode, bk, mapper, state);
            }
        }
        if (node.children.scriptPlaceholder) {
            return extractScriptPlaceholderSymbol(node.children.scriptPlaceholder[0], mapper, state);
        }
        if (node.children.wsfCommand) {
            return extractCommandSymbol(node.children.wsfCommand[0], mapper);
        }
    }
    // Direct block nodes (when key IS the block type)
    if (key.endsWith("Block") && key !== "platformTypeContent") {
        return extractComponentSymbol(node, key, mapper, state);
    }
    if (key === "scriptPlaceholder") {
        return extractScriptPlaceholderSymbol(node, mapper, state);
    }
    if (key === "wsfCommand") {
        return extractCommandSymbol(node, mapper);
    }
    return null;
}
function extractComponentSymbol(node, blockKey, mapper, state) {
    const blockName = blockKey.replace("Block", "");
    const capitalName = blockName.charAt(0).toUpperCase() + blockName.slice(1);
    const nameKeys = [blockName + "Name", blockName + "Type", "partName", "tsName"];
    let displayName = capitalName;
    for (const nk of nameKeys) {
        const tok = node.children[nk]?.[0];
        if (tok) {
            displayName = `${capitalName} ${tok.image}`;
            break;
        }
    }
    const range = nodeRange(node, mapper);
    const children = [];
    // Extract script placeholders and commands inside component
    if (node.children.scriptPlaceholder) {
        for (const sp of node.children.scriptPlaceholder) {
            const sym = extractScriptPlaceholderSymbol(sp, mapper, state);
            if (sym)
                children.push(sym);
        }
    }
    if (node.children.wsfCommand) {
        for (const cmd of node.children.wsfCommand) {
            const sym = extractCommandSymbol(cmd, mapper);
            if (sym)
                children.push(sym);
        }
    }
    return {
        name: displayName,
        kind: SymbolKind.Class,
        range,
        selectionRange: range,
        children: children.length > 0 ? children : undefined,
    };
}
function extractScriptPlaceholderSymbol(node, mapper, state) {
    // Find the entry token (first token in the placeholder)
    const entryKeys = [
        "OnInitialize", "OnUpdate", "OnEntry", "OnExit", "OnMessage",
        "OnInit", "OnTrackDrop", "OnBingo", "OnEmpty", "OnRefuel",
        "OnReserve", "OnNewExecute", "OnNewFail", "Precondition",
        "NextState", "ScriptVariables", "ExecuteScriptEntry", "ScriptBlockEntry",
    ];
    for (const key of entryKeys) {
        const tok = node.children[key]?.[0];
        if (tok) {
            const range = nodeRange(node, mapper);
            const selRange = mapper.tokenToRange(tok.startOffset, tok.endOffset ?? tok.startOffset);
            const children = [];
            // If this is a script block, extract function defs from script CST
            const scriptEntry = state.parseResult.scriptEntries.get(tok);
            if (scriptEntry?.cst && scriptEntry.slice.isFuncBlock) {
                // Extract function definitions
                const funcDefs = scriptEntry.cst.children.funcDef;
                if (funcDefs) {
                    for (const fd of funcDefs) {
                        const funcNameTok = fd.children.funcName?.[0];
                        if (funcNameTok) {
                            const funcRange = nodeRange(fd, mapper);
                            children.push({
                                name: funcNameTok.image,
                                kind: SymbolKind.Function,
                                range: funcRange,
                                selectionRange: mapper.tokenToRange(funcNameTok.startOffset, funcNameTok.endOffset ?? funcNameTok.startOffset),
                            });
                        }
                    }
                }
            }
            return {
                name: tok.image,
                kind: key === "ScriptBlockEntry" ? SymbolKind.Namespace : SymbolKind.Method,
                range,
                selectionRange: selRange,
                children: children.length > 0 ? children : undefined,
            };
        }
    }
    return null;
}
function extractCommandSymbol(node, mapper) {
    const keyToken = node.children.key?.[0];
    if (!keyToken)
        return null;
    return {
        name: keyToken.image,
        kind: SymbolKind.Property,
        range: nodeRange(node, mapper),
        selectionRange: mapper.tokenToRange(keyToken.startOffset, keyToken.endOffset ?? keyToken.startOffset),
    };
}
/** Compute the range of a CST node from its location info */
function nodeRange(node, mapper) {
    const loc = node.location;
    if (loc && loc.startOffset !== undefined && loc.endOffset !== undefined) {
        return mapper.tokenToRange(loc.startOffset, loc.endOffset);
    }
    // Fallback: first position
    return { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } };
}
//# sourceMappingURL=document-symbols.js.map