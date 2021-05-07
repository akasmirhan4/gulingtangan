let PATH = './assets/gulingtangan-notes/';
let FILE_EXTENSION = '.wav';
let sustain = 0;
let dOctave = 0;
//declaration
let guling = document.querySelectorAll(".pots:not(.empty)");
let keyAreaClicked = null;

let isOctaveShown = false;
hideOctave();

let defaultKeyArray = ["s", "d", "g", "h", "j", "z", "x", "c", "v", "b", "n", "m", ","];

let urlsList = new Object;
let keyNoteMap = new Object;
guling.forEach(function (gulingtangan, index) {
    let note = gulingtangan.id;
    let currentOctave = parseInt(note.slice(-1)) + dOctave;
    note = note.slice(0, -1) + currentOctave;

    // keyNoteMap FOR MAPPING KEYBOARD KEYS TO ITS NOTE, second index indicate isKeyPressed (restrict user from holding the key button)
    keyNoteMap[defaultKeyArray[index]] = [note, false];

    // urlsList FOR MAPPING NOTE TO ITS URL
    urlsList[note] = note + FILE_EXTENSION;

    //MOUSE CLICK EVENT LISTENER
    gulingtangan.addEventListener("mousedown", function () {
        let note = this.id;
        document.getElementById(note).classList.add("darken");
        playNote(note);
        animateNote(note);
    });
})
document.addEventListener("mouseup", function () {
    document.querySelectorAll(".darken").forEach((el) => el.classList.remove("darken"));
    hideSideBar();
});

function animateNote(note) {
    // Add animation
    let id = note;
    if (document.getElementById(id)) {
        document.getElementById(id).classList.remove("shake");
        window.requestAnimationFrame(function () {
            document.getElementById(id).classList.add("shake");
        });
    }
}
function playNote(note) {
    // Get instrument
    // let instrument
    let currentOctave = parseInt(note.slice(-1)) + dOctave;
    note = note.slice(0, -1) + currentOctave;
    gulingtangan.triggerAttackRelease(note, sustain);


}

//KEYBOARD KEYS EVENT LISTENER
document.addEventListener("keydown", keyhandler);

function keyhandler(e) {
    if (keyAreaClicked) {
        setKey(keyAreaClicked.parentElement.id, e.key);
        keyAreaClicked.classList.remove('active');
        keyAreaClicked = null;
    }
    else {
        logKey(e);
    }

}

function logKey(e) {
    if (keyNoteMap[e.key]) {
        if (!keyNoteMap[e.key][1]) {
            let note = keyNoteMap[e.key][0];
            playNote(note);
            animateNote(note);
            keyNoteMap[e.key][1] = true;
            document.getElementById(note).classList.add("darken");
        }
    }
}

document.addEventListener("keyup", logKeyPressed);
document.addEventListener("mousedown", function (event) {
    if (keyAreaClicked) {
        keyAreaClicked.classList.remove('active');
    }
    keyAreaClicked = null;
});

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
        hideSideBar();
        if (currentWasChecked) {
            this.checked = false;
            this.wasChecked = false;
            let className = this.value;
            document.querySelector('.sidebar.' + className).style.display = 'none';
        }
        else {
            showSideBar(this);
        }
    });
}

function hideSideBar() {
    for (let i = 0; i < rightNavElements.length; i++) {
        let element = rightNavElements[i];
        element.checked = false;
        if (element.wasChecked) {
            element.wasChecked = false;
        }
        let className = element.value;
        document.querySelector('.sidebar.' + className).style.display = 'none';
    }
};

function showSideBar(settingElement) {
    settingElement.checked = true;
    settingElement.wasChecked = true;
    let className = settingElement.value;
    document.querySelector('.sidebar.' + className).style.display = 'block';
}

function uncheckRightNavLinks() {
    for (let i = 0; i < rightNavElements.length; i++) {
        let element = rightNavElements[i];
        element.wasChecked = false;
        element.checked = false;
    }
}

function hideLoader() {
    let loader = document.getElementById("loader");
    loader.classList.add("hidden");
}



let startRecording = function () {
    // PLAY TICK TOCKx3
    //READ CURRENT TIME(MEASURE:BEAT:SIXTEENTH)
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
        if (currentBeat == 1) {
            clearInterval(tickTock);
            let position = Tone.Transport.position;
            let musicTime = position.split(':');
            let measure = parseInt(musicTime[0]);
            let beat = parseInt(musicTime[1]);
            let sixteenth = parseInt(musicTime[2]);
            //START THE CLOCK FROM THE CURRENT TIME
            setTimeline(measure, beat, sixteenth);
            //ANY USER INPUT WILL BE MAPPED INTO AN ARRAY/OBJECT

        }
    }, 60 / Tone.Transport.bpm.value * 1000);
}

let playRecording = function () {
    //START THE CLOCK FROM 0 to END
    //EACH INTERVAL WITHIN THE ARRAY PLAY BACK AS NOTES
    //AT END OF RECORDING STOP AND START BACK TO BEGINNGING BUT PAUSED
}

function setKeyMapArea() {
    guling.forEach(function (element, index) {
        let keyAreaElement = document.createElement("div");
        keyAreaElement.classList.add("keyMapArea");
        keyAreaElement.style.display = "none";
        element.appendChild(keyAreaElement);
    });
}
setKeyMapArea();

function showKeyMapArea() {
    bufferKeyMapFlag = isKeyMapShown;
    document.querySelector(".reset").style.display = "block";
    showKeyMap();
    let keyAreaElements = document.querySelectorAll(".keyMapArea");
    keyAreaElements.forEach((element, index) => {
        isKeyMapAreaShown = true;
        element.style.display = "block";
    });
}
function hideKeyMapArea() {
    let keyAreaElements = document.querySelectorAll(".keyMapArea");
    document.querySelector(".reset").style.display = "none";

    keyAreaElements.forEach((element, index) => {
        isKeyMapAreaShown = false;
        element.style.display = "none";
    });
    if (!bufferKeyMapFlag) {
        hideKeyMap();
    }
    isKeyMapShown = bufferKeyMapFlag;
}

let toggleKeyMapArea = function () {
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
document.querySelector(".record").onclick = startRecording;
document.querySelector(".editKeyMap").onclick = toggleKeyMapArea;
document.querySelectorAll(".keyMapArea").forEach((element) => {
    element.addEventListener("mousedown", (event) => {
        if (keyAreaClicked) {
            keyAreaClicked.classList.remove('active');
        }
        event.stopPropagation();
        element.classList.add('active');
        keyAreaClicked = element;
    });

    element.addEventListener("keydown", function (e) {
        setKey(element.parentElement.id, e.key);
    });
});
function setKey(note, key) {
    let oldKeyMap = document.querySelector(`#${note} .keyMap`).innerText;
    let newKeyMap = key;
    // set empty to oldKeyMap
    let bindingNote = keyNoteMap[newKeyMap];
    if (bindingNote) {
        let clashedKey = document.querySelector(`#${bindingNote[0]} .keyMap`);
        console.error(`key bind clashed. Please enter a new key bind on the clashed note:\n${keyNoteMap[newKeyMap][0]}`);
        clashedKey.innerText = "";
    }
    keyNoteMap[oldKeyMap] = null;
    keyNoteMap[newKeyMap] = [note, false];
    document.querySelector(`#${note} .keyMap`).innerText = newKeyMap;
};

function hideKeyMapArea() {
    let keyAreaElements = document.querySelectorAll(".keyMapArea");
    document.querySelector(".reset").style.display = "none";

    keyAreaElements.forEach((element, index) => {
        isKeyMapAreaShown = false;
        element.style.display = "none";
    });
    if (!bufferKeyMapFlag) {
        hideKeyMap();
    }
    isKeyMapShown = bufferKeyMapFlag;
}

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


let toggleOctave = function () {
    let element = document.querySelector(".octave");
    if (isOctaveShown) {
        hideOctave();
    }
    else {
        showOctave();
    }
};

document.querySelector(".showOctave").onclick = toggleOctave;

document.querySelector(".octave .left").onclick = () => {
    dOctave--;
    document.querySelector(".octave-val").innerText = 4 + dOctave;
}

document.querySelector(".octave .right").onclick = () => {
    dOctave++;
    document.querySelector(".octave-val").innerText = 4 + dOctave;
}

let resetKeyBind = function () {
    guling.forEach(function (gulingtangan, index) {
        let note = gulingtangan.id;
        setKey(note, defaultKeyArray[index]);
    });
};
document.querySelector(".reset").onclick = resetKeyBind;

document.querySelectorAll(".sidebar.songs div").forEach((songElement) => {

    songElement.onclick = function (e) {
        currentSong = this.innerText;
        loadSong(currentSong).then(function (loadedSong) {
            songTiming = getMidi(loadedSong);
        });

    };
});