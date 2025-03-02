const mask = document.querySelector('.mask');
const newBg = document.querySelector('.new-bg');
const circleFade = document.querySelector('.circle-fade');
const topImage = document.querySelector('.top-image');
let isRevealed = false;

document.addEventListener('mousemove', (e) => {
    if (!isRevealed) {
        const x = e.clientX + 'px';
        const y = e.clientY + 'px';
        mask.style.setProperty('--x', x);
        mask.style.setProperty('--y', y);
    }
});

function revealNewBackground(event) {
    isRevealed = true; // Stop mouse reveal effect
    mask.classList.add('full-reveal'); // Fully reveal background
    
    // Get button click position
    const x = event.clientX;
    const y = event.clientY;

    // Move the circular fade effect to button position
    circleFade.style.left = `${x}px`;
    circleFade.style.top = `${y}px`;

    // Make image3 (new background) visible before effect
    newBg.style.opacity = 1;

    // Expand the circular fade effect
    circleFade.classList.add('expand');

    // Hide the old images after transition
    setTimeout(() => {
        topImage.style.opacity = 0;
        mask.style.opacity = 0;
    }, 1200); // Sync with circular effect
}

// Function to close the form
function closeForm() {
    document.getElementById("registrationForm").classList.add("hidden");
}

// Show the form after 2 seconds (or trigger via a button)
setTimeout(() => {
    document.getElementById("registrationForm").classList.remove("hidden");
}, 2000);
