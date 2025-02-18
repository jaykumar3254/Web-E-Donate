let totalAmount = 0;

const quantities = {
    foodPackets: 0,
    birthdayCake: 0,
    birthdayParty: 0,
    cakeAndFood: 0
};

const prices = {
    foodPackets: 35,
    birthdayCake: 300,
    birthdayParty: 700,
    cakeAndFood: 1000
};

function updateQuantityDisplay(productId) {
    const productCard = document.querySelector(`[data-product="${productId}"]`);
    const quantityElement = productCard.querySelector('.quantity-value');
    const quantityControls = productCard.querySelector('.quantity-controls');
    const addButton = productCard.querySelector('.add-btn');

    if (quantities[productId] === 0) {
        quantityControls.style.display = 'none';
        addButton.style.display = 'block';
    } else {
        quantityControls.style.display = 'flex';
        addButton.style.display = 'none';
        quantityElement.textContent = quantities[productId];
    }
}

function updateTotalAmount() {
    totalAmount = Object.keys(quantities).reduce((sum, productId) => {
        return sum + (quantities[productId] * prices[productId]);
    }, 0);

    document.querySelector('.amount-header span:last-child').textContent = `₹ ${totalAmount}`;
}

function handleQuantityChange(productId, increment) {
    if (increment) {
        quantities[productId]++;
    } else {
        quantities[productId] = Math.max(0, quantities[productId] - 1);
    }

    updateQuantityDisplay(productId);
    updateTotalAmount();
}

document.addEventListener("DOMContentLoaded", () => {
    // Product card initialization
    document.querySelectorAll('.product-card').forEach(productCard => {
        const productId = productCard.getAttribute('data-product');
        const addButton = productCard.querySelector('.add-btn');

        addButton.addEventListener('click', () => {
            quantities[productId] = 1;
            updateQuantityDisplay(productId);
            updateTotalAmount();
        });

        updateQuantityDisplay(productId);
    });

    // Carousel initialization
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.slide');
    const indicatorsContainer = document.querySelector('.indicators');
    let currentSlide = 0;
    const slideCount = slides.length;

    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.indicator');

    function updateSlide() {
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlide();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlide();
    }

    // Auto advance slides every 3 seconds
    setInterval(nextSlide, 3000);
});