document.addEventListener("DOMContentLoaded", function () {
    // Handle "Get Involved" Form Submission
    const joinForm = document.getElementById("joinForm");
    const formMessage = document.getElementById("formMessage");

    if (joinForm) {
        joinForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            const name = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; // Simple email validation

            // Basic Validation
            if (!name || !email) {
                formMessage.textContent = "Please fill out all fields.";
                formMessage.style.color = "red";
                return;
            }

            if (!email.match(emailPattern)) {
                formMessage.textContent = "Please enter a valid email.";
                formMessage.style.color = "red";
                return;
            }

            // Show "Submitting..." message
            formMessage.textContent = "Submitting...";
            formMessage.style.color = "blue";

            // Send data to the server
            fetch("http://localhost:5000/get-involved", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email })
            })
            .then(response => response.json())
            .then(data => {
                // Show success message
                formMessage.textContent = data.message;
                formMessage.style.color = "green";

                // Reset form after success
                joinForm.reset();
            })
            .catch(error => {
                console.error("Error:", error);
                formMessage.textContent = "Submission failed. Try again.";
                formMessage.style.color = "red";
            });
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll(".nav-button").forEach(button => {
        button.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href").split("#")[1];
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Click to Navigate to Registration Page
    document.querySelectorAll(".ngopartner").forEach(card => {
        card.addEventListener("click", function () {
            window.location.href = "../HTML/registration.html"; // Update with actual path
        });
    });

    // Add Hover Effect to Involvement Cards
    document.querySelectorAll(".involve-card").forEach(card => {
        card.addEventListener("mouseover", function () {
            this.style.transform = "scale(1.05)";
            this.style.transition = "0.3s";
        });
        card.addEventListener("mouseout", function () {
            this.style.transform = "scale(1)";
        });
    });
});
