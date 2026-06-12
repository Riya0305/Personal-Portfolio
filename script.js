// Paste your Google Apps Script web app URL here after setup (see google-apps-script/contact-form.gs).
var CONTACT_FORM_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyP8U9CyPVXYt13wi3h_fnQsfecMUOebToAzYWKOseM4PIfP7qM7u73roFgRswU2yJ4fA/exec";

var contactForm = document.getElementById("contact-form");
var formStatus = document.getElementById("form-status");
var submitButton = document.getElementById("submit-btn");

if (contactForm) {
  contactForm.addEventListener("submit", handleContactSubmit);
}

function handleContactSubmit(event) {
  event.preventDefault();

  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    setFormStatus("Please fill in all fields.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    setFormStatus("Please enter a valid email address.", "error");
    return;
  }

  if (CONTACT_FORM_SCRIPT_URL.indexOf("PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") !== -1) {
    setFormStatus(
      "Contact form is not connected yet. Add your Google Apps Script URL to script.js.",
      "error"
    );
    return;
  }

  setFormStatus("Sending your message...", "loading");
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  var formBody = new URLSearchParams();
  formBody.append("name", name);
  formBody.append("email", email);
  formBody.append("message", message);

  fetch(CONTACT_FORM_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: formBody
  })
    .then(function () {
      contactForm.reset();
      setFormStatus("Thank you! Your message was sent successfully.", "success");
    })
    .catch(function () {
      setFormStatus("Something went wrong. Please try again or email me directly.", "error");
    })
    .finally(function () {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    });
}

function setFormStatus(text, type) {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = text;
  formStatus.className = "form-status " + type;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
