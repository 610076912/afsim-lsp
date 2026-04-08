# global_environment

## Syntax

```wsf
global_environment
   land_cover ...
   land_formation ...
   sea_state ...
   wind_speed ...
   wind_direction ...

   wind_table
      <altitude-value> <wind-direction-value> <wind-speed-value>
      ...   // wind_table data sets in order of increasing altitudes.
      ...
   end_wind_table

   cloud_altitude_limits ...
   cloud_water_density ...

   rain_altitude_limit ...
   rain_rate ...

   central_body
     polar_offset_angles ...
   end_central_body

end_global_environment
```

## Overview

The global_environment block defines the attributes of the global environment. Various objects make use of data defined in this block.

## Commands

### land_cover <land-cover-type>

Specify the land cover for the `receiver` clutter model. Valid values are:

- general
- urban
- agricultural
- rangeland_herbaceous
- rangeland_shrub
- forest_deciduous
- forest_coniferous
- forest_mixed
- forest_clear_cut
- forest_block_cut
- wetland_forested
- wetland_non_forested
- desert

**Default:** general

### land_formation <land-formation-type>

Specify the land formation for the `receiver` clutter model. Valid values are:

- level
- inclined
- undulating
- rolling
- hummocky
- ridged
- moderately_steep
- steep
- broken

**Default:** level

### sea_state <value>

Specify the sea state for the `receiver` clutter model. Valid values are 0 - 6.

| Degree | Height (m)   | Description      |
|--------|-------------|------------------|
| 0      | no wave     | Calm (Glassy)    |
| 1      | 0 - 0.10    | Calm (Rippled)   |
| 2      | 0.10 - 0.50 | Smooth           |
| 3      | 0.50 - 1.25 | Slight           |
| 4      | 1.25 - 2.50 | Moderate         |
| 5      | 2.50 - 4.00 | Rough            |
| 6      | 4.00 - 6.00 | Very Rough       |

**Default:** 0

### wind_speed <speed-value>

Specify the wind speed.

**Default:** 0 m/s

### wind_direction <angle-value>

Specify the wind direction.

**Default:** 0 deg

> **Note:** WSF wind direction is the direction to which the wind flows; not from where it comes.

### wind_table ... end_wind_table

Specify wind-value-data sets using 3 parameters per entry (from lowest altitude to highest): altitude <length-value> wind direction <angle-value> wind speed <speed-value>.

```wsf
wind_table
       0 ft    90 deg   20 kts
    5000 ft    95 deg   25 kts
   10000 ft   100 deg   30 kts
   15000 ft   100 deg   35 kts
   20000 ft   120 deg   40 kts
   25000 ft   125 deg   45 kts
   30000 ft   125 deg   50 kts
   35000 ft   130 deg   55 kts
   40000 ft   130 deg   60 kts
end_wind_table
```

**Default:** If no wind_table, then WSF defaults to values assigned to wind_speed and wind_direction.

> **Note:** WSF wind direction is the direction to which the wind flows; not from where it comes.

> **Note:** Insert altitudes in order from lowest to highest.

### cloud_altitude_limits <length-value> <length-value>

Specify the minimum and maximum altitude extent in which clouds are defined to occur. This is used by some `attenuation_model` models.

**Default:** 0 m 0 m (no clouds)

### cloud_water_density <mass-density-value>

Specify the density of water within the cloud. This is used by some `attenuation_model` models.

**Default:** 0 kg/m^3

### rain_altitude_limit <length-value>

Specify the altitude below which rain is present. This is used by some `attenuation_model` models.

**Default:** 0 m

### rain_rate <speed-value>

Specify the rainfall accumulation rate. This is used by some `attenuation_model` models.

**Default:** 0 m/s

### central_body ... end_central_body

Specify the central body and related ellipsoid model to be used by simulation platforms. Options for *<central body type>* are the following:

- **earth_wgs72** (Earth World Geodetic System 1972): The central body ellipsoid is defined according to the WGS-72 standard.
- **earth_wgs84** (Earth World Geodetic System 1984): The central body ellipsoid is defined according to the WGS-84 standard.
- **earth_egm96** (Earth Gravity Model 1996): The central body ellipsoid is defined according to the EGM-96 standard.
- **moon**: The central body ellipsoid is defined according to published lunar parameters.
- **sun**: The central body ellipsoid is defined according to published solar parameters.
- **jupiter**: The central body ellipsoid is defined according to published Jovian parameters.

**Default:** earth_wgs84

```wsf
central_body <central-body-type>
   polar_offset_angles ...
end_central_body
```

#### polar_offset_angles <angle-value> <angle-value>

Specify the central_body's polar offset angles (x_p and y_p, respectively) of the Celestial Intermediate Pole (CIP) with respect to the WCS (ITRS) coordinate system. Providing these values (of the order of tenths of arc-seconds) enables very highly accurate conversions between ECI and WCS coordinates.

**Default:** 0.0 rad 0.0 rad

> **Note:** WCS->LLA conversions are affected by central body choice, as well as sidereal motion transforms calculated in inertial (ECI) coordinate conversions.
