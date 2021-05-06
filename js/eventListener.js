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

    // keyNoteMap FOR MAPPING KEYBOARD KEYS TO ITS NOTE, second index indicate isKeyPressed (restrict user from holding the key button)
    keyNoteMap[keyArray[index]] = [note, false];

    // urlsList FOR MAPPING NOTE TO ITS URL
    urlsList[note] = note + FILE_EXTENSION;

    //MOUSE CLICK EVENT LISTENER
    gulingtangan.addEventListener("mousedown", function () {
        playNote(note);
        document.getElementById(note).classList.add("darken");
    });
    gulingtangan.addEventListener("mouseup", function () {
        document.getElementById(note).classList.remove("darken");
    });
})

function playNote(note) {
    gulingtangan.triggerAttackRelease(note, sustain);
    // Add animation
    let id = note;
    document.getElementById(id).classList.remove("shake");
    window.requestAnimationFrame(function () {
        document.getElementById(id).classList.add("shake");
    });
}

//KEYBOARD KEYS EVENT LISTENER
document.addEventListener("keydown", logKey);
function logKey(e) {
    if (keyNoteMap[e.key]) {
        if (!keyNoteMap[e.key][1]) {
            let note = keyNoteMap[e.key][0];
            playNote(note);
            keyNoteMap[e.key][1] = true;
            document.getElementById(note).classList.add("darken");
        }
    }
}

document.addEventListener("keyup", logKeyPressed);
function logKeyPressed(e) {
    if (keyNoteMap[e.key]) {
        if (keyNoteMap[e.key][1]) {
            let note = keyNoteMap[e.key][0];
            keyNoteMap[e.key][1] = false;
            document.getElementById(note).classList.remove("darken");
        }
    }
}

window.addEventListener("load", function () {
    if (!gulingtangan.loaded) {
        console.log("waiting for sound assets to load...");
    }
    else {
        hideLoader();
    }
    isWindowLoaded = true;
})


let rightNavElements = document.querySelectorAll(".nav_links.right input[type=radio]");
for (let i = 0; i < rightNavElements.length; i++) {

    // Initialise attribute wasChecked
    rightNavElements[i].setAttribute("wasChecked", false);

    rightNavElements[i].addEventListener('click', function () {
        // Allow uncheck on right nav_links
        let currentWasChecked = this.wasChecked;
        for (let i = 0; i < rightNavElements.length; i++) {
            let element = rightNavElements[i];
            if (element.wasChecked) {
                element.wasChecked = false;
            }
            let className = element.value;
            document.querySelector('.sidebar.' + className).style.display = 'none';
        }
        if (currentWasChecked) {
            this.checked = false;
            this.wasChecked = false;
            let className = this.value;
            document.querySelector('.sidebar.' + className).style.display = 'none';
        }
        else {
            this.checked = true;
            this.wasChecked = true;
            let className = this.value;
            document.querySelector('.sidebar.' + className).style.display = 'block';
        }



    });
}

function uncheckRightNavLinks() {
    for (let i = 0; i < rightNavElements.length; i++) {
        let element = rightNavElements[i];
        element.wasChecked = false;
        element.checked = false;
    }
}

function showSideBar() {
}

function hideLoader() {
    let loader = document.getElementById("loader");
    loader.classList.add("hidden");
}