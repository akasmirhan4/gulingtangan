let currentMeasure = -1;
let currentBeat = -1;
let isKeyMapShown = false;
let isMetronomePlayed = false;

const tick = new Tone.Player("./assets/tick.wav").toDestination();
const tock = new Tone.Player("./assets/tock.wav").toDestination();


const gulingtangan = new Tone.Sampler({
    urls: urlsList,
    release: 1,
    baseUrl: PATH,
}).toDestination();

Tone.Transport.scheduleRepeat((time) => {
    // use the callback time to schedule events
    let position = Tone.Transport.position;
    let musicTime = position.split(':');
    let measure = parseInt(musicTime[0]);
    let beat = parseInt(musicTime[1]);
    let sixteenth = parseInt(musicTime[2]);
    document.querySelector(".timeline-value").innerText = `${measure}:${beat}:${sixteenth}`;
    if (currentMeasure != measure) {
        currentMeasure = measure;
        tick.start();
        console.log('tick');
    }
    else if (currentBeat != beat && beat != 0){
        currentBeat = beat;
        tock.start();
        console.log('tock');
    }
}, "16n");

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