# script_struct

> **Warning:** Prior to WSF 2.0, script_struct instances were created with the struct.New method and the variables and methods in the instance had to be accessed via the '->' operator. Unfortunately that implementation was not type-safe and lead to many hard-to-find errors. What is being described here is the new syntax. The old syntax should not be used unless you need the "struct on the fly" capabilities.

## Overview

The 'script_struct' block defines a new 'class' that behaves much like any of the built-in classes (e.g.: `WsfGeoPoint`). Instances of the class can be used as arguments to or returned by script methods and be used as template types in the `Array<Array<T>>`, `Map<Map<T1,T2>>` and `Set<Set<T>>` containers. **A script_struct block that defines a new class is valid only as a top-level command** (that is, they cannot be inside platforms, processors or any other block). In addition, a script_struct class must be defined before it is used. The following section demonstrates the creation and use of a struct.

## Syntax

```wsf
script_struct Name
   script_variables
      ...
   end_script_variables
   script ...
   ...
   end_script
   uncloneable
end_script_struct
```

## Commands

### uncloneable

**Syntax:** `uncloneable`

Specify that instances of this script_struct cannot be cloned.

> **Note:** script_structs are cloneable by default.

## Example

```wsf
script_struct Car
   script_variables
      WsfGeoPoint  position = { };
      Vec3         velocity = { };
      string       color = "red";
   end_script_variables
   script void Honk()
      writeln(color, " car honks");
   end_script
end_script_struct

on_initialize
   # Create a new instance of the struct
   Car car = Car();

   # Clone the new instance
   Car clone = Car(car);

   # Assign some values.
   car.color = "blue";
   car.position.Set(39, -90, 125.0);
   car.velocity.Set(20, 0, 0);

   # Call a script
   car.Honk();

   # Print the contents of the struct
   writeln(car);
end_on_initialize
```

Output:

```
blue car honks
struct({"position": 39:00:00.0n 90:00:00.0w 125, "velocity": (20, 0, 0), "color": blue})
```

## Example: Struct as a Container Type

```wsf
script_struct Cat
   script_variables
      string name = "unknown";
      int livesLeft = 9;
   end_script_variables
   script int UseA_Life()
      if (livesLeft > 0) livesLeft -= 1;
      if (livesLeft <= 0)
      {
         writeln("So sorry, ", name, " has used all of its lives");
      }
      return livesLeft;
   end_script
end_script_struct

on_initialize
   Cat cat1 = { };
   cat1.name = "fluffy";
   Cat cat2 = { };
   cat2.name = "morris";

   cat1.UseA_Life();
   cat1.UseA_Life();
   cat1.UseA_Life();
   cat1.UseA_Life();
   cat1.UseA_Life();
   cat1.UseA_Life();
   cat1.UseA_Life();
   cat1.UseA_Life();

   int i1 = cat1.UseA_Life();
   writeln(cat1.name, " has ", cat1.livesLeft, " lives left");
   if (i1 != 0)
   {
      writeln("-FAIL- fluffy should have 0 lives left, but has ", i1);
   }

   int i2 = cat2.UseA_Life();
   writeln(cat2.name, " has ", cat2.livesLeft, " lives left");
   if (i2 != 8)
   {
      writeln("-FAIL- morris should have 8 lives left, but has ", i1);
   }

   # Some simple tests of Cats as container members. Not a full-blown test,
   # but at least it checks compilation.

   Array<Cat> catArray = { };
   catArray.PushBack(cat1);
   catArray.PushBack(cat2);
   writeln("CatArray: ", catArray);
   writeln("foreach over catArray");
   foreach (Cat cat in catArray)
   {
      writeln("  cat=", cat);
   }

   Map<string, Cat> catMap = { cat1.name : cat1, cat2.name : cat2 };
   writeln("Cat Map: ", catMap);
   writeln("foreach over catMap");
   foreach (string name : Cat cat in catMap)
   {
      writeln("  ", name, " ", cat);
   }

   Set<Cat> catSet = { cat1, cat2 };
   writeln("Cat Set: ", catSet);
   writeln("foreach over catSet");
   foreach (Cat cat in catSet)
   {
      writeln("  cat=", cat);
   }
end_on_initialize
```

Output:

```
So sorry, fluffy has used all of its lives
fluffy has 0 lives left
morris has 8 lives left
CatArray: {struct({"name": fluffy, "livesLeft": 0}), struct({"name": morris, "livesLeft": 8})}
foreach over catArray
  cat=struct({"name": fluffy, "livesLeft": 0})
  cat=struct({"name": morris, "livesLeft": 8})
Cat Map: {fluffy : struct({"name": fluffy, "livesLeft": 0}), morris : struct({"name": morris, "livesLeft": 8})}
foreach over catmap
  fluffy struct({"name": fluffy, "livesLeft": 0})
  morris struct({"name": morris, "livesLeft": 8})
Cat Set: {struct({"name": fluffy, "livesLeft": 0}), struct({"name": morris, "livesLeft": 8})}
foreach over catSet
  cat=struct({"name": fluffy, "livesLeft": 0})
  cat=struct({"name": morris, "livesLeft": 8})
```

## Struct on the Fly (Legacy)

> **Warning:** This example uses the old syntax for creating an instance of a struct and accessing the variables and methods. **This is not type-safe** and should be avoided unless you need to dynamically add new variables to the struct.

```wsf
# A struct is best used with the basic types (int, double, bool, string). However,
# it can be used to contain the data of complex types (WsfPlatform, WsfGeoPoint, etc)
#
script_variables
   WsfGeoPoint point1 = WsfGeoPoint();
   point1.Set(0,0,1);
end_script_variables
platform test WSF_PLATFORM
   on_initialize2
      # Empty structs can be created and used like this:
      struct container = struct();
      container->a = 1.0;     # Gets recognized as a double
      container->b = 5.0;     # Gets recognized as a double
      container->c = "test1"; # Gets recognized as a string
      container->d = 10;      # Gets recognized as an int
      container->e = false;   # Boolean equal to false
      container->x = (string)"test2"; # type cast to a string (overkill)
      container->y = (double)10;      # force a type cast number without a decimal point to a double
      container->z = (string)"500";   # type cast to a string (overkill)
      container->p1 = point1;         # bring in an external complex type variable
      container->p2 = WsfGeoPoint();  # Create an empty GeoPoint complex type
      container->p3 = WsfGeoPoint.Construct(0,0,0); # Create a GeoPoint that has an LLA

      writeln(container); # The whole container can be passed around as one object...

      # THE ONLY PERIOD "." METHODS AVAILABLE WHEN USING THE "->" OPERATOR ON COMPLEX TYPES
      # ARE ToString(), IsValid(), and IsNull().
      writeln("p1 in container is ", container->p1.ToString() );
      writeln("p2 in container is ", container->p2.ToString() );
      writeln("p3 in container is ", container->p3.ToString() );

      # The following illustrates how to update objects in a container.
      # If a struct variable is a complex type, a typical period "." method CANNOT
      # be used directly on the variable because the type is not known using the "->" operator.

      container->a = container->a + 1; # Add 1 to var a. Since it is not using a ".", it will work.

      #container->p2 = container->p2.Set(0,0,2); # WRONG - THIS LINE WILL FAIL
      #Use one of these:
      ((WsfGeoPoint)container->p2).Set(0,0,2);   # Cast to WsfGeoPoint and call Set();   OR:
      WsfGeoPoint p2 = container->p2;            # Get value and call Set()
      p2.Set(0,0,2);

      #container->p3.Set(0,0,3); # WRONG - THIS LINE WILL FAIL
      ((WsfGeoPoint)container->p3).Set(0,0,3);   # Cast to WsfGeoPoint and call Set();   OR:
      WsfGeoPoint p3 = container->p3;
      p3.Set(0,0,3);

      writeln("p2 in container after updating is ", container->p2.ToString() );
      writeln("p3 in container after updating is ", container->p3.ToString() );
   end_on_initialize2
end_platform
```

Output:

```
struct({"p1": WsfGeoPoint, "z": 500, "e": 0, "d": 10, "a": 1, "p3": WsfGeoPoint, "y": 10, "c": test1, "p2":
WsfGeoPoint, "x": test2, "b": 5})
p1 in container is 00:00:00.0n 00:00:00.0e 1
p2 in container is 00:00:00.0n 00:00:00.0e 0
p3 in container is 00:00:00.0n 00:00:00.0e 0
p2 in container after updating is 00:00:00.0n 00:00:00.0e 2
p3 in container after updating is 00:00:00.0n 00:00:00.0e 3
```

## Using a Map Containing a Struct (Legacy)

> **Warning:** This example uses the old syntax for creating an instance of a struct and accessing the variables and methods. **This is not type-safe** and should be avoided unless you need to dynamically add new variables to the struct.

```wsf
platform TEST_VEHICLE WSF_PLATFORM
   add processor script_proc WSF_SCRIPT_PROCESSOR
      script_variables
         struct myContainer = struct(); # Make a struct named myContainer
         myContainer->counter = 1;  # One field being a counter
         myContainer->JustAColor = "Gray"; # Another field with a string
         myContainer->JustANumber = 0; # Any number
         myContainer->MaxNumber = 50; # A maximum number
      end_script_variables

      update_interval 1 sec
      on_update
         extern struct myContainer; # Bring in the struct "myContainer"
         myContainer->AirplaneType = "F-18"; # Add a member to myContainer
         Map<int, struct> MyMapWithStruct = Map<int, struct>(); # Create a map of a struct
         MyMapWithStruct[0] = myContainer; # Set index 0 of the map to the contents of myContainer
         foreach (int aKey : struct aData in MyMapWithStruct)
         {
            writeln("key, data ", aKey, ", ", aData);
            myContainer->JustANumber = MATH.Roll(1,10);
            if(myContainer->counter >= 25)  myContainer->JustAColor = "Blue";
            if(myContainer->counter >= (myContainer->MaxNumber - 5) ) WsfSimulation.Terminate();
            myContainer->counter = myContainer->counter + 1;
         }
      end_on_update
   end_processor
end_platform
```

## See Also

`struct` - struct script class
