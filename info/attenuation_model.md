# attenuation_model

## Syntax

```wsf
attenuation_model <derived-name> <base-name>
   ... Input for the attenuation model ...
end_attenuation_model
```

## Overview

attenuation_model is used to create configured *attenuation models* that can be referenced in the `transmitter.attenuation_model` block in a `transmitter` definition.

**<derived-name>** is the name you wish your configured attenuation model to be assigned. **<base-name>** is one of the Available Attenuation Models:

- none
- simple
- itu
- blake
- `WSF_TABULAR_ATTENUATION`

## Effective Use Of Attenuation Models

An attenuation model definition may be embedded directly in the definition of a radar. For example, assume you have a file called 'ex_radar.txt':

```wsf
sensor EX_RADAR WSF_RADAR_SENSOR
   transmitter
      ... transmitter commands ...
      attenuation_model itu
         ... itu model commands ...
      end_attenuation_model
   end_transmitter
   receiver
      ... receiver commands ...
   end_receiver
end_sensor
```

The problem with this method is that one must modify the radar definition to change or eliminate the attenuation model. In many production uses this is undesirable or infeasible. What would be more desirable is to provide a 'default' attenuation model definition that can be overridden.

The new 'ex_radar.txt' would now contain:

```wsf
# Define the 'default' attenuation model
attenuation_model EX_RADAR_ATTENUATION itu
   ... itu model commands ...
end_attenuation_model

sensor EX_RADAR WSF_RADAR_SENSOR
   transmitter
      ... transmitter commands ...
      attenuation_model EX_RADAR_ATTENUATION # References the attenuation model symbolically
   end_transmitter
   receiver
      ... receiver commands ...
   end_receiver
end_sensor
```

Then to override the attenuation model:

```wsf
#include ex_radar.txt

# Provide a new definition that overrides the existing definition.
# This example now uses the blake attenuation model.

attenuation_model EX_RADAR_ATTENUATION blake
end_attenuation_model
```

The radar model will use the **last** definition of EX_RADAR_ATTENUATION when it finally creates instances of the radar in the simulation.

## Available Attenuation Models

### none

A 'dummy' attenuation model that results in no effect.

```wsf
attenuation_model <derived-name> none
end_attenuation_model
```

### simple

This model provides a mechanism to specify either a constant specific attenuation (signal loss per unit length) or a constant factor (attenuation is always the same). This model is applicable when one has conditions which are relatively geometry independent and don't require the calculation of a more complex model. It is also applicable for some simple cases that may not be handled by other models.

Either one of the following can be specified:

#### specific_attenuation <value> <db-ratio-unit>/<length-unit>

Specifies the signal loss per unit length. This would be applicable where the paths are nearly parallel to the Earth's surface (such as in air-to-air where the participants are at approximately the same altitude).

This is loss factor (appears in the denominator) and is generally specified as a positive db/km (which results in a value greater than or equal to 1).

Example:

```wsf
specific_attenuation 0.001 db/km
```

#### attenuation_factor <db-ratio-value>

Specifies a constant multiplier (gain factor) of the signal value. The factor must be in the range [ 0 .. 1 ] in absolute units (a dB value less than zero). This option would be applicable where the geometry is fixed (or nearly so), such as communications between two ground stations or between a ground station and a geosynchronous satellite.

Example:

```wsf
attenuation_factor -3.0 db
```

### itu

This model determines the attenuation factor for RF signals with a frequency of 1-1000 GHz using the methods defined in the following recommendations from the International Telecommunications Union (ITU):

- ITU Recommendation ITU-R P.676-8, Attenuation by atmospheric gases
- ITU Recommendation ITU-R P.838-3, Specific attenuation model for rain for use in prediction methods
- ITU Recommendation ITU-R P.840-4, Attenuation due to clouds and fog

The contribution of attenuation due to rain is computed only if the `global_environment.rain_rate` is defined in the `global_environment`. If `global_environment.rain_altitude_limit` is not specified then it will use the lower value of `global_environment.cloud_altitude_limits`. If that value is not defined then it will use the value of 10000 meters.

The contribution of attenuation due to clouds or fog is computed if `global_environment.cloud_altitude_limits` and `global_environment.cloud_water_density` are defined in the `global_environment`.

The model integrates along the path through a series of 1 km thick layers of the Earth's atmosphere. The integration will not go above 30 km unless the rain or cloud altitude limits are higher, and the respective rain rate or cloud water density is provided. (The additional attenuation by atmospheric gases is negligible above 30 km).

### blake

This model determines the attenuation factor using the atmospheric absorption model written by L.V. Blake, Naval Research Laboratory. This is based on a family of 42 attenuation curves for frequencies between 100 MHz and 10 GHz and elevation angles between 0 and 10 degrees. The curves are flat beyond 300 nautical miles. These tables were published in 'Radar Systems Analysis, Section 15.1, David K. Barton, Artech Publishing.'

> **Note:** This selection is valid only where either the transmitter or the target are on (or are very near) the surface.

## Type: WSF_TABULAR_ATTENUATION

```wsf
attenuation_model <name-or-type> WSF_TABULAR_ATTENUATION
   attenuation ...
   adjustment_factor ...
   sort_end_points ...
   two_way_attenuation ...
   spectral_data_conversion ...
end_attenuation_model
```

`WSF_TABULAR_ATTENUATION` is an `attenuation_model` that allows the user to define attenuation using a table.

### attenuation <table-value>

Specifies a table that defines the attenuation values. The table must be a function of at least three independent variables:

- altitude, elevation_angle and slant_range
- altitude_1, altitude_2 and ground_range

It may additionally include 'frequency' as an additional independent variable.

**Default:** none (must be specified)

### adjustment_factor <value>

Specifies a multiplier to be applied to returned values. This would typically be used to account for the fact that values integrated over a wide band (i.e.: visual) represent an average that may include many 'dead-zones' that the sensor may exclude. Thus, the effective transmittance may be higher.

> **Note:** The return values are transmittance, so to increase transmittance specify a factor greater than one.

**Default:** 1.0 (no adjustment)

### sort_end_points <boolean-value>

Specifies end-points (source and target points) for a given interaction can be logically interchanged so the path goes from the highest object to the lowest object. This would be applicable if the attenuation values are independent of direction. This would allow a table to be computed for air-to-ground purposes to also be used for ground-to-air purposes.

**Default:** false

### two_way_attenuation <boolean-value>

Specifies if the table values represent two-way attenuation (transmitter-to-target-to-receiver).

**Default:** false (the table values represent one-way attenuation)

### spectral_data_conversion ... end_spectral_data_conversion

This command is used to convert spectral data produced by a program like MODTRAN into a form that can be used as input for the `attenuation` command.

This command is used separately from the actual run of a simulation that employs the model. For instance, one would first convert the file executing the following input within mission:

```wsf
attenuation_model CONVERT WSF_TABULAR_ATTENUATION
   spectral_data_conversion
      sensor_to_target_transmittance example_stt.plt
      output                         example.txt
   end_spectral_data_conversion
end_attenuation_model
```

The resulting converted data would then be used as an attenuation model in a sensor:

```wsf
attenuation_model EXAMPLE WSF_TABULAR_ATTENUATION
   attenuation file example.txt
end_attenuation_model
```

#### sensor_to_target_transmittance <filename>

Specifies the name of the file which contains the raw spectral sensor-to-target transmittance as a function of observer altitude and elevation angle and slant range to the target. Using the current processes, this file name will be of the form *\<filename\>_stt.plt*.

**Default:** none - this is required.

#### target_to_background_radiance <filename>

Specifies the name of the file which contains the raw spectral target-to-background radiance as a function of observer altitude and elevation angle and slant range to the target. Using the current processes, this file name will be of the form *\<filename\>_tbr.plt*.

If this file is NOT provided, the output will simply contain the integrated transmittance for each point. If the file is provided then the output will contain the 'line-of-sight atmospheric transmittance' or 'contrast transmittance' needed by some sensor models.

**Default:** none - the output contains the integrated transmittance.

#### spectral_response_curve ... end_spectral_response_curve

This defines the response of the sensor as a function of wavelength. The curve is defined as a series of points where each point is defined as:

```
wavelength response
```

where the first item is the wavelength (with units) and the second item is the response for that wavelength. The response must be in the range [0 .. 1]. At least two points must be specified and the points must be in monotonically ascending order of wavelength.

**Default:** Uniform response of 1.0 for all wavelengths contained in the input files

#### output <filename>

Specifies the name of the file to which the converted results are to be written. The file can be used as the argument for the `attenuation` command (See the example at the start of the section.)

**Default:** none - must be provided.
