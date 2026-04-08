# zone

## Overview

A zone represents a geographic region. Geographic points may be tested for containment within zones, enabling entities to behave dynamically based on the result of a given check. A zone is defined by the following properties:

- **Context** - Context determines which entities may access a given zone.
- **Geometry** - The shape and size of a zone.
- **Bounds** - The linear and angular bounds which constrain a given geometry.
- **Reference Frame and Pose** - The position and heading of a zone relative to a defined frame of reference.

## Syntax

```wsf
zone <zone-name>

   debug

   position <latitude-value> <longitude-value> | reference_platform <platform-name>
   heading <angle-value>                       |

   references <zone-name>

   minimum_altitude <length-value>
   maximum_altitude <length-value>

   positive | negative

   aux_data <aux_data> ... end_aux_data

   fill_color <color-value>
   line_color <color-value>

   circular
      minimum_radius <length-value>
      maximum_radius <length-value>
      start_angle <angle-value>
      stop_angle <angle-value>

   spherical
      minimum_radius <length-value>
      maximum_radius <length-value>
      start_angle <angle-value>
      stop_angle <angle-value>

   elliptical
      lateral_axis <length-value>
      longitudinal_axis <length-value>
      start_angle <angle-value>
      stop_angle <angle-value>

   polygonal
      point <x-value> <y-value> <length-units>     # if relative (x / y)

      polar                                        # if relative (bearing / range)
         point <angle-value> <length-value>

      lat_lon                                      # if absolute (lat / lon)
         point <latitude-value> <longitude-value>

      mgrs                                         # if absolute (mgrs)
         point <mgrs-value>

      comm_modifier | sensor_modifier | modifier ...
end_zone
```

## Context

A zone is defined in one of the following contexts:

- **Global** - A zone defined in the global context is known as a **Global Zone**. A global zone may be accessed for computation by any entity in the simulation.
- **Local** - A zone defined in a local context is known as a **Local Zone** or a **Platform-Defined Zone**. Local zones may be created in a platform_type definition or a platform definition. For a local zone defined in a platform_type definition, each platform of that type implicitly defines an instance of that zone in its platform definition. For a local zone defined directly in a platform definition, only that platform will have access to the local zone for computation.

## Geometry

The size and shape of a given zone are determined by the zone's geometry. A given geometry generally falls under one of the following categories:

### Planar

A planar geometry is defined by a point or points in two-dimensions. Planar geometries are naturally unbounded in the third dimension when defined in three-dimensional space. Further, planar zones defined by coordinates on a curved three-dimensional surface, such as the Earth's surface, are geometrically conformal to the surface. For absolute zones, this results in cross sections which converge at the Earth's center, and which diverge above the Earth's surface. For relative planar geometries, zone cross sections are conformal to the face of the Earth, observing altitude bounds in conjunction with bounds of offsets/ranges/radii, resulting in zones which do not converge/diverge at different altitudes. Planar geometries are as follows:

- **Polygonal** - A geometry defined by an ordered set of points which make up zone vertices. Points of a given polygonal zone may be defined by one of the following coordinate systems:

  - **Relative** - A point in a relative coordinate system derives meaning from a defined **origin** point. A zone defined by relative points is a **Relative Zone**.

    - **Offset** - An offset defined point provides a pair of distance values which define a lateral and a longitudinal distance from a given origin.
    - **Polar** - A polar defined point provides a bearing and range which define a radial distance from a given origin.

  - **Absolute** - A point in an absolute coordinate system, in this case WCS, inherently provides all positional information unambiguously and without reference to an **origin**. A zone defined by absolute points is an **Absolute Zone**.

    - **Lat/Lon** - Each point is defined by a Latitude and Longitude (lat_lon) pair.
    - **MGRS** - Each point is defined by an alpha-numeric character sequence pair within the *Military Grid Reference System* (mgrs).

- **Circular** - A circular geometry is defined by a maximum_radius (and optionally, a minimum_radius). Circular zones are always relative.
- **Elliptical** - An elliptical geometry is defined by a lateral and longitudinal axis (and optionally, a minimum_radius). Elliptical zones are always relative.

### Non-Planar

A non-planar geometry is defined independently, and is thus unaffected by the curvature of the surface on which it is defined. Non-planar geometries may or may not be inherently bounded in a given dimension.

- **Spherical** - A spherical geometry is defined by a maximum_radius (and optionally, a minimum_radius). All points on the surface of the sphere are co-equal in distance from the sphere's center point. Spherical zones are always relative. The spherical origin is always zero-altitude relative to the reference frame. This means that spherical zones in the WCS appear at an altitude of zero, and spherical zones in the ECS appear at the altitude of the referenced entity. minimum_altitude and maximum_altitude are applied from the WCS reference frame regardless of the zone's reference frame.

## Bounds

**Bounds**, or **Geometric Bounds**, restrict a geometry in a given domain and fall into one of the following categories:

- **Angular Bounds** - Angular bounds are applicable to Radial geometries. When applied, angular bounds constrain the geometry to a specified start_angle and stop_angle from the planar reference frame of the Earth's surface. The zero-angle is determined by the zone's reference frame.
- **Linear Bounds** - Linear bounds are applicable to all geometries. When applied, linear bounds constrain the geometry in a given direction. Currently the minimum_altitude and maximum_altitude commands are available to bound the lower and upper altitude of a given zone, where altitude is always in reference to the Earth's surface.

## Reference Frame and Pose

Pose encapsulates the position and orientation of the object within a reference frame. Because zones do not observe pitch or roll, the pose of a zone includes the position and heading.

Absolute Zones are inherently defined in the World Coordinate System (WCS) reference frame and maintain a static pose. Conversely, Relative Zones may be defined in the WCS or Entity Coordinate System (ECS) reference frame. Relative zones using the WCS reference frame are defined with a static pose which may be altered in script, while those using the ECS reference frame will observe a dynamic pose which aligns with that of the referenced entity, usually a platform.

Because each point of an absolute zone is defined within the WCS reference frame, the pose of the resulting zone is absolute. This means that any use of the position and heading commands in the associated zone definition are ignored.

Unlike absolute zones, a relative zone must define its pose and the reference frame in which that pose applies. The reference frame and pose are defined by:

- Context of the zone definition.
- The reference_platform command.
- The position and heading commands.

When testing for containment within local relative zones, the point being tested for containment must be in the same hemisphere as the platform which defines zone. This prevents points that are almost directly on the other side of the Earth as being considered inside the zone.

## Commands

### Common

#### debug

**Syntax:** `debug`

Enables debug messages during run time when performing zone constraint checking. Especially useful when using the PointIsInside script methods.

#### minimum_altitude

**Syntax:** `minimum_altitude <length-value>`

Minimum altitude constraint (mean sea level).

**Default:** No minimum altitude constraint.

#### maximum_altitude

**Syntax:** `maximum_altitude <length-value>`

Maximum altitude constraint (mean sea level).

**Default:** No maximum altitude constraint.

#### position

**Syntax:** `position <latitude-value> <longitude-value>`

Statically defines the origin of a relative zone.

The reference_platform command should not be used when this command is specified.

If this command is specified on a platform-defined zone, the zone will use the specified position as its origin and it will use the WCS as its reference frame.

#### heading

**Syntax:** `heading <angle-value>`

Used with position to statically specify the orientation of the zone.

The reference_platform command should not be used when this command is specified.

If this command is specified on a platform-defined zone, the zone uses the specified heading and must specify a position to be valid. If position is specified the zone will use the WCS as its reference frame.

#### reference_platform

**Syntax:** `reference_platform <platform-name>`

Defines the pose of a relative global zone using the pose of the specified platform and moves using the ECS reference frame of the platform. Whenever a zone containment check is performed, the pose of the indicated platform is used as that of the zone.

If the reference platform has not been created at the time of a containment check, the check will return false. If the reference platform has been deleted, but at least one containment check was performed while the reference platform existed, the check will be performed using the last known location and heading of the reference platform.

The position and heading commands should not be used when this command is specified.

#### references

**Syntax:** `references <zone-name>`

A reference to another zone. Zones which specify the references command are **Reference Zones**. The geometry of the referenced zone is copied and properties may be overridden through the use of other valid geometry commands.

> **Note:** Commands which are unrelated to the inherited geometry should not be used and if used may result in unexpected behavior.

A Reference Zone is always relative. In order to be valid, a reference zone must do one of the following:

- Specify position explicitly.
- Inherit position from a platform (via `platform.use_zone`, or being platform-defined).
- Inherit position from a reference platform (via reference_platform).

If a reference zone references an absolute zone, the reference zone's origin will align with the first point of the absolute zone. Alternatively, if a reference zone references a relative zone, the reference zone's origin will align with the origin of the relative zone. In either case, position must be provided as indicated above.

#### negative / positive

**Syntax:** `negative` or `positive`

Specifies whether the zone is *negative* or *positive*. A negative zone has the exact opposite area as would be defined by the zone commands. For example, if a circular zone is specified, negating it would represent the area outside the circle.

**Default:** positive

#### aux_data

**Syntax:** `aux_data <aux-data> ... end_aux_data`

Defines auxiliary data for a zone. See `aux_data`.

#### fill_color

**Syntax:** `fill_color <color-value>`

Defines the fill color for a zone.

> **Note:** If color is specified by name, the fill alpha will be set to 63 in the [0, 255] range.

#### line_color

**Syntax:** `line_color <color-value>`

Defines the line color for a zone.

### Radial

#### circular

**Syntax:** `circular`

```wsf
zone <zone_name>
   circular
      minimum_radius <length-value>
      maximum_radius <length-value>
      start_angle <angle-value>
      stop_angle <angle-value>
end_zone
```

#### elliptical

**Syntax:** `elliptical`

```wsf
zone <zone_name>
   elliptical
      lateral_axis <length-value>
      longitudinal_axis <length-value>
      minimum_radius <length-value>
      start_angle <angle-value>
      stop_angle <angle-value>
end_zone
```

#### spherical

**Syntax:** `spherical`

```wsf
zone <zone_name>
   spherical
      minimum_radius <length-value>
      maximum_radius <length-value>
      start_angle <angle-value>
      stop_angle <angle-value>
end_zone
```

#### minimum_radius

**Syntax:** `minimum_radius <length-value>`

Minimum radius constraint.

**Default:** No minimum radius constraint.

> **Note:** For a spherical zone a 3-D test is performed, otherwise a 2-D test is used.

#### maximum_radius

**Syntax:** `maximum_radius <length-value>`

Maximum radius constraint.

**Default:** No maximum radius constraint.

> **Note:** For a spherical zone a 3-D test is performed, otherwise a 2-D test is used.

#### start_angle / stop_angle

**Syntax:** `start_angle <angle-value>` or `stop_angle <angle-value>`

Defines the angular constraint. The angular region starts at start_angle and proceeds *clockwise* to stop_angle. An angle of zero degrees points in the direction of the reference heading (North in WCS, entity heading in ECS).

#### lateral_axis

**Syntax:** `lateral_axis <length-value>`

Lateral axis constraint for an elliptically-shaped zone.

#### longitudinal_axis

**Syntax:** `longitudinal_axis <length-value>`

Longitudinal axis constraint for an elliptically-shaped zone.

> **Important:** A given zone definition should contain either Radial zone commands or Polygonal zone commands, but not both.

### Polygonal

#### polygonal

**Syntax:** `polygonal`

A polygonal zone is defined by a sequence of node points. The following conditions must be observed:

- Points must be ordered in a clockwise direction when viewed from above.
- First and last point must not repeat (i.e., the connection between the last point and the first point is assumed).
- All zone points must be of the same type (All relative x, y, all polar, all lat_lon, or all mgrs).

```wsf
zone <zone_name> polygonal
   point <x-value> <y-value> <length-units> # if relative (x / y)

   polar                                    # if relative (bearing / range)
   point <angle-value> <length-value>       # if relative (bearing / range)

   lat_lon                                  # if absolute (lat / lon)
   point <latitude-value> <longitude-value> # if absolute (lat / lon)

   mgrs                                     # if absolute (mgrs)
   point <mgrs-value>                       # if absolute (mgrs)

   // Repeat point... as many times as needed for each format.
end_zone
```

#### point (relative x/y)

**Syntax:** `point <x-value> <y-value> <length-units>`

A single point in the polygonal-shaped zone, specified using the relative x/y input format. The positive X axis points in the direction of the reference heading and the positive Y axis is 90 degrees clockwise.

> **Note:** This is the default point input format. This format is assumed if polar, lat_lon, or mgrs are not specified.

#### polar

**Syntax:** `polar`

Indicates the point data are provided using bearing-range format (by default the data are assumed to be in relative x/y format).

#### point (polar)

**Syntax:** `point <angle-value> <length-value>`

A single point in the polygonal-shaped zone using the polar input format.

#### lat_lon

**Syntax:** `lat_lon`

Indicates the point data are provided using latitude, longitude format (by default the data are assumed to be in relative x,y format). Zones which specify lat_lon are absolute.

#### point (lat/lon)

**Syntax:** `point <latitude-value> <longitude-value>`

A single point in the polygonal-shaped zone, specified using the absolute lat_lon input format.

#### mgrs

**Syntax:** `mgrs`

Indicates the point data are provided in the form of an MGRS location format (by default the data are assumed to be in relative x,y format). Zones which specify mgrs are absolute.

#### point (MGRS)

**Syntax:** `point <MGRS-value>`

A single point in the polygonal-shaped zone, specified using the absolute mgrs input format.

> **Important:** A given zone definition should contain either Radial zone commands or Polygonal zone commands, but not both.

### Attenuation

#### comm_modifier

**Syntax:** `comm_modifier <category-name> <real-value>`

Specify attenuation to be applied to `comm` and `sensor` device detections. Computed attenuation is proportional to the penetration distance through the zone along detection lines of sight. *\<category-name\>* is the name used as a corresponding modifier_category (`comm.modifier_category` and `sensor.modifier_category`). *\<real-value\>* is a number between 0.0 and 1.0, representing the attenuation value as a percentage loss per meter within the zone. For example, a modifier value of 0.1 means that 10 meters of penetration will cause 100% attenuation.

#### sensor_modifier

**Syntax:** `sensor_modifier <category-name> <real-value>`

Specify attenuation to be applied to `sensor` device detections. See comm_modifier for details.

#### modifier

**Syntax:** `modifier <category-name> <real-value>`

Specify attenuation to be applied to `comm` and `sensor` device detections. See comm_modifier for details.

> **Note:** The modifier keywords are only valid within absolute zone definitions. Zone penetration calculations do not take into account any of the minimum_radius, start_angle, and stop_angle inputs for any zone type; as well as the heading input for the polygonal zone type.

> **Note:** Computed attenuation paths are approximate; see zone-based_attenuation for more information.

---

# zone_set

## Overview

A zone_set is a zone which is composed of discrete zone components known as zone set elements. A zone set element may be either an inclusion zone or an exclusion zone. Further, a zone set element may be either an embedded zone or a use_zone. Embedded zones are defined directly within the definition of the containing zone set. Use zones are copies of externally defined zones which are added to the zone set.

A point is considered to be contained in the zone set if it is contained within at least one inclusion zone and *not* contained in any exclusion zones. To be functional, a zone_set must contain at least one inclusion zone.

A zone_set is a zone. Therefore, a zone set is defined by zone properties, including:

- Set-wise Context
- Element-wise Geometry
- Element-wise Bounds
- Element-wise Reference Frame and Pose

## Syntax

```wsf
zone_set <zone_name>
   zone
      ... zone definition ...
   end_zone

   exclude_zone
      ... zone definition ...
   end_exclude_zone

   attenuation_parameters
      ... attenuation parameters ...
   end_attenuation_parameters

   use_zone <shared_zone_name>
   use_exclude_zone <shared_zone_name>

   fill_color <color-value>
   line_color <color-value>

end_zone_set
```

## Commands

### zone

**Syntax:** `zone ... end_zone`

Create an embedded `zone` that will act as an *inclusion* zone for this `zone_set`.

> **Note:** This command may occur 0 or more times.

### exclude_zone

**Syntax:** `exclude_zone ... end_exclude_zone`

Create an embedded `zone` that will act as an *exclusion* zone for this `zone_set`.

> **Note:** This command may occur 0 or more times.

### use_zone

**Syntax:** `use_zone <shared_zone_name>`

Declare that the specified shared zone is to be an *inclusion* zone for this zone set.

> **Note:** This command may occur 0 or more times.

### use_exclude_zone

**Syntax:** `use_exclude_zone <shared_zone_name>`

Declare that the specified shared zone is to be an *exclusion* zone for this zone set.

> **Note:** This command may occur 0 or more times.

### fill_color

**Syntax:** `fill_color <color-value>`

Defines the fill color for a zone.

> **Note:** If color is specified by name, the fill alpha will be set to 63 in the [0, 255] range.

### line_color

**Syntax:** `line_color <color-value>`

Defines the line color for a zone.

### attenuation_parameters

**Syntax:** `attenuation_parameters ... end_attenuation_parameters`

Defines the variables necessary to define attenuation to the given `zone_set`. Zone-based attenuation provides a mechanism to attenuate an RF or optical signal from a communications or sensor device without resorting to complex propagation algorithms. In order to use this capability, the user must first create `comm` and sensor definitions which include the `sensor.modifier_category` command. Then the user must create one or more `zone_set`s which define the attenuation to be applied for signals that pass through the zone.

```wsf
attenuation_parameters
   file <file-name>
   use_dted
   height_parameter <dbf file-name>
   constant_height <height-value> <unit-type>
   base_altitude_parameter <dbf file-name>
   constant_base_altitude <base altitude-value> <unit-type>
   projection <projection-type>
   sensor_modifier <modifier-name> <modifier-value>
   comm_modifier <modifier-name> <modifier-value>
end_attenuation_parameters
```

#### file

**Syntax:** `file <file-name>`

Declare shape file (.shp) to be imported to represent this `zone_set`. *\<file-name\>* is the name of the ESRI shapefile. Leave the extension off.

#### use_dted

**Syntax:** `use_dted`

If included, the vertical offsets defined in the currently loaded DTED file will be used.

#### height_parameter

**Syntax:** `height_parameter <dbf file-name>`

A parameter in the .dbf file used to define the height of the individual shapes. "" is acceptable input.

#### constant_height

**Syntax:** `constant_height <height-value> <unit-type>`

A constant height to use for all shapes. height_parameter overrides this value.

#### base_altitude_parameter

**Syntax:** `base_altitude_parameter <dbf file-name>`

A parameter in the .dbf file used to define the base altitude of the individual shapes. "" is acceptable input.

#### constant_base_altitude

**Syntax:** `constant_base_altitude <base altitude-value> <unit-type>`

A constant base altitude to use for all shapes. base_altitude_parameter overrides this value.

#### projection

**Syntax:** `projection <projection-type>`

Define the projection type to be used. Currently **geocentric** and **geodetic** are acceptable.

**Default:** geodetic

#### sensor_modifier (attenuation_parameters)

**Syntax:** `sensor_modifier <modifier-name> <modifier-value>`

Declare that this zone_set modifies all sensors with `sensor.modifier_category` *\<modifier-name\>* with the attenuation value defined in *\<modifier-value\>*.

#### comm_modifier (attenuation_parameters)

**Syntax:** `comm_modifier <modifier-name> <modifier-value>`

Declare that this zone_set modifies all comm devices with `comm.modifier_category` *\<modifier-name\>* with the attenuation value defined in *\<modifier-value\>*.
