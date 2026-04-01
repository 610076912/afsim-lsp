// ============================================================================
// Document Symbols Service — produces outline/symbol tree
//
// Extracts:
// - WSF blocks (platform_type, platform, sensor, processor, etc.) as Modules
// - Script entry blocks (on_initialize, on_update, etc.) as Methods
// - Script function definitions as Functions
// - Key-value pairs as Properties
// ============================================================================

import { CstNode, IToken } from "chevrotain";
import { DocumentState } from "./document-state.js";
import { PositionMapper, Range } from "./position-mapper.js";

export enum SymbolKind {
  File = 1,
  Module = 2,
  Namespace = 3,
  Package = 4,
  Class = 5,
  Method = 6,
  Property = 7,
  Field = 8,
  Constructor = 9,
  Enum = 10,
  Interface = 11,
  Function = 12,
  Variable = 13,
  Constant = 14,
  String = 15,
  Number = 16,
  Boolean = 17,
  Array = 18,
  Object = 19,
  Key = 20,
  Null = 21,
  EnumMember = 22,
  Struct = 23,
  Event = 24,
  Operator = 25,
  TypeParameter = 26,
}

export interface DocumentSymbol {
  name: string;
  kind: SymbolKind;
  range: Range;
  selectionRange: Range;
  children?: DocumentSymbol[];
}

export function computeDocumentSymbols(state: DocumentState): DocumentSymbol[] {
  const symbols: DocumentSymbol[] = [];
  const { parseResult, positionMapper } = state;
  const cst = parseResult.wsfCst;

  if (!cst || !cst.children.topLevelDecl) return symbols;

  for (const declNode of cst.children.topLevelDecl as CstNode[]) {
    const sym = extractSymbolFromDecl(declNode, positionMapper, state);
    if (sym) symbols.push(sym);
  }

  return symbols;
}

function extractSymbolFromDecl(
  node: CstNode,
  mapper: PositionMapper,
  state: DocumentState
): DocumentSymbol | null {
  // Check which alternative was matched
  if (node.children.platformTypeBlock) {
    return extractBlockSymbol(node.children.platformTypeBlock[0] as CstNode,
      "PlatformType", "typeName", SymbolKind.Class, mapper, state);
  }
  if (node.children.platformBlock) {
    return extractBlockSymbol(node.children.platformBlock[0] as CstNode,
      "Platform", "platformName", SymbolKind.Module, mapper, state);
  }
  if (node.children.wsfCommand) {
    return extractCommandSymbol(node.children.wsfCommand[0] as CstNode, mapper);
  }
  if (node.children.scriptPlaceholder) {
    return extractScriptPlaceholderSymbol(
      node.children.scriptPlaceholder[0] as CstNode, mapper, state);
  }
  return null;
}

function extractBlockSymbol(
  blockNode: CstNode,
  blockType: string,
  nameLabel: string,
  kind: SymbolKind,
  mapper: PositionMapper,
  state: DocumentState
): DocumentSymbol {
  const nameToken = blockNode.children[nameLabel]?.[0] as IToken | undefined;
  const name = nameToken ? `${blockType} ${nameToken.image}` : blockType;

  const range = nodeRange(blockNode, mapper);
  const selectionRange = nameToken
    ? mapper.tokenToRange(nameToken.startOffset, nameToken.endOffset ?? nameToken.startOffset)
    : range;

  const children: DocumentSymbol[] = [];

  // Extract children from content rules
  const contentKeys = [
    "platformTypeContent", "sensorBlock", "processorBlock",
    "commBlock", "moverBlock", "fuelBlock", "routerBlock",
    "networkBlock", "visualPartBlock", "thermalSystemBlock",
    "scriptPlaceholder", "wsfCommand",
  ];

  for (const key of contentKeys) {
    const childNodes = blockNode.children[key];
    if (!childNodes) continue;
    for (const child of childNodes as CstNode[]) {
      const childSym = extractContentSymbol(child, key, mapper, state);
      if (childSym) children.push(childSym);
    }
  }

  return { name, kind, range, selectionRange, children: children.length > 0 ? children : undefined };
}

function extractContentSymbol(
  node: CstNode,
  key: string,
  mapper: PositionMapper,
  state: DocumentState
): DocumentSymbol | null {
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
        const innerNode = node.children[bk][0] as CstNode;
        return extractComponentSymbol(innerNode, bk, mapper, state);
      }
    }
    if (node.children.scriptPlaceholder) {
      return extractScriptPlaceholderSymbol(
        node.children.scriptPlaceholder[0] as CstNode, mapper, state);
    }
    if (node.children.wsfCommand) {
      return extractCommandSymbol(node.children.wsfCommand[0] as CstNode, mapper);
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

function extractComponentSymbol(
  node: CstNode,
  blockKey: string,
  mapper: PositionMapper,
  state: DocumentState
): DocumentSymbol {
  const blockName = blockKey.replace("Block", "");
  const capitalName = blockName.charAt(0).toUpperCase() + blockName.slice(1);
  const nameKeys = [blockName + "Name", blockName + "Type", "partName", "tsName"];
  let displayName = capitalName;

  for (const nk of nameKeys) {
    const tok = node.children[nk]?.[0] as IToken | undefined;
    if (tok) {
      displayName = `${capitalName} ${tok.image}`;
      break;
    }
  }

  const range = nodeRange(node, mapper);
  const children: DocumentSymbol[] = [];

  // Extract script placeholders and commands inside component
  if (node.children.scriptPlaceholder) {
    for (const sp of node.children.scriptPlaceholder as CstNode[]) {
      const sym = extractScriptPlaceholderSymbol(sp, mapper, state);
      if (sym) children.push(sym);
    }
  }
  if (node.children.wsfCommand) {
    for (const cmd of node.children.wsfCommand as CstNode[]) {
      const sym = extractCommandSymbol(cmd, mapper);
      if (sym) children.push(sym);
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

function extractScriptPlaceholderSymbol(
  node: CstNode,
  mapper: PositionMapper,
  state: DocumentState
): DocumentSymbol | null {
  // Find the entry token (first token in the placeholder)
  const entryKeys = [
    "OnInitialize", "OnUpdate", "OnEntry", "OnExit", "OnMessage",
    "OnInit", "OnTrackDrop", "OnBingo", "OnEmpty", "OnRefuel",
    "OnReserve", "OnNewExecute", "OnNewFail", "Precondition",
    "NextState", "ScriptVariables", "ExecuteScriptEntry", "ScriptBlockEntry",
  ];

  for (const key of entryKeys) {
    const tok = node.children[key]?.[0] as IToken | undefined;
    if (tok) {
      const range = nodeRange(node, mapper);
      const selRange = mapper.tokenToRange(tok.startOffset, tok.endOffset ?? tok.startOffset);

      const children: DocumentSymbol[] = [];
      // If this is a script block, extract function defs from script CST
      const scriptEntry = state.parseResult.scriptEntries.get(tok);
      if (scriptEntry?.cst && scriptEntry.slice.isFuncBlock) {
        // Extract function definitions
        const funcDefs = scriptEntry.cst.children.funcDef;
        if (funcDefs) {
          for (const fd of funcDefs as CstNode[]) {
            const funcNameTok = fd.children.funcName?.[0] as IToken | undefined;
            if (funcNameTok) {
              const funcRange = nodeRange(fd, mapper);
              children.push({
                name: funcNameTok.image,
                kind: SymbolKind.Function,
                range: funcRange,
                selectionRange: mapper.tokenToRange(
                  funcNameTok.startOffset,
                  funcNameTok.endOffset ?? funcNameTok.startOffset
                ),
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

function extractCommandSymbol(node: CstNode, mapper: PositionMapper): DocumentSymbol | null {
  const keyToken = node.children.key?.[0] as IToken | undefined;
  if (!keyToken) return null;

  return {
    name: keyToken.image,
    kind: SymbolKind.Property,
    range: nodeRange(node, mapper),
    selectionRange: mapper.tokenToRange(
      keyToken.startOffset, keyToken.endOffset ?? keyToken.startOffset
    ),
  };
}

/** Compute the range of a CST node from its location info */
function nodeRange(node: CstNode, mapper: PositionMapper): Range {
  const loc = node.location;
  if (loc && loc.startOffset !== undefined && loc.endOffset !== undefined) {
    return mapper.tokenToRange(loc.startOffset, loc.endOffset);
  }
  // Fallback: first position
  return { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } };
}
