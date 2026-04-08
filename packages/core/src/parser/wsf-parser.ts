import { CstParser, TokenType, IToken, CstNode, tokenMatcher } from "chevrotain";
import {
  PlatformType, Platform, Sensor, Processor, Comm, Network,
  Router, Mover, Fuel, Zone, ZoneSet, Route, RouteNetwork,
  RadarSignature, AntennaPattern, ThermalSystem, MaskingPattern,
  IntersectMesh, Aero, Callback, UseCallback, TrackManager, Track,
  NavigationErrors, Transmitter, Receiver, FieldOfView, Sector,
  Scheduler, Mode, ModeTemplate, Beam, State, Behavior,
  AdvancedBehavior, Sequence, SequenceWithMemory, Selector,
  SelectorWithMemory, Parallel, Medium, Protocol, RouterProtocol,
  Process, DefaultProcess, DefaultRouting, Service, Commodity,
  Transactor, Container, VisualPart, Select, FrequencyList,
  Powers, Propagation, PropagationModel, Attenuation, AttenuationModel,
  Clutter, ClutterModel, ErrorModel, ErrorModelParameters,
  Query, Filter, DisInterface, XioInterface, Connections,
  EditConnections, FilteredConnection, Navigation, Terrain,
  GlobalEnvironment, CentralBody, Observer, ScriptStruct,
  SignalProcessor, EventPipe, ScriptInterface, IffMapping,
  Conditionals, Classification, ClassificationLevels, Group,
  Draw, NoisyCloud, DetectionThresholds, DetectionProbability,
  FusionMethod,
  WsfAdd, WsfEdit, WsfLoad, WsfInclude, WsfEndTime,
  EndPlatformType, EndPlatform, EndSensor, EndProcessor,
  EndComm, EndNetwork, EndRouter, EndMover, EndFuel,
  EndZone, EndZoneSet, EndRoute, EndRouteNetwork,
  EndRadarSignature, EndAntennaPattern, EndThermalSystem,
  EndMaskingPattern, EndIntersectMesh, EndAero, EndCallback,
  EndUseCallback, EndTrackManager, EndTrack, EndNavigationErrors,
  EndTransmitter, EndReceiver, EndFieldOfView, EndSector,
  EndScheduler, EndMode, EndModeTemplate, EndBeam, EndState,
  EndBehavior, EndAdvancedBehavior, EndSequence, EndSequenceWithMemory,
  EndSelector, EndSelectorWithMemory, EndParallel, EndMedium,
  EndProtocol, EndRouterProtocol, EndProcess, EndDefaultProcess,
  EndDefaultRouting, EndService, EndCommodity, EndTransactor,
  EndContainer, EndVisualPart, EndSelect, EndFrequencyList,
  EndPowers, EndPropagation, EndPropagationModel,
  EndAttenuation, EndAttenuationModel, EndClutter, EndClutterModel,
  EndErrorModel, EndErrorModelParameters, EndQuery, EndFilter,
  EndDisInterface, EndXioInterface, EndConnections, EndEditConnections,
  EndFilteredConnection, EndNavigation, EndTerrain,
  EndGlobalEnvironment, EndCentralBody, EndObserver, EndScriptStruct,
  EndSignalProcessor, EndEventPipe, EndScriptInterface,
  EndIffMapping, EndConditionals, EndClassification,
  EndClassificationLevels, EndGroup, EndDraw, EndNoisyCloud,
  EndDetectionThresholds, EndDetectionProbability, EndFusionMethod,
  EndFile, WsfBlockOpen, WsfBlockClose, ScriptEntryCategory,
  OnInitialize, OnUpdate, OnEntry, OnExit, OnMessage, OnInit,
  OnTrackDrop, OnBingo, OnEmpty, OnRefuel, OnReserve,
  OnNewExecute, OnNewFail, Precondition, NextState, ScriptVariables,
  WsfIdentifier, WsfCatchAllWord, WsfLBrace, WsfRBrace,
} from "../lexer/wsf-tokens.js";
import {
  EndPrecondition, EndScriptVariables, EndExecute, EndScript,
} from "../lexer/script-tokens.js";
import {
  EndOnInitialize, EndOnUpdate, EndOnEntry, EndOnExit, EndOnMessage,
  EndOnInit, EndOnTrackDrop, EndOnBingo, EndOnEmpty, EndOnRefuel,
  EndOnReserve, EndOnNewExecute, EndOnNewFail, EndNextState,
} from "../lexer/wsf-tokens.js";
import {
  WhiteSpace, BlockComment, LineComment, HashComment,
  RealLiteral, IntegerLiteral, StringLiteral, CharLiteral,
} from "../lexer/shared-tokens.js";
import {
  ScriptBlockEntry, ExecuteScriptEntry,
} from "../lexer/custom-matchers.js";

// ============================================================================
// WSF Parser
// ============================================================================

const allWsfTokenTypes: TokenType[] = [
  WsfBlockOpen, WsfBlockClose, ScriptEntryCategory,
  WhiteSpace, BlockComment, LineComment, HashComment,
  StringLiteral, CharLiteral, RealLiteral, IntegerLiteral,
  PlatformType, Platform, ErrorModelParameters, ErrorModel,
  PropagationModel, Propagation, AttenuationModel, Attenuation,
  ClutterModel, Clutter, ClassificationLevels, Classification,
  SequenceWithMemory, Sequence, SelectorWithMemory, Selector,
  ModeTemplate, Mode, RouteNetwork, RouterProtocol, Router, Route,
  ZoneSet, Zone, EditConnections, Connections,
  DetectionThresholds, DetectionProbability, DefaultProcess, DefaultRouting,
  AdvancedBehavior, Behavior, NavigationErrors, Navigation,
  ScriptStruct, ScriptInterface, SignalProcessor, Commodity, Comm,
  Sensor, Processor, Network, Mover, Fuel, RadarSignature, AntennaPattern,
  ThermalSystem, MaskingPattern, IntersectMesh, Aero, UseCallback, Callback,
  TrackManager, Track, Transmitter, Receiver, FieldOfView, Sector,
  Scheduler, Beam, State, Parallel, Medium, Protocol, Process, Service,
  Transactor, Container, VisualPart, Select, FrequencyList, Powers,
  FilteredConnection, Filter, Query, DisInterface, XioInterface, Terrain,
  GlobalEnvironment, CentralBody, Observer, EventPipe, IffMapping,
  Conditionals, Group, Draw, NoisyCloud, FusionMethod,
  EndPlatformType, EndPlatform, EndSensor, EndProcessor, EndComm, EndNetwork,
  EndRouter, EndMover, EndFuel, EndZone, EndZoneSet, EndRoute, EndRouteNetwork,
  EndRadarSignature, EndAntennaPattern, EndThermalSystem, EndMaskingPattern,
  EndIntersectMesh, EndAero, EndCallback, EndUseCallback, EndTrackManager,
  EndTrack, EndNavigationErrors, EndTransmitter, EndReceiver,
  EndFieldOfView, EndSector, EndScheduler, EndMode, EndModeTemplate,
  EndBeam, EndState, EndBehavior, EndAdvancedBehavior, EndSequence,
  EndSequenceWithMemory, EndSelector, EndSelectorWithMemory, EndParallel,
  EndMedium, EndProtocol, EndRouterProtocol, EndProcess, EndDefaultProcess,
  EndDefaultRouting, EndService, EndCommodity, EndTransactor,
  EndContainer, EndVisualPart, EndSelect, EndFrequencyList, EndPowers,
  EndPropagation, EndPropagationModel, EndAttenuation, EndAttenuationModel,
  EndClutter, EndClutterModel, EndErrorModel, EndErrorModelParameters,
  EndQuery, EndFilter, EndDisInterface, EndXioInterface, EndConnections,
  EndEditConnections, EndFilteredConnection, EndNavigation, EndTerrain,
  EndGlobalEnvironment, EndCentralBody, EndObserver, EndScriptStruct,
  EndSignalProcessor, EndEventPipe, EndScriptInterface, EndIffMapping,
  EndConditionals, EndClassification, EndClassificationLevels, EndGroup,
  EndDraw, EndNoisyCloud, EndDetectionThresholds, EndDetectionProbability,
  EndFusionMethod, EndFile,
  OnInitialize, OnUpdate, OnEntry, OnExit, OnMessage, OnInit,
  OnTrackDrop, OnBingo, OnEmpty, OnRefuel, OnReserve,
  OnNewExecute, OnNewFail, Precondition, NextState, ScriptVariables,
  ExecuteScriptEntry, ScriptBlockEntry,
  EndOnInitialize, EndOnUpdate, EndOnEntry, EndOnExit, EndOnMessage,
  EndOnInit, EndOnTrackDrop, EndOnBingo, EndOnEmpty, EndOnRefuel,
  EndOnReserve, EndOnNewExecute, EndOnNewFail, EndPrecondition,
  EndNextState, EndScriptVariables, EndExecute, EndScript,
  WsfEndTime, WsfAdd, WsfEdit, WsfLoad, WsfInclude,
  WsfIdentifier, WsfCatchAllWord, WsfLBrace, WsfRBrace,
];

const MULTI_LINE_COMMANDS = new Set([
  "matrix_data", "table_data", "point_data", "coordinates",
  "data", "values", "points", "vertices", "faces",
]);

const SPECIFIC_BLOCK_OPENS = new Set([
  PlatformType, Platform, Sensor, Processor, Comm, Network, Router, Mover, Fuel,
  VisualPart, ThermalSystem, NextState,
  OnInitialize, OnUpdate, OnEntry, OnExit, OnMessage, OnInit,
  OnTrackDrop, OnBingo, OnEmpty, OnRefuel, OnReserve,
  OnNewExecute, OnNewFail, Precondition, ScriptVariables,
  ExecuteScriptEntry, ScriptBlockEntry, RadarSignature, AntennaPattern, 
  Route, Zone, Mode, Sequence, Selector, Transmitter, Receiver
]);

export class WsfParser extends CstParser {
  constructor() {
    super(allWsfTokenTypes, {
      recoveryEnabled: true,
      nodeLocationTracking: "full",
      maxLookahead: 3,
    });
    this.performSelfAnalysis();
  }

  public wsfFile = this.RULE("wsfFile", () => {
    this.MANY(() => {
      this.SUBRULE(this.topLevelDecl);
    });
  });

  private topLevelDecl = this.RULE("topLevelDecl", () => {
    const isSpecificBlock = () => SPECIFIC_BLOCK_OPENS.has(this.LA(1).tokenType);
    const isAnyBlock = () => tokenMatcher(this.LA(1), WsfBlockOpen) || tokenMatcher(this.LA(1), WsfBlockClose);

    this.OR([
      { ALT: () => this.SUBRULE(this.platformTypeBlock) },
      { ALT: () => this.SUBRULE(this.platformBlock) },
      { ALT: () => this.SUBRULE(this.includeDirective) },
      { ALT: () => this.SUBRULE(this.sensorBlock) },
      { ALT: () => this.SUBRULE(this.processorBlock) },
      { ALT: () => this.SUBRULE(this.commBlock) },
      { ALT: () => this.SUBRULE(this.transmitterBlock) },
      { ALT: () => this.SUBRULE(this.receiverBlock) },
      { ALT: () => this.SUBRULE(this.moverBlock) },
      { ALT: () => this.SUBRULE(this.fuelBlock) },
      { ALT: () => this.SUBRULE(this.routerBlock) },
      { ALT: () => this.SUBRULE(this.networkBlock) },
      { ALT: () => this.SUBRULE(this.visualPartBlock) },
      { ALT: () => this.SUBRULE(this.thermalSystemBlock) },
      { ALT: () => this.SUBRULE(this.onInitializeBlock) },
      { ALT: () => this.SUBRULE(this.onUpdateBlock) },
      { ALT: () => this.SUBRULE(this.onEntryBlock) },
      { ALT: () => this.SUBRULE(this.onExitBlock) },
      { ALT: () => this.SUBRULE(this.onMessageBlock) },
      { ALT: () => this.SUBRULE(this.onInitBlock) },
      { ALT: () => this.SUBRULE(this.onTrackDropBlock) },
      { ALT: () => this.SUBRULE(this.onBingoBlock) },
      { ALT: () => this.SUBRULE(this.onEmptyBlock) },
      { ALT: () => this.SUBRULE(this.onRefuelBlock) },
      { ALT: () => this.SUBRULE(this.onReserveBlock) },
      { ALT: () => this.SUBRULE(this.onNewExecuteBlock) },
      { ALT: () => this.SUBRULE(this.onNewFailBlock) },
      { ALT: () => this.SUBRULE(this.nextStateBlock) },
      { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
      { GATE: () => !isAnyBlock(), ALT: () => this.SUBRULE(this.wsfCommand) },
      { GATE: () => !isSpecificBlock() && tokenMatcher(this.LA(1), WsfBlockOpen), ALT: () => this.SUBRULE(this.genericBlock) },
    ]);
  });

  private platformBlock = this.RULE("platformBlock", () => {
    this.CONSUME(Platform);
    this.SUBRULE(this.valueAtom, { LABEL: "name" });
    this.OPTION({ GATE: () => this.LA(1).startLine === this.LA(0).startLine, DEF: () => this.SUBRULE2(this.valueAtom, { LABEL: "type" }) });
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndPlatform), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndPlatform);
  });

  private platformTypeBlock = this.RULE("platformTypeBlock", () => {
    this.CONSUME(PlatformType);
    this.SUBRULE(this.valueAtom, { LABEL: "name" });
    this.OPTION({ GATE: () => this.LA(1).startLine === this.LA(0).startLine, DEF: () => this.SUBRULE2(this.valueAtom, { LABEL: "base" }) });
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndPlatformType), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndPlatformType);
  });

  private sensorBlock = this.RULE("sensorBlock", () => {
    this.OPTION(() => this.CONSUME(WsfAdd));
    this.CONSUME(Sensor);
    this.SUBRULE(this.valueAtom, { LABEL: "name" });
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndSensor), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndSensor);
  });

  private processorBlock = this.RULE("processorBlock", () => {
    this.OPTION(() => this.CONSUME(WsfAdd));
    this.CONSUME(Processor);
    this.SUBRULE(this.valueAtom, { LABEL: "name" });
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndProcessor), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndProcessor);
  });

  private commBlock = this.RULE("commBlock", () => {
    this.OPTION(() => this.CONSUME(WsfAdd));
    this.CONSUME(Comm);
    this.SUBRULE(this.valueAtom, { LABEL: "name" });
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndComm), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndComm);
  });

  private transmitterBlock = this.RULE("transmitterBlock", () => {
    this.CONSUME(Transmitter);
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndTransmitter), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndTransmitter);
  });

  private receiverBlock = this.RULE("receiverBlock", () => {
    this.CONSUME(Receiver);
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndReceiver), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndReceiver);
  });

  private moverBlock = this.RULE("moverBlock", () => {
    this.CONSUME(Mover);
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndMover), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndMover);
  });

  private fuelBlock = this.RULE("fuelBlock", () => {
    this.CONSUME(Fuel);
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndFuel), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndFuel);
  });

  private routerBlock = this.RULE("routerBlock", () => {
    this.CONSUME(Router);
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndRouter), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndRouter);
  });

  private networkBlock = this.RULE("networkBlock", () => {
    this.CONSUME(Network);
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndNetwork), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndNetwork);
  });

  private visualPartBlock = this.RULE("visualPartBlock", () => {
    this.CONSUME(VisualPart);
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndVisualPart), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndVisualPart);
  });

  private thermalSystemBlock = this.RULE("thermalSystemBlock", () => {
    this.CONSUME(ThermalSystem);
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndThermalSystem), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndThermalSystem);
  });

  private includeDirective = this.RULE("includeDirective", () => {
    this.CONSUME(WsfInclude);
    this.SUBRULE(this.valueAtom, { LABEL: "path" });
  });

  private onInitializeBlock = this.RULE("onInitializeBlock", () => {
    this.CONSUME(OnInitialize);
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnInitialize), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndOnInitialize);
  });

  private onUpdateBlock = this.RULE("onUpdateBlock", () => {
    this.CONSUME(OnUpdate);
    this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnUpdate), DEF: () => this.SUBRULE(this.topLevelDecl) });
    this.CONSUME(EndOnUpdate);
  });

  private onEntryBlock = this.RULE("onEntryBlock", () => { this.CONSUME(OnEntry); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnEntry), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnEntry); });
  private onExitBlock = this.RULE("onExitBlock", () => { this.CONSUME(OnExit); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnExit), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnExit); });
  private onMessageBlock = this.RULE("onMessageBlock", () => { this.CONSUME(OnMessage); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnMessage), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnMessage); });
  private onInitBlock = this.RULE("onInitBlock", () => { this.CONSUME(OnInit); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnInit), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnInit); });
  private onTrackDropBlock = this.RULE("onTrackDropBlock", () => { this.CONSUME(OnTrackDrop); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnTrackDrop), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnTrackDrop); });
  private onBingoBlock = this.RULE("onBingoBlock", () => { this.CONSUME(OnBingo); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnBingo), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnBingo); });
  private onEmptyBlock = this.RULE("onEmptyBlock", () => { this.CONSUME(OnEmpty); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnEmpty), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnEmpty); });
  private onRefuelBlock = this.RULE("onRefuelBlock", () => { this.CONSUME(OnRefuel); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnRefuel), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnRefuel); });
  private onReserveBlock = this.RULE("onReserveBlock", () => { this.CONSUME(OnReserve); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnReserve), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnReserve); });
  private onNewExecuteBlock = this.RULE("onNewExecuteBlock", () => { this.CONSUME(OnNewExecute); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnNewExecute), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnNewExecute); });
  private onNewFailBlock = this.RULE("onNewFailBlock", () => { this.CONSUME(OnNewFail); this.MANY({ GATE: () => !tokenMatcher(this.LA(1), EndOnNewFail), DEF: () => this.SUBRULE(this.topLevelDecl) }); this.CONSUME(EndOnNewFail); });

  private nextStateBlock = this.RULE("nextStateBlock", () => {
    const kwToken = this.CONSUME(NextState);
    this.OPTION({ GATE: () => this.LA(1).startLine === kwToken.startLine, DEF: () => this.CONSUME(WsfIdentifier, { LABEL: "stateName" }) });
    this.CONSUME(EndNextState);
  });

  private scriptPlaceholder = this.RULE("scriptPlaceholder", () => {
    this.OR([
      { ALT: () => { this.CONSUME(Precondition); this.CONSUME(EndPrecondition); } },
      { ALT: () => { this.CONSUME(ScriptVariables); this.CONSUME(EndScriptVariables); } },
      { ALT: () => { this.CONSUME(ExecuteScriptEntry); this.CONSUME(EndExecute); } },
      { ALT: () => { this.CONSUME(ScriptBlockEntry); this.CONSUME(EndScript); } },
    ]);
  });

  private genericBlock = this.RULE("genericBlock", () => {
    let openToken: IToken;
    this.OR1([{ GATE: () => !SPECIFIC_BLOCK_OPENS.has(this.LA(1).tokenType), ALT: () => { openToken = this.CONSUME(WsfBlockOpen); } }]);
    this.MANY({ GATE: () => this.LA(1).startLine === openToken!.startLine, DEF: () => this.SUBRULE(this.valueAtom) });
    this.MANY2({
      GATE: () => this.LA(1).image !== "end_" + openToken!.image && !tokenMatcher(this.LA(1), WsfBlockClose),
      DEF: () => this.SUBRULE(this.topLevelDecl)
    });
    this.OR3([{ GATE: () => this.LA(1).image === "end_" + openToken!.image, ALT: () => this.CONSUME(this.LA(1).tokenType) }], { ERR_MSG: "Expecting matching end_ keyword" });
  });

  private wsfCommand = this.RULE("wsfCommand", () => {
    let keyToken: IToken;
    this.OR1([
      { ALT: () => { keyToken = this.CONSUME(WsfIdentifier); } },
      { ALT: () => { keyToken = this.CONSUME(WsfCatchAllWord); } },
      { ALT: () => { keyToken = this.CONSUME(WsfBlockOpen); } },
      { ALT: () => { keyToken = this.CONSUME(WsfEndTime); } },
      { ALT: () => { keyToken = this.CONSUME(WsfAdd); } },
      { ALT: () => { keyToken = this.CONSUME(WsfEdit); } },
      { ALT: () => { keyToken = this.CONSUME(WsfLoad); } },
    ]);
    this.MANY({
      GATE: () => {
        const next = this.LA(1);
        if (SPECIFIC_BLOCK_OPENS.has(next.tokenType) || tokenMatcher(next, WsfBlockClose)) return false;
        if (next.startLine !== keyToken!.startLine) return MULTI_LINE_COMMANDS.has(keyToken!.image);
        return true;
      },
      DEF: () => this.SUBRULE(this.valueAtom),
    });
  });

  private valueAtom = this.RULE("valueAtom", () => {
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(RealLiteral) },
      { ALT: () => this.CONSUME(IntegerLiteral) },
      { ALT: () => this.CONSUME(CharLiteral) },
      { ALT: () => this.CONSUME(WsfIdentifier) },
      { ALT: () => this.CONSUME(WsfCatchAllWord) },
      { ALT: () => this.CONSUME(WsfLBrace) },
      { ALT: () => this.CONSUME(WsfRBrace) },
    ]);
  });
}

let _parserInstance: WsfParser | null = null;
export function getWsfParser(): WsfParser {
  if (!_parserInstance) { _parserInstance = new WsfParser(); }
  return _parserInstance;
}
