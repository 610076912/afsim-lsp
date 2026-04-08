# antenna_pattern

## Overview

antenna_pattern is used in `transmitter` and `receiver` commands to define the gain of an antenna for communication and sensor devices.

**\<pattern-name\>** Specifies the name of the antenna pattern.

**\<pattern-type-name\>** Specifies one of the Available Antenna Patterns:

- pattern_table
- uniform_pattern
- circular_pattern
- rectangular_pattern
- cosecant_squared_pattern

## Syntax

```wsf
antenna_pattern <pattern-name>
   <pattern-type-name>
      Common Commands
      ... Available Antenna Patterns Commands ...
end_antenna_pattern
```

## Common Commands

The following commands can be used in any of the antenna pattern definitions:

### minimum_gain
**Syntax:** `minimum_gain <db-ratio-value>`

The minimum gain that will be returned.

**Default:** -300 db

### gain_adjustment
**Syntax:** `gain_adjustment <db-ratio-value>`

An adjustment factor to be applied to the raw gain. This is especially useful if one wants to reuse a pattern that has been defined by a file (such as the pattern_table) and simply scale the definition.

**Default:** 1.0 (no adjustment)

> **Note:** This gain_adjustment AND gain_adjustment_table can be used together. The results are additive in logarithmic space (multiplicative in linear space).

### gain_adjustment_table
**Syntax:** `gain_adjustment_table ... end_gain_adjustment_table`

This command provides the means to define a frequency-dependent adjustment to the gain. The points define a curve on a plot whose x-axis is the log_10 of the frequency and the y-axis is adjustment factor in dB. Linear interpolation is used to derive the values for intermediate frequencies. Signals whose frequencies are outside the range of the table use the value from the appropriate endpoint (i.e., extrapolation is not performed).

The format of the table is:

```wsf
gain_adjustment_table
   frequency <frequency-value> <db-ratio-1>
   frequency <frequency-value> <db-ratio-2>
   ...
   frequency <frequency-value> <db-ratio-n>
end_gain_adjustment_table
```

The following rules must be observed:

- The entries must be in order monotonically increasing frequency.
- There must be at least two entries, except that if no entries are provided then it is treated as though the table is not provided.

> **Note:** This gain_adjustment AND gain_adjustment_table can be used together. The results are additive in logarithmic space (multiplicative in linear space).

## Available Antenna Patterns

### Azimuth/Elevation Table (pattern_table)

```wsf
antenna_pattern <pattern-name>
   pattern_table
      # Azimuth-elevation Table Definition

      azimuth_beamwidth <angle-value>
      elevation_beamwidth <angle-value>

      # Common Commands

      minimum_gain <db-ratio-value>

      gain_adjustment <db-ratio-value>
      gain_adjustment_table ... end_gain_adjustment_table
end_antenna_pattern
```

Defines a pattern using any of the standard Azimuth-elevation Table Definition formats.

#### azimuth_beamwidth
**Syntax:** `azimuth_beamwidth <angle-value>`

Defines the width of the beam in azimuth.

**Default:** none - must be provided

#### elevation_beamwidth
**Syntax:** `elevation_beamwidth <angle-value>`

Defines the width of the beam in elevation.

**Default:** none - must be provided

### Uniform or Constant Pattern (uniform_pattern)

```wsf
antenna_pattern <pattern-name>
   uniform_pattern
      peak_gain <db-ratio-value>
      azimuth_beamwidth <angle-value>
      elevation_beamwidth <angle-value>

      # Common Commands

      minimum_gain <db-ratio-value>
      gain_adjustment <db-ratio-value>
      gain_adjustment_table ... end_gain_adjustment_table
end_antenna_pattern
```

Defines a pattern whose gain is the peak_gain within the specified beamwidth limits and minimum_gain everywhere else.

#### peak_gain
**Syntax:** `peak_gain <db-ratio-value>`

Defines the peak gain of the antenna referenced to a perfect isotropic antenna.

**Default:** 1 db

#### azimuth_beamwidth
**Syntax:** `azimuth_beamwidth <angle-value>`

Defines the width of the beam in azimuth.

**Default:** 180 deg

#### elevation_beamwidth
**Syntax:** `elevation_beamwidth <angle-value>`

Defines the width of the beam in elevation.

**Default:** 90 deg

### Circular sine(x)/x Pattern (circular_pattern)

```wsf
antenna_pattern <pattern-name>
   circular_pattern
      peak_gain <db-ratio-value>
      beamwidth <angle-value>

      # Common Commands

      minimum_gain <db-ratio-value>
      gain_adjustment <db-ratio-value>
      gain_adjustment_table ... end_gain_adjustment_table
end_antenna_pattern
```

Defines a sine(x)/x pattern with circular symmetry.

#### peak_gain
**Syntax:** `peak_gain <db-ratio-value>`

Defines the peak gain of the antenna referenced to a perfect isotropic antenna.

**Default:** 1 db

#### beamwidth
**Syntax:** `beamwidth <angle-value>`

Defines the half-power beamwidth (The angle subtended by points at which the gain becomes one-half the peak gain).

### Rectangular sine(x)/x Pattern (rectangular_pattern)

```wsf
antenna_pattern <pattern-name>
   rectangular_pattern
      peak_gain <db-ratio-value>
      azimuth_beamwidth <angle-value>
      elevation_beamwidth <angle-value>

      # Common Commands

      minimum_gain <db-ratio-value>
      gain_adjustment <db-ratio-value>
      gain_adjustment_table ... end_gain_adjustment_table
end_antenna_pattern
```

Defines a sine(x)/x pattern where the azimuth and elevation beamwidths do not have to be the same.

#### peak_gain
**Syntax:** `peak_gain <db-ratio-value>`

Defines the peak gain of the antenna referenced to a perfect isotropic antenna.

**Default:** 1 db

#### azimuth_beamwidth
**Syntax:** `azimuth_beamwidth <angle-value>`

Defines the half-power beamwidth in azimuth (The angle subtended by points at which the gain becomes one-half the peak gain).

#### elevation_beamwidth
**Syntax:** `elevation_beamwidth <angle-value>`

Defines the half-power beamwidth in elevation (The angle subtended by points at which the gain becomes one-half the peak gain).

### Cosecant Pattern (cosecant_squared_pattern)

```wsf
antenna_pattern <pattern-name>
   cosecant_squared_pattern
      peak_gain <db-ratio-value>
      azimuth_beamwidth <angle-value>
      elevation_beamwidth <angle-value>
      minimum_elevation_for_peak_gain <angle-value>
      elevation_of_peak/csc2_boundary <angle-value>
      maximum_elevation_for_csc2 <angle-value>

      # Common Commands

      minimum_gain <db-ratio-value>
      gain_adjustment <db-ratio-value>
      gain_adjustment_table ... end_gain_adjustment_table
end_antenna_pattern
```

Defines an antenna pattern that will:

- Use a sin x/x pattern for elevation angles less than minimum_elevation_for_peak_gain.
- Use the peak gain from [minimum_elevation_for_peak_gain, elevation_of_peak/csc2_boundary]
- Use a csc^2 pattern from [elevation_of_peak/csc2_boundary, maximum_elevation_for_csc2]
- Use a sin x/x pattern for angles above maximum_elevation_for_csc2.

#### peak_gain
**Syntax:** `peak_gain <db-ratio-value>`

Defines the peak gain of the antenna referenced to a perfect isotropic antenna.

**Default:** 1.0 db

#### azimuth_beamwidth
**Syntax:** `azimuth_beamwidth <angle-value>`

Defines the half-power beamwidth in azimuth (The angle subtended by points at which the gain becomes one-half the peak gain). This is used to determine the azimuth-dependent portion of the gain.

#### elevation_beamwidth
**Syntax:** `elevation_beamwidth <angle-value>`

Defines the half-power beamwidth in elevation (The angle subtended by points at which the gain becomes one-half the peak gain). This is used to determine the elevation-dependent portion of the gain when the elevation angle is above or below the cosecant_squared region.

#### minimum_elevation_for_peak_gain
**Syntax:** `minimum_elevation_for_peak_gain <angle-value>`

Defines the minimum elevation angle for the peak_gain value.

> **Note:** A non-zero value result in issues for radars which slew or scan using a non-peak gain at 0 degrees, i.e. the elevation cueing/scanning angle.

#### elevation_of_peak/csc2_boundary
**Syntax:** `elevation_of_peak/csc2_boundary <angle-value>`

Defines the elevation angle for the peak cosecant-squared boundary value.

#### maximum_elevation_for_csc2
**Syntax:** `maximum_elevation_for_csc2 <angle-value>`

Defines the maximum elevation angle for the peak_gain value.
