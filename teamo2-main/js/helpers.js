function showError(fieldId, message){
    document.getElementById(fieldId+"-error").textContent=message;
    document.getElementById(fieldId).style.borderColor="red";
}

function clearError(fieldId){
    document.getElementById(fieldId+"-error").textContent=" ";
    document.getElementById(fieldId).style.borderColor=" ";
}

function isEmailValid(email){
    if (email.includes("@") && email.includes(".")){
        return true;
    } return false;
}