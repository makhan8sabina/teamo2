document.addEventListener("DOMContentLoaded", function () {
  const registerBtn = document.getElementById("registerBtn");
  const resetBtn = document.getElementById("resetBtn");
  const statusText = document.getElementById("form-status");

  if (!registerBtn) return;

  function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add("is-invalid");
    let err = field.parentElement.querySelector(".error-message");
    if (!err) {
      err = document.createElement("small");
      err.className = "error-message text-danger d-block mt-1";
      field.parentElement.appendChild(err);
    }
    err.textContent = message;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.remove("is-invalid");
    const err = field.parentElement.querySelector(".error-message");
    if (err) err.textContent = "";
  }

  function clearAllErrors() {
    clearError("full-name");
    clearError("email");
    clearError("password");
    clearError("confirm-password");
    clearError("message");
    if (statusText) statusText.textContent = "";
  }

  registerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    clearAllErrors();

    const fullName = document.getElementById("full-name") ? document.getElementById("full-name").value.trim() : "";
    const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
    const password = document.getElementById("password") ? document.getElementById("password").value : "";
    const passwordRepeat = document.getElementById("confirm-password") ? document.getElementById("confirm-password").value : "";
    const message = document.getElementById("message") ? document.getElementById("message").value.trim() : "";

    let hasErrors = false;

    if (fullName.length === 0) {
      showError("full-name", "Please enter your full name.");
      hasErrors = true;
    } else if (fullName.length < 2) {
      showError("full-name", "Name must be at least 2 characters.");
      hasErrors = true;
    }

    if (email.length === 0) {
      showError("email", "Please enter your email address.");
      hasErrors = true;
    } else if (!isEmailValid(email)) {
      showError("email", "Enter a valid email, e.g. name@example.com.");
      hasErrors = true;
    }

    if (password.length === 0) {
      showError("password", "Please create a password.");
      hasErrors = true;
    } else if (password.length < 8) {
      showError("password", "Password must be at least 8 characters long.");
      hasErrors = true;
    }

    if (passwordRepeat.length === 0) {
      showError("confirm-password", "Please repeat your password.");
      hasErrors = true;
    } else if (passwordRepeat !== password) {
      showError("confirm-password", "Passwords do not match.");
      hasErrors = true;
    }

    if (message.length === 0) {
      showError("message", "Please write a short message.");
      hasErrors = true;
    } else if (message.length < 10) {
      showError("message", "Message must be at least 10 characters.");
      hasErrors = true;
    }

    if (hasErrors) {
      statusText.style.color = "red";
      statusText.textContent = "Please fix the highlighted fields and try again.";
    } else {

      
      const player = {
        name: fullName,
        email: email,
        reason: document.getElementById("reason").value,
        format: document.querySelector("input[name='format']:checked").value
      };

      sendForm(player, showSuccess);
    }
  });

  function sendForm(data, callback) {
    statusText.style.color = "";
    statusText.textContent = "Sending...";
    registerBtn.disabled = true;

    setTimeout(function () {
      callback(data);
    }, 1000);
  }


  function showSuccess(data) {
    registerBtn.disabled = false;
    statusText.style.color = "green";
    statusText.textContent = "Thank you, " + data.name + "! You are registered for " +
      data.format + ". We will write to " + data.email + ".";

    clearInputs();
    playWhistle();
    popAnimation(statusText);
  }

  
  function clearInputs() {
    document.querySelectorAll("#contact-form .form-control").forEach(function (input) {
      input.value = "";
    });
  }

  resetBtn.addEventListener("click", function () {
    clearAllErrors();
    clearInputs();
  });
});