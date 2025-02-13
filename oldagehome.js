const heartContainer = document.querySelector('.heart-container');

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