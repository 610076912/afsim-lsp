# error_model

## Syntax

```wsf
error_model <derived-name> <base-name>
   ... Input for the error model ...
end_error_model
```

## Overview

error_model can be used to create configured *error models* that can be referenced in the definition of a predefined sensor type. *<derived-name>* is the name by which the user wishes to refer to the configured error model. *<base-name>* is one of the Available Error Models:

- none
- standard_sensor_error
- radar_sensor_error
- absolute_sensor_error

## Effective Use Of Error Models

An error model definition may be embedded directly in the definition of a radar. For example, assume you have a file called 'ex_radar.txt':

```wsf
sensor EX_RADAR WSF_RADAR_SENSOR
   transmitter
      ... transmitter commands ...
   end_transmitter
   receiver
      ... receiver commands ...
   end_receiver
   error_model <base-name>
      ... error model commands ...
   end_error_model
end_sensor
```

The problem with this method is that one must modify the radar definition to change or eliminate the error model. In many production uses this is undesirable or infeasible. What would be more desirable is to provide a 'default' error model definition that can be overridden.

The new 'ex_radar.txt' would now contain:

```wsf
# Define the 'default' error model
error_model EX_RADAR_ERROR <base-name>
   ... error model commands ...
end_error_model

sensor EX_RADAR WSF_RADAR_SENSOR
   transmitter
      ... transmitter commands ...
   end_transmitter
   receiver
      ... receiver commands ...
   end_receiver
   error_model EX_RADAR_ERROR    # References the error model symbolically
end_sensor
```

Then to override the error model:

```wsf
#include ex_radar.txt

# Provide a new definition that overrides the existing definition.
# This example disables error calculations.

error_model EX_RADAR_ERROR none
end_error_model
```

The radar model will use the **last** definition of EX_RADAR_ERROR when it finally creates instances of the radar in the simulation.

## Available Error Models

### none

A 'dummy' error model that is the equivalent of no error.

```wsf
error_model <derived-name> none
end_error_model
```

### standard_sensor_error

A 'standard' error model that uses the `sensor_mode.azimuth_error_sigma`, `sensor_mode.elevation_error_sigma`, `sensor_mode.range_error_sigma` and `sensor_mode.range_rate_error_sigma` to calculate the error values.

```wsf
error_model <derived-name> standard_sensor_error
end_error_model
```

### radar_sensor_error

A 'radar sensor' error model that uses the beam errors specified by the receiver/transmitter data, e.g. beamwidths and bandwidths or the `WSF_RADAR_SENSOR.error_model_parameters` block overrides.

> **Warning:** Sensor type must be a `WSF_RADAR_SENSOR`.

```wsf
error_model <derived-name> radar_sensor_error
end_error_model
```

### absolute_sensor_error

An 'absolute' error model that defines a one standard deviation absolute position error measurement in two or three dimensions about the sensor detection target.

```wsf
error_model <derived-name> absolute_sensor_error
end_error_model
```

#### 2d_position_error_sigma <length-value>

Specify a one standard deviation position error to be applied to the track location in North and East directions about the sensor detection target. Applying this error will result in 68% of track position measurements being within a circle of radius `<length-value>` centered on the target's truth position. Target altitude will be reported without error.

#### 3d_position_error_sigma <length-value>

Specify a one standard deviation position error to the track in the NED (North, East, and Down) directions about the sensor detection target. Applying this error will result in 68% of track position measurements being within a sphere of radius `<length-value>` centered on the target's truth position.
