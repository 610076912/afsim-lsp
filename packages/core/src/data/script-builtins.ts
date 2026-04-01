// ============================================================================
// Script Builtins — built-in types, functions, and system variables
// Extracted from documentation/docs/script/*.rst reference files
// Used by completion service for script context auto-completion
// ============================================================================

// ---------------------------------------------------------------------------
// Method signature representation
// ---------------------------------------------------------------------------

export interface MethodSignature {
  /** Method name */
  name: string;
  /** Return type as string */
  returnType: string;
  /** Parameter list as display string (e.g. "double x, double y") */
  params: string;
  /** Is this a static method? */
  isStatic?: boolean;
  /** Short description */
  description?: string;
}

// ---------------------------------------------------------------------------
// Script class definition
// ---------------------------------------------------------------------------

export interface ScriptClass {
  /** Class name (e.g. "WsfPlatform") */
  name: string;
  /** Base class name if any */
  baseClass?: string;
  /** Short description */
  description: string;
  /** Key methods (representative subset for completion) */
  methods: readonly MethodSignature[];
}

// ---------------------------------------------------------------------------
// Built-in global functions (from __BUILTIN__ class)
// These can be called without class prefix
// ---------------------------------------------------------------------------

export const BUILTIN_FUNCTIONS: readonly MethodSignature[] = [
  // Output/logging
  { name: "writeln", returnType: "void", params: "Object obj1, [Object... objn]", description: "Print to console with newline" },
  { name: "writeln_d", returnType: "void", params: "Object obj1, [Object... objn]", description: "Debug print (can be disabled)" },
  { name: "writeln_fatal", returnType: "void", params: "Object obj1, [Object... objn]", description: "Print with FATAL tag" },
  { name: "writeln_error", returnType: "void", params: "Object obj1, [Object... objn]", description: "Print with ERROR tag" },
  { name: "writeln_warning", returnType: "void", params: "Object obj1, [Object... objn]", description: "Print with WARNING tag" },
  { name: "writeln_debug", returnType: "void", params: "Object obj1, [Object... objn]", description: "Alias for writeln_d" },
  { name: "writeln_developer", returnType: "void", params: "Object obj1, [Object... objn]", description: "Print with DEVELOPER tag" },
  { name: "write", returnType: "void", params: "Object obj1, [Object... objn]", description: "Print without newline" },
  { name: "write_d", returnType: "void", params: "Object obj1, [Object... objn]", description: "Debug print without newline" },
  { name: "write_str", returnType: "string", params: "Object obj1, [Object... objn]", description: "Concatenate to string" },
  // Object introspection
  { name: "has_attr", returnType: "bool", params: "Object aObject, string aAttributeName", description: "Check if attribute exists" },
  { name: "attr_count", returnType: "int", params: "Object aObject", description: "Get attribute count" },
  { name: "get_attr", returnType: "Object", params: "Object aObject, string aName", description: "Get attribute by name" },
  { name: "attr_name_at", returnType: "string", params: "Object aObject, int aIndex", description: "Get attribute name at index" },
  { name: "list_attr", returnType: "Array<string>", params: "Object aObject", description: "List all attribute names" },
  { name: "has_script", returnType: "bool", params: "Object aObject, string aScriptName", description: "Check if script exists" },
  // Debugging
  { name: "__print_callstack", returnType: "void", params: "", description: "Print script call stack" },
  { name: "assert", returnType: "void", params: "bool aBoolExp, [string aMessage]", description: "Assert condition is true" },
];

// ---------------------------------------------------------------------------
// System variables available in script contexts
// ---------------------------------------------------------------------------

export interface SystemVariable {
  name: string;
  type: string;
  description: string;
  /** Available in all contexts, or only specific ones? */
  contexts?: readonly string[];
}

export const SYSTEM_VARIABLES: readonly SystemVariable[] = [
  { name: "TIME_NOW", type: "double", description: "Current simulation time in seconds" },
  { name: "PLATFORM", type: "WsfPlatform", description: "Reference to current platform" },
  { name: "MATH", type: "Math", description: "Math object for random numbers" },
  { name: "PROCESSOR", type: "WsfProcessor", description: "Current processor", contexts: ["processor"] },
  { name: "SENSOR", type: "WsfSensor", description: "Current sensor", contexts: ["sensor"] },
  { name: "COMM", type: "WsfComm", description: "Current comm device", contexts: ["comm"] },
  { name: "MOVER", type: "WsfMover", description: "Current mover", contexts: ["mover"] },
  { name: "TRACK", type: "WsfTrack", description: "Current track", contexts: ["track_processor"] },
  { name: "MESSAGE", type: "WsfMessage", description: "Current message", contexts: ["on_message"] },
  { name: "FUEL", type: "WsfFuel", description: "Current fuel", contexts: ["fuel"] },
];

// ---------------------------------------------------------------------------
// Script type keywords (for var declarations and casts)
// ---------------------------------------------------------------------------

export const SCRIPT_TYPE_KEYWORDS: readonly string[] = [
  "void", "int", "double", "string", "char", "bool",
];

// ---------------------------------------------------------------------------
// Script control-flow keywords
// ---------------------------------------------------------------------------

export const SCRIPT_CONTROL_KEYWORDS: readonly string[] = [
  "if", "else", "while", "do", "for", "foreach", "in",
  "break", "continue", "return",
];

// ---------------------------------------------------------------------------
// Script modifier keywords
// ---------------------------------------------------------------------------

export const SCRIPT_MODIFIER_KEYWORDS: readonly string[] = [
  "global", "static", "extern",
];

// ---------------------------------------------------------------------------
// Script literal keywords
// ---------------------------------------------------------------------------

export const SCRIPT_LITERAL_KEYWORDS: readonly string[] = [
  "true", "false", "null", "NULL",
];

// ---------------------------------------------------------------------------
// All script class names (from documentation/docs/script/*.rst)
// ---------------------------------------------------------------------------

export const ALL_SCRIPT_CLASSES: readonly string[] = [
  // Core language types
  "Array", "ArrayIterator", "Iterator",
  "Map", "MapIterator",
  "Set", "SetIterator",
  // Math/Utility
  "Math", "Format", "Color", "Matrix", "Quaternion", "Vec3",
  // Geometry & spatial
  "CentralBody", "CoordinateSystem", "Ellipsoid",
  "Earth", "Moon", "Sun",
  "WsfGeoPoint", "WsfTerrain",
  // Time
  "Calendar", "WsfDateTime",
  // Platform & navigation
  "WsfPlatform", "WsfMover", "WsfRoute", "WsfWaypoint",
  "WsfPathFinder", "WsfRouteFinder", "WsfZoneRouteFinder",
  // Sensor systems
  "WsfSensor", "WsfAntennaPattern", "WsfFieldOfView",
  "WsfCircularFieldOfView", "WsfEquatorialFieldOfView",
  "WsfRectangularFieldOfView", "WsfPolygonalFieldOfView",
  "WsfPassiveSensor",
  // EM/Propagation
  "WsfEM_Antenna", "WsfEM_Attenuation", "WsfEM_Interaction",
  "WsfEM_Propagation", "WsfEM_Rcvr", "WsfEM_Xmtr", "WsfEM_XmtrRcvr",
  // Communications
  "WsfComm", "WsfCommMedium", "WsfCommMediumMode",
  "WsfCommMediumModeGuided", "WsfCommMediumModeUnguided",
  "WsfCommMessage", "WsfCommMediumMessageStatus",
  "WsfCommRouter", "WsfCommGraph", "WsfCommGraphEdge",
  "WsfCommGraphNode", "WsfCommInteraction", "WsfCommandChain",
  // Networks
  "WsfNetwork", "WsfNetworkAdhoc", "WsfNetworkDirectedRing",
  "WsfNetworkGeneric", "WsfNetworkMesh", "WsfNetworkMeshLegacy",
  "WsfNetworkP2P", "WsfNetworkRing", "WsfNetworkStar",
  // Processor & logic
  "WsfProcessor", "WsfTrackProcessor",
  "WsfStateMachine", "WsfBehaviorTreeNode",
  "WsfAdvancedBehaviorTree", "WsfAdvancedBehaviorTreeNode",
  // Tracking
  "WsfTrack", "WsfTrackId", "WsfTrackList", "WsfTrackManager",
  "WsfLocalTrack", "WsfLocalTrackList", "WsfLocalTrackStatus",
  "WsfTrackMessage", "WsfTrackNotifyMessage", "WsfTrackDropMessage",
  // Messaging
  "WsfMessage", "WsfAssociationMessage", "WsfControlMessage",
  "WsfStatusMessage", "WsfImage", "WsfImageMessage", "WsfVideoMessage",
  "WsfSensorInteraction",
  // Platform components
  "WsfArticulatedPart", "WsfPlatformPart", "WsfVisualPart",
  "WsfPlatformList", "WsfGroup", "WsfFuel", "WsfObject", "WsfAddress",
  // Orbital/physics
  "OrbitalElements", "OrbitalState", "WsfCovariance",
  // External interfaces
  "WsfDIS", "WsfXIO", "WsfXIO_Connection", "WsfXIO_PublishKey",
  "WsfEventPipe",
  // Graphics
  "WsfDraw", "WsfVisualization",
  // Utilities
  "EntityType", "Method", "Path", "Quadtree",
  "WsfRandom", "WsfRandomVariable",
  "WsfZone", "WsfOSM_Traffic",
  "WsfSimulation", "Signal", "FileIO", "Atmosphere", "System",
];

// ---------------------------------------------------------------------------
// Key class definitions with methods (for member-access completion)
// Representative subsets — not exhaustive but covers common usage
// ---------------------------------------------------------------------------

export const SCRIPT_CLASS_DEFINITIONS: readonly ScriptClass[] = [
  {
    name: "WsfPlatform",
    baseClass: "WsfObject",
    description: "Represents a simulation platform",
    methods: [
      { name: "Name", returnType: "string", params: "", description: "Get platform name" },
      { name: "TypeName", returnType: "string", params: "", description: "Get platform type name" },
      { name: "Side", returnType: "string", params: "", description: "Get platform side" },
      { name: "SetSide", returnType: "void", params: "string aSide", description: "Set platform side" },
      { name: "Index", returnType: "int", params: "", description: "Platform unique index" },
      { name: "Location", returnType: "WsfGeoPoint", params: "", description: "Current position" },
      { name: "Latitude", returnType: "double", params: "", description: "Current latitude (deg)" },
      { name: "Longitude", returnType: "double", params: "", description: "Current longitude (deg)" },
      { name: "Altitude", returnType: "double", params: "", description: "Current altitude (m)" },
      { name: "Heading", returnType: "double", params: "", description: "Current heading (deg)" },
      { name: "Speed", returnType: "double", params: "", description: "Current speed (m/s)" },
      { name: "Pitch", returnType: "double", params: "", description: "Current pitch (deg)" },
      { name: "Roll", returnType: "double", params: "", description: "Current roll (deg)" },
      { name: "SetHeading", returnType: "void", params: "double aHeading", description: "Set heading" },
      { name: "SetLocation", returnType: "void", params: "double aLat, double aLon, double aAlt", description: "Set position" },
      { name: "GoToLocation", returnType: "bool", params: "double aLat, double aLon", description: "Navigate to location" },
      { name: "GoToSpeed", returnType: "bool", params: "double aSpeed", description: "Set target speed" },
      { name: "GoToAltitude", returnType: "bool", params: "double aAlt", description: "Set target altitude" },
      { name: "TurnToHeading", returnType: "bool", params: "double aHeading", description: "Turn to heading" },
      { name: "FollowRoute", returnType: "bool", params: "string aRouteName", description: "Follow named route" },
      { name: "Mover", returnType: "WsfMover", params: "", description: "Get mover component" },
      { name: "Fuel", returnType: "WsfFuel", params: "", description: "Get fuel component" },
      { name: "Sensor", returnType: "WsfSensor", params: "string aName", description: "Get sensor by name" },
      { name: "SensorCount", returnType: "int", params: "", description: "Number of sensors" },
      { name: "SensorEntry", returnType: "WsfSensor", params: "int aIndex", description: "Get sensor by index" },
      { name: "Processor", returnType: "WsfProcessor", params: "string aName", description: "Get processor by name" },
      { name: "ProcessorCount", returnType: "int", params: "", description: "Number of processors" },
      { name: "Comm", returnType: "WsfComm", params: "string aName", description: "Get comm by name" },
      { name: "CommCount", returnType: "int", params: "", description: "Number of comms" },
      { name: "Router", returnType: "WsfCommRouter", params: "string aName", description: "Get router by name" },
      { name: "MasterTrackList", returnType: "WsfLocalTrackList", params: "", description: "Master track list" },
      { name: "TrackManager", returnType: "WsfTrackManager", params: "", description: "Track manager" },
      { name: "CurrentTarget", returnType: "WsfTrackId", params: "", description: "Current target" },
      { name: "SetCurrentTarget", returnType: "void", params: "WsfTrack aTrack", description: "Set current target" },
      { name: "HasCurrentTarget", returnType: "bool", params: "", description: "Has a current target" },
      { name: "Detonate", returnType: "void", params: "string aResult", description: "Detonate platform" },
      { name: "DeletePlatform", returnType: "void", params: "", description: "Delete platform" },
      { name: "SlantRangeTo", returnType: "double", params: "WsfPlatform aPlatform", description: "Range to platform" },
      { name: "GroundRangeTo", returnType: "double", params: "WsfPlatform aPlatform", description: "Ground range to platform" },
      { name: "TrueBearingTo", returnType: "double", params: "WsfPlatform aPlatform", description: "Bearing to platform" },
      { name: "Execute", returnType: "Object", params: "string aScript", description: "Execute script by name" },
      { name: "ExecuteScript", returnType: "bool", params: "string aScript", description: "Execute script" },
      { name: "ExecuteAtTime", returnType: "bool", params: "double aTime, string aScript", description: "Schedule script execution" },
      { name: "ScriptExists", returnType: "bool", params: "string aScript", description: "Check if script exists" },
      { name: "GeoPoint", returnType: "WsfGeoPoint", params: "", description: "Position as GeoPoint" },
      { name: "MakeTrack", returnType: "WsfTrack", params: "", description: "Create track from platform" },
      { name: "Zone", returnType: "WsfZone", params: "string aName", description: "Get zone by name" },
      { name: "WithinZone", returnType: "bool", params: "string aZoneName", description: "Check if in zone" },
      { name: "CreationTime", returnType: "double", params: "", description: "Platform creation time" },
      { name: "Commander", returnType: "WsfPlatform", params: "", description: "Commander platform" },
      { name: "Subordinates", returnType: "WsfPlatformList", params: "", description: "Subordinate platforms" },
      { name: "IsA_TypeOf", returnType: "bool", params: "string aDerived, string aBase", isStatic: true, description: "Check type inheritance" },
    ],
  },
  {
    name: "WsfSensor",
    baseClass: "WsfArticulatedPart",
    description: "Represents a sensor component",
    methods: [
      { name: "Name", returnType: "string", params: "", description: "Sensor name" },
      { name: "TypeName", returnType: "string", params: "", description: "Sensor type name" },
      { name: "TurnOn", returnType: "bool", params: "", description: "Turn sensor on" },
      { name: "TurnOff", returnType: "bool", params: "", description: "Turn sensor off" },
      { name: "ModeCount", returnType: "int", params: "", description: "Number of modes" },
      { name: "CurrentMode", returnType: "string", params: "", description: "Current mode name" },
      { name: "SelectMode", returnType: "void", params: "string aModeName", description: "Select a mode" },
      { name: "DeselectMode", returnType: "void", params: "string aModeName", description: "Deselect a mode" },
      { name: "FrameTime", returnType: "double", params: "", description: "Frame time of current mode" },
      { name: "FOV", returnType: "WsfFieldOfView", params: "", description: "Field of view" },
      { name: "ActiveTrackCount", returnType: "int", params: "", description: "Active track count" },
      { name: "MaximumTrackCount", returnType: "int", params: "", description: "Maximum track count" },
      { name: "StartTracking", returnType: "bool", params: "WsfTrack aTrack", description: "Start tracking" },
      { name: "StopTracking", returnType: "bool", params: "WsfTrack aTrack", description: "Stop tracking" },
      { name: "WithinFieldOfView", returnType: "bool", params: "WsfGeoPoint aPoint", description: "Check if in FOV" },
      { name: "Xmtr", returnType: "WsfEM_Xmtr", params: "", description: "Get transmitter" },
      { name: "Rcvr", returnType: "WsfEM_Rcvr", params: "", description: "Get receiver" },
      { name: "IsA_TypeOf", returnType: "bool", params: "string aDerived, string aBase", isStatic: true, description: "Check type inheritance" },
    ],
  },
  {
    name: "WsfProcessor",
    baseClass: "WsfPlatformPart",
    description: "Represents a processor component",
    methods: [
      { name: "Name", returnType: "string", params: "", description: "Processor name" },
      { name: "TypeName", returnType: "string", params: "", description: "Processor type name" },
      { name: "TurnOn", returnType: "bool", params: "", description: "Turn processor on" },
      { name: "TurnOff", returnType: "bool", params: "", description: "Turn processor off" },
      { name: "UpdateInterval", returnType: "double", params: "", description: "Get update interval" },
      { name: "SetUpdateInterval", returnType: "void", params: "double aInterval", description: "Set update interval" },
      { name: "Execute", returnType: "Object", params: "string aScript", description: "Execute script by name" },
      { name: "ExecuteScript", returnType: "bool", params: "string aScript", description: "Execute script" },
      { name: "ExecuteAtTime", returnType: "bool", params: "double aTime, string aScript", description: "Schedule script" },
      { name: "ScriptExists", returnType: "bool", params: "string aScript", description: "Check if script exists" },
      { name: "State", returnType: "string", params: "", description: "Current state" },
      { name: "SetState", returnType: "void", params: "string aState", description: "Set current state" },
      { name: "SuppressMessage", returnType: "void", params: "", description: "Suppress message routing" },
      { name: "Behavior", returnType: "WsfBehaviorTreeNode", params: "string aName", description: "Get behavior node" },
      { name: "BehaviorCount", returnType: "int", params: "", description: "Number of behaviors" },
      { name: "IsA_TypeOf", returnType: "bool", params: "string aDerived, string aBase", isStatic: true, description: "Check type inheritance" },
    ],
  },
  {
    name: "WsfComm",
    description: "Represents a comm component",
    methods: [
      { name: "Name", returnType: "string", params: "", description: "Comm name" },
      { name: "TypeName", returnType: "string", params: "", description: "Comm type name" },
      { name: "TurnOn", returnType: "bool", params: "", description: "Turn comm on" },
      { name: "TurnOff", returnType: "bool", params: "", description: "Turn comm off" },
    ],
  },
  {
    name: "WsfMover",
    description: "Represents a mover component",
    methods: [
      { name: "Name", returnType: "string", params: "", description: "Mover name" },
      { name: "TypeName", returnType: "string", params: "", description: "Mover type name" },
      { name: "Speed", returnType: "double", params: "", description: "Current speed (m/s)" },
      { name: "Heading", returnType: "double", params: "", description: "Current heading (deg)" },
      { name: "Altitude", returnType: "double", params: "", description: "Current altitude (m)" },
    ],
  },
  {
    name: "Math",
    description: "Mathematical functions and constants",
    methods: [
      // Constants (static)
      { name: "E", returnType: "double", params: "", isStatic: true, description: "Euler's number" },
      { name: "PI", returnType: "double", params: "", isStatic: true, description: "PI" },
      { name: "PI_OVER_2", returnType: "double", params: "", isStatic: true, description: "PI/2" },
      { name: "TWO_PI", returnType: "double", params: "", isStatic: true, description: "2*PI" },
      { name: "RAD_PER_DEG", returnType: "double", params: "", isStatic: true, description: "Radians per degree" },
      { name: "DEG_PER_RAD", returnType: "double", params: "", isStatic: true, description: "Degrees per radian" },
      { name: "LIGHT_SPEED", returnType: "double", params: "", isStatic: true, description: "Speed of light (m/s)" },
      { name: "DOUBLE_MAX", returnType: "double", params: "", isStatic: true, description: "Maximum double" },
      { name: "INTEGER_MAX", returnType: "int", params: "", isStatic: true, description: "Maximum integer" },
      // Trigonometric (static)
      { name: "Sin", returnType: "double", params: "double aDegrees", isStatic: true, description: "Sine (degrees)" },
      { name: "Cos", returnType: "double", params: "double aDegrees", isStatic: true, description: "Cosine (degrees)" },
      { name: "Tan", returnType: "double", params: "double aDegrees", isStatic: true, description: "Tangent (degrees)" },
      { name: "ASin", returnType: "double", params: "double aValue", isStatic: true, description: "Arc sine (degrees)" },
      { name: "ACos", returnType: "double", params: "double aValue", isStatic: true, description: "Arc cosine (degrees)" },
      { name: "ATan", returnType: "double", params: "double aValue", isStatic: true, description: "Arc tangent (degrees)" },
      { name: "ATan2", returnType: "double", params: "double aY, double aX", isStatic: true, description: "Arc tangent 2 (degrees)" },
      // Arithmetic (static)
      { name: "Sqrt", returnType: "double", params: "double aValue", isStatic: true, description: "Square root" },
      { name: "Fabs", returnType: "double", params: "double aValue", isStatic: true, description: "Absolute value" },
      { name: "Pow", returnType: "double", params: "double aBase, double aExponent", isStatic: true, description: "Power" },
      { name: "Log10", returnType: "double", params: "double aValue", isStatic: true, description: "Log base 10" },
      { name: "Ln", returnType: "double", params: "double aValue", isStatic: true, description: "Natural log" },
      { name: "Floor", returnType: "double", params: "double aValue", isStatic: true, description: "Floor" },
      { name: "Ceil", returnType: "double", params: "double aValue", isStatic: true, description: "Ceiling" },
      { name: "Max", returnType: "double", params: "double a, double b", isStatic: true, description: "Maximum" },
      { name: "Min", returnType: "double", params: "double a, double b", isStatic: true, description: "Minimum" },
      { name: "Fmod", returnType: "double", params: "double a, double b", isStatic: true, description: "Floating modulo" },
      { name: "Sign", returnType: "double", params: "double aValue", isStatic: true, description: "Sign (-1, 0, 1)" },
      { name: "Lerp", returnType: "double", params: "double a, double b, double t", isStatic: true, description: "Linear interpolation" },
      { name: "LinearToDB", returnType: "double", params: "double aValue", isStatic: true, description: "Linear to dB" },
      { name: "DB_ToLinear", returnType: "double", params: "double aDB", isStatic: true, description: "dB to linear" },
      // Random (instance via MATH)
      { name: "RandomUniform", returnType: "double", params: "double aMin, double aMax", description: "Uniform random" },
      { name: "RandomGaussian", returnType: "double", params: "double aMean, double aStdDev", description: "Gaussian random" },
      { name: "RandomNormal", returnType: "double", params: "double aMean, double aStdDev", description: "Normal random" },
      { name: "RandomExponential", returnType: "double", params: "double aLambda", description: "Exponential random" },
      { name: "RandomPoisson", returnType: "int", params: "double aMean", description: "Poisson random" },
      { name: "SetSeed", returnType: "void", params: "int aSeed", description: "Set random seed" },
      { name: "Roll", returnType: "int", params: "int aMin, int aMax", description: "Random integer in range" },
    ],
  },
  {
    name: "Vec3",
    description: "3D vector",
    methods: [
      { name: "Construct", returnType: "Vec3", params: "double x, double y, double z", isStatic: true, description: "Create vector" },
      { name: "X", returnType: "double", params: "", description: "X component" },
      { name: "Y", returnType: "double", params: "", description: "Y component" },
      { name: "Z", returnType: "double", params: "", description: "Z component" },
      { name: "Magnitude", returnType: "double", params: "", description: "Vector magnitude" },
      { name: "Normalize", returnType: "Vec3", params: "", description: "Normalize vector" },
      { name: "Dot", returnType: "double", params: "Vec3 a, Vec3 b", isStatic: true, description: "Dot product" },
      { name: "Cross", returnType: "Vec3", params: "Vec3 a, Vec3 b", isStatic: true, description: "Cross product" },
      { name: "Add", returnType: "Vec3", params: "Vec3 a, Vec3 b", isStatic: true, description: "Add vectors" },
      { name: "Scale", returnType: "Vec3", params: "double aFactor", description: "Scale vector" },
    ],
  },
  {
    name: "WsfGeoPoint",
    description: "Geographic coordinate point",
    methods: [
      { name: "Construct", returnType: "WsfGeoPoint", params: "double aLat, double aLon, double aAlt", isStatic: true, description: "Create geo point" },
      { name: "Latitude", returnType: "double", params: "", description: "Latitude (degrees)" },
      { name: "Longitude", returnType: "double", params: "", description: "Longitude (degrees)" },
      { name: "Altitude", returnType: "double", params: "", description: "Altitude (meters)" },
      { name: "Set", returnType: "void", params: "double aLat, double aLon, double aAlt", description: "Set coordinates" },
      { name: "SlantRangeTo", returnType: "double", params: "WsfGeoPoint aPoint", description: "Slant range to point" },
      { name: "GroundRangeTo", returnType: "double", params: "WsfGeoPoint aPoint", description: "Ground range to point" },
      { name: "TrueBearingTo", returnType: "double", params: "WsfGeoPoint aPoint", description: "True bearing to point" },
      { name: "HeightAboveTerrain", returnType: "double", params: "", description: "Height above terrain" },
      { name: "WithinZone", returnType: "bool", params: "string aZoneName", description: "Check if in zone" },
      { name: "Offset", returnType: "WsfGeoPoint", params: "double aN, double aE, double aD", description: "Offset by NED" },
    ],
  },
  {
    name: "WsfTrack",
    description: "Represents a tracked entity",
    methods: [
      { name: "IsValid", returnType: "bool", params: "", description: "Track is valid" },
      { name: "TrackNumber", returnType: "int", params: "", description: "Track number" },
      { name: "Latitude", returnType: "double", params: "", description: "Track latitude" },
      { name: "Longitude", returnType: "double", params: "", description: "Track longitude" },
      { name: "Altitude", returnType: "double", params: "", description: "Track altitude" },
      { name: "Speed", returnType: "double", params: "", description: "Track speed" },
      { name: "Heading", returnType: "double", params: "", description: "Track heading" },
      { name: "Side", returnType: "string", params: "", description: "Track side" },
      { name: "Age", returnType: "double", params: "", description: "Track age" },
      { name: "Location", returnType: "WsfGeoPoint", params: "", description: "Track location" },
    ],
  },
  {
    name: "WsfSimulation",
    description: "Simulation management (static class)",
    methods: [
      { name: "PlatformCount", returnType: "int", params: "", isStatic: true, description: "Total platform count" },
      { name: "PlatformEntry", returnType: "WsfPlatform", params: "int aIndex", isStatic: true, description: "Get platform by index" },
      { name: "FindPlatform", returnType: "WsfPlatform", params: "string aName", isStatic: true, description: "Find platform by name" },
      { name: "CreatePlatform", returnType: "WsfPlatform", params: "string aTypeName, string aName", isStatic: true, description: "Create new platform" },
      { name: "DeletePlatform", returnType: "void", params: "string aName", isStatic: true, description: "Delete platform" },
    ],
  },
  {
    name: "WsfTrackList",
    description: "List of tracks",
    methods: [
      { name: "Count", returnType: "int", params: "", description: "Number of tracks" },
      { name: "Entry", returnType: "WsfTrack", params: "int aIndex", description: "Get track by index" },
    ],
  },
  {
    name: "WsfLocalTrackList",
    description: "List of local tracks",
    methods: [
      { name: "Count", returnType: "int", params: "", description: "Number of tracks" },
      { name: "Entry", returnType: "WsfLocalTrack", params: "int aIndex", description: "Get track by index" },
    ],
  },
  {
    name: "WsfFuel",
    description: "Fuel component",
    methods: [
      { name: "Name", returnType: "string", params: "", description: "Fuel name" },
      { name: "CurrentLevel", returnType: "double", params: "", description: "Current fuel level" },
      { name: "MaximumLevel", returnType: "double", params: "", description: "Maximum fuel level" },
      { name: "FuelRemaining", returnType: "double", params: "", description: "Fuel remaining fraction" },
    ],
  },
  {
    name: "Format",
    description: "Number formatting utilities",
    methods: [
      { name: "Fixed", returnType: "string", params: "double aValue, int aPrecision", isStatic: true, description: "Fixed-point format" },
      { name: "Scientific", returnType: "string", params: "double aValue, int aPrecision", isStatic: true, description: "Scientific notation" },
      { name: "General", returnType: "string", params: "double aValue, int aPrecision", isStatic: true, description: "Auto-select format" },
      { name: "Latitude", returnType: "string", params: "double aLat", isStatic: true, description: "Format latitude" },
      { name: "Longitude", returnType: "string", params: "double aLon", isStatic: true, description: "Format longitude" },
      { name: "Time", returnType: "string", params: "double aTime", isStatic: true, description: "Format time" },
    ],
  },
  {
    name: "FileIO",
    description: "File I/O operations",
    methods: [
      { name: "Open", returnType: "bool", params: "string aFilename, string aMode", description: "Open file" },
      { name: "Close", returnType: "void", params: "", description: "Close file" },
      { name: "ReadLine", returnType: "string", params: "", description: "Read a line" },
      { name: "WriteLine", returnType: "void", params: "string aLine", description: "Write a line" },
      { name: "IsOpen", returnType: "bool", params: "", description: "Check if file is open" },
      { name: "EndOfFile", returnType: "bool", params: "", description: "Check for EOF" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

const _classMap = new Map<string, ScriptClass>();
for (const cls of SCRIPT_CLASS_DEFINITIONS) {
  _classMap.set(cls.name, cls);
}

/**
 * Get a class definition by name.
 */
export function getScriptClass(name: string): ScriptClass | undefined {
  return _classMap.get(name);
}

/**
 * Get methods available for a given class (including inherited).
 */
export function getMethodsForClass(name: string): readonly MethodSignature[] {
  const cls = _classMap.get(name);
  if (!cls) return [];

  const methods = [...cls.methods];
  if (cls.baseClass) {
    const baseMethods = getMethodsForClass(cls.baseClass);
    methods.push(...baseMethods);
  }
  return methods;
}

/**
 * Get system variables available in a specific script context.
 * @param contextType - WSF context type (e.g. "sensor", "processor")
 */
export function getSystemVariablesForContext(contextType?: string): readonly SystemVariable[] {
  return SYSTEM_VARIABLES.filter(
    v => !v.contexts || (contextType && v.contexts.includes(contextType))
  );
}
