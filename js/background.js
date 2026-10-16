//Beka
const colors=["#FFFF", "#FFF1E6", "#E6F7EE", "#F0EAFB", "#E3F2FD", "#FFFBE0"];
const colorlNames=["White", "Peach", "Mint", "Lavender", "Sky", "Lemon"];
let index=0;

const colorBtn=document.getElementById("colorBtn");
const colorName=document.getElementById("colorName");

colorBtn.addEventListener("click", function(){
    index+=1;
    if(index===colors.length){
        index=0;
    }
    document.body.style.backgroundColor=colors[index];
    colorName.textContent=colorName[index];
})