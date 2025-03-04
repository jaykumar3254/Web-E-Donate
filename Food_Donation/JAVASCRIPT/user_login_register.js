document.addEventListener("DOMContentLoaded", () => {
    const formTitle = document.getElementById("form-title");
    const nameField = document.getElementById("name");
    const phoneField = document.getElementById("phone");
    const confirmPasswordField = document.getElementById("confirm-password");
    const formButton = document.querySelector(".form-button");
    const authForm = document.getElementById("auth-form");
    const toggleText = document.getElementById("toggle-text");
    let isRegister = false;

    // Function to toggle login/register
    function toggleForm() {
        isRegister = !isRegister;

        if (isRegister) {
            formTitle.textContent = "Register";
            nameField.style.display = "block";
            phoneField.style.display = "block";
            confirmPasswordField.style.display = "block";
            formButton.textContent = "Register";
            toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-link">Login</a>`;
        } else {
            formTitle.textContent = "Login";
            nameField.style.display = "none";
            phoneField.style.display = "none";
            confirmPasswordField.style.display = "none";
            formButton.textContent = "Login";
            toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-link">Register</a>`;
        }

        // Re-attach event listener after changing innerHTML
        document.getElementById("toggle-link").addEventListener("click", (e) => {
            e.preventDefault();
            toggleForm();
        });
    }

    // Attach event listener for toggling forms
    document.getElementById("toggle-form").addEventListener("click", (e) => {
        e.preventDefault();
        toggleForm();
    });

    // Handle Register & Login
    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = nameField.value.trim();
        const phone = phoneField.value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = confirmPasswordField.value.trim();

        if (isRegister) {
            if (password !== confirmPassword) {
                alert("❌ Passwords do not match!");
                return;
            }

            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, email, password }),
            });

            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                window.location.href = "../HTML/donate_food_form.html"; // ✅ Redirect after successful registration
            }
        } else {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Login successful!");
                window.location.href = "../HTML/donate_food_form.html"; // ✅ Redirect after successful login
            } else {
                alert(`❌ ${data.error}`);
            }
        }
    });
});
