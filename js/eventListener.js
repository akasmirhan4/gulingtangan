//declaration

let guling = document.querySelectorAll(".pots");

//let keyToggle = document.getElementById("keyToggle");

//let keys = document.querySelectorAll(".key");

let playlist = new Array("", ".assets/gulingtangan-notes/Db4.wav", ".assets/gulingtangan-notes/Eb4.wav", "", ".assets/gulingtangan-notes/Gb4.wav", ".assets/gulingtangan-notes/Ab4.wav", ".assets/gulingtangan-notes/Bb4.wav", ".assets/gulingtangan-notes/C4.wav", ".assets/gulingtangan-notes/D4.wav", ".assets/gulingtangan-notes/E4.wav", ".assets/gulingtangan-notes/F4.wav", ".assets/gulingtangan-notes/G4.wav", ".assets/gulingtangan-notes/A5.wav", ".assets/gulingtangan-notes/B5.wav", ".assets/gulingtangan-notes/C5.wav");

let notes=document.querySelectorAll(".notes");

//gulingtangan onclick

guling.forEach(function(gulingtangan){
    gulingtangan.addEventListener("click", function(){
      gulingtangan.children[1].play();
    })
})

//gulingtangan keypress

document.addEventListener("keypress", logKey);

let keyArray = ["", "1", "2", "", "7", "8", "9", "", "q", "w", "e", "r", "u", "i", "o", "p"];

function logKey(e){
    for(i=0; i<keyArray.length; i++){
        if(e.key === keyArray[i]){
            notes[i].play();
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