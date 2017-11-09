import {init as initWebmidi, onFaderChange, onButtonPress, onRotaryEncoderChange, debugMidi} from '../../../src/webmidi-mapper';

/**
 * Init app
 */
function init() {
    const audio1 = document.querySelector("#audio1");
    const audio2 = document.querySelector("#audio2");
    const audio3 = document.querySelector("#audio3");
    const audio4 = document.querySelector("#audio4");

    audio1.volume = 0;
    audio2.volume = 0;
    audio3.volume = 0;
    audio4.volume = 0;

    let muted1 = false;
    let muted2 = false;
    let muted3 = false;
    let muted4 = false;

    initWebmidi("korg-nanokontrol2", () => {
        // debugMidi((note, value, mapKey) => {
        //     console.log('note', note);
        //     console.log('value', value);
        //     console.log('mapKey', mapKey);
        // });

        /**
         * Audio 1
         */
        onFaderChange("1", (value) => {
            audio1.volume = value;
        });
        onRotaryEncoderChange("1", (value) => {
            audio1.playbackRate = (value * 2);
        });
        onButtonPress("play", () => {
            audio1.currentTime = 0;
            audio1.play();
        });
        onButtonPress("stop", () => {
            audio1.pause();
            audio1.currentTime = 0;
        });
        onButtonPress("fader_1_mute", () => {
            if (muted1) {
                muted1 = false;
                audio1.muted = false;
            } else {
                muted1 = true;
                audio1.muted = true;
            }
        });

        /**
         * Audio 2
         */
        onFaderChange("2", (value) => {
            audio2.volume = value;
        });
        onRotaryEncoderChange("2", (value) => {
            audio2.playbackRate = (value * 2);
        });
        onButtonPress("play", () => {
            audio2.currentTime = 0;
            audio2.play();
        });
        onButtonPress("stop", () => {
            audio2.pause();
            audio2.currentTime = 0;
        });
        onButtonPress("fader_2_mute", () => {
            if (muted2) {
                muted2 = false;
                audio2.muted = false;
            } else {
                muted2 = true;
                audio2.muted = true;
            }
        });

        /**
         * Audio 3
         */
        onFaderChange("3", (value) => {
            audio3.volume = value;
        });
        onRotaryEncoderChange("3", (value) => {
            audio3.playbackRate = (value * 2);
        });
        onButtonPress("play", () => {
            audio3.currentTime = 0;
            audio3.play();
        });
        onButtonPress("stop", () => {
            audio3.pause();
            audio3.currentTime = 0;
        });
        onButtonPress("fader_3_mute", () => {
            if (muted3) {
                muted3 = false;
                audio3.muted = false;
            } else {
                muted3 = true;
                audio3.muted = true;
            }
        });

        /**
         * Audio 4
         */
        onFaderChange("4", (value) => {
            audio4.volume = value;
        });
        onRotaryEncoderChange("4", (value) => {
            audio4.playbackRate = (value * 2);
        });
        onButtonPress("play", () => {
            audio4.currentTime = 0;
            audio4.play();
        });
        onButtonPress("stop", () => {
            audio4.pause();
            audio4.currentTime = 0;
        });
        onButtonPress("fader_4_mute", () => {
            if (muted4) {
                muted4 = false;
                audio4.muted = false;
            } else {
                muted4 = true;
                audio4.muted = true;
            }
        });
    });
}

window.addEventListener('load', init);
