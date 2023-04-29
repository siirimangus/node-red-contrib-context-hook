# node-red-contrib-context-hook

A [Node-RED](https://nodered.org/) extension for state management.

## Architectural idea

In order for a node to decide what will be the next output, it might need to take into account several inputs.
The logic, how the output is calculated, might be a combination of multiple conditional statements.
Instead of building complex flows with `switch` and other `function` nodes, the extension provides nodes
that will centralize the decision-making logic into one node, therefore managing this will become easier and
less error-prone.

The general idea for the solution comes from the [React `useState` hook](https://react.dev/reference/react/useState).
Let's imagine the automated devices setup is the frontend that is dependent on incoming signals. In order to render
the frontend correctly, we would need to keep track of the signals. Meaning we need to have a node for each signal
and connect them properly to achieve the desired output. The new solution allows to drop the connections and keep track
of each signal in only one node. Whenever there is a change in the signal, the frontend will update itself accordingly.


## Installation

Either use the Manage Palette option in the Node-RED editor menu or run the following command in your Node-RED user directory

```npm i node-red-contrib-context-hook```

## Usage

The extension provides three nodes.

<a href="https://drive.google.com/uc?export=view&id=1hErIA_NaP0U0tf1NDE2GZp5TeNyf7AAg">
    <img alt="nodes in extension" src="https://drive.google.com/uc?export=view&id=1hErIA_NaP0U0tf1NDE2GZp5TeNyf7AAg" height="150" >
</a>

In order to use the `subscribe-state` and the `state-hook` nodes, the `set-state` node must be used beforehand.
This is due to the nodes utilizing the Node.js event-driven architecture.

### 🔸 Node `set-state`

This node is used to save values to the global context. After the value is saved, an event is emitted to the system
that the other nodes `subscribe-state` and `state-hook` can listen to.

As an example, there is a simple flow to set kitchen temperature. The function in the `set-state` node extracts
the temperature value from the message payload and saves it to the global context with the property name `kitchen.temperature`.

<a href="https://drive.google.com/uc?export=view&id=1kiTcwM8m7Ets8sufPSw-71LDhtOIiig1">
    <img alt="set-state node flow" src="https://drive.google.com/uc?export=view&id=1kiTcwM8m7Ets8sufPSw-71LDhtOIiig1" width="300" >
</a>
<br/>
<a href="https://drive.google.com/uc?export=view&id=1W7FuzneEtijmuiVfi1aZ3X481BVTKcKw">
    <img alt="set-state node editing" src="https://drive.google.com/uc?export=view&id=1W7FuzneEtijmuiVfi1aZ3X481BVTKcKw" height="180" >
</a>

And then the value can be checked in the global context.

<a href="https://drive.google.com/uc?export=view&id=1g0WhCTZ8Modc4J2x-n_rvPVByHCDEz0i">
    <img alt="value in the global context" src="https://drive.google.com/uc?export=view&id=1g0WhCTZ8Modc4J2x-n_rvPVByHCDEz0i" height="90" >
</a>

### 🔸 Node `subscribe-state`

This is a node that is used for listening to changes in the global context that are saved by the `set-state` node.
If there has been a change in the context value, the node will forward the information about the change in the following form:

```
{
    property,
    previousValue,
    value,
    payload: value
}   
```

As an example, let's listen to the kitchen temperature changes that was set in the previous `set-state` node example.
First, add the `subscribe-state` node to the flow and configure it to listen to the property `kitchen.temperature`,
and then debug the message that is sent after kitchen temperature change is saved to the global context.

<a href="https://drive.google.com/uc?export=view&id=1LH6kQyKVEdEP2s9MncbE4r-vYSQmEduF">
    <img alt="subscribe-state node flow" src="https://drive.google.com/uc?export=view&id=1LH6kQyKVEdEP2s9MncbE4r-vYSQmEduF" height="100" >
</a>
<br />
<a href="https://drive.google.com/uc?export=view&id=1p0rhKUiYnNKGpmPBQItFWnmK9iPVYATv">
    <img alt="subscribe-state node editing" src="https://drive.google.com/uc?export=view&id=1p0rhKUiYnNKGpmPBQItFWnmK9iPVYATv" height="170" >
</a>
<br />
<a href="https://drive.google.com/uc?export=view&id=1tRGcw09WoRNpV5jPtDZQg834h9D4n4uV">
    <img alt="subscribe-state node output" src="https://drive.google.com/uc?export=view&id=1tRGcw09WoRNpV5jPtDZQg834h9D4n4uV" height="150" >
</a>

### 🔸 Node `state-hook`

This is the node where `useGlobal` function can be utilized to watch changes in the global context that were saved
via `set-state` node and based on the changes decide the output of the node. The `useGlobal` function takes two
parameters: property name from the global context and the default value for this. The second parameter is optional and
equals `null` by default. For example, to watch changes in the `kitchen.temperature` value, the `useGlobal` function
should be used like this:

```
const temperature = useGlobal('kitchen.temperature');
```

The `state-hook` node comes in handy when the logic for deciding the next state for an automated device depends on many
incoming signals. Instead of connecting the signals with `switch`, `function` etc. nodes, all the logic can be handled
with the function written in the `state-hook` node.

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
<a href="https://drive.google.com/uc?export=view&id=1xznB-Fc9YuIs6HUpCDCCVSEnUZwDw_Gt">
    <img alt="state-hook node in the flow" src="https://drive.google.com/uc?export=view&id=1xznB-Fc9YuIs6HUpCDCCVSEnUZwDw_Gt" height="300" >
</a>

Whenever there is a change in either `bathroom.illuminance` or `bathroom.occcupancy` value, the function for calculating
the lamp state is called again. In order the function to work properly, the logic for setting the illuminance in the
set-state node also has to be smart. Otherwise, it will happen that the lamp turns on because it's dark and
movement, and then because of the lamp light there is enough light in the room so the lamp will turn off. Then it is dark
again and the lamp will turn on etc. In order to take the illuminance correctly into account, setting the value
for this also needs to implement some more logic than just transferring the data to the global context.