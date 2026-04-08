# road_traffic

## Overview

The `road_traffic` block generates background road traffic during the simulation on a predefined `route_network`.

## Syntax

```wsf
road_traffic
   network <route-network-name>
      vehicle_count <number>
      vehicle_density <number> per <length-unit>
      maximum_speed <speed-value>
      mean_travel_time <time-value>
      sigma_travel_time <time-value>
      minimum_distance_off_road <length-unit>
      maximum_distance_off_road <length-unit>
      pause_time_off_road <time-value>
      end_of_path_option [ respawn | reverse_direction ]

      vehicle <platform-type>
         fraction <fractional-quantity>
         mean_speed <speed-value>
         sigma_speed <speed-value>
      end_vehicle

      convoy
         start_position <latitude> <longitude>
         end_position <latitude> <longitude>
         spacing <length-unit>
         speed <speed-value>
         use_closest_waypoint
         vehicle <number> <platform-type>
      end_convoy

      weighted_region
         latitude <latitude>
         longitude <longitude>
         inner_radius <length-unit>
         outer_radius <length-unit>
         inner_weight <fractional-quantity>
         outer_weight <fractional-quantity>
      end_weighted_region
   end_network
end_road_traffic
```

## Commands

### network ... end_network

Defines the attributes and vehicle populations that are generated on the named `route_network`.

### vehicle_count

**Syntax:** `vehicle_count <number>`

### vehicle_density

**Syntax:** `vehicle_density <number> per <length-unit>`

### maximum_speed

**Syntax:** `maximum_speed <speed-value>`

### mean_travel_time

**Syntax:** `mean_travel_time <time-value>`

### sigma_travel_time

**Syntax:** `sigma_travel_time <time-value>`

### minimum_distance_off_road

**Syntax:** `minimum_distance_off_road <length-unit>`

### maximum_distance_off_road

**Syntax:** `maximum_distance_off_road <length-unit>`

### pause_time_off_road

**Syntax:** `pause_time_off_road <time-value>`

### end_of_path_option

**Syntax:** `end_of_path_option [ respawn | reverse_direction ]`

### vehicle ... end_vehicle

Defines a specific vehicle type within the network.

### convoy ... end_convoy

Defines a convoy that moves between two endpoints on the road network.

### weighted_region ... end_weighted_region

Defines a weighted region where a higher density of vehicles should be created.
