# node-red-contrib-context-hook

A [Node-RED](https://nodered.org/) extension for state management.

## Architectural idea

In order for a node to decide what will be the next output, it might need to take into account several inputs.
The logic, how the output is calculated, might be a combination of multiple conditional statements.
Instead of building complex flows with `switch` and other `function` nodes, the extension provides nodes
that will centralize the decision-making logic into one node, therefore managing this will become easier and
less error-prone.

The approach is inspired by the [React `useState` hook](https://react.dev/reference/react/useState).
Whenever there is a change in the state that is used in the function (`state-hook`), the function will run again.
Compared to building Node-RED flows as usual, this approach allows better control over behaviours that have multiple inputs.

## Installation

Either use the Manage Palette option in the Node-RED menu or run the following command in your Node-RED user directory

```
npm i node-red-contrib-context-hook
```

## Usage

The extension provides three nodes under the category "state".

<a href="https://drive.google.com/uc?export=view&id=1hErIA_NaP0U0tf1NDE2GZp5TeNyf7AAg">
    <img alt="nodes in extension" src="https://drive.google.com/uc?export=view&id=1hErIA_NaP0U0tf1NDE2GZp5TeNyf7AAg" height="200" >
</a>

In order to use the `subscribe-state` and the `state-hook` nodes, the `set-state` node must be used beforehand.
The updates to the state (Node-RED global context) are only captured if the state is set by `set-state` node.

### 🔸 Node `set-state`

This node is used to set values to the global context. After the value is set, an event is emitted to the system
that the other nodes `subscribe-state` and `state-hook` can listen to.

As an example, there is a simple flow to set kitchen temperature. The function in the `set-state` node extracts
the temperature value from the message payload and sets it to the global context with the property name `kitchen.temperature`.
If the function returns `undefined`, the value is not updated and no event is emitted.

<a href="https://drive.google.com/uc?export=view&id=1kiTcwM8m7Ets8sufPSw-71LDhtOIiig1">
    <img alt="set-state node flow" src="https://drive.google.com/uc?export=view&id=1kiTcwM8m7Ets8sufPSw-71LDhtOIiig1" height="70" >
</a>
<br/>
<a href="https://drive.google.com/uc?export=view&id=1W7FuzneEtijmuiVfi1aZ3X481BVTKcKw">
    <img alt="set-state node editing" src="https://drive.google.com/uc?export=view&id=1W7FuzneEtijmuiVfi1aZ3X481BVTKcKw" height="270" >
</a>

And then the value can be seen in the global context.

<a href="https://drive.google.com/uc?export=view&id=1g0WhCTZ8Modc4J2x-n_rvPVByHCDEz0i">
    <img alt="value in the global context" src="https://drive.google.com/uc?export=view&id=1g0WhCTZ8Modc4J2x-n_rvPVByHCDEz0i" height="90" >
</a>

### 🔸 Node `subscribe-state`

This is a node that is used for listening to changes in the global context that are saved by the `set-state` node.
If there has been a change in the context value, the node will forward the information about the change in the following format:

```
{
    property,
    previousValue,
    value,
    payload: value
}   
```

As an example, let's listen to the kitchen temperature changes that were set in the previous `set-state` node example.
First, add the `subscribe-state` node to the flow and configure it to listen to the property `kitchen.temperature`,
and then debug the message that is sent after kitchen temperature change is saved to the global context.

<a href="https://drive.google.com/uc?export=view&id=1LH6kQyKVEdEP2s9MncbE4r-vYSQmEduF">
    <img alt="subscribe-state node flow" src="https://drive.google.com/uc?export=view&id=1LH6kQyKVEdEP2s9MncbE4r-vYSQmEduF" height="110" >
</a>
<br />
<br />
<a href="https://drive.google.com/uc?export=view&id=1p0rhKUiYnNKGpmPBQItFWnmK9iPVYATv">
    <img alt="subscribe-state node editing" src="https://drive.google.com/uc?export=view&id=1p0rhKUiYnNKGpmPBQItFWnmK9iPVYATv" height="200" >
</a>
<br />
<br />
<a href="https://drive.google.com/uc?export=view&id=1tRGcw09WoRNpV5jPtDZQg834h9D4n4uV">
    <img alt="subscribe-state node output" src="https://drive.google.com/uc?export=view&id=1tRGcw09WoRNpV5jPtDZQg834h9D4n4uV" height="170" >
</a>

### 🔸 Node `state-hook`. This is the node where the magic happens 🪄

Within the function in this node a hook called `useGlobal` is available.
This hook can be utilized to watch changes in the global context that were saved via `set-state` node.
The `useGlobal` function takes in two parameters: property name from the global context and the default value for it.
The second parameter is optional and is `null` by default. For example, to watch changes in the `kitchen.temperature` value,
the `useGlobal` function should be used like this:

```
const temperature = useGlobal('kitchen.temperature');
```

The `state-hook` node comes in handy when the logic for deciding the next state for an output depends on many
incoming signals. Instead of connecting the signals with `switch`, `function` etc. nodes, all the logic can be handled
within the `state-hook` node.

Let's take the following scenario and break it down into implementation steps: a light should turn on
when there is movement in the room, and it is dark in the room. In all the other cases the lamp should turn off.

1) Save the brightness and movement data to the global state via `set-state` nodes.

<a href="https://drive.google.com/uc?export=view&id=1hamfk2DbD-8rY-0ZT0CabG6ws8036HUV">
    <img alt="set-state nodes" src="https://drive.google.com/uc?export=view&id=1hamfk2DbD-8rY-0ZT0CabG6ws8036HUV" height="90" >
</a>

2) Use the `state-hook` node to listen to changes in the global context with the `useGlobal` function and
calculate the output for the light.

<a href="https://drive.google.com/uc?export=view&id=15q6QCquBEBDaiLIL_irFokGmDcne1IUh">
    <img alt="state-hook node in the flow" src="https://drive.google.com/uc?export=view&id=15q6QCquBEBDaiLIL_irFokGmDcne1IUh" height="60" >
</a>
<br />
<br />
<a href="https://drive.google.com/uc?export=view&id=1xznB-Fc9YuIs6HUpCDCCVSEnUZwDw_Gt">
    <img alt="state-hook node configuration" src="https://drive.google.com/uc?export=view&id=1xznB-Fc9YuIs6HUpCDCCVSEnUZwDw_Gt" height="350" >
</a>

Whenever there is a change in either `bathroom.illuminance` or `bathroom.occcupancy` value, the function for calculating
the lamp state is run again.

Most probably the illuminance might be affected by the light being turned on, therefore updating the state of the illuminance
should take that into account.

<a href="https://drive.google.com/uc?export=view&id=1IY_542N-YtTpziOEt0dQxnKqzeaKF0Kn">
    <img alt="state-hook node configuration" src="https://drive.google.com/uc?export=view&id=1IY_542N-YtTpziOEt0dQxnKqzeaKF0Kn" height="350" >
</a>