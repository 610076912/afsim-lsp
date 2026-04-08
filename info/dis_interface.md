# dis_interface

## Syntax

**Syntax:** `dis_interface ... end_dis_interface`

```wsf
dis_interface

   # Connection Commands

   connections ... end_connections
   edit_connections ... end_edit_connections
   record <filename>
   playback <filename>
   broadcast  <broadcast-IP-address>
   multicast <multicast-IP-address> <interface-address>
   unicast <unicast-address>
   port <IP-port-number>
   send_port <IP-port-number>
   receive_port <IP-port-number>
   time_to_live <ttl-value>

   # Filtered Output Connection Commands

   filtered_connection ... end_filtered_connection
      allow entity_type <type> [ all / tracked <by force>]
      allow force <force> [ all / tracked <by force>]

   # Simulation Control Commands

   protocol_version <protocol-version-id>
   exercise <dis-exercise-id>
   site <dis-site-id>
   application <dis-application-id>
   join_exercise
   no_join_exercise
   autostart
   no_autostart
   deferred_connection_time <time-value>
   absolute_timestamp
   ignore_pdu_time
   use_pdu_time
   mover_update_timer <time-value>
   heartbeat_timer <time-value>
   heartbeat_multiplier <real-value>
   initial_distribution_interval <time-value>
   entity_position_threshold <length-value>
   entity_orientation_threshold <angle-value>
   maximum_beam_entries <positive-integer>
   maximum_track_jam_entries <positive-integer>
   sensor_update_interval <time-value>

   # Mapping Commands

   force <side> <dis-force-id>
   entity_type <platform_type> <dis-entity-type>
   unknown_platform_type <platform-type>
   entity_appearance  ... end_entity_appearance
   articulated_part <platform-type> <part-name> <part-id> ... end_articulated_part
   emitter_type <sensor/jammer-type> <dis-emitter-name-enum>
   emitter_function <sensor/jammer-type> <dis-emitter-function-enum>
   beam_type <sensor/jammer-type> <sensor/jammer-mode-name> <sensor/jammer-beam-number> <dis-beam-parameter-index-value>
   beam_function <sensor/jammer-type> <sensor/jammer-mode-name> <sensor/jammer-beam-number> <dis-beam-function-enum-value>
   entity_id <platform_name> <entity-number>
   start_entity <dis-entity>
   private  [ name <name> | type <type> | category <category> | all ]

   # Filtering Commands

   filter_out_by_site_and_app
   ignore_kind_and_domain <kind> <domain>
   ignore_type <dis_entity_type>
   ignore_pdu_type <string>
   filter_out_by_range <platform-name> <length-value>

   # Other Commands

   debug_emission_pdu <level>
   enumerate  entity_types to <target-name>
   enumerate  emitter_types to <target-name>
   log_created_entities
   no_periodic_pdus_while_paused
   multi_thread
   multi_thread_sleep_time <time-value>
   max_allowed_bad_entity_states <integer-value>
   send_periodic_pdus_while_paused
   suppress_non_standard_data <boolean-value>
   suppress_comm_data <boolean-value>
   suppress_emissions_data <boolean-value>
   use_simple_accelerations
   use_simple_orientation_rates
   use_body_angular_velocities
   zero_body_angular_velocities

   # External DIS Mover Commands

   map_external_entity <dis-entity-id>
   map_external_type <dis-entity-type>
end_dis_interface
```

## Overview

The dis_interface block is used to specify the attributes of the Distributed Interactive Simulation (DIS) interface. The DIS interface provides the ability to participate in a DIS exercise or to create a replay file that can be displayed by visualization tools. Use the broadcast or multicast command to participate in a DIS exercise. Use the record command to generate a replay file.

Multiple `dis_interface` blocks may be provided. If the same subcommand is specified in multiple blocks then the last value given will be used.

> **Warning:** The commands mover_update_timer and heartbeat_timer may force `platform.mover` updates within a simulation. Setting the mover_update_timer to 0.0 secs and the heartbeat timer to a very large value (i.e. greater than the simulation `end_time`) will prevent this at the cost of not moving platforms in the simulation until events require them.

## Connection Commands

These commands define how the simulation will connect to other simulation participants.

### connections ... end_connections / edit_connections ... end_edit_connections

By default, the `dis_interface` supports a single input/output (replay file, playback file, or network address). Connection information in this connections block allows for multiple output types. Subcommands available include record, playback, broadcast, multicast, unicast, port, send_port, and receive_port.

When using connections ... end_connections, all previous DIS output commands are replaced by the new user input. When using edit_connections ... end_edit_connections, existing DIS output commands are retained.

> **Note:** Port commands should immediately follow broadcast, multicast or unicast commands inside the connections block.

Example:

```wsf
#  Set up multiple network connections
#  All previous connection commands are discarded!
connections
   unicast 192.168.1.1
   port 9392
   unicast 192.168.1.2
   port 9393
   broadcast 192.168.255.255
   port 5828
end_connections
...
#  Add a new replay file output, leaving existing outputs intact.
edit_connections
   record my_replay.rep
end_edit_connections
```

### record \<filename\>

Record the simulation to the specified file.

> **Note:** When used outside the connections block, the record, playback, broadcast, multicast, and unicast commands are mutually exclusive. Only the last occurrence will be used.

> **Note:** To insert the run number in the file name use "*%d*".

For example:

```wsf
file replay_%d.rep
```

### playback \<filename\>

Causes entity state data contained within the specified file to be read and injected into simulation. **ONLY** entity state data is used - all other PDUs are ignored. The entity_type command is used to define the mapping of DIS entity types to WSF platforms, just as in a standard DIS simulation. Entity state PDUs are also written to the record file if defined.

All subsystems within the platform are removed prior to being added to the simulation, and the mover is replaced with a special one that uses the entity state. The signature data will be retrieved from the platform type, defined by the entity_type mapping.

One advantage of this feature is that it can be used in constructive (e.g., non-real-time simulations).

> **Note:** The DIS 'site' of the entities will be changed to eliminate possible conflicts with the any other input stream.

> **Note:** When used outside the connections block, the record, playback, broadcast, multicast, and unicast commands are mutually exclusive. Only the last occurrence will be used.

### broadcast \<broadcast-IP-address\>

Participate in a DIS exercise on the indicated broadcast network. For example, if your ethernet port address is 192.168.1.14 and the netmask is set to 255.255.0.0, the command would be "broadcast 192.168.255.255".

> **Note:** The port command must also be specified.

> **Note:** When used outside the connections block, the record, playback, broadcast, multicast, and unicast commands are mutually exclusive. Only the last occurrence will be used.

### multicast \<multicast-IP-address\> \<interface-address\>

Participate in the DIS exercise on the specified multicast network. The port command must also be specified.

**\<multicast-IP-address\>**
   An address in the range 224.0.0.0 to 239.255.255.255

**\<interface-address\>**
   The machine's IP address on the desired interface. The IP may be abbreviated. Ex: **multicast 225.1.2.3 192.168**.

> **Note:** When used outside the connections block, the record, playback, broadcast, multicast, and unicast commands are mutually exclusive. Only the last occurrence will be used.

### unicast \<unicast-address\>

Communicate DIS traffic with a single endpoint. *unicast-address* can be an IP address or a host-name. The port command must also be specified.

> **Note:** When used outside the connections block, the record, playback, broadcast, multicast, and unicast commands are mutually exclusive. Only the last occurrence will be used.

### port \<IP-port-number\>

Specify the port number for broadcast, multicast, and unicast modes.

### send_port \<IP-port-number\> / receive_port \<IP-port-number\>

Specify the send and receive port numbers for broadcast, multicast, and unicast modes. Both send_port and receive_port must be specified together, and act as a replacement for the port command. This command is primarily used with unicast mode.

### time_to_live \<ttl-value\>

Specify the 'time-to-live' value for multicast communications in the range [0, 255].

As the values of the TTL field increase, routers will expand the number of hops they will forward for a multicast packet. To provide meaningful scope control, multicast routers enforce the following "thresholds" on forwarding based on the TTL field:

* "0" - Restricts the outgoing packets to the same host
* "1" - Restricts the outgoing packets to the same subnet
* "32" - Restricts the outgoing packets to the same site
* "64" - Restricts the outgoing packets to the same region
* "128" - Restricts the outgoing packets to the same continent
* "255" - No restriction

The default is set by the operating system, which is typically set to a low value.

## Filtered Output Connection Commands

These input blocks allow for output-filtered connections to other simulation participants.

### filtered_connection ... end_filtered_connection

Connection information in each filtered_connection block allows for a subset of the DIS PDUs to be output to the specified device. If no device (output type, address, port) exists yet, one is appended to the connections list (as in edit_connections). Subcommands available include record, broadcast, multicast, unicast, port, and allow. The unique subcommand allow provides a way to specify what type of DIS PDUs will be allowed out of this connection to the given device.

When using filtered_connection ... end_filtered_connection, existing DIS output connections are retained. If the same connection was previously defined, it is overwritten as a filtered connection and the filters will apply. If no such connection was previously defined, then the connection is created and added, filters apply.

> **Note:** Port commands should immediately follow broadcast, multicast or unicast commands inside the connections block.

Example:

```wsf
# Set up multiple output filtered network connections

# send to 192.168.10.46 : 3225, only entity state PDUs with
# blue force entities, and red force entities that are tracked by blue

filtered_connection
   unicast     192.168.10.46
   port        3225
   allow       force    blue     all
   allow       force    red      tracked  blue
end_filtered_connection

# broadcast to 130.38.255.255 : 3227, only entity state PDUs with
# all entities of type BLUE_AIRLINER.  Also send entity
# state PDUs with entities of type DRONE that are
# tracked by blue

filtered_connection
   broadcast   130.38.255.255
   port        3227
   allow       entity_type    BLUE_AIRLINER   all
   allow       entity_type    DRONE           tracked  blue
end_filtered_connection
```

#### allow entity_type \<type\> [all / tracked \<by force\>]

Specify a WSF entity type that is allowed to be output from the filtered connection.

#### allow force \<force\> [all / tracked \<by force\>]

Specify a WSF entity force that is allowed to be output from the filtered connection.

> **Note:** When used outside, only the last occurrence will be used.

## Simulation Control Commands

These commands are used to specify general parameters for the simulation.

### protocol_version \<protocol-version-id\>

Specify the DIS protocol version in the range [0, 6].

**Default:** 5

### exercise \<dis-exercise-id\>

Specify the DIS exercise ID in the range [1, 255].

**Default:** 1

### site \<dis-site-id\>

Specify the DIS site ID in the range [1, 65534].

**Default:** 1

### application \<dis-application-id\>

Specify the DIS application ID in the range [1, 65534].

**Default:** 1

### join_exercise / no_join_exercise

Specify if the application should join the exercise (specified by the exercise command) as a participant in a DIS non-real-time scaled-and-stepped simulation.

**Default:** no_join_exercise

### autostart

Do not wait for a Start/Resume PDU to start the simulation.

**Default:** no_autostart

### no_autostart

Wait for a Start/Resume PDU to start the simulation. This is the default.

### deferred_connection_time \<time-value\>

The application will defer joining the exercise until the specified simulation time is reached. Prior to that time it will run as fast as possible and not send data to or receive data from the DIS exercise. When the desired time is reached, the application will connect to the network or begin writing the replay file. The simulation clock will behave as defined by the autostart or no_autostart command. The minimum valid time-value for this command is one second.

### absolute_timestamp

Specify that absolute timestamps are to be used the PDUs produced by this application.

**Default:** Relative timestamps are used.

### ignore_pdu_time

Ignore the time from the PDU and use the current perception of simulation time.

### use_pdu_time

Use the time from the PDU as the effective event time. It is recommended not to use this command for large simulations.

**Default:** ignore_pdu_time

### mover_update_timer \<time-value\>

If greater than 0, the interface will generate events to force platforms to update their position at the specified interval. This is useful for event-driven simulations where position updates may occur infrequently due to the lack of interaction between objects.

> **Note:** Time-stepped simulations (e.g., a simulation that uses the WsfFrameStepSimulation with the "-rt' flag) should set this value to 0 to prevent the extra updates as such simulations already cause mover updates at a high rate.

**Default:** 1.0 seconds

### heartbeat_timer \<time-value\>

Specify the DIS heartbeat timer. For internally controlled entities, this defines the maximum amount of time that can elapse between transmission of Entity State PDUs. The simulation will force an Entity State PDU to be sent if required. To drastically reduce replay file sizes for large simulations, set the heartbeat_timer to a value of 20 or greater.

**Default:** 5.0 seconds

### heartbeat_multiplier \<real-value\>

Specify the DIS heartbeat multiplier. For externally controlled entities, heartbeat_timer values; heartbeat_multiplier defines the maximum amount time that can elapse without receiving an Entity State PDU before an entity is declared 'inactive' and removed from the simulation.

**Default:** 2.4

### initial_distribution_interval \<time-value\>

When participating in a distributed exercise (using broadcast or multicast), the interface will spread out transmission of initial state data to avoid overloading the network. This command provides a mechanism to explicitly specify the initial distribution interval.

**Default:** The value of the heartbeat_timer

### entity_position_threshold \<length-value\>

Specify the DIS entity position threshold.

**Default:** 1.0 meters

### entity_orientation_threshold \<angle-value\>

Specify the DIS entity orientation threshold.

**Default:** 3.0 degrees

### maximum_beam_entries \<positive-integer\>

Specify the maximum number of beam entries that will be transmitted in the 'system' portion of an Electromagnetic Emission PDU.

**Default:** No limit (up to the maximum number that can be stored without exceeding the size limit of the containing DIS 'system').

### maximum_track_jam_entries \<positive-integer\>

Specify the maximum number of track-jam entries that will be transmitted in the 'beam' portion of an Electromagnetic Emission PDU before the high-density track-jam mode will be selected.

**Default:** No limit (up to the maximum number that can be stored without exceeding the size limit of the containing DIS 'system').

> **Note:** The IEEE DIS standard specifies a limit of 10. If conformance to the standard is desired then command must be specified with a value of 10.

### sensor_update_interval \<time-value\>

This is used to force Electromagnetic Emissions PDUs to be sent out at approximately the specified update interval in addition to the standard rules. This is primarily used to force PDUs to be sent more frequently with an updated 'Beam Sweep Sync' in the DIS Beam record. This allows the receiver to have more accurate knowledge of where a scanning sensor is within its scan pattern.

If a value of 0 seconds is specified then no extra updates will be sent.

**Default:** 0 seconds (No extra periodic updates are sent)

## Mapping Commands

These commands define the mappings between DIS and WSF objects.

### force \<side\> \<dis-force-id\>

Specify the DIS force identifier that corresponds to a WSF platform side. This command should be specified for each side that is present in the scenario. If no **force** commands are provided then the following defaults will be defined:

```wsf
force blue  1
force red   2
force green 3
```

> **Note:** If any **force** commands are present then the above defaults will not be used.

### entity_type \<platform_type\> \<dis-entity-type\>

Specify the DIS entity type to be used when sending PDUs for platforms or munitions with the indicated WSF platform type. This command should be specified for each WSF platform type that is present in the scenario. If the type of a platform does not have a corresponding DIS entity type then 0:0:0:0:0:0:0 will be used. For proper WSF interaction of received DIS entities from other networked simulations, a corresponding simple platform_type must be created with defined signatures.

Example:

```wsf
entity_type JUMBO_JET    1:2:225:1:5:5:0
entity_type REGIONAL_JET 1:2:225:1:9:10:0
```

### unknown_platform_type \<platform-type\>

Specify the type of the WSF platform to be created for an external entity if an applicable entity_type entry does not exist.

### entity_appearance ... end_entity_appearance

Specify the DIS Entity Appearance type and state or ID associated with a specified signature state. To identify the appearance mapping:

```wsf
entity_appearance
   name <platform-name> [afterburner | configuration] <appearance-state> <signature-type>
      <signature-state>
   type <platform-type> [afterburner | configuration] <appearance-state> <signature-type>
      <signature-state>
   name <platform-name> articulation <parameter-type> <variable-name> <script-name>
   type <platform-type> articulation <parameter-type> <variable-name> <script-name>
end_entity_appearance
```

**\<platform-name\>**
   A string input of the platform's name.

**\<platform-type\>**
   A string input of the platform type.

**\<appearance-state\>**
   **afterburner**
      An integer value of [0,1], where 0 is considered 'off' and 1 is 'on'.

   **configuration**
      An integer value in Range of [0,15].

**\<signature-type\>**
   The signature type the state is valid for. Valid values are [acoustic, contrast, infrared, optical, radar, rcs].

**\<signature-state\>**
   A string of the signature state name as entered in the signature file.

**\<parameter-type\>**
   A number specifying an articulated part parameter type, defined in the 'Enumerations' document, ISO-REF-010-2006, section 4.7.3.

**\<variable-name\>**
   The name of a script variable on the platform.

**\<script-name\>**
   The name of a script on the platform.

> **Note:** See DIS_Articulation for an example on how to use the 'articulation' capability.

> **Warning:** Afterburner is only valid for air platform types per DIS standards (IEEE Std 1278.1-1995 supplement SISO-REF-010-2006). Configuration is currently implemented only for air platform types.

### articulated_part \<platform-type\> \<part-name\> \<part-id\> ... end_articulated_part

The articulated part block indicates that a platform type should publish an articulated part to DIS. The part may be a `comm`, `sensor`, or `visual_part`. The block may contain the following commands:

* parent \<parent-id\> - If present, this indicates that the part should be parented to another articulated part. A part will inherit the motion of its parent.
* publish \<degree-of-freedom\> - The publish command indicates which degrees-of-freedom are to be published in the DIS entity state PDUs. The possible degrees-of-freedom are:
  * x - The x component of the part's position.
  * y - The y component of the part's position.
  * z - The z component of the part's position.
  * x_rate - The rate of change in the x component of the part's position.
  * y_rate - The rate of change in the y component of the part's position.
  * z_rate - The rate of change in the z component of the part's position.
  * azimuth - The rotation about the part's z-axis.
  * elevation - The rotation about the part's y-axis.
  * rotation - The rotation about the part's x-axis.
  * azimuth_rate - The rate of motion about the part's z-axis.
  * elevation_rate - The rate of motion about the part's y-axis.
  * rotation_rate - The rate of motion about the part's x-axis.

* \<platform-type\> : The type name of the platform that will include articulations in its DIS PDUs.
* \<part-name\> : The name of the articulated part that will be included in the entity-state PDUs.
* \<part-id\> : The ID that will be sent over DIS to represent the part in the entity-state PDUs.

### emitter_type \<sensor-type\> \<dis-emitter-name-enum\>

Specify the DIS 'emitter name' enumeration associated with specified WSF systems that emit electromagnetic energy (e.g., sensors). For outbound electromagnetic emission PDUs this defines the value for the 'emitter name' field in the PDU for a given WSF emitter. For inbound PDUs, a reverse lookup is performed to determine the WSF sensor type needed to provide the additional characteristics to properly model interactions with the externally modeled emitter.

### emitter_function \<sensor-type\> \<dis-emitter-function-enum\>

Specify the DIS 'emitter function' enumeration with specified WSF systems that emit electromagnetic energy (e.g., sensors). This is only applicable for outbound electromagnetic emission PDUs.

### beam_type \<sensor-type\> \<sensor-mode-name\> \<sensor-beam-number\> \<dis-beam-parameter-index-value\>

Specify the DIS Emissions PDU 'beam parameter index' value associated with specified WSF systems that emit electromagnetic energy (e.g., sensors). For outbound electromagnetic emission PDUs this defines the value for the 'beam parameter index' field in the PDU for a given WSF emitter beam. For inbound PDUs, this field is **NOT** currently used within WSF.

**\<sensor-type\>**
   The type name of the sensor.

**\<sensor-mode-name\>**
   The mode name of interest for the given sensor type. Use '*' to represent any mode.

**\<sensor-beam-number\>**
   The beam number in the range of [1, 255] of interest for the given mode on the sensor type. Use '*' to represent any beam.

**\<dis-beam-parameter-index-value\>**
   The assigned value in range of [1, 65534] for the 'beam parameter index' field in the DIS emissions PDU to be output by WSF.

### beam_function \<sensor-type\> \<sensor-mode-name\> \<sensor-beam-number\> \<dis-beam-function-enum-value\>

Specify the DIS Emissions PDU 'beam function' value associated with specified WSF systems that emit electromagnetic energy (e.g., sensors). This is applicable only for outbound electromagnetic emission PDUs.

**\<sensor-type\>**
   The type name of the sensor.

**\<sensor-mode-name\>**
   The mode name of interest for the given sensor type. Use '*' to represent any mode.

**\<sensor-beam-number\>**
   The beam number in the range of [1, 255] of interest for the given mode on the sensor type. Use '*' to represent any beam.

**\<dis-beam-parameter-index-value\>**
   The value in range of [1, 255] for the 'beam function' field in the DIS emissions PDU to be output by WSF. If beam_function is not specified by the user, then the WSF implementation is allowed to set the index value to 5.

### entity_id \<platform_name\> \<entity-number\>

Assign a specific DIS entity number to a WSF platform instance. If no DIS entity number is specified for a given platform instance, the simulation will automatically assign one sequentially, in creation order, (see start_entity). The unique DIS entity ID for a platform is formed by combining the values of site, application and *entity number*.

Example:

```wsf
site           79
application    22
entity_id      737-1   101
entity_id      787-1   102
```

This input results in assignment of the DIS entity ID {79:22:101} to the WSF platform instance named '737-1', and an assignment of {79:22:102} to the WSF platform instance named '787-1'.

### start_entity \<dis-entity\>

Specify the starting DIS entity in the range [0, 65534]. The simulation will assign DIS entity IDs to DIS platform representations sequentially, in creation order, beginning with this value for the start_entity.

Example:

```wsf
site          79
application   22
start_entity  10
```

This input results in the simulation's assigning a DIS entity ID of {79:22:10} to the first 'local' DIS representation it creates. The next one will have an ID of {79:22:11}, followed by {79:22:12}, etc.

**Default:** 1

> **Note:** These assignments are overridden by entity_id designations.

### private [ name \<name\> | type \<type\> | category \<category\> | all ]

Indicate that locally owned platforms of the specified name, type, or `platform.category` are to be considered 'private' and not written to the DIS network.

## Filtering Commands

### filter_out_by_site_and_app

Filter out a site and application pair when running in a DIS environment. The site and application must be set up as a pair. Repeat the entire block for multiple site/application pairs.

```wsf
filter_out_by_site_and_app
   ignore_site 80
   ignore_application 200
end_filter_out_by_site_and_app
```

### ignore_kind_and_domain \<kind\> \<domain\>

Filter out DIS entity state PDUs with given DIS entity type kind and domain values. Use of this filter will prevent creation of the corresponding external platforms in the simulation. For example, to filter out all entity state PDUs from land-based platforms (kind = 1; domain = 1):

```wsf
ignore_kind_and_domain 1 1
```

### ignore_type \<dis_entity_type\>

Filter out DIS entity state PDUs of the given DIS entity type. Use of this filter will prevent creation of the corresponding external platforms in the simulation. For example, to filter out all F-15Es in the simulation:

```wsf
ignore_type 1:2:225:1:5:5:0  // See DIS enumeration document for DIS entity types listing
```

### ignore_pdu_type \<string\>

Filter out DIS PDUs of a given type. For instance, to filter out the Stop/Freeze and Signal PDUs:

```wsf
ignore_pdu_type Stop/Freeze
ignore_pdu_type signal
```

### filter_out_by_range \<platform-name\> \<length-value\>

Filter out DIS entity state PDUs based on a given range from a platform. Entities beyond the given range(s) will not be added to the simulation. Multiple platforms may be specified. For example, to filter out all platforms outside a 60 km radius from two 737 platforms, named 737_1A and 737_1B:

```wsf
filter_out_by_range 737_1A 60 km
filter_out_by_range 737_1B 60 km
```

## Other Commands

### debug_emission_pdu \<level\>

Specify the level of debugging information for electromagnetic emission PDUs.

**Default:** 0

### enumerate entity_types to \<target-name\> / enumerate emitter_types to \<target-name\>

* entity_types: Outputs the list of platform types and the entity_type each one maps to.
* emitter_types: Outputs the list of sensor emitter types and the emitter_type each one maps to.
* \<target-name\> : Defines where the listing is output. If \<target-name\> is STDOUT, the listing is printed to the console. Otherwise \<target-name\> is interpreted as a file name and written to a file.

> **Warning:** This command should be used after all platform types and entity_type commands have been processed.

### log_created_entities

Specify that information concerning the creation of DIS entities is to be written to standard output. This is useful for debugging. It is also used to create a DIS entity ID table in conjunction with the make_entity_id_map.pl perl script (located under the tools subdirectory).

### no_periodic_pdus_while_paused

Will cause entity state and emission PDUs not to be sent while the simulation is paused. This is default behavior.

**Default:** off (not sent)

### multi_thread

Creates a worker thread, separate from the main thread, that sends/receives DIS PDUs. Use this capability in a multi-threaded frame step simulation. This feature is not applicable for event-based simulations.

### multi_thread_sleep_time \<time-value\>

Allows the user to explicitly set the time in seconds in which the DIS worker thread will sleep when it is not working.

**Default:** 0.001 sec or one millisecond

### max_allowed_bad_entity_states \<integer-value\>

Specify the number of "bad" DIS entity state PDUs that will be allowed before future PDUs from an entity are suppressed. A bad entity state PDU includes one or more of the following bad data:

* The location is below the lowest possible point under the ocean
* The speed is > 45 km / s
* The acceleration is > 10000 g

**Default:** 5

### send_periodic_pdus_while_paused

Will cause entity state and emission PDUs to be sent while the simulation is paused. This change was implemented as external simulations are permitted to time out and remove remote entities if state PDUs are not received for a specified time.

**Default:** off (not sent)

### suppress_non_standard_data \<boolean-value\> (deprecated)

If this is set to 'true', WSF will only output standard DIS data.

### suppress_comm_data \<boolean-value\>

Specify if Transmitter, Signal, and Receiver PDUs should be written for communications events. This should be set to true if communications PDUs are not important.

**Default:** false

### suppress_emissions_data \<boolean-value\>

Specify if Emissions PDUs should be written for sensor events. This should be set to true if emissions PDUs are not important.

**Default:** false

### use_simple_accelerations

If present, sets the acceleration fields in the DIS Entity State PDU using a simple rate change calculation equation. The related keywords that can be used to set the orientations rates are `dis_interface.use_simple_orientation_rates`, `dis_interface.use_body_angular_velocities`, and `dis_interface.zero_body_angular_velocities`. By default, if no related keywords are present, orientation rate values for psi, theta, and phi angles are set using the 'use_simple_orientation_rates' calculations. To override this behavior use one of the related keywords.

```
       v1 - v0
a =   ---------
       t1 - t0
```

This entry must be present for acceleration and orientation rate data to be computed and entered into the DIS Entity State PDU. If omitted the acceleration and orientation rate fields are set to '0'. If present, the default behavior uses the 'use_simple_orientation_rates' calculations for the orientation rates.

**Default:** Entry Omitted

### use_simple_orientation_rates

If present, uses a simple rate calculation to set the orientation rate fields in the DIS Entity State PDU. This is the default behavior. If the entry is omitted, the fields will still be set using this simple rate calculation. To override this behavior, use either keyword, 'use_body_angular_velocities' or 'zero_body_angular_velocities'.

```
         psi1 - psi0
apsi =   -----------, etc...
           t1 - t0
```

**Default:** Entry Omitted

### use_body_angular_velocities

If present, uses DIS standard world to body calculations to set the DIS Entity State's orientation rate fields. If omitted, the simple orientation rate calculation, is used in the DIS Entity State's orientation rate fields. However, if present, this keyword will override both the 'use_simple_orientation_rates' and the 'zero_body_angular_velocities' keyword behaviors.

```
// convert world (Euler) angular velocities to body axis angular velocities (as per standard)
w1 = (delta phi/dt) - ((delta yaw/dt) * sin(theta))
w2 = (delta theta/dt)*cos(phi) + ((delta psi/dt)*sin(phi)*cos(theta))
w3 = -((delta theta/dt)*sin(phi) + ((delta psi/dt)*cos(phi)*cos(theta))
```

**Default:** Entry Omitted

### zero_body_angular_velocities

If present, zeroes out the DIS Entity State's orientation rate fields. Will override the 'use_simple_orientation_rates' calculations. Will not override the 'use_body_angular_velocities' behavior if both keywords are present.

**Default:** Entry Omitted

## External DIS Mover Commands

### map_external_entity \<dis-entity-id\>

An incoming DIS entity ID will be checked against the dis entity type to platform type mapping. If there is a corresponding platform type, all components defined for that type will be available to the external platform. The external platform will be treated as a local platform within WSF and its components can then be controlled or monitored as with any WSF platform. Any component capable of sending DIS PDUs from WSF will send DIS PDUs, with the exception of the DIS Entity State PDU, which is not sent. The PDUs will have the external platform's entity ID in their dis-entity-id field.

### map_external_type \<dis-entity-type\>

Same as map_external_entity command, except it will map all entities of the given dis-entity-type rather than a specific DIS entity ID.
