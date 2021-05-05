let currentMeasure = -1;

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
        if(currentMeasure != musicTime[0]){
            currentMeasure = musicTime[0];
            tick.start();
            console.log('tick');
        }
        else{
            tock.start();
            console.log('tock');
        }
    }, "4n");
    // transport must be started before it starts invoking events
    Tone.Transport.start();
    Tone.start();
};

// document.getElementById('metronone-play').onclick = metronome;