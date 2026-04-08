# Mover

**Script Class:** `WsfMover`

## Overview

A mover is a Platform_Subsystem which defines the domain in which a platform can move and how it moves within the domain. In other words, each mover type definition defines how a platform behaves in movement during simulation runtime. Several types of predefined movers exist in WSF that can be placed on a platform. A platform may only have one type of mover defined. A base mover definition may be defined external to a platform in order to be used by several platform_types.

## Syntax

```wsf
mover <Mover_Types> ...
   ... Platform_Part_Commands ...
   update_interval <time-reference>
   update_time_tolerance <time-reference>
end_mover
```

## Commands

### update_interval

**Syntax:** `update_interval <time-reference>`

If non-zero, specifies a periodic time interval at which the simulation will call the mover. If zero then the mover will be called only when it is necessary to determine the position of the containing platform.

**Default:** 0 seconds unless overridden by the specific mover implementation.

### update_time_tolerance

**Syntax:** `update_time_tolerance <time-reference>`

When a position update is requested by the simulation, if the time since the previous update is less than or equal to this value then the mover will ignore the update.

**Default:** Most mover implementations define this as the time it takes to travel 1 meter at some nominal velocity that is appropriate for the implementation.

> **Note:** A mover implementation may choose to ignore this command.

## Route Mover

**Derives from:** `WsfMover`

A route mover is any mover that has the ability to follow a path.

- `WSF_AIR_MOVER`
- `WSF_GROUND_MOVER`
- `WSF_SURFACE_MOVER`
- `WSF_ROAD_MOVER`

### Route Mover Commands

#### altitude_offset

**Syntax:** `altitude_offset <length-value>`

When set, this offset will offset the parent platform's location by the given amount from the current waypoint's altitude.

#### at_end_of_path

**Syntax:** `at_end_of_path [extrapolate | stop | remove]`

Specify the action to take when the mover reaches the end of its defined path.

- **extrapolate**: continue moving along at the last known heading, speed, and altitude.
- **stop**: stop moving, but leave the platform in the simulation.
- **remove**: remove the platform from the simulation.

**Default:** Extrapolate

#### draw_route

**Syntax:** `draw_route <boolean-value>`

This command is the same as print_route, except the route text is not printed, only drawn with `WsfDraw`.

#### on_turn_failure

**Syntax:** `on_turn_failure [best_effort | reverse_turn | ignore_point]`

Defines the behavior of the mover when a point on a route cannot be reached exactly due to the turn radius.

- **best_effort**: Turns until the platform reaches the point of closest approach to the point.
- **ignore_point**: The mover operates effectively as if the point is not there. Any script tied to this point will be executed when the point is skipped.
- **reverse_turn**: The mover will turn the opposite direction, enabling it to reach the point exactly.

> **Note:** This command has no effect if the mover is given routes that fit within the mover's constraints.

> **Note:** Also see turn_failure_threshold.

**Default:** best_effort

#### pathfinder

**Syntax:** `pathfinder <path-name>`

The name of the pathfinder object to use.

#### print_route

**Syntax:** `print_route <boolean-value>`

When enabled, the route is printed to the screen whenever it is modified. Additionally, `WsfDraw` is used to output a visual of the route.

#### start_at

**Syntax:** `start_at <label-name>`

The label identifying the waypoint in the route to use as the starting location.

#### start_time

**Syntax:** `start_time <random-time-reference>`

Indicates the platform is to start moving at the time specified. The current velocity is set to zero and once the simulation time is reached, the platform starts moving at the speed specified in the first waypoint.

#### switch_on_approach

**Syntax:** `switch_on_approach`

Switches to the next waypoint when approaching within one turn radius of the current target waypoint.

#### switch_on_passing

**Syntax:** `switch_on_passing`

Switches to the next waypoint only when abreast of the current target waypoint.

> **Note:** This is the default.

#### turn_failure_threshold

**Syntax:** `turn_failure_threshold <ratio-value>`

Defines the threshold for which the on_turn_failure behavior is triggered, given as a ratio of the turn radius. For example, a turn_failure_threshold of 0.01 and a turn radius of 1000 meters, on_turn_failure logic would be triggered if the point is missed by more than 10 meters.

**Default:** 0.01

#### use_route

**Syntax:** `use_route <route-name>`

Supplies the name of the route to follow. The route is assumed to be a predefined absolute route.

### Waypoint Mover Commands

#### angle_of_attack_table

**Syntax:** `angle_of_attack_table ... end_angle_of_attack_table`

```wsf
angle_of_attack_table
  altitude <altitude-value>
    speed <speed-value> angle <angle-value>
    speed <speed-value> angle <angle-value>
  altitude <altitude-value>
    angle <angle-value>
end_angle_of_attack_table
```

#### altitude

**Syntax:** `altitude <altitude-value>`

Specifies the altitude that the subsequent data is valid for. The altitude blocks must be in increasing numerical order. Linear interpolation of the altitude blocks is used.

#### speed

**Syntax:** `speed <speed-value>`

Specifies the speed that the listed angle of attack is valid for. The speed entries must be in increasing numerical order. The angle of attack will be computed using a linear interpolation of the speed data.

#### angle

**Syntax:** `angle <angle-value>`

The angle of attack. The angle of attack entries must be in increasing numerical order.

#### bank_angle_limit

**Syntax:** `bank_angle_limit <angle-value>`

The roll angle limit. Value must be between 0 degrees to 85 degrees. Used to calculate the maximum radial acceleration.

**Default:** 0

#### body_g_limit

**Syntax:** `body_g_limit <acceleration-value>`

The body g-limit. Value must be greater than the acceleration of earth's gravity.

#### heading_pursuit_gain

**Syntax:** `heading_pursuit_gain <double-value>`

The heading pursuit gain.

**Default:** 5

#### maximum_climb_rate

**Syntax:** `maximum_climb_rate <speed-value>`

Specifies the maximum climb rate and dive rate used when changing altitude. Other climb rates specified by waypoints or scripts are bounded by this value.

> **Note:** The actual climb rate of the mover will also be affected by 'maximum_flight_path_angle'.

#### maximum_flight_path_angle

**Syntax:** `maximum_flight_path_angle <angle-value>`

Specifies maximum flight path angle (angle of climb/dive). Value must be greater than or equal to 0.

> **Note:** The actual climb rate of the mover will also be affected by 'maximum_climb_rate'.

**Default:** 0

#### maximum_linear_acceleration

**Syntax:** `maximum_linear_acceleration <acceleration-value>`

Specifies the maximum linear acceleration to use when acceleration is necessary. This value is used if the waypoint does not include a linear_acceleration specification.

**Default:** 6 g's

#### maximum_radial_acceleration

**Syntax:** `maximum_radial_acceleration <acceleration-value>`

Specifies the maximum radial acceleration to use when turning. This value is used if the waypoint does not include a radial_acceleration specification.

**Default:** 6 g's

> **Note:** The radial acceleration is NOT the load factor for the aircraft. For example, if one desires a maximum load factor of n = 2 for a 2g turn, then the radial acceleration for a desired 2g turn limit would need to be set = g * sqrt(n^2 - 1) = 1.732g.

#### maximum_altitude

**Syntax:** `maximum_altitude <altitude-value>`

Maximum altitude constraint.

#### minimum_altitude

**Syntax:** `minimum_altitude <altitude-value>`

Minimum altitude constraint.

#### maximum_speed

**Syntax:** `maximum_speed <speed-value>`

Maximum speed constraint. Value must be greater than 0.

#### minimum_speed

**Syntax:** `minimum_speed <speed-value>`

Minimum speed constraint. Value must be greater than or equal to 0.

**Default:** 0.0

#### path_variance_radius

**Syntax:** `path_variance_radius <length-value>`

This value will randomly vary the location of the waypoint within the radius given. A random bearing and distance are chosen and applied to the next waypoint when calculating the path.

#### roll_rate_limit

**Syntax:** `roll_rate_limit <angle-rate-value>`

The roll rate limit. Value must be greater than 0. Note: When applied to a WSF_AIR_MOVER or other waypoint mover types, the roll rate will not affect the platform's movement along a route. To affect route following behavior use maximum_radial_acceleration.

#### speed_variance_percent

**Syntax:** `speed_variance_percent <percent-value>`

This value will randomly vary the speed at each waypoint as the mover travels within +/- the pct given. Value must be greater than 0.

#### turn_rate_limit

**Syntax:** `turn_rate_limit <angle-rate-value>`

The turn rate limit. Value must be greater than 0.

#### pitch_disable / no_pitch

**Syntax:** `pitch_disable` or `no_pitch`

Restricts the mover from pitching the platform. This has no effect on kinematics.

#### on_road

**Syntax:** `on_road`

Restricts the mover from rolling the platform. This has no effect on kinematics.

#### off_road

**Syntax:** `off_road`

Turns off the 'on_road' option. This allows the platform to roll.

#### path_compute_timestep

**Syntax:** `path_compute_timestep <time-value>`

Waypoint movers precompute movement along paths. This behavior forces turns to have a constant radius. If path_compute_timestep is specified as a positive value, the turn rate will update on that interval if any changes in speed occur.

**Default:** 0.0

### Note about maximum and default commands

Movers have various commands that specify a maximum value such as maximum_linear_acceleration. These commands specify an overall limit to movement which will not be exceeded over the course of a simulation. There are a few default commands, such as default_linear_acceleration. These commands specify a rate to use unless otherwise specified in a route or script. These parameters may be omitted, leaving the mover to use the maximum rates by default. Rates may be modified during the simulation through routes or through scripts. Rates remain the same until changed by another script or route.

## Type: WSF_AIR_MOVER

### Overview

`WSF_AIR_MOVER` is a Route Mover designed for simplified air vehicle motion. The advantage of using the WSF_AIR_MOVER is that a platform's mass properties, aero, or propulsion is not required to be known to model an air body. Movement is based on maximum limits set for items (e.g., linear acceleration, velocity, Gs, radial acceleration), but it applies only to the continuous motion in the horizontal plane. The limitation of the WSF_AIR_MOVER is within the vertical transitions (altitude changes) of the platform. These transitions are discontinuous in that the effects are instantaneous because transitional vertical pitch rates and vertical accelerations are not modeled. If continuous and smooth vertical and horizontal transitions are desired on a platform, use the `WSF_KINEMATIC_MOVER` (if no aerodynamics, mass properties, propulsion, or altitude effects are desired) or the `WSF_P6DOF_MOVER` (if realistic, physics-based modeling is desired).

### Syntax

```wsf
mover WSF_AIR_MOVER

   Platform_Part_Commands

   // Mover Commands

   update_interval
   update_time_tolerance

   // Route Mover Commands

   altitude_offset
   at_end_of_path
   draw_route
   on_turn_failure
   pathfinder
   print_route
   start_at
   start_time
   switch_on_approach
   switch_on_passing
   turn_failure_threshold
   use_route

   // Waypoint Mover Commands

   angle_of_attack_table
   altitude
   speed
   angle
   bank_angle_limit
   body_g_limit
   heading_pursuit_gain
   maximum_climb_rate
   maximum_flight_path_angle
   maximum_linear_acceleration
   maximum_radial_acceleration
   maximum_altitude
   minimum_altitude
   maximum_speed
   minimum_speed
   path_variance_radius
   roll_rate_limit
   speed_variance_percent
   turn_rate_limit
   pitch_disable
   no_pitch
   on_road
   off_road
   path_compute_timestep

   // Air Mover Commands

   maximum_impact_speed

end_mover
```

### Air Mover Commands

#### maximum_impact_speed

**Syntax:** `maximum_impact_speed <speed-value>`

Specify the maximum speed above which the associated platform intersects terrain and is considered 'crashed into the ground'. A crashed platform will notify observers via the WsfSimulationObserver::CrashedIntoGround() method and remove itself from the simulation. If impact speed is below this maximum, the platform is considered to be 'landing'. The default behavior is to always land, rather than crash.

## Type: WSF_GROUND_MOVER

### Overview

Implements a mover for a terrain following ground vehicle. WSF_GROUND_MOVER is a Route Mover.

### Syntax

```wsf
mover WSF_GROUND_MOVER

   Platform_Part_Commands

   // Mover Commands

   update_interval
   update_time_tolerance

   // Route Mover Commands

   altitude_offset
   at_end_of_path
   draw_route
   on_turn_failure
   pathfinder
   print_route
   start_at
   start_time
   switch_on_approach
   switch_on_passing
   turn_failure_threshold
   use_route

   // Waypoint Mover Commands

   angle_of_attack_table
   altitude
   speed
   angle
   bank_angle_limit
   body_g_limit
   heading_pursuit_gain
   maximum_climb_rate
   maximum_flight_path_angle
   maximum_linear_acceleration
   maximum_radial_acceleration
   maximum_altitude
   minimum_altitude
   maximum_speed
   minimum_speed
   path_variance_radius
   roll_rate_limit
   speed_variance_percent
   turn_rate_limit
   pitch_disable
   no_pitch
   on_road
   off_road
   path_compute_timestep

end_mover
```

## Type: WSF_ROAD_MOVER

**Script Class:** `WsfMover`

### Overview

`WSF_ROAD_MOVER` is a specialization of `WSF_GROUND_MOVER` that moves on a road network. It calculates the shortest path between a start and end point and uses it as its waypoint path. A pause time can be set to offset the start time of the mover. As well, a flag can be set (use_closest_waypoint) that causes the mover to plot a shortest path based on the closest waypoints to the user-specified start and end positions.

At its simplest, the mover calculates a path that consists of:

- An optional segment that goes from start_position to the closest point on the road network. This segment will not be generated if the start position is on the road.
- The shortest path on the road that gets closest to the end_position.
- An optional segment that goes from the last point on the road to end_position. This segment will not be generated if the end position is on the road.

You may also specify a route, which represents various intermediate points (and possibly the start_position and end_position if they were omitted).

### Syntax

```wsf
mover <name> WSF_ROAD_MOVER

   Platform_Part_Commands ...
   ... WSF_GROUND_MOVER commands

   road_network ...
   start_position ... end_position ...
   speed ...
   off_road_speed ...
   linear_acceleration ...
   pause_time ...
   use_closest_waypoint
   consider_off_road_shortcut ...

end_mover
```

### Road Mover Commands

#### road_network

**Syntax:** `road_network <road-network-name>`

The name of the route_network to follow.

**Default:** none (must be specified)

#### start_position / end_position

**Syntax:** `start_position <latitude-value> <longitude-value>` / `end_position <latitude-value> <longitude-value>`

Defines the starting location and ending locations. The resulting path will be the points from the road network that define the shortest path between the specified locations.

**Default:** none

> **Note:** A route may also be used to specify intermediate positions.

> **Warning:** If either start_position or end_position is specified then both must be specified. If neither is specified then a route can be used to define the start, end, and possibly intermediate positions.

#### speed

**Syntax:** `speed <speed-value>`

Defines the platform speed while traveling on the road network.

**Default:** none (must be specified)

#### off_road_speed

**Syntax:** `off_road_speed <speed-value>`

Defines the platform speed while traveling off the road network.

**Default:** Same value as speed.

#### linear_acceleration

**Syntax:** `linear_acceleration <acceleration-value>`

The linear acceleration to be used to accelerate the platform.

**Default:** 12 m/s^2

#### pause_time

**Syntax:** `pause_time <time-value>`

The time the mover is paused at the user-specified start position.

**Default:** 0 seconds

#### use_closest_waypoint

**Syntax:** `use_closest_waypoint`

The mover will use the closest waypoints to the user-specified start and end positions when calculating the shortest path along the road network. No off-road segments at the start or the end will be generated.

#### consider_off_road_shortcut

**Syntax:** `consider_off_road_shortcut <boolean-value>`

If this command has a value of true, a second path will be considered as a possible route, that being an off-road 'shortcut' path between the start position and the end position. If the shortcut path takes less time to traverse using the off_road_speed than the normal path, it will be used as the route.

**Default:** false

## Type: WSF_SURFACE_MOVER

### Overview

`WSF_SURFACE_MOVER` implements a mover for platforms constrained to move along the surface of the water (e.g., ships). This mover is similar to the `WSF_GROUND_MOVER`; however, pitch and roll are set to zero by default. A future addition will likely include an optional sea state that will modify the pitch, roll, and altitude of associated platforms.

### Syntax

```wsf
mover WSF_SURFACE_MOVER

   Platform_Part_Commands ...

   update_interval ...
   update_time_tolerance ...

   // Route Mover Commands

   at_end_of_path ...
   pathfinder ...
   start_at ...
   start_time ...
   switch_on_approach
   switch_on_passing
   altitude_offset
   route
      ... Route Commands ...
   end_route
   use_route ...

   // Waypoint Mover Commands

   angle_of_attack_table ...
   bank_angle_limit ...
   body_g_limit ...
   heading_pursuit_gain ...
   maximum_climb_rate ...
   maximum_flight_path_angle ...
   maximum_linear_acceleration ...
   maximum_radial_acceleration ...
   maximum_altitude ...
   minimum_altitude ...
   maximum_speed ...
   minimum_speed ...
   path_variance_radius ...
   roll_rate_limit ...
   speed_variance_percent ...
   turn_rate_limit ...

end_mover
```

## Type: WSF_HYBRID_MOVER

### Overview

A specialized mover that consolidates the functionality of the WsfFollower mover and WsfWaypointMover mover.

### Syntax

```wsf
mover WSF_HYBRID_MOVER

   Platform_Part_Commands ...

   // Mover Commands

   update_interval ...
   update_time_tolerance ...

   // Hybrid Mover Commands

   follower_mover ...
   waypoint_mover ...
   current_mover ...
   auto_switch

   ... Waypoint Mover Commands ...

   ... Follower Mover Commands ...

end_mover
```

### Hybrid Mover Commands

#### follower_mover

**Syntax:** `follower_mover <name-value>`

The name of the predefined follower mover.

#### waypoint_mover

**Syntax:** `waypoint_mover <name-value>`

The name of the predefined waypoint mover (i.e., `WSF_AIR_MOVER`, `WSF_GROUND_MOVER`, or `WSF_SURFACE_MOVER`).

#### current_mover

**Syntax:** `current_mover [follower_mover | waypoint_mover]`

Sets the current mover to either the follower mover or the waypoint mover.

#### auto_switch

**Syntax:** `auto_switch`

If the current mover is the follower and the lead no longer exists then switch back to the waypoint mover and return to the given route entering at the closest point.

## Type: WSF_OFFSET_MOVER

### Overview

`WSF_OFFSET_MOVER` implements a mover that forces the platform to stay at a prescribed offset from a specified leader platform. A platform may be attached 'rigidly' or 'tethered'.

### Special Considerations

- The reference platform should be defined before the following platform so the following platform can establish its location when it is initialized. If this is not the case, ensure that following platform has a 'position' command in its definition.
- If using tethered mode, ensure that the 'update_interval' of the lead platform is not too large. Otherwise the follower may have to make some drastic moves to attain the prescribed spatial relationship.

### Syntax

```wsf
mover WSF_OFFSET_MOVER

   Platform_Part_Commands ...

   // Mover Commands

   update_interval ...
   update_time_tolerance ...

   // Offset Mover Commands

   attachment_type ...
   reference_platform ...
   offset_from_reference ...
   orphan_action ...

end_mover
```

### Offset Mover Commands

#### attachment_type

**Syntax:** `attachment_type [ tether | rigid ]`

Specifies how the follower is attached to the leader.

- **tether** - The follower moves as though it is attached to the leader by an elastic tether.
- **rigid** - The follower moves as though it is rigidly attached to the leader.

**Default:** tether

> **Note:** The default of **tether** does not currently work. The initial capability only works with **rigid**.

#### reference_platform

**Syntax:** `reference_platform <name>`

Specifies the name of the reference or 'lead' platform (the platform to be followed).

> **Note:** In general, one should define the lead platform before defining the following platform.

#### offset_from_reference

**Syntax:** `offset_from_reference <x-length-units> <y-length-units> <z-length-units>`

Specifies the offset of the following platform in relation to the entity coordinate system of the reference platform.

**Default:** 0 m 0 m 0 m

#### orphan_action

**Syntax:** `orphan_action [ stop | extrapolate | remove]`

Defines the action that should be performed if the reference platform is removed from the simulation.

- **stop** - stop at the current location.
- **extrapolate** - continue extrapolating along the last known heading.
- **remove** - remove the following platform from the simulation.

**Default:** stop

## Type: WSF_TSPI_MOVER

### Overview

WSF_TSPI_MOVER implements a mover that updates position based on Time Space Position Information (TSPI) data read from a text file.

The data contained in the TSPI data file are of the following form:

```
<time> <latitude> <longitude> <altitude> <speed> <heading> <pitch> <roll>
```

The default units for these TSPI values are seconds, meters, meters/second, and radians. However, the user can specify Data Format Commands that override the defaults.

### Syntax

```wsf
mover WSF_TSPI_MOVER

   ... Platform_Part_Commands ...

   filename or TSPI_filename ...
   start_time ...
   at_end_of_path ...

   # Data Format Commands

   time_in ...
   altitude_in ...
   heading_in ...
   pitch_in ...
   roll_in ...
   relocate_and_rotate ...
   heading_inverted
   pitch_inverted
   roll_inverted
end_mover
```

### Commands

#### filename / TSPI_filename

**Syntax:** `filename <filename>` or `TSPI_filename <filename>`

Specify the name of the file containing the TSPI data.

#### start_time

**Syntax:** `start_time <time-value>`

Specify the simulation time that corresponds with the time of the first TSPI data value. This is the simulation time at which the associated platform will begin moving.

**Default:** 0.0

#### at_end_of_path

**Syntax:** `at_end_of_path [ extrapolate | stop | remove ]`

Specify what occurs when the end of the TSPI file is encountered.

- **extrapolate**: Continue in a great-circle path from the last point.
- **stop**: Stop at the last point.
- **remove**: Remove the platform from the simulation.

**Default:** extrapolate

#### extrapolation

**Syntax:** `extrapolation <boolean-value>`

This is retained for compatibility with old input files. A value of 'true' is the same as 'at_end_of_path extrapolate', while a value of 'false' is the same as 'at_end_of_path stop'.

### Data Format Commands

These commands define the format of the data contained within the TSPI file. For example, when using a TSPI file that is compatible with BLUEMAX the following commands should be specified:

```wsf
altitude in feet
roll inverted
```

#### time_in

**Syntax:** `time_in <time-unit>`

Specify that the units of the \<time\> values in the TSPI data file are in units \<time-units\>.

**Default:** seconds

#### altitude_in

**Syntax:** `altitude_in <length-units>`

Specify that the units of the \<altitude\> values in the TSPI data file are in units \<length-units\>.

**Default:** meters

#### speed_in

**Syntax:** `speed_in <speed-units>`

Specify that the units of the \<speed\> values in the TSPI data file are in units \<speed-units\>.

**Default:** meters/second

#### heading_in

**Syntax:** `heading_in <angle-unit>`

#### pitch_in

**Syntax:** `pitch_in <angle-unit>`

#### roll_in

**Syntax:** `roll_in <angle-unit>`

Specify that the units of the \<heading\>, \<pitch\>, or \<roll\> values in the TSPI data file are in units \<angular-units\>.

**Default:** radians

#### heading_inverted / pitch_inverted / roll_inverted

**Syntax:** `heading_inverted` / `pitch_inverted` / `roll_inverted`

Specify that the given value name in the TSPI data file is to be inverted (i.e., the values are negated).

**Default:** Not negated

#### relocate_and_rotate

**Syntax:** `relocate_and_rotate ... end_relocate_and_rotate`

The relocate_and_rotate block is a means to move a trajectory from one locale to another, including a change in orientation. Two keywords will move a TSPI trajectory from one (latitude, longitude) to another (latitude, longitude), either: A) initial_endpoint_anchor \<lat\> \<lon\>, or B) terminal_endpoint_anchor \<lat\> \<lon\>. After the path is relocated, it can then be re-oriented. To do so, use either A) great_circle_heading_at_anchor_point \<angle-value\>, or B) align_to_great_circle_through \<lat\> \<lon\>. Note that due to the spherical geometry calculations used, and the ellipsoidal earth, the path translation process will be approximate.

## Type: WSF_KINEMATIC_MOVER

### Overview

When placed on a platform, the WSF_KINEMATIC_MOVER provides for a smooth motion in both horizontal and vertical directions. Unlike the `WSF_AIR_MOVER`, vertical acceleration is modeled; transitions in both altitude and bearing are performed dynamically and at the same time. Similar to the WSF_AIR_MOVER, no aerodynamics, mass properties, or propulsion are required to be known in order to use this mover. In addition, flight characteristics are not affected by various flight altitudes of a platform with this mover definition (no air density variation effect).

This mover type accepts two different values for gain (velocity_pursuit_gain and proportional_navigation_gain), and some clarifying comments are in order. The "correct" gain values for your particular scenario are truly implementation-defined, and no particular default values will work for all scenarios. Higher values result in a more aggressive maneuver to intercept, with more angular, discontinuous trajectory turns, while a lower value tends toward a slow, wandering maneuver into the aimpoint.

> **Note:** The WSF_KINEMATIC_MOVER cannot completely replace the WSF_AIR_MOVER. Several scripting and route methods available to the WSF_AIR_MOVER are not available to the WSF_KINEMATIC_MOVER. The WSF_KINEMATIC_MOVER should be considered initial capability and by no means complete. It does not implement all guidance commands while switching waypoints within a Route ..end_route definition. It does honor the route commands of Latitude, Longitude, Altitude (MSL-only) and Speed commands. However, it currently ignores distance, time, climb rates, and flight path angles.

### Syntax

```wsf
mover WSF_KINEMATIC_MOVER

   Platform_Part_Commands ...

   ... WSF_KINEMATIC_MOVER Commands ...

   // Route Mover Commands

   use_route ...

end_mover
```

### Commands

#### detailed_debug

**Syntax:** `detailed_debug <boolean-value>`

Enables debug output to the standard output.

#### prefer_canopy_up

**Syntax:** `prefer_canopy_up <boolean-value>`

Causes the platform to roll to the local vertical at all times. Mutually exclusive to bank_to_turn.

#### bank_to_turn

**Syntax:** `bank_to_turn <boolean-value>`

Causes the platform to roll into the acceleration vector, but still prefers the vertical when not accelerating in a turn. Mutually exclusive to prefer_canopy_up.

#### broach_at_sea_level

**Syntax:** `broach_at_sea_level <boolean-value>`

This mover was originally developed to define a torpedo mover. However, the capability of the model is such that it can be used above sea level. This flag assures that the motion must remain below local sea level, once subsurface.

#### target_speed

**Syntax:** `target_speed <speed-value>`

Once supplied, the platform will accelerate or decelerate to match the target (desired) speed, subject to maximum_linear_acceleration constraint.

#### initial_speed

**Syntax:** `initial_speed <speed-value>`

Initial linear speed. After initialization, speed is varied to maintain target_speed.

#### initial_flight_path_angle

**Syntax:** `initial_flight_path_angle <angle-value>`

Initial flight path angle. After initialization, flight path angle will vary to guide to a desired waypoint in a defined route.

#### maximum_linear_acceleration

**Syntax:** `maximum_linear_acceleration <acceleration-value>`

Defines the linear (velocity direction) acceleration limit constraint.

**Default:** 0.25 G

#### maximum_radial_acceleration

**Syntax:** `maximum_radial_acceleration <acceleration-value>`

Defines the radial (normal to velocity direction) acceleration limit constraint. This constraint is imposed simultaneously with maximum_body_turn_rate, the most restrictive is used.

**Default:** 8.0 G

#### maximum_body_roll_rate

**Syntax:** `maximum_body_roll_rate <angular-rate-value>`

Defines the maximum rate at which the platform will try to capture desired target bank angle.

**Default:** 180 deg/sec

#### maximum_body_turn_rate

**Syntax:** `maximum_body_turn_rate <angular-rate-value>`

Defines the maximum rate at which the velocity vector will rotate in three-dimensional space. This constraint is imposed simultaneously with maximum_radial_acceleration, the most restrictive is used.

**Default:** 45 deg/sec

#### velocity_pursuit_gain

**Syntax:** `velocity_pursuit_gain <non-negative-value>`

Defines the factor of proportion between target azimuth and elevation (in radians), and the applied lateral or vertical acceleration (in m/sec^2) to null the velocity vector to point at the target.

**Default:** 4.0

#### waypoint_switch_on_ground_turning_radius

**Syntax:** `waypoint_switch_on_ground_turning_radius <boolean-value>`

If this input value is set to true, only horizontal offsets are considered when deciding to advance to the next waypoint in a route; vertical miss values are ignored. If set false, then a 3-dimensional slant offset is considered when deciding if a waypoint is sufficiently close to be considered "hit".

**Default:** true

#### proportional_navigation_gain

**Syntax:** `proportional_navigation_gain <non-negative-value>`

Defines the factor of proportion between the target line-of-sight-rate (in rad/sec), and the applied lateral or vertical acceleration (in m/sec^2) to null the velocity vector to intercept the target's future position at time of intercept.

**Default:** 40.0

#### use_route

**Syntax:** `use_route <route-name>`

Supplies the name of the route to follow. The route is assumed to be a predefined absolute route.

## Type: WSF_ROTORCRAFT_MOVER

### Overview

`WSF_ROTORCRAFT_MOVER` is a route mover designed to model rotorcraft motion characteristics. It permits a decoupling of the desired platform heading (body pointing direction) from the velocity vector. At low speed, the platform may assume any desired heading, regardless of direction of translation, but at high speed the heading assumes the direction of flight. Scripted commands to assume a desired orientation or heading (body pointing direction) is taken as a request but may not be immediately honored. The mover will maintain a desired heading angle and, upon slowing to below weathercocking speed, will once again assume the desired heading. Orientation of the platform rotor plane in the North-East-Down frame is canted in the direction of the acceleration vector when accelerating laterally or turning but is horizontal under cruise conditions.

`WSF_ROTORCRAFT_MOVER` is the first WSF Mover type to implement Mover "Modes". When a mover mode is changed, either in script or as a result of crossing a waypoint, all motion attributes change to those defined for that motion mode. For example, a script command 'PLATFORM.Mover().SetMode("CRUISE")' would immediately adopt speed, rates of climb, and acceleration values as predefined in motion mode "CRUISE." One might define modes appropriate for "HOVER", "LOITER", "DASH", or any other desired mover mode for the Rotorcraft Mover. If the Mode is not defined by the Mover the command is ignored.

### Syntax

```wsf
mover <name> WSF_ROTORCRAFT_MOVER

   Platform_Part_Commands ...

   // Rotorcraft Mover Commands

   update_interval ...
   update_time_tolerance ...

   weathercock_speed
   maximum_attitude_rate
   maximum_total_acceleration
   minimum_upward_acceleration
   body_rates_gain
   maximum_ground_speed
   maximum_rate_of_climb
   maximum_rate_of_descent
   maximum_impact_speed ...

   mode <name>
      // Mode Commands ...
   end_mode

   vertical_acceleration_rate_pid ... end_vertical_acceleration_rate_pid
   vertical_acceleration_value_pid ... end_vertical_acceleration_value_pid
   lateral_acceleration_rate_pid ... end_lateral_acceleration_rate_pid
   lateral_acceleration_value_pid ... end_lateral_acceleration_value_pid

end_mover
```

### Rotorcraft Mover Commands

#### desired_heading

**Syntax:** `desired_heading <angle-value>`

Sets the desired heading for the mover, which will take effect at speeds below the "weathercocking speed."

#### position_hold_capture_radius

**Syntax:** `position_hold_capture_radius <length-value>`

The rotorcraft mover uses a rate guidance mechanism when transiting from one location to another. When approaching a target point, guidance fundamentally changes to capture a position value, and so must decelerate in anticipation of capturing and holding the target position. This value determines the transition point from one guidance type to the other. The default value is set to 200 meters, which should suffice for the vast majority of Rotorcraft models.

#### start_mode

**Syntax:** `start_mode <mode-name>`

Specifies the initial mover mode of the platform. The mover mode may be changed externally via script settings or at waypoint transitions.

#### ned_filter_time_constant

**Syntax:** `ned_filter_time_constant <time-value>`

Specifies a filter time constant to apply to commanded acceleration values to smooth transient responses. A larger value will apply a greater amount of smoothing to the commands. Value must be greater than zero. The default is 1 second and is adequate for most purposes.

#### altitude_error_to_rate_of_climb_gain

**Syntax:** `altitude_error_to_rate_of_climb_gain <floating-point-value>`

Specifies a gain to apply to an altitude error to arrive at a vertical acceleration value. The default is 1 and is adequate for most purposes.

#### vertical_acceleration_rate_pid

**Syntax:** `vertical_acceleration_rate_pid ... end_vertical_acceleration_rate_pid`

#### vertical_acceleration_value_pid

**Syntax:** `vertical_acceleration_value_pid ... end_vertical_acceleration_value_pid`

#### lateral_acceleration_rate_pid

**Syntax:** `lateral_acceleration_rate_pid ... end_lateral_acceleration_rate_pid`

#### lateral_acceleration_value_pid

**Syntax:** `lateral_acceleration_value_pid ... end_lateral_acceleration_value_pid`

Each of the above four input blocks may contain tuning parameters to apply to the Proportional Integral Derivative (PID) controllers, which determine acceleration values which drive the motion state of the platform. It is not necessary for the end-user to modify the default gains, unless a particular dynamic response is required. PID controller response should be adequate for most purposes.

### Mode Commands

#### mode

**Syntax:** `mode ... end_mode`

##### weathercock_speed

**Syntax:** `weathercock_speed <speed_value>`

Ground speed above which the platform will assume a heading that matches the course angle. Below this speed, the platform will assume a desired heading angle, as set by script commands.

##### maximum_attitude_rate

**Syntax:** `maximum_attitude_rate <angular_rate_value>`

Maximum angular rate for body attitude changes. This is primarily used in concert with weathercock_speed to determine how quickly the platform will transition in and out of weathercocking mode.

##### maximum_total_acceleration

**Syntax:** `maximum_total_acceleration <acceleration_value>`

Maximum magnitude of linear acceleration. Sets the upper limit during hard lateral accelerations.

##### minimum_upward_acceleration

**Syntax:** `minimum_upward_acceleration <acceleration_value>`

Minimum upward acceleration value. When aircraft is rising, and then a command is given to descend quickly, this value sets the minimum vertical acceleration constraint. Note that many rotorcraft with teetering rotor heads are not permitted to pull negative g, by design.

##### body_rates_gain

**Syntax:** `body_rates_gain <floating_point_value>`

Gain to apply to an angular heading error to obtain the rate at which the heading error is removed. Used primarily in removing a heading error when transitioning to fast forward flight, above weathercock speed.

##### maximum_ground_speed

**Syntax:** `maximum_ground_speed <speed_value>`

Maximum permitted ground speed in this motion mode. Typical use would be for mode speed constraint.

##### maximum_rate_of_climb

**Syntax:** `maximum_rate_of_climb <speed_value>`

Maximum permitted rate of climb in this motion mode. Typical use would be to set a realistic climb rate for the mode.

##### maximum_rate_of_descent

**Syntax:** `maximum_rate_of_descent <speed_value>`

Magnitude of maximum permitted rate of descent in this motion mode. Value must be greater than zero but will be negated when applied. Typical use would be to set a realistic descent rate for the mode.

### PID Controller Commands

#### proportional_gain

**Syntax:** `proportional_gain <floating_point_value>`

Gain to apply to current error to attempt to null the error to zero. Larger values will more forcibly attempt to null the error but are prone to induce oscillation in the output.

#### derivative_gain

**Syntax:** `derivative_gain <floating_point_value>`

Gain to apply to current rate-of-change of error to attempt to prevent the error from overshooting the desired target value. Larger values will oppose any change in the output, causing drift.

#### integral_gain

**Syntax:** `integral_gain <floating_point_value>`

Gain to oppose a steady-state bias, which attempts to drive the bias to zero.

#### input_threshold

**Syntax:** `input_threshold <floating_point_value>`

Comparison value to determine whether to apply integral summing of the input error sample. While the input value differs more than \<input_threshold\> from the target value no input integration is performed. Once the input threshold is near the target value, a continuous integration is performed to discern and react to an input bias. If so, integral_gain is applied to the bias to remove it over time.
