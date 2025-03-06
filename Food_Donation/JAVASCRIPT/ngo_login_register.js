document.addEventListener("DOMContentLoaded", () => {
    const formTitle = document.getElementById("form-title");
    const authForm = document.getElementById("auth-form");
    const toggleLink = document.getElementById("toggle-form");

    // Function to toggle between Login and Registration form
    const toggleForm = () => {
        if (formTitle.innerText === "NGO Login") {
            formTitle.innerText = "NGO Registration";
            authForm.innerHTML = `
                <input type="text" id="ngo-name" placeholder="NGO Name" required>
                <input type="email" id="email" placeholder="Email" required>
                <input type="tel" id="phone" placeholder="Phone Number" required>
                <input type="url" id="website" placeholder="Website URL (Optional)">
                <select id="ngo-type" required>
                    <option value="">Choose NGO Type</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="environment">Environment</option>
                </select>
                <input type="password" id="password" placeholder="Password" required>
                <button type="submit" class="auth-button">Register</button>
            `;
            toggleLink.innerHTML = "Already have an account? <a href='#'>Login</a>";
        } else {
            formTitle.innerText = "NGO Login";
            authForm.innerHTML = `
                <input type="email" id="email" placeholder="Email" required>
                <input type="password" id="password" placeholder="Password" required>
                <button type="submit" class="auth-button">Login</button>
            `;
            toggleLink.innerHTML = "Don't have an account? <a href='#'>Register</a>";
        }
        attachFormHandler();
    };

    // Event listener for toggling form
    toggleLink.addEventListener("click", (e) => {
        e.preventDefault();
        toggleForm();
    });

    // Function to handle form submission
    const attachFormHandler = () => {
        authForm.onsubmit = async (e) => {
            e.preventDefault();
            const formType = formTitle.innerText;
            const submitButton = authForm.querySelector(".auth-button");
            submitButton.disabled = true; // Prevent multiple submissions

            if (formType === "NGO Login") {
                // Handle NGO Login
                const email = document.getElementById("email").value.trim();
                const password = document.getElementById("password").value;

                if (!email || !password) {
                    showMessage("All fields are required!", "error");
                    submitButton.disabled = false;
                    return;
                }

                try {
                    const response = await fetch("http://localhost:5000/ngo/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        localStorage.setItem("ngoId", data.ngoId);
                        showMessage("Login successful! Redirecting...", "success");
                        setTimeout(() => window.location.href = "ngo_dashboard.html", 2000);
                    } else {
                        showMessage(data.error || "Login failed", "error");
                    }
                } catch (error) {
                    showMessage("Server error! Try again later.", "error");
                }
            } else {
                // Handle NGO Registration
                const ngoName = document.getElementById("ngo-name").value.trim();
                const email = document.getElementById("email").value.trim();
                const phone = document.getElementById("phone").value.trim();
                const website = document.getElementById("website").value.trim();
                const ngoType = document.getElementById("ngo-type").value;
                const password = document.getElementById("password").value;

                if (!ngoName || !email || !phone || !ngoType || !password) {
                    showMessage("All required fields must be filled!", "error");
                    submitButton.disabled = false;
                    return;
                }

                try {
                    const response = await fetch("http://localhost:5000/ngo/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ngoName, email, phone, website, ngoType, password })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        showMessage("Registration successful! Please login.", "success");
                        setTimeout(() => toggleForm(), 2000);
                    } else {
                        showMessage(data.error || "Registration failed", "error");
                    }
                } catch (error) {
                    showMessage("Server error! Try again later.", "error");
                }
            }
            submitButton.disabled = false;
        };
    };

    function showMessage(message, type) {
        const messageBox = document.createElement("div");
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        document.body.appendChild(messageBox);
        setTimeout(() => messageBox.remove(), 3000);
    }

    attachFormHandler(); // Ensure event listener is attached initially
});
