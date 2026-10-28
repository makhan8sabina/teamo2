//Sabina
const openBtn=document.getElementById("openSubscribe");
const closeBtn=document.getElementById("closePopup");
const backdrop=document.getElementById("popup-backdrop");
const popupBox=document.getElementById("popup-box");
const subscribeBtn=document.getElementById("subscribeBtn");
const subscribeMessage=document.getElementById("subscribe-message");

function openPopup(){
    clearError("sub-name");
    clearError("sub-email");
    document.getElementById("sub-name").value="";
    document.getElementById("sub-email").value="";
    subscribeMessage.textContent="";

    backdrop.style.display="block";
    popupBox.style.display="block";
}

function closePopup(){
    backdrop.style.display="none";
    popupBox.style.display="none";
}

openBtn.addEventListener("click", function(){
    openPopup();
});

closeBtn.addEventListener("click", function () {
  closePopup();
});

backdrop.addEventListener("click", function () {
  closePopup();
});


document.addEventListener("keydown", function(event){
    if (event.key==="Escape"){
        closePopup();
    }
});

subscribeBtn.addEventListener("click", function () {
    clearError("sub-name");
    clearError("sub-email");

    const name = document.getElementById("sub-name").value;
    const email = document.getElementById("sub-email").value;
    let hasErrors = false;

    if (name.trim()===""){
      showError("sub-name", "Please enter your name.");
        hasErrors = true;
    }

    if (isEmailValid(email)===false){
      showError("sub-email", "Enter a valid email, e.g. name@example.com.");
        hasErrors = true;
    }

    if(hasErrors===false){
        subscribeMessage.textContent = "Thank you, " + name + "! You are subscribed.";
        document.getElementById("sub-name").value = "";
        document.getElementById("sub-email").value = "";
        playWhistle();
        popAnimation(subscribeMessage);
    }
});
