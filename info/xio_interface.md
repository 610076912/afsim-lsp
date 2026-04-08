# xio_interface

## Overview

The eXternal IO Interface (XIO) is a protocol primarily for use between WSF applications. In most cases, using XIO requires writing source code and compiling with the WSF library. However some features available without writing code are noted below and in the `WsfXIO` script documentation. The xio_interface command configures the basic parameters.

## Syntax

```wsf
xio_interface
   broadcast ...
   [ port ... | send_port ... receive_port ... ]
   multicast ...
   [ port ... | send_port ... receive_port ... ]
   unicast ...
   [ port ... | send_port ... receive_port ... ]
   mover_update_timer ...
   entity_position_threshold ...
   entity_orientation_threshold ...
   connect_to_simulations
   application ...
   debug ...
   auto_dis_mapping ...
   auto_map_application ...
   no_auto_map_application ...
   falling_behind_threshold ...
   send_aux_data_updates ...
end_xio_interface
```

## Commands

### broadcast

**Syntax:** `broadcast <Broadcast-IP-address>`

Specifies a broadcast IP address and port that will be used to communicate with other WSF applications.

> **Note:** A port specification is required directly after the broadcast command.

Example:

```wsf
broadcast 123.42.21.255
port 54321
```

### multicast

**Syntax:** `multicast <multicast-IP-address> <interface-address>`

Specifies a multicast IP address, interface, and port that will be used to communicate with other WSF applications.

> **Note:** A port specification is required directly after the multicast command.

Example:

```wsf
multicast 224.92.2.2 192.168.10
port 32991
```

### unicast

**Syntax:** `unicast <inet-address>`

Specifies an address to communicate with other WSF applications. A port specification is required directly after the unicast command.

Example:

```wsf
unicast www.google.com
send_port 80
receive_port 88
```

### port

**Syntax:** `port <Port>`

Specifies the port used for a connection command. Must be used directly after multicast, broadcast, or unicast command.

### send_port

**Syntax:** `send_port <Port>`

Specifies the send port used for a connection command. Must be used directly after multicast, broadcast, or unicast command. This is an alternative to the port command, and allows different ports for sending and receiving.

### receive_port

**Syntax:** `receive_port <Port>`

Specifies the receive port used for a connection command. Must be used directly after multicast, broadcast, or unicast command. This is an alternative to the port command, and allows different ports for sending and receiving.

### mover_update_timer

**Syntax:** `mover_update_timer <time-value>`

If greater than 0, the interface will generate events to force platforms to update their position at the specified interval. This is useful for event-driven simulations where position updates may occur infrequently due to the lack of interaction between objects.

**Default:** 1.0 seconds

### entity_position_threshold

**Syntax:** `entity_position_threshold <length-value>`

Specify the entity position threshold used for some interfaces.

**Default:** 1.0 meters

### entity_orientation_threshold

**Syntax:** `entity_orientation_threshold <angle-value>`

Specify the entity orientation threshold used for some interfaces.

**Default:** 3.0 degrees

### connect_to_simulations

**Syntax:** `connect_to_simulations`

Specifies that the WSF application should try to connect to other WSF simulations. By default, most simulation applications, like SAGE, will not connect to each other. This command is not required when connecting only to WSF display applications such as **trackview**.

### application

**Syntax:** `application <application-name>`

Specifies the application's name as text. The application name communicated between applications primarily for user identification. This value is optional.

### debug

**Syntax:** `debug <boolean-value>`

Enables or suppresses XIO status information printed to the screen.

**Default:** off

### auto_dis_mapping

**Syntax:** `auto_dis_mapping <boolean-value>`

Enables or disables automatic mapping of DIS entities. Currently this option will only work for pure WSF exercises, and does **not** support DIS exercises with non-WSF applications. In this mode, platform types of DIS objects are communicated over XIO. The entity_type command is not required in this case.

DIS platforms for Remote DIS bodies are created in the following way:

- If a platform is defined in the input file with the same name as the remote platform, this platform definition is used. Note, this input platform must be disabled using `platform_availability`.
- If a platform_type is defined in the input file with the same type as the remote platform, this type is used.

After the platform is created, it is modified in the following way:

- It receives the same name as the remote platform. Ex: platform *iads-cmdr* owned by Application-1 is named *iads-cmdr* when it is created from DIS in Application-2.
- Command chains are created on the new DIS platform to maintain reporting roles as defined in the remote application.
- Platform parts (i.e. subsystems) such as sensors, processors and comms are removed, as is normally done with external platforms.
- Comm devices are created to mimic the remote platform's comm devices. These devices are configured to communicate messages between the two applications.

*Note: This method does not currently map emitters, use the `dis_interface.emitter_type` instead.*

**Default:** off

### auto_map_application

**Syntax:** `auto_map_application <site>:<application>`

Enables auto-DIS mapping for the specified application.

- \<site\>: Site number to which this command applies. Must either be an integer in the range 1-65534, or an asterisk (*).
- \<application\>: Application number to which this command applies. Must either be an integer in the range 1-65534, or an asterisk (*).

### no_auto_map_application

**Syntax:** `no_auto_map_application <site>:<application>`

Disables auto-DIS mapping for the specified application. Applications specified with no_auto_map_application has precedence over ones specified with auto_map_application.

Both commands override the auto_dis_mapping command.

Example:

```wsf
auto_dis_mapping no
auto_map_application 99:*
no_auto_map_application 99:5
```

- Maps application 99:5 with regular DIS mapping.
- Maps any other application with 99 as a site ID with auto_dis_mapping.
- Maps any other application with regular DIS mapping.

### maximum_modelled_sensors

**Syntax:** `maximum_modelled_sensors <integer-value>`

Specifies the maximum number of external sensor modelling requests the application is able to handle simultaneously.

**Default:** infinite

### debug_modelled_sensors

**Syntax:** `debug_modelled_sensors <boolean-value>`

Specifies that external sensors modeled locally will be put in debug mode.

**Default:** false

### falling_behind_threshold

**Syntax:** `falling_behind_threshold <time-value>`

Specifies how far a simulation must fall behind real time before notifying connected simulations.

**Default:** 0.5 seconds

### send_aux_data_updates

**Syntax:** `send_aux_data_updates <boolean-value>`

Enables or suppresses `aux_data` updates for local platforms.

**Default:** true

## Distributed Scenarios

Using DIS it is possible to run some scenarios across multiple machines. However, the scenario must be able to be split into pieces that do not require intercommunication. Sometimes scenarios cannot be easily split in this way. Using XIO it is possible to run scenarios across multiple machines, even if the scenario requires communication between each part. Generally, these are the requirements:

- Split the scenario up into a number of sections.
- Set up an WSF application to run each section. Each application needs an input file defining the types used and available platforms.
- Set up the `dis_interface` connection parameters.
- Set up `xio_interface` connection parameters.

### Example: Splitting a simulation into 2 parts

XIO automatically forwards track messages over the network between the two simulations.

**dist_test.txt**:

```wsf
xio_interface
   broadcast 192.168.10.255
   port 39583
   debug yes
   connect_to_simulations
   auto_dis_mapping yes
end_xio_interface

platform_type my_type WSF_PLATFORM
   side red
   icon f-18
   mover WSF_AIR_MOVER
   end_mover
   comm com1 WSF_COMM_TRANSCEIVER
      on
      processor dumper
      processor link-proc
   end_comm
   sensor sensor-1 WSF_GEOMETRIC_SENSOR
      off
      maximum_range 100 nm
      frame_time 2.0 s
      reports_location
      processor link-proc
   end_sensor
   processor link-proc WSF_LINKED_PROCESSOR
      on
      external_link commander via com1
   end_processor
   processor dumper WSF_SCRIPT_PROCESSOR
      off
      on_message
         default
            script
               writeln("T=", TIME_NOW, " ", PLATFORM.Name(),
                       " Received ", MESSAGE.Type(), " from ",
                       MESSAGE.Originator());
            end_script
      end_on_message
   end_processor
end_platform_type

platform air-1 my_type
   route
      position 0.0n 0.0e altitude 20000 ft heading 90 deg extrapolate
   end_route
   edit processor dumper
      on
   end_processor
end_platform

platform air-2 my_type
   route
      position 0.001n 0.0e altitude 20000 ft heading 90 deg extrapolate
   end_route
   commander air-1
end_platform

platform air-3 my_type
   route
      position 0.001s 0.0e altitude 20000 ft heading 90 deg extrapolate
   end_route
   edit sensor sensor-1
      on
   end_sensor
   commander air-2
end_platform

realtime
end_time 10 min
```

**scenario_part_1.txt**:

```wsf
include_once dist_test.txt
dis_interface
   broadcast 192.168.10.255
   port 27322
   application 11
   site 22
   autostart
end_dis_interface

# air-2 and air-3 are modelled externally
platform_availability
   default availability 1.0
   name air-2 availability 0.0
   name air-3 availability 0.0
end_platform_availability
```

**scenario_part_2.txt**:

```wsf
include_once dist_test.txt
dis_interface
   broadcast 192.168.10.255
   port 27322
   application 12
   site 22
   autostart
end_dis_interface

# air-2 and air-3 are modelled internally
platform_availability
   default availability 0.0
   name air-2 availability 1.0
   name air-3 availability 1.0
end_platform_availability
```

## Event Output

There are a few extra events available when using XIO. These may be used in addition to the events in `event_output`.

- XIO_CONNECT
- XIO_DISCONNECT
- XIO_SENSOR_HANDOFF
- XIO_SENSOR_HANDOFF_RECEIVE
