import pizzicato from 'Pizzicato';
import {init as initWebmidi, onFaderChange, onButtonPress, onRotaryEncoderChange, onDrumPad, debugMidi, midiMaps} from '../../../src/webmidi-mapper';

/**
 * Init app
 */
function init() {
    // const midiMap = "korg-nanokontrol2";
    const midiMap = "maschine-mk2";

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

    const activeButtons = {
        swing: false,
        volume: false,
        tempo: false
    };

    const preloadAudioFiles = [
        "https://prototype.devone.nl/test/webmidi-mapper/audio/samples/snare-vinyl01.wav",
        "https://prototype.devone.nl/test/webmidi-mapper/audio/samples/snare-vinyl02.wav",
        "https://prototype.devone.nl/test/webmidi-mapper/audio/samples/kick-tron.wav",
        "https://prototype.devone.nl/test/webmidi-mapper/audio/samples/kick-tight.wav",
        "https://prototype.devone.nl/test/webmidi-mapper/audio/samples/perc-tribal.wav",
        "https://prototype.devone.nl/test/webmidi-mapper/audio/samples/perc-tambo.wav",
        "https://prototype.devone.nl/test/webmidi-mapper/audio/samples/cowbell-808.wav",
        "https://prototype.devone.nl/test/webmidi-mapper/audio/samples/clap-tape.wav"
    ];

    for(let item = 0; item < preloadAudioFiles.length; item++) {
        const oReq = new XMLHttpRequest();

        oReq.open("GET", preloadAudioFiles[item], true);
        oReq.responseType = "arraybuffer";
        oReq.send();
    }

    initWebmidi(midiMap, () => {
        debugMidi((note, value, mapKey) => {
            console.log('note', note);
            console.log('value', value);
            console.log('mapKey', mapKey);
        });

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
        if(midiMap === "maschine-mk2"){
            onRotaryEncoderChange("5", (value) => {
                audio1.volume = value;
            });
        }

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
        if(midiMap === "maschine-mk2"){
            onRotaryEncoderChange("6", (value) => {
                audio2.volume = value;
            });
        }

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
        if(midiMap === "maschine-mk2"){
            onRotaryEncoderChange("7", (value) => {
                audio3.volume = value;
            });
        }

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
        if(midiMap === "maschine-mk2"){
            onRotaryEncoderChange("8", (value) => {
                audio4.volume = value;
            });
        }

        /**
         * Drumpads
         */
        onDrumPad("1", () => {
            const drumSound = document.createElement('audio');
            drumSound.src = 'https://prototype.devone.nl/test/webmidi-mapper/audio/samples/snare-vinyl01.wav';
            drumSound.type = 'audio/wav';
            drumSound.play();
        });
        onDrumPad("2", () => {
            const drumSound = document.createElement('audio');
            drumSound.src = 'https://prototype.devone.nl/test/webmidi-mapper/audio/samples/snare-vinyl02.wav';
            drumSound.type = 'audio/wav';
            drumSound.play();
        });

        onDrumPad("5", () => {
            const drumSound = document.createElement('audio');
            drumSound.src = 'https://prototype.devone.nl/test/webmidi-mapper/audio/samples/kick-tron.wav';
            drumSound.type = 'audio/wav';
            drumSound.play();
        });
        onDrumPad("6", () => {
            const drumSound = document.createElement('audio');
            drumSound.src = 'https://prototype.devone.nl/test/webmidi-mapper/audio/samples/kick-tight.wav';
            drumSound.type = 'audio/wav';
            drumSound.play();
        });

        onDrumPad("9", () => {
            const drumSound = document.createElement('audio');
            drumSound.src = 'https://prototype.devone.nl/test/webmidi-mapper/audio/samples/perc-tribal.wav';
            drumSound.type = 'audio/wav';
            drumSound.play();
        });
        onDrumPad("10", () => {
            const drumSound = document.createElement('audio');
            drumSound.src = 'https://prototype.devone.nl/test/webmidi-mapper/audio/samples/perc-tambo.wav';
            drumSound.type = 'audio/wav';
            drumSound.play();
        });

        onDrumPad("13", () => {
            const drumSound = document.createElement('audio');
            drumSound.src = 'https://prototype.devone.nl/test/webmidi-mapper/audio/samples/cowbell-808.wav';
            drumSound.type = 'audio/wav';
            drumSound.play();
        });
        onDrumPad("14", () => {
            const drumSound = document.createElement('audio');
            drumSound.src = 'https://prototype.devone.nl/test/webmidi-mapper/audio/samples/clap-tape.wav';
            drumSound.type = 'audio/wav';
            drumSound.play();
        });

        /**
         * Pizzicato
         */
        const pizzicatoSound = new pizzicato.Sound('https://prototype.devone.nl/test/webmidi-mapper/audio/muchacho.mp3', () => {
            const lowPassFilter = new pizzicato.Effects.LowPassFilter({
                frequency: 22050,
                peak: 10
            });

            onRotaryEncoderChange("0", (value) => {
                if(activeButtons.swing) {
                    lowPassFilter.frequency = (value * 22050);
                }

                if(activeButtons.volume) {
                    pizzicatoSound.volume = value;
                }

                if(activeButtons.tempo) {
                    pizzicatoSound.sourceNode.playbackRate.value = (value * 2);
                }
            });

            onButtonPress("swing", (value) => {
                if(value === 127) {
                    activeButtons.swing = true;
                } else {
                    activeButtons.swing = false;
                }
            }, true);

            onButtonPress("volume", (value) => {
                if(value === 127) {
                    activeButtons.volume = true;
                } else {
                    activeButtons.volume = false;
                }
            }, true);

            onButtonPress("tempo", (value) => {
                if(value === 127) {
                    activeButtons.tempo = true;
                } else {
                    activeButtons.tempo = false;
                }
            }, true);

            pizzicatoSound.addEffect(lowPassFilter);
            pizzicatoSound.play();
        });

        console.log("Maps: ", midiMaps());
    }, midiMap === "maschine-mk2" ? 1 : 0);
}

window.addEventListener('load', init);
