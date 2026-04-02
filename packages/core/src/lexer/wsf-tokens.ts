import { createToken, Lexer, TokenType } from "chevrotain";

// ============================================================================
// WSF_MODE tokens — block keywords, script entry points, identifiers
// ============================================================================

// ---------------------------------------------------------------------------
// WSF Suffix Assertion — prevents "platform-type" being split into "platform" + "-type"
// String with double backslash: "\\-\\/" becomes "\-\/" in the RegExp constructor
// ---------------------------------------------------------------------------
const WSF_SUFFIX_ASSERTION = "(?![A-Za-z0-9_\\-\\/])";

// ---------------------------------------------------------------------------
// Helper: create WSF token with automatic suffix assertion
// ---------------------------------------------------------------------------
function createWsfToken(
  name: string,
  regexStr: string,
  options?: {
    longer_alt?: TokenType | TokenType[];
    push_mode?: string;
    pop_mode?: boolean;
    categories?: TokenType | TokenType[];
  }
): TokenType {
  return createToken({
    name,
    pattern: new RegExp(regexStr + WSF_SUFFIX_ASSERTION),
    ...options,
  });
}

// ============================================================================
// Abstract Token Categories
// ============================================================================

/** Category for WSF block-open keywords (platform, sensor, processor, etc.) */
export const WsfBlockOpen = createToken({ name: "WsfBlockOpen", pattern: Lexer.NA });

/** Category for WSF block-close keywords (end_platform, end_sensor, etc.) */
export const WsfBlockClose = createToken({ name: "WsfBlockClose", pattern: Lexer.NA });

/** Category for script entry keywords (on_initialize, script, execute, etc.) */
export const ScriptEntryCategory = createToken({ name: "ScriptEntryCategory", pattern: Lexer.NA });

// ============================================================================
// WSF Block Open Keywords
// IMPORTANT: Longer tokens must be declared BEFORE shorter ones (for longer_alt)
// ============================================================================

// --- Platform group (longer first) ---
export const PlatformType = createWsfToken("PlatformType", "platform_type", { categories: WsfBlockOpen });
export const Platform = createWsfToken("Platform", "platform", { longer_alt: PlatformType, categories: WsfBlockOpen });

// --- Simple block-open keywords (no longer_alt) ---
export const Sensor = createWsfToken("Sensor", "sensor", { categories: WsfBlockOpen });
export const Processor = createWsfToken("Processor", "processor", { categories: WsfBlockOpen });

// --- Comm/Commodity group ---
export const Commodity = createWsfToken("Commodity", "commodity", { categories: WsfBlockOpen });
export const Comm = createWsfToken("Comm", "comm", { longer_alt: Commodity, categories: WsfBlockOpen });

// --- Network/Router group ---
export const Network = createWsfToken("Network", "network", { categories: WsfBlockOpen });
export const RouterProtocol = createWsfToken("RouterProtocol", "router_protocol", { categories: WsfBlockOpen });
export const Router = createWsfToken("Router", "router", { longer_alt: RouterProtocol, categories: WsfBlockOpen });

export const Mover = createWsfToken("Mover", "mover", { categories: WsfBlockOpen });
export const Fuel = createWsfToken("Fuel", "fuel", { categories: WsfBlockOpen });

// --- Zone group ---
export const ZoneSet = createWsfToken("ZoneSet", "zone_set", { categories: WsfBlockOpen });
export const Zone = createWsfToken("Zone", "zone", { longer_alt: ZoneSet, categories: WsfBlockOpen });

// --- Route group (longest first) ---
export const RouteNetwork = createWsfToken("RouteNetwork", "route_network", { categories: WsfBlockOpen });
export const Route = createWsfToken("Route", "route", { longer_alt: [RouteNetwork, Router], categories: WsfBlockOpen });

// --- Simple keywords ---
export const RadarSignature = createWsfToken("RadarSignature", "radar_signature", { categories: WsfBlockOpen });
export const AntennaPattern = createWsfToken("AntennaPattern", "antenna_pattern", { categories: WsfBlockOpen });
export const ThermalSystem = createWsfToken("ThermalSystem", "thermal_system", { categories: WsfBlockOpen });
export const MaskingPattern = createWsfToken("MaskingPattern", "masking_pattern", { categories: WsfBlockOpen });
export const IntersectMesh = createWsfToken("IntersectMesh", "intersect_mesh", { categories: WsfBlockOpen });
export const Aero = createWsfToken("Aero", "aero", { categories: WsfBlockOpen });
export const Callback = createWsfToken("Callback", "callback", { categories: WsfBlockOpen });
export const UseCallback = createWsfToken("UseCallback", "use_callback", { categories: WsfBlockOpen });
export const TrackManager = createWsfToken("TrackManager", "track_manager", { categories: WsfBlockOpen });
export const Track = createWsfToken("Track", "track", { categories: WsfBlockOpen });
export const NavigationErrors = createWsfToken("NavigationErrors", "navigation_errors", { categories: WsfBlockOpen });
export const Transmitter = createWsfToken("Transmitter", "transmitter", { categories: WsfBlockOpen });
export const Receiver = createWsfToken("Receiver", "receiver", { categories: WsfBlockOpen });
export const FieldOfView = createWsfToken("FieldOfView", "field_of_view", { categories: WsfBlockOpen });
export const Sector = createWsfToken("Sector", "sector", { categories: WsfBlockOpen });
export const Scheduler = createWsfToken("Scheduler", "scheduler", { categories: WsfBlockOpen });

// --- Mode group ---
export const ModeTemplate = createWsfToken("ModeTemplate", "mode_template", { categories: WsfBlockOpen });
export const Mode = createWsfToken("Mode", "mode", { longer_alt: ModeTemplate, categories: WsfBlockOpen });

export const Beam = createWsfToken("Beam", "beam", { categories: WsfBlockOpen });
export const State = createWsfToken("State", "state", { categories: WsfBlockOpen });
export const Behavior = createWsfToken("Behavior", "behavior", { categories: WsfBlockOpen });
export const AdvancedBehavior = createWsfToken("AdvancedBehavior", "advanced_behavior", { categories: WsfBlockOpen });

// --- Sequence group ---
export const SequenceWithMemory = createWsfToken("SequenceWithMemory", "sequence_with_memory", { categories: WsfBlockOpen });
export const Sequence = createWsfToken("Sequence", "sequence", { longer_alt: SequenceWithMemory, categories: WsfBlockOpen });

// --- Selector group ---
export const SelectorWithMemory = createWsfToken("SelectorWithMemory", "selector_with_memory", { categories: WsfBlockOpen });
export const Selector = createWsfToken("Selector", "selector", { longer_alt: SelectorWithMemory, categories: WsfBlockOpen });

export const Parallel = createWsfToken("Parallel", "parallel", { categories: WsfBlockOpen });
export const Medium = createWsfToken("Medium", "medium", { categories: WsfBlockOpen });

// --- Protocol group ---
export const Protocol = createWsfToken("Protocol", "protocol", { categories: WsfBlockOpen });

export const Process = createWsfToken("Process", "process", { categories: WsfBlockOpen });
export const DefaultProcess = createWsfToken("DefaultProcess", "default_process", { categories: WsfBlockOpen });
export const DefaultRouting = createWsfToken("DefaultRouting", "default_routing", { categories: WsfBlockOpen });
export const Service = createWsfToken("Service", "service", { categories: WsfBlockOpen });
export const Transactor = createWsfToken("Transactor", "transactor", { categories: WsfBlockOpen });
export const Container = createWsfToken("Container", "container", { categories: WsfBlockOpen });
export const VisualPart = createWsfToken("VisualPart", "visual_part", { categories: WsfBlockOpen });
export const Select = createWsfToken("Select", "select", { categories: WsfBlockOpen });
export const FrequencyList = createWsfToken("FrequencyList", "frequency_list", { categories: WsfBlockOpen });
export const Powers = createWsfToken("Powers", "powers", { categories: WsfBlockOpen });

// --- Propagation group ---
export const PropagationModel = createWsfToken("PropagationModel", "propagation_model", { categories: WsfBlockOpen });
export const Propagation = createWsfToken("Propagation", "propagation", { longer_alt: PropagationModel, categories: WsfBlockOpen });

// --- Attenuation group ---
export const AttenuationModel = createWsfToken("AttenuationModel", "attenuation_model", { categories: WsfBlockOpen });
export const Attenuation = createWsfToken("Attenuation", "attenuation", { longer_alt: AttenuationModel, categories: WsfBlockOpen });

// --- Clutter group ---
export const ClutterModel = createWsfToken("ClutterModel", "clutter_model", { categories: WsfBlockOpen });
export const Clutter = createWsfToken("Clutter", "clutter", { longer_alt: ClutterModel, categories: WsfBlockOpen });

// --- ErrorModel group ---
export const ErrorModelParameters = createWsfToken("ErrorModelParameters", "error_model_parameters", { categories: WsfBlockOpen });
export const ErrorModel = createWsfToken("ErrorModel", "error_model", { longer_alt: ErrorModelParameters, categories: WsfBlockOpen });

export const Query = createWsfToken("Query", "query", { categories: WsfBlockOpen });

// --- Filter group ---
export const FilteredConnection = createWsfToken("FilteredConnection", "filtered_connection", { categories: WsfBlockOpen });
export const Filter = createWsfToken("Filter", "filter", { longer_alt: FilteredConnection, categories: WsfBlockOpen });

export const DisInterface = createWsfToken("DisInterface", "dis_interface", { categories: WsfBlockOpen });
export const XioInterface = createWsfToken("XioInterface", "xio_interface", { categories: WsfBlockOpen });

// --- Connections group ---
export const EditConnections = createWsfToken("EditConnections", "edit_connections", { categories: WsfBlockOpen });
export const Connections = createWsfToken("Connections", "connections", { longer_alt: EditConnections, categories: WsfBlockOpen });

// --- Navigation group ---
export const Navigation = createWsfToken("Navigation", "navigation", { longer_alt: NavigationErrors, categories: WsfBlockOpen });

export const Terrain = createWsfToken("Terrain", "terrain", { categories: WsfBlockOpen });
export const GlobalEnvironment = createWsfToken("GlobalEnvironment", "global_environment", { categories: WsfBlockOpen });
export const CentralBody = createWsfToken("CentralBody", "central_body", { categories: WsfBlockOpen });
export const Observer = createWsfToken("Observer", "observer", { categories: WsfBlockOpen });
export const ScriptStruct = createWsfToken("ScriptStruct", "script_struct", { categories: WsfBlockOpen });
export const SignalProcessor = createWsfToken("SignalProcessor", "signal_processor", { categories: WsfBlockOpen });
export const EventPipe = createWsfToken("EventPipe", "event_pipe", { categories: WsfBlockOpen });
export const ScriptInterface = createWsfToken("ScriptInterface", "script_interface", { categories: WsfBlockOpen });
// export const Side = createWsfToken("Side", "side", { categories: WsfBlockOpen });
export const IffMapping = createWsfToken("IffMapping", "iff_mapping", { categories: WsfBlockOpen });
export const Conditionals = createWsfToken("Conditionals", "conditionals", { categories: WsfBlockOpen });

// --- Classification group ---
export const ClassificationLevels = createWsfToken("ClassificationLevels", "classification_levels", { categories: WsfBlockOpen });
export const Classification = createWsfToken("Classification", "classification", { longer_alt: ClassificationLevels, categories: WsfBlockOpen });

export const Group = createWsfToken("Group", "group", { categories: WsfBlockOpen });
export const Draw = createWsfToken("Draw", "draw", { categories: WsfBlockOpen });
export const NoisyCloud = createWsfToken("NoisyCloud", "noise_cloud", { categories: WsfBlockOpen });
export const DetectionThresholds = createWsfToken("DetectionThresholds", "detection_thresholds", { categories: WsfBlockOpen });
export const DetectionProbability = createWsfToken("DetectionProbability", "detection_probability", { categories: WsfBlockOpen });
export const FusionMethod = createWsfToken("FusionMethod", "fusion_method", { categories: WsfBlockOpen });

// ============================================================================
// WSF Misc Keywords
// ============================================================================

export const WsfAdd = createWsfToken("WsfAdd", "add");
export const WsfEdit = createWsfToken("WsfEdit", "edit");
export const WsfLoad = createWsfToken("WsfLoad", "load");
export const WsfInclude = createWsfToken("WsfInclude", "include");
export const WsfTrue = createWsfToken("WsfTrue", "true");
export const WsfFalse = createWsfToken("WsfFalse", "false");
export const WsfYes = createWsfToken("WsfYes", "yes");
export const WsfNone = createWsfToken("WsfNone", "none");
export const WsfNo = createWsfToken("WsfNo", "no", { longer_alt: WsfNone });
export const WsfOn = createWsfToken("WsfOn", "on");
export const WsfOff = createWsfToken("WsfOff", "off");
export const WsfDefault = createWsfToken("WsfDefault", "default");
export const WsfEndTime = createWsfToken("WsfEndTime", "end_time");

// ============================================================================
// WSF Block End Keywords
// IMPORTANT: Longer tokens must be declared BEFORE shorter ones (for longer_alt)
// ============================================================================

// --- Platform group ---
export const EndPlatformType = createWsfToken("EndPlatformType", "end_platform_type", { categories: WsfBlockClose });
export const EndPlatform = createWsfToken("EndPlatform", "end_platform", { longer_alt: EndPlatformType, categories: WsfBlockClose });

export const EndSensor = createWsfToken("EndSensor", "end_sensor", { categories: WsfBlockClose });
export const EndProcessor = createWsfToken("EndProcessor", "end_processor", { categories: WsfBlockClose });

// --- Comm group ---
export const EndCommodity = createWsfToken("EndCommodity", "end_commodity", { categories: WsfBlockClose });
export const EndComm = createWsfToken("EndComm", "end_comm", { longer_alt: EndCommodity, categories: WsfBlockClose });

export const EndNetwork = createWsfToken("EndNetwork", "end_network", { categories: WsfBlockClose });

// --- Router group ---
export const EndRouterProtocol = createWsfToken("EndRouterProtocol", "end_router_protocol", { categories: WsfBlockClose });
export const EndRouter = createWsfToken("EndRouter", "end_router", { longer_alt: EndRouterProtocol, categories: WsfBlockClose });

export const EndMover = createWsfToken("EndMover", "end_mover", { categories: WsfBlockClose });
export const EndFuel = createWsfToken("EndFuel", "end_fuel", { categories: WsfBlockClose });

// --- Zone group ---
export const EndZoneSet = createWsfToken("EndZoneSet", "end_zone_set", { categories: WsfBlockClose });
export const EndZone = createWsfToken("EndZone", "end_zone", { longer_alt: EndZoneSet, categories: WsfBlockClose });

// --- Route group ---
export const EndRouteNetwork = createWsfToken("EndRouteNetwork", "end_route_network", { categories: WsfBlockClose });
export const EndRoute = createWsfToken("EndRoute", "end_route", { longer_alt: [EndRouteNetwork, EndRouter], categories: WsfBlockClose });

export const EndRadarSignature = createWsfToken("EndRadarSignature", "end_radar_signature", { categories: WsfBlockClose });
export const EndAntennaPattern = createWsfToken("EndAntennaPattern", "end_antenna_pattern", { categories: WsfBlockClose });
export const EndThermalSystem = createWsfToken("EndThermalSystem", "end_thermal_system", { categories: WsfBlockClose });
export const EndMaskingPattern = createWsfToken("EndMaskingPattern", "end_masking_pattern", { categories: WsfBlockClose });
export const EndIntersectMesh = createWsfToken("EndIntersectMesh", "end_intersect_mesh", { categories: WsfBlockClose });
export const EndAero = createWsfToken("EndAero", "end_aero", { categories: WsfBlockClose });
export const EndCallback = createWsfToken("EndCallback", "end_callback", { categories: WsfBlockClose });
export const EndUseCallback = createWsfToken("EndUseCallback", "end_use_callback", { categories: WsfBlockClose });
export const EndTrackManager = createWsfToken("EndTrackManager", "end_track_manager", { categories: WsfBlockClose });
export const EndTrack = createWsfToken("EndTrack", "end_track", { categories: WsfBlockClose });
export const EndNavigationErrors = createWsfToken("EndNavigationErrors", "end_navigation_errors", { categories: WsfBlockClose });
export const EndTransmitter = createWsfToken("EndTransmitter", "end_transmitter", { categories: WsfBlockClose });
export const EndReceiver = createWsfToken("EndReceiver", "end_receiver", { categories: WsfBlockClose });
export const EndFieldOfView = createWsfToken("EndFieldOfView", "end_field_of_view", { categories: WsfBlockClose });
export const EndSector = createWsfToken("EndSector", "end_sector", { categories: WsfBlockClose });
export const EndScheduler = createWsfToken("EndScheduler", "end_scheduler", { categories: WsfBlockClose });

// --- Mode group ---
export const EndModeTemplate = createWsfToken("EndModeTemplate", "end_mode_template", { categories: WsfBlockClose });
export const EndMode = createWsfToken("EndMode", "end_mode", { longer_alt: EndModeTemplate, categories: WsfBlockClose });

export const EndBeam = createWsfToken("EndBeam", "end_beam", { categories: WsfBlockClose });
export const EndState = createWsfToken("EndState", "end_state", { categories: WsfBlockClose });
export const EndBehavior = createWsfToken("EndBehavior", "end_behavior", { categories: WsfBlockClose });
export const EndAdvancedBehavior = createWsfToken("EndAdvancedBehavior", "end_advanced_behavior", { categories: WsfBlockClose });

// --- Sequence group ---
export const EndSequenceWithMemory = createWsfToken("EndSequenceWithMemory", "end_sequence_with_memory", { categories: WsfBlockClose });
export const EndSequence = createWsfToken("EndSequence", "end_sequence", { longer_alt: EndSequenceWithMemory, categories: WsfBlockClose });

// --- Selector group ---
export const EndSelectorWithMemory = createWsfToken("EndSelectorWithMemory", "end_selector_with_memory", { categories: WsfBlockClose });
export const EndSelector = createWsfToken("EndSelector", "end_selector", { longer_alt: EndSelectorWithMemory, categories: WsfBlockClose });

export const EndParallel = createWsfToken("EndParallel", "end_parallel", { categories: WsfBlockClose });
export const EndMedium = createWsfToken("EndMedium", "end_medium", { categories: WsfBlockClose });
export const EndProtocol = createWsfToken("EndProtocol", "end_protocol", { categories: WsfBlockClose });
export const EndProcess = createWsfToken("EndProcess", "end_process", { categories: WsfBlockClose });
export const EndDefaultProcess = createWsfToken("EndDefaultProcess", "end_default_process", { categories: WsfBlockClose });
export const EndDefaultRouting = createWsfToken("EndDefaultRouting", "end_default_routing", { categories: WsfBlockClose });
export const EndService = createWsfToken("EndService", "end_service", { categories: WsfBlockClose });
export const EndTransactor = createWsfToken("EndTransactor", "end_transactor", { categories: WsfBlockClose });
export const EndContainer = createWsfToken("EndContainer", "end_container", { categories: WsfBlockClose });
export const EndVisualPart = createWsfToken("EndVisualPart", "end_visual_part", { categories: WsfBlockClose });
export const EndSelect = createWsfToken("EndSelect", "end_select", { categories: WsfBlockClose });
export const EndFrequencyList = createWsfToken("EndFrequencyList", "end_frequency_list", { categories: WsfBlockClose });
export const EndPowers = createWsfToken("EndPowers", "end_powers", { categories: WsfBlockClose });

// --- Propagation group ---
export const EndPropagationModel = createWsfToken("EndPropagationModel", "end_propagation_model", { categories: WsfBlockClose });
export const EndPropagation = createWsfToken("EndPropagation", "end_propagation", { longer_alt: EndPropagationModel, categories: WsfBlockClose });

// --- Attenuation group ---
export const EndAttenuationModel = createWsfToken("EndAttenuationModel", "end_attenuation_model", { categories: WsfBlockClose });
export const EndAttenuation = createWsfToken("EndAttenuation", "end_attenuation", { longer_alt: EndAttenuationModel, categories: WsfBlockClose });

// --- Clutter group ---
export const EndClutterModel = createWsfToken("EndClutterModel", "end_clutter_model", { categories: WsfBlockClose });
export const EndClutter = createWsfToken("EndClutter", "end_clutter", { longer_alt: EndClutterModel, categories: WsfBlockClose });

// --- ErrorModel group ---
export const EndErrorModelParameters = createWsfToken("EndErrorModelParameters", "end_error_model_parameters", { categories: WsfBlockClose });
export const EndErrorModel = createWsfToken("EndErrorModel", "end_error_model", { longer_alt: EndErrorModelParameters, categories: WsfBlockClose });

export const EndQuery = createWsfToken("EndQuery", "end_query", { categories: WsfBlockClose });

// --- Filter group ---
export const EndFilteredConnection = createWsfToken("EndFilteredConnection", "end_filtered_connection", { categories: WsfBlockClose });
export const EndFilter = createWsfToken("EndFilter", "end_filter", { longer_alt: EndFilteredConnection, categories: WsfBlockClose });

export const EndDisInterface = createWsfToken("EndDisInterface", "end_dis_interface", { categories: WsfBlockClose });
export const EndXioInterface = createWsfToken("EndXioInterface", "end_xio_interface", { categories: WsfBlockClose });

// --- Connections group ---
export const EndEditConnections = createWsfToken("EndEditConnections", "end_edit_connections", { categories: WsfBlockClose });
export const EndConnections = createWsfToken("EndConnections", "end_connections", { longer_alt: EndEditConnections, categories: WsfBlockClose });

export const EndNavigation = createWsfToken("EndNavigation", "end_navigation", { categories: WsfBlockClose });
export const EndTerrain = createWsfToken("EndTerrain", "end_terrain", { categories: WsfBlockClose });
export const EndGlobalEnvironment = createWsfToken("EndGlobalEnvironment", "end_global_environment", { categories: WsfBlockClose });
export const EndCentralBody = createWsfToken("EndCentralBody", "end_central_body", { categories: WsfBlockClose });
export const EndObserver = createWsfToken("EndObserver", "end_observer", { categories: WsfBlockClose });
export const EndScriptStruct = createWsfToken("EndScriptStruct", "end_script_struct", { categories: WsfBlockClose });
export const EndSignalProcessor = createWsfToken("EndSignalProcessor", "end_signal_processor", { categories: WsfBlockClose });
export const EndEventPipe = createWsfToken("EndEventPipe", "end_event_pipe", { categories: WsfBlockClose });
export const EndScriptInterface = createWsfToken("EndScriptInterface", "end_script_interface", { categories: WsfBlockClose });
// export const EndSide = createWsfToken("EndSide", "end_side", { categories: WsfBlockClose });
export const EndIffMapping = createWsfToken("EndIffMapping", "end_iff_mapping", { categories: WsfBlockClose });
export const EndConditionals = createWsfToken("EndConditionals", "end_conditionals", { categories: WsfBlockClose });

// --- Classification group ---
export const EndClassificationLevels = createWsfToken("EndClassificationLevels", "end_classification_levels", { categories: WsfBlockClose });
export const EndClassification = createWsfToken("EndClassification", "end_classification", { longer_alt: EndClassificationLevels, categories: WsfBlockClose });

export const EndGroup = createWsfToken("EndGroup", "end_group", { categories: WsfBlockClose });
export const EndDraw = createWsfToken("EndDraw", "end_draw", { categories: WsfBlockClose });
export const EndNoisyCloud = createWsfToken("EndNoisyCloud", "end_noise_cloud", { categories: WsfBlockClose });
export const EndDetectionThresholds = createWsfToken("EndDetectionThresholds", "end_detection_thresholds", { categories: WsfBlockClose });
export const EndDetectionProbability = createWsfToken("EndDetectionProbability", "end_detection_probability", { categories: WsfBlockClose });
export const EndFusionMethod = createWsfToken("EndFusionMethod", "end_fusion_method", { categories: WsfBlockClose });
export const EndFile = createWsfToken("EndFile", "end_file", { categories: WsfBlockClose });

// ============================================================================
// Script Entry Keywords — push to SCRIPT_MODE
// ============================================================================

export const OnInitialize = createWsfToken("OnInitialize", "on_initialize2?", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnUpdate = createWsfToken("OnUpdate", "on_update", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnEntry = createWsfToken("OnEntry", "on_entry", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnExit = createWsfToken("OnExit", "on_exit", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnMessage = createWsfToken("OnMessage", "on_message", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnInit = createWsfToken("OnInit", "on_init", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnTrackDrop = createWsfToken("OnTrackDrop", "on_track_drop", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnBingo = createWsfToken("OnBingo", "on_bingo", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnEmpty = createWsfToken("OnEmpty", "on_empty", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnRefuel = createWsfToken("OnRefuel", "on_refuel", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnReserve = createWsfToken("OnReserve", "on_reserve", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnNewExecute = createWsfToken("OnNewExecute", "on_new_execute", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const OnNewFail = createWsfToken("OnNewFail", "on_new_fail", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const Precondition = createWsfToken("Precondition", "precondition", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const NextState = createWsfToken("NextState", "next_state", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });
export const ScriptVariables = createWsfToken("ScriptVariables", "script_variables", { push_mode: "SCRIPT_MODE", categories: ScriptEntryCategory });

// `execute` and `script` need custom matchers — see custom-matchers.ts
// They are created there and imported into multi-mode-lexer.ts

// ============================================================================
// WSF Identifier — fallback for anything not matched by keywords
// Must be placed LAST in the WSF_MODE token list
// ============================================================================

export const WsfIdentifier = createToken({
  name: "WsfIdentifier",
  // Permissive: allows -, /, . for paths like "my-router", "version/1.0", etc.
  pattern: /[a-zA-Z_][a-zA-Z0-9_\-\/\.]*/,
});

// ============================================================================
// Keyword sets for external use
// ============================================================================

/** Set of all end_* keyword names */
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
  "end_iff_mapping", "end_conditionals",
  "end_classification", "end_classification_levels",
  "end_group", "end_draw", "end_noise_cloud",
  "end_detection_thresholds", "end_detection_probability",
  "end_fusion_method", "end_file",
]);

/** Set of top-level WSF block-open keyword strings */
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
