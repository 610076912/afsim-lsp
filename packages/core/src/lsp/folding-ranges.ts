// ============================================================================
// Folding Ranges Service — provides code folding for WSF and script blocks
//
// Foldable regions:
// - WSF blocks (platform_type...end_platform_type, sensor...end_sensor, etc.)
// - Script entry/exit blocks (on_initialize...end_on_initialize, etc.)
// - Script braces blocks { ... }
// - Block comments /* ... */
// ============================================================================

import { IToken } from "chevrotain";
import { DocumentState } from "./document-state.js";
import { PositionMapper } from "./position-mapper.js";

export enum FoldingRangeKind {
  Comment = "comment",
  Imports = "imports",
  Region = "region",
}

export interface FoldingRange {
  startLine: number;
  endLine: number;
  kind?: FoldingRangeKind;
}

export function computeFoldingRanges(state: DocumentState): FoldingRange[] {
  const ranges: FoldingRange[] = [];
  const { parseResult, positionMapper } = state;
  const tokens = parseResult.allTokens;

  // 1. Script entry/exit block folds
  for (const entry of parseResult.scriptEntries.values()) {
    const entryTok = entry.slice.entryToken;
    const exitTok = entry.slice.exitToken;
    if (exitTok) {
      addFoldRange(ranges, entryTok, exitTok, positionMapper);
    }
  }

  // 2. WSF block folds — match open/close keyword pairs in wsfTokens
  const wsfTokens = parseResult.sliceResult.wsfTokens;
  findBlockFolds(wsfTokens, ranges, positionMapper);

  // 3. Block comment folds (from named group, not main token stream)
  for (const tok of parseResult.commentTokens) {
    const startLine = positionMapper.offsetToPosition(tok.startOffset).line;
    const endLine = positionMapper.offsetToPosition(tok.endOffset ?? tok.startOffset).line;
    if (endLine > startLine) {
      ranges.push({ startLine, endLine, kind: FoldingRangeKind.Comment });
    }
  }

  return ranges;
}

/** Map from WSF end keyword name → corresponding open keyword name */
const END_TO_OPEN: ReadonlyMap<string, string> = new Map([
  ["EndPlatformType", "PlatformType"],
  ["EndPlatform", "Platform"],
  ["EndSensor", "Sensor"],
  ["EndProcessor", "Processor"],
  ["EndComm", "Comm"],
  ["EndNetwork", "Network"],
  ["EndRouter", "Router"],
  ["EndMover", "Mover"],
  ["EndFuel", "Fuel"],
  ["EndZone", "Zone"],
  ["EndZoneSet", "ZoneSet"],
  ["EndRoute", "Route"],
  ["EndRouteNetwork", "RouteNetwork"],
  ["EndBehavior", "Behavior"],
  ["EndAdvancedBehavior", "AdvancedBehavior"],
  ["EndState", "State"],
  ["EndSequence", "Sequence"],
  ["EndSequenceWithMemory", "SequenceWithMemory"],
  ["EndSelector", "Selector"],
  ["EndSelectorWithMemory", "SelectorWithMemory"],
  ["EndTransmitter", "Transmitter"],
  ["EndReceiver", "Receiver"],
  ["EndFieldOfView", "FieldOfView"],
  ["EndVisualPart", "VisualPart"],
  ["EndThermalSystem", "ThermalSystem"],
  ["EndTrackManager", "TrackManager"],
]);

function findBlockFolds(
  tokens: IToken[],
  ranges: FoldingRange[],
  mapper: PositionMapper
): void {
  // Simple stack-based matching for WSF open/close blocks
  const stack: IToken[] = [];
  const openNames = new Set(END_TO_OPEN.values());

  for (const tok of tokens) {
    const name = tok.tokenType.name;
    if (openNames.has(name)) {
      stack.push(tok);
    } else {
      const openName = END_TO_OPEN.get(name);
      if (openName) {
        // Find matching open on stack (pop from top)
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i].tokenType.name === openName) {
            addFoldRange(ranges, stack[i], tok, mapper);
            stack.splice(i, 1);
            break;
          }
        }
      }
    }
  }
}

function addFoldRange(
  ranges: FoldingRange[],
  startToken: IToken,
  endToken: IToken,
  mapper: PositionMapper
): void {
  const startLine = mapper.offsetToPosition(startToken.startOffset).line;
  const endLine = mapper.offsetToPosition(endToken.startOffset).line;
  if (endLine > startLine) {
    ranges.push({ startLine, endLine, kind: FoldingRangeKind.Region });
  }
}
