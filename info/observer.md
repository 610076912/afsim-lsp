# observer

## Syntax

**Syntax:** `observer ... end_observer`

```wsf
observer
   enable <EVENT_TYPE> [ <user defined script name> ]
   disable <EVENT_TYPE> [ <user defined script name> ]
end_observer
```

## Overview

The observer block allows the user to capture specific platform interaction data at the simulation level. It can be used as an alternative to capturing events using the event log to create user defined output information (such as comma delimited data). It is up to the user to create the necessary scripts to capture the desired interaction information as well as the output format. The observer block and scripts are defined outside of any platform definitions.

## Commands

### enable <EVENT_TYPE> [ <user defined script name> ]

### disable <EVENT_TYPE> [ <user defined script name> ]

Enable or disable a script observer for the specified **<EVENT_TYPE>**. If the <user defined script name> is the same as the **<EVENT_TYPE>** actual script name, the <user defined script name> is not required. Not all of the information that is printed with the `event_output` command is available to the observer.

> **Note:** Multiple scripts can be enabled for the same **<EVENT_TYPE>**

## Events

The following are the values for **<EVENT_TYPE>** that can be enabled or disabled, and the corresponding script signature:

### Core

| Event | Script Signature |
|-------|-----------------|
| **COMMENT** | script void Comment(`WsfPlatform` aPlatform, `string` aCommentString) end_script |
| **COMM_ADDED_TO_MANAGER** | script void CommAddedToManager(`WsfComm` aComm) end_script |
| **COMM_REMOVED_FROM_MANAGER** | script void CommRemovedFromManager(`WsfComm` aComm) end_script |
| **COMM_ADDED_TO_LOCAL** | script void CommAddedToLocal(`WsfCommRouter` aRouter, `string` aProtocolType, `WsfAddress` aAddedAddress) end_script |
| **COMM_REMOVED_FROM_LOCAL** | script void CommRemovedFromLocal(`WsfCommRouter` aRouter, `string` aProtocolType, `WsfAddress` aRemovedAddress) end_script |
| **COMM_FREQUENCY_CHANGED** | script void CommFrequencyChanged(`WsfComm` aComm) end_script |
| **COMM_TURNED_OFF** | script void CommTurnedOff(`WsfComm` aComm) end_script |
| **COMM_TURNED_ON** | script void CommTurnedOn(`WsfComm` aComm) end_script |
| **CRASHED_INTO_GROUND** | script void CrashedIntoGround(`WsfPlatform` aPlatform) end_script |
| **EXECUTE_CALLBACK** | script void ExecuteCallback(`WsfPlatform` aPlatform, `string` aCallbackName) end_script |
| **FUEL_EVENT** | script void FuelEvent(`WsfPlatform` aPlatform, `WsfFuel` aFuel, `string` aEventName) end_script |
| **IMAGE_CREATED** | script void ImageCreated(`WsfSensor` aSensor, `WsfImage` aImage) end_script |
| **LINK_ADDED_TO_MANAGER** | script void LinkAddedToManager(`WsfComm` aSourceComm, `WsfComm` aDestinationComm) end_script |
| **LINK_REMOVED_FROM_MANAGER** | script void LinkRemovedFromManager(`WsfComm` aSourceComm, `WsfComm` aDestinationComm) end_script |
| **LINK_ENABLED_ON_MANAGER** | script void LinkEnabledOnManager(`WsfComm` aSourceComm, `WsfComm` aDestinationComm) end_script |
| **LINK_DISABLED_ON_MANAGER** | script void LinkDisabledOnManager(`WsfComm` aSourceComm, `WsfComm` aDestinationComm) end_script |
| **LINK_ADDED_TO_LOCAL** | script void LinkAddedToLocal(`WsfCommRouter` aRouter, `string` aProtocolType, `WsfAddress` aSourceAddress, `WsfAddress` aDestinationAddress) end_script |
| **LINK_REMOVED_FROM_LOCAL** | script void LinkRemovedFromLocal(`WsfCommRouter` aRouter, `string` aProtocolType, `WsfAddress` aSourceAddress, `WsfAddress` aDestinationAddress) end_script |
| **LINK_ENABLED_ON_LOCAL** | script void LinkEnabledOnLocal(`WsfCommRouter` aRouter, `string` aProtocolType, `WsfAddress` aSourceAddress, `WsfAddress` aDestinationAddress) end_script |
| **LINK_DISABLED_ON_LOCAL** | script void LinkDisabledOnLocal(`WsfCommRouter` aRouter, `string` aProtocolType, `WsfAddress` aSourceAddress, `WsfAddress` aDestinationAddress) end_script |
| **LOCAL_TRACK_CORRELATION** | script void LocalTrackCorrelation(`WsfPlatform` aPlatform, `WsfTrackId` aLocalTrackId, `WsfTrackId` aNonLocalTrackId) end_script |
| **LOCAL_TRACK_DECORRELATION** | script void LocalTrackDecorrelation(`WsfPlatform` aPlatform, `WsfTrackId` aLocalTrackId, `WsfTrackId` aNonLocalTrackId) end_script |
| **LOCAL_TRACK_DROPPED** | script void LocalTrackDropped(`WsfPlatform` aPlatform, `WsfLocalTrack` aLocalTrack) end_script |
| **LOCAL_TRACK_INITIATED** | script void LocalTrackInitiated(`WsfPlatform` aPlatform, `WsfLocalTrack` aLocalTrack, `WsfTrack` aTrack) end_script |
| **LOCAL_TRACK_UPDATED** | script void LocalTrackUpdated(`WsfPlatform` aPlatform, `WsfLocalTrack` aLocalTrack, `WsfTrack` aTrack) end_script |
| **MESSAGE_DELIVERY_ATTEMPT** | script void MessageDeliveryAttempt(`WsfComm` aXmtr, `WsfComm` aRcvr, `WsfMessage` aMsg, `WsfCommInteraction` aResult) end_script |
| **MESSAGE_DISCARDED** | script void MessageDiscarded(`WsfComm` aComm, `WsfMessage` aMsg, `string` aReason) end_script |
| **MESSAGE_FAILED_ROUTING** | script void MessageFailedRouting(`WsfComm` aComm, `WsfPlatform` aReceivingPlatform, `WsfMessage` aMsg) end_script |
| **MESSAGE_HOP** | script void MessageHop(`WsfComm` aRcvrPtr, `WsfComm` aDstPtr, `WsfMessage` aMsg) end_script |
| **MESSAGE_UPDATED** | script void MessageUpdated(`WsfComm` aComm, `WsfMessage` aOldMsg, `WsfMessage` aNewMsg) end_script |
| **MESSAGE_QUEUED** | script void MessageQueued(`WsfComm` aComm, `WsfMessage` aMsg, int aQueueSize) end_script |
| **MESSAGE_RECEIVED** | script void MessageReceived(`WsfComm` aXmtr, `WsfComm` aRcvr, `WsfMessage` aMsg, `WsfCommInteraction` aResult) end_script |
| **MESSAGE_TRANSMITTED** | script void MessageTransmitted(`WsfComm` aComm, `WsfMessage` aMsg) end_script |
| **MESSAGE_TRANSMITTED_HEARTBEAT** | script void MessageTransmittedHeartbeat(`WsfComm` aComm, `WsfMessage` aMsg) end_script |
| **MESSAGE_TRANSMIT_ENDED** | script void MessageTransmitEnded(`WsfComm` aComm, `WsfMessage` aMsg) end_script |
| **MOVER_BROKEN** | script void MoverBroken(`WsfPlatform` aPlatform, `WsfMover` aMover) end_script |
| **MOVER_BURNED_OUT** | script void MoverBurnedOut(`WsfPlatform` aPlatform, `WsfMover` aMover) end_script |
| **MOVER_STAGED** | script void MoverStaged(`WsfPlatform` aPlatform, `WsfMover` aMover) end_script |
| **MOVER_UPDATED** | script void MoverUpdated(`WsfPlatform` aPlatform, `WsfMover` aMover) end_script |
| **NETWORK_ADDED** | script void NetworkAdded(`WsfNetwork` aNetwork) end_script |
| **NETWORK_REMOVED** | script void NetworkRemoved(`WsfNetwork` aNetwork) end_script |
| **OPERATING_LEVEL_CHANGED** | script void OperatingLevelChanged(`WsfPlatform` aPlatform, `WsfProcessor` aProcessor, `string` aName, int aLevel) end_script |
| **PLATFORM_ADDED** | script void PlatformAdded(`WsfPlatform` aPlatform) end_script |
| **PLATFORM_APPEARANCE_CHANGED** | script void PlatformApperanceChanged(`WsfPlatform` aPlatform, `string` aItemType) end_script |
| **PLATFORM_BROKEN** | script void PlatformBroken(`WsfPlatform` aPlatform) end_script |
| **PLATFORM_CAPABILITY_CHANGED** | script void PlatformCapabilityChanged(`WsfPlatform` aPlatform, `string` aCapabilityId, bool aIsGained) end_script |
| **PLATFORM_DELETED** | script void PlatformDeleted(`WsfPlatform` aPlatform) end_script |
| **PLATFORM_INITIALIZED** | script void PlatformInitialized(`WsfPlatform` aPlatform) end_script |
| **PLATFORM_OMITTED** | script void PlatformOmitted(`WsfPlatform` aPlatform) end_script |
| **PROCESSOR_TURNED_OFF** | script void ProcessorTurnedOff(`WsfPlatform` aPlatform, `WsfProcessor` aProcessor) end_script |
| **PROCESSOR_TURNED_ON** | script void ProcessorTurnedOn(`WsfPlatform` aPlatform, `WsfProcessor` aProcessor) end_script |
| **ROUTER_TURNED_OFF** | script void RouterTurnedOff(`WsfPlatform` aPlatform, `WsfCommRouter` aRouter) end_script |
| **ROUTER_TURNED_ON** | script void RouterTurnedOn(`WsfPlatform` aPlatform, `WsfCommRouter` aRouter) end_script |
| **SENSOR_DETECTION_ATTEMPT** | script void SensorDetectionAttempt(`WsfPlatform` aPlatform, `WsfSensor` aSensor, `WsfPlatform` aTarget, `WsfSensorInteraction` aResult) end_script |
| **SENSOR_DETECTION_CHANGED** | script void SensorDetectionChanged(`WsfPlatform` aPlatform, `WsfSensor` aSensor, int aTgtIdx, `WsfSensorInteraction` aResult) end_script |
| **SENSOR_FREQUENCY_CHANGED** | script void SensorFrequencyChanged(`WsfPlatform` aPlatform, `WsfSensor` aSensor) end_script |
| **SENSOR_MODE_ACTIVATED** | script void SensorModeActivated(`WsfPlatform` aPlatform, `WsfSensor` aSensor) end_script |
| **SENSOR_MODE_DEACTIVATED** | script void SensorModeDeactivated(`WsfPlatform` aPlatform, `WsfSensor` aSensor) end_script |
| **SENSOR_REQUEST_CANCELED** | script void SensorRequestCanceled(`WsfPlatform` aPlatform, `WsfSensor` aSensor, `WsfTrack` aTrack) end_script |
| **SENSOR_REQUEST_INITIATED** | script void SensorRequestInitiated(`WsfPlatform` aPlatform, `WsfSensor` aSensor, `WsfTrack` aTrack) end_script |
| **SENSOR_REQUEST_UPDATED** | script void SensorRequestUpdated(`WsfPlatform` aPlatform, `WsfSensor` aSensor, `WsfTrack` aTrack) end_script |
| **SENSOR_TRACK_COASTED** | script void SensorTrackCoasted(`WsfPlatform` aPlatform, `WsfSensor` aSensor, `WsfTrack` aTrack) end_script |
| **SENSOR_TRACK_DROPPED** | script void SensorTrackDropped(`WsfPlatform` aPlatform, `WsfSensor` aSensor, `WsfTrack` aTrack) end_script |
| **SENSOR_TRACK_INITIATED** | script void SensorTrackInitiated(`WsfPlatform` aPlatform, `WsfSensor` aSensor, `WsfTrack` aTrack) end_script |
| **SENSOR_TRACK_UPDATED** | script void SensorTrackUpdated(`WsfPlatform` aPlatform, `WsfSensor` aSensor, `WsfTrack` aTrack) end_script |
| **SENSOR_TURNED_OFF** | script void SensorTurnedOff(`WsfPlatform` aPlatform, `WsfSensor` aSensor) end_script |
| **SENSOR_TURNED_ON** | script void SensorTurnedOn(`WsfPlatform` aPlatform, `WsfSensor` aSensor) end_script |
| **SIMULATION_COMPLETE** | script void SimulationComplete() end_script |
| **SIMULATION_INITIALIZING** | script void SimulationInitializing() end_script |
| **SIMULATION_STARTING** | script void SimulationStarting() end_script |
| **STATE_ENTRY** | script void StateEntry(`WsfPlatform` aPlatform, `WsfProcessor` aProcessor, `WsfTrack` aTrack, `string` aStateName) end_script |
| **STATE_EXIT** | script void StateExit(`WsfPlatform` aPlatform, `WsfProcessor` aProcessor, `WsfTrack` aTrack, `string` aStateName) end_script |
| **TANKING_EVENT** | script void TankingEvent(`WsfPlatform` aSupplyPlatform, `WsfPlatform` aRcvrPlatform, `string` aEvent) end_script |
| **TASK_ASSIGNED** | script void TaskAssigned(`WsfTask` aTask, `WsfTrack` aTrack) end_script |
| **TASK_CANCELED** | script void TaskCanceled(`WsfTask` aTask) end_script |
| **TASK_COMPLETED** | script void TaskCompleted(`WsfTask` aTask, `string` aStatus) end_script |
| **TEAM_NAME_DEFINITION** | script void TeamNameDefinition(`WsfPlatform` aPlatform) end_script |

## Examples

This is an example of enabling PlatformBroken and writing information. The script is named platformBroken instead of PlatformBroken (case difference) so the name had to be supplied after the "enable PLATFORM_BROKEN". The writes will only result if the platform broken was "my_jet" in the simulation.

```wsf
script void platformBroken(WsfPlatform aPlatform)
  double platformalt = aPlatform.Altitude();
  WsfGeoPoint location = aPlatform.Location();
  if (aPlatform.Name() == "my_jet")
  {
     writeln("*T=,", TIME_NOW,
                    ",Platform=,", aPlatform.Name(),
                    ",PlatformAlt=,", platformalt,
                    ",PlatformSpeed=,", aPlatform.Speed(),
                    ",PlatformHeading=,", aPlatform.Heading(),
                    ",PlatformLat=,", location.Latitude(),
                    ",PlatformLon=,", location.Longitude(),
                    ",PlatformXpos,", aPlatform.X(),
                    ",PlatformYpos,", aPlatform.Y(),
                    ",PlatformZpos,", aPlatform.Z());
  }
end_script
observer
  enable PLATFORM_BROKEN platformBroken
end_observer
```

This is another example of using the observer block to update a global variable used in the simulation as well as writing information:

```wsf
script_variables
  global Map< int, double > mMessages = Map< int, double >();
end_script_variables

script void MessageReceived(WsfMessage aMsg)
  extern Map< int, double > mMessages;
  mMessages[GetPlatformIndex()] = GetMessageTime(aMsg);
end_script
observer
  enable MESSAGE_RECEIVED
end_observer
```

This example prints out comma delimited information from all sensors that tracked a platform name "300_drone" or "301_drone". The information is limited to when a track was initiated and when a track got updated. Two observers are enabled which call a single user defined script called sensorinfo():

```wsf
script void sensorinfo(WsfPlatform aPlatform, WsfSensor aSensor, WsfTrack aTrack)
  WsfPlatform target = aTrack.Target();
  WsfGeoPoint sensorpoint = aPlatform.Location();
  double RelativeAzimuthAspectAngle = target.RelativeAzimuthOf(sensorpoint);
  double RelativeElevationAspectAngle = target.RelativeElevationOf(sensorpoint);
  if ((aTrack.TargetName() == "300_drone") || (aTrack.TargetName() == "301_drone"))
  {
     writeln(TIME_NOW,",",
     aTrack.StartTime(),",",
     aTrack.SensorName(),",",
     aTrack.TargetName(),",",
     RelativeAzimuthAspectAngle,",",
     RelativeElevationAspectAngle,",",
     aTrack.Range());
  }
end_script

observer
   enable SENSOR_TRACK_INITIATED sensorinfo
   enable SENSOR_TRACK_UPDATED sensorinfo
end_observer
```

This example writes out comma delimited information to a **file** instead of to standard (**screen**) output.

```wsf
script void sensorinfo(WsfPlatform aPlatform, WsfSensor aSensor, WsfTrack aTrack)
  if (aTrack.TargetName() == "300_drone")
  {
  string mystring =  write_str(TIME_NOW, ",", aTrack.StartTime(), ",", aTrack.SensorName(), ",", aTrack.TargetName(),
  ",", aTrack.Range());
  string outputfilename = "output.txt";
  FileIO myfile = FileIO();
  myfile.Open(outputfilename, "append");
  myfile.Writeln(mystring);
  }
end_script

observer
  enable SENSOR_TRACK_INITIATED sensorinfo
  enable SENSOR_TRACK_DROPPED sensorinfo
end_observer
```

This example writes out information for every successful message receipt.

```wsf
script void MessageReceived(WsfMessage aMsg)
   writeln(GetMessageTime(aMsg));
end_script
observer
   enable MESSAGE_RECEIVED
end_observer
```

This example writes out information for every successful sensor detection, and accesses the bandwidth and frequency of the transmitter involved in the interaction, if it is valid.

```wsf
script void SensorDetectionAttempt(WsfPlatform aPlatform, WsfSensor aSensor, WsfPlatform aTarget, WsfSensorInteraction aResult)
   if(aResult.Detected())
   {
      writeln(aSensor.Name(), " ", aResult.ModeName(), " ", aResult.SignalToNoise());
   }

   WsfEM_Xmtr xmtr = aResult.Xmtr();
   if (xmtr.IsValid())
   {
      double freq = xmtr.Frequency();
      double bw = xmtr.Bandwidth();
   }
   else
   {
      writeln("Invalid Xmtr in SensorDetectionAttempt");
   }
end_script
observer
   enable SENSOR_DETECTION_ATTEMPT
end_observer
```
