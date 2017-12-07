import WebMidi from 'webmidi';
import maps from './maps/maps';

const maxMidiValue = 127;
let midiDeviceReady = false;
let midiInputDevice = false;
let midiMap = false;

/**
 * Start the WebMidi library to bind events to the controller
 *
 * @param mapName
 * @param callback
 * @param inputDevice
 */
function init(mapName, callback, inputDevice = 0) {
    WebMidi.enable((err) => {
        if (err) {
            console.warn("[WebMidi] Could not be enabled: ", err);
            midiDeviceReady = false;
            callback(midiDeviceReady);
        } else {
            console.log("[WebMidi] Enabled!");

            if (WebMidi.inputs.length > 0) {
                console.log("[WebMidi] Available inputs: ", WebMidi.inputs);
                midiInputDevice = WebMidi.inputs[inputDevice];
                midiDeviceReady = true;

                console.log(`[WebMidi] Connected: ${midiInputDevice.manufacturer} ${midiInputDevice.name}`);

                if (typeof maps[mapName] !== "undefined") {
                    midiMap = mapName;
                } else {
                    console.warn(`[WebMidi] Map: ${mapName} not found! Check if this map exists or create your own...`);
                }

                callback(midiDeviceReady);
            } else {
                console.warn("[WebMidi] No MIDI Devices available!");
                midiDeviceReady = false;
                callback(midiDeviceReady);
            }
        }
    });
}

/**
 * Bind event to a fader change of the MIDI device
 *
 * @param faderNumber
 * @param callback
 * @param returnRawInput
 */
function onFaderChange(faderNumber, callback, returnRawInput = false) {
    if (midiDeviceReady) {
        if (midiMap) {
            if (typeof maps[midiMap].faders[faderNumber] !== "undefined") {
                midiInputDevice.addListener("controlchange", "all", (e) => {
                    if (maps[midiMap].faders[faderNumber] === e.controller.number) {
                        const result = returnRawInput ? e.value : (e.value / maxMidiValue);
                        callback(result);
                    }
                });
            }
        }
    }
}

/**
 * Bind event to a rotary encoder change of the MIDI device
 *
 * @param rotaryEncoderNumber
 * @param callback
 * @param returnRawInput
 */
function onRotaryEncoderChange(rotaryEncoderNumber, callback, returnRawInput = false) {
    if (midiDeviceReady) {
        if (midiMap) {
            if (typeof maps[midiMap].rotary_encoders[rotaryEncoderNumber] !== "undefined") {
                midiInputDevice.addListener("controlchange", "all", (e) => {
                    if (maps[midiMap].rotary_encoders[rotaryEncoderNumber] === e.controller.number) {
                        const result = returnRawInput ? e.value : (e.value / maxMidiValue);
                        callback(result);
                    }
                });
            }
        }
    }
}

/**
 * Bind event to a button press of the MIDI device
 *
 * @param buttonName
 * @param callback
 * @param listenForOnAndOff
 */
function onButtonPress(buttonName, callback, listenForOnAndOff = false) {
    if (midiDeviceReady) {
        if (midiMap) {
            if (typeof maps[midiMap].buttons[buttonName] !== "undefined") {
                midiInputDevice.addListener("controlchange", "all", (e) => {
                    if (maps[midiMap].buttons[buttonName] === e.controller.number) {
                        if(!listenForOnAndOff) {
                            if (e.value === maxMidiValue) {
                                callback();
                            }
                        } else {
                            callback(e.value);
                        }
                    }
                });
            }
        }
    }
}

/**
 * Bind event to a drumpad of the MIDI device
 *
 * @param padNumber
 * @param callback
 */
function onDrumPad(padNumber, callback) {
    if (midiDeviceReady) {
        if (midiMap) {
            if (typeof maps[midiMap].drum_pads[padNumber] !== "undefined") {
                midiInputDevice.addListener("noteon", "all", (e) => {
                    if (maps[midiMap].drum_pads[padNumber] === e.note.number) {
                        if (e.type === "noteon") {
                            callback();
                        }
                    }
                });
            }
        }
    }
}

/**
 * Function to listen to all Midi events used to create a new Midi map
 *
 * @param callback
 */
function debugMidi(callback) {
    if (midiDeviceReady) {
        midiInputDevice.addListener("controlchange", "all", (e) => {
            callback(e.controller.number, e.value, getKeyFromValue(maps[midiMap], e.controller.number, false));
        });

        midiInputDevice.addListener("noteon", "all", (e) => {
            callback(e.note.number, maxMidiValue, getKeyFromValue(maps[midiMap], e.note.number, true));
        });
    }
}

/**
 * Function to get the original key if it is mapped
 *
 * @param object
 * @param value
 * @param isDrumPad
 * @return {*}
 */
function getKeyFromValue(object, value, isDrumPad = false) {
    const categoryKeys = Object.keys(object);

    if (!isDrumPad) {
        const drumIndex = categoryKeys.indexOf("drum_pads");
        if (drumIndex > -1) {
            categoryKeys.splice(drumIndex, 1);
        }

        for (let category = 0; category < categoryKeys.length; category++) {
            const buttonKey = Object.keys(object[categoryKeys[category]]);

            for (let button = 0; button < buttonKey.length; button++) {
                if (object[categoryKeys[category]][buttonKey[button]] === value) {
                    return {category: categoryKeys[category], key: buttonKey[button]};
                }
            }
        }
    } else {
        const category = "drum_pads";
        const buttonKey = Object.keys(object[category]);

        for (let button = 0; button < buttonKey.length; button++) {
            if (object[category][buttonKey[button]] === value) {
                return {category: category, key: buttonKey[button]};
            }
        }
    }

    return {category: false, key: false};
}

/**
 * Returns all available Midi maps
 *
 * @return object
 */
function midiMaps() {
    return maps;
}

/**
 * Util for getting a key by value in an object
 *
 * @param value
 * @return {*}
 */
Object.prototype.getKey = function (value) {
    const object = this;
    return Object.keys(object).find(key => object[key] === value);
};

export {WebMidi, init, onFaderChange, onRotaryEncoderChange, onButtonPress, onDrumPad, debugMidi, midiMaps};
