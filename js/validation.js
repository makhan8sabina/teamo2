document.addEventListener("DOMContentLoaded", function () {
  const registerBtn = document.getElementById("registerBtn");
  const resetBtn = document.getElementById("resetBtn");
  const statusText = document.getElementById("form-status");

  if (!registerBtn) return;

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
    clearError("phone");
    clearError("message");
    if (statusText) statusText.textContent = "";
  }

  registerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    clearAllErrors();

    const fullName = document.getElementById("full-name") ? document.getElementById("full-name").value.trim() : "";
    const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
    const phone = document.getElementById("phone") ? document.getElementById("phone").value.trim() : "";
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
    } else if (!Validators.email(email)) {
      showError("email", "Enter a valid email, e.g. name@example.com.");
      hasErrors = true;
    }

    if (phone.length === 0) {
      showError("phone", "Please enter your phone number.");
      hasErrors = true;
    } else if (!Validators.phone(phone)) {
      showError("phone", "Use the format +7 700 123 45 67.");
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
      TeamoUI.toast("Please fix the highlighted fields.", "error");
    } else {
      const player = {
        name: fullName,
        email: email,
        phone: phone,
        reason: document.getElementById("reason").value,
        format: document.querySelector("input[name='format']:checked").value
      };

      sendForm(player, showSuccess);
    }
  });

  function sendForm(data, callback) {
    statusText.style.color = "";
    statusText.textContent = "";
    TeamoUI.setLoading($(registerBtn), true);

    setTimeout(function () {
      callback(data);
    }, 1000);
  }

  function showSuccess(data) {
    TeamoUI.setLoading($(registerBtn), false);
    TeamoUI.toast("Form submitted successfully!", "success");
    statusText.style.color = "green";
    statusText.textContent = "Thank you, " + data.name + "! We received your request (" +
      data.format + "). We will write to " + data.email + ".";

    clearInputs();
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