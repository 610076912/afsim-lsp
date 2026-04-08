# router_protocol

## Overview

A (router) protocol is an abstract representation of a particular router capability. It can provide or restrict functionality from the norm, and may alter how routers process messages during normal router operations.

Routers in AFSIM typically are referenced during both transmission and reception of a message. When a message is being sent, the router is queried to determine if a message can be sent to its destination, and the path (specifically, the next hop or comm interface) that a message should be forwarded (transmitted) to. During reception, the router usage is limited, but helps determine how a message is processed based on its destination, and whether that destination is the comm interface the message was received upon.

Router protocols are queried during all of these operations so that they may alter the normal processing of messages by the router, and to collect internal data specific to the protocol used for various routing operations.

As an example, the multicast protocol allows messages with multicast address destinations to be correctly identified, and allows the router to correctly identify which available interfaces should be used to forward the multicast message to other recipients. As such, this particular protocol may result in a single or many messages to be transmitted from a single message reception, which is not typical router behavior.

Only one instance of any type of router protocol should exist on any given router instance.

Several routing protocols are used by default in AFSIM to enable message routing and multicast capabilities.

## Syntax

### Global Context

**Syntax:** `router_protocol <name-or-type> <base-type-name> ... end_router_protocol`

```wsf
router_protocol <name-or-type> <base-type-name>
...
end_router_protocol
```

### Router and Router Type Scope

**Syntax:** `add router_protocol <name-or-type> <base-type-name> ... end_router_protocol`

**Syntax:** `edit router_protocol <name> ... end_router_protocol`

**Syntax:** `delete router_protocol <name> end_router_protocol`

```wsf
add router_protocol <name-or-type> <base-type-name>
...
end_router_protocol

edit router_protocol <name>
...
end_router_protocol

delete router_protocol <name> end_router_protocol
```

## Type: WSF_COMM_ROUTER_PROTOCOL_LEGACY

### Overview

`WSF_COMM_ROUTER_PROTOCOL_LEGACY` provides a generic routing capability that was present in previous versions of AFSIM. By default, it is added to every router instantiation in AFSIM. By default, this routing protocol works on truth based data provided by the simulation, thus any actual pathway to a destination is useable by the router, or in the case of EM comms (such as radio), that the destination is known for sending a message.

The protocol has no additional input at this time.

It is highly suggested that if using a more robust routing protocol, to remove this protocol from any comm, as any failure of routing typical to a more complicated and limited routing protocol will still succeed, as the legacy protocol will be queried for routing if all other protocols fail.

### Syntax

```wsf
router_protocol <name> WSF_COMM_ROUTER_PROTOCOL_LEGACY
end_router_protocol
```

## Type: WSF_COMM_ROUTER_PROTOCOL_MULTICAST

### Overview

`WSF_COMM_ROUTER_PROTOCOL_MULTICAST` provides a generic routing capability for multicast messaging. Specifically, this protocol allows the resolution of multicast messages to intended recipients, and ensures that messages are only forwarded and/or replicated as necessary to reach all potential recipients.

This protocol is a router protocol, but is NOT a routing protocol in the traditional sense. This protocol does not provide the routing logic for intended multicast group members, and relies on other protocols existing on the router to provide the routing for messages. As such, this protocol by itself must have an another protocol present on the router to provide routing or multicast message transmissions will not succeed.

Also note that this protocol allows the sending of multicast messages, but does not provide reception capabilities. Any interface intended to receive multicast messages must also have a method of identifying and accepting multicast messages such as those provided via the comm protocol `WSF_COMM_PROTOCOL_IGMP`.

This protocol has no additional input at this time.

### Syntax

```wsf
router_protocol <name> WSF_COMM_ROUTER_PROTOCOL_MULTICAST
end_router_protocol
```

## Type: WSF_COMM_ROUTER_PROTOCOL_RIPv2

### Overview

`WSF_COMM_ROUTER_PROTOCOL_RIPv2` is a routing protocol based on the Bellman-Ford algorithm, used by comm object routers to determine when updates are provided to other routers, as well as determining the routing path for a message sent through the AFSIM Communication framework. RIPv2 is designed for use with networks with a diameter no more than 15.

As with all routing protocols, use of this object is pertinent only to perceived/dynamic routing.

> **Note:** This protocol is provided in a beta state. Bugs or other issues may exist in this version.

### Syntax

```wsf
router_protocol <name> WSF_COMM_ROUTER_PROTOCOL_RIPv2

   update_interval <time-value>

   invalidation_timeout <time-value>

   garbage_collection_timeout <time-value>

   poisoned_reverse <boolean-value>

end_router_protocol
```

### Commands

#### update_interval

**Syntax:** `update_interval <time-value>`

Specifies how often a router will send an update to other routers. As specified for the RIPv2 spec (RFC 2543), this is base time. Each time an update is scheduled, the time can change by +/- 5 seconds.

**Default:** 30 seconds

#### invalidation_timeout

**Syntax:** `invalidation_timeout <time-value>`

The amount of time that must pass before a route is marked as inactive. Once a router has not been heard from for this amount of time, routes learned from that router are marked as inactive.

**Default:** 180 seconds

#### garbage_collection_timeout

**Syntax:** `garbage_collection_timeout <time-value>`

The amount of time that once a route has been marked as inactive, it will be purged from the routing table.

**Default:** 120 seconds

#### poisoned_reverse

**Syntax:** `poisoned_reverse <boolean-value>`

Specifies whether to use split horizon, or split horizon with poisoned reverse. Split horizon is a scheme for avoiding sending routes in updates to routers from which they were learned. Poisoned reverse includes such routes in updates, but sets their metrics to be unusable.

**Default:** on

## Type: WSF_COMM_ROUTER_PROTOCOL_OSPF

### Overview

`WSF_COMM_ROUTER_PROTOCOL_OSPF` provides a generic mission level routing capability similar to that provided by the OSPF protocol. This protocol supports the assignment of routers to "areas" in which detailed routing information is kept, while only carrying a summarized level of detail of potential recipient data in other areas.

This protocol works by generally sending periodic multicast messages that are received by other members of this protocol. This is used to dynamically detect new members, and detect the loss of other members. Data is distributed within areas, and also carried to others externally in this format. This messaging procedure is abstracted in its implementation.

When routing messages, if the recipient is in the local area, the message is directly routed to that member using a graph of area network state. If the recipient is known, but external to the area, this protocol always attempts to send the message to a defined "backbone" area. The backbone carries messages to any area, and all areas MUST be connected to the backbone.

Area connections are handled by defining certain comms as "border routers". The user must specify these routers by providing multiple area definitions as part of the protocol input.

Only one backbone can exist per connected OSPF autonomous system (AS). All areas must connect to this area.

For destinations of messages external to OSPF enabled routers, one or more routers sharing a connection with the desired external interfaces must have an alternative routing protocol available to correctly handle external routing of those messages. As such, any OSPF enabled router with any non-OSPF routing protocol is specified as an ASBR (autonomous system border router) that can send messages external to the OSPF AS. Messages destined external to OSPF use the optimal external path from an ASBR to select the best ASBR for usage, and then route internally to that ASBR using standard OSPF routing strategies.

Not all network topologies are compatible with OSPF. All members in an area must be connected. Loss of border routers will cause a loss of transmission capabilities, as is expected with this protocol. In addition, although connections may exist externally to the OSPF provided definition, this protocol will NOT use those connections to "route around" any missing border routers, as is intended.

Finally, OSPF typically uses a metric based on transmission capability of multiple interfaces available for sending messages when making routing decisions. This metric is defined by the transmission rate of any given route divided by 100 Mbps, with a minimum value of 1.0. The only metric value less than a 1.0 is instantaneous transmission rates, which use a metric value of 0.0 in determining the cost.

> **Note:** This protocol is provided in a beta state. Bugs or other issues may exist in this version.

> **Note:** This protocol is extremely taxing on simulation performance. It is highly suggested to increase the hello_interval time to the highest acceptable value to avoid the numerous multicast messages being sent at each interval, and avoiding assigning large number of comms to any specific area.

### Syntax

```wsf
router_protocol <name> WSF_COMM_ROUTER_PROTOCOL_OSPF

   ospf_area <address>

   remove_ospf_area <address>

   backbone <address>

   remove_backbone

   ospf_dr_priority <integer-value>

   hello_interval <random-time-reference>

   hold_timer <random-time-reference>

end_router_protocol
```

### Commands

#### ospf_area

**Syntax:** `ospf_area <address>`

Defines the area this comm/router belongs to in the OSPF AS. Multiple areas may be assigned if this member has a direct connection to another member in that area, defining this member as a "border router".

#### remove_ospf_area

**Syntax:** `remove_ospf_area <address>`

Removes an area defined for this protocol. Specifically provided for editing derived objects in input.

#### backbone

**Syntax:** `backbone <address>`

Defines the specified area as a backbone. This only has to be done on a protocol instance for this setting to be applied across an entire OSPF connected AS.

Only one backbone may be defined per connected OSPF AS. All other areas must connect to this area via border routers.

#### remove_backbone

**Syntax:** `remove_backbone`

This command removes the backbone specification for this protocol type or instance. Used in cases where a protocol type is inherited from, but the specified backbone setting is not wanted.

#### ospf_dr_priority

**Syntax:** `ospf_dr_priority <integer-value>`

Sets the priority for this router becoming the "designated router" or "backup designated router" (DR, BDR) for its network within an area. These routers hold all of the detailed routing data for a specific area as common points of communication for all other routers in the same network. This value must be positive, where a lower value indicates a higher priority. This value also affects subsequent re-selection of these routers dynamically at runtime. Any router entering a network and area does not preempt any already established DR or BDR, even if it has a higher priority.

**Default:** Maximum integer value

#### hello_interval

**Syntax:** `hello_interval <random-time-reference>`

Defines the amount of time between sending the OSPF heartbeat, the "hello" packet. If these are not received before the defined hold time, the router will be considered non-connected or non-functional and removed from network state data for routing purposes. In addition, this defines how soon a new member is detected, as this is also the method in which new members are detected.

A small value is added to this value to ensure these times are not exactly the same across the simulation, and ensure repeatability when this value is constant.

**Default:** constant 10 s

#### hold_timer

**Syntax:** `hold_timer <random-time-reference>`

Defines the amount of time that before a member is dropped if a hello packet is not received. Note that the default value allows multiple hello packet transmission windows before actually being dropped due to hold time. Ensure that this value is greater than the hello_interval to avoid dropping all members from network state knowledge.

A small value is added to this value to ensure these times are not exactly the same across the simulation, and ensure repeatability when this value is constant.

**Default:** constant 40 s

## Type: WSF_COMM_ROUTER_PROTOCOL_AD_HOC

### Overview

`WSF_COMM_ROUTER_PROTOCOL_AD_HOC` is a generic router protocol, providing user-defined script methods to define the behavior of the routing protocol. This protocol allows users to define the behaviors reflected in the network knowledge maintained in the router when changes are made to network state. Although intended to enable ad-hoc capabilities, it can also be used in any circumstance in which users want to define their own routing call implementation via a scripted interface.

This protocol is limited, for practical and performance reasons, to only consider changes in network state to the network membership of the comm interfaces assigned to the router. Changes external to these networks are not considered by this protocol.

Changes that do occur during runtime to one of the networks of interest to this protocol will call the corresponding script method to allow user-defined logic to execute, along with a corresponding return value to indicate the action to be taken regarding that event.

Time delays are also provided for most of the events this protocol monitors, to allow either constant or distribution-based delays in state updates. This is provided to emulate potential delays in acquiring notification of these events at the router due to typical network latency effects, delays in how a particular protocol being modeled distributes this data, etc.

> **Note:** This protocol can be performance intensive if the network(s) this protocol monitors for state changes contains many members, or if many routers with this protocol exist in the simulation simultaneously.

### Syntax

```wsf
router_protocol <name> WSF_COMM_ROUTER_PROTOCOL_AD_HOC

   comm_added_delay_time <random-time-reference>
   comm_removed_delay_time <random-time-reference>
   connection_added_delay_time <random-time-reference>
   connection_removed_delay_time <random-time-reference>

   script bool OnCommAdded ...
   script bool OnCommRemoved ...
   script bool OnConnectionAdded ...
   script bool OnConnectionRemoved ...
   script WsfAddress OnMessageRouting ...

end_router_protocol
```

### Commands

#### comm_added_delay_time

**Syntax:** `comm_added_delay_time <random-time-reference>`

Defines the delay to be taken between when a network being monitored adds a comm interface and when this protocol will execute the `OnCommAdded` script method, potentially adding an interface to the network state graph.

**Default:** No delay (constant 0 s)

#### comm_removed_delay_time

**Syntax:** `comm_removed_delay_time <random-time-reference>`

Defines the delay to be taken between when a network being monitored removes a comm interface and when this protocol will execute the `OnCommRemoved` script method, potentially removing an interface on the network state graph.

Note that this method only handles the removal of the node itself, and not the connections that relied on that node's existence.

**Default:** No delay (constant 0 s)

#### connection_added_delay_time

**Syntax:** `connection_added_delay_time <random-time-reference>`

Defines the delay to be taken between when a network being monitored adds a link or connection and when this protocol will execute the `OnConnectionAdded` script method, potentially adding a connection to the network state graph.

**Default:** No delay (constant 0 s)

#### connection_removed_delay_time

**Syntax:** `connection_removed_delay_time <random-time-reference>`

Defines the delay to be taken between when a network being monitored removes a link or connection and when this protocol will execute the `OnConnectionRemoved` script method, potentially removing a connection from the network state graph.

**Default:** No delay (constant 0 s)

#### OnCommAdded (script)

```wsf
script bool OnCommAdded(WsfAddress aAddedComm, WsfCommGraph aNetworkState, WsfCommRouter aRouter)
...
end_script
```

Defines an optional script that is invoked (after delays) when a comm interface is added. This is only invoked when the interface being added shares a network with one of the interfaces on the router this protocol belongs to, or pertains directly to one of the router interfaces.

A boolean value **MUST** be returned from this script indicating whether the protocol should add this interface to its network state graph (true) or should not take any action (false).

#### OnCommRemoved (script)

```wsf
script bool OnCommRemoved(WsfAddress aAddedComm, WsfCommGraph aNetworkState, WsfCommRouter aRouter)
...
end_script
```

Defines an optional script that is invoked (after delays) when a comm interface is removed. This is only invoked when the interface being removed shares a network with one of the interfaces on the router this protocol belongs to, or pertains directly to one of the router interfaces.

A boolean value **MUST** be returned from this script indicating whether the protocol should remove this interface from its network state graph (true) or should not take any action (false).

#### OnConnectionAdded (script)

```wsf
script bool OnConnectionAdded(WsfAddress aSourceComm, WsfAddress aDestinationComm, WsfCommGraph aNetworkState, WsfCommRouter aRouter)
...
end_script
```

Defines an optional script that is invoked (after delays) when a connection is added. This is only invoked when **one** of the involved interfaces (either the source or destination) shares a network with one of the interfaces on the router this protocol belongs to.

A boolean value **MUST** be returned from this script indicating whether the protocol should add this connection to its network state graph (true) or should not take any action (false).

#### OnConnectionRemoved (script)

```wsf
script bool OnConnectionRemoved(WsfAddress aSourceComm, WsfAddress aDestinationComm, WsfCommGraph aNetworkState, WsfCommRouter aRouter)
...
end_script
```

Defines an optional script that is invoked (after delays) when a connection is removed. This is only invoked when **one** of the involved interfaces (either the source or destination) shares a network with one of the interfaces on the router this protocol belongs to.

A boolean value **MUST** be returned from this script indicating whether the protocol should remove this connection from its network state graph (true) or should not take any action (false).

#### OnMessageRouting (script)

```wsf
script WsfAddress OnMessageRouting(WsfCommMessage aMessage, WsfAddress aInterface, WsfCommGraph aNetworkState, WsfCommRouter aRouter)
...
end_script
```

Defines an optional script that is invoked immediately when a message requires routing on an interface belonging to this protocol's router.

A `WsfAddress` **MUST** be returned from this script indicating the next hop address to forward this message. If a null address is provided (by not setting the address for the returned object) then this indicates that this protocol should drop the message and not attempt forwarding the message. Any other address will be used as the indicated forwarding address, and MUST be directly connected to the interface receiving the message (provided via the **aInterface** parameter).

Note that many of the details are provided to make most routing determinations, including the information provided directly from the message itself (traceroute, destination address, etc.) the current graph state (pathing), and the router itself.
