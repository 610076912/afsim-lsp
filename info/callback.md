# callback

## Overview

`callback` provides a mechanism to trigger one or more scripts when a platform reaches a waypoint. The triggered script can execute either in the platform context or in one of its processors.

## Syntax

```wsf
callback <name> WSF_SCRIPT_CALLBACK
   execute <script-name> [ in <processor-name> ]
   ...
end_callback
```

## Commands

### execute

**Syntax:** `execute <script-name> [ in <processor-name> ]`

Specifies the script that the callback should invoke when it is triggered. If `in <processor-name>` is supplied, the script executes in that processor's context.

Multiple `execute` commands may be provided in the same callback block.

## Notes

- `callback` is valid as a top-level named definition in the grammar.
- Platform contexts can also use callback-related commands such as `callback ... end_callback` and `use_callback ... end_use_callback`.
- Waypoint integration is documented through `route.execute` and related script APIs.
