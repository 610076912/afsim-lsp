# route

## Overview

A route is a collection of waypoints that define a path, or route, for movers which use routes (e.g.: `WSF_AIR_MOVER`, `WSF_GROUND_MOVER`, `WSF_ROAD_MOVER` and `WSF_SURFACE_MOVER`) or to define a portion of a route within a `route_network`.

The start of a waypoint is indicated by the presence of one of the following commands:

- A specific latitude and longitude (position)
- An offset relative to the current position (offset)
- A command to turn (turn_left, turn_right or turn_to_heading)
- A command to 'goto' another labeled waypoint (goto)

The definition of the waypoint continues until the next command that starts a new waypoint.

> **Note:** Parameters like speed, altitude, climb_rate, radial_acceleration, linear_acceleration, etc... are used for all subsequent waypoints until overridden.

## Syntax

```wsf
route
   # Commands
   navigation
      # Navigation Commands
      label ...
      position ...
      mgrs_coordinate ...
      offset ...
      turn_left ...
      turn_right ...
      turn_to_heading ...
      goto ...

      # Waypoint Commands
      altitude ...
      depth ...
      heading ...
      turn ...
      speed ...
      linear_acceleration ...
      radial_acceleration ...
      bank_angle_limit ...
      turn_g_limit ...
      climb_rate ...
      dive_rate ...
      pause_time ...
      execute ...
      extrapolate ...
      stop ...
      remove ...
      switch_on_passing ...
      switch_on_approach ...
      distance ...
      time ...
      time_to_point ...
      node_id ...
      aux_data ... end_aux_data
   end_navigation

   # Auxiliary Data Commands
   aux_data ... end_aux_data

   # Route Insertion Commands
   transform_route ...
   transform_absolute_route ...
end_route
```

```wsf
# Define a route on a platform.
platform ...
   route
      ...
   end_route
end_platform

# Define a route type that can be referenced by the **use_route** command of the platform or route_network
# commands, or by transform_route or transform_absolute_route commands.
#
# These occur outside platform definitions.

route <name>
   ...
end_route
```

## Commands

### navigation

**Syntax:** `navigation <navigation-commands> ... end_navigation`

Defines the block input for Navigation Commands used to enter the route waypoints and other navigational data.

### aux_data

**Syntax:** `aux_data <aux-data> ... end_aux_data`

Defines auxiliary data for a route. See `aux_data` for more commands and information.

## Navigation Commands

A new waypoint is started when a 'navigation' command is entered, which is a position, offset, turn_left, turn_right, turn_to_heading, or goto command. All commands up until the next 'navigation' command (or the end of the route) are considered part of the definition of the waypoint and define the desired speed and altitude at the waypoint and what is to be done when that waypoint is encountered.

### label

**Syntax:** `label <string>`

Associates a string label with the immediately following waypoint definition. This can be used as the target of a goto command.

> **Note:** This command should be immediately followed by a navigation command, as it is attached to the next waypoint.

### position

**Syntax:** `position <latitude-value> <longitude-value>`

Specifies the latitude and longitude of the waypoint.

### mgrs_coordinate

**Syntax:** `mgrs_coordinate <MGRS-value>`

Specifies the coordinate of the waypoint in the Military Grid Reference System.

### offset

**Syntax:** `offset <x-offset> <y-offset> <length-units>`

Go to a point relative to the current location of the platform. Each **offset** waypoint is relative to the position of the previous waypoint (or platform's position if it is the first waypoint), and orientation is set using the heading at the first **offset** waypoint and remains constant for all subsequent **offset** waypoints. The +X axis is in the direction of the initial heading and the +Y axis is 90 degrees to the right of the initial heading.

### turn_left

**Syntax:** `turn_left <angle-value>`

Initiate a turn to effect the specified heading angle change.

### turn_right

**Syntax:** `turn_right <angle-value>`

Initiate a turn to effect the specified heading angle change.

### turn_to_heading

**Syntax:** `turn_to_heading <angle-value>`

Initiate a turn to the specified absolute heading angle. The direction of the turn will be in the direction that requires the least amount of heading angle change.

### goto

**Syntax:** `goto <string>`

When this waypoint is reached, go to the waypoint with the specified label in the current route.

> **Note:** This command should follow a navigation command, as it is attached to the previous waypoint.

## Waypoint Commands

### altitude

**Syntax:** `altitude <length-value> [ agl | msl ]`

Specifies the altitude at the waypoint. If **agl** or **msl** is omitted, the default altitude reference is defined by the mover. **msl** is assumed for `WSF_AIR_MOVER` and **agl** for all others.

### depth

**Syntax:** `depth <length-value>`

Specifies the sub-surface depth at the waypoint.

### heading

**Syntax:** `heading <angle-value>`

Specifies the heading at the waypoint. This is really only effective for a route with one point. If more than one waypoint is given then heading will be determined automatically.

### turn

**Syntax:** `turn [ left | right | shortest ]`

Specifies the direction to turn if a turn is required.

**Default:** shortest

### speed

**Syntax:** `speed <speed-value>`

Specifies the speed at the waypoint.

### linear_acceleration

**Syntax:** `linear_acceleration <acceleration-value>`

Specifies the linear acceleration to be used for changing speed on the route segment that starts with this waypoint. *\<acceleration-value\>* may also be **default** to use the mover's default linear_acceleration.

**Default:** The default linear acceleration for the mover.

### radial_acceleration

**Syntax:** `radial_acceleration <acceleration-value>`

Specifies the radial acceleration to be used for turns when making heading changes on the route segment that starts with this waypoint. *\<acceleration-value\>* may also be **default** to use the mover's default radial_acceleration.

**Default:** The default radial acceleration for the mover.

> **Note:** The radial acceleration is NOT the load factor for the aircraft. For example, if one desires a maximum load factor of n = 2 for a 2g turn, then the radial acceleration for a desired 2g turn limit would need to be set = g * sqrt(n^2 - 1) = 1.732g.

### bank_angle_limit

**Syntax:** `bank_angle_limit <angle-value>`

Specifies the maximum bank angle to be used for turns when making heading changes on the route segment that starts with this waypoint. This effectively sets the radial_acceleration to g * tan(bank_angle_limit).

### turn_g_limit

**Syntax:** `turn_g_limit <acceleration-value>`

Specifies the maximum turn g-load to be used for turns when making heading changes on the route segment that starts with this waypoint. This effectively sets the radial_acceleration to sqrt(turn_g_limit^2 - g^2).

### climb_rate

**Syntax:** `climb_rate <speed-value>`

Specifies the rate of climb for changing altitude on the route segment that starts with this waypoint. *\<speed-value\>* may also be **default** to use the mover's default climb_rate. Note: the commands climb_rate and dive_rate are **synonymous** -- specifying a dive_rate will replace a previously specified climb_rate.

**Default:** The default climb/dive rate for the mover.

### dive_rate

**Syntax:** `dive_rate <speed-value>`

Specifies the rate of dive for changing altitude on the route segment that starts with this waypoint. *\<speed-value\>* may also be **default** to use the mover's default dive_rate. Note: the commands climb_rate and dive_rate are **synonymous** -- specifying a dive_rate will replace a previously specified climb_rate.

**Default:** The default climb/dive rate for the mover.

### maximum_flight_path_angle

**Syntax:** `maximum_flight_path_angle <angle-value>`

**Syntax:** `maximum_flight_path_angle default`

Specifies the maximum flight path angle for climbs and dives that happen after this waypoint. If **default** is specified, the mover will use its default value.

### pause_time

**Syntax:** `pause_time <time-value>`

When the waypoint is reached, stop moving for the specified time.

### execute

**Syntax:** `execute <script-name> <callback-name>`

Specify a script or callback to be executed upon reaching the waypoint. *\<script-name\>*/*\<callback-name\>* must be the name of a 'script' defined for the `platform` or `platform_type`.

### extrapolate

**Syntax:** `extrapolate`

Indicates to the mover that it should continue moving at the current speed, heading and altitude when this waypoint is encountered and there are no more waypoints in the route.

### stop

**Syntax:** `stop`

Indicates to the mover that it should stop moving when this waypoint is encountered and there are no more waypoints in the route.

### remove

**Syntax:** `remove`

Indicates to the mover that the platform should be removed from the simulation when this waypoint is encountered and there are no more waypoints in the route.

The default depends on the type of mover as follows:

- **extrapolate** - `WSF_AIR_MOVER`
- **stop** - `WSF_GROUND_MOVER`, `WSF_ROAD_MOVER`, `WSF_SURFACE_MOVER`

### switch_on_passing

**Syntax:** `switch_on_passing`

Defines the condition when the mover should declare that it has reached this waypoint and should start moving towards the next waypoint. **switch_on_passing** is sometimes known as 'turn long' and causes the switch to occur when the platform passes over or alongside the waypoint.

**Default:** switch_on_passing

> **Note:** This is applicable only to position and offset waypoints.

### switch_on_approach

**Syntax:** `switch_on_approach`

Defines the condition when the mover should declare that it has reached this waypoint and should start moving towards the next waypoint. **switch_on_approach** is sometimes known as 'turn short' and causes the switch to occur before the waypoint.

**Default:** switch_on_passing

> **Note:** This is applicable only to position and offset waypoints.

> **Note:** switch_on_approach is applicable only if the following point is also a position waypoint. The user is also responsible for ensuring the target waypoint is such that the turn can be completed properly.

### distance

**Syntax:** `distance <length-value>`

If the waypoint is a turn_left, turn_right or turn_to_heading and the next waypoint is also one of the same class, this command specifies how far to move until switching to the next waypoint.

> **Note:** It is an error to specify this command with a position or offset waypoint.

### time

**Syntax:** `time <time-value>`

If the waypoint is a turn_left, turn_right or turn_to_heading and the next waypoint is also one of the same class, this command specifies how long to move until switching to the next waypoint.

> **Note:** It is an error to specify this command with a position or offset waypoint.

### time_to_point

**Syntax:** `time_to_point <time-value>`

If specified, the mover will change speed in attempt to reach this waypoint after the specified duration. *\<time-value\>* is the length of time it should take the platform to move from the previous waypoint to the current one. **time_to_point** may only be specified for position waypoints.

### node_id

**Syntax:** `node_id <string>`

This command is used only if the route is part of a `route_network`. Waypoints that share the same node_id within a set of routes within a `route_network` are assumed to intersect or connect at those points.

> **Note:** It is the responsibility of the user to ensure that waypoints with the same node_id actually have the same spatial location.

### aux_data (waypoint)

**Syntax:** `aux_data <aux-data> ... end_aux_data`

Defines auxiliary data for a waypoint. See `aux_data`.

## Route Insertion Commands

The following commands allow another route to be inserted at the current point within the route. This allows the creation of routes that represent patterns.

### insert_route

**Syntax:** `insert_route <route-name> [ reference_heading <heading> ]`

**Syntax:** `insert_route <route-name> <latitude> <longitude> <heading>`

Transforms the named route and inserts its waypoints into the route being defined. The named route should have already been defined as a 'route type'. All points in the named route that were defined using the offset command are transformed to a new coordinate system whose origin and orientation are defined below and then internally converted to position points.

The first form should be used if the command occurs in a route in which waypoints appear before it. It uses the latitude and longitude of the preceding waypoint as the origin for the transformation coordinate system. If **reference_heading** was specified then it defines the orientation of the transformation coordinate system. If omitted, it will use the heading between the preceding two waypoints, or 0 if there is only one preceding waypoint.

The second form should be used if the command occurs as the first item in the route. The *\<latitude\>*, *\<longitude\>* and *\<heading\>* values specify the origin and orientation of the transformation coordinate system.

> **Note:** This command is useful for inserting patterns (e.g.: orbits, etc.) into the route.

### insert_offset_route

**Syntax:** `insert_offset_route <route-name> [ reference_heading <heading> ]`

**Syntax:** `insert_offset_route <route-name> <latitude> <longitude> <heading>`

The insert_offset_route command is similar to insert_route. The insert_offset_route command converts offset waypoints to be relative to a single origin. This is different than offset waypoints explicitly defined in a route which are treated relative to the previous waypoint. This means a route explicitly containing offset waypoints will be a different route than one that implicitly includes those offset waypoints using the insert_route command.

### transform_absolute_route

**Syntax:** `transform_absolute_route <route-name> <north-length-value> <east-length-value> <down-length-value>`

Translate the named route the specified amount and insert it into the current route. Only position points will be translated.

## Deprecated Route Insertion Commands

### transform_route (deprecated)

**Syntax:** `transform_route <route-name> [ reference_heading <heading> ]`

**Syntax:** `transform_route <route-name> <latitude> <longitude> <heading>`

Transforms the named route and inserts its waypoints into the route being defined. The named route should have already been defined as a 'route type'. All points in the named route that were defined using the offset command are transformed to a new coordinate system whose origin and orientation are defined below and then internally converted to position points.

The first form should be used if the command occurs in a route in which waypoints appear before it. It uses the latitude and longitude of the preceding waypoint as the origin for the transformation coordinate system. If **reference_heading** was specified then it defines the orientation of the transformation coordinate system. If omitted, it will use the heading between the preceding two waypoints, or 0 if there is only one preceding waypoint.

The second form should be used if the command occurs as the first item in the route. The *\<latitude\>*, *\<longitude\>* and *\<heading\>* values specify the origin and orientation of the transformation coordinate system.

> **Note:** This command is useful for inserting patterns (e.g.: orbits, etc.) into the route.

> **Warning:** Deprecated since 2.9. This command will be replaced by insert_route.

---

# route_network

## Overview

A route_network is typically used to represent a network of roads, airways, or waterways. It is generally used by objects such as `air_traffic`, `road_traffic`, and `sea_traffic` to define the paths on which the platforms navigate or move.

> **Note:** A `route` must have at least two waypoints defined to be added to the route_network.

## Syntax

```wsf
route_network <route-network-name>
   # Repeat as required to specify routes in network
   route
     ...
   end_route

   # Repeat as required to specify routes in network
   use_route <route-name>

   # Test to solve the shortest path for routes in network
   test

   # Test to solve the shortest path between 2 nodes
   test_nodes <from-node-id> <to-node-id>

   # Generate debugging output
   verbose
end_route_network
```

## Commands

### use_route

**Syntax:** `use_route <route-name>`

Include the route type with the specified name as part of the route definition. Repeat as required to specify the route network.

### test

**Syntax:** `test`

During initialization, test all possible paths between each `route.node_id` in all `route`'s to solve the shortest path. A count of Nodes in the route_network tested is output to the console.

> **Note:** A Warning is provided in the output when the shortest path cannot be solved between each start and end node path tested.

> **Tip:** Use verbose to generate additional debugging data when using the test command.

### test_nodes

**Syntax:** `test_nodes <from-node-id> <to-node-id>`

During initialization, test all routes to solve the shortest path between *\<from-node-id\>* and *\<to-node-id\>* (specified as integers).

The following data is output to the console:

- From: \<from-node-id\>
- To: \<to-node-id\>
- Cost: (computed cost value of the tested path)
- Path: (list of `route.node_id`'s included in the tested path)

> **Note:** When the path cannot be solved, Cost: = -1 and Path: is empty.

### verbose

**Syntax:** `verbose`

Generates additional debug data when used with the test command. The following data is output to the console for each path tested:

- From: \<from-node-id\>
- To: \<to-node-id\>
- Cost: (computed cost value of the tested path)
- Path: (list of `route.node_id`'s included in the tested path)

> **Note:** The shortest path cannot be solved when a disconnection is detected in the route(s) to the target node. When the shortest path cannot be solved, a Warning is provided, Cost: = -1 and Path: = No path could be found.
