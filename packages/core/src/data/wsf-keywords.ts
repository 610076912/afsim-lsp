// ============================================================================
// WSF Keywords — categorized keyword data extracted from wsf.ag
// Used by completion service to provide context-aware keyword suggestions
// ============================================================================

/** WSF keyword entry with optional detail for completion display */
export interface WsfKeywordEntry {
  /** The keyword text */
  keyword: string;
  /** Short description for completion detail */
  detail?: string;
  /** The corresponding end keyword (if this is a block keyword) */
  endKeyword?: string;
}

// ---------------------------------------------------------------------------
// Top-level block keywords (can appear at root level of a WSF file)
// ---------------------------------------------------------------------------

export const WSF_TOP_LEVEL_BLOCK_KEYWORDS: readonly WsfKeywordEntry[] = [
  { keyword: "platform_type", detail: "Define a platform type", endKeyword: "end_platform_type" },
  { keyword: "platform", detail: "Instantiate a platform", endKeyword: "end_platform" },
  { keyword: "sensor", detail: "Define a sensor type", endKeyword: "end_sensor" },
  { keyword: "processor", detail: "Define a processor type", endKeyword: "end_processor" },
  { keyword: "comm", detail: "Define a comm type", endKeyword: "end_comm" },
  { keyword: "network", detail: "Define a network type", endKeyword: "end_network" },
  { keyword: "router", detail: "Define a router type", endKeyword: "end_router" },
  { keyword: "mover", detail: "Define a mover type", endKeyword: "end_mover" },
  { keyword: "fuel", detail: "Define a fuel type", endKeyword: "end_fuel" },
  { keyword: "aero", detail: "Define an aero type", endKeyword: "end_aero" },
  { keyword: "zone", detail: "Define a zone", endKeyword: "end_zone" },
  { keyword: "zone_set", detail: "Define a zone set", endKeyword: "end_zone_set" },
  { keyword: "route", detail: "Define a route", endKeyword: "end_route" },
  { keyword: "route_network", detail: "Define a route network", endKeyword: "end_route_network" },
  { keyword: "radar_signature", detail: "Define a radar signature", endKeyword: "end_radar_signature" },
  { keyword: "antenna_pattern", detail: "Define an antenna pattern", endKeyword: "end_antenna_pattern" },
  { keyword: "thermal_system", detail: "Define a thermal system", endKeyword: "end_thermal_system" },
  { keyword: "masking_pattern", detail: "Define a masking pattern", endKeyword: "end_masking_pattern" },
  { keyword: "intersect_mesh", detail: "Define an intersect mesh", endKeyword: "end_intersect_mesh" },
  { keyword: "callback", detail: "Define a script callback", endKeyword: "end_callback" },
  { keyword: "filter", detail: "Define a track filter", endKeyword: "end_filter" },
  { keyword: "group", detail: "Define a platform group", endKeyword: "end_group" },
  { keyword: "dis_interface", detail: "Define a DIS interface", endKeyword: "end_dis_interface" },
  { keyword: "xio_interface", detail: "Define an XIO interface", endKeyword: "end_xio_interface" },
  { keyword: "terrain", detail: "Configure terrain", endKeyword: "end_terrain" },
  { keyword: "global_environment", detail: "Global environment settings", endKeyword: "end_global_environment" },
  { keyword: "central_body", detail: "Central body definition", endKeyword: "end_central_body" },
  { keyword: "script_struct", detail: "Define a script struct", endKeyword: "end_script_struct" },
  { keyword: "signal_processor", detail: "Define a signal processor", endKeyword: "end_signal_processor" },
  { keyword: "event_pipe", detail: "Define an event pipe", endKeyword: "end_event_pipe" },
  { keyword: "scenario", detail: "Scenario configuration block" },
];

// ---------------------------------------------------------------------------
// Top-level non-block keywords (commands at root level)
// ---------------------------------------------------------------------------

export const WSF_TOP_LEVEL_COMMANDS: readonly WsfKeywordEntry[] = [
  { keyword: "include", detail: "Include another WSF file" },
  { keyword: "load", detail: "Load a WSF file" },
  { keyword: "edit", detail: "Edit an existing definition" },
  { keyword: "end_time", detail: "Set simulation end time" },
  { keyword: "side", detail: "Define a side", endKeyword: "end_side" },
  { keyword: "iff_mapping", detail: "Define IFF mapping", endKeyword: "end_iff_mapping" },
  { keyword: "classification_levels", detail: "Define classification levels", endKeyword: "end_classification_levels" },
];

// ---------------------------------------------------------------------------
// Platform-type block sub-keywords (valid inside platform_type ... end_platform_type)
// ---------------------------------------------------------------------------

export const WSF_PLATFORM_COMMANDS: readonly WsfKeywordEntry[] = [
  { keyword: "side", detail: "Set platform side" },
  { keyword: "side_id", detail: "Set platform side ID" },
  { keyword: "icon", detail: "Set platform icon" },
  { keyword: "marking", detail: "Set DIS marking" },
  { keyword: "indestructible", detail: "Make platform indestructible" },
  { keyword: "destructible", detail: "Make platform destructible" },
  { keyword: "spatial_domain", detail: "Set spatial domain" },
  { keyword: "radar_signature", detail: "Assign radar signature" },
  { keyword: "intersect_mesh", detail: "Assign intersect mesh" },
  { keyword: "category", detail: "Set platform category" },
  { keyword: "sensor", detail: "Add a sensor component", endKeyword: "end_sensor" },
  { keyword: "processor", detail: "Add a processor component", endKeyword: "end_processor" },
  { keyword: "comm", detail: "Add a comm component", endKeyword: "end_comm" },
  { keyword: "router", detail: "Add a router component", endKeyword: "end_router" },
  { keyword: "mover", detail: "Add a mover component", endKeyword: "end_mover" },
  { keyword: "fuel", detail: "Add a fuel component", endKeyword: "end_fuel" },
  { keyword: "thermal_system", detail: "Add a thermal system", endKeyword: "end_thermal_system" },
  { keyword: "visual_part", detail: "Add a visual part", endKeyword: "end_visual_part" },
  { keyword: "zone", detail: "Add a zone reference", endKeyword: "end_zone" },
  { keyword: "track_manager", detail: "Configure track manager", endKeyword: "end_track_manager" },
  { keyword: "navigation_errors", detail: "Configure navigation errors", endKeyword: "end_navigation_errors" },
  { keyword: "script_variables", detail: "Declare script variables" },
  { keyword: "on_initialize", detail: "Initialization script" },
  { keyword: "on_initialize2", detail: "Secondary initialization script" },
];

// ---------------------------------------------------------------------------
// Platform instance sub-keywords (valid inside platform ... end_platform)
// ---------------------------------------------------------------------------

export const WSF_PLATFORM_INSTANCE_COMMANDS: readonly WsfKeywordEntry[] = [
  { keyword: "position", detail: "Set initial position" },
  { keyword: "heading", detail: "Set initial heading" },
  { keyword: "speed", detail: "Set initial speed" },
  { keyword: "altitude", detail: "Set initial altitude" },
  { keyword: "route", detail: "Assign route" },
  { keyword: "commander", detail: "Set commander" },
  { keyword: "count", detail: "Number of instances" },
  { keyword: "add", detail: "Add component to instance" },
  { keyword: "edit", detail: "Edit component in instance" },
  { keyword: "delete", detail: "Delete component from instance" },
];

// ---------------------------------------------------------------------------
// Sensor block sub-keywords
// ---------------------------------------------------------------------------

export const WSF_SENSOR_COMMANDS: readonly WsfKeywordEntry[] = [
  { keyword: "message_length", detail: "Set message length" },
  { keyword: "message_priority", detail: "Set message priority" },
  { keyword: "ignore", detail: "Ignore category" },
  { keyword: "ignore_side", detail: "Ignore a side" },
  { keyword: "ignore_domain", detail: "Ignore spatial domain" },
  { keyword: "ignore_same_side", detail: "Ignore own side" },
  { keyword: "ignore_nothing", detail: "Do not ignore anything" },
  { keyword: "modifier_category", detail: "Set modifier category" },
  { keyword: "output_dis", detail: "Enable DIS output" },
  { keyword: "scheduler", detail: "Configure scheduler", endKeyword: "end_scheduler" },
  { keyword: "mode", detail: "Define sensor mode", endKeyword: "end_mode" },
  { keyword: "mode_template", detail: "Reference mode template", endKeyword: "end_mode_template" },
  { keyword: "field_of_view", detail: "Set field of view", endKeyword: "end_field_of_view" },
  { keyword: "transmitter", detail: "Configure transmitter", endKeyword: "end_transmitter" },
  { keyword: "receiver", detail: "Configure receiver", endKeyword: "end_receiver" },
  { keyword: "detection_thresholds", detail: "Set detection thresholds", endKeyword: "end_detection_thresholds" },
  { keyword: "detection_probability", detail: "Set detection probability", endKeyword: "end_detection_probability" },
];

// ---------------------------------------------------------------------------
// Processor block sub-keywords
// ---------------------------------------------------------------------------

export const WSF_PROCESSOR_COMMANDS: readonly WsfKeywordEntry[] = [
  { keyword: "update_interval", detail: "Set update interval" },
  { keyword: "script_variables", detail: "Declare script variables" },
  { keyword: "on_initialize", detail: "Initialization script" },
  { keyword: "on_initialize2", detail: "Secondary initialization script" },
  { keyword: "on_update", detail: "Update script" },
  { keyword: "on_message", detail: "Message handler script" },
  { keyword: "on_track_drop", detail: "Track drop handler" },
];

// ---------------------------------------------------------------------------
// WSF_SCRIPT_PROCESSOR specific commands
// ---------------------------------------------------------------------------

export const WSF_SCRIPT_PROCESSOR_COMMANDS: readonly WsfKeywordEntry[] = [
  ...WSF_PROCESSOR_COMMANDS,
  { keyword: "state", detail: "Define state machine state", endKeyword: "end_state" },
  { keyword: "behavior_tree", detail: "Define behavior tree", endKeyword: "end_behavior_tree" },
  { keyword: "advanced_behavior_tree", detail: "Define advanced behavior tree", endKeyword: "end_advanced_behavior_tree" },
  { keyword: "external_link", detail: "Define external processor link" },
  { keyword: "report_to", detail: "Set reporting target" },
];

// ---------------------------------------------------------------------------
// State block sub-keywords
// ---------------------------------------------------------------------------

export const WSF_STATE_COMMANDS: readonly WsfKeywordEntry[] = [
  { keyword: "on_entry", detail: "State entry script" },
  { keyword: "on_exit", detail: "State exit script" },
  { keyword: "next_state", detail: "State transition condition" },
];

// ---------------------------------------------------------------------------
// Behavior tree sub-keywords
// ---------------------------------------------------------------------------

export const WSF_BEHAVIOR_TREE_COMMANDS: readonly WsfKeywordEntry[] = [
  { keyword: "sequence", detail: "Sequence composite node", endKeyword: "end_sequence" },
  { keyword: "sequence_with_memory", detail: "Sequence with memory", endKeyword: "end_sequence_with_memory" },
  { keyword: "selector", detail: "Selector composite node", endKeyword: "end_selector" },
  { keyword: "selector_with_memory", detail: "Selector with memory", endKeyword: "end_selector_with_memory" },
  { keyword: "parallel", detail: "Parallel composite node", endKeyword: "end_parallel" },
  { keyword: "precondition", detail: "Precondition script" },
  { keyword: "execute", detail: "Execution script" },
  { keyword: "on_init", detail: "Initialization script" },
  { keyword: "on_new_execute", detail: "New execute handler" },
  { keyword: "on_new_fail", detail: "New fail handler" },
];

// ---------------------------------------------------------------------------
// Comm block sub-keywords
// ---------------------------------------------------------------------------

export const WSF_COMM_COMMANDS: readonly WsfKeywordEntry[] = [
  { keyword: "network_name", detail: "Set network name" },
  { keyword: "network_address", detail: "Set network address" },
  { keyword: "address", detail: "Set comm address" },
  { keyword: "router_name", detail: "Set router name" },
  { keyword: "protocol", detail: "Define protocol", endKeyword: "end_protocol" },
  { keyword: "medium", detail: "Define medium", endKeyword: "end_medium" },
  { keyword: "transmitter", detail: "Configure transmitter", endKeyword: "end_transmitter" },
  { keyword: "receiver", detail: "Configure receiver", endKeyword: "end_receiver" },
];

// ---------------------------------------------------------------------------
// Mover block sub-keywords
// ---------------------------------------------------------------------------

export const WSF_MOVER_COMMANDS: readonly WsfKeywordEntry[] = [
  { keyword: "update_interval", detail: "Set update interval" },
  { keyword: "update_time_tolerance", detail: "Set update time tolerance" },
  { keyword: "navigation", detail: "Navigation settings", endKeyword: "end_navigation" },
];

// ---------------------------------------------------------------------------
// Route block sub-keywords
// ---------------------------------------------------------------------------

export const WSF_ROUTE_COMMANDS: readonly WsfKeywordEntry[] = [
  { keyword: "position", detail: "Add waypoint by lat/lon" },
  { keyword: "offset", detail: "Add waypoint by offset" },
  { keyword: "turn_right", detail: "Add turn right waypoint" },
  { keyword: "turn_left", detail: "Add turn left waypoint" },
  { keyword: "turn_to_heading", detail: "Add turn to heading waypoint" },
  { keyword: "speed", detail: "Set route speed" },
  { keyword: "altitude", detail: "Set route altitude" },
  { keyword: "navigation", detail: "Navigation settings", endKeyword: "end_navigation" },
];

// ---------------------------------------------------------------------------
// Script entry keywords (trigger SCRIPT_MODE)
// ---------------------------------------------------------------------------

export const SCRIPT_ENTRY_KEYWORDS: readonly WsfKeywordEntry[] = [
  { keyword: "on_initialize", detail: "Initialization script block", endKeyword: "end_on_initialize" },
  { keyword: "on_initialize2", detail: "Secondary initialization", endKeyword: "end_on_initialize2" },
  { keyword: "on_update", detail: "Periodic update script", endKeyword: "end_on_update" },
  { keyword: "on_entry", detail: "State entry script", endKeyword: "end_on_entry" },
  { keyword: "on_exit", detail: "State exit script", endKeyword: "end_on_exit" },
  { keyword: "on_message", detail: "Message handler script", endKeyword: "end_on_message" },
  { keyword: "on_init", detail: "Init script", endKeyword: "end_on_init" },
  { keyword: "on_track_drop", detail: "Track drop handler", endKeyword: "end_on_track_drop" },
  { keyword: "on_bingo", detail: "Bingo fuel handler", endKeyword: "end_on_bingo" },
  { keyword: "on_empty", detail: "Empty fuel handler", endKeyword: "end_on_empty" },
  { keyword: "on_refuel", detail: "Refuel handler", endKeyword: "end_on_refuel" },
  { keyword: "on_reserve", detail: "Reserve fuel handler", endKeyword: "end_on_reserve" },
  { keyword: "on_new_execute", detail: "New execute handler", endKeyword: "end_on_new_execute" },
  { keyword: "on_new_fail", detail: "New fail handler", endKeyword: "end_on_new_fail" },
  { keyword: "precondition", detail: "Precondition check", endKeyword: "end_precondition" },
  { keyword: "next_state", detail: "State transition condition", endKeyword: "end_next_state" },
  { keyword: "script_variables", detail: "Script variable declarations", endKeyword: "end_script_variables" },
  { keyword: "execute", detail: "Timed execute block", endKeyword: "end_execute" },
  { keyword: "script", detail: "Script function definition", endKeyword: "end_script" },
];

// ---------------------------------------------------------------------------
// WSF value/boolean keywords
// ---------------------------------------------------------------------------

export const WSF_BOOLEAN_KEYWORDS: readonly string[] = [
  "true", "false", "yes", "no", "on", "off", "none", "default",
];

// ---------------------------------------------------------------------------
// Lookup: context type → applicable keywords
// ---------------------------------------------------------------------------

export type WsfBlockContext =
  | "root"
  | "platform_type"
  | "platform"
  | "sensor"
  | "processor"
  | "script_processor"
  | "comm"
  | "mover"
  | "route"
  | "state"
  | "behavior_tree";

const CONTEXT_KEYWORDS: Record<WsfBlockContext, readonly WsfKeywordEntry[]> = {
  root: [...WSF_TOP_LEVEL_BLOCK_KEYWORDS, ...WSF_TOP_LEVEL_COMMANDS],
  platform_type: WSF_PLATFORM_COMMANDS,
  platform: [...WSF_PLATFORM_COMMANDS, ...WSF_PLATFORM_INSTANCE_COMMANDS],
  sensor: WSF_SENSOR_COMMANDS,
  processor: WSF_PROCESSOR_COMMANDS,
  script_processor: WSF_SCRIPT_PROCESSOR_COMMANDS,
  comm: WSF_COMM_COMMANDS,
  mover: WSF_MOVER_COMMANDS,
  route: WSF_ROUTE_COMMANDS,
  state: WSF_STATE_COMMANDS,
  behavior_tree: WSF_BEHAVIOR_TREE_COMMANDS,
};

/**
 * Get applicable WSF keywords for a given block context.
 */
export function getWsfKeywordsForContext(context: WsfBlockContext): readonly WsfKeywordEntry[] {
  return CONTEXT_KEYWORDS[context] ?? CONTEXT_KEYWORDS.root;
}
