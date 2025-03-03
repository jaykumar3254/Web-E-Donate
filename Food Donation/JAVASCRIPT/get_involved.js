document.addEventListener("DOMContentLoaded", function () {
    // Handle Join Us Form Submission
    const joinForm = document.getElementById("joinForm");
    const formMessage = document.getElementById("formMessage");

    if (joinForm) {
        joinForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; // Simple Email Validation

            console.log("Name:", name);
            console.log("Email:", email);

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

            formMessage.textContent = `Thank you, ${name}, for joining us!`;
            formMessage.style.color = "green";
            joinForm.reset();
        });
    }

    // Click to Navigate to Registration Page
    document.querySelectorAll(".ngopartner").forEach(card => {
        card.addEventListener("click", function () {
            window.location.href = "../HTML/registration.html"; // Change to the actual page URL
        });
    });

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
