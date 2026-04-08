import { Lexer, IMultiModeLexerDefinition, TokenType } from "chevrotain";
import {
  WhiteSpace, BlockComment, LineComment, HashComment,
  RealLiteral, IntegerLiteral, StringLiteral, CharLiteral,
} from "./shared-tokens.js";
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
  EndFile,
  OnInitialize, OnUpdate, OnEntry, OnExit, OnMessage, OnInit,
  OnTrackDrop, OnBingo, OnEmpty, OnRefuel, OnReserve,
  OnNewExecute, OnNewFail, Precondition, NextState, ScriptVariables,
  WsfIdentifier, WsfCatchAllWord, WsfLBrace, WsfRBrace,
  // WSF Container Block End keywords (OnXXX event handlers)
  EndOnInitialize, EndOnUpdate, EndOnEntry, EndOnExit, EndOnMessage,
  EndOnInit, EndOnTrackDrop, EndOnBingo, EndOnEmpty, EndOnRefuel,
  EndOnReserve, EndOnNewExecute, EndOnNewFail, EndNextState,
} from "./wsf-tokens.js";
import {
  // Pure script exit tokens
  EndPrecondition, EndScriptVariables, EndExecute, EndScript,
  ScriptIf, ScriptElse, ScriptWhile, ScriptDo, ScriptFor,
  ScriptForeach, ScriptIn, ScriptBreak, ScriptContinue, ScriptReturn,
  ScriptNull, ScriptTrue, ScriptFalse,
  ScriptString, ScriptInt, ScriptDouble, ScriptChar, ScriptBool,
  ScriptGlobal, ScriptStatic, ScriptExtern,
  EqEq, NotEq, GtEq, LtEq, AndAnd, OrOr, Not,
  PlusAssign, MinusAssign, TimesAssign, DivAssign,
  RArrow, Assign, Plus, Minus, Star, Slash, Caret, LAngle, RAngle,
  LParen, RParen, LBrace, RBrace, LBracket, RBracket,
  Semicolon, Comma, Dot, Colon,
  PreprocessorVar,
  ScriptIdentifier,
} from "./script-tokens.js";
import {
  ScriptFuncEntry, ScriptStmtEntry, ExecuteScriptEntry,
} from "./custom-matchers.js";

// ============================================================================
// Resolve LONGER_ALT relationships for prefix-conflicting tokens
// Must be set BEFORE constructing the Lexer instance
// ============================================================================

// WSF block open keywords
Platform.LONGER_ALT = PlatformType;
Route.LONGER_ALT = [RouteNetwork, Router];
Router.LONGER_ALT = RouterProtocol;
Comm.LONGER_ALT = Commodity;
Filter.LONGER_ALT = FilteredConnection;
Mode.LONGER_ALT = ModeTemplate;
Sequence.LONGER_ALT = SequenceWithMemory;
Selector.LONGER_ALT = SelectorWithMemory;
Propagation.LONGER_ALT = PropagationModel;
Attenuation.LONGER_ALT = AttenuationModel;
Clutter.LONGER_ALT = ClutterModel;
ErrorModel.LONGER_ALT = ErrorModelParameters;
Classification.LONGER_ALT = ClassificationLevels;
Navigation.LONGER_ALT = NavigationErrors;
Connections.LONGER_ALT = [EditConnections]; // "connections" prefix of nothing, but EditConnections starts differently

// WSF block end keywords
EndPlatform.LONGER_ALT = EndPlatformType;
EndRoute.LONGER_ALT = [EndRouteNetwork, EndRouter];
EndRouter.LONGER_ALT = EndRouterProtocol;
EndComm.LONGER_ALT = EndCommodity;
EndFilter.LONGER_ALT = EndFilteredConnection;
EndMode.LONGER_ALT = EndModeTemplate;
EndSequence.LONGER_ALT = EndSequenceWithMemory;
EndSelector.LONGER_ALT = EndSelectorWithMemory;
EndPropagation.LONGER_ALT = EndPropagationModel;
EndAttenuation.LONGER_ALT = EndAttenuationModel;
EndClutter.LONGER_ALT = EndClutterModel;
EndErrorModel.LONGER_ALT = EndErrorModelParameters;
EndClassification.LONGER_ALT = EndClassificationLevels;
EndZone.LONGER_ALT = EndZoneSet;
EndConnections.LONGER_ALT = EndEditConnections;

// Script keywords
ScriptDo.LONGER_ALT = ScriptDouble;
ScriptIn.LONGER_ALT = ScriptInt;
ScriptFor.LONGER_ALT = ScriptForeach;

// ============================================================================
// Multi-mode lexer assembly
// ============================================================================

const sharedTokensForMode: TokenType[] = [
  BlockComment,
  LineComment,
  HashComment,
  WhiteSpace,
  StringLiteral,
  CharLiteral,
  RealLiteral,
  IntegerLiteral,
  PreprocessorVar,
];

// ---------------------------------------------------------------------------
// WSF_MODE — default mode for configuration blocks
//
// ORDERING RULE: Longer compound tokens MUST appear BEFORE their prefixes
// e.g., RouterProtocol before Router before Route
// ---------------------------------------------------------------------------

const WSF_MODE_TOKENS: TokenType[] = [
  ...sharedTokensForMode,

  // --- End keywords (strictly longer-first ordering) ---
  EndPlatformType, EndPlatform,
  EndErrorModelParameters, EndErrorModel,
  EndPropagationModel, EndPropagation,
  EndAttenuationModel, EndAttenuation,
  EndClutterModel, EndClutter,
  EndClassificationLevels, EndClassification,
  EndSequenceWithMemory, EndSequence,
  EndSelectorWithMemory, EndSelector,
  EndModeTemplate, EndMode,
  EndRouteNetwork, EndRouterProtocol, EndRouter, EndRoute,  // route chain: longest first
  EndZoneSet, EndZone,
  EndEditConnections, EndConnections,
  EndDetectionThresholds, EndDetectionProbability,
  EndDefaultProcess, EndDefaultRouting,
  EndAdvancedBehavior, EndBehavior,
  EndNavigationErrors,
  EndCommodity, EndComm,   // commodity before comm
  EndSensor, EndProcessor, EndNetwork,
  EndMover, EndFuel,
  EndRadarSignature, EndAntennaPattern, EndThermalSystem,
  EndMaskingPattern, EndIntersectMesh, EndAero,
  EndUseCallback, EndCallback,
  EndTrackManager, EndTrack,
  EndTransmitter, EndReceiver, EndFieldOfView,
  EndSector, EndScheduler, EndBeam, EndState,
  EndParallel, EndMedium, EndProtocol,
  EndProcess, EndService,
  EndTransactor, EndContainer, EndVisualPart,
  EndSelect, EndFrequencyList, EndPowers,
  EndFilteredConnection, EndFilter, EndQuery,  // filteredConnection before filter
  EndDisInterface, EndXioInterface,
  EndNavigation, EndTerrain,
  EndGlobalEnvironment, EndCentralBody,
  EndObserver, EndScriptStruct,
  EndSignalProcessor, EndEventPipe, EndScriptInterface,
  EndIffMapping, EndConditionals,
  EndGroup, EndDraw, EndNoisyCloud,
  EndFusionMethod, EndFile,

  // --- WSF Container Block End keywords (OnXXX event handlers) ---
  EndOnInitialize, EndOnUpdate, EndOnEntry, EndOnExit, EndOnMessage,
  EndOnInit, EndOnTrackDrop, EndOnBingo, EndOnEmpty, EndOnRefuel,
  EndOnReserve, EndOnNewExecute, EndOnNewFail, EndNextState,

  // --- Script entry keywords (push_mode) ---
  OnInitialize,
  OnUpdate, OnEntry, OnExit, OnMessage,
  OnInit, OnTrackDrop, OnBingo, OnEmpty,
  OnRefuel, OnReserve, OnNewExecute, OnNewFail,
  Precondition, NextState, ScriptVariables,
  ExecuteScriptEntry,
  ScriptFuncEntry,   // Function definitions → SCRIPT_FUNC_MODE (must be before ScriptStmtEntry)
  ScriptStmtEntry,   // Statement blocks → SCRIPT_MODE (default fallback)

  // --- Block open keywords (strictly longer-first ordering) ---
  PlatformType, Platform,
  ErrorModelParameters, ErrorModel,
  PropagationModel, Propagation,
  AttenuationModel, Attenuation,
  ClutterModel, Clutter,
  ClassificationLevels, Classification,
  SequenceWithMemory, Sequence,
  SelectorWithMemory, Selector,
  ModeTemplate, Mode,
  RouteNetwork, RouterProtocol, Router, Route,  // route chain: longest first
  ZoneSet, Zone,
  EditConnections, Connections,
  DetectionThresholds, DetectionProbability,
  DefaultProcess, DefaultRouting,
  AdvancedBehavior, Behavior,
  NavigationErrors, Navigation,
  ScriptStruct, ScriptInterface, SignalProcessor,
  Commodity, Comm,   // commodity before comm
  Sensor, Processor, Network, Mover, Fuel,
  RadarSignature, AntennaPattern, ThermalSystem,
  MaskingPattern, IntersectMesh, Aero,
  UseCallback, Callback, TrackManager, Track,
  Transmitter, Receiver, FieldOfView,
  Sector, Scheduler, Beam, State,
  Parallel, Medium, Protocol,
  Process, Service, Transactor, Container,
  VisualPart, Select, FrequencyList, Powers,
  FilteredConnection, Filter, Query,  // filteredConnection before filter
  DisInterface, XioInterface, Terrain,
  GlobalEnvironment, CentralBody, Observer,
  EventPipe, IffMapping, Conditionals,
  Group, Draw, NoisyCloud, FusionMethod,

  // --- WSF misc keywords (longer before shorter) ---
  WsfEndTime,
  WsfAdd, WsfEdit, WsfLoad, WsfInclude,

  // --- WSF Identifier (fallback — MUST be LAST) ---
  WsfIdentifier,
  WsfLBrace, WsfRBrace,
  WsfCatchAllWord,
];

// ---------------------------------------------------------------------------
// Script mode shared tokens (used by both SCRIPT_MODE and SCRIPT_FUNC_MODE)
// ---------------------------------------------------------------------------

const scriptOperatorsAndPunctuation: TokenType[] = [
  // Multi-char operators (before single-char)
  EqEq, NotEq, GtEq, LtEq, AndAnd, OrOr,
  PlusAssign, MinusAssign, TimesAssign, DivAssign,
  RArrow,
  // Single-char operators
  Assign, Plus, Minus, Star, Slash, Caret, LAngle, RAngle, Not,
  // Punctuation
  LParen, RParen, LBrace, RBrace, LBracket, RBracket,
  Semicolon, Comma, Dot, Colon,
];

const scriptKeywords: TokenType[] = [
  // Longer keywords before their prefixes
  ScriptForeach, ScriptFor,       // foreach before for
  ScriptDouble, ScriptDo,         // double before do
  ScriptInt, ScriptIn,            // int before in
  ScriptIf, ScriptElse, ScriptWhile,
  ScriptBreak, ScriptContinue, ScriptReturn,
  ScriptNull, ScriptTrue, ScriptFalse,
  ScriptString, ScriptChar, ScriptBool,
  ScriptGlobal, ScriptStatic, ScriptExtern,
];

// ---------------------------------------------------------------------------
// SCRIPT_MODE — for script statement bodies
// ---------------------------------------------------------------------------

const SCRIPT_MODE_TOKENS: TokenType[] = [
  ...sharedTokensForMode,

  // Script exit keywords (pop_mode) — pure script only
  EndScriptVariables,
  EndPrecondition,
  EndExecute,
  EndScript,  // Also needed for script blocks with custom types (ScriptStmtEntry fallback)

  ...scriptOperatorsAndPunctuation,
  ...scriptKeywords,

  // Script Identifier (fallback — MUST be LAST)
  ScriptIdentifier,
];

// ---------------------------------------------------------------------------
// SCRIPT_FUNC_MODE — for function definitions in `script ... end_script`
// ---------------------------------------------------------------------------

const SCRIPT_FUNC_MODE_TOKENS: TokenType[] = [
  ...sharedTokensForMode,

  // Exit keyword for function def blocks
  EndScript,

  ...scriptOperatorsAndPunctuation,
  ...scriptKeywords,

  // Script Identifier (fallback — MUST be LAST)
  ScriptIdentifier,
];

// ---------------------------------------------------------------------------
// Multi-mode lexer definition
// ---------------------------------------------------------------------------

const multiModeDef: IMultiModeLexerDefinition = {
  modes: {
    WSF_MODE: WSF_MODE_TOKENS,
    SCRIPT_MODE: SCRIPT_MODE_TOKENS,
    SCRIPT_FUNC_MODE: SCRIPT_FUNC_MODE_TOKENS,
  },
  defaultMode: "WSF_MODE",
};

// Singleton lexer instance
let _lexerInstance: Lexer | null = null;

export function createMultiModeLexer(): Lexer {
  if (!_lexerInstance) {
    _lexerInstance = new Lexer(multiModeDef, {
      ensureOptimizations: false,
      positionTracking: "full",
    });
  }
  return _lexerInstance;
}

export const AfsimLexer = multiModeDef;
