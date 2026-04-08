# medium

**Script Class:** `WsfCommMedium`

## Overview

A medium is an object based representation of the means by which a communications device propagates data to another communication device.

Mediums provide a definable user type that can be utilized by various objects within the AFSIM communications framework. Mediums define the limitations imposed on communications by their implementation, working in conjunction with the limitations defined by the communications model that uses the medium. For example, even though a communication device may utilize a maximum transfer_rate, that rate may be further limited by the medium being used, or other characteristics dynamic to the medium (such as the number of channels being utilized in multiplexing).

Mediums are unique in that they may be shared between multiple communication objects in AFSIM. As such, every communication device using a shared medium is restricted by the limitations of such a medium. For example, a medium shared between four comm devices may have four channels available for transmission. If one comm is using all four of those channels, all other comm devices cannot transmit until one or more of those channels are available for usage. Particular models may implement their own restrictions based on concepts such as interference, congestion, etc.

Because mediums are shared objects, they are only definable in the global context. Any utilization of a medium specific to a comm object (such as a router or a comm) must refer to a medium defined in the global context, and only refers to such a medium by its type name.

Mediums may also contain multiple modes, indicating different states associated with that medium. Using the AFSIM scripting language, the state used for any transmission may be modified during runtime to provide a dynamic method to change transmission characteristics. While any object in AFSIM is limited to a single medium object, that medium may have any number of modes available for usage.

## Syntax

### medium ... end_medium

```wsf
medium <name-or-type> <base-type-name>

   channels <integer-value>
   default_mode_name <mode-name>
   use_sharing <boolean-value>

   mode <mode-name>
      ...
   end_mode

   script string ModeOnTransmit ...

end_medium
```

Adding a medium to a valid communication framework object:

```wsf
comm <name> <type>   # or edit comm <name>
   add medium <type>
      ...
   end_medium
end_comm
```

Editing a medium object on a valid communication framework object:

```wsf
router <name> <type>   # or edit router <name>
   edit medium <type>
      ...
   end_medium
end_router
```

Deleting a medium object on a valid communication framework object:

```wsf
comm <name> <type>   # or edit comm <name>
   delete medium <type>
end_comm
```

Note that deleting a medium replaces the existing definition with the default medium type with default settings for this object.

## Commands

### channels

**Syntax:** `channels <integer-value>`

Defines the number of channels available to a medium, in other words, if multiplexing is available. The number of channels determines how many concurrent transmissions may be handled by this medium, and subsequently by all communication objects utilizing this medium.

**Default:** maximum integer value (no restriction on number of concurrent transmissions)

### default_mode_name

**Syntax:** `default_mode_name <mode-name>`

Specifies the default mode to be used for transmissions over this medium. Every medium has a default mode named as "default" using default values. Unless this command is used, the "default" mode will be used during typical medium processing. Note that the default mode may be modified by explicitly defining the "default" mode using the mode command.

**Default:** Use of the "default" mode

### use_sharing

**Syntax:** `use_sharing <boolean-value>`

By default, mediums are shared between every object that refers to a particular globally defined medium type. If use_sharing is indicated to be false, then this medium type definition will result in every usage of this medium instantiating their own instance. This allows the type definition to act as a simple template for each instance, while avoiding sharing the actual medium itself.

**Default:** true (mediums are shared)

### mode ... end_mode

**Syntax:** `mode <mode-name> ... end_mode`

The mode command is used to define an individual mode for this medium. It may be repeated any number of times, with the restriction that each mode must have a unique string name. The actual commands available for any given mode is determined by the medium type being used.

> **Note:** Every medium has a "default" mode. Any usage of typical mode commands outside of the mode block refers to the "default" mode.

### ModeOnTransmit (script)

```wsf
script string ModeOnTransmit(WsfCommMessage aMessage, WsfComm aTransmitter, WsfComm aReceiver)
...
end_script
```

Defines an optional script method that is invoked every time a message is attempting transmission over this medium. A user may specify the mode intended for transmission over this medium by returning the string identifier for the mode.

By returning an empty string when this method is called, or a mode name that does not exist, the medium will use the currently specified default mode for this message transmission.

## Type: WSF_COMM_MEDIUM_GUIDED

**Script Class:** `WsfCommMedium`, `WsfCommMediumModeGuided`

### Overview

`WSF_COMM_MEDIUM_GUIDED` is a generic guided medium type.

A guided medium is also sometimes referred as a bounded or wired medium. This medium provides basic medium capabilities typically associated with guided communication framework objects in previous versions of AFSIM.

This medium type is valid for the following communication object models in the AFSIM core.

* `WSF_COMM_RCVR` (WSF_COMM_TRANSCEIVER)
* `WSF_COMM_XMTR` (WSF_COMM_TRANSCEIVER)
* `WSF_COMM_TRANSCEIVER`
* `WSF_COMM_ROUTER`

### Syntax

```wsf
medium <name> WSF_COMM_MEDIUM_GUIDED
   ... medium Commands ...

   propagation_speed <random-speed-reference>
   transfer_rate <random-data-rate-reference>
   packet_loss_time <random-time-reference>

   mode <mode-name>
      propagation_speed <random-speed-reference>
      transfer_rate <random-data-rate-reference>
      packet_loss_time <random-time-reference>
   end_mode

end_medium
```

### Commands

#### propagation_speed

**Syntax:** `propagation_speed <random-speed-reference>`

Sets the speed of message propagation.

This command, when defined outside of a mode block, specifies the propagation speed for the "default" mode associated with the medium.

**Default:** c (speed of light constant)

#### transfer_rate

**Syntax:** `transfer_rate <random-data-rate-reference>`

Sets the amount of data that can be transmitted by this medium over a set period of time.

This command, when defined outside of a mode block, specifies the transfer rate for the "default" mode associated with this medium.

**Default:** -1 (instantaneous transfer)

#### packet_loss_time

**Syntax:** `packet_loss_time <random-time-reference>`

Sets a time that adds to the delay in every transmission over this medium. Although indicated as a delay due to packet loss, this value can be used to introduce a delay to the normal transmission time over the medium for any reason, or as an aggregate delay due to modeling multiple sources of transmission delay.

This command, when defined outside of a mode block, specifies the packet loss time for the "default" mode associated with this medium.

**Default:** 0 (no delay)

## Type: WSF_COMM_MEDIUM_UNGUIDED

**Script Class:** `WsfCommMedium`, `WsfCommMediumModeUnguided`

### Overview

`WSF_COMM_MEDIUM_UNGUIDED` is a generic unguided medium type.

An unguided medium is a type of medium not restricted by a physical medium, typically associated with the usage of electromagnetic radiation to convey a signal. This medium type provides a generic specification of an unguided medium that has typically been found in previous versions of AFSIM with certain model definitions.

This medium type is valid for the following communication object models in the AFSIM core.

* `WSF_RADIO_RCVR` (WSF_RADIO_TRANSCEIVER)
* `WSF_RADIO_XMTR` (WSF_RADIO_TRANSCEIVER)
* `WSF_RADIO_TRANSCEIVER`
* `WSF_COMM_ROUTER`

> **Note:** Currently, routers do not allow for hardware based definitions for the transmitter or receiver. Usage of the unguided medium for a router will currently use the transmitter/receiver capabilities of the comm device originating the message.

### Syntax

```wsf
medium <name> WSF_COMM_MEDIUM_UNGUIDED
   ... medium Commands ...
   ... WSF_COMM_MEDIUM_GUIDED Commands ...

   snr_transfer_rate_table ...
   bit_error_probability ...
   error_correction ...
   bit_error_rate_ebno_table ...

   mode <mode-name>
      ... WSF_COMM_MEDIUM_GUIDED Commands ...
      snr_transfer_rate_table ...
      bit_error_probability ...
      error_correction ...
      bit_error_rate_ebno_table ...
   end_mode

end_medium
```

### Commands

#### snr_transfer_rate_table

**Syntax:** `snr_transfer_rate_table <absolute-units> <data-rate-units> <SNR-value 1> <transfer-rate-value 1> ... end_snr_transfer_rate_table`

Specifies a table that maps signal-to-noise-ratio values to message transfer rates. The SNR-Transfer-Rate table will be interpolated. If a table is specified, the table transfer rate values will override the value specified with the `transfer_rate` command.

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

Optional parameter that defines the system designed bit error rate probability. It is used to pick the Eb/No values from the Eb/No vs. BER table. Must be greater than or equal to zero.

**Default:** 0.0

#### error_correction

**Syntax:** `error_correction <real-value>`

Optional parameter that determines how much error correction will be applied when using Eb/No to calculate data rate. Must be between 0.0 and 1.0. Units are assumed dB.

**Default:** 0 dB

#### bit_error_rate_ebno_table

**Syntax:** `bit_error_rate_ebno_table <absolute-units> <ratio-units> <BER-value 1> <Eb/No-value 1> ... end_bit_error_rate_ebno_table`

Optional table that defines the Energy per Bit to the Spectral Noise Density (Eb/No) vs. Bit Error Rate (BER). Used in conjunction with the bit_error_probability and error_correction to calculate the data transfer rate over the medium. When using this table Data Rate = SNR * Error Correction * (Bandwidth / Eb/No). The Bit-Error-Rate-EbNo-Table will be interpolated. If a table is specified, the table transfer rate values will override the value specified with the `transfer_rate` command.

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
