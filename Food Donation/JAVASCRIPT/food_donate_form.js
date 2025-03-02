// Initialize Google Maps API
function initMap() {
    const input = document.getElementById("location");
    const autocomplete = new google.maps.places.Autocomplete(input);
}

// Get User's Current Location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const locationInput = document.getElementById("location");

                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        locationInput.value = results[0].formatted_address;
                    } else {
                        alert("Unable to retrieve location. Please enter manually.");
                    }
                });
            },
            () => alert("Error getting location. Please enter manually.")
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Form Submission
document.getElementById("donation-form").addEventListener("submit", function (e) {
    e.preventDefault();
    showAlert("Donation submitted successfully! ❤️", "success");
    document.getElementById("donation-form").reset();
});

// Alert Messages
function showAlert(message, type) {
    const alertBox = document.createElement("div");
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
}
