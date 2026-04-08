# visual_part

**Script Class:** `WsfVisualPart`

## Overview

A `visual_part` provides the ability for a platform to represent articulated parts that are not defined by existing `comm` or `sensor` platform parts.

Visual parts may be published over DIS by using `dis_interface.articulated_part`.

## Syntax

```wsf
visual_part <name> WSF_VISUAL_PART
   ... Platform_Part_Commands ...
   ... Articulated_Part_Commands ...
end_visual_part
```

## Notes

- `visual_part` is available both as a globally defined type and as a platform/platform_type component instance in `wsf.ag`.
- The predefined base type is `WSF_VISUAL_PART`.
