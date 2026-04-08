# radar_signature

## Syntax

```wsf
radar_signature <signature-name>
   use_bisector_for_bistatic <boolean-value>
   interpolate_tables <boolean-value>
   interpolation_type [linear | logarithmic]
   state <state-name> | default
      polarization [ horizontal | vertical | slant_45 | slant_135 | left_circular | right_circular | default ]
         frequency_limit <frequency-value>
            ... Azimuth-elevation Table Definition ...
         frequency_limit <frequency-value>
            ... Azimuth-elevation Table Definition ...

      polarization ...

      plt_file <file-name> ...

   state ...

end_radar_signature
```

## Overview

`radar_signature` defines the radar signature for a platform type. The radar signature is used when a radar sensor attempts to detect a platform. The radar signature consists of one or more sets of tables where each set defines the signature (as a function of polarization and frequency) that applies when the platform is in a particular 'state.' A 'state' represents a condition such as 'bay-doors-open.'

**<signature-name>** is the name to be given to the signature. If the name specifies the name of an existing definition then the new definition will replace the current one (i.e. the last occurrence will be used for the simulation.)

## Commands

### use_bisector_for_bistatic <boolean-value>

Specifies if a bistatic signature will be approximated for bistatic detection attempts.

- If **true**, the RCS will be determined using the bisector of the target-to-transmitter and target-to-receiver aspect angles.
- If **false**, the RCS will be determined using the target-to-receiver aspect angle.

**Default:** true

### interpolate_tables <boolean-value>

Specifies whether to apply interpolation to the defined Azimuth-elevation Table Definition. The type of interpolation can be either linear or logarithmic (see interpolation_type).

**Default:** true

### interpolation_type [linear | logarithmic]

Specifies whether to use linear or logarithmic interpolation when interpolating data in the azimuth elevation tables.

**Default:** linear

### state [ <state-name> | default ]

Indicates that the following table definitions will be used when the platform is in the signature state *<state-name>*.

If **default** is specified then the subsequent table(s) will be used if the platform is in a signature state that does not match any of the states defined in the signature.

If a **state** command is not specified, then the signature has one set of tables that applies to all signature states.

### polarization [ horizontal | vertical | slant_45 | slant_135 | left_circular | right_circular | default ]

Indicates that the following table(s) (up to the next **polarization** or **state**) are to be used when the sensing radar is operating with the specified polarization.

If **polarization** is omitted then the following table(s) (up to the next **state**) are applicable to any polarization.

### frequency_limit <frequency-value>

Indicates the upper frequency bound to which the following table applies. These must occur in increasing order within a single state/polarization grouping. For a radar operating with a particular polarization and frequency, the table selected will be the first one with the proper state and polarization where the frequency is less than **frequency_limit**.

If **frequency_limit** is omitted then the following table applies to all frequencies.

### plt_file <file-name> [default <horizontal | vertical>]

Loads a PLT file, in either 3- or 5-column format, that includes multiple Az/El table definitions indexed by polarization and frequency. Because the polarization and frequency are embedded within the file, any previous polarization or frequency_limit command will be ignored. Optionally, a polarization (horizontal or vertical) to be used as the default may be specified. However, since every state must have a **default** polarization, if this optional argument is omitted, one must be defined explicitly using the polarization command.

> **Note:** Only horizontal and vertical polarizations are currently accepted within the PLT file.

> **Note:** The frequencies specified in plt_files are center frequencies, not frequency limits. For an EM interaction at a specific frequency, the table will be chosen based on a frequency band about the center frequency, not based on frequency limits.

## Examples

Inline table:

```wsf
radar_signature AIRPLANE_RADAR_SIG
  state default
     inline_table dbsm 20 2
               -90.0  90.0
       -180.0    0.0   0.0
       -137.5    0.0   0.0
       -135.0   20.0  20.0
       -132.5    0.0   0.0
        -92.5    0.0   0.0
        -90.0   20.0  20.0
        -87.5    0.0   0.0
        -47.5    0.0   0.0
        -45.0   20.0  20.0
        -42.5    0.0   0.0
         42.5    0.0   0.0
         45.0   20.0  20.0
         47.5    0.0   0.0
         87.5    0.0   0.0
         90.0   20.0  20.0
         92.5    0.0   0.0
        132.5    0.0   0.0
        135.0   20.0  20.0
        137.5    0.0   0.0
        180.0    0.0   0.0
     end_inline_table
end_radar_signature
```
