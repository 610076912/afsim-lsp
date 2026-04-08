# Comm

**Script Class:** `WsfComm`

## Overview

A comm object represents a device over which messages can be sent between platforms.

The following commands are available for all comm devices, but they are not necessarily used by all comm models, or in the case of the router specific commands, on all protocol implementations.

## Syntax

```wsf
comm <name-or-type> <base-type-name>
   ... Platform_Part_Commands ...
   ... Articulated_Part_Commands ...
   ... protocol Commands ...
   ... medium Commands ...

   # Common Device Characteristic Commands

   transmit_mode [ intermittent | continuous ]
   modifier_category <category-name>

   # Common Datalink Commands

   channels <integer-value>
   queue_type [ fifo | lifo | priority ]
   queue_limit <queue-limit>
   purge_interval <time-value>
   retransmit_attempts <integer-value>
   retransmit_delay <time-value>

   # Common Router Association Commands

   router_name <router-name>
   gateway <platform-name> <comm-name>

   # Common Network Addressing Commands

   network_name [ <network-name>  | <local:master> | <local:slave> ]
   network_address <address>
   address <address>
   link <platform-name> <comm-name>
   local_link <comm-name>
   link_address <address>

   # Common Physical Layer Commands

   propagation_speed <random-speed-reference>
   transfer_rate <random-data-rate-reference>
   packet_loss_time <random-time-reference>

   # Frequency Selection Commands

   frequency_select_delay <time-value>

end_comm
```

## Common Device Characteristic Commands

### transmit_mode

**Syntax:** `transmit_mode [ intermittent | continuous ]`

Defines if the device transmits intermittently or continuously. This is currently applicable only to devices that transmit over the air (e.g., `WSF_RADIO_TRANSCEIVER`). **intermittent** indicates the device radiates only when a message is actually being transmitted. **continuous** indicates the device radiates as long as it is 'on'. **continuous** would be used to model systems such as television or radio broadcast stations.

This is used by `WSF_PASSIVE_SENSOR` to determine the mechanism to be used for detecting signals from this device.

**Default:** intermittent

### modifier_category

**Syntax:** `modifier_category <category-name>`

The category that maps to the attenuation value defined in the `zone_set`. Setting this value tells the communications device to evaluate zones for attenuation.

## Common Datalink Commands

The following commands are typically available for usage via the datalink protocol, which in the simulation context is used to handle the scheduling and delivery of messages.

### channels

**Syntax:** `channels <integer-value>`

Specify the number of channels available to this comm. This value is intended to represent the number of simultaneous transmissions (multiplexing) the comm is able to support, per its hardware definition. This value is used by the datalink layer to determine how many concurrent messages the datalink layer will forward to the physical layer for transmission.

Note that this value is not related in any way to the medium definition of channel capability. As such, if the number of channels available to the comm hardware definition exceeds those available for the medium being used for transmission, the extraneous messages will fail transmission and ultimately return to the datalink layer for potential retransmission (if indicated to do so). It is highly suggested that the user provide values for retransmit_attempts and retransmit_delay if not using the default number of channels.

**Default:** 1 (channel)

### queue_type

**Syntax:** `queue_type [ fifo | lifo | priority ]`

Specify the queuing methodology for the device's transmit queue.

- **fifo** (first in first out)
- **lifo** (last in first out)
- **priority** (highest priority is the first out)

**Default:** fifo

### queue_limit

**Syntax:** `queue_limit <queue-limit>`

Specify the maximum size of the transmit queue. If the queue grows to the maximum size, subsequent messages are dropped.

**Default:** -1 (infinite)

### purge_interval

**Syntax:** `purge_interval <time-value>`

Indicates a period of time in which messages will be removed from the queue (dropped). Once the queue begins filling with pending messages for transmission, this value will be used to determine how long the messages are retained before being removed from the queue.

**Default:** 0 (no purging of messages)

### retransmit_attempts

**Syntax:** `retransmit_attempts <integer-value>`

Indicates the number of times a message will attempt transmission before being purged from the queue (dropped).

**Default:** 0 (no retransmit attempts)

### retransmit_delay

**Syntax:** `retransmit_delay <time-value>`

Indicates the amount of time to wait between attempts to send a message from the queue after a previously failed attempt. Take care when using this value with the purge_interval, as if the purge_interval is shorter than the retransmit_delay, messages may be purged before attempting retransmit.

**Default:** 0 (no delay between transmission attempts)

## Common Network Addressing Commands

These commands are used to define the address of a comm. By extension, an address also defines network membership of a comm object. Finally, these commands may also define the connectivity (external to default connectivity behavior) of comm objects to other comm objects for the purpose of message routing. Support for usage of explicit and static linking commands depends on the protocol implementation.

> **Warning:** It is recommended to use static addressing of communication devices by explicitly specifying the address of comms sharing a network across distributed simulations.

### network_name

**Syntax:** `network_name [ <network-name> | <local:master> | <local:slave> ]`

Define the network name that this device belongs to. Network names are strings that map directly to a value used to generate a 32-bit IPv4 address. The use of IPv4 does not infer that AFSIM is only capable of IP based communications, it is simply an internally consistent method to identify all comm objects in the simulation. Due to support for legacy AFSIM behavior, all comm devices on the same network are assumed to have connectivity to every other object in the same network at the beginning of the simulation with default settings (mesh network topology).

Communication to other comm objects not part of the same network require explicit definition of a link between the objects. If a comm object is not provided network membership or addressing via this command, the network_address command, or the address command, then the comm object is assumed to belong to a generic network in AFSIM referred to as the "default" network, and will be provided an address based on the first available, unused address.

> **Note:** The commands network_name, network_address, and address are exclusive. Only one of these should be used on any given comm.

The **\<local:master\>** and **\<local:slave\>** are special case network names used to create simple networks based on the explicit commander-subordinate relationships as defined by the commander keyword in platform definition.

Example:

```wsf
# Creates a network named master:CMDR
platform CMDR WSF_PLATFORM
   add comm name <Predefined_Comm_Types>
      network_name <local:master>
   end_comm
end_platform
platform SUB-1 WSF_PLATFORM
   commander CMDR
   add comm name <Predefined_Comm_Types>
      network_name <local:slave>
   end_comm
end_platform
platform SUB-2 WSF_PLATFORM
   commander CMDR
   add comm name <Predefined_Comm_Types>
      network_name <local:slave>
   end_comm
end_platform
```

**Default:** default

### network_address

**Syntax:** `network_address <address>`

Define the device's network address. If the address provided belongs to an existing network, this comm device will join that network and be provided the lowest available address not currently assigned in that network. If the address is not currently managed by a network, a network will be created based on a combination of the parent platform and comm name (network-name = platform-name.comm-name) and this comm added to the first available address.

> **Note:** The commands network_name, network_address, and address are exclusive. Only one of these should be used on any given comm.

### address

**Syntax:** `address <address>`

The address command specifies a specific, user provided address for this comm device. If the address is managed by a network, this comm device will join that network - otherwise a new network will be created that is based on the name of the platform owning the comm device, and the comm device (e.g. platform-name.comm-name). Note that this command may fail and halt simulation input processing if the address provided is already utilized elsewhere, which can happen via use of dynamic addressing based on other objects being assigned addresses.

> **Note:** The commands network_name, network_address, and address are exclusive. Only one of these should be used on any given comm.

### link

**Syntax:** `link <platform-name> <comm-name>`

This command provides a communications link between this comm device and the device specified. Any number of links may be defined on any given comm object. This link is established both via truth in the network manager and locally as a perception-based link (for the legacy protocol only - other protocols MAY use this command on a case-by-case basis, but are not required to). Be mindful that links may be removed during the simulation if the comm implementation reports failed links for removal.

### local_link

**Syntax:** `local_link <comm-name>`

This command is equivalent to the link command for comms on the same platform. As such, only the linking comm name is required to establish this link, and is convenient for platform_type definitions where the platform name is not available in that context.

### link_address

**Syntax:** `link_address <address>`

This command performs the same actions as the link command above, except it uses a specific address to create the link to. This assumes that knowledge of the comm address is known at the time of input, as other addressing commands are dynamic in nature.

## Common Router Association Commands

These commands relate specifically to the comm interface and its relation to the router object.

### router_name

**Syntax:** `router_name <router-name>`

Specifies by name the router this comm is assigned to as an interface. Router must be located on the same platform instance as the comm.

**Default:** Use the default router available on every platform instance in AFSIM

### gateway

**Syntax:** `gateway <platform-name> <comm-name>`

Specifies the remote interface to be used as the gateway for this comm instance. Since AFSIM allows multiple links per comm interface, the exact destination interface must be specified for gateway usage. This value will only be used if this comm is designated as the gateway interface to be used by the router object.

**Default:** no gateway specification, no gateway usage

## Common Physical Layer Commands

These commands define the physical characteristics associated with the comm device, (not including the transmitter and receiver definitions).

### propagation_speed

**Syntax:** `propagation_speed <random-speed-reference>`

Sets the speed of message propagation. This is a pass-through command that defines the propagation speed for the medium associated with this comm object, provided for legacy compatibility.

This command is not available for usage in the context of the comm object if the user has explicitly specified a medium type. In such cases, the propagation_speed (if available depending on the medium type) must be defined via the medium definition.

**Default:** c (speed of light constant)

### transfer_rate

**Syntax:** `transfer_rate <random-data-rate-reference>`

Sets the amount of data that can be transmitted by this comm over a set period of time. Any message being sent by this comm uses this value for its transfer rate. Any uninitialized value for transfer_rate is interpreted to be instantaneous transfer for most comm implementations.

This command defines the maximum transfer rate available for the comm object based on its hardware model specification. Any subsequent explicit usage of the medium object may have its own unique value associated with a transfer rate. In such cases where these values differ, any subsequent transmission using this comm device is always the smaller of these two values.

**Default:** -1 (instantaneous transfer)

### packet_loss_time

**Syntax:** `packet_loss_time <random-time-reference>`

Sets a time that adds to the delay in every transmission by this comm. Although indicated as a delay due to packet loss, this value can be used to introduce a delay to the normal transmission time of any comm device for any reason, or an aggregate delay due to modelling multiple sources of transmission delay.

This command is not available for usage in the context of the comm object if the user has explicitly specified a medium type. In such cases, the packet loss time must be defined via the medium definition.

**Default:** 0 (no delay)

## Frequency Selection Commands

### frequency_select_delay

**Syntax:** `frequency_select_delay <time-value>`

Specifies the delay when selecting between alternate frequencies as defined on the transmitter.

**Default:** 0.0 seconds

## Type: WSF_COMM_TRANSCEIVER

### Overview

`WSF_COMM_TRANSCEIVER` provides a baseline perfect/wired implementation that is capable of both transmitting and receiving. If a communication device is required to transmit or receive only, the `WSF_COMM_XMTR` and `WSF_COMM_RCVR` types are available. Both of these types are special cases of the `WSF_COMM_TRANSCEIVER` type and therefore share the same commands.

This model is the baseline capability of communications in AFSIM. It has no additional capabilities beyond what is provided in the comm Commands, which is the typical set of capability provided in AFSIM.

### Syntax

```wsf
comm <name-or-type> WSF_COMM_TRANSCEIVER | WSF_COMM_XMTR | WSF_COMM_RCVR
   ... Platform_Part_Commands ...
   ... Articulated_Part_Commands ...
   ... comm Commands ...
end_comm
```

> **Note:** `WSF_COMM_XMTR` and `WSF_COMM_RCVR` are transmit-only and receive-only versions of `WSF_COMM_TRANSCEIVER`.

## Type: WSF_RADIO_TRANSCEIVER

### Overview

`WSF_RADIO_TRANSCEIVER` provides a baseline radio implementation that is capable of both transmitting and receiving using a transmitter and receiver. If a communication device is required to transmit or receive only, the `WSF_RADIO_XMTR` and `WSF_RADIO_RCVR` types are available. Both of these types are special cases of the `WSF_RADIO_TRANSCEIVER` type and therefore share the same commands.

### Syntax

```wsf
comm <name-or-type> WSF_RADIO_TRANSCEIVER | WSF_RADIO_XMTR | WSF_RADIO_RCVR
   ... Platform_Part_Commands ...
   ... Articulated_Part_Commands ...
   ... Antenna_Commands ...
   ... comm Commands ...
   ... transmitter ... end_transmitter
   ... receiver ... end_receiver
   snr_transfer_rate_table ...
   bit_error_probability ...
   error_correction ...
   bit_error_rate_ebno_table ...
end_comm
```

> **Note:** `WSF_RADIO_XMTR` and `WSF_RADIO_RCVR` are transmit-only and receive-only versions of `WSF_RADIO_TRANSCEIVER`.

### Commands

#### snr_transfer_rate_table

**Syntax:** `snr_transfer_rate_table <absolute-units> <data-rate-units> <SNR-value-1> <transfer-rate-value-1> ... end_snr_transfer_rate_table`

Specifies a table that maps signal-to-noise-ratio values to message transfer rates. The SNR-Transfer-Rate table will be interpolated. If a table is specified, the table transfer rate values will override the value used specified with the transfer_rate command.

> **Note:** SNR Transfer rate table is mutually exclusive with the Eb/No vs BER table. The last one specified will be used.

**Default:** none

Example:

```wsf
snr_transfer_rate_table
   dB bit/s
   0  100
   1  100
   2  90
   3  80
   4  40
   5  20
   55 10
   70 1
end_snr_transfer_rate_table
```

#### bit_error_probability

**Syntax:** `bit_error_probability <real-value>`

Optional parameter that defines the system designed bit error rate probability. It is used to pick the Eb/No values from the Eb/No v.s BER table. Must be greater than or equal to zero.

**Default:** 0.0

#### error_correction

**Syntax:** `error_correction <dbratio-value>`

Optional parameter that determines how much error correction will be applied when using Eb/No to calculate data rate. Must be between 0.0 and 1.0.

**Default:** 0 dB

#### bit_error_rate_ebno_table

**Syntax:** `bit_error_rate_ebno_table <absolute-units> <ratio-units> <BER-value-1> <Eb/No-value-1> ... end_bit_error_rate_ebno_table`

Optional table that defines the Energy per Bit to the Spectral Noise Density (Eb/No) vs. Bit Error Rate (BER). Used in conjunction with the bit_error_probability and error_correction to calculate the data transfer rate of the radio. When using this table Data Rate = SNR * Error Correction * (Bandwidth / Eb/No). The Bit-Error-Rate-EbNo-Table will be interpolated. If a table is specified, the table transfer rate values will override the value used specified with the transfer_rate command.

> **Note:** Units for the values in the table are optional and if not entered are assumed to be dimensionless for BER and dB for Eb/No.

> **Note:** Eb/No vs BER table is mutually exclusive with the SNR Transfer rate table. The last one specified will be used.

**Default:** none

Example:

```wsf
bit_error_rate_ebno_table
  0.00000001 12
  0.0000001  11.3
  0.000001   10.3
  0.00001    9.5
  0.0001     8.3
  0.001      6.5
  0.01       4.3
  0.1        0
end_bit_error_rate_ebno_table
```

## Type: WSF_COMM_XMTR_RCVR

See `WSF_COMM_TRANSCEIVER`.
