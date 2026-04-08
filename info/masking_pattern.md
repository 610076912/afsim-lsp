# masking_pattern

## Syntax

```wsf
masking_pattern <pattern-name>
   state <state-name> | default
      platform_factor
         ... Azimuth-elevation Table Definition ...
      part_factor
         ... Azimuth-elevation Table Definition ...
   state ...
end_masking_pattern
```

## Overview

`masking_pattern` defines a *masking pattern* for `comm` or `sensor` systems (i.e., those things that are based on `articulated_part`). A masking pattern is used to model the effects of structural obscuration. The masking pattern consists of one or more collections of azimuth/elevation tables where each collection defines the masking pattern that applies when the system is in a particular 'state'. A 'state' represents a condition such as 'bay-doors-open.'

The collection for a given state consists of either or both of a platform-relative table (platform_factor) and a part-relative table (part_factor). Each table is an azimuth/elevation table where the dependent value is a number in the range [0 .. 1]. The value represents the fraction of the signal that is passed. Typical values are 1 (no blockage) or 0 (complete blockage), but intermediate values may be used to represent angle-dependent reduction. If a table has both a platform_factor and a part_factor then the resulting fraction passed is the product of the two values.

Masking patterns are available for all of the core WSF sensors and communications devices.

## Commands

### pattern-name

The name to be given to the pattern. This is the name that is referenced by the `articulated_part.masking_pattern` on a `comm` or `sensor` device. A pattern may be redefined, with the last occurrence being used.

### state [ <state-name> | default ]

Indicates that the following table definition(s) will be used when the articulated part is in the state *<state-name>*. If **default** is specified then the subsequent table will be used if the articulated part is in a state that does not match any of the states defined in the signature.

If a **state** command is not specified, then the pattern has one table that applies to all states.

There are script commands in `WsfArticulatedPart` that allow the application to query (`WsfArticulatedPart.MaskingPatternState`) or modify (`WsfArticulatedPart.SetMaskingPatternState`) the masking pattern state.

### platform_factor

Indicates the following table defines a platform-relative masking pattern. The azimuth and elevation angles in the table are relative to the platform.

### part_factor

Indicates the following table defines a part-relative masking pattern. The azimuth and elevation angles in the table are relative to the part.

Part-relative tables are generally used when a turret-mounted system is employed and there is blocking structure attached to the turret.

## Example

The following table blocks everything from 20-30 degrees and 110-120 degrees out the right side.

```wsf
masking_pattern TEST_SENSOR_MASKING
   platform_factor
      inline_table none 10 2
                  -90.0 90.0
         -180.00    1.0  1.0
           19.99    1.0  1.0
           20.00    0.0  0.0
           30.00    0.0  0.0
           30.01    1.0  1.0
          109.99    1.0  1.0
          110.00    0.0  0.0
          120.00    0.0  0.0
          120.01    1.0  1.0
          180.00    1.0  1.0
        end_inline_table
end_masking_pattern

sensor TEST_SENSOR ...
   ...
   masking_pattern TEST_SENSOR_MASKING
   ...
end_sensor
```
