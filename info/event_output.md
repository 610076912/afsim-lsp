# event_output

## Syntax

**Syntax:** `event_output ... end_event_output`

```wsf
event_output
   file [ <file-name> | STDOUT | NULL]
   lat_lon_format d[:m[:s]][.#]
   time_format [[h:]m:]s[.#]
   print_eci_locations <boolean>
   print_failed_message_delivery_attempts <boolean>
   print_failed_sensor_detection_attempts <boolean>
   print_single_line_per_event <boolean>
   print_track_in_message <boolean>
   print_track_covariance <boolean>
   print_track_residual_covariance <boolean>
   flush_output <boolean>
   disable [ <event> | all ]
   enable [ <event> | all ]
end_event_output
```

## Overview

The `event_output` block allows the user to create a time-stamped file of simulation events. The general output of a given event varies based on the number of parties involved. This is detailed in General Format.

## General Format

| Type | Format |
|------|--------|
| One-party event | `<time> <event> <party-1> <extra-data>` |
| Two-party event | `<time> <event> <party-1> <party-2> <extra-data>` |
| Three-party event | `<time> <event> <party-1> <party-2> <party-3> <extra-data>` |

Examples:

* One-party event: A `sensor` is turned on or off.
* Two-party event: A `sensor` on one `platform` is detecting a second `platform`.
* Three-party event: One `platform` is ordered by its commander, a second `platform`, to follow a third `platform`.

### General Breakdown

An event within the file is composed of a *logical line* which may be one or more *physical lines*. If a *physical line* ends in a backslash (`\`), then the *logical line* continues on the next line. A *logical line* ends when a *physical line* is read that does not end in a backslash (`\`).

| Field | Description |
|-------|-------------|
| \<time\> | The current simulation time |
| \<event\> | The event name |
| \<party-1\> | The subject platform name (where the event originates) |
| \<party-2\> | The object platform name |
| \<party-3\> | The non-subject, non-object platform name relating to the event |
| \<extra-data\> | Any other pertinent data. This field's format varies by event. |

## Commands

### file [ \<file-name\> | STDOUT | NULL ]

Specifies the name of the file to which the event_output is written. If the file already exists, then it will be overwritten. The special name **STDOUT** indicates the event_output is to be written to standard output. The special name **NULL** indicates that no event_output is to be written. **NULL** can be used to cancel a file name specified in an earlier event_output block.

> **Warning:** The simulation will fail and event_output will not output anything if the directory path provided here does not exist.

> **Note:** To insert the run number in the file name use "*%d*".

For example:

```wsf
file events.evt
file events%d.evt   //with the run number
```

**Default:** events.evt

### flush_output \<boolean\>

Specifies if the output buffer should be flushed after each event is written.

> **Note:** Setting this value to 'true' can result in performance problems because the output is written to the output file after every event. This should only be used when attempting to diagnose problems where the program terminates abnormally and the buffer would not otherwise be flushed. This ensures that the last event that occurred is successfully recorded.

**Default:** false

### disable [ \<event\> | all ]

### enable [ \<event\> | all ]

Specifies the names of the events to be included or excluded in the event log. These commands are typically specified multiple times to select the events of interest. The commands are processed in order of appearance with each successive command selecting or deselecting events as appropriate.

> **Note:** By default, all events start out as being disabled.

> **Warning:** Be careful about using **enable all**. It can generate a lot of output and the addition of new events in the future could result in enormous amounts of output.

### lat_lon_format d[:m[:s]][.#]

Specifies the format and number of decimal places for displaying \<latitude\> and \<longitude\>.

**Default:** d:m:s.2

### time_format [[h:]m:]s[.#]

Specifies the format and number of decimal places for displaying \<time\>.

**Default:** s.5

### print_eci_locations \<boolean\>

Specifies whether position, velocity, and acceleration data are output referenced to the ECI coordinate frame. This will override the standard output of positions in LLA, and velocities and accelerations in NED coordinates.

> **Note:** This option is primarily used for space-based simulation output analysis.

**Default:** false

### print_failed_message_delivery_attempts \<boolean\>

Specifies if MESSAGE_DELIVERY_ATTEMPT events should be printed if the attempt was unsuccessful.

**Default:** true

### print_failed_sensor_detection_attempts \<boolean\>

Specifies if SENSOR_DETECTION_ATTEMPT events should be printed if the attempt was unsuccessful. Setting this to false will dramatically reduce the event file size because only successful detection events will be printed.

**Default:** true

### print_single_line_per_event \<boolean\>

Specifies if each event should be printed on a single line.

**Default:** false

### print_track_in_message \<boolean\>

If a track is part of a message (such as in a `WsfTrackMessage`) then also print out the contents of the track itself.

**Default:** false

### print_track_covariance \<boolean\>

If covariance data is contained in a track that is being logged, the contents of the track's covariance matrix are also logged.

**Default:** false

### print_track_residual_covariance \<boolean\>

If residual covariance data is contained in a track that is being logged, the contents of the track's residual covariance matrix are also logged.

**Default:** false

> **Note:** The track covariance matrix is converted from WCS to originator-referenced NED, and the principal axes are computed in this coordinate system.

## Sample event_output

The following event_output block:

```wsf
event_output
   file events.evt
   disable all    # This is not necessary, unless the user explicitly wants to reset the event list.
   enable PLATFORM_ADDED
   enable PLATFORM_DELETED
   enable SIMULATION_STARTING
   enable SIMULATION_COMPLETE
end_event_output
```

Produces the following event_output in `simple_scenario` demo:

```
00:00:00.0 PLATFORM_ADDED SimpleStriker Type: BLUE_STRIKER Side: blue \
 LLA: 00:00:00.00n 00:00:00.00e 0 m Heading: 90.000 deg Pitch: 0.000 deg Roll: 0.000 deg \
 Speed: 0.000 m/s * [ 0.000 0.000 0.000 ] Acceleration: 0.000 m/s2 * [ 0.000 0.000 0.000 ]
00:00:00.0 SIMULATION_STARTING Year: 2003 Month: 6 Day: 1 Hour: 12 Minute: 0 Second: 0
00:10:01.0 SIMULATION_COMPLETE Year: 2003 Month: 6 Day: 1 Hour: 12 Minute: 10 Second: 1
00:10:01.0 PLATFORM_DELETED SimpleStriker Type: BLUE_STRIKER Side: blue Ps: 1 \
 LLA: 01:03:02.17n 02:39:42.30e 9144 m Heading: 89.993 deg Pitch: 0.000 deg Roll: 0.000 deg \
 Speed: 298.378 m/s * [ 0.000 1.000 -0.000 ] Acceleration: 0.014 m/s2 * [ 0.000 0.000 1.000 ]
```

---

# csv_event_output

## Syntax

**Syntax:** `csv_event_output ... end_csv_event_output`

```wsf
csv_event_output
   file [ <file-name> | STDOUT | NULL]
   flush_output <boolean>
   insert_data_tags <boolean>
   disable [ <event> | all ]
   enable [ <event> | all ]
end_csv_event_output
```

## Overview

The `csv_event_output` block allows the user to create a time-stamped file of simulation events. The general output of a given event varies based on the number of parties involved. This is detailed in General Format.

Since csv_event_output is comma-separated values, it is useful for importing into tables or spreadsheets, as well as use in post-processing tools for data analysis.

## General Format

| Type | Format |
|------|--------|
| One-party event | `<time>,<event>,<party-1>,<extra-data>` |
| Two-party event | `<time>,<event>,<party-1>,<party-2>,<extra-data>` |
| Three-party event | `<time>,<event>,<party-1>,<party-2>,<party-3>,<extra-data>` |

Examples:

* One-party event: A `sensor` is turned on or off.
* Two-party event: A `sensor` on one `platform` is detecting a second `platform`.
* Three-party event: One `platform` is ordered by its commander, a second `platform`, to follow a third `platform`.

### General Breakdown

An event within the file is composed of a *logical line* which may be one or more *physical lines*. If a *physical line* ends in a backslash (`\`), then the *logical line* continues on the next line. A *logical line* ends when a *physical line* is read that does not end in a backslash (`\`).

| Field | Description |
|-------|-------------|
| \<time\> | The current simulation time |
| \<event\> | The event name |
| \<party-1\> | The subject platform name (where the event originates) |
| \<party-2\> | The object platform name |
| \<party-3\> | The non-subject, non-object platform name relating to the event |
| \<extra-data\> | Any other pertinent data. This field's format varies by event. |

## Commands

### file [ \<file-name\> | STDOUT | NULL ]

Specifies the name of the file to which the csv_event_output is written. If the file already exists, then it will be overwritten. The special name **STDOUT** indicates the csv_event_output is to be written to standard output. The special name **NULL** indicates that no csv_event_output is to be written. **NULL** can be used to cancel a file name specified in an earlier csv_event_output block.

> **Warning:** The simulation will fail and csv_event_output will not output anything if the directory path provided here does not exist.

> **Note:** To insert the run number in the file name use "*%d*".

For example:

```wsf
file events.csv
file events%d.csv   //with the run number
```

**Default:** events.csv

### flush_output \<boolean\>

Specifies if the output buffer should be flushed after each event is written.

> **Note:** Setting this value to 'true' can result in performance problems because the output is written to the output file after every event. This should only be used when attempting to diagnose problems where the program terminates abnormally and the buffer would not otherwise be flushed. This ensures that the last event that occurred is successfully recorded.

**Default:** false

### disable [ \<event\> | all ]

### enable [ \<event\> | all ]

Specifies the names of the events to be included or excluded in the event log. These commands are typically specified multiple times to select the events of interest. The commands are processed in order of appearance with each successive command selecting or deselecting events as appropriate.

> **Note:** By default, all events start out as being disabled.

> **Warning:** Be careful about using **enable all**. It can generate a lot of output and the addition of new events in the future could result in enormous amounts of output.

### insert_data_tags \<boolean\>

Specifies if the CSV header is written. This describes the format of each event in the log.

> **Note:** This is used by the post-processing tools to parse the event log.

**Default:** true

## Sample csv_event_output

The following csv_event_output block:

```wsf
csv_event_output
   file events.csv
   disable all    # This is not necessary, unless the user explicitly wants to reset the event list.
   enable PLATFORM_ADDED
   enable PLATFORM_DELETED
   enable SIMULATION_STARTING
   enable SIMULATION_COMPLETE
end_csv_event_output
```

Produces the following csv_event_output in `simple_scenario` demo:

```
0,PLATFORM_ADDED,SimpleStriker,blue,BLUE_STRIKER,,0,0,0,2.23167444e+06,5.97496947e+06,-7.95753188e+02,1.571,0.000,0.000,0.000,0.000,0.000,0.000,465.101,-0.937,0.350,0.000,0.000,0.000,0.000,0.000,0.034,-0.350,-0.937,0.000
0.000000e+00,SIMULATION_STARTING,2003,6,1,12,0,0.000000e+00
6.010010e+02,SIMULATION_COMPLETE,2003,6,1,12,10,1.000000e+00
6.010010e+02,PLATFORM_DELETED,SimpleStriker,blue,BLUE_STRIKER,1.000000e+00,1.050603e+00,2.661749e+00,9.14400000e+03,1.68605423e+06,6.15963498e+06,1.15696178e+05,1.571,0.000,0.000,298.378,0.000,1.000,-0.000,764.068,-0.965,0.264,0.000,0.014,0.000,0.000,1.000,0.091,-0.264,-0.965,-0.003
```
