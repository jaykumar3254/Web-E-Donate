document.getElementById("toggle-form").addEventListener("click", function(event) {
    event.preventDefault();
    let title = document.getElementById("form-title");
    let nameField = document.getElementById("name");
    let phoneField = document.getElementById("phone");
    let confirmPass = document.getElementById("confirm-password");
    let formButton = document.querySelector(".form-button");
    let toggleText = document.getElementById("toggle-text");

    if (title.textContent === "Login") {
        title.textContent = "Register";
        nameField.style.display = "block";
        phoneField.style.display = "block";
        confirmPass.style.display = "block";
        formButton.textContent = "Register";
        toggleText.innerHTML = "Already have an account? <a href='#' id='toggle-form'>Login</a>";
    } else {
        title.textContent = "Login";
        nameField.style.display = "none";
        phoneField.style.display = "none";
        confirmPass.style.display = "none";
        formButton.textContent = "Login";
        toggleText.innerHTML = "Don't have an account? <a href='#' id='toggle-form'>Register</a>";
    }
});