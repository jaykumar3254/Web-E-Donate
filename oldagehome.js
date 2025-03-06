/*const heartContainer = document.querySelector('.heart-container');

// Function to create a little heart
function createLittleHeart() {
    const littleHeart = document.createElement('div');
    littleHeart.classList.add('little-heart');

    // Random position around the main heart
    const angle = Math.random() * 360;
    const radius = 50 + Math.random() * 50;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    littleHeart.style.left = `${50 + x}px`;
    littleHeart.style.top = `${50 + y}px`;

    heartContainer.appendChild(littleHeart);

    // Remove the heart after the animation ends
    setTimeout(() => {
        littleHeart.remove();
    }, 5000);
}

// Create little hearts every 500ms
setInterval(createLittleHeart, 500);

document.addEventListener("DOMContentLoaded", function () {
    const digits = document.querySelectorAll(".digit");

    digits.forEach((digit, index) => {
        digit.style.animationDelay = `${index * 0.5}s`;
    });
});
*/
window.onscroll = function () {
    let button = document.getElementById("topBtn");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
};

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// valiation for form
function validateForm() {
    let name = document.getElementById("name").value.trim();
    let mobile = document.getElementById("Mo-no").value.trim();
    let email = document.getElementById("email").value.trim();
    let aadhar = document.getElementById("aadhar").value.trim();
    let amount = document.getElementById("amount").value.trim();
    let supportTo = document.getElementById("supportTo").value;
    let payment = document.getElementById("payment").value;

    // Name Validation (Only letters & spaces, min 3 characters)
    let nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameRegex.test(name)) {
        alert("Please enter a valid full name .");
        return false;
    }

    // Mobile No Validation (Exactly 10 digits)
    let mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return false;
    }

    // Email Validation (Handled by input type="email", but we add extra check)
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // Aadhaar Validation (Exactly 12 digits)
    let aadharRegex = /^[0-9]{12}$/;
    if (!aadharRegex.test(aadhar)) {
        alert("Please enter a valid 12-digit Aadhaar number.");
        return false;
    }

    // Donation Amount Validation (Minimum 1000)
    if (amount === "" || parseInt(amount) < 1000) {
        alert("Donation amount must be ₹1000 or more.");
        return false;
    }

    // Support Selection Validation
    if (supportTo === "") {
        alert("Please select a cause to support.");
        return false;
    }

    // Payment Method Validation
    if (payment === "") {
        alert("Please select a payment method.");
        return false;
    }

    return true; // Submit form if everything is valid
}

function setAmount(value) {
    document.getElementById("amount").value = value;
}

function completdonation(){
    window.location.href="registration.html";
}
document.getElementById("donationForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        mo_no: document.getElementById("Mo-no").value,
        email: document.getElementById("email").value,
        aadhar: document.getElementById("aadhar").value,
        amount: document.getElementById("amount").value,
        supportTo: document.getElementById("supportTo").value,
        payment: document.getElementById("payment").value
    };

    console.log("📤 Sending Data:", formData);  // Debugging

    fetch("http://localhost:5000/donate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Response from Server:", data);
        alert(data.message);
    })
    .catch(error => {
        console.error("❌ Error:", error);
        alert("Failed to send donation.");
    });
});
