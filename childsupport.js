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
    document.querySelectorAll('.red-dot').forEach(dot => {
        dot.addEventListener('mouseenter', function() {
            let infoBox = this.querySelector('.infobox');
            infoBox.style.display = 'block';
        });
    
        dot.addEventListener('mouseleave', function() {
            let infoBox = this.querySelector('.infobox');
            infoBox.style.display = 'none';
        });
    });
    
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

document.addEventListener("DOMContentLoaded", function () {
    const textElement = document.querySelector(".typewriter-text");
    const missionSection = document.getElementById("mission");

    function checkScroll() {
        const sectionPosition = missionSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (sectionPosition < screenPosition) {
            missionSection.classList.add("visible");
            typeWriter("Our aim is to fill dots of hope");
            window.removeEventListener("scroll", checkScroll); // Ensure animation runs only once
        }
    }

    function typeWriter(text) {
        let charIndex = 0;
        textElement.style.width = "100%"; // Enable full-width effect
        textElement.innerHTML = ""; // Clear text

        function type1() {
            if (charIndex < text.length) {
                textElement.innerHTML += text.charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            }
        }
        type1();
    }

    window.addEventListener("scroll", checkScroll);
});


function validateEmail() {
    const email = document.getElementById("email").value;
    const errorMessage = document.getElementById("error-message");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailPattern.test(email)) {
        alert("Subscription successful!");
        errorMessage.textContent = "";
    } else {
        errorMessage.textContent = "Please enter a valid email address.";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const dotContainer = document.getElementById("floating-dots");
    const dotCount = 30; // Number of dots
    let dots = [];

    // Create dots randomly around the map
    for (let i = 0; i < dotCount; i++) {
        let dot = document.createElement("div");
        dot.classList.add("floating-dot");
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.left = `${Math.random() * 100}%`;
        dotContainer.appendChild(dot);
        dots.push(dot);
    }

    // Move dots slightly in cursor direction
    document.addEventListener("mousemove", (event) => {
        const { clientX, clientY } = event;

        dots.forEach(dot => {
            let xMove = (Math.random() * 2 - 1) * 5; // Random small movement
            let yMove = (Math.random() * 2 - 1) * 5;

            dot.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const scrollText = document.querySelector(".scroll-text");
    const impactSection = document.querySelector(".impact-section");
    const newsletter = document.querySelector(".newsletter");

    function handleScroll() {
        let impactPosition = impactSection.getBoundingClientRect().top;
        let newsletterPosition = newsletter.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;

        console.log("Impact Position:", impactPosition);

        // Trigger text earlier
        if (impactPosition < windowHeight * 0.9) {
            scrollText.style.opacity = "1"; 
            scrollText.style.transform = "translateX(0)";
        } else {
            scrollText.style.opacity = "0";
            scrollText.style.transform = "translateX(-100%)";
        }

        // Fade out before newsletter
        if (newsletterPosition < windowHeight * 0.6) {
            scrollText.style.opacity = "0";
        }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();
});

