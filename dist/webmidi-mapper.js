'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.midiMaps = exports.debugMidi = exports.onButtonPress = exports.onRotaryEncoderChange = exports.onFaderChange = exports.init = exports.WebMidi = undefined;

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
 */
function init(mapName, callback) {
    _webmidi2.default.enable(function (err) {
        if (err) {
            console.warn("[WebMidi] Could not be enabled: ", err);
            midiDeviceReady = false;
            callback(midiDeviceReady);
        } else {
            console.log("[WebMidi] Enabled!");

            if (_webmidi2.default.inputs.length > 0) {
                midiInputDevice = _webmidi2.default.inputs[0];
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
 */
function onButtonPress(buttonName, callback) {
    if (midiDeviceReady) {
        if (midiMap) {
            if (typeof _maps2.default[midiMap].buttons[buttonName] !== "undefined") {
                midiInputDevice.addListener("controlchange", "all", function (e) {
                    if (_maps2.default[midiMap].buttons[buttonName] === e.controller.number) {
                        if (e.value === maxMidiValue) {
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
            var mapValue = false;

            console.log("MIDI Value: ", e.value);
            console.log("MIDI Note: ", e.controller.number);

            if (midiMap) {
                mapValue = _maps2.default[midiMap].getKey(e.controller.number);
                console.log('MIDI Map value: ', mapValue);
            }

            if (e.value === maxMidiValue) {
                callback(e.controller.number, e.value, mapValue);
            }
        });
    }
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
exports.debugMidi = debugMidi;
exports.midiMaps = midiMaps;