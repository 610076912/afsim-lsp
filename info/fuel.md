# fuel

**Script Class:** `WsfFuel`

## Overview

A fuel object defines the rate at which fuel is expended on the platform. For each `platform`, total mass is assumed to be the sum of empty mass, fuel mass, and payload mass. Empty mass is generally a fixed quantity, payload varies perhaps only at discrete events, but fuel quantities are consumed continuously. The `fuel` object is called whenever the platform moves and updates the amount of fuel expended. The resulting fuel amount is supplied back to the platform, so that total mass is readily available for Newtonian dynamics and other such calculations.

> **Note:** If a platform does not have a `fuel` object, run-time fuel computations will not be performed, but a fixed fuel quantity may still be supplied as `platform` input.

## Syntax

### fuel ... end_fuel

Define a fuel type (occurs outside a platform or platform_type command):

```wsf
fuel <new-type> <base-type>
   ... Platform_Part_Commands ...

   maximum_quantity ...
   initial_quantity ...
   reserve_quantity ...
   mode ...
   set_mode ...

   on_bingo ... end_on_bingo
   on_empty ... end_on_empty
   on_refuel ... end_on_refuel
   on_reserve ... end_on_reserve

   ... type-specific fuel commands ...
end_fuel
```

Instantiate a fuel object on a new platform type:

```wsf
platform_type ...
   fuel <type>
        ... desired attributes and commands ...
   end_fuel
end_platform
```

Instantiate a (not previously existing) fuel object on a platform instance:

```wsf
platform ...
   add fuel <type>
        ... desired attributes and commands ...
   end_fuel
end_platform
```

Modify a (previously existing) fuel object on a platform instance:

```wsf
platform ...
   edit fuel
        ... additional/changed/overwritten attributes and commands ...
   end_fuel
end_platform
```

## Commands

### maximum_quantity

**Syntax:** `maximum_quantity <mass-value>`

Defines the maximum quantity of fuel that can be carried.

**Default:** infinity

### initial_quantity

**Syntax:** `initial_quantity <mass-value>`

Defines the initial quantity of fuel.

**Default:** 0 kg

### reserve_quantity

**Syntax:** `reserve_quantity <mass-value>`

Defines the threshold such that when the quantity of fuel remaining falls below this value, the platform is considered to be operating on reserves. If an on_reserve block is defined, it will be executed when this state is reached.

**Default:** 0 kg

### bingo_quantity

**Syntax:** `bingo_quantity <mass-value>`

Defines the threshold such that when the quantity of fuel remaining falls below this value, the platform is considered to be in BINGO. If an on_bingo block is defined, it will be executed when this state is reached.

**Default:** 0 kg

### mode

**Syntax:** `mode <mode-name>`

Specifies the name of the mode to be used for fuel types that support modes.

### set_mode

**Syntax:** `set_mode <mode-name>`

Sets the active fuel mode at input-processing time. This is defined in `wsf.ag` as a base fuel command alongside `mode`.

## Script Interface

In each of the following scripts, the following variables will be predefined:

* `WsfFuel` this;              // This fuel object
* `WsfPlatform` PLATFORM;      // The platform containing this fuel object
* double TIME_NOW;              // The current simulation time

### on_bingo

**Syntax:** `on_bingo ... <script-definition> ... end_on_bingo`

Defines a script to be executed when the quantity of fuel remaining falls below the threshold defined by bingo_quantity.

### on_empty

**Syntax:** `on_empty ... <script-definition> ... end_on_empty`

Defines a script to be executed when all fuel has been expended.

### on_reserve

**Syntax:** `on_reserve ... <script-definition> ... end_on_reserve`

Defines a script to be executed when the quantity of fuel remaining falls below the threshold defined by reserve_quantity.

### on_refuel

**Syntax:** `on_refuel ... <script-definition> ... end_on_refuel`

Defines a script to be executed when a refueling operation has been completed.

## Type: WSF_TABULAR_RATE_FUEL

**Script Class:** `WsfFuel`

### Overview

`WSF_TABULAR_RATE_FUEL` specifies a fuel consumption rate model. It defines fuel consumption behavior at either constant rates (zero independent variables), or at variable rates based upon one to three independent variables (the choices are platform altitude, mass (weight), and speed). By default, `fuel` mode is ignored, and only one table is accepted; but multiple tables may be defined for different modes if desired. The active table is switched by setting the `fuel` mode, unless there is no table defined for the new mode, in which case the active table will not change.

This model differs from the similar `WSF_VARIABLE_RATE_FUEL`, in several ways; namely that `WSF_TABULAR_RATE_FUEL` tables must be rectangular (the number of dependent variables (rates) must match the product of the number of each of the independent variables (number of speeds * number of weights * number of altitudes)), and `WSF_TABULAR_RATE_FUEL` allows for 1-D, 2-D, or 3-D tables. (`WSF_VARIABLE_RATE_FUEL` input format is more flexible for the user, but it does not allow for 3-D table creation; it is maintained for backward compatibility with certain applications.)

Inside the fuel_table block for multi-dimensional tables, the user may list the speeds, altitudes, or weights blocks in any order. The IV listed first will be considered the "outer" slowest changing index in the table, while the last IV listed will be considered the "inner" fastest changing index. The corresponding rates block must then have the outer, middle, and inner indices changing likewise. (Internally, the table lookup routines are more computationally efficient if the IV which varies the most is selected as the inner index, which is preferred.)

> **Note:** All independent variable arrays may be unevenly spaced, but there must be at least two values and the values must be in ascending order.

> **Note:** In this parlance, a fuel_table is being defined, even if it is a single constant fuel flow rate value.

### Syntax

```wsf
fuel <name> WSF_TABULAR_RATE_FUEL
   Platform_Part_Commands ...
   fuel Commands ...

   fuel_table
      mode  <mode-name>
      constant  <mass-flow-value>
      speeds  units <speed-units> <speed_1> ... <speed_2> end_speeds
      altitudes  units <length-units> <altitude_1> ... <altitude_n> end_altitudes
      weights  units <mass-units> <mass_1> ... <mass_n> end_weights
      masses  units <mass-units> <mass_1> ... <mass_n> end_masses
      rates  units <mass-flow-units> <mass_flow_1> ... <mass_flow_n> end_rates
   end_fuel_table
end_fuel
```

### Commands

### fuel_table ... end_fuel_table

One or more fuel_table blocks may be provided.

#### mode

**Syntax:** `mode <mode-name>`

This specifies the fuel mode that a table is valid for. If only one fuel flow table is supplied, and is to be used regardless of the `fuel` mode, then do not supply this value. If multiple fuel rate tables are provided, then each table must be supplied this discriminator, to allow switching between tables. Fuel mode is accessible for change via script interface.

#### constant

**Syntax:** `constant <mass-flow-value>`

This specifies a constant fuel consumption rate.

#### speeds

**Syntax:** `speeds units <speed-units> <speed_1> ... <speed_2> end_speeds`

This specifies an independent variable arbitrary-sized array of speed values (must be in increasing order) that will apply to the independent fuel flow rate values that follow. This command is mutually exclusive with the mach command.

#### mach

**Syntax:** `mach <mach_1> ... <mach_2> end_mach`

This specifies an independent variable arbitrary-sized array of mach values (must be in increasing order) that will apply to the independent fuel flow rate values that follow. This command is mutually exclusive with the speeds command.

#### altitudes

**Syntax:** `altitudes units <length-units> <altitude_1> ... <altitude_n> end_altitudes`

This specifies an independent variable arbitrary-sized array of altitude values (must be in increasing order) that will apply to the independent fuel flow rate values that follow.

#### weights

**Syntax:** `weights units <mass-units> <mass_1> ... <mass_n> end_weights`

This specifies an independent variable arbitrary-sized array of weight values (must be in increasing order) that will apply to the independent fuel flow rate values that follow. (The keyword "masses" is equivalent.)

#### masses

**Syntax:** `masses units <mass-units> <mass_1> ... <mass_n> end_masses`

This specifies an independent variable arbitrary-sized array of mass values (must be in increasing order) that will apply to the independent fuel flow rate values that follow. (The keyword "weights" is equivalent.)

#### rates

**Syntax:** `rates units <mass-flow-units> <mass_flow_1> ... <mass_flow_n> end_rates`

This specifies the dependent variable values corresponding to the 1-D, 2-D, or 3-D independent variables that precede this keyword. The number of values supplied *must* match the product of the number of independent values in each supplied dimension (i.e. a table of 6 speeds and 4 altitudes must contain 24 fuel flow values).

### Example

```wsf
fuel FuelExample WSF_TABULAR_RATE_FUEL
   maximum_quantity 7000 lb
   initial_quantity 6750 lb
   reserve_quantity 1500 lb
   mode GROUND_IDLE # Sets the mode in the Fuel Object
   fuel_table
      mode FLIGHT_IDLE # Sets the mode ONLY for this table (optional)
      constant 800 lb/hr
   end_fuel_table
   fuel_table
      mode CLIMB # Sets the mode ONLY for this table (optional)
      altitudes
         units ft
         0 20000 40000
      end_altitudes
      mach # mutually exclusive with speeds
         .25 .5 .75 1.0
      end_mach
      speeds
         units fps
         200 400 600 800
      end_speeds
      rates
         units lb/hr
         # .25   .5   .75   1.0 mach
         3000  4500  5500  7000  # Sea Level
         2000  3500  4500  6000  # 20 kft
         1000  2500  3500  5000  # 40 kft
      end_rates
   end_fuel_table
   fuel_table
      mode CRUISE # Sets the mode ONLY for this table (optional)
      weights
         units lb
         5000 50000
      end_weights
      altitudes
         units ft
         0 20000 40000
      end_altitudes
      speeds # mutually exclusive with mach
         units fps
         200 400 600 800
      end_speeds
      rates
         units lb/hr
         # s1, s2, s3, s4
            1   2   3   4  # w1 and a1
            5   6   7   8  # w1 and a2
            9  10  11  12  # w1 and a3
                           #
           13  14  15  16  # w2 and a1
           17  18  19  20  # w2 and a2
           21  22  23  24  # w2 and a3
      end_rates
   end_fuel_table
end_fuel
```

## Type: WSF_VARIABLE_RATE_FUEL

### Overview

WSF_VARIABLE_RATE_FUEL is a fuel consumption rate model. This class defines fuel consumption behavior, at either constant rates, or at variable rates based upon one or two independent variables (the choices are platform altitude and speed). By default, one fuel table is accepted, independent of fuel mode. However, multiple tables may be defined for different fuel modes, if supplied, and the active table will be switched by setting the fuel mode. (This model differs from the similar `WSF_TABULAR_RATE_FUEL` in that `WSF_VARIABLE_RATE_FUEL` input format is more flexible, and need not be rectangular. `WSF_TABULAR_RATE_FUEL` should be preferred for allowing for up to three independent variables, but `WSF_VARIABLE_RATE_FUEL` is maintained for backward compatibility with several legacy applications.)

### Syntax

```wsf
fuel <name> WSF_VARIABLE_RATE_FUEL
   Platform_Part_Commands ...
   fuel Commands ...
   table_for_mode <mode-name>
   rates
      altitude <length-value>
      speed <speed-value>
      rate <mass-flow-value>
   end_rates
end_fuel
```

### Commands

#### table_for_mode

**Syntax:** `table_for_mode <mode-name>`

Indicates that the following rate definitions are for the named mode. Modes are typically used to specify the rate of consumption for various configurations (e.g., 'cruise'). The user is responsible for changing modes either through the script interface or from custom code. If this command is not supplied then the rate definitions apply universally, and fuel mode is ignored.

#### rates ... end_rates

```wsf
rates
  altitude ...
    speed ...
    .
    .
  altitude ...
  .
  .
end_rates
```

##### altitude

**Syntax:** `altitude <length-value>`

Specifies the altitude that the subsequent speed data is valid for. The altitude blocks must be in increasing numerical order. The consumption rate will be computed using a linear interpolation on the current altitude.

##### speed

**Syntax:** `speed <speed-value>`

Specifies the speed that the subsequent rate entry applies to. The speed entries must be in increasing numerical order.

##### rate

**Syntax:** `rate <mass-flow-value>`

Specifies the fuel consumption rate for the current altitude/speed entry. The consumption rate will be computed using a linear interpolation on the current altitude and speed.

## Type: WSF_TANKED_FUEL

### Overview

**%%%IMPLEMENTATION OF WSF_TANKED_FUEL IS INCOMPLETE, AND DEPRECATED UNTIL FURTHER NOTICE.%%%**

`WSF_TANKED_FUEL` is a special `WSF_TABULAR_RATE_FUEL` embedded within a platform that can be refueled or can refuel other platforms. The fuel quantity is off-loaded from the instance of `WSF_TANKED_FUEL` on the Supplier to the `WSF_TANKED_FUEL` on the Receiver.

### Syntax

```wsf
fuel <new_type> <base_type>
   Platform_Part_Commands ...
   ... Common fuel Commands ...
   ... WSF_TABULAR_RATE_FUEL Commands ...

   // Commands associated with supplying fuel...

   supply_method_preference ...
   supply_location_preference ...
   supply_point ...

   // Commands associated with receiving fuel...

   maximum_refuel_quantity ...
   desired_top_off_quantity ...
   maximum_receive_rate ...
   receive_method ...
end_fuel
```

### Commands

#### desired_top_off_quantity

**Syntax:** `desired_top_off_quantity <mass-value>`

Specifies the lower value on a band of desired operating fuel quantity. This value, along with maximum_refuel_quantity, specifies the hysteresis band to stay within while operating in proximity to a refueling tanker, such as during a group ferry flight. In other words, when fuel quantity transitions from above this quantity to below, it is desired to begin a fuel receive operation from a nearby tanker if possible. Script operations may key upon this transition, in order to take a desired action. Conversely, when the fuel quantity transitions from below maximum_refuel_quantity to above, a separate scripted action may be taken, such as to terminate the receive-in-process action.

**Default:** 0

#### maximum_receive_rate

**Syntax:** `maximum_receive_rate <mass-flow-rate>`

Specifies the maximum rate at which the platform can be refueled.

**Default:** 0

#### maximum_refuel_quantity

**Syntax:** `maximum_refuel_quantity <mass-value>`

Specifies the upper value on a band of desired operating fuel quantity. See desired_top_off_quantity for more detail.

**Default:** 0

#### receive_method

**Syntax:** `receive_method [ hose | boom ]`

Sets the method that this tanked fuel may use to receive fuel. At the time a fuel supply operation between two tanks is initiated, the Tanker must have an available fuel supply point that matches the Receiver's configuration, or the transfer cannot begin. See supply_method_preference.

**Default:** NO_METHOD - Not enabled to receive fuel.

#### supply_location_preference

**Syntax:** `supply_location_preference [ wing | center ]`

Sets the *preferred* location that this tanked fuel may use to supply fuel. Often a tanker may have multiple stations to supply fuel, leading to some ambiguity about which transfer point should be used, so this setting is consulted to resolve the ambiguity, if necessary. Run-time software is permitted to change this setting to reconfigure to an anticipated receiver arrival.

**Default:** NO_PREFERENCE - No expressed preference for refueling location.

#### supply_method_preference

**Syntax:** `supply_method_preference [ hose | boom ]`

Sets the *preferred* method that this tanked fuel may use to supply fuel. Often a tanker may have multiple methods to supply fuel, leading to some ambiguity about which type of transfer should be attempted, so this setting is consulted to resolve the ambiguity, if necessary. At the time a fuel supply operation between two tanks is initiated, the Tanker must have an available fuel supply point type that matches the Receiver's configuration, or the transfer cannot begin. See receive_method. Run-time software is permitted to change this setting to reconfigure to an anticipated receiver arrival.

**Default:** NO_METHOD - No expressed preference refueling method.

#### supply_point

**Syntax:** `supply_point [ left | center | right ] [ boom | hose ] '<mass-flow-rate>'`

Specify the maximum flow rate for a fuel supply point station. This value may be reduced if the receiver's maximum receive rate is less. This command should be repeated for each available refueling station.
