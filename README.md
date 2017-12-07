# Web Midi Mapper

## Functionalities
* Provides an extension to the original Web Midi package
* Maps devices to easy to remember functions

## Setup
Install the Midi Mapper package:
```
npm install webmidi-mapper
```
Import the Midi Mapper package somewhere in your code:
```
import {init as initWebmidi, onFaderChange, onButtonPress, onRotaryEncoderChange, onDrumPad, debugMidi, midiMaps} from 'webmidi-mapper';
```

## Usage
Start by initializing the Midi Mapper by running the init function (this needs to be executed first before running other functions)
```
initWebmidi("korg-nanokontrol2", (deviceReady) => {
    console.log(deviceReady);
});
```

If your device isn't number 0 in the array than please adjust this like so:
```
initWebmidi("korg-nanokontrol2", (deviceReady) => {
    console.log(deviceReady);
}, 1);
```

Now you can start by assigning faders, rotary encoders and buttons:

To assign a fader:
```
onFaderChange("1", (value) => {
    console.log(value);
});
```

To assign a rotary encoder:
```
onRotaryEncoderChange("1", (value) => {
    console.log(value);
});
```

To assign a button:
```
onButtonPress("play", () => {
    console.log("Midi play button pressed!");
});
```

To assign a drumpad:
```
onDrumPad("1", () => {
    console.log("Midi drumpad pressed!");
});
```

If you want the RAW midi value instead of the 0 to 1 value:
```
onFaderChange("1", (value) => {
    console.log(value);
}, true);

onRotaryEncoderChange("1", (value) => {
    console.log(value);
}, true);
```

If you want the button function to respond on both on and off value's:
```
onButtonPress("play", () => {
    console.log("Midi play button pressed!");
}, true);
```

## Create your own mapping
To create a new map start by copying an existing map from the maps folder.
Then import and export your map in the maps.js.

To see on what note a button is use our debug function:
```
debugMidi((note, value, mapKey) => {
    console.log('note', note);
    console.log('value', value);
    console.log('mapKey', mapKey);
});
```

Then press a button, turn a knob or turn up a fader and see the result.

## Maps
To see all the maps in the mapper:
```
console.log("Maps: ", midiMaps());
```

## Contribute
When your map is complete please create a pull request or open an issue with your map attached.
This so others can also start using that map.

## License

MIT
