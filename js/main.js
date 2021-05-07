let currentMeasure = -1;
let currentBeat = -1;
let currentSong = null;
let songTiming = null;

//FLAGS
let isKeyMapShown = false;
let isKeyMapAreaShown = false;
let isMetronomePlayed = false;
let isPlayed = false;
let isWindowLoaded = false;
let bufferKeyMapFlag;

//SETTINGS
let MIN_BPM = 10;
let MAX_BPM = 200;
let TIMELINE_INTERVAL = "16n";
let INIT_BPM = 100;
let TIME_STEP = 64;

Tone.Transport.bpm.value = INIT_BPM;

//LOAD SOUNDS
const tick = new Tone.Player("./assets/tick.wav").toDestination();
const tock = new Tone.Player("./assets/tock.wav").toDestination();

//REPEATED FUNCTION FOR TIMELINE
Tone.Transport.scheduleRepeat((time) => {
    // use the callback time to schedule events

    //READ CURRENT TIME(MEASURE:BEAT:SIXTEENTH)
    let position = Tone.Transport.position;
    let musicTime = position.split(':');
    let measure = Math.round(musicTime[0]);
    let beat = Math.round(musicTime[1]);
    let sixteenth = Math.round(musicTime[2]);
    setTimeline(measure, beat, sixteenth);

    //MAKE TICK AND TOCK
    if (isMetronomePlayed) {
        if (currentMeasure != measure) {
            currentMeasure = measure;
            tick.start();
            console.log('tick');
        }
        else if (currentBeat != beat && beat != 0) {
            currentBeat = beat;
            tock.start();
            console.log('tock');
        }
    }
    let currentTime = measure * TIME_STEP + beat * TIME_STEP / 4 + sixteenth * TIME_STEP / 16;
    // Play song
    if (currentSong) {
        if (songTiming[currentTime]) {

            let notes = songTiming[currentTime];
            notes.forEach((note) => {
                playNote(note);
                animateNote(note);
            });
            console.log(`${currentTime} : ${notes}`);
        }

    }

}, TIMELINE_INTERVAL);

let metronome = function () {
    // transport must be started before it starts invoking events
    if (!isMetronomePlayed) {
        document.querySelector(".sidebar.metronome .toggle").innerText = "Off";
        isMetronomePlayed = true;
    }
    else {
        isMetronomePlayed = false;
        document.querySelector(".sidebar.metronome .toggle").innerText = "On";
    }

};

let togglePlayTimeline = function () {
    if (!isPlayed) {
        let playElement = document.querySelector(".fa-play")
        playElement.classList.remove("fa-play");
        playElement.classList.add("fa-pause");
        isPlayed = true;
        Tone.Transport.start();
    }
    else {
        let playElement = document.querySelector(".fa-pause")
        playElement.classList.remove("fa-pause");
        playElement.classList.add("fa-play");
        isPlayed = false;
        Tone.Transport.pause();
    }
}

let stopTimeline = function () {
    if (isPlayed) {
        let playElement = document.querySelector(".fa-pause")
        playElement.classList.remove("fa-pause");
        playElement.classList.add("fa-play");
        isPlayed = false;
    }
    Tone.Transport.stop();
    setTimeline(0, 0, 0);
};


document.querySelector("button.play").onclick = togglePlayTimeline;
document.querySelector("button.stop").onclick = stopTimeline;
document.querySelector(".sidebar.metronome .toggle").onclick = metronome;


let setBPM = function () {
    let BPM = parseInt(prompt("Enter BPM:", Tone.Transport.bpm.value));
    if (isNaN(BPM)) {
        console.error("Input NaN, will set to the original value");
    }
    else if (BPM < MIN_BPM) {
        console.error("BPM too low, will set to the lowest acceptable value");
        isInputCorrect = true;
        Tone.Transport.bpm.value = MIN_BPM;
    }
    else if (BPM > MAX_BPM) {
        console.error("BPM too high, will set to the highest acceptable value");
        isInputCorrect = true;
        Tone.Transport.bpm.value = MAX_BPM;
    }
    else {
        isInputCorrect = true;
        Tone.Transport.bpm.value = BPM;
    }
}

document.querySelector(".sidebar.metronome .bpm").onclick = setBPM;

function hideKeyMap() {
    let keyMapElements = document.querySelectorAll(".keyMap");
    keyMapElements.forEach(function (element, index) {
        element.style.display = "none";
    });
    isKeyMapShown = false;
};
function showKeyMap() {
    let keyMapElements = document.querySelectorAll(".keyMap");
    keyMapElements.forEach(function (element, index) {
        element.style.display = "block";
    });
    isKeyMapShown = true;
};

let toggleKeyMap = function () {
    if (isKeyMapShown) {
        hideKeyMap();
    }
    else {
        showKeyMap();
    }
}

function setKeyMap() {
    guling.forEach(function (gulingtangan, index) {
        let keyElement = document.createElement("p");
        keyElement.innerText = defaultKeyArray[index];
        keyElement.classList.add("keyMap");
        gulingtangan.appendChild(keyElement);
    });
    isKeyMapShown = !isKeyMapShown;
    toggleKeyMap();
}

document.querySelector(".sidebar.settings .showKeyMap").onclick = toggleKeyMap;

function setTimeline(measure, beat, sixteenth) {
    document.querySelector(".timeline-value").innerText = `${measure}:${beat}:${sixteenth}`;
}

//INITALIZE
setKeyMap();

//LOAD GULINGTANGAN SOUND
const gulingtangan = new Tone.Sampler({
    urls: urlsList,
    release: 1,
    baseUrl: PATH,
    onload: () => {
        if (isWindowLoaded) {
            hideLoader();
        }
        else {
            console.log("waiting for graphics assets to load...");
        }
    }
}).toDestination();

// IMPORT MIDI
let SONG_BASEURL = "./assets/songs/";

async function loadSong(songName) {
    let url = SONG_BASEURL + songName + ".mid";
    let midi = await Midi.fromUrl(url);
    return midi;
}

function getMidi(midi) {
    let bpm = midi.header.tempos[0].bpm;
    let timeStep = 60 / bpm / (TIME_STEP / 4);
    let nNotes = 0;
    let track = null;
    let timingObject = new Object();
    midi.tracks.forEach((currentTrack, index) => {
        let notes = currentTrack.notes;
        for (let i = 0; i < notes.length; i++) {
            let note = notes[i].name;
            let noteOctave = parseInt(note.slice(-1));
            let pitch = note.slice(0, -1);
            switch (pitch) {
                case "C#":
                    pitch = "Db";
                    break;
                case "D#":
                    pitch = "Eb";
                    break;
                case "F#":
                    pitch = "Gb";
                    break;
                case "G#":
                    pitch = "Ab";
                    break;
                case "A#":
                    pitch = "Bb";
                    break;
            }
            note = pitch + noteOctave;
            let time = Math.round(Number(notes[i].time) / timeStep);
            // convert time to sixteenth
            if (!timingObject[time]) {
                timingObject[time] = [note];
            }
            else {
                timingObject[time].push(note);
            }
        }
    });
    return timingObject;
}