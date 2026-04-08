# conditional_section

### conditional_section

**Syntax:** `conditional_section ... end_conditional_section`

## Syntax

```wsf
conditional_section
   conditionals
      # Conditionals Commands
      feature_present     ripr
      feature_not_present os:windows
      wsf_version         >  1.0.0
      type_present        WSF_SCRIPT_PROCESSOR
      type_not_present    WsfArray
   end_conditionals

   // Commands here are only run if the previous conditions passed
   <wsf-commands>
end_conditional_section
```

## Overview

Defines a block which is conditionally processed by WSF. This construct allows inclusion or exclusion of simulation
inputs based on present features or the wsf version. After the 'conditionals' block, any top-level WSF command may
be processed. conditional_section blocks may be nested.

### conditionals

**Syntax:** `conditionals <conditionals-commands> ... end_conditionals`

Condition testing commands present in this block determine the inclusion of the commands that follow this block.

## Conditionals Commands

### feature_present <feature-name>

Tests that a feature is present. If the feature is not present, the contents of the conditional section is ignored.

### feature_not_present <feature-name>

Tests that a feature is **not** present. If the feature **is** present, the contents of the conditional section is
ignored.

### wsf_version <operator> <wsf-version>

Compares the WSF version to a version string delimited by periods. If the comparison fails, the conditional section
is ignored.

- operator: One of: <, <=, >, >=, =
- wsf-version: Version to compare against. Should be in the form 1.2.3

```wsf
# Test that the wsf_version is greater than 1.0.0
wsf_version > 1.0.0
```

### type_present <type-name>

### type_not_present <type-name>

Determines if a 'type' is present. If any sensor, processor, comm, mover, fuel,
filter, service or script type exists with the given name, the type is considered present. If the type is not present,
the conditional section is ignored.

## Features

WSF will define a number of features available depending on build type and the optional modules available in the
executable. The following is base list of possible features, that may not be all inclusive:

 * os:windows
 * os:linux
 * addr:64-bit
 * addr:32-bit
 * os:apple
 * cpu:intel
 * build:debug
 * build:release
 * build:unknown
