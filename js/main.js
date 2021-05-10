//FLAGS
let isKeyMapShown = true; //IS KEYBOARD KEYS SHOWN
let isKeyMapAreaShown = false; //IS THE AREA TO MODIFY THE KEYBOARD KEYS SHOWN
let isMetronomePlayed = false; //IS METRONOME GOING TO BE PLAYED
let isPlayed = false; //IS THE TIMELINE PLAYING
let isWindowLoaded = false; //IS WINDOW FINISHING LOADING
let isKeyMapShownPreviously; //BUFFER TO HOLD ISKEYMAPSHOWN
let isRecording = false; //IS IT RECORDING TIME
let isOctaveShown = true; //IS OCTAVE SETTINGS SHOWN
let isPrepareRecording = false; //IS THE RECORDING PREPARING

//CONSTANTS
let FILE_EXTENSION = '.wav'; //SOUND FILE TYPE
let NOTE_BASEURL = './assets/instruments/gulingtangan/'; //PATH TO NOTES FOLDER
let SONG_BASEURL = "./assets/songs/"; //PATH TO SONGS FOLDER
let MIN_BPM = 10; //ALLOWED MINIMUM BPM
let MAX_BPM = 200; //ALLOWED MAXIMUM BPM
let INIT_BPM = 100;
let STEP_FREQENCY = 64; //THE TIME STEP FREQUENCY IN RECORDING/PLAYBACK; e.g. if 64 => there will be 64 time steps in one beat 
let TIMELINE_INTERVAL = "16n"; //STEP INTERVAL TO RUN THE TIMELINE LOOP; e.g 16n represents the 16th of a whole note which is 1/16 of a beat
let SUSTAIN = 0;

/* -------------------- <INITIALIZE> -------------------- */

let selectedInstrument = "Gulingtangan"; //Default gulingtangan
let dOctave = 0; //CURRENT OCTAVE DIFFERENCE => USED IN (OCTAVE = 4 + dOCTAVE)
let keyAreaClicked = null; //HOLDS ACTIVE KEY AREA THAT WAS CLICKED; USED FOR MODIFYING KEY BINDING
let keyPressTS = null; //USE FOR RECORDING TO NOT OVERWRITE WHEN KEY IS PRESSED

// TUTORIAL SONGS
let currentSong = null; //NAME OF CURRENT SONG
let songNotes = new Object();  //KEY-VALUE PAIR (KEY: TIMING, VALUE: NOTES TO PLAY)

//RECORDING
let recordingNotes = new Object();  //KEY-VALUE PAIR (KEY: TIMING, VALUE: NOTES TO PLAY)

//CURRENT TIME
let currentMeasure = -1;
let currentBeat = -1;

//SET BPM
Tone.Transport.bpm.value = INIT_BPM;

//SET OCTAVE SHOWN OR HIDDEN
if (isOctaveShown) {
    showOctave();
}
else {
    hideOctave();
}

//SET KEY MAP SHOWN OR HIDDEN
if (isKeyMapShown) {
    showKeyMap();
}
else {
    hideKeyMap();
}

//NOTE ELEMENTS
let gulingtanganElements = document.querySelectorAll(".pots:not(.empty)");

//DEFAULT KEY BIND
let defaultKeyArray = [
    "s", "d", "g", "h", "j", "z", "x", "c", "v", "b", "n", "m", ","
];

/*
THE ORDER OF THE defaultKeyArray IS ALREADY SET TO THE ORDER OF THE NOTES 
e.g:
index 0,1 represent Db4 & Eb4; (2 BLACK KEYS)
index 2,3,4 represents Gb4,Ab4,Bb4; (3 BLACK KEYS)
index 5-12 represents C4,D4,E4...C5; (WHITE KEYS)
*/

//INITIALISE THE AREA ELEMENTS FOR EDITING KEYBOARD BINDING
setKeyMapArea();
function setKeyMapArea() {
    gulingtanganElements.forEach(function (element, index) {
        let keyAreaElement = document.createElement("div");
        keyAreaElement.classList.add("keyMapArea");
        keyAreaElement.style.display = "none";
        element.appendChild(keyAreaElement);
    });
}

//INITIALISE THE ELEMENTS FOR DISPLAYING KEYBOARD KEYS
setKeyMap();
function setKeyMap() {
    gulingtanganElements.forEach(function (gulingtangan, index) {
        let keyElement = document.createElement("p");
        keyElement.classList.add("keyMap");
        //SET THE ELEMENT VALUE TO THE KEY SET 

        /*
        THE ORDER OF THE defaultKeyArray IS ALREADY SET TO THE ORDER OF THE NOTES 
        e.g:
        index 0,1 represent Db4 & Eb4; (2 BLACK KEYS)
        index 2,3,4 represents Gb4,Ab4,Bb4; (3 BLACK KEYS)
        index 5-12 represents C4,D4,E4...C5; (WHITE KEYS)
        */

        keyElement.innerText = defaultKeyArray[index];
        gulingtangan.appendChild(keyElement);
    });
}

let urlsList = new Object; //KEY-VALUE => [NOTE: FILENAME]
let keyNoteMap = new Object; //KEY-VALUE => [KEYBOARD KEY: NOTE]

//SET urlsList & keyNoteMap
gulingtanganElements.forEach(function (gulingtangan, index) {
    //THE ID OF EACH GULINGTANGAN ELEMENT REPRESENT THE NOTE
    let note = gulingtangan.id;

    // keyNoteMap FOR MAPPING KEYBOARD KEYS TO ITS NOTE, second index indicate isKeyPressed (restrict user from holding the key button)
    keyNoteMap[defaultKeyArray[index]] = [note, false];
    if (note == "Db4") {
        // Note is out of tune
    }
    else {
        // urlsList FOR MAPPING NOTE TO ITS URL
        urlsList[note] = note + FILE_EXTENSION;
    }
    //MOUSE CLICK EVENT LISTENER
});

//LOAD SOUNDS
//REFER TO TONE.JS DOCUMENTATION
const tick = new Tone.Player("./assets/tick.wav").toDestination();
const tock = new Tone.Player("./assets/tock.wav").toDestination();

//LOAD INSTRUMENTS SOUND
const gulingtangan = new Tone.Sampler({
    urls: urlsList, //KEY-VALUE PAIR => {NOTE: FILE NAME}
    release: 1,
    baseUrl: NOTE_BASEURL, //PATHWAY TO FILE
    onload: () => {
        //ONCE ALL SOUND LOADED, CHECK IF WINDOW ALREADY LOADED AS WELL
        if (isWindowLoaded) {
            hideLoader();
        }
        else {
            console.log("waiting for graphics assets to load...");
        }
    }
}).toDestination();

let instrument = gulingtangan;

/* -------------------- </INITIALIZE> -------------------- */


/* -------------------- <PRIMARY FUNCTION> -------------------- */
//ADD ANIMATION TO NOTES
function animateNote(note) {
    let id = note;
    document.querySelectorAll(".darken").forEach((el) => el.classList.remove("darken"));
    if (document.getElementById(id)) {
        document.getElementById(id).classList.remove("shake");
        document.getElementById(id).classList.remove("darken");
        window.requestAnimationFrame(function () {
            document.getElementById(id).classList.add("shake");
            document.getElementById(id).classList.add("darken");
        });
    }
}

//PLAY INSTRUMENT NOTE
function playNote(note) {

    //EDIT THE NOTE OCTAVE TO BE PLAYED BASED ON THE CURRENT OCTAVE
    let currentOctave = parseInt(note.slice(-1)) + dOctave;
    note = note.slice(0, -1) + currentOctave;
    //CALL THE NOTE SOUND
    if (instrument) {
        instrument.triggerAttackRelease(note, SUSTAIN);
    }
}

function recordNote(note) {
    //READ CURRENT TIME AS {MEASURE:BEAT:SIXTEENTH}
    let position = Tone.Transport.position;
    let musicTime = position.split(':');
    let measure = Math.round(musicTime[0]);
    let beat = Math.round(musicTime[1]);
    let sixteenth = Math.round(musicTime[2]);

    // GET CURRENT TIMESTEP COUNTER; STEP_FREQUENCY IS THE PRECISION OF THE TIMESTEP
    let currentTS = measure * STEP_FREQENCY * 4 + beat * STEP_FREQENCY + sixteenth * STEP_FREQENCY / 4;

    //CREATE A NEW ARRAY OF NOTE IF NOTE DOES NOT EXIST IN THE TS
    if (!recordingNotes[currentTS]) {
        recordingNotes[currentTS] = [note];
    }

    //ELSE PUSH A NEW NOTE
    else {
        recordingNotes[currentTS].push(note);
    }
    keyPressTS = currentTS;
    // LOGGING FOR DEBUGGING
    console.log(`${currentTS} : ${recordingNotes[currentTS]}`);
}

//MAIN TIMELINE FUNCTION (CONTROLLED BY THE PLAYBACK BUTTONS)
Tone.Transport.scheduleRepeat((time) => {

    //READ CURRENT TIME AS {MEASURE:BEAT:SIXTEENTH}
    let position = Tone.Transport.position;
    let musicTime = position.split(':');
    let measure = Math.round(musicTime[0]);
    let beat = Math.round(musicTime[1]);
    let sixteenth = Math.round(musicTime[2]);

    //WRITE TIMELINE ONTO THE TIMELINE ELEMENT
    setTimeline(measure, beat, sixteenth);

    //IF METRONOME IS ON, PLAY TICK AND TOCK IN EVERY BEAT
    if (isMetronomePlayed) {

        // PLAY TICK EVERY NEW MEASURE (4 BEATS)
        if (currentMeasure != measure) {
            currentMeasure = measure;
            tick.start();
            console.log('tick');
        }
        // ELSE PLAY TOCK ON EVERY BEAT
        else if (currentBeat != beat && beat != 0) {
            currentBeat = beat;
            tock.start();
            console.log('tock');
        }
    }

    // GET CURRENT TIMESTEP COUNTER; STEP_FREQUENCY IS THE PRECISION OF THE TIMESTEP
    let currentTS = measure * STEP_FREQENCY * 4 + beat * STEP_FREQENCY + sixteenth * STEP_FREQENCY / 4;

    // PLAY SELECTED SONG
    if (currentSong && !isRecording) {
        //  PLAY NOTE/NOTES OF THE SONG IF AVAILABLE AT CURRENT TIMESTEPS
        if (songNotes[currentTS]) {
            let notes = songNotes[currentTS];
            notes.forEach((note) => {
                playNote(note);
                animateNote(note);
            });

            // LOGGING FOR DEBUGGING
            console.log(`${currentTS} : ${notes}`);
        }
    }
    //SET recodingNotes EMPTY AS TIME PASSED WHILE RECORDING
    if (isRecording && recordingNotes[currentTS] && (currentTS - keyPressTS >= 4)) {
        recordingNotes[currentTS] = null;
    }
    else if (!isRecording && recordingNotes[currentTS]) {
        let notes = recordingNotes[currentTS];
        notes.forEach((note) => {
            playNote(note);
            animateNote(note);
        });
    }
}, TIMELINE_INTERVAL);

function startRecording() {
    if (isRecording) {
        isRecording = false;
        recordingOff();
    }
    else {
        // PLAY TICK TOCKx3 TO PREPARE USER FOR RECORDING
        recordingOn();
        isPrepareRecording = true;
        let currentBeat = -3;
        let tickTock = setInterval(() => {
            let measure = -1;
            let beat = currentBeat;
            let sixteenth = 0;
            setTimeline(measure, beat, sixteenth);
            if (currentBeat != -3) {
                tock.start();
            }
            else {
                tick.start();
            }
            currentBeat++;

            // AT THE END OF THE 4 BEAT, START RECORDING
            if (currentBeat == 1) {
                clearInterval(tickTock);

                //FLAG
                isRecording = true;
                isPrepareRecording = false;

                let position = Tone.Transport.position;
                let musicTime = position.split(':');
                let measure = parseInt(musicTime[0]);
                let beat = parseInt(musicTime[1]);
                let sixteenth = parseInt(musicTime[2]);

                //START THE CLOCK FROM THE CURRENT TIME
                playTimeline();
                setTimeline(measure, beat, sixteenth);
            }
        }, 60 / Tone.Transport.bpm.value * 1000);
    }
}
function playRecording() {
    //START THE CLOCK FROM 0 to END
    //EACH INTERVAL WITHIN THE ARRAY PLAY BACK AS NOTES
    //AT END OF RECORDING STOP AND START BACK TO BEGINNGING BUT PAUSED
    let seq = new Tone.Sequence(function (time, note) {
        console.log(note);
    }, sessionArray)
    seq();
}

// TOGGLE BETWEEN TIMEPLAY PLAYING OR PAUSING
function playTimeline() {
    let playElement = document.querySelector(".fa-play")
    playElement.classList.remove("fa-play");
    playElement.classList.add("fa-pause");
    isPlayed = true;
    Tone.Transport.start();
}

function pauseTimeline() {
    let playElement = document.querySelector(".fa-pause")
    playElement.classList.remove("fa-pause");
    playElement.classList.add("fa-play");
    isPlayed = false;
    Tone.Transport.pause();
}
function togglePlayTimeline() {
    if (!isPlayed) {
        playTimeline();
    }
    else {
        pauseTimeline();
    }
}

// STOP OR RESET TIMELINE TO THE BEGINNING
function stopTimeline() {
    currentSong = null;
    if (isPlayed) {
        let playElement = document.querySelector(".fa-pause")
        playElement.classList.remove("fa-pause");
        playElement.classList.add("fa-play");
        isPlayed = false;
    }
    Tone.Transport.stop();

    //RESET THE TIMELINE ELEMENT VALUE
    setTimeline(0, 0, 0);

    //Update flag
    isRecording = false;
    keyPressTS = null;
};

//SET TIMELINE ELEMENT VALUE
function setTimeline(measure, beat, sixteenth) {
    document.querySelector(".timeline-value").innerText = `${measure}:${beat}:${sixteenth}`;
}

/* -------------------- </PRIMARY FUNCTION> -------------------- */

/* -------------------- <SECONDARY FUNCTION> -------------------- */

function selectInstrument() {
    if (selectedInstrument == "gulingtangan") {
        instrument = gulingtangan;
    }
    else {
        showLoader();
        instrument = new Tone.Sampler({
            urls: {
                "C4": "C4.mp3",
            },
            release: 1,
            baseUrl: `https://nbrosowsky.github.io/tonejs-instruments/samples/${selectedInstrument}/`,
            onload: () => {
                //ONCE ALL SOUND LOADED, CHECK IF WINDOW ALREADY LOADED AS WELL
                if (isWindowLoaded) {
                    hideLoader();
                }
                else {
                    console.log("waiting for graphics assets to load...");
                }
            }
        }).toDestination();
    }
}

// METRONOME STUFF
function toggleMetronome() {
    if (!isMetronomePlayed) {
        document.querySelector(".sidebar.metronome .toggle").innerText = "Off";
        isMetronomePlayed = true;
    }
    else {
        isMetronomePlayed = false;
        document.querySelector(".sidebar.metronome .toggle").innerText = "On";
    }
};

// OCTAVE STUFF
function hideOctave() {
    let element = document.querySelector(".octave");
    element.style.display = "none";
    isOctaveShown = false;
    dOctave = 0;
};

function showOctave() {
    let element = document.querySelector(".octave");
    element.style.display = "flex";
    isOctaveShown = true;
};


function toggleOctave() {
    let element = document.querySelector(".octave");
    if (isOctaveShown) {
        hideOctave();
    }
    else {
        showOctave();
    }
};

//SET BPM OF THE TIMELINE
function setBPM() {
    //AWAIT USER INPUT OF BPM VALUE
    let BPM = parseInt(prompt("Enter BPM:", Tone.Transport.bpm.value));

    //VALIDATING AND VERIFYING INPUT
    if (isNaN(BPM)) {
        console.error("Input NaN, will set to the original value");
    }

    else if (BPM < MIN_BPM) {
        console.error("BPM too low, will set to the lowest acceptable value");
        Tone.Transport.bpm.value = MIN_BPM;
    }

    else if (BPM > MAX_BPM) {
        console.error("BPM too high, will set to the highest acceptable value");
        Tone.Transport.bpm.value = MAX_BPM;
    }
    else {
        Tone.Transport.bpm.value = BPM;
    }
}

//KEYBOARD KEYS DISPLAY STUFF
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

function toggleKeyMap() {
    if (isKeyMapShown) {
        hideKeyMap();
    }
    else {
        showKeyMap();
    }
}

//RESET KEYBOARD KEYS BINDING BACK TO DEFAULT
function resetKeyBind() {
    gulingtanganElements.forEach(function (gulingtangan, index) {
        let note = gulingtangan.id;
        setKey(note, defaultKeyArray[index]);
    });
};

//SET NOTE TO A NEW KEY BIND
function setKey(note, key) {
    //STORE OLD KEY BIND
    let oldKeyMap = document.querySelector(`#${note} .keyMap`).innerText;
    let newKeyMap = key;

    //SEE IF THE NEW KEY BIND HAD EXISTING NOTE
    let bindingNote = keyNoteMap[newKeyMap];

    //IF EXIST THEN GIVE WARNING ABOUT CLASHING KEYS
    if (bindingNote) {
        console.error(`key bind clashed. Please enter a new key bind on the clashed note:\n${bindingNote[0]}`);
        let clashedKey = document.querySelector(`#${bindingNote[0]} .keyMap`);
        clashedKey.innerText = "";
    }

    //ASSIGN THE PREVIOUS KEYBOARD BIND TO NOTHING
    keyNoteMap[oldKeyMap] = null;

    //ASSIGN THE NEW KEYBOARD BIND TO THE NOTE
    keyNoteMap[newKeyMap] = [note, false];

    //DISPLAY NEW KEYBOARD BIND ON BROWSER
    document.querySelector(`#${note} .keyMap`).innerText = newKeyMap;
};

// KEY BINDING AREA STUFF
function showKeyMapArea() {
    //UPDATE FLAGS
    isKeyMapShownPreviously = isKeyMapShown;
    isKeyMapAreaShown = true;

    document.querySelector(".reset").style.display = "block";

    //SHOW KEYBOARD KEY AS WELL
    showKeyMap();

    //SHOW ALL AREA
    let keyAreaElements = document.querySelectorAll(".keyMapArea");
    keyAreaElements.forEach((element, index) => {
        element.style.display = "block";
    });
}

function hideKeyMapArea() {
    let keyAreaElements = document.querySelectorAll(".keyMapArea");
    document.querySelector(".reset").style.display = "none";

    keyAreaElements.forEach((element, index) => {
        element.style.display = "none";
    });
    if (!isKeyMapShownPreviously) {
        hideKeyMap();
    }

    //UPDATE FLAGS  
    isKeyMapAreaShown = false;
    isKeyMapShown = isKeyMapShownPreviously;
}

function toggleKeyMapArea() {
    let keyAreaElements = document.querySelectorAll(".keyMapArea");
    keyAreaElements.forEach((element, index) => {
        if (isKeyMapAreaShown) {
            hideKeyMapArea();
        }
        else {
            showKeyMapArea();
        }
    });
}

function recordingOn() {
    document.querySelector("button.record").classList.add("active");
}
function recordingOff() {
    document.querySelector("button.record").classList.remove("active");
}

/* -------------------- </SECONDARY FUNCTION> -------------------- */

/* -------------------- <LOAD SONG FUNCTION> -------------------- */

//ASYNC FUNCTION TO SIMULATANEOUSLY LOAD SONG
async function loadSong(songName) {

    //FULL PATH
    let url = SONG_BASEURL + songName + ".mid";

    //AWAIT FOR FULLY LOADED MIDI FILE OBJECT
    //THE MIDI OBJECT IS CREATED BY tonejs.github.io/midi/
    let midi = await Midi.fromUrl(url);

    /*  
    RETURN PROMISE OBJECT, WHEN FULLY LOADED, IT WILL TRIGGER .then()
    the method is called @EventListener.js => songElement onclick function
    */

    return midi;
}

//CONVERT THE MIDI OBJECT TO KEY-VALUE PAIR (KEY: TIMING, VALUE: NOTES TO PLAY)
//THE MIDI OBJECT IS CREATED BY tonejs.github.io/midi/
function getMidi(midi) {

    //GET CURRENT BPM
    let bpm = midi.header.tempos[0].bpm;

    //GET TIMESTEP (IN SECOND) => TO BE USED FOR CONVERTING THE TIME INTO STEPS INSTEAD, e.g. if 1 STEP = 0.2 second; then 5 STEP = 1 second
    let TS = 60 / bpm / STEP_FREQENCY;

    //timingObject: KEY-VALUE PAIR (KEY: TIMING, VALUE: NOTES TO PLAY)
    let timingObject = new Object();

    //LOOP THROUGH EACH TRACKS/INSTRUMENTS IN THE MIDI FILE
    midi.tracks.forEach((currentTrack, index) => {

        //GET ALL THE NOTES ON THE TRACK
        let notes = currentTrack.notes;

        //LOOP THROUGH EACH NOTE
        for (let i = 0; i < notes.length; i++) {

            //GET NOTE NAME e.g C4
            let note = notes[i].name;

            //GET NOTE OCTAVE e.g 4
            let noteOctave = parseInt(note.slice(-1));

            //GET NOTE PITCH e.g C
            let pitch = note.slice(0, -1);

            //SWITCH ALL SHARP NOTES TO ITS EQUIVALENT NOTES
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

            //PUT BACK TOGETHER THE NOTE NAME
            note = pitch + noteOctave;

            //GET TIMING OF THE NOTE (IN SECOND)
            let noteTimingS = Number(notes[i].time);

            //CONVERT THE TIMING INTO TIME STEP (TS) EQUIVALENTS
            //e.g. if 1 TS = 0.2 second; then 5 TS = 1 second
            let noteTimingTS = Math.round(noteTimingS / TS);

            //CREATE A NEW ARRAY OF NOTE IF NOTE DOES NOT EXIST IN THE TS
            if (!timingObject[noteTimingTS]) {
                timingObject[noteTimingTS] = [note];
            }

            //ELSE PUSH A NEW NOTE
            else {
                timingObject[noteTimingTS].push(note);
            }
        }
    });
    return timingObject;
}
/* -------------------- </LOAD SONG FUNCTION> -------------------- */