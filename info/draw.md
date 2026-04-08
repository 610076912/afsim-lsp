# draw

### draw

**Syntax:** `draw <object-type> <object-name>`

## Syntax

```wsf
draw *<object-type>* *<object-name>*
   color_ ...
   color2_ ..
   line_size_ ...
   point_size_ ...
end_draw
```

## Overview

Draws an object using `WsfDraw`.

<object-type>
   Type of object to draw. Can be one of the following:

 * route
 * route_network

<object-name>: The name of the object in the input file.

## Commands

### color <color-value>

Sets the primary and secondary colors used to draw the object.

**Default:** blue and yellow, respectively

### color2 <color-value>

Sets the primary and secondary colors used to draw the object.

**Default:** blue and yellow, respectively

### layer <layer_name>

Sets the layer name of this draw object. Unless specified, this object will not be drawn in a layer.

### line_size <size_value>

Sets the width of the lines used to draw the object.

**Default:** 1

### point_size <size_value>

Sets the size of the points used to draw the object.

**Default:** 2

## Example

```wsf
draw route_network road_network
  color  float 0 0 1
  color2 float .5 .5 1
  line_size 2
  point_size 1
end_draw
```
