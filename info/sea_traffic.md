# sea_traffic

## Overview

The `sea_traffic` block generates background ship traffic during the simulation. It creates ships traveling between ports and local ship traffic surrounding a port.

## Syntax

```wsf
sea_traffic
   port <name> ... end_port
   lane <name> ... end_lane
   departure_traffic <fraction> ... end_departure_traffic
   local_traffic <fraction> ... end_local_traffic
end_sea_traffic
```

## Commands

### port ... end_port

Defines a port that ship traffic originates and terminates at.

```wsf
port <name>
   position <latitude-value> <longitude-value> <length-value>
   port_route
      position <latitude-value> <longitude-value> <length-value>
   end_port_route
   local_traffic_region <latitude-value> <longitude-value> <length-value> <fractional>
   departure_interval <time-value>
   use_all_lanes
   lane <name> <weighting-factor>
end_port
```

### lane ... end_lane

Defines a sea lane used by ship traffic to travel between ports.

```wsf
lane <name>
   port <port-name> [ ignore_port_route ]
   lane_route
      position <latitude-value> <longitude-value> <length-value>
   end_lane_route
end_lane
```

### departure_traffic ... end_departure_traffic

Defines ship traffic that leaves a port and travels to another port.

```wsf
departure_traffic <fraction>
   ship <platform-type>
      fraction <fraction>
      mean_speed <speed>
      sigma_speed <speed>
   end_ship
end_departure_traffic
```

### local_traffic ... end_local_traffic

Defines ship traffic that leaves a port and heads to a local traffic region.

```wsf
local_traffic <fraction>
   ship <platform-type>
      fraction <fraction>
      mean_loiter_time <time>
      sigma_loiter_time <time>
      loiter_route <name>
      mean_speed <speed>
      sigma_speed <speed>
   end_ship
end_local_traffic
```
