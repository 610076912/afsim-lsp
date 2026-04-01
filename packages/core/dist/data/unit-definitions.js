// ============================================================================
// Unit Definitions — unit categories and valid unit strings
// Extracted from wsf.ag grammar (lines 229-525)
// Used by completion service to suggest valid units after numeric values
// ============================================================================
// ---------------------------------------------------------------------------
// All unit categories extracted from wsf.ag
// ---------------------------------------------------------------------------
export const UNIT_CATEGORIES = [
    {
        name: "time",
        displayName: "Time",
        units: [
            "seconds", "second", "secs", "sec", "s",
            "minutes", "minute", "mins", "min",
            "hours", "hour", "hrs", "hr",
            "milliseconds", "millisecond", "msecs", "msec", "ms",
            "microseconds", "microsecond", "usecs", "usec", "us",
            "nanoseconds", "nanosecond", "nsecs", "nsec", "ns",
            "days", "day",
        ],
    },
    {
        name: "length",
        displayName: "Length",
        units: [
            "meters", "meter", "m",
            "kilometers", "kilometer", "km",
            "megameters", "megameter",
            "feet", "foot", "ft",
            "kfeet", "kft",
            "miles", "mile", "mi",
            "nm", "nmi",
            "centimeters", "centimeter", "cm",
            "millimeters", "millimeter", "mm",
            "micrometers", "micrometer", "um",
            "microns", "micron",
            "nanometers", "nanometer",
            "angstroms", "angstrom",
            "inches", "inch", "in",
            "au", "ua",
        ],
    },
    {
        name: "speed",
        displayName: "Speed",
        units: [
            "m/s",
            "km/h", "kmh",
            "ft/s", "fps",
            "ft/m", "fpm",
            "mi/h", "mph",
            "knots", "kts",
        ],
    },
    {
        name: "angle",
        displayName: "Angle",
        units: [
            "deg", "degree", "degrees",
            "rad", "radian", "radians",
            "mils", "mil",
            "arcseconds", "arcsecond",
        ],
    },
    {
        name: "frequency",
        displayName: "Frequency",
        units: ["hz", "khz", "mhz", "ghz"],
    },
    {
        name: "power",
        displayName: "Power",
        units: [
            "w", "watts",
            "kw", "kilowatts",
            "mw", "megawatts",
            "gw", "gigawatts",
            "milliwatts",
            "microwatts",
            "dbw",
            "dbm",
        ],
    },
    {
        name: "mass",
        displayName: "Mass",
        units: [
            "kg", "kilo", "kilogram", "kilograms",
            "g", "gram", "grams",
            "lb", "lbm",
            "lbs",
            "pound", "pounds",
            "klb",
            "ton", "tons",
            "tonne", "tonnes",
        ],
    },
    {
        name: "force",
        displayName: "Force",
        units: [
            "nt", "newton", "newtons",
            "kgf",
            "lbf",
            "lbsf",
        ],
    },
    {
        name: "energy",
        displayName: "Energy",
        units: ["joules", "j", "kj", "kilojoules"],
    },
    {
        name: "data",
        displayName: "Data Size",
        units: [
            "bits", "bit",
            "bytes", "byte",
            "kbit", "kbits",
            "mbit", "mbits",
            "gbit", "gbits",
            "kbyte", "kbytes",
            "mbyte", "mbytes",
            "gbyte", "gbytes",
        ],
    },
    {
        name: "acceleration",
        displayName: "Acceleration",
        units: ["m/s2", "ft/s2", "g"],
    },
    {
        name: "solid-angle",
        displayName: "Solid Angle",
        units: ["steradians", "steradian", "sr"],
    },
    {
        name: "ratio",
        displayName: "Ratio",
        units: ["absolute", "db"],
    },
    {
        name: "pressure",
        displayName: "Pressure",
        units: [
            "pascal", "pa",
            "kpa", "kilopascal", "kilopascals",
            "upa", "micropascal", "micropascals",
            "psi",
            "psf",
            "dbpa",
            "dbupa",
        ],
    },
    {
        name: "temperature",
        displayName: "Temperature",
        units: [
            "kelvin", "k",
            "celsius", "c",
            "fahrenheit", "f",
        ],
    },
    {
        name: "capacitance",
        displayName: "Capacitance",
        units: [
            "farads", "farad",
            "millifarads", "millifarad",
            "microfarads", "microfarad",
            "nanofarads", "nanofarad",
            "picofarads", "picofarad",
            "femtofarads", "femtofarad",
        ],
    },
    {
        name: "current",
        displayName: "Current",
        units: [
            "amps", "amp",
            "milliamps", "milliamp",
            "microamps", "microamp",
            "nanoamps", "nanoamp",
        ],
    },
    {
        name: "area-db",
        displayName: "Area (dB)",
        units: ["dbsm"],
    },
    {
        name: "noise-pressure",
        displayName: "Noise Pressure",
        units: ["db_20upa", "absolute"],
    },
    {
        name: "specific-range",
        displayName: "Specific Range",
        units: ["m/kg", "mi/lb", "mi/klb", "nmi/lb", "nmi/klb"],
    },
    {
        name: "angular-rate",
        displayName: "Angular Rate",
        units: ["rpm"],
    },
];
// ---------------------------------------------------------------------------
// Flattened set of all unit strings (for quick lookup)
// ---------------------------------------------------------------------------
const _allUnits = new Set();
for (const cat of UNIT_CATEGORIES) {
    for (const u of cat.units) {
        _allUnits.add(u);
    }
}
/** Set of all valid unit strings across all categories */
export const ALL_UNIT_STRINGS = _allUnits;
/**
 * Get all valid unit strings for completion suggestions.
 * Returns a flat array of all unit strings.
 */
export function getAllUnitStrings() {
    return [...ALL_UNIT_STRINGS];
}
/**
 * Check if a string is a valid unit.
 */
export function isValidUnit(s) {
    return ALL_UNIT_STRINGS.has(s.toLowerCase());
}
//# sourceMappingURL=unit-definitions.js.map