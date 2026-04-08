import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve("./packages/core/src/lexer/wsf-tokens.ts");
let text = readFileSync(filePath, "utf8");

// 1. Fix Block Open keywords
// Find lines like: export const Xxx = createWsfToken("Xxx", "xxx", { longer_alt: ... });
// And ensure they have categories: WsfBlockOpen
const openKeywords = [
  "PlatformType", "Platform", "Sensor", "Processor", "Comm", "Network",
  "Router", "Mover", "Fuel", "Zone", "ZoneSet", "Route", "RouteNetwork",
  "RadarSignature", "AntennaPattern", "ThermalSystem", "MaskingPattern",
  "IntersectMesh", "Aero", "Callback", "UseCallback", "TrackManager", "Track",
  "NavigationErrors", "Transmitter", "Receiver", "FieldOfView", "Sector",
  "Scheduler", "Mode", "ModeTemplate", "Beam", "State", "Behavior",
  "AdvancedBehavior", "Sequence", "SequenceWithMemory", "Selector",
  "SelectorWithMemory", "Parallel", "Medium", "Protocol", "RouterProtocol",
  "Process", "DefaultProcess", "DefaultRouting", "Service", "Commodity",
  "Transactor", "Container", "VisualPart", "Select", "FrequencyList",
  "Powers", "Propagation", "PropagationModel", "Attenuation", "AttenuationModel",
  "Clutter", "ClutterModel", "ErrorModel", "ErrorModelParameters",
  "Query", "Filter", "DisInterface", "XioInterface", "Connections",
  "EditConnections", "FilteredConnection", "Navigation", "Terrain",
  "GlobalEnvironment", "CentralBody", "Observer", "ScriptStruct",
  "SignalProcessor", "EventPipe", "ScriptInterface", "IffMapping",
  "Conditionals", "Classification", "ClassificationLevels", "Group",
  "Draw", "NoisyCloud", "DetectionThresholds", "DetectionProbability",
  "FusionMethod", "OnInitialize", "OnUpdate", "OnEntry", "OnExit", "OnMessage", 
  "OnInit", "OnTrackDrop", "OnBingo", "OnEmpty", "OnRefuel", "OnReserve",
  "OnNewExecute", "OnNewFail", "Precondition", "NextState", "ScriptVariables"
];

for (const kw of openKeywords) {
  const regex = new RegExp(`export const ${kw} = createWsfToken\\("${kw}", ".+?"(, \\{ ([^}]+) \\})?\\);`, "g");
  text = text.replace(regex, (match, optGroup, options) => {
    if (options && options.includes("WsfBlockOpen")) return match;
    if (options && options.trim()) {
      return match.replace(options, options + ", categories: WsfBlockOpen");
    } else {
      return `export const ${kw} = createWsfToken("${kw}", "${match.match(/"([^"]+)"/g)[1].replace(/"/g, "")}", { categories: WsfBlockOpen });`;
    }
  });
}

// 2. Fix Block Close keywords (All EndXXX)
// We'll use a simpler regex to catch all EndXXX = createWsfToken(...)
text = text.replace(/export const End([A-Za-z0-9_]+) = createWsfToken\("End\1", "end_.+?"(, \{ ([^}]+) \})?\);/g, (match, name, optGroup, options) => {
  if (options && (options.includes("WsfBlockClose") || options.includes("WsfBlockOpen"))) return match;
  if (options && options.trim()) {
    return match.replace(options, options + ", categories: WsfBlockClose");
  } else {
    // Extract the keyword string from the match
    const kwMatch = match.match(/"end_([^"]+)"/);
    const kw = kwMatch ? "end_" + kwMatch[1] : "";
    return `export const End${name} = createWsfToken("End${name}", "${kw}", { categories: WsfBlockClose });`;
  }
});

// 3. Ensure WsfLBrace/RBrace exist
if (!text.includes("export const WsfLBrace")) {
  text += `\nexport const WsfLBrace = createToken({ name: "WsfLBrace", pattern: /\\{/ });\n`;
  text += `export const WsfRBrace = createToken({ name: "WsfRBrace", pattern: /\\}/ });\n`;
}

writeFileSync(filePath, text, "utf8");
console.log("Fixed token categories in wsf-tokens.ts");
