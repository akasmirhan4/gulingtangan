//declaration

let guling = document.querySelectorAll(".pots:not(empty)");

//let keyToggle = document.getElementById("keyToggle");

//let keys = document.querySelectorAll(".key");

let notes=[
    {
        noteId: "Db4",
        note: "./assets/gulingtangan-notes/Db4.wav"
    }
    ,   
    {
        noteId: "Eb4",
        note: "./assets/gulingtangan-notes/Eb4.wav"
    }
    ,
    {
        noteId: "Gb4",
        note: "./assets/gulingtangan-notes/Gb4.wav"
    }
    ,
    {
        noteId: "Ab4",
        note: "./assets/gulingtangan-notes/Ab4.wav"
    }
    ,
    {
        noteId: "Bb4",
        note: "./assets/gulingtangan-notes/Bb4.wav"
    }
    ,
    {
        noteId: "C4",
        note: "./assets/gulingtangan-notes/C4.wav"
    }
    ,
    {
        noteId: "D4",
        note: "./assets/gulingtangan-notes/D4.wav"
    }
    ,
    {
        noteId: "E4",
        note: "./assets/gulingtangan-notes/E4.wav"
    }
    ,
    {
        noteId: "F4",
        note: "./assets/gulingtangan-notes/F4.wav"
    }
    ,
    {
        noteId: "G4",
        note: "./assets/gulingtangan-notes/G4.wav"
    }
    ,
    {
        noteId: "A4",
        note: "./assets/gulingtangan-notes/A4.wav"
    }
    ,
    {
        noteId: "B4",
        note: "./assets/gulingtangan-notes/B4.wav"
    }
    ,
    {
        noteId: "C5",
        note: "./assets/gulingtangan-notes/C4.wav"
    }

]

//gulingtangan onclick

guling.forEach(function(gulingtangan){
    gulingtangan.addEventListener("click", function(){
//      gulingtangan.children[1].play();
        for(i=0; i<notes.length;i++){
            if((notes[i].noteId)===(gulingtangan.id)){
                playNote(notes[i].note);
            }
        }
    })
})

function playNote(note){
    let audio = new Audio(note);
    audio.play();
}

//gulingtangan keypress

document.addEventListener("keypress", logKey);

let keyArray = ["1", "2", "7", "8", "9", "q", "w", "e", "r", "u", "i", "o", "p"];

function logKey(e){
    for(i=0; i<keyArray.length; i++){
        if(e.key === keyArray[i]){
            playNote(notes[i].note);
        }
    }
}

//toggle keyboard notes

/*

keyToggle.addEventListener("click", function(){
    for(i=0; i<keys.length; i++){
        if(keys[i].classList.contains("hidden")){
            keys[i].classList.remove("hidden");
        }
        else{
            keys[i].classList.add("hidden");
        }
    }
})

*/

//loader

let loader = document.getElementById("loader");

window.addEventListener("load", function(){
    loader.classList.add("hidden");
})