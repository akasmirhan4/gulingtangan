//declaration

let guling = document.querySelectorAll(".gt");

let keyToggle = document.getElementById("keyToggle");

let keys = document.querySelectorAll(".key");

//gulingtangan onclick

guling.forEach(function(gulingtangan){
    gulingtangan.addEventListener("click", function(){
      console.log(gulingtangan);
    })
})

//gulingtangan keypress

document.addEventListener("keypress", logKey);

let keyArray = ["1", "2", "7", "8", "9", "q", "w", "e", "r", "u", "i", "o", "p"];

function logKey(e){
    for(i=0; i<keyArray.length; i++){
        if(e.key === keyArray[i]){
        console.log(guling[i]);
        }
    }
}

//toggle keyboard notes

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