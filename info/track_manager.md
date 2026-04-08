# track_manager

## Overview

The track_manager block is a subcommand of a platform that defines subcommands for the platform's master track manager. A track manager maintains the platform's master track list. It can also be used to maintain alternate track lists with the standard WSF processor, `WSF_TRACK_PROCESSOR`.

## Syntax

```wsf
track_manager
   debug
   correlation_method ...
   fusion_method ...
   tracker_type ...
   uncorrelated_track_drops ...
   retain_raw_tracks
   retain_track_history
   filter ... end_filter
   track ... end_track
   aux_data ... end_aux_data
   aux_data_fusion_rules ... end_aux_data_fusion_rules
   type_specific_tracker_inputs
end_track_manager
```

## Commands

### debug
**Syntax:** `debug`

Enable the writing of debugging information to standard output.

### correlation_method
**Syntax:** `correlation_method <correlation-method> ... end_correlation_method`

Specifies the correlation algorithm used by the track manager.

A correlation (association) algorithm determines whether new information in the form of track and measurement updates is matched with existing tracks. If so, the new information is fused with the existing tracks using the fusion_method; otherwise, new tracks are created.

**\<correlation-method\>** can be:

- perfect
- nearest_neighbor
- truth

### fusion_method
**Syntax:** `fusion_method <fusion-method> ... end_fusion_method`

Specifies the fusion algorithms used by the track manager.

A fusion algorithm combines information about a single entity from two or more sources into a coherent information set, or `track`.

**\<fusion-method\>** can be:

- replacement
- weighted_average

### tracker_type
**Syntax:** `tracker_type <type-name> ... end_tracker_type`

Specifies a standard tracker type to use. Use of this input means that one does not have to specify correlation_method or fusion_method.

> **Note:** Currently the only valid tracker_type is "mtt" (Multi-Target Tracker; see MTT documentation for specific tracker inputs).

### uncorrelated_track_drops
**Syntax:** `uncorrelated_track_drops [ on | off ]`

Specifies whether uncorrelated local tracks (tracks that no longer have any associated raw tracks) are to be dropped. Automatically set to off if tracks are purged in an associated `WSF_TRACK_PROCESSOR`.

**Default:** on

### retain_raw_tracks
**Syntax:** `retain_raw_tracks`

Specifies that the track manager is to retain all raw track information. If set, it is the responsibility of the user to manage raw track information.

**Default:** No raw track information is retained.

### retain_track_history
**Syntax:** `retain_track_history`

Specifies that the track manager is to retain track history information. If set, it is the responsibility of the user to manage the track history.

**Default:** No track history information is retained.

### filter
**Syntax:** `filter <type-name> end_filter`

Associates a `filter` type with the track manager. All incoming tracks of type "unfiltered sensor" will be filtered with this filter type.

### track
**Syntax:** `track ... end_track`

Defines a pre-briefed `track`.

### aux_data
**Syntax:** `aux_data ... end_aux_data`

Specifies additional data that will be added to any local track created and maintained by the track manager. These will be in addition to any aux_data present in the associated/correlated raw tracks, as they are naturally merged into the local tracks. These data are useful as additional aids to tracking and resource allocation.

### aux_data_fusion_rules
**Syntax:** `aux_data_fusion_rules ... end_aux_data_fusion_rules`

Defines the rules to be applied when 'fusing' aux_data variables from a raw track into a local track. Normally a variable in a raw track will overwrite one in the local track with the same name.

**variable \<name\> private** - A variable marked "private" is one that will never be overwritten when fusion occurs. The variable can only be manipulated by various local script/task processors.

**variable \<name\> only_local** - A variable marked "only_local" can only be overwritten by incoming raw tracks that originate from this platform.

**variable \<name\> prefer_local** - A variable marked "prefer_local" can be overwritten by an incoming track from the local platform OR from an incoming track from another platform IF the local track does not have any other contributing track from this platform that contains the same variable.

### type_specific_tracker_inputs
**Syntax:** `type_specific_tracker_inputs`

Various inputs will be valid, based on the tracker_type selected. Specifically, see the MTT Configuration inputs for the MTT tracker.

## Track Definition

```wsf
track
   position ...
   mgrs_coordinate ...
   altitude ...
   range ...
   bearing ...
   elevation ...
   speed ...
   heading ...
   type ...
   side ...
   spatial_domain ...
   frequency ...
   platform ...
   aux_data ... end_aux_data
end_track
```

The track block is a subcommand of platform or track_manager that defines an initial track (or perception) of another object. Multiple track blocks may be specified in a given platform. Commands should only be specified for those attributes that are perceived to be known. All other attributes should be omitted.

If no track location is explicitly specified using position, mgrs_coordinate, range, or bearing, the truth location of the target platform, if one is provided, will be used to initially populate the location data in the track.

> **Note:** The position and mgrs_coordinate commands are mutually exclusive with range and bearing.

### position
**Syntax:** `position <latitude-value> <longitude-value>`

Perceived position of the object.

### mgrs_coordinate
**Syntax:** `mgrs_coordinate <MGRS-value>`

Perceived coordinates of the object in the Military Grid Reference System.

### altitude
**Syntax:** `altitude <length-value> [ agl | msl ]`

Perceived altitude of the object. **agl** (above ground level) and **msl** (above mean sea level) specify the reference for the altitude specification. If the reference specification is omitted then **msl** is assumed.

### range
**Syntax:** `range <length-value>`

Perceived range to the object from the initial position of the tracking platform.

### bearing
**Syntax:** `bearing <angle-value>`

Perceived bearing to the object from the initial position of the tracking platform.

### elevation
**Syntax:** `elevation <angle-value>`

Perceived elevation of the object from the initial position of the tracking platform.

### speed
**Syntax:** `speed <speed-value>`

Perceived speed of the object.

### heading
**Syntax:** `heading <angle-value>`

Perceived heading of the object.

### type
**Syntax:** `type <platform-type>`

Perceived type of the object.

### side
**Syntax:** `side <side-name>`

Perceived side ("team" or "affiliation") of the object.

### spatial_domain
**Syntax:** `spatial_domain [ land | air | surface | subsurface | space ]`

Defines the perceived spatial domain of the object.

### frequency
**Syntax:** `frequency <frequency>`

Perceived frequency of the object.

### platform
**Syntax:** `platform <platform-name>`

The platform whose truth location to use when initially populating the location data in the track, if no location is specified. The platform must be defined prior to the track.

> **Warning:** Input file order dependency!
