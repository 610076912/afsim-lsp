// ============================================================================
// WSF Structs — struct hierarchy and type information
// Extracted from wsf.ag struct definitions
// Used by completion service to suggest valid types for components
// ============================================================================
// ---------------------------------------------------------------------------
// Sensor types (valid as 3rd arg in: sensor <name> <type>)
// ---------------------------------------------------------------------------
export const WSF_SENSOR_TYPES = [
    { name: "WSF_NULL_SENSOR", description: "Null (placeholder) sensor" },
    { name: "WSF_GEOMETRIC_SENSOR", description: "Geometric detection sensor" },
    { name: "WSF_RADAR_SENSOR", description: "Radar sensor" },
    { name: "WSF_PASSIVE_SENSOR", description: "Passive sensor" },
    { name: "WSF_COMPOSITE_SENSOR", description: "Composite (multi-mode) sensor" },
];
// ---------------------------------------------------------------------------
// Processor types (valid as 3rd arg in: processor <name> <type>)
// ---------------------------------------------------------------------------
export const WSF_PROCESSOR_TYPES = [
    { name: "WSF_SCRIPT_PROCESSOR", description: "Script-controlled processor" },
    { name: "WSF_TRACK_PROCESSOR", description: "Track management processor" },
    { name: "WSF_MESSAGE_PROCESSOR", description: "Message routing processor" },
    { name: "WSF_DELAY_PROCESSOR", description: "Delayed execution processor" },
    { name: "WSF_DIRECTION_FINDER_PROCESSOR", description: "Direction finding processor" },
    { name: "WSF_LINKED_SCRIPT_PROCESSOR", description: "Linked script processor" },
    { name: "WSF_EXCHANGE_PROCESSOR", description: "Data exchange processor" },
    { name: "WSF_MOVE_PLAN_PROCESSOR", description: "Movement planning processor" },
    { name: "WSF_PERFECT_TRACKER", description: "Perfect tracking processor" },
    { name: "WSF_TASK_PROCESSOR", description: "Task management processor" },
    { name: "WSF_LINKED_PROCESSOR", description: "Linked processor" },
];
// ---------------------------------------------------------------------------
// Mover types (valid as 2nd arg in: mover <type>)
// ---------------------------------------------------------------------------
export const WSF_MOVER_TYPES = [
    { name: "WSF_AIR_MOVER", description: "Air platform mover" },
    { name: "WSF_GROUND_MOVER", description: "Ground platform mover" },
    { name: "WSF_ROAD_MOVER", description: "Road-following mover" },
    { name: "WSF_SURFACE_MOVER", description: "Surface (water) mover" },
    { name: "WSF_KINEMATIC_MOVER", description: "Kinematic mover" },
    { name: "WSF_WAYPOINT_MOVER", description: "Waypoint-following mover", baseType: "WSF_ROUTE_MOVER" },
    { name: "WSF_ROTORCRAFT_MOVER", description: "Rotorcraft mover" },
    { name: "WSF_HYBRID_MOVER", description: "Hybrid (multi-domain) mover" },
    { name: "WSF_OFFSET_MOVER", description: "Offset from parent mover" },
    { name: "WSF_TSPI_MOVER", description: "Time-space-position mover" },
    { name: "WSF_ITERATIVE_MOVER", description: "Iterative route mover", baseType: "WSF_ROUTE_MOVER" },
];
// ---------------------------------------------------------------------------
// Comm types (valid as 3rd arg in: comm <name> <type>)
// ---------------------------------------------------------------------------
export const WSF_COMM_TYPES = [
    { name: "WSF_COMM_TRANSCEIVER", description: "Comm transceiver" },
    { name: "WSF_COMM_RCVR", description: "Comm receiver only" },
    { name: "WSF_COMM_XMTR", description: "Comm transmitter only" },
    { name: "WSF_RADIO_TRANSCEIVER", description: "Radio transceiver" },
    { name: "WSF_RADIO_RCVR", description: "Radio receiver" },
    { name: "WSF_RADIO_XMTR", description: "Radio transmitter" },
];
// ---------------------------------------------------------------------------
// Network types (valid as 3rd arg in: network <name> <type>)
// ---------------------------------------------------------------------------
export const WSF_NETWORK_TYPES = [
    { name: "WSF_COMM_NETWORK_GENERIC", description: "Generic network" },
    { name: "WSF_COMM_NETWORK_P2P", description: "Point-to-point network" },
    { name: "WSF_COMM_NETWORK_MESH", description: "Mesh network" },
    { name: "WSF_COMM_NETWORK_MESH_LEGACY", description: "Legacy mesh network" },
    { name: "WSF_COMM_NETWORK_STAR", description: "Star topology network" },
    { name: "WSF_COMM_NETWORK_RING", description: "Ring topology network" },
    { name: "WSF_COMM_NETWORK_DIRECTED_RING", description: "Directed ring network" },
    { name: "WSF_COMM_NETWORK_AD_HOC", description: "Ad-hoc network" },
];
// ---------------------------------------------------------------------------
// Fuel types (valid in: fuel <type>)
// ---------------------------------------------------------------------------
export const WSF_FUEL_TYPES = [
    { name: "WSF_VARIABLE_RATE_FUEL", description: "Variable rate fuel model" },
    { name: "WSF_TABULAR_RATE_FUEL", description: "Tabular rate fuel model" },
    { name: "WSF_TANKED_FUEL", description: "Tanked fuel model" },
];
// ---------------------------------------------------------------------------
// Filter types (valid as 3rd arg in: filter <name> <type>)
// ---------------------------------------------------------------------------
export const WSF_FILTER_TYPES = [
    { name: "WSF_ALPHA_BETA_FILTER", description: "Alpha-beta filter" },
    { name: "WSF_ALPHA_BETA_GAMMA_FILTER", description: "Alpha-beta-gamma filter" },
    { name: "WSF_KALMAN_FILTER", description: "Kalman filter" },
    { name: "WSF_KALMAN_FILTER_2D_RB", description: "2D range-bearing Kalman filter" },
];
// ---------------------------------------------------------------------------
// Field of view types
// ---------------------------------------------------------------------------
export const WSF_FOV_TYPES = [
    { name: "circular", description: "Circular field of view" },
    { name: "rectangular", description: "Rectangular field of view" },
    { name: "polygonal", description: "Polygonal field of view" },
    { name: "equatorial", description: "Equatorial field of view" },
];
// ---------------------------------------------------------------------------
// Propagation model types
// ---------------------------------------------------------------------------
export const WSF_PROPAGATION_TYPES = [
    { name: "none", description: "No propagation model" },
    { name: "WSF_FAST_MULTIPATH", description: "Fast multipath model" },
    { name: "WSF_GROUND_WAVE_PROPAGATION", description: "Ground wave propagation" },
];
// ---------------------------------------------------------------------------
// Attenuation model types
// ---------------------------------------------------------------------------
export const WSF_ATTENUATION_TYPES = [
    { name: "WSF_BLAKE_ATTENUATION", description: "Blake attenuation model" },
    { name: "WSF_ITU_ATTENUATION", description: "ITU attenuation model" },
    { name: "WSF_SIMPLE_ATTENUATION", description: "Simple attenuation model" },
    { name: "WSF_TABULAR_ATTENUATION", description: "Tabular attenuation model" },
];
const COMPONENT_TYPES = {
    sensor: WSF_SENSOR_TYPES,
    processor: WSF_PROCESSOR_TYPES,
    mover: WSF_MOVER_TYPES,
    comm: WSF_COMM_TYPES,
    network: WSF_NETWORK_TYPES,
    fuel: WSF_FUEL_TYPES,
    filter: WSF_FILTER_TYPES,
    field_of_view: WSF_FOV_TYPES,
    propagation: WSF_PROPAGATION_TYPES,
    attenuation: WSF_ATTENUATION_TYPES,
};
/**
 * Get available struct types for a given component keyword.
 */
export function getTypesForComponent(keyword) {
    return COMPONENT_TYPES[keyword] ?? [];
}
//# sourceMappingURL=wsf-structs.js.map