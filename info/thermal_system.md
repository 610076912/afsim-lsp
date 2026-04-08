# thermal_system

## Syntax

```wsf
thermal_system
   simple
   debug <boolean-value>

   // Detailed Thermal System Commands

   component_type <string-value>
      latent_heat <real-value>
      phase_change <temperature-value>
      specific_heat_capacity <real-value>
      specific_heat_capacity_high_temp <real-value>
   end_component_type

   initial_temperature <temperature-value>
   heat_sink <power-value>

   // Simple Thermal System Commands

   heating_time <time-value>
   recharge_rate <real-value>

end_thermal_system
```

## Overview

The thermal_system model allows one to specify a simple thermal system with a dynamic heat transfer. The system is modeled such that all components are at the same temperature. One can model either an entire heat-exchange system by defining various components with specified thermal properties, or one can define a "simple" thermal system with the `recharge_rate` and `heating_time` inputs.

## Commands

### simple

Specify a simple thermal system.

**Default:** (Not set); specify a detailed thermal system.

### debug <boolean-value>

Specify whether debug messages are written to std::out.

## Detailed Thermal System Commands

### Component Type Commands

> **Note:** Currently heat-related units are not defined in WSF, so these inputs are specified as numbers without units. These must be in standard "mks" format (joules, kg, and degrees K).

#### component_type <string-value>

Specify the name of the component (e.g., Tungsten, Lead, etc.) The types for "water" and "aluminum" are pre-defined and do not need to be specified in component_type blocks; all others require this specification.

#### latent_heat <real-value>

For a thermal component, provide the specific latent heat for the component, in J/kg (do not specify the units), that the component must absorb or release in its phase change.

#### phase_change <temperature-value>

For a thermal component, specify the temperature at which the phase change (e.g., solid->liquid) occurs.

#### specific_heat_capacity <real-value>

For a thermal component, provide the specific heat capacity for the component, in J/kg/degree Kelvin (do not specify the units). This is the heat capacity at temperatures below the enthalpy / state change.

#### specific_heat_capacity_high_temp <real-value>

For a thermal component, provide the specific heat capacity for the component, in J/kg/degree Kelvin (do not specify the units). This is the heat capacity at temperatures above the enthalpy / state change.

#### component <string-value> <mass-value>

Specify the name of the component, using existing types as defined in a `component_type` block, and the mass of the component. Provide one input for each type of material. One can also use the pre-existing types of "water" and "aluminum."

> **Note:** Water is defined to have a specific heat capacity, as ice, of 2050 J/kg/C, a specific heat capacity, as water, of 4181 J/kg/C, a latent heat of 333550 J/kg, and a phase change temperature of 273.15 K. Aluminum has a specific heat capacity of 897 J/kg/C. Aluminum is assumed always solid.

#### heat_sink <power-value>

This is the power taken out of the system for cooling. You must specify a value in order for cooling to occur.

#### initial_temperature <temperature-value>

The initial temperature of the system before any heat transfer occurs.

**Default:** (the target_temperature value)

#### target_temperature <temperature-value>

The target temperature for cooling; the temperature will not go below this value.

**Example:**

```wsf
// Thermal system definition
thermal_system

   // Any new types defined in a component_type block.
   // The specific heat capacity must be specified.
   component_type antifreeze
      specific_heat_capacity 1000 //J/kg/degree(K)
      specific_heat_capacity_high_temp 2000
      enthalpy 300000 //J/kg
      phase_change -20 C
   end_component_type

   // Define components using existing types ("water" and "aluminum")
   // are the only pre-defined types.
   component antifreeze 40 lb
   component aluminum 200 lb
   initial_temperature -21 C

   // The target temperature is the goal temperature for cooling.
   // The temperature will not go below this value.
   target_temperature -21 C

   // This is the power taken out of the system for cooling.
   // You must specify a value in order for cooling to occur.
   heat_sink 10000 W
end_thermal_system
```

## Simple Thermal System Commands

When detailed specification of a thermal system is unavailable, use of the simple thermal system provides the concept of an initial total heating time and a recharge rate for cooling (if heat is no longer applied to the system, the total heating time is regained in time heating_time / recharge_rate).

### heating_time <time-value>

This is the total time available for applying heat to the thermal system. In a high-energy laser this is the same as the total firing time available.

### recharge_rate <real-value>

This is the rate at which the system cools, once heat is removed from the system. It is a unitless value (seconds of firing time regained per second of simulation time).

**Example:**

```wsf
// Thermal system definition
thermal_system
   // Using the "simple" thermal system.
   simple                 // Use simple thermal system.
   heating_time 60.0 s   // same as total firing time
   recharge_rate 0.5     // sec of firing time regained per second of clock time (dimensionless).
   //debug enabled
end_thermal_system
```
