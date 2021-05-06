let currentMeasure = -1;
let currentBeat = -1;

//FLAGS
let isKeyMapShown = false;
let isMetronomePlayed = false;

//SETTINGS
let MIN_BPM = 10;
let MAX_BPM = 200;

//LOAD SOUNDS
const tick = new Tone.Player("./assets/tick.wav").toDestination();
const tock = new Tone.Player("./assets/tock.wav").toDestination();


//LOAD GULINGTANGAN SOUND
const gulingtangan = new Tone.Sampler({
    urls: urlsList,
    release: 1,
    baseUrl: PATH,
}).toDestination();

//REPEATED FUNCTION
Tone.Transport.scheduleRepeat((time) => {
    // use the callback time to schedule events
    let position = Tone.Transport.position;
    let musicTime = position.split(':');
    let measure = parseInt(musicTime[0]);
    let beat = parseInt(musicTime[1]);
    let sixteenth = parseInt(musicTime[2]);
    setTimeline(measure, beat, sixteenth);

    //MAKE TICK AND TOCK
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
}, "32n");

let metronome = function () {
    // transport must be started before it starts invoking events
    if (!isMetronomePlayed) {
        Tone.Transport.start();
        isMetronomePlayed = true;
    }
    else {
        isMetronomePlayed = false;
        Tone.Transport.pause();
    }

};

addKeyMap();

document.querySelector(".sidebar.metronome .play").onclick = metronome;

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

function addKeyMap() {
    guling.forEach(function (gulingtangan, index) {
        let keyElement = document.createElement("p");
        keyElement.innerText = keyArray[index];
        keyElement.classList.add("keyMap");
        gulingtangan.appendChild(keyElement);
    });
}

function toggleKeyMap() {
    let keyMapElements = document.querySelectorAll(".keyMap");
    if (isKeyMapShown) {
        keyMapElements.forEach(function (element, index) {
            element.style.display = "none";
        });
        isKeyMapShown = false;
    }
    else {
        keyMapElements.forEach(function (element, index) {
            element.style.display = "block";
        });
        isKeyMapShown = true;
    }

}

function setTimeline(measure, beat, sixteenth) {
    document.querySelector(".timeline-value").innerText = `${measure}:${beat}:${sixteenth}`;
}