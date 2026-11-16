function showError(fieldId, message) {
  document.getElementById(fieldId + "-error").textContent = message;
  document.getElementById(fieldId).style.borderColor = "red";
}

function clearError(fieldId) {
  document.getElementById(fieldId + "-error").textContent = "";
  document.getElementById(fieldId).style.borderColor = "";
}

function popAnimation(element) {
  element.style.transform = "scale(1.15)";
  setTimeout(function () {
    element.style.transform = "scale(1)";
  }, 300);
}