# Processor

**Script Class:** `WsfProcessor`

## Overview

## Syntax

```wsf
processor <name> <base-type>
   ... Platform_Part_Commands ...

   update_interval ...
end_processor
```

## Commands

### update_interval

**Syntax:** `update_interval <time-reference>`

If non-zero, specifies a periodic time interval at which the simulation will call the processor. If zero then the processor will only respond to explicit messages.

**Default:** 0.0

> **Note:** Not all processors support periodic updates.

## Type: WSF_SCRIPT_PROCESSOR

**Script Class:** `WsfProcessor`

### Overview

`WSF_SCRIPT_PROCESSOR` is a processor that allows the user to provide scripts that can be executed whenever the processor receives a message or is called for a periodic update. In addition, it allows the definition of external links to route messages to other platforms. Besides the regular "on_update" script block on the processor, users can use `behavior_tree` and Finite State Machine Commands on the script processor to help them organize their script. The order of operation of a script processor each update is:

1. on_update script block
2. behavior_tree on the processor.
3. finite state machine evaluates the current state.

### Syntax

```wsf
processor <name> WSF_SCRIPT_PROCESSOR
   ... processor Commands ...
   ... Platform_Part_Commands ...
   ... External_Link_Commands ...

   behavior_tree ...

   ... Finite State Machine Commands ...

   update_interval <time-value>

   on_initialize
      ...script definition...
   end_on_initialize

   on_initialize2
      ...script definition...
   end_on_initialize2

   on_update
      ...script definition...
   end_on_update

   on_message
      ...script definition...
   end_on_message

   script void on_message_create(WsfMessage aMessage)
      ...script definition...
   end_script

end_processor
```

### Commands

#### on_initialize

**Syntax:** `on_initialize ... end_on_initialize`

This block defines a script that is executed during 'phase 1' initialization of the processor. During phase 1 initialization the processor may not assume anything about state of platform or any of its constituent parts.

The following script variables are predefined:

```wsf
double       TIME_NOW;          // The current simulation time
WsfMessage   MESSAGE;           // The received message
WsfPlatform  PLATFORM;          // The platform containing this processor
WsfProcessor PROCESSOR;         // This processor (the use of "this" has been deprecated)
```

#### on_initialize2

**Syntax:** `on_initialize2 ... end_on_initialize2`

This block defines a script that is executed during 'phase 2' initialization of the processor. During phase 2 initialization the processor may assume the platform and its constituent parts have completed phase 1 initialization.

The following script variables are predefined:

```wsf
double       TIME_NOW;          // The current simulation time
WsfMessage   MESSAGE;           // The received message
WsfPlatform  PLATFORM;          // The platform containing this processor
WsfProcessor PROCESSOR;         // This processor (the use of "this" has been deprecated)
```

#### update_interval

**Syntax:** `update_interval <time-value>`

Specify the interval at which the on_update script should be executed. If this value is not specified then the on_update script will not be executed (even if it is defined).

**Default:** 0.0 secs

#### on_update

**Syntax:** `on_update ... end_on_update`

This block defines a script that is executed in response to the processors periodic update (as defined by the update_interval). If update_interval is not defined or is zero then this block will not be executed.

The following script variables are predefined:

```wsf
double       TIME_NOW;          // The current simulation time
WsfPlatform  PLATFORM;          // The platform containing this processor
WsfProcessor PROCESSOR;         // This processor (the use of "this" has been deprecated)
```

#### on_message

**Syntax:** `on_message ... end_on_message`

```wsf
on_message
   [type <message-type> [subtype <message-subtype>] ]
   [default]
      script
         ...script definition...
      end_script
   ...
end_on_message
```

This command block defines a script that is executed whenever the processor receives a message. If the **script** block is preceded by a **type** / **subtype** commands, the script will process any messages matching the type/subtype. If the **script** block is preceded by **default**, it will process any message type not yet processed in this block.

**type** can be any of the following:

| Type String | Script Class |
|-------------|-------------|
| WSF_ASSOCIATION_MESSAGE | `WsfAssociationMessage` |
| WSF_CONTROL_MESSAGE | `WsfControlMessage` |
| WSF_IMAGE_MESSAGE | `WsfImageMessage` |
| WSF_STATUS_MESSAGE | `WsfStatusMessage` |
| WSF_TASK_ASSIGN_MESSAGE | `WsfTaskAssignMessage` |
| WSF_TASK_CANCEL_MESSAGE | `WsfTaskCancelMessage` |
| WSF_TASK_CONTROL_MESSAGE | `WsfTaskControlMessage` |
| WSF_TASK_STATUS_MESSAGE | `WsfTaskStatusMessage` |
| WSF_DROP_TRACK_MESSAGE / WSF_TRACK_DROP_MESSAGE | `WsfTrackDropMessage` |
| WSF_TRACK_MESSAGE | `WsfTrackMessage` |
| WSF_TRACK_NOTIFY_MESSAGE | `WsfTrackNotifyMessage` |
| WSF_VIDEO_MESSAGE | `WsfVideoMessage` |

> **Note:** `WSF_SCRIPT_PROCESSOR.on_message` and `WSF_MESSAGE_PROCESSOR` will accept either **WSF_DROP_TRACK_MESSAGE** or **WSF_TRACK_DROP_MESSAGE** as a valid handler for `WsfTrackDropMessage`.

The following script variables are predefined:

```wsf
double       TIME_NOW;          // The current simulation time
WsfMessage   MESSAGE;           // The received message
WsfPlatform  PLATFORM;          // The platform containing this processor
WsfProcessor PROCESSOR;         // This processor (the use of "this" has been deprecated)
```

Example:

```wsf
on_message
   type WSF_TRACK_MESSAGE
      script
         WsfTrackMessage trackMsg = (WsfTrackMessage)MESSAGE;
         writeln("T=", TIME_NOW, " Received track: ", trackMsg.Track().TrackId().ToString());
      end_script
   default
      script
         writeln("T=", TIME_NOW, " Received other message");
      end_script
end_on_message
```

> **Note:** WSF_SCRIPT_PROCESSOR will forward the message to any links after on_message executes. Use `WsfProcessor.SuppressMessage()` to prevent this behavior.

### Finite State Machine Commands

#### show_state_evaluations

**Syntax:** `show_state_evaluations`

Indicates that information about state evaluations should be written to standard output. This essentially shows the true or false status of the evaluation of each next_state block.

#### show_state_transitions

**Syntax:** `show_state_transitions`

Indicates that information about state transitions should be written to standard output.

#### state

**Syntax:** `state <state-name> ... end_state`

Defines a state in a state machine with the name \<state-name\>. Each state can use a different `behavior_tree`. Each state can have child states defined inside of it.

```wsf
state <state-name>
  on_entry
     ... <script-commands> ...
  end_on_entry
  on_exit
     ... <script-commands> ...
  end_on_exit
  next_state <next-state-name-1>
     ... <script-commands> ...
  end_next_state
  next_state <next-state-name-n>
     ... <script-commands> ...
  end_next_state
  behavior_tree
     ... behavior_tree Commands ...
  end_behavior_tree
  state <child-state-name-1>
     ...
  end_state
  state <child-state-name-N>
     ...
  end_state
end_state
```

### Script Interface

All of the methods defined in `WsfProcessor` (and by derivation those in `WsfPlatformPart` and `WsfObject`) are available to any of the scripts defined within this processor.

#### on_message_create

**Syntax:** `script void on_message_create(WsfMessage aMessage) ... end_script`

This is an optional script that can be defined, which allows one to modify a message internally created by a processor prior to it being sent. This is typically used to override the default priority of a message using `WsfMessage.SetPriority`

> **Note:** This script is currently invoked ONLY by `WSF_TRACK_PROCESSOR` prior to sending a `WsfTrackMessage` or a `WsfTrackDropMessage` to external recipients. Other processors will be modified in the future to invoke this script if it is defined.

## Type: WSF_MESSAGE_PROCESSOR

### Overview

`WSF_MESSAGE_PROCESSOR` provides the ability to control the flow of received messages by applying user-defined time delays and routing. The user provides **process** blocks which specifies the messages to which the accompanying message delays and routing are applied.

### Input Requirements

Input to the processor consists of the following:

- Zero or more **process** blocks which contain:
  - One or more **select** blocks that define the messages to be acted upon.
  - Commands that define the actions to be applied to the selected messages (e.g., time delay, routing or ignoring).
- An optional **default_process** block that defines the actions to be applied to messages that are not selected by a **process** block.
- An optional **default_routing** block that defines the routing to be applied to messages that do not contain any routing commands.
- Commands to configure the queue manager that is responsible for processing messages with a non-zero delay_time.

### Processing Flow

The general flow of processing a received message is as follows:

- Search the **process** blocks for the first entry that applies. If an applicable **process** block is not found, use the default message handling as defined by the **default_process** block.
- If the message handling specified ignore_message, simply ignore the message and exit.
- If the message handling specified a non-zero delay_time, put the message in the processing queue according to the queuing_method and number_of_servers.
- When any necessary delay has been completed (or immediately if no delay was selected), route the message as required:
  - Use the internal and external link commands from the selected **process** or **default_process** block, if defined.
  - If not defined, use the internal and external link commands from the **default_routing** block.

### Syntax

```wsf
processor <name> WSF_MESSAGE_PROCESSOR
   processor Commands ...
   Platform_Part_Commands ...
   ... WSF_SCRIPT_PROCESSOR Commands ...

   # Specify the parameters for handling messages to be delayed.

   queuing_method ...
   number_of_servers ...

   # Specify message selection and processing rules.
   # (May be repeated as necessary...)

   process

      # Specify the messages to be selected for this process.
      # (May be repeated as necessary...)

      select
          ... Message Selection Commands ...
      end_select

      # Specify how the selected messages are to be processed

      ignore_message
      delay_time ...
      script ... <script commands> ... end_script
      ... External Link Commands ...
      ... Internal Link Commands ...

   end_process

   # Define the processing for messages not selected by a process block.

   default_process
      ignore_message
      delay_time ...
      script ... <script_commands> ... end_script
      ... External Link Commands ...
      ... Internal Link Commands ...
   end_default_process

   # Define the routing to be used when the selected process (or default_process)
   # block does not include any routing commands.

   default_routing
      ... External Link Commands ...
      ... Internal Link Commands ...
   end_default_routing

   # NOTE: Message Processing Commands that occur outside of process and
   # default_process are assumed to be part of the default_process.

   delay_time ...
   ... External Link Commands ...
   ... Internal Link Commands ...
   ignore_message
end_processor
```

### Message Queuing Commands

These commands define how messages are queued if they require a time_delay.

#### queuing_method

**Syntax:** `queuing_method [ first_in_first_out | last_in_first_out | none ]`

Specifies how incoming messages are to be queued if all of the servers are busy. A value of **none** indicates the message will be discarded if no server is available.

**Default:** first_in_first_out

#### number_of_servers

**Syntax:** `number_of_servers [ <integer-reference> | infinite ]`

Specifies the maximum number of messages that can be 'in process' at any given instant of time. If a new message is received and all the servers are busy, the message will be queued according to the queuing_method.

If 'infinite' is specified (the default), received messages are simply delayed by the required amount before being forwarded.

**Default:** infinite

### Message Selection Commands

The message selection commands occur inside **select** blocks and specify what messages are to be acted upon by the Message Processing Commands in the **process** block in which they occur. A message will be selected for processing if *all* of the selection criteria specified in any **select** block within the **process** block are true.

Note that with the exception of the sender command, each of the selection criteria commands should occur at most once within a given **select** block. For example, if one desires to select two different types of messages then two **select** blocks must be provided, each with a different type selector.

#### type

**Syntax:** `type <message-type>`

Returns true if the supplied message type matches the type from the message. Standard message types are listed in the message types table above.

#### subtype

**Syntax:** `subtype <message-subtype>`

Returns true if the supplied message subtype matches the type from the message.

#### sensor_name

**Syntax:** `sensor_name <sensor-name>`

Returns true if the message is a WSF_TRACK_MESSAGE, WSF_IMAGE_MESSAGE or WSF_VIDEO_MESSAGE, and if the supplied sensor name matches the sensor name from the message.

#### sensor_type

**Syntax:** `sensor_type <sensor-type>`

Returns true if the message is a WSF_TRACK_MESSAGE, WSF_IMAGE_MESSAGE or WSF_VIDEO_MESSAGE, and if the supplied sensor type matches the sensor type from the message.

#### sensor_mode

**Syntax:** `sensor_mode <sensor-mode>`

Returns true if the message is a WSF_TRACK_MESSAGE, WSF_IMAGE_MESSAGE or WSF_VIDEO_MESSAGE, and if the supplied sensor mode matches the sensor mode from the message.

#### system_name

**Syntax:** `system_name <system-name>`

Returns true if the message is a WSF_STATUS_MESSAGE and if the supplied system name matches the system name from the message.

#### sender

**Syntax:** `sender commander | peer | subordinate | self`

Returns true if the sender of the message was one of the identified platforms.

> **Note:** This command may be repeated to build the set of acceptable senders. The return value will be true if any of the sender commands returns true.

#### script (selection)

**Syntax:** `script ... script commands ... end_script`

Defines a script that returns true if the message is to be selected. The script variable MESSAGE refers to the current message.

### Message Processing Commands

#### delay_time

**Syntax:** `delay_time <random-time-reference>`

Specifies the amount of time the message should be delayed before being processed.

**Default:** delay_time 0 sec (no delay)

> **Note:** This is a \<random-time-reference\>, and as such can specify a distribution from which the delay is 'drawn' for each received message.

#### ignore_message

**Syntax:** `ignore_message`

Indicates the message should be ignored.

**Default:** false (The message will be processed)

#### script (processing)

**Syntax:** `script ... script commands ... end_script`

Defines a script that will be called to 'process' the message. The script variable MESSAGE refers to the current message.

This is similar to the **script** block inside of an `WSF_SCRIPT_PROCESSOR.on_message` block in `WSF_SCRIPT_PROCESSOR`.

> **Note:** This form of the **script** command (no return type, name and argument list) is allowed only within a **process** or **default_process** block. The **script** command that occurs outside of these blocks is treated as a normal script definition and must include a return type, name and argument list.

### External Link Commands

These commands are used to specify the routing of messages to offboard recipients (i.e., other platforms). See External_Link_Commands.

### Internal Link Commands

These commands are used to specify the routing of messages to 'onboard' recipients (i.e., processors on the same platform).

#### clear_internal_links

**Syntax:** `clear_internal_links`

Remove all of the currently defined internal links defined by the internal_link or processor commands. This is useful if one wants to reuse an existing platform definition with some modifications.

#### internal_link

**Syntax:** `internal_link <platform-part-name>`

#### processor

**Syntax:** `processor <platform-part-name>`

Specify that messages that originate from this object are to be routed to the specified platform part object on the same platform. This command may be specified multiple times to route the message to multiple recipients.

*\<platform-part-name\>* is one the following:

- The name of a processor on the platform.
- The name of a comm device on the platform.
- The name of a sensor device on the platform.
- The string **mover** to indicate the recipient is the mover object on the platform.
- The string **fuel** to indicate the recipient is the fuel object on the platform.

The first form where the recipient is a processor is currently the only one used. At the current time no platform parts implemented by the unclassified WSF core support receiving messages, so linking to them would not perform any useful function.

## Type: WSF_EXCHANGE_PROCESSOR

### Overview

`WSF_EXCHANGE_PROCESSOR` is a processor that manages the exchange of commodities or services with other simulated platforms. Three possible examples would be a tanker-to-receiver exchange of fuel, a warehouse which supplies spare parts to a mechanic who needs them, or that same mechanic which goes to a disabled vehicle to repair it and return it to service. An exchange is negotiated in a series of ping-pong negotiation events. The result is a mutually decided upon quantity of exchange, and optionally, a decided rate of transfer of that commodity or service. (If no rate is specified, the exchange rate defaults to zero, and is thus considered instantaneous.) If a non-zero rate is negotiated, both platforms understand the exchange is in-progress until the full amount is transacted, based upon time elapsed. In this case, either participant may cancel the transaction prematurely, and the transacted amount to the present time will be retained.

The platform-to-platform exchange may be within a single WSF-based simulation, or with an externally simulated entity across a DIS interface. A DIS interface does not specify a rate of transfer, so the fidelity of these exchanges may degrade a bit.

There are several sub-classes the user will need to understand to accomplish Exchange functionality:

A quantity is captured in any implementation-defined convenient unit of measure. However, if the exchanged commodity is linked to the WSF platform payload or fuel in order to affect the motion dynamics, then the units of measure must be internally specified in kilograms. (The standard WSF input parsing will accept imperial or other unit types, but will translate them internally to MKS.) But provided the Container contents do not interact with the platform mass, the units supplied to the container, and interacted with by scripting, may be arbitrary floating point values.

A "tender" encapsulates a Request or an Offer of a commodity or service. The tender will specify the name of the commodity or service, the maximum amount desired or available to be provided, the maximum rate at which it may be transferred, and a flag indicating whether this named item is a commodity, or a service.

A "container" is placed on the WSF_EXCHANGE_PROCESSOR, and specifies the maximum amount of an item which may be stored for later provision, or the maximum amount which may be accumulated at any one time on the platform. The container holds a tender as one of its attributes.

A "transactor" is a conduit through which commodities or services may enter or leave a specified container. The direction of flow ('is_offeror' or 'is_requestor') is specified at the time of creation of the transactor, and may not be changed afterward.

### Syntax

```wsf
processor <name> WSF_EXCHANGE_PROCESSOR
   ... processor commands ...
   ... Platform_Part_Commands ...
   ... Exchange Processor Commands ...
   ... Exchange Processor Script Interface ...
   container <name>
     ...
   end_container
   transactor <name>
     ...
   end_transactor
end_processor
```

### Tender Definition

A Tender can be constructed by the user in the input stream in two ways, as a commodity or service.

#### commodity

**Syntax:** `commodity <commodity-name> ... end_commodity`

A tender of 'commodity' is to propose an exchange of some named tangible goods, noting the kind, amount, and rate of a planned requested or offered exchange. It does not specify the direction of flow, which is dictated by the transactor is_offeror or is_requestor setting.

#### service

**Syntax:** `service <service-name> ... end_service`

A tender of 'service' is to propose an exchange of some named intangible service, noting the kind, amount, and rate of a planned requested or offered exchange. It does not specify the direction of flow, which is dictated by the transactor is_offeror or is_requestor setting.

### Tender Commands

#### quantity

**Syntax:** `quantity <real-value>`

Specifies the current number of services available or desired.

#### maximum_quantity

**Syntax:** `maximum_quantity <real-value>`

Specifies the limiting number of services available or desired. Syntactical convenience to indicate the maximum size of a container.

#### mass_quantity

**Syntax:** `mass_quantity <mass-value>`

Specifies the current mass of commodity available or desired.

#### maximum_mass_quantity

**Syntax:** `maximum_mass_quantity <mass-value>`

Specifies the limiting quantity of commodity available or desired. Syntactical convenience to indicate the maximum size of a container.

#### rate

**Syntax:** `rate <real-value>`

Specifies the rate of services offered per unit time.

#### service_interval

**Syntax:** `service_interval <real-value>`

Specifies the time required to accomplish a unit of service. 30 minutes = Two repairs per hour.

#### mass_rate

**Syntax:** `mass_rate <real-value>`

Specifies the rate of commodities exchanged services offered per unit time. The real value must be followed with a correct mass rate specification, such as kg/sec, etc.

### Container Definition

#### container

**Syntax:** `container <container-name> ... end_container`

The \<container-name\> specifies the name of the object, as a way for the `WSF_EXCHANGE_PROCESSOR` to differentiate between perhaps several containers owned by the processor. The container block quantifies a container; its name, what it holds, maximum, and current quantities of the commodity or service. Transactions are always "piped" into or out of a named container. No transaction is permitted which transfers more of a commodity or service than may be added to or decremented from a container, given its maximum capacity and current quantity.

### Container Commands

#### service

**Syntax:** `service ... end_service`

Specify a service type, amount, and exchange rate, as in Tender Definition above. Only one "service" or "commodity" may be supplied.

#### commodity

**Syntax:** `commodity ... end_commodity`

Specify a commodity type, amount, and exchange rate, as in Tender Definition above. Only one "service" or "commodity" may be supplied.

#### initial_quantity

**Syntax:** `initial_quantity <real-value>`

Specifies the beginning number of services available in the container, which must be less than or equal to the maximum container size in the above tender specification.

#### initial_mass_quantity

**Syntax:** `initial_mass_quantity <mass-value>`

Specifies the beginning amount of a commodity available in the container, which must be less than or equal to the maximum container size in the above tender specification.

### Transactor Definition

#### transactor

**Syntax:** `transactor <transactor-name> ... end_transactor`

The \<transactor-name\> specifies the name of the object, as a way for the `WSF_EXCHANGE_PROCESSOR` to differentiate between perhaps several transactors owned by the processor. The transactor block quantifies a transaction; its name, the direction of flow of the commodity or service, and current quantities of the transaction in-progress. Transactions are always "piped" into or out of a named container.

### Transactor Commands

#### is_offeror

**Syntax:** `is_offeror`

Transactor is configured as an offeror/provider of goods or services.

#### is_requestor

**Syntax:** `is_requestor`

Transactor is configured as a requestor/consumer of goods or services.

#### hook_to_fuel

**Syntax:** `hook_to_fuel <boolean-value>`

Transactor will increment or decrement the quantity of fuel on its platform after every successful transaction. Will not decrement below a zero quantity.

#### hook_to_payload

**Syntax:** `hook_to_payload <boolean-value>`

Transactor will increment or decrement the quantity of payload on its platform after every successful transaction. Will not decrement below a zero quantity.

#### exclusive_hook_to_payload / exclusive_hook_to_fuel

**Syntax:** `exclusive_hook_to_payload` or `exclusive_hook_to_fuel`

Transactor will directly control the quantity of payload or fuel, forcing it to match what is currently in the named container. It will be permitted to ignore and override any other process which sets the fuel or payload quantity, including input file specifications. Will not decrement below a zero quantity.

#### proximity_limit

**Syntax:** `proximity_limit <length-value>`

Specifies the maximum distance allowed between two platforms in order to exchange. Default is zero, or distance ignored.

#### time_out_clock_interval

**Syntax:** `time_out_clock_interval <time-value>`

Specifies the maximum interval allowed to wait for a response to an offer or request. If a request is received, and a corresponding offer is sent out, and then no response is subsequently received, the offer is canceled after this period of time, in order to allow the transactor to be freed up to offer to another requestor.

### Exchange Processor Commands

#### commodity_and_capability_pairing

**Syntax:** `commodity_and_capability_pairing <commodity-name> <capability-type>`

This keyword creates an association between a commodity name, and a Platform Capability, as supplied in the DIS Entity State PDU. If an exchange processor has a transactor which is currently offering a fuel commodity, then this processor will assure that the platform capability "SUPPLY_FUEL" will be flagged as present. Multiple pairings may be provided.

#### service_and_capability_pairing

**Syntax:** `service_and_capability_pairing <service-name> <capability-type>`

This keyword creates an association between a service type name, and a Platform Capability, as supplied in the DIS Entity State PDU. If an exchange processor has a transactor which is currently offering a repair service, then this processor will assure that the platform capability "VEHICLE_REPAIR" will be flagged as present. Multiple pairings may be provided.

#### ignore_all_proximity_checks

**Syntax:** `ignore_all_proximity_checks <boolean-value>`

If set true, command ignores, and overrides all the transactor 'proximity_limit' values above, forcing them to zero. No transactions will fail due to a proximity limit check. Default is 'false'.

#### force_transactions_instantaneous

**Syntax:** `force_transactions_instantaneous <boolean-value>`

If set true, command ignores all specifications of tender 'rate', 'service_interval', or 'mass_rate'. Once successfully negotiated, the resulting transactions will take zero simulated time.

#### debug

**Syntax:** `debug <boolean-value>`

Command prompts console output of assistance in debugging processor operations.

#### edit

**Syntax:** `edit <object_type> <object_name> ... end_<object_type>`

Command allows the edit of a previously named transactor or container. This command will begin a block, which must be concluded with the normal end_block syntax. Inside the block, any commands may be used which are appropriate for the chosen object_type.

### Exchange Processor Script Interface

`WSF_EXCHANGE_PROCESSOR` (script object name WsfExchangeProcessor) utilizes the capabilities of the Common_Script_Interface and `WSF_SCRIPT_PROCESSOR`, as well as providing the following:

#### FindContainer

**Syntax:** `Transactor FindContainer(string)`

If the named Container (1st arg) exists, will return a reference to the Transactor to interact with. Returned object should be checked for IsValid() before use.

#### FindTransactor

**Syntax:** `Transactor FindTransactor(string)`

If the named Transactor (1st arg) exists, will return a reference to the Transactor to interact with. Returned object should be checked for IsValid() before use.

#### PayloadProviders

**Syntax:** `Array<int> PayloadProviders()`

Returns an array of the platform indices for the simulated entities currently known to be providing payload, regardless of their proximity.

#### FuelProviders

**Syntax:** `Array<int> FuelProviders()`

Returns an array of the platform indices for the simulated entities currently known to be providing fuel, regardless of their proximity.

#### VehicleRepairers

**Syntax:** `Array<int> VehicleRepairers()`

Returns an array of the platform indices for the simulated entities currently known to be providing vehicle repair services, regardless of their proximity.

#### VehicleRecoverers

**Syntax:** `Array<int> VehicleRecoverers()`

Returns an array of the platform indices for the simulated entities currently known to be providing vehicle recovery services, regardless of their proximity.

#### ClosestPossibleProvider

**Syntax:** `WsfPlatform ClosestPossibleProvider(string)`

Returns a reference to the platform which is the closest known provider of the capability represented by the supplied commodity Item name. Returned object should be checked for IsValid() before use.

## Type: WSF_TRACK_PROCESSOR

**Derives From:** `WSF_SCRIPT_PROCESSOR`

### Overview

`WSF_TRACK_PROCESSOR` implements a processor interface for a track_manager. It is responsible for two major functions:

- Accepting reports from local and off-board sources and feeding them to a track manager for correlation and fusion.
- Sending updated tracks to interested parties.

As it is a `WSF_SCRIPT_PROCESSOR`, it sends messages to connected internal processors and external entities via comm.

The referenced track manager can be either the parent platform's track manager (i.e., the track manager that keeps the Master Track List for the platform). Alternatively, it can create its own track manager that keeps an independent track list.

This processor can be told to report fused tracks or 'raw' tracks to external entities (a raw track is defined as any track that is input to the track processor). External entities will receive a `WsfTrackMessage` (type WSF_TRACK_MESSAGE) containing the updated track. Connected processors on the same platform receive WSF_TRACK_NOTIFY_MESSAGEs, indicating that there has been some change in state of a fused track (Created, Updated, Dropped, Removed).

### Syntax

```wsf
processor <name> WSF_TRACK_PROCESSOR
   ... processor Commands ...
   ... WSF_SCRIPT_PROCESSOR Commands ...

   master_track_processor ...
   non_master_track_processor ...
   track_manager ... end_track_manager

   # Track Purging Commands

   purge_interval ...
   track_history_retention_interval ...

   # Reporting Commands

   external_link ...
   report_to ...
   report_interval ...
   report_method ...
   fused_track_reporting ...
   raw_track_reporting ...
   pass_through_reporting ...
   candidate_track_reporting ...
   unchanged_track_reporting ...
   update_on_report ...

   # Received Report Assimilation Commands

   circular_report_rejection ...
   inbound_filter ...

   # Script Interface

   on_initialize ... end_on_initialize
   on_initialize2 ... end_on_initialize2
   on_update ... end_on_update
   script_variables ... end_script_variables
   script ... end_script
   .. Other Script Commands ...

   script bool is_track_reportable(WsfTrack aTrack)
      ...
   end_script

end_processor
```

### General Commands

#### master_track_processor

**Syntax:** `master_track_processor`

Indicates that this processor should be used as the platform's master track processor. It will directly access the platform's Master Track Manager object and associated Master Track List. This is the default behavior.

#### non_master_track_processor

**Syntax:** `non_master_track_processor`

Indicates that this processor will not be used as the platform's master track processor. It will create its own track manager object, and it will maintain a track list separate from the platform's Master Track List.

> **Note:** For a non-master track processor, this object will process **track_manager sub-commands** in a track_manager ... end_track_manager block.

#### track_manager

**Syntax:** `track_manager ... end_track_manager`

This is a block for processing **track manager** input for track processors that are not their platform's master track processor. Place track manager sub-commands within this block.

Otherwise, if the track processor is the master track processor, the track_manager block belongs at the platform level.

### Track Purging Commands

#### purge_interval / drop_after_inactive

**Syntax:** `purge_interval <time-value>` or `drop_after_inactive <time-value>`

Specifies that a track will be dropped if it goes for more than the specified time without an update. If fused tracks are reported (see report_fused_tracks), a WsfTrackDropMessage will be sent over external links, and attached local observers will be notified.

> **Note:** A track for which an task assignment has been made or received will not be dropped until all such assignments have been completed.

> **Note:** Not a valid command for non-master track processors.

**Default:** Infinite (Do not purge tracks).

#### track_history_retention_interval

**Syntax:** `track_history_retention_interval <time-value>`

Specifies that track histories should be kept for the given time interval. This option is valid only if track_manager.retain_track_history is set in the associated track manager.

> **Note:** This interval is a lower bound. Tracks older than the retention interval will be kept as simulation time progresses, until the next time the track history is purged.

**Default:** 1 hour

### Reporting Control Commands

A platform can report its tracks to other platforms. The commands described below determine what, how often and to whom tracks are reported:

- The external_link or report_to commands control to whom information is to be reported.
- The report_interval and report_method command determines how often the tracks are reported.
- The raw_track_reporting, fused_track_reporting, unchanged_track_reporting and candidate_track_reporting commands determine the types of data reported.

#### report_interval

**Syntax:** `report_interval <time-value>`

Report tracks (raw or fused depending on the following inputs) at the given interval. Each track in the respective track lists will be sent to externally connected entities once per report interval.

**Default:** 10 secs (if external links are defined)

> **Note:** External links must be defined if reporting is to occur.

#### report_method

**Syntax:** `report_method [batch | cyclic | on_update | on_update_fused]`

Specify the strategy for reporting tracks.

- **batch** - All tracks are reported to externally connected entities at the beginning of the reporting interval. New tracks will be reported immediately.
- **cyclic** - Tracks are reported to externally connected entities throughout the reporting interval. The time between reports is T/(N-1), where T is the reporting interval and N is the number of tracks in the master track list at the beginning of the frame. New tracks will be reported immediately.
- **on_update** - Tracks are reported when they are updated. If this is selected, a received track report may result in the immediate report of the received track report and/or a 'local' or 'fused' track that was updated. This also implicitly selects circular_report_rejection on and unchanged_track_reporting off.
- **on_update_fused** - This is equivalent to report_method on_update, fused_track_reporting on, circular_report_rejection on, unchanged_track_reporting off.

**Default:** batch

#### fused_track_reporting

**Syntax:** `fused_track_reporting <boolean-value>`

Indicates that the object should report fused (local) tracks to externally connected entities via comm devices.

**Default:** 'off', or to not report fused tracks.

> **Note:** Fused tracks should only be reported to entities that will not transmit tracks back to the sender.

#### raw_track_reporting

**Syntax:** `raw_track_reporting <boolean-value>`

Indicates whether nonlocal ('raw') tracks are to be reported to externally connected entities via comm devices.

**Default:** report raw tracks ('on')

#### pass_through_reporting

**Syntax:** `pass_through_reporting <boolean-value>`

Indicates that any nonlocal ('raw') tracks are to be reported immediately to externally connected entities. This is the same as 'raw_track_reporting', except that reporting is in a 'pass-through' mode, rather than interval-based.

#### candidate_track_reporting

**Syntax:** `candidate_track_reporting <boolean-value>`

Indicates whether 'candidate tracks' (i.e., filtered sensor measurements for which the filter is not yet stable) should be reported to externally connected entities. Setting this option allows the data to be made available in the master track list as soon as it is received.

#### unchanged_track_reporting

**Syntax:** `unchanged_track_reporting <boolean-value>`

Indicates whether tracks whose data have not changed since the last reporting interval should be reported again.

**Default:** on

#### update_on_report

**Syntax:** `update_on_report <boolean-value>`

Specify whether to update track information to the time of the report. If enabled, track location and location uncertainty are updated before track reports are sent. If quantitative_track_quality is enabled, the reported track quality will be recomputed based on extrapolated location uncertainty.

**Default:** true, if quantitative_track_quality is set; false otherwise.

### Received Report Assimilation Commands

The following commands control the disposition of received reports.

#### circular_report_rejection

**Syntax:** `circular_report_rejection <boolean-value>`

Indicates how received track reports that are determined to be 'circular' should be processed. A received track report is declared to be a 'circular report' if one of the following conditions is true:

- The received track report is a simple reflection of a report that originated from the receiving node.
- The received track report is a fused track report whose last update was the result of a report that originated from the receiving node.

**Default:** off

#### inbound_filter

**Syntax:** `inbound_filter ... end_inbound_filter`

By default, the processor will attempt to submit all received reports to the track manager for correlation and fusion. There are situations, however, where a given track processor may not desire this activity. This block allows control over what is assimilated.

At the current time there is only one subcommand:

- `reject non_sensor_reports` - Indicates that reports that aren't direct sensor reports should be ignored.

### Script Interface

`WSF_TRACK_PROCESSOR` utilizes the capabilities of the Common_Script_Interface and `WSF_SCRIPT_PROCESSOR`, as well as providing the following:

#### is_track_reportable

**Syntax:** `script bool is_track_reportable(WsfTrack aTrack) ... end_script`

The 'is_track_reportable' method may be supplied to provide an additional level of control over what tracks get reported. It is very useful for creating custom reporting methods. If this method is defined, it will be called whenever a track is about to be reported as a result of the standard fused or raw track reporting. If it is not defined then the track will be reported as normal.

Example:

```wsf
script bool is_track_reportable(WsfTrack aTrack)
   // Define the script body here to return a 'true' value if the track should
   // be reported and 'false' if it should not.
   bool isReportable = true;
   if (aTrack.TimeSinceUpdated() > 60.0) isReportable = false;
   return isReportable;
end_script
```

## Type: WSF_DELAY_PROCESSOR

### Overview

`WSF_DELAY_PROCESSOR` is used to simulate that it takes a finite amount of time to process information. When the processor receives a message (e.g., image, track) it will hold the message to simulate processing time and then forward the message via its internal and external links.

Typically, the initial producer of a message such as a sensor would link itself to this processor and this processor would link itself to the consumers.

### Syntax

```wsf
processor <name> WSF_DELAY_PROCESSOR
   ... processor Commands ...
   ... Platform_Part_Commands ...
   ... External_Link_Commands ...
   ... WSF_SCRIPT_PROCESSOR Commands ...

   queuing_method ...
   number_of_servers ...
   time_distribution ...
end_processor
```

### Commands

#### queuing_method

**Syntax:** `queuing_method [ first_in_first_out | last_in_first_out | none ]`

Specifies how incoming messages are to be queued if all of the servers are busy. A value of **none** indicates the message will be discarded.

**Default:** first_in_first_out

#### number_of_servers

**Syntax:** `number_of_servers [ <integer> | infinite ]`

Specifies the maximum number of messages that can be 'in process' at any given instant of time. If a new message is received and all the servers are busy, the message will be queued according to the queuing_method.

If 'infinite' is specified (the default), received messages are simply delayed by the required amount before being forwarded.

**Default:** infinite

#### time_distribution constant

**Syntax:** `time_distribution constant time <time-value>`

Defines that simulated processing time will be a constant value with the specified time.

**Default:** The default time_distribution is 'constant time 0 seconds'

#### time_distribution uniform

**Syntax:** `time_distribution uniform minimum_time <min-time-value> maximum_time <max-time-value>`

Defines that the simulated processing time for a message will be drawn from a uniform distribution with the specified range.

#### time_distribution gaussian

**Syntax:** `time_distribution gaussian mean_time <mean-time-value> sigma_time <sigma-time-value>`

Defines that the simulated time for a message will be drawn from a Gaussian distribution with the specified mean and standard deviation.

#### time_distribution log_normal

**Syntax:** `time_distribution log_normal mean_time <mean-time-value> sigma_time <sigma-time-value>`

Defines that the simulated time for a message will be drawn from a log-normal distribution with the specified mean and standard deviation.

## Type: WSF_LINKED_PROCESSOR

### Overview

`WSF_LINKED_PROCESSOR` is a processor with internal_link (to other processors) and external links (to other platforms through comm). Although this type has limited utility, many other processor types are derived from it, and similarly, have links.

One simple use is a radar post in which the radar reports are to be sent directly to the commander.

### Syntax

```wsf
processor <name> WSF_LINKED_PROCESSOR
   ... processor commands ...
   Platform_Part_Commands ...
   ... External_Link_Commands ...
end_processor
```

Example:

```wsf
platform_type RADAR_POST WSF_PLATFORM
   comm datalink WSF_COMM_TRANSCEIVER
      ...
   end_comm

   sensor radar WSF_RADAR_SENSOR
      ...
      internal_link router
   end_sensor

   processor router WSF_LINKED_PROCESSOR
      external_link commander via datalink
   end_processor
end_platform_type
```

## Type: WSF_PERFECT_TRACKER

### Overview

`WSF_PERFECT_TRACKER` is used to simulate a perfect seeker or perfect command guidance. It simply updates the platform 'current target track' to correspond to the truth target platform that was handed to the host platform. The 'current target track' is often used by guidance computers such as WSF_GUIDANCE_COMPUTER and WSF_HARM_GUIDANCE to determine the intercept point for navigation purposes.

### Syntax

```wsf
processor <name> WSF_PERFECT_TRACKER
   processor Commands ...
   Platform_Part_Commands ...

   update_interval <time-value>
end_processor
```

### Commands

#### update_interval

**Syntax:** `update_interval <time-value>`

Specifies how often the processor should update the track.

**Default:** none - it must be provided.

## Type: WSF_STATE_MACHINE

**Derives From:** `WSF_SCRIPT_PROCESSOR`

### Overview

`WSF_STATE_MACHINE` uses the concept of a finite state machine. The user defines a set of transition rules that define the conditions under which a transition can occur from one state to another. The transition rules are defined using the WSF scripting language. Similar to the `WSF_SCRIPT_PROCESSOR`, the WSF_STATE_MACHINE does not have direct access to tracks; hence, the TRACK variable **cannot** be used.

### Syntax

```wsf
processor <name> WSF_STATE_MACHINE

  WSF_SCRIPT_PROCESSOR Commands ...

  show_state_evaluations
  show_state_transitions

  state <state-name>
     ... state definition ...
  end_state

  # Script Interface

  on_initialize ... end_on_initialize
  on_initialize2 ... end_on_initialize2
  on_update ... end_on_update
  script_variables ... end_script_variables
  script ... end_script
  .. Other Script Commands ...

end_processor
```

### Commands

#### show_state_evaluations

**Syntax:** `show_state_evaluations`

Indicates that information about state evaluations should be written to standard output. This essentially shows the true or false status of the evaluation of each next_state block.

#### show_state_transitions

**Syntax:** `show_state_transitions`

Indicates that information about state transitions should be written to standard output.

#### state

**Syntax:** `state <state-name> ... end_state`

Defines a state in a state machine with the name \<state-name\>. Besides transition conditions, a state can have its own `behavior_tree` inside.

```wsf
state <state-name>
  on_entry
     ...
  end_on_entry
  on_exit
     ...
  end_on_exit
  next_state <next-state-name-1>
     ...
  end_next_state
  next_state <next-state-name-n>
     ...
  end_next_state
  behavior_tree
      behavior_tree Commands ...
  end_behavior_tree
end_state
```

### Script Interface

`WSF_STATE_MACHINE` utilizes the capabilities of the Common_Script_Interface and `WSF_SCRIPT_PROCESSOR`.

## Type: WSF_TRACK_STATE_CONTROLLER

**Derives From:** `WSF_SCRIPT_PROCESSOR`

### Overview

`WSF_TRACK_STATE_CONTROLLER` is a facility that allows the user to categorize tracks using the concept of a finite state machine. The user defines a set of transition rules that define the conditions under which a transition can occur from one state to another. The transition rules are defined using the WSF scripting language. Each track maintains its own state in the machine.

### Syntax

```wsf
processor <name> WSF_TRACK_STATE_CONTROLLER

  ... WSF_SCRIPT_PROCESSOR ...

  // State Machine Commands

  show_state_evaluations
  show_state_transitions
  state <state-name>
     ... state definition ...
  end_state

  // Thinker Commands

  number_of_servers ...

  // Track State Controller Commands

  evaluate_candidate_tracks ...
  evaluation_interval ...
  time_to_evaluate ...

  # Script Interface

  on_initialize ... end_on_initialize
  on_initialize2 ... end_on_initialize2
  on_update ... end_on_update
  script_variables ... end_script_variables
  script ... end_script
  .. Other Script Commands ...

  on_track_drop
     ...
  end_on_track_drop

end_processor
```

### State Machine Commands

#### show_state_evaluations

**Syntax:** `show_state_evaluations`

Indicates that information about state evaluations should be written to standard output.

#### show_state_transitions

**Syntax:** `show_state_transitions`

Indicates that information about state transitions should be written to standard output.

#### state

**Syntax:** `state <state-name> ... end_state`

Defines a state in a state machine with the name \<state-name\>.

```wsf
state <state-name>
  on_entry
     ... <script-commands> ...
  end_on_entry
  on_exit
     ... <script-commands> ...
  end_on_exit
  next_state <next-state-name-1>
     ... <script-commands> ...
  end_next_state
  next_state <next-state-name-n>
     ... <script-commands> ...
  end_next_state
end_state
```

### Thinker Commands

#### number_of_servers

**Syntax:** `number_of_servers`

Specifies the maximum number of evaluations that can occur simultaneously.

**Default:** 1

### Track State Controller Commands

#### evaluate_candidate_tracks

**Syntax:** `evaluate_candidate_tracks <boolean>`

Indicates if 'candidate tracks' are to be evaluated. A candidate track is one that has been received but has not yet been determined to be 'stable' as defined by the filter.

**Default:** false

#### evaluation_interval

**Syntax:** `evaluation_interval <state-name> <time-value>`

Specifies how often a track in the indicated state should be (re)evaluated.

#### time_to_evaluate

**Syntax:** `time_to_evaluate <state-name> <time-value>`

Specifies how long it takes to perform an evaluation of track in the indicated state. This simulates how long it takes to "think" or perform an evaluation in a logical sense.

**Default:** 0.01 seconds

### Script Interface

`WSF_TRACK_STATE_CONTROLLER` utilizes the capabilities of the Common_Script_Interface and `WSF_SCRIPT_PROCESSOR`, and provides the following additional capabilities:

#### on_track_drop

**Syntax:** `on_track_drop ... end_on_track_drop`

This is invoked whenever a processor is informed of a track drop by the track manager. The implicitly defined script variable **TRACK** (of type `WsfLocalTrack`) represents the last known state of the track that is being dropped.

### Method of Operation

Each track, when it is first discovered, is initially put into the first state as defined in the input file after the time_to_evaluate interval has elapsed. From that point on it will continue to evaluate the transition rules for whatever state it is currently in and will transition to new states as the rules allow. When a transition occurs, the on_exit script for the current state will be executed (if it is defined) and the on_entry script for the new state will be executed (if it is defined). The first time the state is entered the time_to_evaluate interval is applied. This serves as a thinking delay on state entry.

Each track is (re)evaluated at the interval defined by the state in which the track currently exists. The logical time that it takes to perform the evaluation is defined by the time_to_evaluate for that state. The controller can perform up to number_of_servers evaluations at a time. When it comes time to evaluate a state for a given track, it is determined if a server is available to perform the evaluation. If a server is available, it is marked busy for the time_to_evaluate and will perform the actual rule evaluation at the completion of the interval (thus simulating the thinking process) and schedule the next evaluation. If a server is not available then it is put on a pending queue for evaluation by the next server that becomes available.

## Type: WSF_DIRECTION_FINDER_PROCESSOR

**Derives From:** `WSF_LINKED_PROCESSOR`

### Overview

`WSF_DIRECTION_FINDER_PROCESSOR` is a specialized processor that is used to fuse multiple bearing-only tracks (e.g., from one or more passive systems). This function is somewhat different from the standard WSF "default" fusion. Usually track data are filtered first, then fused. In this case the raw bearing track data must be fused to form location and location error data, then the filtering takes place. The products of the direction-finder processor are fused-filtered tracks with valid, triangulated target location.

This filtering is necessary in order to reduce the triangulation error to actionable values. As pairs of reports are run through the triangulation algorithm, the error in the location goes down as the square root of the number of pairs accumulated.

Typically this processor would be the consumer of track reports from a bearing-only sensor.

### Syntax

```wsf
processor <name> WSF_DIRECTION_FINDER_PROCESSOR
   ... WSF_LINKED_PROCESSOR Commands ...
   fuse_all_measurements | fuse_all_collects
   measurement_replacement_interval | collect_replacement_interval
   maximum_expected_error
   use_truth_altitude
   filter
   filter_bypass
   maximum_time_difference
   minimum_baseline_distance
   test
end_processor
```

### Commands

#### fuse_all_measurements / fuse_all_collects

**Syntax:** `fuse_all_measurements` or `fuse_all_collects <boolean-value>`

If enabled, all measurements for a given target will be used for direction finding. Otherwise if the expected value of the location error, after the pair are utilized, is greater than the current value, the pair will not be fused.

**Default:** disabled

#### measurement_replacement_interval / collect_replacement_interval

**Syntax:** `measurement_replacement_interval` or `collect_replacement_interval <time-value>`

Specifies a time interval after which an existing measurement that has not been used for direction finding, will be updated with a more recent measurement.

**Default:** 1.0e+12 (Infinite)

#### maximum_expected_error

**Syntax:** `maximum_expected_error <length-value>`

Specifies a maximum value in a single dimension, that the expected direction-finding error value should not exceed.

**Default:** 100000 m

#### use_truth_altitude

**Syntax:** `use_truth_altitude <boolean-value>`

Specifies that the actual altitude should be used when reporting the locations of air targets.

**Default:** disabled

#### filter

**Syntax:** `filter ... end_filter`

Associates a filter type with this processor. All incoming tracks that have no filter, will be assigned this type. If this command isn't indicated, a WsfKalmanFilter type will be used.

**Default:** WsfKalmanFilter w/zero process noise

#### filter_bypass

**Syntax:** `filter_bypass <flag>`

Allows bypassing the filter, such that the output will be the 'measurement', which is just the intersection point from a successful triangulation.

**Default:** filter enabled

#### minimum_baseline_distance

**Syntax:** `minimum_baseline_distance <length-value>`

Specifies the minimum distance between origin locations of pairs of measurements being fused.

**Default:** 10 km

#### maximum_time_difference

**Syntax:** `maximum_time_difference <time-value>`

Specifies the maximum time difference allowed between measurements. Measurements that exceed this time difference will not be fused. This helps reduce errors when the targets are moving. If this field is not included, there is no maximum time difference - all pairs will be fused, assuming all other things being equal.

**Default:** 1.0e+12 (Infinite)

#### test

**Syntax:** `test <boolean-value>`

Enable output of diagnostic messages and a WsfDraw-based representation of each direction-finding solution. Diagnostic messages are output when candidate direction finding solutions fail due to the following:

- Angle threshold test failure: The interior angle formed by the two candidate target vectors is less than five times the maximum expected azimuth error of the two measurements. This test rejects solutions with very large uncertainties in range.
- Baseline distance test failure: The distance between the origin of the two measurement positions is less than that specified by the minimum_baseline_distance command.
- Bearing lines divergence failure: The lines of bearing of the two measurements are divergent in the direction of the target.
- Maximum expected range error failure: The computed expected range error exceeded the value specified with the maximum_expected_error input.

WsfDraw-based visualization of solutions displays green lines along the track direction, red lines to indicate the extents of expected bearing errors, blue lines and points to show the extent of the errors of the computed 3D solutions, and a point to indicate the computed target location.
