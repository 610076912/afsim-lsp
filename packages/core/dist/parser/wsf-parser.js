import { CstParser } from "chevrotain";
import { PlatformType, Platform, Sensor, Processor, Comm, Network, Router, Mover, Fuel, Zone, ZoneSet, Route, RouteNetwork, RadarSignature, AntennaPattern, ThermalSystem, MaskingPattern, IntersectMesh, Aero, Callback, UseCallback, TrackManager, Track, NavigationErrors, Transmitter, Receiver, FieldOfView, Sector, Scheduler, Mode, ModeTemplate, Beam, State, Behavior, AdvancedBehavior, Sequence, SequenceWithMemory, Selector, SelectorWithMemory, Parallel, Medium, Protocol, RouterProtocol, Process, DefaultProcess, DefaultRouting, Service, Commodity, Transactor, Container, VisualPart, Select, FrequencyList, Powers, Propagation, PropagationModel, Attenuation, AttenuationModel, Clutter, ClutterModel, ErrorModel, ErrorModelParameters, Query, Filter, DisInterface, XioInterface, Connections, EditConnections, FilteredConnection, Navigation, Terrain, GlobalEnvironment, CentralBody, Observer, ScriptStruct, SignalProcessor, EventPipe, ScriptInterface, Side, IffMapping, Conditionals, Classification, ClassificationLevels, Group, Draw, NoisyCloud, DetectionThresholds, DetectionProbability, FusionMethod, WsfAdd, WsfEdit, WsfLoad, WsfInclude, WsfTrue, WsfFalse, WsfYes, WsfNo, WsfOn, WsfOff, WsfNone, WsfDefault, WsfEndTime, EndPlatformType, EndPlatform, EndSensor, EndProcessor, EndComm, EndNetwork, EndRouter, EndMover, EndFuel, EndZone, EndZoneSet, EndRoute, EndRouteNetwork, EndRadarSignature, EndAntennaPattern, EndThermalSystem, EndMaskingPattern, EndIntersectMesh, EndAero, EndCallback, EndUseCallback, EndTrackManager, EndTrack, EndNavigationErrors, EndTransmitter, EndReceiver, EndFieldOfView, EndSector, EndScheduler, EndMode, EndModeTemplate, EndBeam, EndState, EndBehavior, EndAdvancedBehavior, EndSequence, EndSequenceWithMemory, EndSelector, EndSelectorWithMemory, EndParallel, EndMedium, EndProtocol, EndRouterProtocol, EndProcess, EndDefaultProcess, EndDefaultRouting, EndService, EndCommodity, EndTransactor, EndContainer, EndVisualPart, EndSelect, EndFrequencyList, EndPowers, EndPropagation, EndPropagationModel, EndAttenuation, EndAttenuationModel, EndClutter, EndClutterModel, EndErrorModel, EndErrorModelParameters, EndQuery, EndFilter, EndDisInterface, EndXioInterface, EndConnections, EndEditConnections, EndFilteredConnection, EndNavigation, EndTerrain, EndGlobalEnvironment, EndCentralBody, EndObserver, EndScriptStruct, EndSignalProcessor, EndEventPipe, EndScriptInterface, EndSide, EndIffMapping, EndConditionals, EndClassification, EndClassificationLevels, EndGroup, EndDraw, EndNoisyCloud, EndDetectionThresholds, EndDetectionProbability, EndFusionMethod, EndFile, OnInitialize, OnUpdate, OnEntry, OnExit, OnMessage, OnInit, OnTrackDrop, OnBingo, OnEmpty, OnRefuel, OnReserve, OnNewExecute, OnNewFail, Precondition, NextState, ScriptVariables, WsfIdentifier, } from "../lexer/wsf-tokens.js";
import { EndOnInitialize, EndOnUpdate, EndOnEntry, EndOnExit, EndOnMessage, EndOnInit, EndOnTrackDrop, EndOnBingo, EndOnEmpty, EndOnRefuel, EndOnReserve, EndOnNewExecute, EndOnNewFail, EndPrecondition, EndNextState, EndScriptVariables, EndExecute, EndScript, } from "../lexer/script-tokens.js";
import { WhiteSpace, BlockComment, LineComment, HashComment, RealLiteral, IntegerLiteral, StringLiteral, CharLiteral, } from "../lexer/shared-tokens.js";
import { ScriptBlockEntry, ExecuteScriptEntry, } from "../lexer/custom-matchers.js";
// ============================================================================
// WSF Parser — structural parser for WSF configuration blocks
//
// This parser operates on the "wsfTokens" output from the Token Slicer.
// Script body tokens have been removed; entry/exit tokens remain as placeholders.
//
// Design: Uses Chevrotain CstParser with error recovery enabled
// and full node location tracking.
// ============================================================================
// Collect all token types used by the WSF parser for the constructor
const allWsfTokenTypes = [
    // Shared tokens
    WhiteSpace, BlockComment, LineComment, HashComment,
    StringLiteral, CharLiteral, RealLiteral, IntegerLiteral,
    // WSF block keywords (longer first)
    PlatformType, Platform,
    ErrorModelParameters, ErrorModel,
    PropagationModel, Propagation,
    AttenuationModel, Attenuation,
    ClutterModel, Clutter,
    ClassificationLevels, Classification,
    SequenceWithMemory, Sequence,
    SelectorWithMemory, Selector,
    ModeTemplate, Mode,
    RouteNetwork, RouterProtocol, Router, Route,
    ZoneSet, Zone,
    EditConnections, Connections,
    DetectionThresholds, DetectionProbability,
    DefaultProcess, DefaultRouting,
    AdvancedBehavior, Behavior,
    NavigationErrors, Navigation,
    ScriptStruct, ScriptInterface, SignalProcessor,
    Commodity, Comm,
    Sensor, Processor, Network, Mover, Fuel,
    RadarSignature, AntennaPattern, ThermalSystem,
    MaskingPattern, IntersectMesh, Aero,
    UseCallback, Callback, TrackManager, Track,
    Transmitter, Receiver, FieldOfView,
    Sector, Scheduler, Beam, State,
    Parallel, Medium, Protocol,
    Process, Service, Transactor, Container,
    VisualPart, Select, FrequencyList, Powers,
    FilteredConnection, Filter, Query,
    DisInterface, XioInterface, Terrain,
    GlobalEnvironment, CentralBody, Observer,
    EventPipe, Side, IffMapping, Conditionals,
    Group, Draw, NoisyCloud, FusionMethod,
    // WSF end keywords
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
    EndSide, EndIffMapping, EndConditionals, EndClassification,
    EndClassificationLevels, EndGroup, EndDraw, EndNoisyCloud,
    EndDetectionThresholds, EndDetectionProbability, EndFusionMethod,
    EndFile,
    // Script entry/exit placeholders (remain in WSF token stream)
    OnInitialize, OnUpdate, OnEntry, OnExit, OnMessage, OnInit,
    OnTrackDrop, OnBingo, OnEmpty, OnRefuel, OnReserve,
    OnNewExecute, OnNewFail, Precondition, NextState, ScriptVariables,
    ExecuteScriptEntry, ScriptBlockEntry,
    EndOnInitialize, EndOnUpdate, EndOnEntry, EndOnExit, EndOnMessage,
    EndOnInit, EndOnTrackDrop, EndOnBingo, EndOnEmpty, EndOnRefuel,
    EndOnReserve, EndOnNewExecute, EndOnNewFail, EndPrecondition,
    EndNextState, EndScriptVariables, EndExecute, EndScript,
    // WSF misc
    WsfEndTime, WsfAdd, WsfEdit, WsfLoad, WsfInclude,
    WsfTrue, WsfFalse, WsfYes, WsfNo,
    WsfNone, WsfOn, WsfOff, WsfDefault,
    // Identifier last
    WsfIdentifier,
];
export class WsfParser extends CstParser {
    constructor() {
        super(allWsfTokenTypes, {
            recoveryEnabled: true,
            nodeLocationTracking: "full",
            maxLookahead: 3,
        });
        this.performSelfAnalysis();
    }
    // ========================================================================
    // Top-level rule: a WSF file is a sequence of top-level declarations
    // ========================================================================
    wsfFile = this.RULE("wsfFile", () => {
        this.MANY(() => {
            this.SUBRULE(this.topLevelDecl);
        });
    });
    // ========================================================================
    // Top-level declarations
    // ========================================================================
    topLevelDecl = this.RULE("topLevelDecl", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.platformTypeBlock) },
            { ALT: () => this.SUBRULE(this.platformBlock) },
            { ALT: () => this.SUBRULE(this.includeDirective) },
            { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
            { ALT: () => this.SUBRULE(this.wsfCommand) },
        ]);
    });
    // ========================================================================
    // Platform type / platform blocks
    // ========================================================================
    platformTypeBlock = this.RULE("platformTypeBlock", () => {
        this.CONSUME(PlatformType);
        this.CONSUME(WsfIdentifier, { LABEL: "typeName" });
        this.MANY(() => {
            this.SUBRULE(this.platformTypeContent);
        });
        this.CONSUME(EndPlatformType);
    });
    platformTypeContent = this.RULE("platformTypeContent", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.sensorBlock) },
            { ALT: () => this.SUBRULE(this.processorBlock) },
            { ALT: () => this.SUBRULE(this.commBlock) },
            { ALT: () => this.SUBRULE(this.moverBlock) },
            { ALT: () => this.SUBRULE(this.fuelBlock) },
            { ALT: () => this.SUBRULE(this.routerBlock) },
            { ALT: () => this.SUBRULE(this.networkBlock) },
            { ALT: () => this.SUBRULE(this.visualPartBlock) },
            { ALT: () => this.SUBRULE(this.thermalSystemBlock) },
            { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
            { ALT: () => this.SUBRULE(this.wsfCommand) },
        ]);
    });
    platformBlock = this.RULE("platformBlock", () => {
        this.CONSUME(Platform);
        this.CONSUME(WsfIdentifier, { LABEL: "platformName" });
        this.OPTION(() => {
            this.CONSUME2(WsfIdentifier, { LABEL: "platformTypeName" });
        });
        this.MANY(() => {
            this.SUBRULE(this.platformTypeContent);
        });
        this.CONSUME(EndPlatform);
    });
    // ========================================================================
    // Component blocks
    // ========================================================================
    sensorBlock = this.RULE("sensorBlock", () => {
        this.CONSUME(Sensor);
        this.CONSUME(WsfIdentifier, { LABEL: "sensorName" });
        this.OPTION(() => {
            this.CONSUME2(WsfIdentifier, { LABEL: "sensorType" });
        });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
                { ALT: () => this.SUBRULE(this.wsfCommand) },
            ]);
        });
        this.CONSUME(EndSensor);
    });
    processorBlock = this.RULE("processorBlock", () => {
        this.CONSUME(Processor);
        this.CONSUME(WsfIdentifier, { LABEL: "processorName" });
        this.OPTION(() => {
            this.CONSUME2(WsfIdentifier, { LABEL: "processorType" });
        });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
                { ALT: () => this.SUBRULE(this.wsfCommand) },
            ]);
        });
        this.CONSUME(EndProcessor);
    });
    commBlock = this.RULE("commBlock", () => {
        this.CONSUME(Comm);
        this.CONSUME(WsfIdentifier, { LABEL: "commName" });
        this.OPTION(() => {
            this.CONSUME2(WsfIdentifier, { LABEL: "commType" });
        });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
                { ALT: () => this.SUBRULE(this.wsfCommand) },
            ]);
        });
        this.CONSUME(EndComm);
    });
    moverBlock = this.RULE("moverBlock", () => {
        this.CONSUME(Mover);
        this.OPTION(() => {
            this.CONSUME(WsfIdentifier, { LABEL: "moverName" });
            this.OPTION2(() => {
                this.CONSUME2(WsfIdentifier, { LABEL: "moverType" });
            });
        });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
                { ALT: () => this.SUBRULE(this.wsfCommand) },
            ]);
        });
        this.CONSUME(EndMover);
    });
    fuelBlock = this.RULE("fuelBlock", () => {
        this.CONSUME(Fuel);
        this.OPTION(() => {
            this.CONSUME(WsfIdentifier, { LABEL: "fuelName" });
            this.OPTION2(() => {
                this.CONSUME2(WsfIdentifier, { LABEL: "fuelType" });
            });
        });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
                { ALT: () => this.SUBRULE(this.wsfCommand) },
            ]);
        });
        this.CONSUME(EndFuel);
    });
    routerBlock = this.RULE("routerBlock", () => {
        this.CONSUME(Router);
        this.CONSUME(WsfIdentifier, { LABEL: "routerName" });
        this.OPTION(() => {
            this.CONSUME2(WsfIdentifier, { LABEL: "routerType" });
        });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
                { ALT: () => this.SUBRULE(this.wsfCommand) },
            ]);
        });
        this.CONSUME(EndRouter);
    });
    networkBlock = this.RULE("networkBlock", () => {
        this.CONSUME(Network);
        this.CONSUME(WsfIdentifier, { LABEL: "networkName" });
        this.OPTION(() => {
            this.CONSUME2(WsfIdentifier, { LABEL: "networkType" });
        });
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
                { ALT: () => this.SUBRULE(this.wsfCommand) },
            ]);
        });
        this.CONSUME(EndNetwork);
    });
    visualPartBlock = this.RULE("visualPartBlock", () => {
        this.CONSUME(VisualPart);
        this.CONSUME(WsfIdentifier, { LABEL: "partName" });
        this.OPTION(() => {
            this.CONSUME2(WsfIdentifier, { LABEL: "partType" });
        });
        this.MANY(() => {
            this.SUBRULE(this.wsfCommand);
        });
        this.CONSUME(EndVisualPart);
    });
    thermalSystemBlock = this.RULE("thermalSystemBlock", () => {
        this.CONSUME(ThermalSystem);
        this.CONSUME(WsfIdentifier, { LABEL: "tsName" });
        this.OPTION(() => {
            this.CONSUME2(WsfIdentifier, { LABEL: "tsType" });
        });
        this.MANY(() => {
            this.SUBRULE(this.wsfCommand);
        });
        this.CONSUME(EndThermalSystem);
    });
    // ========================================================================
    // Include directive
    // ========================================================================
    includeDirective = this.RULE("includeDirective", () => {
        this.CONSUME(WsfInclude);
        this.CONSUME(StringLiteral, { LABEL: "filePath" });
    });
    // ========================================================================
    // Script placeholder — entry/exit token pairs in WSF token stream
    // The body tokens have been sliced out; these remain as markers
    // ========================================================================
    scriptPlaceholder = this.RULE("scriptPlaceholder", () => {
        this.OR([
            { ALT: () => { this.CONSUME(OnInitialize); this.CONSUME(EndOnInitialize); } },
            { ALT: () => { this.CONSUME(OnUpdate); this.CONSUME(EndOnUpdate); } },
            { ALT: () => { this.CONSUME(OnEntry); this.CONSUME(EndOnEntry); } },
            { ALT: () => { this.CONSUME(OnExit); this.CONSUME(EndOnExit); } },
            { ALT: () => { this.CONSUME(OnMessage); this.CONSUME(EndOnMessage); } },
            { ALT: () => { this.CONSUME(OnInit); this.CONSUME(EndOnInit); } },
            { ALT: () => { this.CONSUME(OnTrackDrop); this.CONSUME(EndOnTrackDrop); } },
            { ALT: () => { this.CONSUME(OnBingo); this.CONSUME(EndOnBingo); } },
            { ALT: () => { this.CONSUME(OnEmpty); this.CONSUME(EndOnEmpty); } },
            { ALT: () => { this.CONSUME(OnRefuel); this.CONSUME(EndOnRefuel); } },
            { ALT: () => { this.CONSUME(OnReserve); this.CONSUME(EndOnReserve); } },
            { ALT: () => { this.CONSUME(OnNewExecute); this.CONSUME(EndOnNewExecute); } },
            { ALT: () => { this.CONSUME(OnNewFail); this.CONSUME(EndOnNewFail); } },
            { ALT: () => { this.CONSUME(Precondition); this.CONSUME(EndPrecondition); } },
            { ALT: () => { this.CONSUME(NextState); this.OPTION(() => this.CONSUME(WsfIdentifier, { LABEL: "stateName" })); this.CONSUME(EndNextState); } },
            { ALT: () => { this.CONSUME(ScriptVariables); this.CONSUME(EndScriptVariables); } },
            { ALT: () => { this.CONSUME(ExecuteScriptEntry); this.CONSUME(EndExecute); } },
            { ALT: () => { this.CONSUME(ScriptBlockEntry); this.CONSUME(EndScript); } },
        ]);
    });
    // ========================================================================
    // WSF Command — a keyword followed by optional values
    // Unified catch-all for any identifier-started command line
    // ========================================================================
    wsfCommand = this.RULE("wsfCommand", () => {
        this.CONSUME(WsfIdentifier, { LABEL: "key" });
        this.MANY(() => {
            this.SUBRULE(this.valueAtom);
        });
    });
    // ========================================================================
    // Value atoms — individual values that can appear in commands
    // ========================================================================
    valueAtom = this.RULE("valueAtom", () => {
        this.OR([
            { ALT: () => this.CONSUME(StringLiteral) },
            { ALT: () => this.CONSUME(RealLiteral) },
            { ALT: () => this.CONSUME(IntegerLiteral) },
            { ALT: () => this.CONSUME(CharLiteral) },
            { ALT: () => this.CONSUME(WsfTrue) },
            { ALT: () => this.CONSUME(WsfFalse) },
            { ALT: () => this.CONSUME(WsfYes) },
            { ALT: () => this.CONSUME(WsfNo) },
            { ALT: () => this.CONSUME(WsfOn) },
            { ALT: () => this.CONSUME(WsfOff) },
            { ALT: () => this.CONSUME(WsfNone) },
            { ALT: () => this.CONSUME(WsfDefault) },
            { ALT: () => this.CONSUME(WsfIdentifier) },
        ]);
    });
}
// Singleton instance
let _parserInstance = null;
export function getWsfParser() {
    if (!_parserInstance) {
        _parserInstance = new WsfParser();
    }
    return _parserInstance;
}
//# sourceMappingURL=wsf-parser.js.map