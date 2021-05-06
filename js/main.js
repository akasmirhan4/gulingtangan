let currentMeasure = -1;
let currentBeat = -1;

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
let TIMELINE_INTERVAL = "32n";

//LOAD SOUNDS
const tick = new Tone.Player("./assets/tick.wav").toDestination();
const tock = new Tone.Player("./assets/tock.wav").toDestination();

//REPEATED FUNCTION FOR TIMELINE
Tone.Transport.scheduleRepeat((time) => {
    // use the callback time to schedule events

    //READ CURRENT TIME(MEASURE:BEAT:SIXTEENTH)
    let position = Tone.Transport.position;
    let musicTime = position.split(':');
    let measure = parseInt(musicTime[0]);
    let beat = parseInt(musicTime[1]);
    let sixteenth = parseInt(musicTime[2]);
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

function hideKeyMap(){
    let keyMapElements = document.querySelectorAll(".keyMap");
    keyMapElements.forEach(function (element, index) {
        element.style.display = "none";
    });
    isKeyMapShown = false;
};
function showKeyMap(){
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
        keyElement.innerText = keyArray[index];
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