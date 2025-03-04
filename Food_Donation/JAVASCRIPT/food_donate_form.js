document.getElementById("donation-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        foodType: document.getElementById("food-type").value,
        quantity: document.getElementById("quantity").value,
        expiryTime: document.getElementById("expiry-time").value,
        pickupTime: document.getElementById("pickup-time").value,
        foodCondition: document.getElementById("food-condition").value,
        storageCondition: document.getElementById("storage-condition").value,
        location: document.getElementById("location").value,
        notes: document.getElementById("notes").value,
    };

    try {
        const response = await fetch("http://localhost:5000/donate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        alert(result.message || "Donation submitted successfully!");
        this.reset();
    } catch (error) {
        alert("Error submitting donation. Try again!");
        console.error(error);
    }
});
