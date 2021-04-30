//declaration

let guling = document.querySelectorAll(".pots");

//let keyToggle = document.getElementById("keyToggle");

//let keys = document.querySelectorAll(".key");

let playlist = ["", "./assets/gulingtanga-notes/Db4.wav", "./assets/gulingtanga-notes/Eb4.wav", "", "./assets/gulingtanga-notes/Gb4.wav", "./assets/gulingtanga-notes/Ab4.wav", "./assets/gulingtanga-notes/Bb4.wav", "./assets/gulingtanga-notes/C4", "./assets/gulingtanga-notes/D4", "./assets/gulingtanga-notes/E4", "./assets/gulingtanga-notes/F4", "./assets/gulingtanga-notes/G4", "./assets/gulingtanga-notes/A5", "./assets/gulingtanga-notes/B5", "./assets/gulingtanga-notes/C5"];

//gulingtangan onclick

guling.forEach(function(gulingtangan){
    gulingtangan.addEventListener("click", function(){
      console.log(gulingtangan);
    })
})

//gulingtangan keypress

document.addEventListener("keypress", logKey);

let keyArray = ["", "1", "2", "", "7", "8", "9", "q", "w", "e", "r", "u", "i", "o", "p"];

function logKey(e){
    for(i=0; i<keyArray.length; i++){
        if(e.key === keyArray[i]){
        console.log(playlist[i]);
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