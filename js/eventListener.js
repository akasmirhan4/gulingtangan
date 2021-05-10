//MOUSEDOWN EVENT LISTENER FOR EACH GULINGTANGAN ELEMENTS
gulingtanganElements.forEach(function (gulingtangan) {
    gulingtangan.addEventListener("mousedown", function () {
        //THE ID REPRESENT THE NOTE TO BE PLAYED
        let note = this.id;
        //PLAY NOTE
        document.getElementById(note).classList.add("darken");
        playNote(note);
        if (isRecording) {
            recordNote(note);
        }
        animateNote(note);
    });
})

//REMOVE DARKEN CLASS WHEN MOUSEUP ANYWHERE ON THE BROWSER
document.addEventListener("mouseup", function () {
    document.querySelectorAll(".darken").forEach((el) => el.classList.remove("darken"));
    hideSideBar();
});

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
    //IF KEY BIND TO ANY NOTE EXIST
    if (keyNoteMap[e.key]) {
        //IF THE KEY IS NOT ALREADY PRESSED
        if (!keyNoteMap[e.key][1]) {

            //PLAY AND ANIMATE
            let note = keyNoteMap[e.key][0];
            playNote(note);
            if (isRecording) {
                recordNote(note);
            }
            animateNote(note);
            document.getElementById(note).classList.add("darken");

            //FLAG KEY PRESSED
            keyNoteMap[e.key][1] = true;
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
    //IF KEY BIND TO ANY NOTE EXIST
    if (keyNoteMap[e.key]) {
        //IF THE KEY IS ALREADY PRESSED
        if (keyNoteMap[e.key][1]) {

            //REMOVE DARKEN STATE
            let note = keyNoteMap[e.key][0];
            document.getElementById(note).classList.remove("darken");

            //FLAG KEY UNPRESSED 
            keyNoteMap[e.key][1] = false;

        }
    }
}

window.addEventListener("load", function () {

    //IF SOUND NOT YET LOADED, DO NOT LOAD THE WEBSITE YET
    if (!gulingtangan.loaded) {
        console.log("waiting for sound assets to load...");
    }
    else {
        hideLoader();
    }

    //FLAG WEBSITE ASSETS (NOT SOUND) LOADED
    isWindowLoaded = true;
})

//RIGHT NAVIGATION HANDLER
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

//LOADING SCREEN HANDLER
function showLoader() {
    if (isPlayed) {
        pauseTimeline();
    }
    let loader = document.getElementById("loader");
    loader.classList.remove("hidden");
}

function hideLoader() {
    if (isPlayed) {
        playTimeline();
    }
    let loader = document.getElementById("loader");
    loader.classList.add("hidden");
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

document.querySelector(".octave .left").onclick = () => {
    dOctave--;
    document.querySelector(".octave-val").innerText = 4 + dOctave;
}

document.querySelector(".octave .right").onclick = () => {
    dOctave++;
    document.querySelector(".octave-val").innerText = 4 + dOctave;
}

//LOAD SONG
document.querySelectorAll(".sidebar.songs div").forEach((songElement) => {
    songElement.onclick = function (e) {
        currentSong = this.innerText;
        loadSong(currentSong).then(function (loadedSong) {
            songNotes = getMidi(loadedSong);
        });
    };
});
document.querySelector("#instruments").addEventListener("change", function () {
    selectedInstrument = this.value;
    selectInstrument();
});
document.querySelector(".showOctave").addEventListener("click", toggleOctave);
document.querySelector(".reset").addEventListener("click", resetKeyBind);
document.querySelector(".sidebar.metronome .bpm").addEventListener("click", setBPM);
document.querySelector("button.stop").addEventListener("click", stopTimeline);
document.querySelector("button.play").addEventListener("click", togglePlayTimeline);
document.querySelector(".sidebar.metronome .toggle").addEventListener("click", toggleMetronome);
document.querySelector(".sidebar.settings .showKeyMap").addEventListener("click", toggleKeyMap);