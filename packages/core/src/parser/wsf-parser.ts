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
  WsfIdentifier,
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
import { createMultiModeLexer } from "../lexer/multi-mode-lexer.js";
import { TraceLogger } from "../infra/logger.js";

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
const allWsfTokenTypes: TokenType[] = [
  // Abstract category tokens — MUST be included for correct OR lookahead resolution
  WsfBlockOpen, WsfBlockClose, ScriptEntryCategory,

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
  EventPipe, IffMapping, Conditionals,
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
  EndIffMapping, EndConditionals, EndClassification,
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

  // Identifier last
  WsfIdentifier,
];

// ============================================================================
// Multi-line command whitelist — commands that can span multiple lines
// All other commands stop at newline
// ============================================================================

const MULTI_LINE_COMMANDS = new Set([
  "matrix_data", "table_data", "point_data", "coordinates",
  "data", "values", "points", "vertices", "faces",
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

  // ========================================================================
  // Top-level rule: a WSF file is a sequence of top-level declarations
  // ========================================================================

  public wsfFile = this.RULE("wsfFile", () => {
    this.MANY(() => {
      this.SUBRULE(this.topLevelDecl);
    });
  });

  // ========================================================================
  // Top-level declarations
  // ========================================================================

  private topLevelDecl = this.RULE("topLevelDecl", () => {
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

  private platformTypeBlock = this.RULE("platformTypeBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("platformTypeBlock"));
    const kwToken = this.CONSUME(PlatformType);
    this.ACTION(() => TraceLogger.consume("PlatformType", kwToken.image));
    
    // 三重防线内联 OR: WsfIdentifier | WsfBlockOpen | WsfBlockClose
    let nameToken: IToken;
    this.OR1([
      { ALT: () => {
          nameToken = this.CONSUME(WsfIdentifier, { LABEL: "typeName" });
          this.ACTION(() => TraceLogger.consume("typeName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "typeName" });
          this.ACTION(() => TraceLogger.consume("typeName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockClose, { LABEL: "typeName" });
          this.ACTION(() => TraceLogger.consume("typeName", nameToken.image));
      }},
    ]);
    
    // Optional baseType with startLine GATE protection
    this.OPTION({
      GATE: () => this.LA(1).startLine === nameToken.startLine,
      DEF: () => {
        // 三重防线内联 OR for baseType
        this.OR2([
          { ALT: () => {
              const t = this.CONSUME2(WsfIdentifier, { LABEL: "baseType" });
              this.ACTION(() => TraceLogger.consume("baseType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockOpen, { LABEL: "baseType" });
              this.ACTION(() => TraceLogger.consume("baseType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockClose, { LABEL: "baseType" });
              this.ACTION(() => TraceLogger.consume("baseType", t.image));
          }},
        ]);
      },
    });
    
    this.MANY(() => {
      this.SUBRULE(this.platformTypeContent);
    });
    const endKwToken = this.CONSUME(EndPlatformType);
    this.ACTION(() => TraceLogger.consume("EndPlatformType", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("platformTypeBlock"));
  });

  private platformTypeContent = this.RULE("platformTypeContent", () => {
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
      // WSF Container Blocks (OnXXX event handlers)
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
      // NextState block
      { ALT: () => this.SUBRULE(this.nextStateBlock) },
      // Pure script placeholders
      { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
      { ALT: () => this.SUBRULE(this.wsfCommand) },
    ]);
  });

  private platformBlock = this.RULE("platformBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("platformBlock"));
    const kwToken = this.CONSUME(Platform);
    this.ACTION(() => TraceLogger.consume("Platform", kwToken.image));
    
    // 三重防线内联 OR: WsfIdentifier | WsfBlockOpen | WsfBlockClose
    let nameToken: IToken;
    this.OR1([
      { ALT: () => {
          nameToken = this.CONSUME(WsfIdentifier, { LABEL: "platformName" });
          this.ACTION(() => TraceLogger.consume("platformName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "platformName" });
          this.ACTION(() => TraceLogger.consume("platformName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockClose, { LABEL: "platformName" });
          this.ACTION(() => TraceLogger.consume("platformName", nameToken.image));
      }},
    ]);
    
    this.OPTION({
      GATE: () => this.LA(1).startLine === nameToken.startLine,
      DEF: () => {
        // 三重防线内联 OR for platformTypeName
        this.OR2([
          { ALT: () => {
              const t = this.CONSUME2(WsfIdentifier, { LABEL: "platformTypeName" });
              this.ACTION(() => TraceLogger.consume("platformTypeName", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockOpen, { LABEL: "platformTypeName" });
              this.ACTION(() => TraceLogger.consume("platformTypeName", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockClose, { LABEL: "platformTypeName" });
              this.ACTION(() => TraceLogger.consume("platformTypeName", t.image));
          }},
        ]);
      },
    });
    this.MANY(() => {
      this.SUBRULE(this.platformTypeContent);
    });
    const endKwToken = this.CONSUME(EndPlatform);
    this.ACTION(() => TraceLogger.consume("EndPlatform", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("platformBlock"));
  });

  // ========================================================================
  // Component blocks
  // ========================================================================

  private sensorBlock = this.RULE("sensorBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("sensorBlock"));
    
    // 1. 【前置】处理可选的动态挂载关键字 add
    this.OPTION(() => {
      const wsfAddToken = this.CONSUME(WsfAdd);
      this.ACTION(() => TraceLogger.consume("WsfAdd", wsfAddToken.image));
    });

    // 2. 消费块本身的核心关键字 sensor
    const kwToken = this.CONSUME(Sensor);
    this.ACTION(() => TraceLogger.consume("Sensor", kwToken.image));
    
    // 3. 三重防线内联 OR 消费名字 (name 必选)
    let nameToken: IToken;
    this.OR([
      { ALT: () => {
          nameToken = this.CONSUME(WsfIdentifier, { LABEL: "sensorName" });
          this.ACTION(() => TraceLogger.consume("sensorName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "sensorName" });
          this.ACTION(() => TraceLogger.consume("sensorName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockClose, { LABEL: "sensorName" });
          this.ACTION(() => TraceLogger.consume("sensorName", nameToken.image));
      }}
    ]);

    // 4. 三重防线内联 OR 消费类型 (type 可选，需要同行 GATE 保护)
    this.OPTION2({
      GATE: () => this.LA(1).startLine === nameToken.startLine,
      DEF: () => {
        this.OR2([
          { ALT: () => {
              const t = this.CONSUME2(WsfIdentifier, { LABEL: "sensorType" });
              this.ACTION(() => TraceLogger.consume("sensorType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockOpen, { LABEL: "sensorType" });
              this.ACTION(() => TraceLogger.consume("sensorType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockClose, { LABEL: "sensorType" });
              this.ACTION(() => TraceLogger.consume("sensorType", t.image));
          }}
        ]);
      }
    });
    
    // 5. 消费内部的命令和子脚本
    this.MANY(() => {
      this.OR3([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });

    // 6. 结束关键字
    const endKwToken = this.CONSUME(EndSensor);
    this.ACTION(() => TraceLogger.consume("EndSensor", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("sensorBlock"));
  });

  private processorBlock = this.RULE("processorBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("processorBlock"));
    
    // 1. 【前置】处理可选的动态挂载关键字 add
    this.OPTION(() => {
      const wsfAddToken = this.CONSUME(WsfAdd);
      this.ACTION(() => TraceLogger.consume("WsfAdd", wsfAddToken.image));
    });

    // 2. 消费块本身的核心关键字 processor
    const kwToken = this.CONSUME(Processor);
    this.ACTION(() => TraceLogger.consume("Processor", kwToken.image));
    
    // 3. 三重防线内联 OR 消费名字 (name 必选)
    let nameToken: IToken;
    this.OR([
      { ALT: () => {
          nameToken = this.CONSUME(WsfIdentifier, { LABEL: "processorName" });
          this.ACTION(() => TraceLogger.consume("processorName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "processorName" });
          this.ACTION(() => TraceLogger.consume("processorName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockClose, { LABEL: "processorName" });
          this.ACTION(() => TraceLogger.consume("processorName", nameToken.image));
      }}
    ]);

    // 4. 三重防线内联 OR 消费类型 (type 可选，需要同行 GATE 保护)
    this.OPTION2({
      GATE: () => this.LA(1).startLine === nameToken.startLine,
      DEF: () => {
        this.OR2([
          { ALT: () => {
              const t = this.CONSUME2(WsfIdentifier, { LABEL: "processorType" });
              this.ACTION(() => TraceLogger.consume("processorType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockOpen, { LABEL: "processorType" });
              this.ACTION(() => TraceLogger.consume("processorType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockClose, { LABEL: "processorType" });
              this.ACTION(() => TraceLogger.consume("processorType", t.image));
          }}
        ]);
      }
    });
    
    // 5. 消费内部的命令和子脚本
    this.MANY(() => {
      this.OR3([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });

    // 6. 结束关键字
    const endKwToken = this.CONSUME(EndProcessor);
    this.ACTION(() => TraceLogger.consume("EndProcessor", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("processorBlock"));
  });

  private commBlock = this.RULE("commBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("commBlock"));
    
    // 1. 【前置】处理可选的动态挂载关键字 add
    this.OPTION(() => {
      const wsfAddToken = this.CONSUME(WsfAdd);
      this.ACTION(() => TraceLogger.consume("WsfAdd", wsfAddToken.image));
    });

    // 2. 消费块本身的核心关键字 comm
    const kwToken = this.CONSUME(Comm);
    this.ACTION(() => TraceLogger.consume("Comm", kwToken.image));
    
    // 3. 三重防线内联 OR 消费名字 (name 必选)
    let nameToken: IToken;
    this.OR([
      { ALT: () => {
          nameToken = this.CONSUME(WsfIdentifier, { LABEL: "commName" });
          this.ACTION(() => TraceLogger.consume("commName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "commName" });
          this.ACTION(() => TraceLogger.consume("commName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockClose, { LABEL: "commName" });
          this.ACTION(() => TraceLogger.consume("commName", nameToken.image));
      }}
    ]);

    // 4. 三重防线内联 OR 消费类型 (type 可选，需要同行 GATE 保护)
    this.OPTION2({
      GATE: () => this.LA(1).startLine === nameToken.startLine,
      DEF: () => {
        this.OR2([
          { ALT: () => {
              const t = this.CONSUME2(WsfIdentifier, { LABEL: "commType" });
              this.ACTION(() => TraceLogger.consume("commType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockOpen, { LABEL: "commType" });
              this.ACTION(() => TraceLogger.consume("commType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockClose, { LABEL: "commType" });
              this.ACTION(() => TraceLogger.consume("commType", t.image));
          }}
        ]);
      }
    });
    
    // 5. 消费内部的命令和子脚本
    this.MANY(() => {
      this.OR3([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });

    // 6. 结束关键字
    const endKwToken = this.CONSUME(EndComm);
    this.ACTION(() => TraceLogger.consume("EndComm", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("commBlock"));
  });

  private moverBlock = this.RULE("moverBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("moverBlock"));
    const kwToken = this.CONSUME(Mover);
    this.ACTION(() => TraceLogger.consume("Mover", kwToken.image));
    this.OPTION({
      GATE: () => this.LA(1).startLine === kwToken.startLine,
      DEF: () => {
        // 三重防线内联 OR for moverName
        let nameToken: IToken;
        this.OR1([
          { ALT: () => {
              nameToken = this.CONSUME(WsfIdentifier, { LABEL: "moverName" });
              this.ACTION(() => TraceLogger.consume("moverName", nameToken.image));
          }},
          { ALT: () => {
              nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "moverName" });
              this.ACTION(() => TraceLogger.consume("moverName", nameToken.image));
          }},
          { ALT: () => {
              nameToken = this.CONSUME(WsfBlockClose, { LABEL: "moverName" });
              this.ACTION(() => TraceLogger.consume("moverName", nameToken.image));
          }},
        ]);
        this.OPTION2({
          GATE: () => this.LA(1).startLine === nameToken.startLine,
          DEF: () => {
            // 三重防线内联 OR for moverType
            this.OR2([
              { ALT: () => {
                  const t = this.CONSUME2(WsfIdentifier, { LABEL: "moverType" });
                  this.ACTION(() => TraceLogger.consume("moverType", t.image));
              }},
              { ALT: () => {
                  const t = this.CONSUME2(WsfBlockOpen, { LABEL: "moverType" });
                  this.ACTION(() => TraceLogger.consume("moverType", t.image));
              }},
              { ALT: () => {
                  const t = this.CONSUME2(WsfBlockClose, { LABEL: "moverType" });
                  this.ACTION(() => TraceLogger.consume("moverType", t.image));
              }},
            ]);
          },
        });
      },
    });
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndMover);
    this.ACTION(() => TraceLogger.consume("EndMover", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("moverBlock"));
  });

  private fuelBlock = this.RULE("fuelBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("fuelBlock"));
    const kwToken = this.CONSUME(Fuel);
    this.ACTION(() => TraceLogger.consume("Fuel", kwToken.image));
    this.OPTION({
      GATE: () => this.LA(1).startLine === kwToken.startLine,
      DEF: () => {
        // 三重防线内联 OR for fuelName
        let nameToken: IToken;
        this.OR1([
          { ALT: () => {
              nameToken = this.CONSUME(WsfIdentifier, { LABEL: "fuelName" });
              this.ACTION(() => TraceLogger.consume("fuelName", nameToken.image));
          }},
          { ALT: () => {
              nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "fuelName" });
              this.ACTION(() => TraceLogger.consume("fuelName", nameToken.image));
          }},
          { ALT: () => {
              nameToken = this.CONSUME(WsfBlockClose, { LABEL: "fuelName" });
              this.ACTION(() => TraceLogger.consume("fuelName", nameToken.image));
          }},
        ]);
        this.OPTION2({
          GATE: () => this.LA(1).startLine === nameToken.startLine,
          DEF: () => {
            // 三重防线内联 OR for fuelType
            this.OR2([
              { ALT: () => {
                  const t = this.CONSUME2(WsfIdentifier, { LABEL: "fuelType" });
                  this.ACTION(() => TraceLogger.consume("fuelType", t.image));
              }},
              { ALT: () => {
                  const t = this.CONSUME2(WsfBlockOpen, { LABEL: "fuelType" });
                  this.ACTION(() => TraceLogger.consume("fuelType", t.image));
              }},
              { ALT: () => {
                  const t = this.CONSUME2(WsfBlockClose, { LABEL: "fuelType" });
                  this.ACTION(() => TraceLogger.consume("fuelType", t.image));
              }},
            ]);
          },
        });
      },
    });
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndFuel);
    this.ACTION(() => TraceLogger.consume("EndFuel", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("fuelBlock"));
  });

  private routerBlock = this.RULE("routerBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("routerBlock"));
    const kwToken = this.CONSUME(Router);
    this.ACTION(() => TraceLogger.consume("Router", kwToken.image));
    // 三重防线内联 OR for routerName
    let nameToken: IToken;
    this.OR1([
      { ALT: () => {
          nameToken = this.CONSUME(WsfIdentifier, { LABEL: "routerName" });
          this.ACTION(() => TraceLogger.consume("routerName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "routerName" });
          this.ACTION(() => TraceLogger.consume("routerName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockClose, { LABEL: "routerName" });
          this.ACTION(() => TraceLogger.consume("routerName", nameToken.image));
      }},
    ]);
    this.OPTION({
      GATE: () => this.LA(1).startLine === nameToken.startLine,
      DEF: () => {
        // 三重防线内联 OR for routerType
        this.OR2([
          { ALT: () => {
              const t = this.CONSUME2(WsfIdentifier, { LABEL: "routerType" });
              this.ACTION(() => TraceLogger.consume("routerType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockOpen, { LABEL: "routerType" });
              this.ACTION(() => TraceLogger.consume("routerType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockClose, { LABEL: "routerType" });
              this.ACTION(() => TraceLogger.consume("routerType", t.image));
          }},
        ]);
      },
    });
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndRouter);
    this.ACTION(() => TraceLogger.consume("EndRouter", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("routerBlock"));
  });

  private networkBlock = this.RULE("networkBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("networkBlock"));
    const kwToken = this.CONSUME(Network);
    this.ACTION(() => TraceLogger.consume("Network", kwToken.image));
    // 三重防线内联 OR for networkName
    let nameToken: IToken;
    this.OR1([
      { ALT: () => {
          nameToken = this.CONSUME(WsfIdentifier, { LABEL: "networkName" });
          this.ACTION(() => TraceLogger.consume("networkName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "networkName" });
          this.ACTION(() => TraceLogger.consume("networkName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockClose, { LABEL: "networkName" });
          this.ACTION(() => TraceLogger.consume("networkName", nameToken.image));
      }},
    ]);
    this.OPTION({
      GATE: () => this.LA(1).startLine === nameToken.startLine,
      DEF: () => {
        // 三重防线内联 OR for networkType
        this.OR2([
          { ALT: () => {
              const t = this.CONSUME2(WsfIdentifier, { LABEL: "networkType" });
              this.ACTION(() => TraceLogger.consume("networkType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockOpen, { LABEL: "networkType" });
              this.ACTION(() => TraceLogger.consume("networkType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockClose, { LABEL: "networkType" });
              this.ACTION(() => TraceLogger.consume("networkType", t.image));
          }},
        ]);
      },
    });
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndNetwork);
    this.ACTION(() => TraceLogger.consume("EndNetwork", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("networkBlock"));
  });

  private visualPartBlock = this.RULE("visualPartBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("visualPartBlock"));
    const kwToken = this.CONSUME(VisualPart);
    this.ACTION(() => TraceLogger.consume("VisualPart", kwToken.image));
    // 三重防线内联 OR for partName
    let nameToken: IToken;
    this.OR1([
      { ALT: () => {
          nameToken = this.CONSUME(WsfIdentifier, { LABEL: "partName" });
          this.ACTION(() => TraceLogger.consume("partName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "partName" });
          this.ACTION(() => TraceLogger.consume("partName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockClose, { LABEL: "partName" });
          this.ACTION(() => TraceLogger.consume("partName", nameToken.image));
      }},
    ]);
    this.OPTION({
      GATE: () => this.LA(1).startLine === nameToken.startLine,
      DEF: () => {
        // 三重防线内联 OR for partType
        this.OR2([
          { ALT: () => {
              const t = this.CONSUME2(WsfIdentifier, { LABEL: "partType" });
              this.ACTION(() => TraceLogger.consume("partType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockOpen, { LABEL: "partType" });
              this.ACTION(() => TraceLogger.consume("partType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockClose, { LABEL: "partType" });
              this.ACTION(() => TraceLogger.consume("partType", t.image));
          }},
        ]);
      },
    });
    this.MANY(() => {
      this.SUBRULE(this.wsfCommand);
    });
    const endKwToken = this.CONSUME(EndVisualPart);
    this.ACTION(() => TraceLogger.consume("EndVisualPart", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("visualPartBlock"));
  });

  private thermalSystemBlock = this.RULE("thermalSystemBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("thermalSystemBlock"));
    const kwToken = this.CONSUME(ThermalSystem);
    this.ACTION(() => TraceLogger.consume("ThermalSystem", kwToken.image));
    // 三重防线内联 OR for tsName
    let nameToken: IToken;
    this.OR1([
      { ALT: () => {
          nameToken = this.CONSUME(WsfIdentifier, { LABEL: "tsName" });
          this.ACTION(() => TraceLogger.consume("tsName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockOpen, { LABEL: "tsName" });
          this.ACTION(() => TraceLogger.consume("tsName", nameToken.image));
      }},
      { ALT: () => {
          nameToken = this.CONSUME(WsfBlockClose, { LABEL: "tsName" });
          this.ACTION(() => TraceLogger.consume("tsName", nameToken.image));
      }},
    ]);
    this.OPTION({
      GATE: () => this.LA(1).startLine === nameToken.startLine,
      DEF: () => {
        // 三重防线内联 OR for tsType
        this.OR2([
          { ALT: () => {
              const t = this.CONSUME2(WsfIdentifier, { LABEL: "tsType" });
              this.ACTION(() => TraceLogger.consume("tsType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockOpen, { LABEL: "tsType" });
              this.ACTION(() => TraceLogger.consume("tsType", t.image));
          }},
          { ALT: () => {
              const t = this.CONSUME2(WsfBlockClose, { LABEL: "tsType" });
              this.ACTION(() => TraceLogger.consume("tsType", t.image));
          }},
        ]);
      },
    });
    this.MANY(() => {
      this.SUBRULE(this.wsfCommand);
    });
    const endKwToken = this.CONSUME(EndThermalSystem);
    this.ACTION(() => TraceLogger.consume("EndThermalSystem", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("thermalSystemBlock"));
  });

  // ========================================================================
  // Include directive
  // ========================================================================

  private includeDirective = this.RULE("includeDirective", () => {
    this.CONSUME(WsfInclude);
    this.CONSUME(StringLiteral, { LABEL: "filePath" });
  });

  // ========================================================================
  // WSF Container Blocks — OnXXX event handlers (WSF commands inside, not pure script)
  // These are now proper WSF blocks with their own content rules
  // ========================================================================

  private onInitializeBlock = this.RULE("onInitializeBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onInitializeBlock"));
    const kwToken = this.CONSUME(OnInitialize);
    this.ACTION(() => TraceLogger.consume("OnInitialize", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnInitialize);
    this.ACTION(() => TraceLogger.consume("EndOnInitialize", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onInitializeBlock"));
  });

  private onUpdateBlock = this.RULE("onUpdateBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onUpdateBlock"));
    const kwToken = this.CONSUME(OnUpdate);
    this.ACTION(() => TraceLogger.consume("OnUpdate", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnUpdate);
    this.ACTION(() => TraceLogger.consume("EndOnUpdate", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onUpdateBlock"));
  });

  private onEntryBlock = this.RULE("onEntryBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onEntryBlock"));
    const kwToken = this.CONSUME(OnEntry);
    this.ACTION(() => TraceLogger.consume("OnEntry", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnEntry);
    this.ACTION(() => TraceLogger.consume("EndOnEntry", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onEntryBlock"));
  });

  private onExitBlock = this.RULE("onExitBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onExitBlock"));
    const kwToken = this.CONSUME(OnExit);
    this.ACTION(() => TraceLogger.consume("OnExit", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnExit);
    this.ACTION(() => TraceLogger.consume("EndOnExit", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onExitBlock"));
  });

  private onMessageBlock = this.RULE("onMessageBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onMessageBlock"));
    const kwToken = this.CONSUME(OnMessage);
    this.ACTION(() => TraceLogger.consume("OnMessage", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnMessage);
    this.ACTION(() => TraceLogger.consume("EndOnMessage", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onMessageBlock"));
  });

  private onInitBlock = this.RULE("onInitBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onInitBlock"));
    const kwToken = this.CONSUME(OnInit);
    this.ACTION(() => TraceLogger.consume("OnInit", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnInit);
    this.ACTION(() => TraceLogger.consume("EndOnInit", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onInitBlock"));
  });

  private onTrackDropBlock = this.RULE("onTrackDropBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onTrackDropBlock"));
    const kwToken = this.CONSUME(OnTrackDrop);
    this.ACTION(() => TraceLogger.consume("OnTrackDrop", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnTrackDrop);
    this.ACTION(() => TraceLogger.consume("EndOnTrackDrop", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onTrackDropBlock"));
  });

  private onBingoBlock = this.RULE("onBingoBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onBingoBlock"));
    const kwToken = this.CONSUME(OnBingo);
    this.ACTION(() => TraceLogger.consume("OnBingo", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnBingo);
    this.ACTION(() => TraceLogger.consume("EndOnBingo", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onBingoBlock"));
  });

  private onEmptyBlock = this.RULE("onEmptyBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onEmptyBlock"));
    const kwToken = this.CONSUME(OnEmpty);
    this.ACTION(() => TraceLogger.consume("OnEmpty", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnEmpty);
    this.ACTION(() => TraceLogger.consume("EndOnEmpty", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onEmptyBlock"));
  });

  private onRefuelBlock = this.RULE("onRefuelBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onRefuelBlock"));
    const kwToken = this.CONSUME(OnRefuel);
    this.ACTION(() => TraceLogger.consume("OnRefuel", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnRefuel);
    this.ACTION(() => TraceLogger.consume("EndOnRefuel", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onRefuelBlock"));
  });

  private onReserveBlock = this.RULE("onReserveBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onReserveBlock"));
    const kwToken = this.CONSUME(OnReserve);
    this.ACTION(() => TraceLogger.consume("OnReserve", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnReserve);
    this.ACTION(() => TraceLogger.consume("EndOnReserve", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onReserveBlock"));
  });

  private onNewExecuteBlock = this.RULE("onNewExecuteBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onNewExecuteBlock"));
    const kwToken = this.CONSUME(OnNewExecute);
    this.ACTION(() => TraceLogger.consume("OnNewExecute", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnNewExecute);
    this.ACTION(() => TraceLogger.consume("EndOnNewExecute", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onNewExecuteBlock"));
  });

  private onNewFailBlock = this.RULE("onNewFailBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("onNewFailBlock"));
    const kwToken = this.CONSUME(OnNewFail);
    this.ACTION(() => TraceLogger.consume("OnNewFail", kwToken.image));
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.scriptPlaceholder) },
        { ALT: () => this.SUBRULE(this.wsfCommand) },
      ]);
    });
    const endKwToken = this.CONSUME(EndOnNewFail);
    this.ACTION(() => TraceLogger.consume("EndOnNewFail", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("onNewFailBlock"));
  });

  // ========================================================================
  // NextState block — simple structure: next_state [identifier] end_next_state
  // ========================================================================

  private nextStateBlock = this.RULE("nextStateBlock", () => {
    this.ACTION(() => TraceLogger.enterRule("nextStateBlock"));
    const kwToken = this.CONSUME(NextState);
    this.ACTION(() => TraceLogger.consume("NextState", kwToken.image));
    this.OPTION({
      GATE: () => this.LA(1).startLine === kwToken.startLine,
      DEF: () => {
        const nameToken = this.CONSUME(WsfIdentifier, { LABEL: "stateName" });
        this.ACTION(() => TraceLogger.consume("stateName", nameToken.image));
      },
    });
    const endKwToken = this.CONSUME(EndNextState);
    this.ACTION(() => TraceLogger.consume("EndNextState", endKwToken.image));
    this.ACTION(() => TraceLogger.exitRule("nextStateBlock"));
  });

  // ========================================================================
  // Script placeholder — pure script entry/exit token pairs ONLY
  // OnXXX event handlers are now WSF container blocks (see onInitializeBlock, etc.)
  // ========================================================================

  private scriptPlaceholder = this.RULE("scriptPlaceholder", () => {
    this.ACTION(() => TraceLogger.enterRule("scriptPlaceholder"));
    this.OR([
      // Pure script entries only (precondition, script_variables, execute, script)
      { ALT: () => { const t1 = this.CONSUME(Precondition); this.ACTION(() => TraceLogger.consume("Precondition", t1.image)); const t2 = this.CONSUME(EndPrecondition); this.ACTION(() => TraceLogger.consume("EndPrecondition", t2.image)); } },
      { ALT: () => { const t1 = this.CONSUME(ScriptVariables); this.ACTION(() => TraceLogger.consume("ScriptVariables", t1.image)); const t2 = this.CONSUME(EndScriptVariables); this.ACTION(() => TraceLogger.consume("EndScriptVariables", t2.image)); } },
      { ALT: () => { const t1 = this.CONSUME(ExecuteScriptEntry); this.ACTION(() => TraceLogger.consume("ExecuteScriptEntry", t1.image)); const t2 = this.CONSUME(EndExecute); this.ACTION(() => TraceLogger.consume("EndExecute", t2.image)); } },
      { ALT: () => { const t1 = this.CONSUME(ScriptBlockEntry); this.ACTION(() => TraceLogger.consume("ScriptBlockEntry", t1.image)); const t2 = this.CONSUME(EndScript); this.ACTION(() => TraceLogger.consume("EndScript", t2.image)); } },
    ]);
    this.ACTION(() => TraceLogger.exitRule("scriptPlaceholder"));
  });

  // ========================================================================
  // WSF Command — a keyword followed by optional values
  // Unified catch-all for any identifier-started command line
  // ========================================================================

  private wsfCommand = this.RULE("wsfCommand", () => {
    this.ACTION(() => TraceLogger.enterRule("wsfCommand"));
    const keyToken = this.CONSUME(WsfIdentifier, { LABEL: "key" });
    this.ACTION(() => TraceLogger.consume("key", keyToken.image));
    
    this.MANY({
      GATE: () => {
        const next = this.LA(1);
        
        // ️ ABSOLUTE RED LINE: Stop at any WSF keyword regardless of line
        if (tokenMatcher(next, WsfBlockOpen) || 
            tokenMatcher(next, WsfBlockClose) || 
            tokenMatcher(next, ScriptEntryCategory)) {
          return false;
        }

        //  Cross-line check: if newline, check whitelist
        if (next.startLine !== keyToken.startLine) {
          return MULTI_LINE_COMMANDS.has(keyToken.image);
        }
        
        //  Same-line plain values, allow
        return true;
      },
      DEF: () => this.SUBRULE(this.valueAtom),
    });
    
    this.ACTION(() => TraceLogger.exitRule("wsfCommand"));
  });

  // ========================================================================
  // Value atoms — individual values that can appear in commands
  // ========================================================================

  private valueAtom = this.RULE("valueAtom", () => {
    this.ACTION(() => TraceLogger.enterRule("valueAtom"));
    this.OR([
      { ALT: () => { const t = this.CONSUME(StringLiteral); this.ACTION(() => TraceLogger.consume("StringLiteral", t.image)); } },
      { ALT: () => { const t = this.CONSUME(RealLiteral); this.ACTION(() => TraceLogger.consume("RealLiteral", t.image)); } },
      { ALT: () => { const t = this.CONSUME(IntegerLiteral); this.ACTION(() => TraceLogger.consume("IntegerLiteral", t.image)); } },
      { ALT: () => { const t = this.CONSUME(CharLiteral); this.ACTION(() => TraceLogger.consume("CharLiteral", t.image)); } },
      { ALT: () => { const t = this.CONSUME(WsfIdentifier); this.ACTION(() => TraceLogger.consume("WsfIdentifier", t.image)); } },
    ]);
    this.ACTION(() => TraceLogger.exitRule("valueAtom"));
  });
}

// Singleton instance
let _parserInstance: WsfParser | null = null;

export function getWsfParser(): WsfParser {
  if (!_parserInstance) {
    _parserInstance = new WsfParser();
  }
  return _parserInstance;
}
