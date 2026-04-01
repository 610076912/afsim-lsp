import { createToken, Lexer } from "chevrotain";
import { IDENTIFIER_PATTERN } from "./shared-tokens.js";

// ============================================================================
// WSF_MODE tokens — block keywords, script entry points, identifiers
// ============================================================================

// ---------------------------------------------------------------------------
// WSF Block Open Keywords (structural blocks that stay in WSF_MODE)
// Extracted from wsf.ag grammar definitions
// ---------------------------------------------------------------------------

export const PlatformType = createToken({ name: "PlatformType", pattern: /platform_type/, longer_alt: undefined });
export const Platform = createToken({ name: "Platform", pattern: /platform/, longer_alt: PlatformType });
export const Sensor = createToken({ name: "Sensor", pattern: /sensor/, longer_alt: undefined });
export const Processor = createToken({ name: "Processor", pattern: /processor/, longer_alt: undefined });
export const Comm = createToken({ name: "Comm", pattern: /comm/, longer_alt: undefined });
export const Network = createToken({ name: "Network", pattern: /network/, longer_alt: undefined });
export const Router = createToken({ name: "Router", pattern: /router/, longer_alt: undefined });
export const Mover = createToken({ name: "Mover", pattern: /mover/, longer_alt: undefined });
export const Fuel = createToken({ name: "Fuel", pattern: /fuel/, longer_alt: undefined });
export const Zone = createToken({ name: "Zone", pattern: /zone/, longer_alt: undefined });
export const ZoneSet = createToken({ name: "ZoneSet", pattern: /zone_set/ });
export const Route = createToken({ name: "Route", pattern: /route/, longer_alt: undefined });
export const RouteNetwork = createToken({ name: "RouteNetwork", pattern: /route_network/ });
export const RadarSignature = createToken({ name: "RadarSignature", pattern: /radar_signature/ });
export const AntennaPattern = createToken({ name: "AntennaPattern", pattern: /antenna_pattern/ });
export const ThermalSystem = createToken({ name: "ThermalSystem", pattern: /thermal_system/ });
export const MaskingPattern = createToken({ name: "MaskingPattern", pattern: /masking_pattern/ });
export const IntersectMesh = createToken({ name: "IntersectMesh", pattern: /intersect_mesh/ });
export const Aero = createToken({ name: "Aero", pattern: /aero/ });
export const Callback = createToken({ name: "Callback", pattern: /callback/ });
export const UseCallback = createToken({ name: "UseCallback", pattern: /use_callback/ });
export const TrackManager = createToken({ name: "TrackManager", pattern: /track_manager/ });
export const Track = createToken({ name: "Track", pattern: /track/ });
export const NavigationErrors = createToken({ name: "NavigationErrors", pattern: /navigation_errors/ });
export const Transmitter = createToken({ name: "Transmitter", pattern: /transmitter/ });
export const Receiver = createToken({ name: "Receiver", pattern: /receiver/ });
export const FieldOfView = createToken({ name: "FieldOfView", pattern: /field_of_view/ });
export const Sector = createToken({ name: "Sector", pattern: /sector/ });
export const Scheduler = createToken({ name: "Scheduler", pattern: /scheduler/ });
export const Mode = createToken({ name: "Mode", pattern: /mode/, longer_alt: undefined });
export const ModeTemplate = createToken({ name: "ModeTemplate", pattern: /mode_template/ });
export const Beam = createToken({ name: "Beam", pattern: /beam/ });
export const State = createToken({ name: "State", pattern: /state/ });
export const Behavior = createToken({ name: "Behavior", pattern: /behavior/ });
export const AdvancedBehavior = createToken({ name: "AdvancedBehavior", pattern: /advanced_behavior/ });
export const Sequence = createToken({ name: "Sequence", pattern: /sequence/, longer_alt: undefined });
export const SequenceWithMemory = createToken({ name: "SequenceWithMemory", pattern: /sequence_with_memory/ });
export const Selector = createToken({ name: "Selector", pattern: /selector/, longer_alt: undefined });
export const SelectorWithMemory = createToken({ name: "SelectorWithMemory", pattern: /selector_with_memory/ });
export const Parallel = createToken({ name: "Parallel", pattern: /parallel/ });
export const Medium = createToken({ name: "Medium", pattern: /medium/ });
export const Protocol = createToken({ name: "Protocol", pattern: /protocol/ });
export const RouterProtocol = createToken({ name: "RouterProtocol", pattern: /router_protocol/ });
export const Process = createToken({ name: "Process", pattern: /process/ });
export const DefaultProcess = createToken({ name: "DefaultProcess", pattern: /default_process/ });
export const DefaultRouting = createToken({ name: "DefaultRouting", pattern: /default_routing/ });
export const Service = createToken({ name: "Service", pattern: /service/ });
export const Commodity = createToken({ name: "Commodity", pattern: /commodity/ });
export const Transactor = createToken({ name: "Transactor", pattern: /transactor/ });
export const Container = createToken({ name: "Container", pattern: /container/ });
export const VisualPart = createToken({ name: "VisualPart", pattern: /visual_part/ });
export const Select = createToken({ name: "Select", pattern: /select/ });
export const FrequencyList = createToken({ name: "FrequencyList", pattern: /frequency_list/ });
export const Powers = createToken({ name: "Powers", pattern: /powers/ });
export const Propagation = createToken({ name: "Propagation", pattern: /propagation/, longer_alt: undefined });
export const PropagationModel = createToken({ name: "PropagationModel", pattern: /propagation_model/ });
export const Attenuation = createToken({ name: "Attenuation", pattern: /attenuation/, longer_alt: undefined });
export const AttenuationModel = createToken({ name: "AttenuationModel", pattern: /attenuation_model/ });
export const Clutter = createToken({ name: "Clutter", pattern: /clutter/, longer_alt: undefined });
export const ClutterModel = createToken({ name: "ClutterModel", pattern: /clutter_model/ });
export const ErrorModel = createToken({ name: "ErrorModel", pattern: /error_model/, longer_alt: undefined });
export const ErrorModelParameters = createToken({ name: "ErrorModelParameters", pattern: /error_model_parameters/ });
export const Query = createToken({ name: "Query", pattern: /query/ });
export const Filter = createToken({ name: "Filter", pattern: /filter/ });
export const DisInterface = createToken({ name: "DisInterface", pattern: /dis_interface/ });
export const XioInterface = createToken({ name: "XioInterface", pattern: /xio_interface/ });
export const Connections = createToken({ name: "Connections", pattern: /connections/ });
export const EditConnections = createToken({ name: "EditConnections", pattern: /edit_connections/ });
export const FilteredConnection = createToken({ name: "FilteredConnection", pattern: /filtered_connection/ });
export const Navigation = createToken({ name: "Navigation", pattern: /navigation/, longer_alt: undefined });
export const Terrain = createToken({ name: "Terrain", pattern: /terrain/ });
export const GlobalEnvironment = createToken({ name: "GlobalEnvironment", pattern: /global_environment/ });
export const CentralBody = createToken({ name: "CentralBody", pattern: /central_body/ });
export const Observer = createToken({ name: "Observer", pattern: /observer/ });
export const ScriptStruct = createToken({ name: "ScriptStruct", pattern: /script_struct/ });
export const SignalProcessor = createToken({ name: "SignalProcessor", pattern: /signal_processor/ });
export const EventPipe = createToken({ name: "EventPipe", pattern: /event_pipe/ });
export const ScriptInterface = createToken({ name: "ScriptInterface", pattern: /script_interface/ });
export const Side = createToken({ name: "Side", pattern: /side/ });
export const IffMapping = createToken({ name: "IffMapping", pattern: /iff_mapping/ });
export const Conditionals = createToken({ name: "Conditionals", pattern: /conditionals/ });
export const Classification = createToken({ name: "Classification", pattern: /classification/, longer_alt: undefined });
export const ClassificationLevels = createToken({ name: "ClassificationLevels", pattern: /classification_levels/ });
export const Group = createToken({ name: "Group", pattern: /group/ });
export const Draw = createToken({ name: "Draw", pattern: /draw/ });
export const NoisyCloud = createToken({ name: "NoisyCloud", pattern: /noise_cloud/ });
export const DetectionThresholds = createToken({ name: "DetectionThresholds", pattern: /detection_thresholds/ });
export const DetectionProbability = createToken({ name: "DetectionProbability", pattern: /detection_probability/ });
export const FusionMethod = createToken({ name: "FusionMethod", pattern: /fusion_method/ });

// ---------------------------------------------------------------------------
// WSF misc keywords
// ---------------------------------------------------------------------------
export const WsfAdd = createToken({ name: "WsfAdd", pattern: /add/ });
export const WsfEdit = createToken({ name: "WsfEdit", pattern: /edit/ });
export const WsfLoad = createToken({ name: "WsfLoad", pattern: /load/ });
export const WsfInclude = createToken({ name: "WsfInclude", pattern: /include/ });
export const WsfTrue = createToken({ name: "WsfTrue", pattern: /true/ });
export const WsfFalse = createToken({ name: "WsfFalse", pattern: /false/ });
export const WsfYes = createToken({ name: "WsfYes", pattern: /yes/ });
export const WsfNo = createToken({ name: "WsfNo", pattern: /no/ });
export const WsfOn = createToken({ name: "WsfOn", pattern: /on/ });
export const WsfOff = createToken({ name: "WsfOff", pattern: /off/ });
export const WsfNone = createToken({ name: "WsfNone", pattern: /none/ });
export const WsfDefault = createToken({ name: "WsfDefault", pattern: /default/ });
export const WsfEndTime = createToken({ name: "WsfEndTime", pattern: /end_time/ });

// ---------------------------------------------------------------------------
// WSF Block End Keywords (close structural blocks, stay in WSF_MODE)
// Each end_* matches its corresponding open keyword
// ---------------------------------------------------------------------------

export const EndPlatformType = createToken({ name: "EndPlatformType", pattern: /end_platform_type/ });
export const EndPlatform = createToken({ name: "EndPlatform", pattern: /end_platform/ });
export const EndSensor = createToken({ name: "EndSensor", pattern: /end_sensor/ });
export const EndProcessor = createToken({ name: "EndProcessor", pattern: /end_processor/ });
export const EndComm = createToken({ name: "EndComm", pattern: /end_comm/ });
export const EndNetwork = createToken({ name: "EndNetwork", pattern: /end_network/ });
export const EndRouter = createToken({ name: "EndRouter", pattern: /end_router/ });
export const EndMover = createToken({ name: "EndMover", pattern: /end_mover/ });
export const EndFuel = createToken({ name: "EndFuel", pattern: /end_fuel/ });
export const EndZone = createToken({ name: "EndZone", pattern: /end_zone/, longer_alt: undefined });
export const EndZoneSet = createToken({ name: "EndZoneSet", pattern: /end_zone_set/ });
export const EndRoute = createToken({ name: "EndRoute", pattern: /end_route/, longer_alt: undefined });
export const EndRouteNetwork = createToken({ name: "EndRouteNetwork", pattern: /end_route_network/ });
export const EndRadarSignature = createToken({ name: "EndRadarSignature", pattern: /end_radar_signature/ });
export const EndAntennaPattern = createToken({ name: "EndAntennaPattern", pattern: /end_antenna_pattern/ });
export const EndThermalSystem = createToken({ name: "EndThermalSystem", pattern: /end_thermal_system/ });
export const EndMaskingPattern = createToken({ name: "EndMaskingPattern", pattern: /end_masking_pattern/ });
export const EndIntersectMesh = createToken({ name: "EndIntersectMesh", pattern: /end_intersect_mesh/ });
export const EndAero = createToken({ name: "EndAero", pattern: /end_aero/ });
export const EndCallback = createToken({ name: "EndCallback", pattern: /end_callback/ });
export const EndUseCallback = createToken({ name: "EndUseCallback", pattern: /end_use_callback/ });
export const EndTrackManager = createToken({ name: "EndTrackManager", pattern: /end_track_manager/ });
export const EndTrack = createToken({ name: "EndTrack", pattern: /end_track/ });
export const EndNavigationErrors = createToken({ name: "EndNavigationErrors", pattern: /end_navigation_errors/ });
export const EndTransmitter = createToken({ name: "EndTransmitter", pattern: /end_transmitter/ });
export const EndReceiver = createToken({ name: "EndReceiver", pattern: /end_receiver/ });
export const EndFieldOfView = createToken({ name: "EndFieldOfView", pattern: /end_field_of_view/ });
export const EndSector = createToken({ name: "EndSector", pattern: /end_sector/ });
export const EndScheduler = createToken({ name: "EndScheduler", pattern: /end_scheduler/ });
export const EndMode = createToken({ name: "EndMode", pattern: /end_mode/, longer_alt: undefined });
export const EndModeTemplate = createToken({ name: "EndModeTemplate", pattern: /end_mode_template/ });
export const EndBeam = createToken({ name: "EndBeam", pattern: /end_beam/ });
export const EndState = createToken({ name: "EndState", pattern: /end_state/ });
export const EndBehavior = createToken({ name: "EndBehavior", pattern: /end_behavior/ });
export const EndAdvancedBehavior = createToken({ name: "EndAdvancedBehavior", pattern: /end_advanced_behavior/ });
export const EndSequence = createToken({ name: "EndSequence", pattern: /end_sequence/, longer_alt: undefined });
export const EndSequenceWithMemory = createToken({ name: "EndSequenceWithMemory", pattern: /end_sequence_with_memory/ });
export const EndSelector = createToken({ name: "EndSelector", pattern: /end_selector/, longer_alt: undefined });
export const EndSelectorWithMemory = createToken({ name: "EndSelectorWithMemory", pattern: /end_selector_with_memory/ });
export const EndParallel = createToken({ name: "EndParallel", pattern: /end_parallel/ });
export const EndMedium = createToken({ name: "EndMedium", pattern: /end_medium/ });
export const EndProtocol = createToken({ name: "EndProtocol", pattern: /end_protocol/ });
export const EndRouterProtocol = createToken({ name: "EndRouterProtocol", pattern: /end_router_protocol/ });
export const EndProcess = createToken({ name: "EndProcess", pattern: /end_process/ });
export const EndDefaultProcess = createToken({ name: "EndDefaultProcess", pattern: /end_default_process/ });
export const EndDefaultRouting = createToken({ name: "EndDefaultRouting", pattern: /end_default_routing/ });
export const EndService = createToken({ name: "EndService", pattern: /end_service/ });
export const EndCommodity = createToken({ name: "EndCommodity", pattern: /end_commodity/ });
export const EndTransactor = createToken({ name: "EndTransactor", pattern: /end_transactor/ });
export const EndContainer = createToken({ name: "EndContainer", pattern: /end_container/ });
export const EndVisualPart = createToken({ name: "EndVisualPart", pattern: /end_visual_part/ });
export const EndSelect = createToken({ name: "EndSelect", pattern: /end_select/ });
export const EndFrequencyList = createToken({ name: "EndFrequencyList", pattern: /end_frequency_list/ });
export const EndPowers = createToken({ name: "EndPowers", pattern: /end_powers/ });
export const EndPropagation = createToken({ name: "EndPropagation", pattern: /end_propagation/, longer_alt: undefined });
export const EndPropagationModel = createToken({ name: "EndPropagationModel", pattern: /end_propagation_model/ });
export const EndAttenuation = createToken({ name: "EndAttenuation", pattern: /end_attenuation/, longer_alt: undefined });
export const EndAttenuationModel = createToken({ name: "EndAttenuationModel", pattern: /end_attenuation_model/ });
export const EndClutter = createToken({ name: "EndClutter", pattern: /end_clutter/, longer_alt: undefined });
export const EndClutterModel = createToken({ name: "EndClutterModel", pattern: /end_clutter_model/ });
export const EndErrorModel = createToken({ name: "EndErrorModel", pattern: /end_error_model/, longer_alt: undefined });
export const EndErrorModelParameters = createToken({ name: "EndErrorModelParameters", pattern: /end_error_model_parameters/ });
export const EndQuery = createToken({ name: "EndQuery", pattern: /end_query/ });
export const EndFilter = createToken({ name: "EndFilter", pattern: /end_filter/ });
export const EndDisInterface = createToken({ name: "EndDisInterface", pattern: /end_dis_interface/ });
export const EndXioInterface = createToken({ name: "EndXioInterface", pattern: /end_xio_interface/ });
export const EndConnections = createToken({ name: "EndConnections", pattern: /end_connections/ });
export const EndEditConnections = createToken({ name: "EndEditConnections", pattern: /end_edit_connections/ });
export const EndFilteredConnection = createToken({ name: "EndFilteredConnection", pattern: /end_filtered_connection/ });
export const EndNavigation = createToken({ name: "EndNavigation", pattern: /end_navigation/ });
export const EndTerrain = createToken({ name: "EndTerrain", pattern: /end_terrain/ });
export const EndGlobalEnvironment = createToken({ name: "EndGlobalEnvironment", pattern: /end_global_environment/ });
export const EndCentralBody = createToken({ name: "EndCentralBody", pattern: /end_central_body/ });
export const EndObserver = createToken({ name: "EndObserver", pattern: /end_observer/ });
export const EndScriptStruct = createToken({ name: "EndScriptStruct", pattern: /end_script_struct/ });
export const EndSignalProcessor = createToken({ name: "EndSignalProcessor", pattern: /end_signal_processor/ });
export const EndEventPipe = createToken({ name: "EndEventPipe", pattern: /end_event_pipe/ });
export const EndScriptInterface = createToken({ name: "EndScriptInterface", pattern: /end_script_interface/ });
export const EndSide = createToken({ name: "EndSide", pattern: /end_side/ });
export const EndIffMapping = createToken({ name: "EndIffMapping", pattern: /end_iff_mapping/ });
export const EndConditionals = createToken({ name: "EndConditionals", pattern: /end_conditionals/ });
export const EndClassification = createToken({ name: "EndClassification", pattern: /end_classification/, longer_alt: undefined });
export const EndClassificationLevels = createToken({ name: "EndClassificationLevels", pattern: /end_classification_levels/ });
export const EndGroup = createToken({ name: "EndGroup", pattern: /end_group/ });
export const EndDraw = createToken({ name: "EndDraw", pattern: /end_draw/ });
export const EndNoisyCloud = createToken({ name: "EndNoisyCloud", pattern: /end_noise_cloud/ });
export const EndDetectionThresholds = createToken({ name: "EndDetectionThresholds", pattern: /end_detection_thresholds/ });
export const EndDetectionProbability = createToken({ name: "EndDetectionProbability", pattern: /end_detection_probability/ });
export const EndFusionMethod = createToken({ name: "EndFusionMethod", pattern: /end_fusion_method/ });
export const EndFile = createToken({ name: "EndFile", pattern: /end_file/ });

// ---------------------------------------------------------------------------
// Script Entry Keywords — push to SCRIPT_MODE
// These keywords start a script body block in WSF context
// ---------------------------------------------------------------------------

export const OnInitialize = createToken({
  name: "OnInitialize",
  pattern: /on_initialize2?/,
  push_mode: "SCRIPT_MODE",
});

export const OnUpdate = createToken({
  name: "OnUpdate",
  pattern: /on_update/,
  push_mode: "SCRIPT_MODE",
});

export const OnEntry = createToken({
  name: "OnEntry",
  pattern: /on_entry/,
  push_mode: "SCRIPT_MODE",
});

export const OnExit = createToken({
  name: "OnExit",
  pattern: /on_exit/,
  push_mode: "SCRIPT_MODE",
});

export const OnMessage = createToken({
  name: "OnMessage",
  pattern: /on_message/,
  push_mode: "SCRIPT_MODE",
});

export const OnInit = createToken({
  name: "OnInit",
  pattern: /on_init/,
  push_mode: "SCRIPT_MODE",
});

export const OnTrackDrop = createToken({
  name: "OnTrackDrop",
  pattern: /on_track_drop/,
  push_mode: "SCRIPT_MODE",
});

export const OnBingo = createToken({
  name: "OnBingo",
  pattern: /on_bingo/,
  push_mode: "SCRIPT_MODE",
});

export const OnEmpty = createToken({
  name: "OnEmpty",
  pattern: /on_empty/,
  push_mode: "SCRIPT_MODE",
});

export const OnRefuel = createToken({
  name: "OnRefuel",
  pattern: /on_refuel/,
  push_mode: "SCRIPT_MODE",
});

export const OnReserve = createToken({
  name: "OnReserve",
  pattern: /on_reserve/,
  push_mode: "SCRIPT_MODE",
});

export const OnNewExecute = createToken({
  name: "OnNewExecute",
  pattern: /on_new_execute/,
  push_mode: "SCRIPT_MODE",
});

export const OnNewFail = createToken({
  name: "OnNewFail",
  pattern: /on_new_fail/,
  push_mode: "SCRIPT_MODE",
});

export const Precondition = createToken({
  name: "Precondition",
  pattern: /precondition/,
  push_mode: "SCRIPT_MODE",
});

export const NextState = createToken({
  name: "NextState",
  pattern: /next_state/,
  push_mode: "SCRIPT_MODE",
});

export const ScriptVariables = createToken({
  name: "ScriptVariables",
  pattern: /script_variables/,
  push_mode: "SCRIPT_MODE",
});

// `execute` and `script` need custom matchers — see custom-matchers.ts
// They are created there and imported into multi-mode-lexer.ts

// ---------------------------------------------------------------------------
// WSF Identifier — fallback for anything not matched by keywords
// Must be placed LAST in the WSF_MODE token list
// ---------------------------------------------------------------------------

export const WsfIdentifier = createToken({
  name: "WsfIdentifier",
  pattern: IDENTIFIER_PATTERN,
});

// ---------------------------------------------------------------------------
// Collect WSF block-end tokens for convenient access
// (used by heuristic escape in custom-matchers.ts)
// ---------------------------------------------------------------------------

/** Set of all end_* keyword names for heuristic escape detection */
export const WSF_END_KEYWORDS: ReadonlySet<string> = new Set([
  "end_platform_type", "end_platform", "end_sensor", "end_processor",
  "end_comm", "end_network", "end_router", "end_mover", "end_fuel",
  "end_zone", "end_zone_set", "end_route", "end_route_network",
  "end_radar_signature", "end_antenna_pattern", "end_thermal_system",
  "end_masking_pattern", "end_intersect_mesh", "end_aero", "end_callback",
  "end_use_callback", "end_track_manager", "end_track",
  "end_navigation_errors", "end_transmitter", "end_receiver",
  "end_field_of_view", "end_sector", "end_scheduler", "end_mode",
  "end_mode_template", "end_beam", "end_state", "end_behavior",
  "end_advanced_behavior", "end_sequence", "end_sequence_with_memory",
  "end_selector", "end_selector_with_memory", "end_parallel",
  "end_medium", "end_protocol", "end_router_protocol",
  "end_process", "end_default_process", "end_default_routing",
  "end_service", "end_commodity", "end_transactor", "end_container",
  "end_visual_part", "end_select", "end_frequency_list", "end_powers",
  "end_propagation", "end_propagation_model",
  "end_attenuation", "end_attenuation_model",
  "end_clutter", "end_clutter_model", "end_error_model",
  "end_error_model_parameters", "end_query", "end_filter",
  "end_dis_interface", "end_xio_interface",
  "end_connections", "end_edit_connections", "end_filtered_connection",
  "end_navigation", "end_terrain", "end_global_environment",
  "end_central_body", "end_observer", "end_script_struct",
  "end_signal_processor", "end_event_pipe", "end_script_interface",
  "end_side", "end_iff_mapping", "end_conditionals",
  "end_classification", "end_classification_levels",
  "end_group", "end_draw", "end_noise_cloud",
  "end_detection_thresholds", "end_detection_probability",
  "end_fusion_method", "end_file",
]);

/** Set of top-level WSF block-open keyword strings for heuristic escape */
export const WSF_TOP_LEVEL_KEYWORDS: ReadonlySet<string> = new Set([
  "platform_type", "platform", "sensor", "processor", "comm",
  "network", "router", "mover", "fuel", "zone", "zone_set",
  "route", "route_network", "radar_signature", "antenna_pattern",
  "thermal_system", "masking_pattern", "intersect_mesh", "aero",
  "callback", "track_manager", "transmitter", "receiver",
  "terrain", "global_environment", "central_body",
  "script_struct", "signal_processor", "event_pipe",
  "dis_interface", "xio_interface", "include",
]);
