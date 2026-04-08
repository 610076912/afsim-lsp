# group

**Script Class:** `WsfGroup`

### group

**Syntax:** `group <group-name> <base-group-type>`

## Syntax

```wsf
group **<group-name> <base-group-type>**
  aux_data_ ...
end_group
```

## Overview

A `group` object represents an aggregation of `platform` and platform part (`sensor`, `processor`, `comm`)
objects. In order to join a group the object must either provide the *group_join* input for
`platforms <platform.group_join>` or `platform parts <_.platform_part.group_join>`, or one may use the script
method `WsfGroup.AddMember(...)`.

The base type `WsfGroup` has only auxiliary data.

## Commands

### aux_data

**Syntax:** `aux_data <aux-data> ... end_aux_data`

Defines auxiliary data for a group. See `aux_data`.
