document.addEventListener("DOMContentLoaded", function () {
    const faqs = document.querySelectorAll(".faq");

    faqs.forEach(faq => {
        faq.addEventListener("click", function () {
            // Close all other FAQs
            faqs.forEach(item => {
                if (item !== faq && item.classList.contains("open")) {
                    closeFAQ(item);
                }
            });

            // Toggle the clicked FAQ
            if (faq.classList.contains("open")) {
                closeFAQ(faq);
            } else {
                openFAQ(faq);
            }
        });
    });

    function openFAQ(faq) {
        const answer = faq.querySelector(".faq-answer");
        faq.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px"; // Expand smoothly
    }

    function closeFAQ(faq) {
        const answer = faq.querySelector(".faq-answer");
        faq.classList.remove("open");
        answer.style.maxHeight = "0"; // Collapse smoothly
    }

    // Fade-in Animation on Scroll
    const fadeElements = document.querySelectorAll(".fade-in");

    const fadeInOnScroll = () => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add("visible");
            }
        });
    };

    window.addEventListener("scroll", fadeInOnScroll);
    fadeInOnScroll(); // Trigger on load

    // Button Hover Effect
    document.querySelectorAll(".donate-button, .donate-btn").forEach(button => {
        button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.1)";
            button.style.transition = "transform 0.3s ease-in-out";
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "scale(1)";
        });
    });

    // ✅ Redirect to Login/Register when "Donate Now" is clicked
    document.querySelectorAll(".donate-button, .donate-btn").forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = "user_login_register.html"; // Change this to your actual login/register page
        });
    });
});

// Email Validation
function validateEmail() {
    const emailInput = document.getElementById("email");
    const errorMessage = document.getElementById("error-message");
    const email = emailInput.value.trim();

    // Regular expression for email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
        errorMessage.textContent = "Please enter a valid email address.";
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
        alert("Thank you for subscribing!");
        emailInput.value = ""; // Clear input after successful submission
    }
}

