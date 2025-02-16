document.addEventListener("DOMContentLoaded", function () {
    const textElement = document.querySelector(".typewriter-text");
    const texts = ["HOPE", "EDUCATION"]; // First "HOPE", then replace with "EDUCATION"
    
    function typeWriter(text, callback) {
        let charIndex = 0;
        textElement.innerHTML = ""; // Clear previous text
        textElement.style.opacity = 1; // Ensure visibility before typing

        function type() {
            if (charIndex < text.length) {
                textElement.innerHTML += text.charAt(charIndex);
                charIndex++;
                setTimeout(type, 100); // Adjust speed here
            } else {
                setTimeout(callback, 2000); // Extended pause before fading out
            }
        }

        type();
    }

    function fadeOutAndReplace(callback) {
        textElement.style.transition = "opacity 1s ease-out"; // Smooth fade-out
        textElement.style.opacity = 0; 
        
        setTimeout(() => {
            textElement.innerHTML = ""; // Clear text after fade-out
            callback();
        }, 1000); // Wait for fade-out animation to complete
    }

    typeWriter(texts[0], function () {
        fadeOutAndReplace(() => {
            typeWriter(texts[1], function () {
                console.log("Animation Completed!");
            });
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const locationData = {
        "Delhi": { 
            info: "Capital of India, known for its rich history and vibrant culture.", 
            images: ["content/kidschool.jpg"]
        },
        "Mumbai": { 
            info: "Financial hub, home to Bollywood and famous beaches.", 
            images: ["content/gift.jpg"]
        },
        "Bangalore": { 
            info: "IT Hub of India, known for its pleasant weather.", 
            images: ["content/happboys.jpg"]
        },
        "Jaipur": { 
            info: "Pink City, famous for its historic palaces and forts.", 
            images: ["content/help.jpg"]
        }
    };

    document.querySelectorAll(".location-dot").forEach(dot => {
        dot.addEventListener("mouseover", function() {
            const location = this.getAttribute("data-info").split(" - ")[0]; // Extract city name
            const infoBox = document.getElementById("infoBox");
            const locationName = document.getElementById("location-name");
            const locationInfo = document.getElementById("location-info");
            const locationImage = document.getElementById("location-image");

            if (locationData[location]) {
                locationName.textContent = location;
                locationInfo.textContent = locationData[location].info;
                
                // Randomly select an image from the array
                const images = locationData[location].images;
                const randomImage = images[Math.floor(Math.random() * images.length)];
                
                locationImage.src = randomImage;
                locationImage.style.display = "block"; // Show image

                // If image fails to load, use a default placeholder
                locationImage.onerror = function () {
                    locationImage.src = "content/placeholder.jpg"; // Fallback image
                };
            }

            infoBox.style.display = "block";
        });

        dot.addEventListener("mouseout", function() {
            document.getElementById("infoBox").style.display = "none";
        });
    });
});



        function payWithRazorpay() {
            let amount = document.getElementById("amount").value * 100;
            let options = {
                key: "YOUR_RAZORPAY_KEY",
                amount: amount,
                currency: "INR",
                name: "Child Help Foundation",
                description: "Donation",
                image: "logo.png",
                handler: function (response) {
                    alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
                }
            };
            let rzp = new Razorpay(options);
            rzp.open();
        }