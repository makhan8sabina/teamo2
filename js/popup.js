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

subscribeBtn.addEventListener("click", function () {
    clearError("sub-name");
    clearError("sub-email");

    const name = document.getElementById("sub-name").value;
    const email = document.getElementById("sub-email").value;
    let hasErrors = false;

    if (isEmailValid(email)===false){
      showError("sub-email", "Enter a valid email, e.g. name@example.com.");
        hasErrors = true;  
    }

    if(hasErrors===false){
        subscribeMessage.textContent = "Thank you, " + name + "! You are subscribed.";
        document.getElementById("sub-name").value = "";
        document.getElementById("sub-email").value = "";
    }
});



const filterBtns = document.querySelectorAll('[data-filter]');
const scheduleRows = document.querySelectorAll('#schedule tbody tr');

filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  const format = btn.dataset.filter;
  scheduleRows.forEach(row => {
    row.classList.toggle('d-none', format !== 'all' && row.dataset.format !== format);
  });
}));