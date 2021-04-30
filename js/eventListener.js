//declaration

let guling = document.querySelectorAll(".pots");

//let keyToggle = document.getElementById("keyToggle");

//let keys = document.querySelectorAll(".key");

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