# propagation_model

## Syntax

```wsf
propagation_model <derived-name> <base-name>
   ... Input for the propagation model ...
end_propagation_model
```

## Overview

propagation_model is used to create configured *propagation models* that can be referenced in the `transmitter.propagation_model` block in a `transmitter` definition.

*<derived-name>* is the name you wish your configured propagation model to be assigned. *<base-name>* is one of the Available Propagation Models:

- none
- fast_multipath

## Effective Use Of Propagation Models

A propagation model definition may be embedded directly in the definition of a radar. For example, assume you have a file called 'ex_radar.txt':

```wsf
sensor EX_RADAR WSF_RADAR_SENSOR
   transmitter
      ... transmitter commands ...
      propagation_model fast_multipath
         ... fast_multipath model commands ...
      end_propagation_model
   end_transmitter
   receiver
      ... receiver commands ...
   end_receiver
end_sensor
```

The problem with this method is that one must modify the radar definition to change or eliminate the propagation model. In many production uses this is undesirable or infeasible. What would be more desirable is to provide a 'default' propagation model definition that can be overridden.

The new 'ex_radar.txt' would now contain:

```wsf
# Define the 'default' propagation model
propagation_model EX_RADAR_PROPAGATION fast_multipath
   ... fast_multipath model commands ...
end_propagation_model

sensor EX_RADAR WSF_RADAR_SENSOR
   transmitter
      ... transmitter commands ...
      propagation_model EX_RADAR_PROPAGATION # References the propagation model symbolically
   end_transmitter
   receiver
      ... receiver commands ...
   end_receiver
end_sensor
```

Then to override the propagation model:

```wsf
#include ex_radar.txt

# Provide a new definition that overrides the existing definition.
# This example now uses the none propagation model.

propagation_model EX_RADAR_PROPAGATION none
end_propagation_model
```

The radar model will use the **last** definition of EX_RADAR_PROPAGATION when it finally creates instances of the radar in the simulation.

## Available Propagation Models

### none

A 'dummy' propagation model that results in no effect.

```wsf
propagation_model <derived-name> none
end_propagation_model
```

### fast_multipath

The 'fast_multipath' model is an implementation of the method defined in 'Radar Range Performance Analysis, Lamont V. Blake, 1986, Artech House, Inc.'. It computes the effects of constructive or destructive interference due to the specular reflection of the signal off of a round, rough Earth. Two factors can be supplied to define the properties of the surface at the reflection point.

```wsf
propagation_model <derived-name> fast_multipath
   soil_moisture_fraction ...
   surface_roughness ...
end_propagation_model
```

### soil_moisture_fraction [ 0.0 .. 1.0 ]

Define the moisture content of the soil.

**Default:** 0.15

### surface_roughness <length-value>

Define the standard deviation of the variation in the height of the surface.

**Default:** 3.0 meters
