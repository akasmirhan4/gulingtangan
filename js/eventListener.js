let PATH = './assets/gulingtangan-notes/';
let FILE_EXTENSION = '.wav';
let sustain = 0;
//declaration
let guling = document.querySelectorAll(".pots:not(.empty)");


let keyArray = ["s", "d", "g", "h", "j", "z", "x", "c", "v", "b", "n", "m", ","];

let urlsList = new Object;
let keyNoteMap = new Object;
guling.forEach(function (gulingtangan, index) {
    let note = gulingtangan.id;

    // keyNoteMap FOR MAPPING KEYBOARD KEYS TO ITS NOTE
    keyNoteMap[keyArray[index]] = note;

    // urlsList FOR MAPPING NOTE TO ITS URL
    urlsList[note] = note + FILE_EXTENSION;

    //MOUSE CLICK EVENT LISTENER
    gulingtangan.addEventListener("mousedown", function () {
        playNote(note);
    })
})

function playNote(note) {
    sampler.triggerAttackRelease(note, sustain);
}

//KEYBOARD KEYS EVENT LISTENER
document.addEventListener("keypress", logKey);
function logKey(e) {
    if (keyNoteMap[e.key]) {
        let note = keyNoteMap[e.key];
        playNote(note);
    }
}

let loader = document.getElementById("loader");

window.addEventListener("load", function () {
    loader.classList.add("hidden");
})