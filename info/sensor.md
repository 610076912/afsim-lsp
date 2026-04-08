# Sensor

**Script Class:** `WsfSensor`

## Overview

A sensor provides the ability for a platform to detect other platforms or their constituent parts.

## Syntax

```wsf
sensor <name> <base-type-name>
   ... Platform_Part_Commands ...
   ... Articulated_Part_Commands ...
   ... Common_Script_Interface ...

   ignore <category-name>
   ignore_domain [ land | air | surface | subsurface | space ]
   ignore_side <side>
   ignore_same_side
   ignore_nothing
   message_length <data-size-value>
   message_priority <integer-priority>
   modifier_category <category-name>
   mode_template  ... end_mode_template
   mode <mode-name> ... end_mode
   selection_mode [ single | multiple ]
   initial_mode <mode-name>
   mode_select_delay <time-value>
   script bool OnSensorDetectionAttempt ...

   Filter Commands ...
   Common Mode Commands ...
   Detection Scheduling Commands ...
   Track Formation Commands ...
   Track Information Reporting Commands ...

   ... sensor-specific mode commands ...
end_sensor
```

```wsf
# Multiple mode sensor definition

sensor <name> <base-type-name>

   ... Platform_Part_Commands ...
   ... Articulated_Part_Commands ...
   Commands ...

   mode_template
      Common Mode Commands ...
      Filter Commands ...
      sensor-specific mode commands ...
   end_mode_template

   mode <mode-name-1>
      Common Mode Commands ...
      Filter Commands ...
      sensor-specific mode commands ...
   end_mode

   ... additional mode definitions
end_sensor
```

## Multiple Mode Considerations

Most (but not all) sensors support the concept of 'modes'. A mode is a named set of operating characteristics of a sensor. Multiple modes do not have to be used. If a sensor implementation supports modes and an explicit mode is not defined, then any mode-related commands are assumed to belong to the implicitly defined mode named 'default'.

If multiple modes are to be used, a 'mode_template' can be defined that specifies the characteristics that are common between all modes. A 'mode_template' does not have to be defined, but if it is it must be defined prior to the first 'mode' command. If a 'mode_template' is used, the initial configuration for each mode is copied from the 'mode_template' and then any additions or modifications to the mode should appear between the applicable 'mode' and 'end_mode' commands.

## Type: WSF_SENSOR_MODE

### Overview

`WSF_SENSOR_MODE` is the shared grammar base used by mode-capable sensor types such as `WSF_RADAR_SENSOR`, `WSF_PASSIVE_SENSOR`, `WSF_GEOMETRIC_SENSOR`, and composite sensor mode templates.

In `wsf.ag`, this base collects the common per-mode commands for cueing, scheduling, error settings, track formation, and reporting flags. It is not instantiated directly as a top-level sensor type, but it is an important structural block when extracting sensor mode capabilities.

### Common Grammar-Level Commands

The `WSF_SENSOR_MODE` base includes the common mode commands already described in this file, including:

- `azimuth_cue_rate`, `elevation_cue_rate`
- `azimuth_cue_limits`, `elevation_cue_limits`
- `cue_mode`
- `maximum_request_count`
- `enable_moon_los_block`
- `search_while_track`, `disables_search`
- `frame_time`, `revisit_time`, `dwell_time`
- `required_pd`, `track_quality`
- `error_model`
- `azimuth_error_sigma`, `elevation_error_sigma`, `range_error_sigma`, `range_rate_error_sigma`
- `establish_track_probability`, `maintain_track_probability`
- `hits_to_establish_track`, `hits_to_maintain_track`
- `solar_exclusion_angle`, `lunar_exclusion_angle`
- `message_length`, `message_priority`
- `reports_*` reporting flags such as `reports_location`, `reports_velocity`, `reports_range`, `reports_pw`, `reports_pri`

## Commands

### ignore

**Syntax:** `ignore <category-name>`

Indicates the sensor should ignore detection attempts against objects that are a member of the specified category. This command may be specified multiple times to ignore multiple categories.

### ignore_domain

**Syntax:** `ignore_domain [ land | air | surface | subsurface | space ]`

Indicates the sensor should ignore detection attempts against platforms or objects contained on platforms that are of the specified spatial domain. This command may be specified multiple times to ignore multiple domain.

### ignore_side

**Syntax:** `ignore_side <side>`

Indicates the sensor should ignore detection attempts against platforms or objects contained on platforms that are of the specified side. This command may be specified multiple times to ignore multiple sides.

### ignore_same_side

**Syntax:** `ignore_same_side`

Indicates the sensor should ignore detection attempts against platforms or objects contained on platforms that are on the same side of the platform to which the sensor is attached.

### ignore_nothing

**Syntax:** `ignore_nothing`

Has the effect of canceling the effect of any previous ignore, ignore_domain, ignore_side and ignore_same_side commands. This is useful if one wants to reuse a sensor definition with embedded 'ignore' commands but wished to eliminate or change what is ignored.

### message_length

**Syntax:** `message_length <data-size-value>`

Specifies the logical length assigned to the track messages that are created from the sensor.

This command is available at both the sensor level (this command) and the sensor mode level.

### message_priority

**Syntax:** `message_priority <integer-priority>`

Specifies the priority assigned to the track messages that are created from the sensor.

This command is available at both the sensor level (this command) and the sensor mode level.

### modifier_category

**Syntax:** `modifier_category <category-name>`

The category that maps to the zone-based attenuation value defined in the `zone_set`. Setting this value tells the sensor to evaluate zones for attenuation.

### mode_template

**Syntax:** `mode_template  ... end_mode_template`

Defines the default values for the modes of the sensor. When a new mode is defined it is first populated with the values from the mode template. This is useful when a sensor has multiple modes and the parameters for each mode are the same with the exception of a few values.

> **Note:** This command must appear before any mode command in the second.

### mode

**Syntax:** `mode <mode-name> ... end_mode`

Defines a **mode**, which is nothing more than a selectable set of parameters. The initial or default values of a mode are defined by the mode_template (if provided).

### selection_mode

**Syntax:** `selection_mode [ single | multiple ]`

Indicates if the sensor supports the simultaneous operation of multiple modes.

**Default:** single

### initial_mode

**Syntax:** `initial_mode <mode-name>`

The operation of this command depends on if selection_mode is **single** or **multiple**.

If selection_mode is **single** then this defines the mode to be selected the **first** time the sensor is turned on. If this command is not specified then the first mode that is defined will be selected. If the sensor is subsequently turned off and turned back on, the sensor will resume the mode it was in when it was last turned off.

If selection_mode is **multiple** then this defines the mode to be selected whenever the sensor changes from the 'off' state to the 'on' state unless the scripting language is used to select a different mode while the sensor is off. If this command is not defined then no sensor mode will be activated when the sensor is turned on; it is the responsibility of the user to use the scripting language to select a mode.

### mode_select_delay

**Syntax:** `mode_select_delay <time-value>`

Specifies the delay when selecting modes.

> **Note:** This input is operational only for the `WSF_AGILITY_EFFECT` **mode_changing** functionality.

**Default:** 0.0 seconds

### OnSensorDetectionAttempt

**Syntax:** `script bool OnSensorDetectionAttempt(WsfPlatform aTarget, WsfSensorInteraction aInteraction) ... end_script`

Defines an optional script that imposes additional detection constraints on a sensor model. This script is invoked immediately after a detection attempt occurs but prior to any SENSOR_DETECTION_ATTEMPT events in the `observer`. As a result, the `WsfSensorInteraction` parameter includes any relevant calculations from the sensor's inbuilt detection checks and represents what the result would have been if this script was not defined.

A boolean value **MUST** be returned from this script indicating whether the sensor detection should be accepted or denied. An accepted detection is not necessarily synonymous with a successful detection; it simply means that the existing sensor result, which could have failed due to other constraints, should be used.

## Common Mode Commands

The remaining commands are applicable on a per-mode basis.

### required_pd

**Syntax:** `required_pd (0..1)`

Specifies the constant 'required_pd' value to be used if the value of the global simulation command `use_constant_required_pd` was specified as **true**. This is applicable only for sensors which implement probabilistic detectors (e.g., The optional Marcum-Swerling detector in `WSF_RADAR_SENSOR`).

**Default:** 0.5

### cue_mode

**Syntax:** `cue_mode [ fixed | azimuth | elevation | both | azimuth_and_elevation]`

This command, along with azimuth_cue_limits and elevation_cue_limits can be used to limit the cueing capabilities for a particular mode to something less than those which were defined by the articulated part. For instance, a sensor may physically be able to cue in any direction but in a given mode may only cue in azimuth.

- **fixed** - The sensor cannot be cued.
- **azimuth** - The sensor can be cued only in azimuth.
- **elevation** - The sensor can be cued only in elevation.
- **both** or **azimuth_and_elevation** - The system can be cued in both azimuth and elevation.

**Default:** As defined by the articulated_part.slew_mode command in the articulated part.

### azimuth_cue_limits

**Syntax:** `azimuth_cue_limits <angle-value> <angle-value>`

Specifies the minimum and maximum angle about which the sensor can be cued in azimuth. These values are applicable only if **cue_mode** is **azimuth** or **both**. The limits are specified in the subsystem coordinate frame.

**Default:** As defined by the articulated_part.azimuth_slew_limits command in the articulated part.

### elevation_cue_limits

**Syntax:** `elevation_cue_limits <angle-value> <angle-value>`

Specifies the minimum and maximum angle about which the sensor can be cued in elevation. These values are applicable only if **cue_mode** is **elevation** or **both**. The limits are specified in the subsystem coordinate frame.

**Default:** As defined by the articulated_part.elevation_slew_limits command in the articulated part.

### azimuth_cue_rate

**Syntax:** `azimuth_cue_rate <angle-rate-value>`

Specifies the angular velocities to be employed when slewing the part to satisfy a cueing request. This is primarily used for modeling systems that track single target. It is not used for scanning systems and should not be used for multiple-target tracking systems.

The value must be greater than zero, and values greater than or equal to 1.0E+12 deg/sec will be treated as 'infinite'. The values will be limited to the values specified by the articulated_part.azimuth_slew_rate and articulated_part.elevation_slew_rate commands in articulated part (which default to 'infinite').

**Default:** As defined by the articulated_part.azimuth_slew_rate and articulated_part.elevation_slew_rate commands in the articulated part.

### elevation_cue_rate

**Syntax:** `elevation_cue_rate <angle-rate-value>`

Specifies the angular velocities to be employed when slewing the part to satisfy a cueing request. This is primarily used for modeling systems that track single target. It is not used for scanning systems and should not be used for multiple-target tracking systems.

The value must be greater than zero, and values greater than or equal to 1.0E+12 deg/sec will be treated as 'infinite'. The values will be limited to the values specified by the articulated_part.azimuth_slew_rate and articulated_part.elevation_slew_rate commands in articulated part (which default to 'infinite').

**Default:** As defined by the articulated_part.azimuth_slew_rate and articulated_part.elevation_slew_rate commands in the articulated part.

### error_model

**Syntax:** `error_model <derived-name>` or `error_model <base-name> ...commands... end_error_model`

Specify the error model. See `error_model` for more information about the available error effects and how to configure the models.

**Default:** none (No error model)

### solar_exclusion_angle

**Syntax:** `solar_exclusion_angle <angle-value>`

This sensor will not detect targets if the angle between its line-of-sight with the sun's limb and the target is less than this value.

**Default:** no solar exclusion

### lunar_exclusion_angle

**Syntax:** `lunar_exclusion_angle <angle-value>`

This sensor will not detect targets if the angle between its line-of-sight with the moon's limb and the target is less than this value.

**Default:** no lunar exclusion

### target_solar_illumination_angle

**Syntax:** `target_solar_illumination_angle <angle-value> <angle-value>`

Defines the bounds of solar illumination required for the target to be detected.

**Default:** No constraint

> **Note:** This command only works with passive IR sensors and passive visual sensors, as well as with `WSF_GEOMETRIC_SENSOR`.

### solar_elevation_at_target

**Syntax:** `solar_elevation_at_target <angle-value> <angle-value>`

Defines the bounds of solar elevation at the target's location required for the target to be detected.

**Default:** No constraint

> **Note:** This command only works with passive IR sensors and passive visual sensors, as well as with `WSF_GEOMETRIC_SENSOR`.

### enable_moon_los_block

**Syntax:** `enable_moon_los_block <boolean-value>`

If set to true, this sensor will not detect targets whose line-of-sight is blocked by the moon.

**Default:** false

## Detection Scheduling Commands

These commands define the parameters that are used to determine when sensing chances are to occur.

> **Warning:** Not all sensors support all commands. For instance, a sensor whose product is a image does not support these commands. The `WSF_COMPOSITE_SENSOR` is not integrated with many of these commands.

### update_interval

**Syntax:** `update_interval <time-value>`

This value is required when the scheduler is assigned a scheduler-type of physical_scan or sector_scan. It is used in conjunction with the frame_time value defined within the final mode that is read in from the input file for the sensor in order to calculate and physically sweep sectors for radar detections. For example, if the final frame-time value, which is read during the input loading sequence, is set to 20 sec, and if the update_interval is set to 2 sec, then 10 sectors are needed to sweep through 360 degrees during the 20-sec frame. For this example, each sector would cover 36 degrees of azimuth during each 2-sec update_interval.

> **Note:** This keyword should be placed within the sensor-end_sensor block; not a mode block.

### frame_time

**Syntax:** `frame_time <time-value>`

Specifies how long the sensor takes to perform one scan of its search volume. How this parameter is actually used depends on the actual sensor implementation. It also signifies how often a sensor detection is reported.

### maximum_request_count

**Syntax:** `maximum_request_count <integer>`

If this value is greater than zero then this mode only responds to explicit requests as initiated by `WsfTaskManager.StartTracking`.

### revisit_time

**Syntax:** `revisit_time <time-value>`

If maximum_request_count is non-zero, this specifies how often the request should be revisited.

### dwell_time

**Syntax:** `dwell_time <time-value>`

If maximum_request_count is non-zero, this specifies how long the sensor will dwell or otherwise take to perform a detection attempt associated with a request.

### search_while_track

**Syntax:** `search_while_track`

If maximum_request_count is non-zero, this indicates search mode requests can continue to be processed.

### disables_search

**Syntax:** `disables_search`

If maximum_request_count is non-zero, this indicates that if this mode is selected then any detection attempts by search modes will be blocked.

### scheduler

**Syntax:** `scheduler <scheduler-type> ... end_scheduler`

```wsf
scheduler <scheduler-type>
   Type Commands ...
end_scheduler
```

**\<scheduler-type\>** can be:

- default
- physical_scan
- sector_scan
- spin

### debug_scheduler

**Syntax:** `debug_scheduler`

Enables output to the console window for scheduler data.

> **Note:** This keyword will not work in the `WSF_COMPOSITE_SENSOR` definition block, but it can work in the constituent sensors, which are used for `WSF_COMPOSITE_SENSOR`, when the component sensors are identical.

> **Note:** This command is valid for all scheduler types.

## Track Formation Commands

These commands define the criteria for establishing a track and the type and quality of information reported in the tracks produced by this sensor.

> **Note:** These commands are ignored for those sensors that do not produce tracks.

### azimuth_error_sigma

**Syntax:** `azimuth_error_sigma [ <angle-value> | <real-value> percent_of_true_range ]`

Specifies the standard deviation for a Gaussian distribution for errors to be applied to position measurements from the sensor. The standard deviation may be specified as either an angle, length or speed value (as appropriate) or may be specified as a function of 'percent_of_true_range' for certain error types. In the latter case, the following formulas are used:

sigma(angle) = atan2(0.01 * value * R_true, R_true)

sigma(range) = 0.01 * value * R_true

Where 'value' is the '<real-value>' specified in the command (in the range [0..100]) and 'R_true' is the true range to the target.

**Default:** 0 (no errors) for all

### elevation_error_sigma

**Syntax:** `elevation_error_sigma [ <angle-value> | <real-value> percent_of_true_range ]`

Specifies the standard deviation for a Gaussian distribution for errors to be applied to position measurements from the sensor. See azimuth_error_sigma for formula details.

**Default:** 0 (no errors)

### range_error_sigma

**Syntax:** `range_error_sigma [ <length-value> | <real-value> percent_of_true_range ]`

Specifies the standard deviation for a Gaussian distribution for errors to be applied to position measurements from the sensor. See azimuth_error_sigma for formula details.

**Default:** 0 (no errors)

### range_rate_error_sigma

**Syntax:** `range_rate_error_sigma <speed-value>`

Specifies the standard deviation for a Gaussian distribution for errors to be applied to range-rate measurements from the sensor.

**Default:** 0 (no errors)

### hits_to_establish_track

**Syntax:** `hits_to_establish_track <M> <N>`

Indicates that <M> of the last <N> attempts to detect an object must be successful in order to establish a track.

**Default:** 1 for both <M> and <N>.

### hits_to_maintain_track

**Syntax:** `hits_to_maintain_track <M> <N>`

Once a track has been established, <M> of the last <N> attempts to detect an object must be successful in order to maintain a track.

**Default:** 1 for both <M> and <N>.

### establish_track_probability

**Syntax:** `establish_track_probability [0 .. 1]`

When the M/N establish track criteria is met (see hits_to_establish_track), this is the probability that a track will be established.

**Default:** 1.0

### maintain_track_probability

**Syntax:** `maintain_track_probability [0 .. 1]`

As long as the M/N maintain track criteria is met (see hits_to_maintain_track), this is the probability that the track will be maintained.

**Default:** 1.0

## Track Information Reporting Commands

These commands determine the target information reported in a given sensor's track report.

> **Note:** If a filter (e.g., `WSF_KALMAN_FILTER`, `WSF_ALPHA_BETA_FILTER`) is being used, the reported tracks are marked as being filtered, and reported position and velocity information (range, bearing, elevation, location, and velocity) will be the filtered position and velocity. If the `WSF_KALMAN_FILTER` is used, a state covariance matrix is also available (see reports_state_covariance).

### message_length (mode-level)

**Syntax:** `message_length <data-size-value>`

Specifies the logical length of report messages from this sensor mode.

The message length is assigned as follows using the first value that results in a non-zero value.

- The value of the sensor mode **message_length** command (this command).
- The value of the sensor **message_length** command.
- The value the applicable `message_table` entry.

**Default:** 0

### message_priority (mode-level)

**Syntax:** `message_priority <integer-priority>`

Specifies the priority to be assigned to the report messages that originate from this mode.

The message priority is assigned as follows using the first value that results in a non-zero value.

- The value of the sensor mode **message_priority** command (this command).
- The value of the sensor **message_priority** command.
- The value the applicable `message_table` entry.

**Default:** 0

### reports_range

**Syntax:** `reports_range`

The slant range from the sensor to the target is reported.

### reports_bearing

**Syntax:** `reports_bearing`

The bearing from the sensor to the target is reported. This angle is measured in radians from the sensor's north orientation, and it is in the range { -pi, pi }.

### reports_elevation

**Syntax:** `reports_elevation`

The elevation angle from the sensor to the target is reported.

### reports_location

**Syntax:** `reports_location`

The location (latitude, longitude, altitude) of the target is reported.

### reports_velocity

**Syntax:** `reports_velocity`

The velocity of the target is reported.

### reports_range_rate

**Syntax:** `reports_range_rate`

The range-rate of the target is reported.

### reports_iff

**Syntax:** `reports_iff`

The identify friend-or-foe (IFF) status is reported.

### reports_side

**Syntax:** `reports_side`

The side of the target is reported.

### reports_type

**Syntax:** `reports_type`

The type of the target is reported.

### reports_signal_to_noise

**Syntax:** `reports_signal_to_noise`

The signal-to-noise ratio is reported.

### reports_frequency

**Syntax:** `reports_frequency`

The frequency of the detected signal should be reported.

### reports_pulsewidth

**Syntax:** `reports_pulsewidth | reports_pw`

The pulse-width of the signal is reported.

> **Note:** Also sets reports_frequency.

### reports_pulse_repetition_interval

**Syntax:** `reports_pulse_repetition_interval | reports_pri`

The pulse-repetition interval of the signal is reported.

> **Note:** Also sets reports_frequency.

### reports_other

**Syntax:** `reports_other`

Specifies what data elements will be reported in tracks from this sensor.

### reports_nothing

**Syntax:** `reports_nothing`

Nothing is reported. This is the default behavior if no reporting flags are specified, and also has the effect of canceling any previous 'reports_' commands. This is useful if one wants to reuse an existing sensor definition with embedded 'reports_' commands but needs to change what is reported, or in situations where only the detected platform is needed in generated tracks.

### track_quality

**Syntax:** `track_quality [0 .. 1]`

Specifies the 'quality' of the track when produced from this mode.

**Default:** 0.5

### send_track_drop_on_turn_off

**Syntax:** `send_track_drop_on_turn_off <boolean-value>`

Indicates if 'track drop' messages should be sent for each active track when the sensor is turned off.

**Default:** off

> **Note:** 'track drop' messages are not sent if the platform that owns the sensor is deleted.

## Type: WSF_RADAR_SENSOR

### Overview

`WSF_RADAR_SENSOR` provides a baseline radar implementation. It is capable of representing a wide variety of radar systems including simple single mode early warning radars all the way to complex multiple-mode radars for target detection chances.

A radar definition consists of one or more modes where each mode consists of one or more beams. The 'mode' and 'end_mode' commands that enclose a mode definition may be omitted if the radar has only one mode. The 'beam' and 'end_beam' commands that enclose a beam definition may be omitted if a mode has only one beam.

### Multiple Beam Considerations

If a sensor uses multiple beams, the following considerations should be observed:

- Beam numbers must be in strictly increasing numerical order with no gaps. That is, beam 2 must follow beam 1, beam 3 must follow beam 2, etc.
- The definition for the first beam (beam 1) provides the initial definition for each subsequent beam. Commands that appear between the beam/end_beam block for the subsequent beams can provide additions or modifications to the initial definition.
- If the sensor has multiple-modes, the number of beams for each must be the same (this restriction may be removed in a future release).

### Syntax

```wsf
sensor <name> WSF_RADAR_SENSOR
   ... Platform_Part_Commands ...
   ... Articulated_Part_Commands ...
   ... sensor Commands ...

   show_calibration_data
   mode <name>
      ... Sensor Mode Commands ...
      ... WSF_RADAR_SENSOR Mode Commands ...

      beam 1
         Antenna_Commands ...
         transmitter
           ... transmitter commands ...
         end_transmitter
         receiver
           ... receiver commands ...
         end_receiver
         ... Beam Commands ...
      end_beam
      beam <n>
         Antenna_Commands ...
         transmitter
           ... transmitter commands ...
         end_transmitter
         receiver
           ... receiver commands ...
         end_receiver
         ... Beam Commands ...
      end_beam
   end_mode
end_sensor
```

### Sensor Level Commands

#### show_calibration_data

**Syntax:** `show_calibration_data`

Write information about the characteristics of the radar to standard output. This will include the one square meter detection range as well as any other values that may need to be derived.

### Mode Commands

#### transmit_only

**Syntax:** `transmit_only`

#### receive_only

**Syntax:** `receive_only`

Indicate that only the transmitter or receiver will be used.

> **Note:** For bistatic interactions where transmitter masking is not of concern please set receiver.check_transmitter_masking to 'off' or 'false'.

#### compute_measurement_errors

**Syntax:** `compute_measurement_errors [ true | false ]`

If true, measurement errors will be computed using standard radar error model equations. If false, measurement errors will be computed using the common sensor error model.

**Default:** false

#### override_measurement_with_truth

**Syntax:** `override_measurement_with_truth [ true | false ]`

This command will compute the measurement errors and report the errors in the track, but will report the truth location in the track instead of using the location with the measurement errors applied. This is typically used for testing trackers.

**Default:** false

#### frequency_select_delay

**Syntax:** `frequency_select_delay <time-value>`

Specifies the delay when selecting between different frequencies as defined on the transmitter.

> **Note:** This input is only operational for the `WSF_AGILITY_EFFECT` **frequency_changing** functionality.

**Default:** 0.0 seconds

#### maintain_track_measurement_history

**Syntax:** `maintain_track_measurement_history <boolean-value>`

If true, the mode will maintain a track's history of measurements produced from successful detections.

**Default:** false

### Beam Commands

#### doppler_resolution

**Syntax:** `doppler_resolution <speed-value>`

Defines the target Doppler speed resolution (i.e., opening or closing speed) capability of the radar.

**Default:** 0.0

> **Note:** This input is currently only used in computing range-rate measurement errors associated of this sensor. The compute_measurement_errors must be set to true and the sensor_mode.reports_range_rate must be specified to enable the range-rate error computation.

#### adjustment_factor

**Syntax:** `adjustment_factor <dbratio-value>`

A method of adjusting a beam's detection capability. Positive value increase the sensor's detection capability.

**Default:** 0.0 dB

#### operating_loss

**Syntax:** `operating_loss <dbratio-value>`

Defines the beam's operating loss.

**Default:** 0.0 dB

> **Note:** Loss should be entered as positive value.

#### integration_gain

**Syntax:** `integration_gain <dbratio-value>`

Defines the integration gain when using the binary detector (detection_threshold). This is not applicable when using the Swerling detector (swerling_case) or detection_probability.

**Default:** 0.0 dB

#### detection_threshold

**Syntax:** `detection_threshold <dbratio-value>`

An alternative method of defining the receiver's detection threshold. The value can be entered here for readability of the input file.

**Default:** 3.0 dB

#### swerling_case

**Syntax:** `swerling_case [ 0 | 1 | 2 | 3 | 4 ]`

Indicates that the Marcum-Swerling detector model is to be used and specifies the 'case' to be used.

**Default:** The default is to use the binary detector with a detection threshold defined by detection_threshold

#### number_of_pulses_integrated

**Syntax:** `number_of_pulses_integrated <integer-value>`

Specifies the number of pulses the Marcum-Swerling detector integrates.

**Default:** 1

#### probability_of_false_alarm

**Syntax:** `probability_of_false_alarm <pfa>`

Specifies the false alarm probability.

**Default:** 1.0e-6

#### detector_law

**Syntax:** `detector_law [ linear | square | log ]`

Specifies the type of Marcum-Swerling detector.

**Default:** linear

#### no_swerling_case

**Syntax:** `no_swerling_case`

Specifies not to use a Marcum-Swerling detector. Detections will be based on the detection_threshold. This is the default configuration.

#### detection_probability

**Syntax:** `detection_probability ... end_detection_probability`

Defines a function of probability of detection (Pd) versus received signal-to-noise ratio (more specifically, it is really the signal-to-interference ratio, which includes the effects of receiver noise, interference and unsuppressed clutter). This is an alternative to using the Swerling detector (swerling_case) or the binary detector (detection_threshold). The table is defined as follows:

```wsf
detection_probability
   signal_to_noise <db-ratio-1> pd <pd-value-1>
   signal_to_noise <db-ratio-2> pd <pd-value-2>
   ...
   signal_to_noise <db-ratio-n> pd <pd-value-n>
end_detection_probability
```

**\<db-ratio-n\>** The signal-to-noise ratio of the received signal.

**\<pd-value-n\>** The probability of detection associated with the ratio.

There must be at least two entries and the ratios must be monotonically increasing. Signals that exceed the limits of the table will be clamped to the appropriate endpoint. Intermediate values will be determined using linear interpolation between 'dB' values.

**Default:** The default is to use the binary detector with a detection threshold defined by detection_threshold.

#### post_lockon_detection_threshold_adjustment

**Syntax:** `post_lockon_detection_threshold_adjustment <dbratio-value>`

Defines a value by which the detection threshold will be adjusted once a 'locked-on' state has been achieved for the current mode of the sensor. This is typically used with tracking sensors to indicate that the detection threshold is less once a locked-on state has been achieved. The value is typically a negative 'dB' value, although it can be 0 dB or greater if that is what is desired.

**Default:** 0 dB

#### post_lockon_adjustment_delay_time

**Syntax:** `post_lockon_adjustment_delay_time <time-value>`

Defines the time that must elapse from when a sensor declares that a 'locked-on' state has been achieved before applying the post_lockon_detection_threshold_adjustment.

**Default:** 0.0 seconds

#### one_m2_detect_range

**Syntax:** `one_m2_detect_range <length-value>`

#### range_product

**Syntax:** `range_product <area-value>`

#### loop_gain

**Syntax:** `loop_gain <dbratio-value>`

Alternative methods to specify a radar beam's detection capability. If specified, the receiver's noise value will be calibrated to yield the specified detection range.

#### look_down_factor

**Syntax:** `look_down_factor <dbratio-value>`

Defines a beam's look-down loss. The ratio will adjust the received signal power for targets that are located below the beam's antenna.

**Default:** 1.0

#### prf_factor

**Syntax:** `prf_factor <dbratio-value>`

Defines a factor that represents the detection difference for a beam that uses interleaved HPRF and MPRF waveforms. The prf_factor is applied to the received signal power if the absolute value of the target closing speed is less than the ownship velocity.

**Default:** 1.0

#### clutter_model

**Syntax:** `clutter_model <derived-name>` or `clutter_model <base-name> ...commands... end_clutter_model`

Specify the clutter model. See `clutter_model` for more information about the available clutter effects and how to configure the models.

**Default:** none (No clutter)

#### clutter_attenuation_factor

**Syntax:** `clutter_attenuation_factor <dbratio-value>`

Specifies a constant value in the range [ 0 .. 1 ] by which the clutter returned will be multiplied to create an 'attenuated clutter return.' If the signal_processor type mti_processor is supplied and this value is not provided, a clutter attenuation value will be computed.

**Default:** 1.0 absolute (i.e., No clutter attenuation)

#### signal_processor

**Syntax:** `signal_processor <type-name> ...commands... end_signal_processor`

Specifies the signal processor identified by <type-name> from the following list:

The following signal processors are specific to `WSF_RADAR_SENSOR` type definitions.

- `signal_processor.simple_doppler` - Models simple Doppler effects with minimum / maximum Doppler Speed cutoffs.
- `signal_processor.mti_adjustment` - Models MTI adjustment as function of closing speed or Doppler frequency.
- `signal_processor.mti_processor` - Models a Dual-Delay Line Canceler Moving Target Indicator.

#### error_model_parameters

**Syntax:** `error_model_parameters ... end_error_model_parameters`

Error model parameter overrides to be used by the radar_sensor_error to calculate the error in lieu of using default receiver / transmitter data.

##### azimuth_beamwidth

**Syntax:** `azimuth_beamwidth <angle-value>`

Specifies the azimuth beamwidth to be used by the error_model.

**Default:** Receiver azimuth beamwidth.

##### elevation_beamwidth

**Syntax:** `elevation_beamwidth <angle-value>`

Specifies the elevation beamwidth to be used by the error_model.

**Default:** Receiver elevation beamwidth.

##### pulse_width

**Syntax:** `pulse_width <time-value>`

Specifies the pulse width to be used by the error_model.

**Default:** Transmitter pulsewidth, corrected by pulse compression ratio.

##### receiver_bandwidth

**Syntax:** `receiver_bandwidth <frequency-value>`

Specifies the receiver bandwidth to be used by the error_model.

**Default:** Receiver bandwidth.

##### doppler_resolution

**Syntax:** `doppler_resolution <speed-value>`

Specifies the doppler resolution to be used by the error_model.

**Default:** Beam Doppler resolution.

## Type: WSF_PASSIVE_SENSOR

**Script Class:** `WsfPassiveSensor`

### Overview

`WSF_PASSIVE_SENSOR` implements a basic passive RF detection sensor. This can be used to model things like RWR, SIGINT and ELINT sensors.

The sensor uses two different detection methods to gather data for reporting:

- **Framed** or sampling: The sensor looks at all transmitters within its frequency band whose emission patterns are *regular*. This is how the sensor detects search radars. The sample interval for the sensor is specified by the sensor_mode.frame_time mode command.
- **Unframed**: The sensor uses this method to detect transmitters within its frequency band whose emission patterns are *irregular*. This would include tracking radars that employ electronic beam steering to track multiple targets, and communications devices that transmit only when a message is being sent.

The sensor combines the results from both detection methods to produce detection reports (`WsfTrack`) for each target it detects. The detection reports for a given target are produced at intervals defined by the frame_time. Unframed detections that occur in between frame samples are reported at the next frame sample.

Unframed detections of transient communication signals are reported for each frame sample in which the signal was present. That is, the transmission of a long message will be detected for the duration of the transmission. Note, however, that the detection results from the first sample are reported for subsequent samples of the same transmission (the assumption is being made that very little will change during the duration of transmission).

### Syntax

```wsf
sensor <name> WSF_PASSIVE_SENSOR
   ... Platform_Part_Commands ...
   ... Common sensor Commands ...

   reported_target_type ... end_reported_target_type
   reported_emitter_type ... end_reported_emitter_type

   unframed_detection_optimization ...
   unframed_detection_coast_time ...

   mode <name>
     ... Common Mode Commands ...
     ... Detection Scheduling Commands ...
     ... Track Formation Commands ...
     ... Track Information Reporting Commands ...
     ... Antenna_commands ...
     ... receiver ... end_receiver

     frequency_band ...
        dwell_time ...
        revisit_time ...

     detection_sensitivity ...
     continuous_detection_sensitivity ...
     pulsed_detection_sensitivity ...
     detection_sensitivities ... end_detection_sensitivities

     detection_threshold ...
     continuous_detection_threshold ...
     pulsed_detection_threshold ...
     detection_thresholds ... end_detection_thresholds

     detection_probability ... end_detection_probability

     scan_on_scan_model ...

     azimuth_error_sigma_table ... end_azimuth_error_sigma_table
     elevation_error_sigma_table ... end_elevation_error_sigma_table
     range_error_sigma_table ... end_range_error_sigma_table

     ranging_time ...
     ranging_time_track_quality ...

   end_mode

end_sensor
```

### Commands

#### reported_target_type

**Syntax:** `reported_target_type ... end_reported_target_type`

Defines how the passive sensor reports target type information in tracks.

```wsf
reported_target_type
  default_time_to_declare ...
  default_time_to_reevaluate ...
  type <target_type>
     ... type sub-commands ...
  type <target_type>
     ... type sub-commands ...
  ...
  default_type
     ... type sub-commands ...
end_reported_target_type
```

##### default_time_to_declare

Defines the duration of time after the initial detection that is required to make a determination of the target type.

**Default:** 0 sec

##### default_time_to_reevaluate

Defines the time interval used for reevaluating the identification of the target. A value of 0 seconds indicates no reevaluation will take place.

**Default:** 0 sec

##### type

**Syntax:** `type <target_type>`

Specifies the truth type to which the following subcommands apply.

##### default_type

Specifies that the following type subcommands apply for any type not defined with the type command.

###### time_to_declare

Defines the duration of time after the initial detection that is required to make a determination of the target type.

**Default:** set by the default_time_to_declare command

###### time_to_reevaluate

Defines the time interval used for reevaluating the identification of the target.

**Default:** set using the default_time_to_reevaluate command

###### report_type (emitter-based)

**Syntax:** `report_type <type-name> emitter <emitter-name>`

```wsf
report_type <type-name1>
  emitter <emitter-type-1>
  emitter <emitter-type-2>
  ...
  emitter <emitter-name-N>
report_type <type-name-2>
...
```

Defines the reporting type-name as the target type based on the listed emitter-type(s) being reported in the emitter list. Currently exact matches between the emitter's defined for the report_type and a track's emitter list must happen for the given report_type to be reported. If there are differences another report_type or the default_type will be reported.

###### report_type (probability-based)

**Syntax:** `report_type <type-name> <probability>`

Defines the probability of reporting type-name as the target type. The probability parameter is a value between 0.0 and 1.0. Any number of report_type commands may be specified as long as the probability parameters add up to 1.0. For greater ease of use, the value remainder may be used as the probability parameter to specify whatever value is required to add up to 1.0.

###### report_truth

Specifies that the sensor will report the truth type. This is only valid under the default_type command.

#### reported_emitter_type

**Syntax:** `reported_emitter_type ... end_reported_emitter_type`

Defines how the passive sensor reports emitter type information in tracks.

```wsf
reported_emitter_type
  default_time_to_declare ...
  default_time_to_reevaluate ...
  type <emitter_type>
     ... type sub-commands ...
  type <emitter_type>
     ... type sub-commands ...
  ...
  default_type
     ... type sub-commands ...
end_reported_emitter_type
```

##### default_time_to_declare

Defines the duration of time after the initial detection that is required to make a determination of the emitter type.

**Default:** 0 sec

##### default_time_to_reevaluate

Defines the time interval used for reevaluating the identification of the emitter. A value of 0 seconds indicates no reevaluation will take place.

**Default:** 0 sec

##### type

**Syntax:** `type <emitter_type>`

Specifies the truth emitter type to which the following subcommands apply.

##### default_type

Specifies that the following type subcommands apply for any type not defined with the type command.

###### time_to_declare

Defines the duration of time after the initial detection that is required to make a determination of the emitter type.

**Default:** set by the default_time_to_declare command

###### time_to_reevaluate

Defines the time interval used for reevaluating the identification of the emitter.

**Default:** set using the default_time_to_reevaluate command

###### report_type

**Syntax:** `report_type <type-name> <probability>`

Defines the probability of reporting type-name as the emitter type. The probability parameter is a value between 0.0 and 1.0. Any number of report_type commands may be specified as long as the probability parameters add up to 1.0. For greater ease of use, the value remainder may be used as the probability parameter to specify whatever value is required to add up to 1.0.

###### report_truth

Specifies that the sensor will report the truth type. This is only valid under the default_type command.

#### unframed_detection_optimization

**Syntax:** `unframed_detection_optimization <boolean-value>`

This command indicates if unframed detection optimization will be used. If enabled, once the sensor successfully detects a given transmitter within a frame, subsequent attempts to detect the same transmitter in the same frame will be suppressed. For instance, if multiple messages are sent from a single transmitter during the passive frame, the passive sensor will only report on the first message that it can detect (if any). If the first message cannot be detected because of transmitter antenna pointing, it will report the second message if it can be detected, and so on.

**Default:** true

> **Note:** Use this if it is desired to have one ATTEMPT_TO_DETECT event_output message for every SENSOR_DETECTION_ATTEMPT or MESSAGE_DELIVERY_ATTEMPT message, or if it desired to report the absolute best detection within the frame.

#### unframed_detection_coast_time

**Syntax:** `unframed_detection_coast_time <time-value>`

If the passive sensor is running at a faster frame time than the sensors it is trying to detect, it may detect the transmitter one frame and not the next. This can cause a lot of track creation and deletion. This value indicates how long a successful detection from a transmitter will be reported.

**Default:** 2 seconds

### Passive-Specific Mode Commands

#### frequency_band

**Syntax:** `frequency_band <lower-frequency> <upper-frequency>`

Defines a band of frequencies this sensor can detect. This command may be specified more than once if the sensor can detect multiple bands.

#### dwell_time

**Syntax:** `dwell_time <time-value>`

#### revisit_time

**Syntax:** `revisit_time <time-value>`

These two commands pertain to the immediately preceding frequency_band and define how long the sensor dwells in the band and the interval between dwells. These commands are effectively only when the scan_on_scan_model is enabled and are used to determine the temporal probability that the sensor would be looking at the frequency of the target emitter when a detection chance occurs.

If these commands are defined for any band in the sensor then they must be defined for all bands in the sensor.

#### continuous_detection_sensitivity

**Syntax:** `continuous_detection_sensitivity <db-power>`

#### pulsed_detection_sensitivity

**Syntax:** `pulsed_detection_sensitivity <db-power>`

#### detection_sensitivity

**Syntax:** `detection_sensitivity <db-power>`

Defines the minimum signal strength that can be 'reliably' detected. If detection_probability is defined then this is the signal strength that would result in a Pd of 0.5. If detection_probability is not defined then this defines the signal strength for which a successful detection will be declared.

The first two forms set the detection sensitivity for continuous wave and pulsed signals, respectively. The last form sets both sensitivities to the same value. If **continuous_detection_sensitivity** is used then **pulsed_detection_sensitivity** must also be specified, and vice-versa. If no values for the detection thresholds or sensitivities are specified then the detection_threshold criteria will be used to set the default value.

**Default:** See detection_threshold.

#### detection_sensitivities

**Syntax:** `detection_sensitivities ... end_detection_sensitivities`

This command allows the definition of frequency-dependent or signal-type- and frequency-dependent detection sensitivities.

To define a table that is only frequency-dependent (for both "continuous" and "pulsed" signal-types):

```wsf
detection_sensitivities
   frequency <frequency-value-1> <db-power-1>
   frequency <frequency-value-2> <db-power-2>
   frequency <frequency-value-n> <db-power-n>
end_detection_sensitivities
```

To define a table that is signal-type- and frequency-dependent:

```wsf
detection_sensitivities
   signal_type <signal-type-1>
      frequency <frequency-value-1> <db-power-1>
      frequency <frequency-value-2> <db-power-2>
      frequency <frequency-value-n> <db-power-n>
   signal_type <signal-type-2>
      frequency <frequency-value-1> <db-power-1>
      frequency <frequency-value-2> <db-power-2>
      frequency <frequency-value-n> <db-power-n>
end_detection_sensitivities
```

**\<signal-type\>** A string input of the signal-type the table is for, valid values are ["continuous" | "pulsed" | "both"].

**\<frequency\>** A frequency value.

**\<db-power\>** The received signal strength required for detection at the indicated frequency.

When defining a signal-type- and frequency-dependent table, the following rule(s) must be noted:

- Any 'frequency' entry that occurs before the first 'signal_type' entry is assumed to apply to the "both" (i.e., continuous and pulsed) signal-types. If a 'signal_type' is then entered the corresponding data entered before for that signal-type will be cleared and the new data entered.

The process for determining sensitivity uses the following algorithm:

- If a signal-type-dependent table is being used, the signal-type of the received signal is used to locate the appropriate signal-type-specific set of frequency entries.
- Frequencies greater than or equal frequency-value-m and less than frequency-value-m+1 will use db-power-m
- Frequencies less than frequency-value-1 will use db-ratio-1.
- Frequencies greater than or equal to frequency-value-n will use db-power-n.

> **Note:** Entries will be sorted into increasing order of frequency.

> **Note:** If detection_threshold and/or continuous_detection_threshold and/or pulsed_detection_threshold and/or detection_thresholds and/or sensitivity_threshold and/or continuous_sensitivities and/or pulsed_sensitivity_threshold and/or detection_sensitivities are specified, the last one is used.

> **Note:** If neither detection_threshold and/or continuous_detection_threshold and/or pulsed_detection_threshold and/or detection_thresholds and/or detection_sensitivity and/or continuous_detection_sensitivity and/or pulsed_detection_sensitivity and/or detection_sensitivities are specified, the detection_threshold will assumed to be 3.0 dB for pulsed and continuous signal-types

#### continuous_detection_threshold

**Syntax:** `continuous_detection_threshold <db-ratio>`

#### pulsed_detection_threshold

**Syntax:** `pulsed_detection_threshold <db-ratio>`

#### detection_threshold

**Syntax:** `detection_threshold <db-ratio>`

This is an alternative to detection_sensitivity. It defines the minimum signal-to-noise ratio that can be 'reliably' detected. If detection_probability is defined then this is the signal-to-noise ratio that would result in a Pd of 0.5. If detection_probability is not defined then this defines the signal-to-noise ratio for which a successful detection will be declared.

The first two forms set the detection threshold for continuous wave and pulsed signals, respectively. The last form sets both thresholds to the same value. If **continuous_detection_threshold** is used then **pulsed_detection_threshold** must also be specified, and vice-versa. If no values for the detection thresholds or sensitivities are specified then both thresholds will be set to 3.0 db to be consistent with old input files.

**Default:** 3.0 dB (if both **detection_threshold(s)** and **detection_sensitivity(s)** are not defined)

#### detection_thresholds

**Syntax:** `detection_thresholds ... end_detection_thresholds`

This command allows the definition of frequency-dependent or signal-type- and frequency-dependent detection thresholds.

To define a table that is only frequency-dependent (for both "continuous" and "pulsed" signal-types):

```wsf
detection_thresholds
   frequency <frequency-value-1> <db-ratio-1>
   frequency <frequency-value-2> <db-ratio-2>
   frequency <frequency-value-n> <db-ratio-n>
end_detection_thresholds
```

To define a table that is signal-type- and frequency-dependent:

```wsf
detection_thresholds
   signal_type <signal-type-1>
      frequency <frequency-value-1> <db-ratio-1>
      frequency <frequency-value-2> <db-ratio-2>
      frequency <frequency-value-n> <db-ratio-n>
   signal_type <signal-type-2>
      frequency <frequency-value-1> <db-ratio-1>
      frequency <frequency-value-2> <db-ratio-2>
      frequency <frequency-value-n> <db-ratio-n>
end_detection_thresholds
```

**\<signal-type\>** A string input of the signal-type the table is for, valid values are ["continuous" | "pulsed" | "both"].

**\<frequency\>** A frequency value.

**\<db-ratio\>** The signal-to-noise ratio required for detection at the indicated frequency.

When defining a signal-type- and frequency-dependent table, the following rule(s) must be noted:

- Any 'frequency' entry that occurs before the first 'signal_type' entry is assumed to apply to the "both" (i.e., continuous and pulsed) signal-types. If a signal_type is then entered the corresponding data entered before for that signal-type will be cleared and the new data entered.

The process for determining threshold uses the following algorithm:

- If a signal-type-dependent table is being used, the signal-type of the received signal is used to locate the appropriate signal-type-specific set of frequency entries.
- Frequencies greater than or equal frequency-value-m and less than frequency-value-m+1 will use db-ratio-m
- Frequencies less than frequency-value-1 will use db-ratio-1.
- Frequencies greater than or equal to frequency-value-n will use db-ratio-n.

> **Note:** Entries will be sorted into increasing order of frequency.

> **Note:** If detection_threshold and/or continuous_detection_threshold and/or pulsed_detection_threshold and/or detection_thresholds and/or sensitivity_threshold and/or continuous_sensitivity_threshold and/or pulsed_sensitivity_threshold and/or detection_sensitivities are specified, the last one is used.

> **Note:** If neither detection_threshold and/or continuous_detection_threshold and/or pulsed_detection_threshold and/or detection_thresholds and/or sensitivity_threshold and/or continuous_sensitivity_threshold and/or pulsed_sensitivity_threshold and/or detection_sensitivities are specified, the detection_threshold will assumed to be 3.0 dB for pulsed and continuous signal-types

#### detection_probability

**Syntax:** `detection_probability ... end_detection_probability`

Defines a function of probability of detection (Pd) versus received signal strength (expressed as a ratio of the received power to the detection sensitivity). The table is defined as follows:

```wsf
detection_probability
   signal <db-ratio-1> pd <pd-value-1>
   signal <db-ratio-2> pd <pd-value-2>
   ...
   signal <db-ratio-n> pd <pd-value-n>
end_detection_probability
```

**\<db-ratio-n\>** The ratio of the received signal power to the detection sensitivity.

**\<pd-value-n\>** The probability of detection associated with the ratio.

Signals that exceed the limits of the table will be clamped to the appropriate endpoint. Intermediate values will be determined using linear interpolation.

If this function is not defined then a binary detector is used. The Pd will be 1.0 if the signal level is equal to or exceeds the detection sensitivity.

**Default:** Function is not defined - the binary detector is used.

> **Note:** If detection_threshold or detection_thresholds is used, the detection sensitivity will be computed as the detection threshold times the noise power.

#### scan_on_scan_model

**Syntax:** `scan_on_scan_model <boolean-value>`

Specifies if the Probabilistic Scan-On-Scan (PSOS) model should be employed. This model attempts to probabilistically capture the temporal effects in which the passive sensor is scanning in frequency and the emitter may be scanning in angle.

If the model is **off**, detection attempts will assume the target emitter is pointed (as closely as possible) directly at the passive sensor and that the passive sensor is currently attempting to detect the frequency at which the target emitter is emitting. This often results in an overly optimistic detection results.

If the model is **on**, the detection attempts will probabilistically consider the fact that the target emitter may be rotating and that the passive sensor may be scanning in frequency. The probabilistic frequency effects will be employed only if dwell_time and revisit_time are specified for every frequency_band.

**Default:** off

#### azimuth_error_sigma_table

**Syntax:** `azimuth_error_sigma_table ... end_azimuth_error_sigma_table`

#### elevation_error_sigma_table

**Syntax:** `elevation_error_sigma_table ... end_elevation_error_sigma_table`

#### range_error_sigma_table

**Syntax:** `range_error_sigma_table ... end_range_error_sigma_table`

These commands provide the ability to define error sigmas that are a function of the frequency of the received signal instead of the fixed sigmas that are provided by the single-valued sensor_mode.azimuth_error_sigma, sensor_mode.elevation_error_sigma and sensor_mode.range_error_sigma commands. The points define a curve on a plot whose x-axis is the log_10 of the frequency and the y-axis is the error sigma. Linear interpolation is used to derive the values for intermediate frequencies. Signals whose frequencies are outside the range of the table use the value from the appropriate endpoint (i.e., extrapolation is not performed).

The format of the command follows:

```wsf
type_error_sigma_table
   frequency <frequency-1> <error-sigma-1>
   frequency <frequency-2> <error-sigma-2>
   ...
   frequency <frequency-n> <error-sigma-n>
end_type_error_sigma_table
```

*type* is **azimuth**, **elevation** or **range** and *\<error-sigma\>* is a sigma using the same format as the values in sensor_mode.azimuth_error_sigma, sensor_mode.elevation_error_sigma and sensor_mode.range_error_sigma commands. Independent tables may be provided for each *type*.

> **Note:** The entries must in order of monotonically increasing frequency.

> **Note:** Providing a table will override any specification of its single-valued counterpart.

#### ranging_time

**Syntax:** `ranging_time <time-value>`

Adds range information to any track generated by this sensor after the specified time has elapsed. This basically simulates that the system could triangulate and get the range after a sufficient period of time.

#### ranging_time_track_quality

**Syntax:** `ranging_time_track_quality <quality-value>`

If the ranging time is used to generate a track with range information, this parameter controls the track quality once range is valid. The quality-value must be non-negative.

## Type: WSF_GEOMETRIC_SENSOR

### Overview

`WSF_GEOMETRIC_SENSOR` is a simple sensor based strictly on geometry. Subject to the additional constraints imposed in the Mode Commands below, a target will be detected if it is within the frustum formed by the Antenna Commands:

- The antenna_commands.azimuth_field_of_view
- The antenna_commands.elevation_field_of_view
- The antenna_commands.maximum_range and antenna_commands.minimum_range

> **Note:** The sensor mode accepts receiver commands, but that is only to gain access to the check_terrain_masking, terrain_masking_mode, and earth_radius_multiplier / effective_earth_radius commands defined there. Those commands are also documented here for convenience. The other commands documented in receiver are not used.

### Syntax

```wsf
sensor <name> WSF_GEOMETRIC_SENSOR
   ... Platform_Part_Commands ...
   ... Articulated_Part_Commands ...

   // Sensor Commands
   sensor Commands ...

   mode ...
      ... common sensor mode commands ...
      ... receiver ...
      ... Antenna_Commands ...
      platform_type [ <platform-type> | default ]
      check_terrain_masking <boolean-value>
      terrain_masking_mode [ terrain_and_horizon | terrain_only | horizon_only ]
      earth_radius_multiplier <value>
      effective_earth_radius <length-value>
      minimum_range_rate <speed-value>
      maximum_range_rate <speed-value>
   end_mode
end_sensor
```

### Mode Commands

#### platform_type

**Syntax:** `platform_type [ <platform-type> | default ]`

##### detection_range

**Syntax:** `detection_range <length-value>`

Defines the maximum detection range for targets with platform type of \<platform-type\>. If the keyword **default** is provided, the range will apply to all platform types that do not have their own entry for detection range or pd-range table.

##### pd_range_table

**Syntax:** `pd_range_table ... end_pd_range_table`

Defines a Probability of detection vs range table for targets with the platform_type of \<platform-type\>. Example:

```wsf
platform_type WSF_PLATFORM pd_range_table
   1.0     0 km
   0.8     0.5 km
   0.2     2.0 km
end_pd_range_table
```

If the keyword **default** is provided, the table will apply to all platform types that do not have their own entry for detection range or pd-range table.

> **Note:** It is an input error to define a table with less than two entries. Ranges must be ascending, and intermediate values are linearly interpolated. A platform_type may have both pd_range_table and detection_range.

> **Note:** When this table is present, for each detection the required probability of detection (required Pd) is determined randomly.

#### check_terrain_masking

**Syntax:** `check_terrain_masking <boolean-value>`

Determines if the sensor will perform terrain and horizon masking checks on a target. By default, horizon masking is checked first, followed by a separate terrain masking check if terrain is loaded. The simple horizon masking check assumes a smooth bald spherical Earth and that any object below zero mean sea level is obscured. For subsurface sensors, horizon checking can be disabled by setting the terrain_masking_mode to terrain_only.

**Default:** true (terrain and horizon masking checks are performed)

#### terrain_masking_mode

**Syntax:** `terrain_masking_mode [ terrain_and_horizon | terrain_only | horizon_only ]`

Sets the mode or type of masking checks to perform. By default, both horizon and terrain masking checks are enabled.

**Default:** terrain_and_horizon

#### earth_radius_multiplier

**Syntax:** `earth_radius_multiplier <value>`

#### effective_earth_radius

**Syntax:** `effective_earth_radius <length-value>`

Specify either the multiplier for Earth's radius, or the effective earth radius, used to compute the effects of atmospheric refraction of electromagnetic radiation.

For example, specifying `earth_radius_multiplier 1.3333333` allows the sensor to act as a low-fidelity surrogate for a radar sensor.

**Default:** earth_radius_multiplier 1.0

> **Note:** The Earth's radius is considered to be 6366707.019 meters.

#### minimum_range_rate

**Syntax:** `minimum_range_rate <speed-value>`

This sensor will not detect targets with a range rate less than this value.

**Default:** no minimum

#### maximum_range_rate

**Syntax:** `maximum_range_rate <speed-value>`

This sensor will not detect targets with a range rate greater than this value.

**Default:** no maximum

## Type: WSF_NULL_SENSOR

### Overview

`WSF_NULL_SENSOR` is the predefined null sensor type in `wsf.ag`.

It derives directly from the base `Sensor` struct and adds no sensor-specific commands beyond the inherited common sensor command set. It is also the fallback base type used by the grammar when a sensor definition is created without a resolvable sensor type.

### Syntax

```wsf
sensor <name> WSF_NULL_SENSOR
   ... Sensor Commands ...
end_sensor
```

## Type: WSF_COMPOSITE_SENSOR

### Overview

`WSF_COMPOSITE_SENSOR` provides the means to create a sensor that is a 'composite' of one or more 'constituent' sensors.

Within WSF it is sometimes difficult to model a complex sensor with a single sensor definition. For example, real systems that contain multiple apertures are often modeled in WSF using multiple sensors. This creates the following problems:

- Each of the sensors reports its tracks independently.
- Conducting tracking across the sensors is difficult.

The motivation behind `WSF_COMPOSITE_SENSOR` is to address these issues. The net result is that for a given target, the potentially multiple reports will be merged into a single track.

The composite sensor can operate in one of two operating_mode: independent or synchronous.

### Independent Operating Mode

When the operating_mode is **independent**, the constituent sensors act totally independently. That is, each of the constituent sensors must be turned on or off, cued or requested to track through its respective interface(s), not through the composite sensor. Note, however, the composite sensor must be 'on' for it to be effective. It must be 'on' to receive the track reports from the constituents. This mode is generally used when the frame rates of the constituents are not the same, the modes are not the same, or the user desires more control over the constituents.

While operating, each of the constituent sensors send its track reports to the composite sensor where the track reports are 'merged' into a single stream of reports for reporting. The composite track report is formed using the track reports generated by the constituent sensors. The composite sensor will report a track when it receives an 'acceptable' track report from one of its constituents. A track report is acceptable if it is of equal or greater track quality (as defined by the producing sensors track_quality attribute) than any other constituent sensor that is actively detecting the object. Note that a sensor that is 'coasting' (failed its last detection chance but still hasn't dropped the track) is not considered as actively detecting the object. The composite track may also be 'filtered' (see filter below) to produce a smoother estimate of the target's position and velocity, as well as producing a covariance. Note that if a filter is employed then measurement errors must be defined on each of the constituent sensors.

The composite sensor will send a 'track drop' message for a target when either of the following is true:

- A 'track drop' message is received from all constituent sensors that were reporting on the target.
- All of the constituent sensors that were reporting on the target are turned off.

### Synchronous Operating Mode

When the operating_mode is **synchronous**, the constituent sensors are completely controlled by the composite sensor. That is, all requests to turn on or off, cue or track must be directed to the composite sensor and not the constituent sensors. In addition, any passive sensor controlled via a composite sensor in synchronous mode will not be notified immediately of any intermittent signal changes, such as a frequency or mode selection, in an interacting transmitter (e.g. a comm, sensor, or interferer), as it would as a stand-alone sensor or as part of composite sensor operating in independent mode. To mitigate this effect, the sensor_mode.frame_time of the passive sensor can be decreased to allow detections to be reported more frequently.

This operating mode provides the most cohesive view, but there are several conditions that must be observed to use this mode:

- The constituent sensors must appear after the composite sensor on the platform.
- All of the constituent sensors must have the same collection of modes. They must have the same names and must appear in the same order within their respective definitions. Note, however, that attributes of the modes may be different.
- The mode-specific scheduling and tracking parameters for the composite sensor are copied from the first constituent sensor (i.e., the first sensor mentioned in the sensor commands). For example:
  - sensor_mode.frame_time
  - sensor_mode.maximum_request_count
  - sensor_mode.revisit_time
  - sensor_mode.dwell_time
  - sensor_mode.search_while_track
  - sensor_mode.disables_search
  - sensor_mode.hits_to_establish_track
  - sensor_mode.hits_to_maintain_track
  - reports_ commands
  - sensor_mode.track_quality
  - filter
- The commands to ignore detection chances for certain types of objects (i.e., sensor.ignore, sensor.ignore_domain, sensor.ignore_side, sensor.ignore_same_side) must be specified in the composite sensor.

### Syntax

```wsf
sensor <name> WSF_COMPOSITE_SENSOR
   ... Platform_Part_Commands ...
   ... Common sensor Commands ... (See Note in Commands)

   operating_mode ...
   sensor ...
   filter ... end_filter
   track_quality ...
end_sensor
```

### Commands

> **Note:** Even though this sensor is documented as accepting common sensor commands, they will be ignored and should not be specified for future compatibility. The attributes of the composite sensor are derived from its constituent sensors.

#### operating_mode

**Syntax:** `operating_mode independent`

Defines how the constituent sensors are managed.

**independent** - The constituent sensors operate independently.

**synchronous** - The constituent sensors operate synchronously with the composite sensor.

**Default:** None - this must be provided.

#### sensor

**Syntax:** `sensor <sensor-name>`

Defines the name of a constituent sensor. This command must be repeated one or more times specifying the names of the 'constituent' sensors that make up the 'composite' sensor. In general, all of the constituent sensors should be of the same general type. At the current time the sensors should be a type that reports tracks (WSF_RADAR_SENSOR, WSF_IRST_SENSOR, WSF_PASSIVE_SENSOR).

> **Note:** The sensor definitions of the composite sensor should not include 'internal_link' commands. The constituent sensors will be automatically linked to the composite sensor as required.

#### filter

**Syntax:** `filter <filter-type> ... end_filter`

Defines a filter to be applied to the stream of tracks for a target when the operating_mode is **independent**.

**Default:** none

> **Note:** If a filter is employed then measurement errors must be defined on each of the constituent sensors.

> **Note:** This command must appear **after** the operating_mode command.

#### track_quality

**Syntax:** `track_quality [ 0 .. 1 ]`

Specifies the track quality to be assigned to the composite tracks produced by this sensor when the operating_mode is **independent**. This value is used only if it is greater than zero. If the value is zero then the track quality for the constituent tracks will be used.

**Default:** 0.0 (Use the track quality from the constituent tracks.)

## Field of View Commands

Field of views specify geometrical limits to determine if a subsystem can potentially interact with another object. Field of views are valid for anything that uses an electromagnetic antenna, including transmitter and receiver.

```wsf
field_of_view <field-of-view-type>
   ... Type Commands ...
end_field_of_view
```

**\<field-of-view-type\>** can be:

- rectangular
- circular
- polygonal
- equatorial

Each type have their own unique input keywords.

### rectangular

```wsf
field_of_view rectangular
   azimuth_field_of_view <angle-value> <angle-value>
   elevation_field_of_view <angle-value> <angle-value>
end_field_of_view
```

Defines a field of view with azimuth and elevation extents.

#### azimuth_field_of_view

**Syntax:** `azimuth_field_of_view <angle-value> <angle-value>`

Specify the minimum and maximum angle about which the subsystem can see in azimuth. The limits are with respect to the current cue. In general these values should be greater than or equal to the antenna_commands.azimuth_scan_limits (possibly accounting for the width of the beam when the subsystem is positioned to its scan limit).

**Default:** -180.0 degrees to 180 degrees

> **Note:** These values are used only for initial screening to determine if the object can potentially interact with another object.

#### elevation_field_of_view

**Syntax:** `elevation_field_of_view <angle-value> <angle-value>`

Specifies the minimum and maximum angle about which the subsystem can see in elevation. The limits are with respect to the current cue. In general these values should be greater than or equal to the antenna_commands.azimuth_scan_limits (possibly accounting for the width of the beam when the subsystem is positioned to its scan limit).

**Default:** -90.0 degrees to 90 degrees

> **Note:** This is the default field of view type.

### circular

```wsf
field_of_view circular
   half_angle <angle-value>
end_field_of_view
```

Defines a field of view that is circular, defining a conical solid angle.

#### half_angle

**Syntax:** `half_angle <angle-value>`

Specify the half angle from the center to the edge of the circle that the subsystem can see.

### polygonal

```wsf
field_of_view polygonal
   azimuth_elevation <angle-value> <angle_value>  # 1st point
   azimuth_elevation <angle-value> <angle_value>  # 2nd point
   azimuth_elevation <angle-value> <angle_value>  # 3rd point
   ...
   azimuth_elevation <angle-value> <angle_value>  # nth point
end_field_of_view
```

Defines a field of view that is polygonal, as defined by a series of azimuth_elevation values from the eyepoint. At least three values are required.

#### azimuth_elevation

**Syntax:** `azimuth_elevation <angle-value> <angle-value>`

Specify the az and el values to a point defining the polygonal field of view.

### equatorial

```wsf
field_of_view equatorial
   equatorial_field_of_view <angle-value> <angle-value>
   polar_field_of_view <angle-value> <angle-value>
end_field_of_view
```

Defines a field of view that is rectangular but, unlike the rectangular field of view, has as its sphere of orientation a celestial sphere with equator matching the earth's projected, instantaneous equator, rather than a celestial sphere with equator matching the local horizon (i.e., the North-East plane in the local North-East-Down coordinate system). The difference between an equatorial field of view and similarly defined rectangular field of view is a rotation by the parallactic angle about the sensor's pointing direction.

#### equatorial_field_of_view

**Syntax:** `equatorial_field_of_view <angle-value> <angle-value>`

Specify the minimum and maximum angle about which the subsystem can see in the equatorial coordinate (azimuthal angle of the equatorial celestial sphere). The limits are with respect to the current cue.

**Default:** -180.0 degrees to 180 degrees

> **Note:** These values are used only for initial screening to determine if the object can potentially interact with another object.

#### polar_field_of_view

**Syntax:** `polar_field_of_view <angle-value> <angle-value>`

Specifies the minimum and maximum angle about which the subsystem can see in the polar coordinate (polar angle of the equatorial celestial sphere). The limits are with respect to the current cue.

**Default:** -90.0 degrees to 90 degrees
