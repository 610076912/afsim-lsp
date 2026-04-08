# noise_cloud

## Syntax

```wsf
noise_cloud <name> <type>
   noise_frequency ...
   noise_octaves ...
   threshold ...
   scalar ...
   constant_height ...
   thickness ...
   use_global_wind
   origin ...
   sensor_modifier ...
   comm_modifier ...
end_noise_cloud
```

## Overview

The noise_cloud block defines a pseudo-random fractal noise cloud layer. This layer will attenuate `comm` and `sensor` devices. The `random_seed` will affect the population of the noise function. If a line-of-sight check hits a cloud, a penetration distance is returned, which in turn is used to calculate the attenuation of the device by the clouds. The base type is WSF_NOISE_CLOUD.

## Commands

### noise_frequency <value>

Specifies the number of posts defined in the noise function at the lowest octave. Higher noise frequency will result in more unique clouds in the function.

**Default:** 1

### noise_octaves <value>

Specifies the number of octaves defined in the noise function. Each octave adds higher frequency and lower amplitude noise to the noise function. Higher octaves will result in more fractal detail.

**Default:** 1

### threshold <value>

Specifies the threshold of a step function applied to the noise function. Every noise function point above the threshold will be considered cloud, and everything below will be clear sky.

**Default:** 0.5

### scalar <length-value>

The 3D noise function is cyclical. The scalar value will determine the frequency of the repetition.

**Default:** 10 km

### constant_height <length-value>

The constant_height determines how high above sea level the cloud layer will be set.

**Default:** 10 km

### thickness <length-value>

When a sensor or comm beam intersects a cloud in the layer, this value will be returned as the penetration length.

**Default:** 300 m

### use_global_wind

When this is set, the cloud layer will use the wind_speed and wind_direction defined in the `global_environment`.

### origin <latitude-value> <longitude-value>

Defines the wind origin for the cloud. The wind direction will be most correct around this location.

**Default:** 0n 0e

### sensor_modifier <name> <value>

This defines the attenuation effect of a cloud hit. `sensor` devices will indicate they will be attenuated by the cloud layer by using the modifier_category command in their definitions. The value is a number 0 - 1. The attenuation value is set up to be a percentage loss per meter within the zone.

### comm_modifier <name> <value>

This defines the attenuation effect of a cloud hit. `comm` devices will indicate they will be attenuated by the cloud layer by using the modifier_category command in their definitions. The value is a number 0 - 1. The attenuation value is set up to be a percentage loss per meter within the zone.
