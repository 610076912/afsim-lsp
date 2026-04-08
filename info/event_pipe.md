# event_pipe

## Syntax

**Syntax:** `event_pipe ... end_event_pipe`

```wsf
event_pipe
   file <file-name>
   use_preset [ default | low | high | full ]
   disable <group-name>
   enable <group-name>
   maximum_mover_update_interval <time-value>
   entity_state_angle_threshold <angle-value>
   entity_state_position_threshold <length-value>
   disable_entity_state_thresholds
   entity_state_maximum_interval <time-value>
   visual_part_update_interval <time-value>
end_event_pipe
```

## Overview

The `event_pipe` block allows the user to create a binary recording of simulation events.

## Commands

### file \<file-name\>

Specifies the name of the file to which the event recording is written. If the file already exists then it will be overwritten.

> **Note:** To insert the run number in the file name use "*%d*".

For example:

```wsf
file events_%d.aer
```

### use_preset [ default | low | high | full ]

Configures the messages that will be output. By default, the default preset is used. The messages output presets are as follows:

**default** & **low:**

* BASE_DATA
* ENTITY_STATE
* DRAW
* DETECTION_CHANGE
* COMMENT
* TRACK
* XIO
* AUX_DATA
* ROUTE_CHANGED
* ZONES

**high:**

* BASE_DATA
* ENTITY_STATE
* DRAW
* DETECTION_CHANGE
* COMMENT
* TRACK
* XIO
* AUX_DATA
* ROUTE_CHANGED
* TRACK_UPDATE
* COMM_INFO
* MESSAGE_RECEIVED
* MESSAGE_TRANSMITTED
* MESSAGE_HOP
* BEHAVIOR_TREE

**full:**

* BASE_DATA
* ENTITY_STATE
* DRAW
* DETECTION_CHANGE
* COMMENT
* TRACK
* XIO
* AUX_DATA
* ROUTE_CHANGED
* TRACK_UPDATE
* COMM_INFO
* MESSAGE_RECEIVED
* MESSAGE_TRANSMITTED
* MESSAGE_HOP
* BEHAVIOR_TREE
* DETECTION_ATTEMPT

### disable \<group-name\>

### enable \<group-name\>

Specifies the names of the event groups to be included or excluded in the file. These commands are typically specified multiple times to select the events of interest. The commands are processed in order of appearance with each successive command selecting or deselecting events as appropriate.

The groups are listed below with the events associated with them.

**BASE_DATA**

* MsgPlatformInfo
* MsgPlatformStatus
* MsgPartStatus
* MsgSensorModeChange
* MsgSensorModeDefinition
* MsgSetDate
* MsgVisualPartDefinition
* MsgExecData
* MsgScriptData
* MsgResource

**ENTITY_STATE**

* MsgEntityState
* MsgPartArticulationStatus

**DETECTION_CHANGE**

* MsgSensorDetectionChange
* MsgPlatformAppearanceChanged

**TRACK**

* MsgLocalTrackCreated
* MsgLocalTrackDrop
* MsgLocalTrackCorrelation
* MsgLocalTrackDecorrelation
* MsgSensorTrackCreated
* MsgSensorTrackDrop

**TRACK_UPDATE**

* MsgLocalTrackUpdate
* MsgSensorTrackUpdate

**DETECTION_ATTEMPT**

* MsgDetectAttempt

**DRAW**

* MsgDrawCommand

**MESSAGE_RECEIVED**

* MsgMessageReceived

**MESSAGE_TRANSMITTED**

* MsgMessageTransmitted

**MESSAGE_HOP**

* MsgMessageHop

**COMM_INFO**

* MsgCommInfo
* MsgRouterInfo
* MsgNetworkInfo

**COMMENT**

* MsgComment

**XIO**

* MsgXioHeartbeat

**AUX_DATA**

* MsgAuxData

**ROUTE_CHANGED**

* MsgRouteChanged

**ZONES**

* MsgCircularZone
* MsgEllipticalZone
* MsgPolygonalZone
* MsgZoneSet

**BEHAVIOR_TREE**

* MsgBehaviorTree
* MsgBehaviorTreeState

### maximum_mover_update_interval \<time-value\>

If this value is less than a mover's `mover.update_interval`, the mover will use this value instead. If this value is set to 0, the event_pipe will take no active role in mover update timing, which may cause odd behavior in movers with no update-interval.

**Default:** 5 seconds

### entity_state_angle_threshold \<angle-value\>

Specifies an angle threshold to control entity-state publish rates. Every time a mover is updated, the previous orientation will be compared to the current orientation, and if the difference does not exceed the threshold, a new entity state will be ignored.

**Default:** 3 degrees

### entity_state_position_threshold \<length-value\>

Specifies a length threshold to control entity-state publish rates. Every time a mover is updated, the extrapolated previous location will be compared to the current location, and if the length between them does not exceed the threshold, a new entity state will be ignored.

**Default:** 1 meter

### disable_entity_state_thresholds

Disables the entity-state thresholds, causing entity-state to be published at the movers' update intervals. This may be overwritten by further calls to entity_state_position_threshold or entity_state_angle_threshold.

### entity_state_maximum_interval \<time-value\>

Specifies a maximum interval of time between entity-state updates. If a platform does not receive an update to its location within this interval, a new state, extrapolated from the last state, will be published.

**Default:** 10 seconds

### visual_part_update_interval \<time-value\>

Specifies the update period at which visual part articulations will be published. Time values should be greater than zero. If unset, visual parts' articulations will not be published.

**Default:** 0 seconds

## Example

The following would show all events except those dealing with track updates

```wsf
event_pipe
   file events.aer
   use_preset full
   disable TRACK_UPDATED
end_event_pipe
```

## Messages

### MsgEntityState

* double simTime
* uint8 simIndex
* unsigned int platformIndex
* double damageFactor
* Vec3d locationWCS
* bool velocityWCSvalid
* Vec3f velocityWCS
* bool accelerationWCSvalid
* Vec3f accelerationWCS
* bool orientationWCSvalid
* Vec3f orientationWCS
* bool fuelCurrentValid
* double fuelCurrent
* bool machNumberValid
* double machNumber

### MsgPlatformInfo

* double simTime
* uint8 simIndex
* unsigned int platformIndex
* bool nameValid
* string name
* bool typesValid
* list\<string\> types
* bool sideValid
* string side
* bool iconValid
* string icon
* bool markingValid
* string marking
* bool spatialDomainValid
* `SpatialDomain` spatialDomain
* bool commandChainsValid
* list\<`CommandChain`\> commandChains
* bool categoriesValid
* list\<string\> categories
* bool disIdValid
* `DisEntityId` disId
* bool fuelCapacityValid
* double fuelCapacity

### MsgLocalTrackCreated

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* `Track_Id` trackId
* bool targetIndexValid
* unsigned int targetIndex

### MsgLocalTrackUpdate

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* `Track` track

### MsgLocalTrackDrop

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* `Track_Id` trackId
* bool targetIndexValid
* unsigned int targetIndex

### MsgLocalTrackCorrelation

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* `Track_Id` localTrackId
* `Track_Id` addedTrackId

### MsgLocalTrackDecorrelation

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* `Track_Id` localTrackId
* `Track_Id` removedTrackId

### MsgSensorModeChange

* double simTime
* uint8 simIndex
* unsigned int platformIndex
* string sensorName
* string modeName
* bool activate

### MsgPlatformStatus

* double simTime
* uint8 simIndex
* unsigned int platformIndex
* bool broken
* bool removed

### MsgPlatformAppearanceChanged

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* unsigned int appearance

### MsgPartStatus

* double simTime
* uint8 simIndex
* unsigned int platformIndex
* string partName
* `PartType` partType
* bool on
* bool broken
* bool disabled

### MsgComment

* double simTime
* uint8 simIndex
* string text
* bool platformIndexValid
* unsigned int platformIndex

### MsgDetectAttempt

* double simTime
* uint8 simIndex
* bool sensorPlatformIndexValid
* unsigned int sensorPlatformIndex
* bool sensorNameValid
* string sensorName
* bool targetPlatformIndexValid
* unsigned int targetPlatformIndex
* bool beamValid
* int beam
* bool rangeErrorValid
* float rangeError
* bool azimuthErrorValid
* float azimuthError
* bool elevationErrorValid
* float elevationError
* bool rangeRateErrorValid
* float rangeRateError
* bool pdValid
* float pd
* bool requiredPdValid
* float requiredPd
* bool reportedSideValid
* string reportedSide
* bool reportedTypeValid
* string reportedType
* `EM_Interaction` interaction

### MsgDrawCommand

* double simTime
* uint8 simIndex
* list\<`MsgDrawCommand_Item`\> items
* bool layerValid
* string layer

### MsgMessageReceived

* double simTime
* uint8 simIndex
* bool xmtrPlatformIndexValid
* unsigned int xmtrPlatformIndex
* bool xmtrCommNameValid
* string xmtrCommName
* bool rcvrPlatformIndexValid
* unsigned int rcvrPlatformIndex
* bool rcvrCommNameValid
* string rcvrCommName
* bool messageTypeValid
* string messageType
* bool messageSubTypeValid
* string messageSubType
* bool messageSizeValid
* int messageSize
* bool serialNumberValid
* unsigned int serialNumber

### MsgMessageTransmitted

* double simTime
* uint8 simIndex
* bool xmtrPlatformIndexValid
* unsigned int xmtrPlatformIndex
* bool xmtrCommNameValid
* string xmtrCommName
* bool rcvrPlatformIndexValid
* unsigned int rcvrPlatformIndex
* bool messageTypeValid
* string messageType
* bool messageSubTypeValid
* string messageSubType
* bool messageSizeValid
* int messageSize
* bool serialNumberValid
* unsigned int serialNumber

### MsgSensorDetectionChange

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* string sensorName
* unsigned int targetIndex
* bool detected

### MsgSensorTrackCreated

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* `Track_Id` trackId
* bool targetIndexValid
* unsigned int targetIndex
* string sensorName

### MsgSensorTrackUpdate

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* `Track` track

### MsgSensorTrackDrop

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* `Track_Id` trackId
* bool targetIndexValid
* unsigned int targetIndex

### MsgSensorModeDefinition

* double simTime
* uint8 simIndex
* unsigned int ownerIndex
* string sensorName
* string modeName
* list\<`BeamDefinition`\> beamList

### MsgPartArticulationStatus

* double simTime
* uint8 simIndex
* unsigned int ownerId
* string partName
* `PartType` partType
* Vec3f locationECS
* Vec3f orientationECS

### MsgSetDate

* double simTime
* uint8 simIndex
* int year
* int month
* int day
* float time

### MsgVisualPartDefinition

* double simTime
* uint8 simIndex
* unsigned int platformIndex
* string partName
* `PartType` partType
* string partIcon

### MsgExecData

* double simTime
* uint8 simIndex
* string execPath
* string cmdLine
* string version
* string features
* string extensions
* string timeStamp

### MsgScriptData

* double simTime
* uint8 simIndex
* unsigned int platformIndex
* string key
* `MsgScriptData_Value` value

### MsgResource

* double simTime
* uint8 simIndex
* `ResourceType` resourceType
* string resourceId
* list\<string\> resourceLocation

### MsgMessageHop

* double simTime
* uint8 simIndex
* unsigned int xmtrPlatormIndex
* string xmtrCommName
* unsigned int rcvrPlatformIndex
* string rcvrCommName
* string messageType
* string messageSubType
* int messageSize
* unsigned int serialNumber

### MsgXioHeartbeat

* double simTime
* uint8 simIndex
* `ApplicationUniqueId` applicationId
* float timeStamp

### MsgAuxData

* double simTime
* uint8 simIndex
* unsigned int platformIndex
* list\<`AuxDataValue`\> auxData

### MsgBookmark

* double simTime
* uint8 simIndex
* double time
* string msgType
* string msgText

### MsgRouteChanged

* double simTime
* uint8 simIndex
* unsigned int platformIndex
* vec3 location
* float heading
* list\<`Waypoint`\> route

### MsgCircularZone

* `CircularZoneInfo` zoneInfo

### MsgEllipticalZone

* `EllipticalZoneInfo` zoneInfo

### MsgPolygonalZone

* `PolygonalZoneInfo` zoneInfo

### MsgZoneSet

* string zoneSetName
* string parentPlatform
* bool isGlobal
* ColorF lineColor
* ColorF fillColor
* list\<`CircularZoneInfo`\> circularZones
* list\<`EllipticalZoneInfo`\> ellipticalZones
* list\<`PolygonalZoneInfo`\> polygonalZones

### MsgCommInfo

* string commName
* string parentPlatform
* string commAddress
* string commType
* string networkName
* string networkAddress
* string routerName
* string gatewayAddress
* string gatewayCommName
* string gatewayPlatformName
* list\<`link`\> links
* StringList linkAddresses

### MsgRouterInfo

* string routerName
* string commName
* string parentPlatform
* string commAddress
* string routerType
* string gatewayAddress
* string gatewayCommName
* int hopLimit
* bool useDefaultProtocol
* bool useMulticastProtocol

### MsgNetworkInfo

* string networkName
* string networkType
* string networkAddress

## Structures

### ApplicationUniqueId

* unsigned int a
* unsigned int b
* unsigned int c

### CommandChain

* string name
* string commander

### DisEntityId

* unsigned int site
* unsigned int application
* unsigned int entity

### Track_Id

* int localTrackNumber
* string ownerId

### Track

* `Track_Id` trackId
* bool startTimeValid
* double startTime
* bool updateTimeValid
* double updateTime
* bool originatorIndexValid
* unsigned int originatorIndex
* bool sensorNameValid
* string sensorName
* bool sensorModeValid
* string sensorMode
* bool updateCountValid
* int updateCount
* bool originatorWCSValid
* Vec3d originatorWCS
* bool locationWCSValid
* Vec3d locationWCS
* bool rangeValid
* float range
* bool rangeErrorValid
* float rangeError
* bool bearingValid
* float bearing
* bool bearingErrorValid
* float bearingError
* bool elevationValid
* float elevation
* bool elevationErrorValid
* float elevationError
* bool rangeRateValid
* float rangeRate
* bool rangeRateErrorValid
* float rangeRateError
* bool trackQualityValid
* float trackQuality
* bool signalToNoiseValid
* float signalToNoise
* bool pixelCountValid
* float pixelCount
* bool spatialDomainValid
* `SpatialDomain` spatialDomain
* bool stateCovarianceValid
* `Covariance` stateCovariance
* bool targetIndexValid
* unsigned int targetIndex

### Covariance

* unsigned char rowCount
* unsigned char colCount
* list\<float\> values

### EM_Interaction

* `EM_Interaction_Status` status
* bool xmtrWCSValid
* Vec3d xmtrWCS
* bool rcvrWCSValid
* Vec3d rcvrWCS
* bool targetWCSValid
* Vec3d targetWCS
* bool rcvrToTargetValid
* `EM_Interaction_RelativeData` rcvrToTarget
* bool targetToRcvrValid
* `EM_Interaction_RelativeData` targetToRcvr
* bool xmtrToTargetValid
* `EM_Interaction_RelativeData` xmtrToTarget
* bool targetToXmtrValid
* `EM_Interaction_RelativeData` targetToXmtr
* bool xmtrToRcvrValid
* `EM_Interaction_RelativeData` xmtrToRcvr
* bool rcvrToXmtrValid
* `EM_Interaction_RelativeData` rcvrToXmtr
* bool rcvrBeamValid
* `EM_Interaction_BeamData` rcvrBeam
* bool xmtrBeamValid
* `EM_Interaction_BeamData` xmtrBeam
* bool maskingFactorValid
* float maskingFactor
* bool infraredSignatureValid
* float infraredSignature
* bool infraredSignatureAzimuthValid
* float infraredSignatureAzimuth
* bool infraredSignatureElevationValid
* float infraredSignatureElevation
* bool radarSignatureValid
* float radarSignature
* bool radarSignatureAzimuthValid
* float radarSignatureAzimuth
* bool radarSignatureElevationValid
* float radarSignatureElevation
* bool opticalSignatureValid
* float opticalSignature
* bool opticalSignatureAzimuthValid
* float opticalSignatureAzimuth
* bool opticalSignatureElevationValid
* float opticalSignatureElevation
* bool transmittedPowerValid
* float transmittedPower
* bool powerDensityAtTargetValid
* float powerDensityAtTarget
* bool receivedPowerValid
* float receivedPower
* bool rcvrNoisePowerValid
* float rcvrNoisePower
* bool clutterPowerValid
* float clutterPower
* bool interferencePowerValid
* float interferencePower
* bool signalToNoiseValid
* float signalToNoise
* bool propagationFactorValid
* float propagationFactor
* bool absorbtionFactorValid
* float absorbtionFactor
* bool detectionThresholdValid
* float detectionThreshold
* bool pixelCountValid
* float pixelCount
* bool zoomAttenuationFactorValid
* float zoomAttenuationFactor

### EM_Interaction_Status

* bool rcvrRangeLimitsValid
* bool rcvrRangeLimits
* bool rcvrAltitudeLimitsValid
* bool rcvrAltitudeLimits
* bool rcvrAngleLimitsValid
* bool rcvrAngleLimits
* bool rcvrHorizonMaskingValid
* bool rcvrHorizonMasking
* bool rcvrTerrainMaskingValid
* bool rcvrTerrainMasking
* bool xmtrRangeLimitsValid
* bool xmtrRangeLimits
* bool xmtrAltitudeLimitsValid
* bool xmtrAltitudeLimits
* bool xmtrAngleLimitsValid
* bool xmtrAngleLimits
* bool xmtrHorizonMaskingValid
* bool xmtrHorizonMasking
* bool xmtrTerrainMaskingValid
* bool xmtrTerrainMasking
* bool signalLevelValid
* bool signalLevel

### EM_Interaction_RelativeData

* float range
* float trueAzimuth
* float trueElevation
* float apparentAzimuth
* float apparentElevation

### EM_Interaction_BeamData

* float azimuth
* float elevation
* float gain

### MsgDrawCommand_Item

* `DrawType` drawType
* bool idValid
* unsigned int id
* bool colorValid
* unsigned int color
* bool durationValid
* float duration
* bool drawSizeValid
* unsigned char drawSize
* bool drawStyleValid
* unsigned char drawStyle
* bool drawStyle2Valid
* unsigned char drawStyle2
* bool orientationValid
* Vec3f orientation
* bool axisValid
* Vec3f axis
* bool textValid
* string text
* bool vertex1Valid
* `MsgDrawCommand_Vertex` vertex1
* bool vertex2Valid
* `MsgDrawCommand_Vertex` vertex2
* bool vertex3Valid
* `MsgDrawCommand_Vertex` vertex3
* bool vertex4Valid
* `MsgDrawCommand_Vertex` vertex4

### MsgDrawCommand_Vertex

* `MsgDrawCommand_VertexType` type
* bool relativePlatformIndexValid
* unsigned int relativePlatformIndex
* bool xyzValid
* Vec3f xyz

### BeamDefinition

* int beamId
* float r0_range
* int r0_rangeType
* float minRange
* float maxRange
* int stabilized
* float tilt
* `FieldOfView` fov

### FieldOfView

* int shape
* list\<Vec2f\> points

### DrawPair

* float threshold
* float draw

### AuxDataValue

* string name
* `AuxDataType` type
* bool boolean
* int integer
* double real
* string text

### Waypoint

* `WaypointLocationType` locationType
* string label
* double locationX
* double locationY
* bool altitudeValid
* double altitude
* bool headingValid
* double heading
* bool gotoIdValid
* string gotoId

### CommonZoneData

* string zoneName
* string parentPlatform
* string referencePlatform
* bool isGlobal
* ColorF lineColor
* ColorF fillColor
* double maxAltitude
* double minAltitude
* double referenceLat
* double referenceLon
* double heading
* bool locationDefined

### CircularZoneInfo

* `CommonZoneData` commonInfo
* double radius
* double minRadius
* double startAngle
* double stopAngle

### EllipticalZoneInfo

* `CommonZoneData` commonInfo
* double latAxis
* double lonAxis
* double minRadius
* double startAngle
* double stopAngle

### PolygonalZoneInfo

* `CommonZoneData` commonInfo
* list\<Vec2d\> points
* bool useLatLon

### link

* string platformName
* string commName

## Advanced Behavior Tree Structures

### BehaviorTreeNode

* string filePath
* int64 fileModTime
* uint nodeId
* uint treeId
* string nodeType
* string nodeName
* uint numChildren
* list\<int\> childrenIds
* bool isRootNode

### BehaviorTreeNodeExec

* uint nodeId
* string nodeName
* `NodeExecState` execState
* string tooltipText

### BoolDictEntry

* string key
* bool value

### IntDictEntry

* string key
* int value

### DoubleDictEntry

* string key
* double value

### StringDictEntry

* string key
* string value

### TrackDictEntry

* string key
* `Track` value

### BehaviorTreePlatformInfo

* string name
* StringList types
* string side

### PlatformDictEntry

* string key
* `BehaviorTreePlatformInfo` value

### BehaviorTreeBlackboardData

* uint nodeId
* string sharedBlackboard
* list\<`BoolDictEntry`\> boolDict
* list\<`IntDictEntry`\> intDict
* list\<`DoubleDictEntry`\> doubleDict
* list\<`StringDictEntry`\> stringDict
* list\<`TrackDictEntry`\> trackDict
* list\<`PlatformDictEntry`\> platformDict

## Advanced Behavior Tree Messages

### MsgBehaviorTree

* index platformIndex
* uint id
* string treeName
* string treeDesc
* list\<`BehaviorTreeNode`\> nodes

### MsgBehaviorTreeState

* index platformIndex
* uint treeId
* list\<`BehaviorTreeNodeExec`\> execList
* list\<`BehaviorTreeBlackboardData`\> blackboardList

## Unions

### MsgScriptData_Value

* double floating
* int integer
* bool boolean
* string text

## Enumerations

### SpatialDomain

* unknown
* land
* air
* surface
* subsurface
* space

### PartType

* sensor
* mover
* comm
* processor
* visual

### DrawType

* line
* point
* icon
* ellipse
* erase
* ellipsoid
* quadrilateral
* text
* timer

### MsgDrawCommand_VertexType

* unset_vertex
* absolute_wcs
* relative_zero
* relative_ecs
* relative_ned
* relative_ss

### GeometryResult

* in_progress
* dud
* target_impact
* far_away_in_air
* far_away_above_ground
* far_away_ground_impact
* target_proximity_air_burst
* target_proximity_above_ground
* target_proximity_ground_impact
* part_disabled_or_destroyed

### ResourceType

* other
* dted
* raw_dted
* geotiff_dem

### AuxDataType

* Unknown
* Boolean
* Integer
* Real
* Text

### WaypointLocationType

* LatitudeAndLongitude
* RelativeOffset

### NodeExecState

* running
* success
* failure
* idle
* halted
* disabled
