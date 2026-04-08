# protocol

## Overview

A (comm) protocol is an abstract representation of a particular comm capability. It can provide or restrict functionality from the norm, and may alter many of the layer processes on the comm with which it is associated. Any activity that is defined within the logic of the comm model OSI 7-layer implementations may be modified to the extent of the protocol API. As such, every layer in all existing comm models in AFSIM query all attached protocols in the receive/send protocol stack during normal comm operation, giving each protocol an opportunity to modify the execution of message processing.

At a more general level, this allows capabilities to be defined external to the comm object, and added or removed as seen fit by the user. Any number of protocol types may be defined, but only one of each type can be used. Assuming that each protocol is compatible (dependent on the implementation), they can all function to the degree that they wish to cooperate (i.e. multiple transport layer protocols can't all control how a message is split into packets; one of them has to be primary).

Again, note that each comm should only have one of each type. In the current version of AFSIM, no protocols are used by default.

## Syntax

### Global Context

**Syntax:** `protocol <name-or-type> <base-type-name> ... end_protocol`

```wsf
protocol <name-or-type> <base-type-name>
...
end_protocol
```

### Comm and Comm Type Scope

**Syntax:** `add protocol <name-or-type> <base-type-name> ... end_protocol`

**Syntax:** `edit protocol <name> ... end_protocol`

**Syntax:** `delete protocol <name> end_protocol`

```wsf
add protocol <name-or-type> <base-type-name>
...
end_protocol

edit protocol <name>
...
end_protocol

delete protocol <name> end_protocol
```

## Type: WSF_COMM_PROTOCOL_IGMP

### Overview

`WSF_COMM_PROTOCOL_IGMP` is an emulation of basic multicasting capabilities provided in AFSIM. This protocol is not a routing protocol, and will not determine the correct path or the capability to send to any given destination or group, so it must be used with another routing protocol enabled for successful usage (such as the legacy protocol).

The multicast protocol allows comms to join multicast groups designated by an address in the appropriate range (224.0.0.0 to 239.255.255.255). Any subsequent transmission to an address will then be carried appropriately by any other multicast enabled routers to the appropriate destinations, limiting the number of messages spawned in the process.

Note that sending multicast not only requires this protocol available from the sender, but also the recipient, as well as any potential other comms who may route multicast messages. Other non-multicast enabled comms will simply "discard" the message, as they will not be able to resolve the address to an appropriate destination.

### Syntax

```wsf
protocol <name> WSF_COMM_PROTOCOL_IGMP

   join_multicast_group <address>

   leave_multicast_group <address>

   level_0_multicast

   level_1_multicast

   level_2_multicast

   join_delay <random-time-reference>

   leave_delay <random-time-reference>

end_protocol
```

### Commands

#### join_multicast_group

**Syntax:** `join_multicast_group <address>`

Adds this comm to the multicast group specified. Any messages sent to this address will attempt carrying the message to this comm, assuming no routing failures.

#### leave_multicast_group

**Syntax:** `leave_multicast_group <address>`

Removes this comm from the specified multicast group. Specifically intended to allow removal of indicated multicast group specification from derived comms.

#### level_0_multicast

**Syntax:** `level_0_multicast`

Indicates that this multicast protocol instance is of type 0, indicating no actual multicast support.

#### level_1_multicast

**Syntax:** `level_1_multicast`

Indicates that this multicast protocol instance is of type 1, indicating that this comm is capable of sending multicast messages, but cannot receive them.

#### level_2_multicast

**Syntax:** `level_2_multicast`

Indicates that this multicast protocol instance is of type 2, indicating that this comm has full multicast capabilities, and can both send and receive multicast messages.

This is the default setting for this protocol.

#### join_delay

**Syntax:** `join_delay <random-time-reference>`

Specifies the time required to join a multicast group, for more advanced modeling of network characteristics. This may also affect how other protocols who use multicast (such as OSPF) function, due to delayed propagation of multicast group data amongst routers. Future plans of script capabilities in joining and leaving multicast groups will be affected by this value.

**Default:** constant 0 script

#### leave_delay

**Syntax:** `leave_delay <random-time-reference>`

Specifies the time required to leave a multicast group, for more advanced modeling of network characteristics. This may also affect how other protocols who use multicast (such as OSPF) function, due to delayed propagation of multicast group data amongst routers. Future plans of script capabilities in joining and leaving multicast groups will be affected by this value.
