# behavior_tree

## Overview

The Behavior Tree is an artificial intelligence technology that allows scenario developers to quickly create flexible agents with various tactical modules, called behaviors or behavior nodes. The nodes can be arranged together in interesting and interrelated ways with connector nodes.

There are two basic node types:

- `behavior` - the leaf nodes of the tree, contain user defined script that performs a particular behavior or action.
- Connector Nodes - useful for building & organizing the tree. These nodes specify how behavior nodes are related to each other.

## Syntax

```wsf
behavior_tree
   <one or more nodes>
end_behavior_tree
```

## Connector Nodes

Connector Node Structure & Syntax:

```
<connector-node-type>
  [run_selection ...]
  [make_selection ...]
  <two or more nodes>
end_<connector-node-type>
```

Currently, there are five supported connector-node-types: sequence, parallel, selector, priority_selector, and weighted_random.

Any node on the behavior tree can have any number of child nodes (either connector or behavior type). These child nodes can subsequently have any number and type of children as well, and so on. Two of the connector node types perform a sequence of sorts and cannot make use of any modifiers, however there are three connector nodes types that perform a single child selection (selector, priority_selector, and weighted_random) and these can be further specialized by using the sub-commands run_selection and make_selection.

### sequence
**Syntax:** `sequence ... end_sequence`

Sequence nodes are the 2nd most common connector node used in behavior trees. When a sequence node is reached, it executes all of its children in order, until one of the children fails its precondition. If the first child fails, then none of the children are executed. If all children pass their preconditions, they are all executed. If the first half of the children pass and the next node fails, then the first half of the children are all executed, and the second half are not.

### parallel
**Syntax:** `parallel ... end_parallel`

Parallel nodes are connector nodes used in the behavior tree in order to execute every one of their children that passes precondition, regardless of ordering.

### selector
**Syntax:** `selector ... end_selector`

Selector nodes are the most common connector node used in behavior trees. A selector node dictates the tree to choose only one of its children to execute. The tree will execute the first child of a selector node that passes its precondition.

### priority_selector
**Syntax:** `priority_selector ... end_priority_selector`

Priority-Selector nodes are connector nodes used in the behavior tree in order to choose and execute whichever child is highest valued. The value of a child is determined by its precondition script block. Priority-Selector nodes always (and only) execute their highest valued child.

### weighted_random
**Syntax:** `weighted_random ... end_weighted_random`

Weighted-Random nodes are connector nodes used in the behavior tree in order to randomly choose and execute a child. A uniform weighted random selection is performed, and the weights for each child are determined by their precondition script blocks. For example, if a Weighted-Random node has two children and both return a value of "3", then they are equally likely to be chosen. It will be common for Weighted-Random nodes to use the "run_selection" feature, in order to allow their selected child to execute for a while (or until done) before another random selection is made.

### Connector Node Sub-Commands

*(only useful for types: selector, priority_selector, and weighted_random)*

#### run_selection
**Syntax:** `run_selection [ until_done | for <time> | repeat <int> ]`

Specify how long a selected child will be executed for, rather than the default: once (repeat 1). If "until_done" is declared, then a child node will be executed until its precondition returns 0.0 or false.

#### make_selection
**Syntax:** `make_selection [ continuous | count <int> ]`

Specify how many selections will be made, rather than the default: continuous. This doesn't affect or change whatever is defined by make_selection, but rather it could limit how many times a selector type node will perform.

## Defining a behavior_tree

By default, the behavior tree has an invisible root node that is a parallel node. All behaviors, and all nodes that exist at the root level will all be checked for preconditions and executed if the preconditions passed.

Behavior trees can contain [theoretically] an infinite depth of nested connector nodes and behaviors.

*Example Shallow Behavior Tree*:

```wsf
# all these named behaviors are assumed to be pre-defined
behavior_tree
   behavior_node check_fuel
   behavior_node check_instruments
   behavior_node drink_coffee
end_behavior_tree
```

*Example Simple Behavior Tree*:

```wsf
# sequences over the "check_fuel" and "check_instruments" behaviors every update
behavior_tree
   sequence
      behavior_node  check_fuel
      behavior_node  check_instruments
   end_sequence
end_behavior_tree
```

*Example Nested Behavior Tree*:

```wsf
# all these named behaviors are assumed to be pre-defined
behavior_tree
  sequence
    behavior_node drink_coffee
    selector
      behavior_node check_fuel
      behavior_node check_instruments
    end_selector
  end_sequence
end_behavior_tree
```

## Behavior Tree Design Considerations

The two main considerations of the tree builder are the preconditions of behavior nodes and the placement of nodes in the tree. These two considerations working together decide which nodes of a behavior tree execute. The precondition is an internal check a node does to determine if it can even run. The position of a node in the behavior tree acts as an "external check" to determine whether or not it will run. For example, if a node is a child of a selector node and other child nodes are often selected, then this node may never get called on.

## Behavior Nodes

```wsf
behavior <type-name>
   script_variables ... end_script_variables
   on_init          ... end_on_init
   on_message       ... end_on_message
   precondition     ... end_precondition
   on_new_execute   ... end_on_new_execute
   on_new_fail      ... end_on_new_fail
   execute          ... end_execute
   <finite state machine inputs>
   <zero or more nodes>
end_behavior
```

A behavior (also called a behavior node or a leaf node) is one of the two basic node types used by a behavior_tree. A behavior is defined globally at the simulation level. Every behavior defined in a scenario must be given a unique name. Once a behavior is defined, any behavior tree can use it, by referencing it by name.

### Behavior Mode of Operation

Behavior nodes themselves can have child nodes of any type; child nodes are executed after the behavior performs its execute script. Behavior nodes can also have a finite state machine (FSM) on them, one per behavior node. To implement the FSM, define states with transition rules inside the behavior block.

In summary, a behavior node processes itself in this order:

- The behavior node's on_init script block is run when the owning processor initializes in the simulation
- The behavior_tree has to traverse to the node when it updates (the node's position in the tree determines if this happens)
- The node's precondition script block is run
- If the precondition returns false, and the node was ran last time, then:
  - The node's on_new_fail script is run
- If the precondition returns successful, then:
  - If the node was not ran last time, it's on_new_execute script is run
  - The node's execute script block is run (if exists)
  - The node's children nodes are run (if exist)
  - The node's finite state machine is run (if exists), current state evaluated and zero or one state transitions made

### Behavior Node Commands

#### on_init
**Syntax:** `on_init ... end_on_init`

Behaviors have an on_init script block to help them initialize any necessary member variables or perform any preprocessing.

#### on_message
**Syntax:** `on_message ... end_on_message`

Behaviors can receive and process messages. Be sure the comm is linked to the processor that the behavior is on.

#### precondition
**Syntax:** `precondition ... end_precondition`

Every behavior must have a precondition script block that returns either a true/false Boolean value or a real number. Some parent nodes will check a behavior's precondition and use its return value as a real number and some will use its return value as a Boolean number. If a precondition returns true/false and it's used a real number, then "true" equates to 1.0 and "false" equates to 0.0. If a precondition returns a real number and it's used as a Boolean than 0.0 equates to "false" and everything else equates to "true." Any tree or node that owns this behavior uses the precondition to determine whether or not that behavior will execute, and subsequently how the whole tree will be traversed and processed on each update.

#### on_new_execute
**Syntax:** `on_new_execute ... end_on_new_execute`

If a behavior node is run and was not ran last update, then this script block is run.

#### on_new_fail
**Syntax:** `on_new_fail ... end_on_new_fail`

If a behavior node is not run and was ran last update, then this script block is run.

#### execute
**Syntax:** `execute ... end_execute`

If a behavior node is traversed to by the tree, and its precondition returns a value that the parent node uses to select it for execution, then the behavior's execute script is performed. This script block should be significant, it is what the behavior exists for.

#### show_state_evaluations

Indicates that information about state evaluations should be written to standard output. This essentially shows the true or false status of the evaluation of each next_state block.

#### show_state_transitions

Indicates that information about state transitions should be written to standard output.

#### state
**Syntax:** `state <state-name>`

Defines a state in a state machine with the name \<state-name\>. States can have their own behavior tree within them; it is updated when the state is evaluated.

```wsf
state <state-name>
  on_entry
     ... Script Body ...
  end_on_entry
  on_exit
     ... Script Body ...
  end_on_exit
  next_state <next-state-name-1>
     ... Script Body ...
  end_next_state
  next_state <next-state-name-n>
     ... Script Body ...
  end_next_state
  behavior_tree
     ... Behavior Tree Commands ...
  end_behavior_tree
end_state
```

## Type: advanced_behavior_tree

Advanced Behavior Trees build upon Behavior Trees, allowing for 3 states (Running, Success, Failure) rather than two (Success, Failure). The addition of a third state allows the AI to be more complex and reactive.

```wsf
advanced_behavior_tree
   <one or more nodes>
end_advanced_behavior_tree
```

There are two basic node types:

- `advanced_behavior` - the leaf nodes of the tree, contain user defined script that performs a particular behavior or action.
- Composite Nodes - useful for building & organizing the tree. These nodes specify how behavior nodes are related to each other.

### Composite Nodes

Composite Node Structure & Syntax:

```
<composite-node-type>
   name <string>
   <one or more nodes>
end_<composite-node-type>
```

Currently, there are seven supported composite-node-types: sequence, sequence_with_memory, selector, selector_with_memory, parallel, priority_selector, and weighted_random.

There are also 4 decorator nodes: repeater, inverter, succeeder, and negator.

Composite nodes may have any number of children nodes. Decorators may only have one child.

#### selector
**Syntax:** `selector ... end_selector`

Selector nodes execute all children in order (top to bottom in script, left to right in the behavior tree tool). If any child succeeds, the selector will succeed and all children after it will be skipped. If all children fail, the selector will fail.

#### selector_with_memory
**Syntax:** `selector_with_memory ... end_selector_with_memory`

Selector nodes with memory work exactly like normal selector nodes with one caveat: If a node fails the selector will move memory forward, and will not check that child until memory is reset. Memory is reset when a node succeeds, or all children fail.

#### sequence
**Syntax:** `sequence ... end_sequence`

Sequence nodes execute all children in order. If any child fails its precondition or execute script, the sequence will fail and all children after it will be skipped. If all children succeed, the sequence will succeed.

#### sequence_with_memory
**Syntax:** `sequence_with_memory ... end_sequence_with_memory`

Sequence nodes with memory work exactly like normal sequence nodes with one caveat: If a node succeeds the sequence will move memory forward, and will not check that child until memory is reset. Memory is reset when a node fails, or all children succeed.

#### parallel
**Syntax:** `parallel ... end_parallel`

Parallel nodes will execute all children at the same time, regardless of ordering. Parallel nodes make use of a success policy to determine success/failure. If all children have finished executing and the policy has not been hit, the parallel node will fail. By default, parallel nodes use succeed_on_one, which means only one child node needs to succeed for the parallel node to succeed.

#### priority_selector
**Syntax:** `priority_selector ... end_priority_selector`

Priority-Selector nodes choose and execute whichever child is highest valued. The value of a child is determined by its precondition script block. Priority-Selector nodes always execute their highest valued child.

#### weighted_random
**Syntax:** `weighted_random ... end_weighted_random`

Weighted-Random nodes are connector nodes used in the behavior tree in order to randomly choose and execute a child. A uniform weighted random selection is performed, and the weights for each child are determined by their precondition script blocks.

### Decorator Nodes

Decorator nodes are similar to composite nodes, but with only one child. Decorators modify how the child below them behaves.

#### decorator inverter
**Syntax:** `decorator inverter ... end_decorator`

Inverter nodes will invert the return status of its child node. If the child returns success, the inverter will return failure, and if the child returns failure, the inverter will return success.

#### decorator negator
**Syntax:** `decorator negator ... end_decorator`

Negator nodes will return failure regardless of the return status of the child.

#### decorator succeeder
**Syntax:** `decorator succeeder ... end_decorator`

Succeeder nodes will return success regardless of the return status of the child.

#### decorator repeater
**Syntax:** `decorator repeater [ repeat <int> | for <time> | until_done ] ... end_decorator`

Repeater nodes will execute their child repeatedly until the criteria set has been fulfilled. Repeater nodes return success after reaching this criteria. Repeat \<int\> will tick the child node an \<int\> amount of times before succeeding. For \<time\> will tick the child node until an amount of \<time\> has passed. Until_done will repeat the child node until it returns either success or failure.

### Subtrees

Trees may also be defined within other trees. This is useful for visually separating sections of a tree, as well as reusing the tree.

```wsf
# all these named behaviors are assumed to be pre-defined
advanced_behavior_tree
  sequence
     behavior_node wake_up
     advanced_behavior_tree
        sequence
           behavior_node eat
           behavior_node exercise
        end_sequence
     end_advanced_behavior_tree
  end_sequence
end_advanced_behavior_tree
```

### Advanced Behavior Tree Other Commands

#### name
**Syntax:** `name <string>`

Name the tree. This will display on the root node and in the tree selection combo box in the Behavior Tree View in Mystic.

#### desc
**Syntax:** `desc <string>`

Define a description for the tree. This will show when the root node is hovered over in the Behavior Tree View in Mystic.

#### btt
**Syntax:** `btt <boolean>`

Define whether or not the tree sends the required data to show a tree in the Behavior Tree View in Mystic.

#### root_node_type
**Syntax:** `root_node_type [parallel | priority_selector | selector | selector_with_memory | sequence | sequence_with_memory | weighted_random]`

Set the composite node type for the root node of this tree.

#### success_policy
**Syntax:** `success_policy [threshold <int> | succeed_on_one | succeed_on_all]`

Sets the success_policy for a parallel node or an advanced_behavior_tree using root_node_type parallel. Three policies may be set for handling success on a parallel node: Threshold will take an integer amount of nodes that must succeed for the parallel node to succeed. Succeed_on_one will make the parallel node succeed if any child succeeds. Succeed_on_all will make the parallel node succeed only if all children succeed.

## Type: advanced_behavior

Advanced behaviors are similar to normal behaviors, with the addition of 3-state and blackboard functionality, as well as additional visualization features.

```wsf
advanced_behavior <type-name>
   enabled <boolean>
   name <string>
   desc <string>
   color <color-value>
   script_variables ... end_script_variables
   on_init          ... end_on_init
   on_message       ... end_on_message
   precondition     ... end_precondition
   on_new_execute   ... end_on_new_execute
   on_new_fail      ... end_on_new_fail
   execute          ... end_execute
   <finite state machine inputs>
   <zero or more nodes>
end_advanced_behavior
```

### 3-State

Advanced behaviors allow the scripter to return based around 3 states rather than 2.

Inside of precondition and execute blocks, return statements should return either a double/float for weighted_random and priority_selector, or one of the 3 states below. These return statements will inform the behavior tree of what state to set for the node that tick. An optional string may be given that will set the tooltip text for the node in the Behavior Tree Tool in Mystic.

#### return
**Syntax:** `return [Running(<string>) | Success(<string>) | Failure(<string>)];`

### Advanced Behavior Commands

#### name
**Syntax:** `name <string>`

Name the node. The new name will be displayed on the node in the Behavior Tree View in Mystic.

#### desc
**Syntax:** `desc <string>`

Define a description for the node. This will show when the node is hovered over in the Behavior Tree View in Mystic.

#### color
**Syntax:** `color <color-value>`

Set the color to display as a platform trace line in Mystic to indicate when the behavior is running.
