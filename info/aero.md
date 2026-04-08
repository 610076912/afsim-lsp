# aero

## Syntax

```wsf
aero <new-type-name> <base-type-name>
   debug
   reference_area  <area-value>
   aspect_ratio  <float-value>
   oswalds_factor  <float-value>
   cl_max  <float-value>
   mach_and_cd  <float-value> <float-value>
   cd_zero_subsonic  <float-value>
   mach_begin_cd_rise  <float-value>
   cd_zero_supersonic  <float-value>
   mach_end_cd_rise  <float-value>
   subsonic_cd_slope  <float-value>
   supersonic_cd_slope  <float-value>
   mach_max_supersonic  <float-value>
end_aero
```

*<new-type-name>* Name of the new aero type to be created. This must be unique among all the aero types.

*<base-type-name>* Name of an existing aero type, WSF_AERO, whose definition will be used as the initial definition of the new type.

## Overview

The aero block allows the user to specify simplistic aerodynamic drag and lift properties to approximate forces acting upon a body moving through air. It is used by movers to determine the amount of side force and down force applied to the vehicle which will provide the necessary amount of lateral acceleration to guide to intercept a target track. However, at low dynamic pressures, the desired amount of force may physically exceed the capability of the aerodynamic body. The class will constrain the desired forces to what the specified Clmax is able to generate, reducing both side force and vertical force proportionally. The resulting forces will be made available to the dynamics engine that sums applied forces, calculates accelerations, and integrates those accelerations to determine the motion state of the vehicle.

Aerodynamic drag and lift forces roughly follow the relationship F = q S C, or force (F) equals dynamic pressure (q) times reference area (S) times a coefficient (C), where dynamic pressure is equal to one-half air density times the airspeed squared. Lift coefficient (Cl) values tend to vary linearly with angle of attack, up to a maximum. Drag coefficient (Cd) values follow a parabolic trend, from a minimum value at zero lift, increasing with the square of lift coefficient. A zero-lift drag coefficient of a streamlined body often does not vary significantly until the speed increases beyond a drag-divergent Mach number, where the drag coefficient increases as the Mach number increases through one.

The first aerodynamic consideration for the user is to estimate a zero-lift drag coefficient (Cdo) of the body under consideration. The zero-lift drag coefficient is reflective of parasitic drag, which makes it somewhat synonymous with how "clean" or streamlined an aero body is. There are three ways to specify this Cdo value:

- For low speed use, far below the speed of sound where compressibility of the air flow becomes problematic, a single constant value is acceptable. Supply it using the `zero_lift_cd` keyword.
- If a zero-lift drag coefficient table (versus Mach number) is already known for the aerodynamic body, provide them using the `mach_and_cd` keyword repeatedly, in increasing Mach number order.
- If the user can supply two key drag coefficient values, the class will attempt to fill in the rest. The user-supplied keywords to accomplish this are: `mach_begin_cd_rise` paired with `cd_zero_subsonic`, and `mach_end_cd_rise` paired with `cd_zero_supersonic`.

The three different ways to specify Cdo are mutually exclusive and cannot be intermixed.

The next aerodynamic consideration for the user is to specify how drag due to lift (induced drag) is calculated. This is a function of `aspect_ratio`, `oswalds_factor`, and lift coefficient (as limited by `cl_max`).

This simple aero implementation does not consider the angle of attack needed to generate a particular lift coefficient. Platform orientation is placed directly along the velocity vector.

## Commands

### debug

Enables debug printouts during run time.

### reference_area <area-value>

Aerodynamic reference area. This is usually the platform (top view) wing area for an airplane. The reference area is a means to translate a non-dimensional force coefficient into an actual force (force equals coefficient times dynamic pressure times reference area).

### aspect_ratio <float-value>

Aspect ratio (AR) for a wing is the wingspan squared divided by its area, a non-dimensional quantity. A higher value tends to produce lift more efficiently, with a lesser quantity of induced drag (drag due to lift). For subsonic airplanes, it is often acceptable to use an idealized parabolic drag polar approximating reality: Cd = Cdo + k * Cl^2, where k = 1.0 / (Pi * AR * e)

### oswalds_factor <float-value>

Oswald's efficiency factor (usually designated e) is an empirically determined value to calculate an amount of induced drag inevitably associated with generation of lift, approximated per the following equation: Cd = Cdo + k * Cl^2, where k = 1.0 / (Pi * AR * e), Cdo is zero-lift drag coefficient, AR is Aspect Ratio, e is Oswald's factor, Cl is lift coefficient, and Cd is total drag coefficient.

**Default:** 0.95

### cl_max <float-value>

Lift Coefficient Maximum. This value specifies the maximum lift aerodynamically obtainable by the vehicle. Full airplane Clmax tend to be 1.4 or so.

### zero_lift_cd <float-value>

Zero-lift drag coefficient. Single value given for low-speed aerodynamics only, when flow is incompressible.

### mach_and_cd <float-value> <float-value>

Mach number and corresponding Cdo at that Mach number. Specify a drag table by supplying this keyword multiple times, in increasing Mach numbers.

### cd_zero_subsonic <float-value>

Zero-lift drag coefficient, just prior to transonic drag rise region. The corresponding Mach number at which this drag rise begins is specified using `mach_begin_cd_rise`.

### mach_begin_cd_rise <float-value>

Mach number at which a transonic drag rise begins. This value must be less than 1.0, and is typically about 0.78 to 0.86. The corresponding drag coefficient at which this drag rise begins is specified using `cd_zero_subsonic`.

### cd_zero_supersonic <float-value>

Zero-lift drag coefficient at the end of the transonic drag rise. The corresponding Mach number at which this drag rise ends is specified using `mach_end_cd_rise`.

### mach_end_cd_rise <float-value>

Mach number at which a transonic drag rise ends. This value must be greater than 1.0, and is typically in the 1.05 to 1.2 region. At Mach numbers greater than this value, Cdo values often begin decreasing, but total drag still increases because of the velocity quadratic relationship. The corresponding drag coefficient at which this drag rise ends is specified using `cd_zero_supersonic`.

### subsonic_cd_slope <float-value>

Change in zero-lift drag coefficient with increasing Mach number, in the region below the transonic drag rise.

**Default:** 1.0

### supersonic_cd_slope <float-value>

Change in zero-lift drag coefficient with increasing Mach number, in the region above the transonic drag rise. This value may be positive or negative.

**Default:** 1.0

### mach_max_supersonic <float-value>

Specify this value to arrest a continuous rise or decline in drag coefficient with increasing Mach number, in the region above the transonic drag rise. If the Mach number is higher than this specified value, the zero-lift drag coefficient will be held constant.
