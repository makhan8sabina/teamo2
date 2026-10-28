function showError(fieldId, message){
    document.getElementById(fieldId+"-error").textContent=message;
    document.getElementById(fieldId).style.borderColor="red";
}

function clearError(fieldId){
    document.getElementById(fieldId+"-error").textContent="";
    document.getElementById(fieldId).style.borderColor="";
}

function isEmailValid(email){
    if (email.includes("@") && email.includes(".")){
        return true;
    } return false;
}


const whistle=new Audio("sounds/whistle.wav");

function playWhistle(){
    whistle.pause();
    whistle.currentTime=0;
    whistle.play();
}

function popAnimation(element){
    element.style.transform="scale(1.15)";
    setTimeout(function(){
        element.style.transform="scale(1)";
    }, 300);
}
