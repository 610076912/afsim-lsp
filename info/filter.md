# filter

## Overview

A filter is an object that can be attached to a `track_manager` or a `sensor` to implement track filtering.

## Syntax

```wsf
# Define a filter type (occurs outside a track_manager or sensor block)

filter <name> <base-type>
    ... type-specific filter commands ...
end_filter

# Instantiate a filter object

platform ... (or platform_type)
   track_manager
      filter <filter-type>
         ... filter commands ...
      end_filter
   end_track_manager
end_platform

sensor ...
   filter <filter-type>
      ... filter commands ...
   end_filter
end_sensor
```

## Commands

Commands vary by filter type. See the predefined filter types below for specific commands.

## Type: WSF_ALPHA_BETA_FILTER

```wsf
filter <name> WSF_ALPHA_BETA_FILTER
   ... Commands ...
end_filter
```

Defines an alpha-beta filter for filtering tracks.

### alpha <value>

Defines the filter's alpha (position) parameter.

**Default:** 0.0

### beta <value>

Defines the filter's beta (velocity) parameter.

**Default:** 0.0

### debug

Writes debugging information to the standard output.

## Type: WSF_ALPHA_BETA_GAMMA_FILTER

```wsf
filter <name> WSF_ALPHA_BETA_GAMMA_FILTER
   ... Commands ...
end_filter
```

Defines an alpha-beta-gamma filter for filtering tracks.

### alpha <value>

Defines the filter's alpha (position) parameter.

### beta <value>

Defines the filter's beta (velocity) parameter.

### gamma <value>

Defines the filter's gamma (acceleration) parameter.

### debug

Writes debugging information to the standard output.

## Type: WSF_KALMAN_FILTER

```wsf
filter <name> WSF_KALMAN_FILTER
   ... Commands ...
end_filter
```

Defines a Kalman filter for filtering tracks. The filter accepts input locations (from range, bearing, elevation, or location measurements). It produces an estimate of the tracked target's location and velocity, as well as a state covariance matrix.

### process_noise_sigmas_XYZ <X-value> <Y-value> <Z-value>

Defines the filter's noise standard deviation for the three directions. The values are accelerations in the entity coordinate system (ECS) of the tracked platform. They must be entered in meters per second squared.

**Default:** 0 0 0

### process_noise_model [constant_velocity | constant_acceleration]

Selects the filter's process noise model, either one based on a constant velocity of the target or a constant acceleration of the target.

**Default:** constant_velocity

### debug

Writes debugging information to the standard output.

### range_measurement_sigma <length-value>

Defines the standard deviation that is applied to the measurement's range prior to filtering.

> **Note:** This input is usually not needed. It is only used if there is no range error on the associated track.

**Default:** 0 m

### bearing_measurement_sigma <length-value>

Defines the standard deviation that is applied to the measurement's bearing prior to filtering.

> **Note:** This input is usually not needed. It is only used if there is no bearing error on the associated track.

**Default:** 0 deg

### elevation_measurement_sigma <length-value>

Defines the standard deviation that is applied to the measurement's elevation prior to filtering.

> **Note:** This input is usually not needed. It is only used if there is no elevation error on the associated track.

**Default:** 0 deg

### Process Noise Recommended Values

**Constant Acceleration Model**

| Platform Category     | Sigma X | Sigma Y | Sigma Z |
|-----------------------|---------|---------|---------|
| High Agility Aircraft | 50.0    | 10.0    | 50.0    |
| Truck / Car           | 2.0     | 2.0     | 0.2     |
| Naval Ship            | 1.0     | 2.0     | 2.0     |

**Constant Velocity Model**

| Platform Category     | Sigma X | Sigma Y | Sigma Z |
|-----------------------|---------|---------|---------|
| High Agility Aircraft | 2.0     | 2.0     | 2.0     |
| Truck / Car           | 0.1     | 0.2     | 0.2     |
| Naval Ship            | 0.4     | 0.4     | 2.0     |

## Type: WSF_KALMAN_FILTER_2D_RB

```wsf
filter <name> WSF_KALMAN_FILTER_2D_RB
   ... Commands ...
end_filter
```

Defines a Kalman filter for filtering tracks. The filter converts the measurement's range and bearing data into a X-Y position.

### debug

Writes debugging information to the standard output.

### range_measurement_sigma <range-value>

Defines the standard deviation that is applied to the measurement's range prior to filtering.

### bearing_measurement_sigma <angle-value>

Defines the standard deviation that is applied to the measurement's bearing prior to filtering.

### process_noise_sigmas_XY <X-value> <Y-value>

Defines the filter's noise standard deviation for the two directions. The values must be entered in meters.
