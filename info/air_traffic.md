# air_traffic

## Overview

The `air_traffic` block generates background air traffic during the simulation. It defines aircraft types, airbases, and departure/landing behavior.

## Syntax

```wsf
air_traffic
   aircraft_type <aircraft-type> ... end_aircraft_type
   airbase <airbase-name> <latitude> <longitude> ... end_airbase
   everyone_land_time <time-value>
   remove_completed_flights
end_air_traffic
```

## Commands

### aircraft_type ... end_aircraft_type

Defines the attributes of an aircraft that can be controlled by the air traffic manager. `<aircraft-type>` must already be a previously defined `platform_type`.

#### minimum_cruise_altitude

**Syntax:** `minimum_cruise_altitude <length-value>`

#### maximum_cruise_altitude

**Syntax:** `maximum_cruise_altitude <length-value>`

#### mean_cruise_speed

**Syntax:** `mean_cruise_speed <speed-value>`

#### sigma_cruise_speed

**Syntax:** `sigma_cruise_speed <speed-value>`

#### maximum_operating_range

**Syntax:** `maximum_operating_range <length-value>`

#### minimum_runway_length

**Syntax:** `minimum_runway_length <length-value>`

#### local

**Syntax:** `local`

#### mean_loiter_time

**Syntax:** `mean_loiter_time <time-value>`

#### sigma_loiter_time

**Syntax:** `sigma_loiter_time <time-value>`

#### loiter_route

**Syntax:** `loiter_route <route-name>`

### airbase ... end_airbase

Defines an airbase from which aircraft can depart or arrive.

```wsf
airbase <airbase-name> <latitude> <longitude>
   runway_length <length-value>
   runway_heading <heading>
   runway <beg-lat> <beg-lon> <end-lat> <end-lon>
   departure_interval <time-value>
   deactivation_time <time-value>
   aircraft <aircraft-type> <fraction>
   destination <airbase-name> <fraction>
   local_destination <latitude> <longitude> <length-value> <fractional-quantity>
end_airbase
```

### everyone_land_time

**Syntax:** `everyone_land_time <time-value>`

Specifies a time for all background air traffic to land.

### remove_completed_flights

**Syntax:** `remove_completed_flights`

This command is documented in the manual, but the upstream page does not currently provide additional detail beyond its presence in the block.
