let currentMeasure = -1;
let isKeyMapShown = false;

const tick = new Tone.Player("./assets/tick.wav").toDestination();
const tock = new Tone.Player("./assets/tock.wav").toDestination();


const gulingtangan = new Tone.Sampler({
    urls: urlsList,
    release: 1,
    baseUrl: PATH,
}).toDestination();

let metronome = function () {
    Tone.Transport.scheduleRepeat((time) => {
        // use the callback time to schedule events
        let position = Tone.Transport.position;
        let musicTime = position.split(':');
        if (currentMeasure != musicTime[0]) {
            currentMeasure = musicTime[0];
            tick.start();
            console.log('tick');
        }
        else {
            tock.start();
            console.log('tock');
        }
    }, "4n");
    // transport must be started before it starts invoking events
    Tone.Transport.start();
    Tone.start();
};

// document.getElementById('metronone-play').onclick = metronome;
addKeyMap();

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
    if(isKeyMapShown){
        keyMapElements.forEach(function (element, index) {
            element.style.display = "none";
        });
        isKeyMapShown = false;
    }
    else{
        keyMapElements.forEach(function (element, index) {
            element.style.display = "block";
        });
        isKeyMapShown = true;
    }

}