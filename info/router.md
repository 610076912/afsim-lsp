# router

**Script Class:** `WsfCommRouter`

## Overview

A router object represents a device that provides the ability to determine if a message can be sent to its destination, and which path that message should take to reach its destination. It is associated uniquely with comm interfaces on the same platform that use the router instance when messages are sent and received.

Any number of routers may be used on a platform instance, but each comm may only be associated with a single router. This allows the usage of multiple routers with unique comm interfaces on every platform instance in AFSIM.

By default, every platform in AFSIM has a router, and unless specified, all comms will be assigned to this default router.

> **Note:** The default router has the name "default". If users want to override the default router settings, they simply need to define and assign a router to the platform using the same name, "default".

Default router behavior may be modified with the usage of `router_protocol` commands.

> **Note:** The router is required at this time to be on and operational upon instantiation in the simulation to support legacy communications behavior. The Platform_part_commands that initially disable the router are not currently supported, and will not affect the router object. However, usage of the `WsfPlatformPart` script methods that disable or turn off the router will still function. It is expected that these commands will be fully supported in AFSIM 3.0.

All comm interfaces assigned to a router with connections between those comms are considered bridged, in that communications can pass between them regardless of the comm model type and reception/transmission restrictions defined on the comm model. Thus, the router object assumes the capabilities previously provided directly via the comm bridge command.

## Syntax

### router ... end_router

```wsf
router <name-or-type> <base-type-name>
   ... Platform_part_commands ...
   ... router_protocol Commands ...
   ... medium Commands ...

   gateway_address <address>
   gateway <comm-name>
   hop_limit <integer-value>
   automated_interface_linking <boolean-value>
   use_default_protocol <boolean-value>
   use_multicast_protocol <boolean-value>

end_router
```

## Commands

### gateway_address

**Syntax:** `gateway_address <address>`

If provided, defines the particular interface associated with this router that should be used to forward messages if the router is unable to find a destination for a message received on one of the router's defined comm interfaces. The destination used for the selected comm gateway is defined on the comm itself.

This command provides a static addressing alternative to the gateway command, and only one of these commands should be used on any given router.

**Default:** No gateway address specification or usage.

### gateway

**Syntax:** `gateway <comm-name>`

If provided, defines the particular interface associated with this router that should be used to forward messages if the router is unable to find a destination for a message received on one of the router's defined comm interfaces. The destination used for the selected comm gateway is defined on the comm itself.

This command provides a dynamic addressing alternative to the gateway_address command, and only one of these commands should be used on any given router.

**Default:** No gateway specification or usage.

### hop_limit

**Syntax:** `hop_limit <integer>`

Specifies the number of nodes/comms that a message may visit on the way to the destination before the message is simply discarded. Often referred to as time to live (TTL). The hop_limit applies to any messages initiated from this router's interfaces. This value ensures that messages that may enter circular routing are eventually dropped.

**Default:** 64

### automated_interface_linking

**Syntax:** `automated_interface_linking <boolean-value>`

If set to true, all interfaces specified for this router will have connections created between members. This ensures that router interfaces are correctly represented as having direct connections to each other via the router hardware interface.

If set to false, no connections will be automatically created between members, and messages sent or received from any particular interface on the router may not be able to reach another interface on the same router.

> **Warning:** Some network types are not compatible with automated_interface_linking, and the user should not enable this setting if the network topology will be violated.

**Default:** false

### use_default_protocol

**Syntax:** `use_default_protocol <boolean-value>`

A convenience setting to determine if the router should use the default legacy routing protocol. True indicates to use this routing_protocol, false to remove it.

**Default:** true

### use_multicast_protocol

**Syntax:** `use_multicast_protocol <boolean-value>`

A convenience setting to determine if the router should use the default multicast routing protocol. True indicates to use this routing_protocol, false to remove it.

**Default:** true

## Type: WSF_COMM_ROUTER

### Overview

`WSF_COMM_ROUTER` provides a baseline router model for core AFSIM. It has no additional commands outside of those provided via the `router` input.

### Syntax

```wsf
router <name-or-type> WSF_COMM_ROUTER
   ... Platform_Part_Commands ...
   ... router Commands ...
end_router
```
