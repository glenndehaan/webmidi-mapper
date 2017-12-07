'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.midiMaps = exports.debugMidi = exports.onDrumPad = exports.onButtonPress = exports.onRotaryEncoderChange = exports.onFaderChange = exports.init = exports.WebMidi = undefined;

var _webmidi = require('webmidi');

var _webmidi2 = _interopRequireDefault(_webmidi);

var _maps = require('./maps/maps');

var _maps2 = _interopRequireDefault(_maps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var maxMidiValue = 127;
var midiDeviceReady = false;
var midiInputDevice = false;
var midiMap = false;

/**
 * Start the WebMidi library to bind events to the controller
 *
 * @param mapName
 * @param callback
 * @param inputDevice
 */
function init(mapName, callback) {
    var inputDevice = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _webmidi2.default.enable(function (err) {
        if (err) {
            console.warn("[WebMidi] Could not be enabled: ", err);
            midiDeviceReady = false;
            callback(midiDeviceReady);
        } else {
            console.log("[WebMidi] Enabled!");

            if (_webmidi2.default.inputs.length > 0) {
                console.log("[WebMidi] Available inputs: ", _webmidi2.default.inputs);
                midiInputDevice = _webmidi2.default.inputs[inputDevice];
                midiDeviceReady = true;

                console.log('[WebMidi] Connected: ' + midiInputDevice.manufacturer + ' ' + midiInputDevice.name);

                if (typeof _maps2.default[mapName] !== "undefined") {
                    midiMap = mapName;
                } else {
                    console.warn('[WebMidi] Map: ' + mapName + ' not found! Check if this map exists or create your own...');
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
function onFaderChange(faderNumber, callback) {
    var returnRawInput = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (midiDeviceReady) {
        if (midiMap) {
            if (typeof _maps2.default[midiMap].faders[faderNumber] !== "undefined") {
                midiInputDevice.addListener("controlchange", "all", function (e) {
                    if (_maps2.default[midiMap].faders[faderNumber] === e.controller.number) {
                        var result = returnRawInput ? e.value : e.value / maxMidiValue;
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
function onRotaryEncoderChange(rotaryEncoderNumber, callback) {
    var returnRawInput = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (midiDeviceReady) {
        if (midiMap) {
            if (typeof _maps2.default[midiMap].rotary_encoders[rotaryEncoderNumber] !== "undefined") {
                midiInputDevice.addListener("controlchange", "all", function (e) {
                    if (_maps2.default[midiMap].rotary_encoders[rotaryEncoderNumber] === e.controller.number) {
                        var result = returnRawInput ? e.value : e.value / maxMidiValue;
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
function onButtonPress(buttonName, callback) {
    var listenForOnAndOff = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (midiDeviceReady) {
        if (midiMap) {
            if (typeof _maps2.default[midiMap].buttons[buttonName] !== "undefined") {
                midiInputDevice.addListener("controlchange", "all", function (e) {
                    if (_maps2.default[midiMap].buttons[buttonName] === e.controller.number) {
                        if (!listenForOnAndOff) {
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
            if (typeof _maps2.default[midiMap].drum_pads[padNumber] !== "undefined") {
                midiInputDevice.addListener("noteon", "all", function (e) {
                    if (_maps2.default[midiMap].drum_pads[padNumber] === e.note.number) {
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
        midiInputDevice.addListener("controlchange", "all", function (e) {
            callback(e.controller.number, e.value, getKeyFromValue(_maps2.default[midiMap], e.controller.number, false));
        });

        midiInputDevice.addListener("noteon", "all", function (e) {
            callback(e.note.number, maxMidiValue, getKeyFromValue(_maps2.default[midiMap], e.note.number, true));
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
function getKeyFromValue(object, value) {
    var isDrumPad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var categoryKeys = Object.keys(object);

    if (!isDrumPad) {
        var drumIndex = categoryKeys.indexOf("drum_pads");
        if (drumIndex > -1) {
            categoryKeys.splice(drumIndex, 1);
        }

        for (var category = 0; category < categoryKeys.length; category++) {
            var buttonKey = Object.keys(object[categoryKeys[category]]);

            for (var button = 0; button < buttonKey.length; button++) {
                if (object[categoryKeys[category]][buttonKey[button]] === value) {
                    return { category: categoryKeys[category], key: buttonKey[button] };
                }
            }
        }
    } else {
        var _category = "drum_pads";
        var _buttonKey = Object.keys(object[_category]);

        for (var _button = 0; _button < _buttonKey.length; _button++) {
            if (object[_category][_buttonKey[_button]] === value) {
                return { category: _category, key: _buttonKey[_button] };
            }
        }
    }

    return { category: false, key: false };
}

/**
 * Returns all available Midi maps
 *
 * @return object
 */
function midiMaps() {
    return _maps2.default;
}

/**
 * Util for getting a key by value in an object
 *
 * @param value
 * @return {*}
 */
Object.prototype.getKey = function (value) {
    var object = this;
    return Object.keys(object).find(function (key) {
        return object[key] === value;
    });
};

exports.WebMidi = _webmidi2.default;
exports.init = init;
exports.onFaderChange = onFaderChange;
exports.onRotaryEncoderChange = onRotaryEncoderChange;
exports.onButtonPress = onButtonPress;
exports.onDrumPad = onDrumPad;
exports.debugMidi = debugMidi;
exports.midiMaps = midiMaps;