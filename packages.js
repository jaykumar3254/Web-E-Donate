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

document.addEventListener("DOMContentLoaded", () => {
    // Create cart modal
    const cartModal = document.createElement('div');
    cartModal.className = 'cart-modal';
    cartModal.innerHTML = `
        <div class="cart-header">
            <h3>Shopping Cart</h3>
            <button class="close-cart">×</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-total"></div>
    `;
    document.body.appendChild(cartModal);

    // Cart button click handler
    const cartBtn = document.querySelector('.add-logo-btn');
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
        fetchCartItems();
    });

    // Close cart modal
    cartModal.querySelector('.close-cart').addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    document.querySelectorAll('.product-card').forEach(productCard => {
        const productId = productCard.getAttribute('data-product');
        const addButton = productCard.querySelector('.add-btn');
        const quantityControls = productCard.querySelector('.quantity-controls');
        const quantityValue = productCard.querySelector('.quantity-value');

        quantityControls.style.display = "none";

        addButton.addEventListener('click', async () => {
            quantities[productId] = 1;
            quantityValue.textContent = quantities[productId];
            quantityControls.style.display = "flex";
            addButton.style.display = "none";
            updateTotalAmount();

            const productName = productCard.querySelector('.product-title').textContent;
            await addToCart(productId, productName, quantities[productId], prices[productId]);
        });

        productCard.querySelector('.quantity-btn:nth-child(3)').addEventListener('click', async () => {
            quantities[productId]++;
            quantityValue.textContent = quantities[productId];
            updateTotalAmount();
            
            const productName = productCard.querySelector('.product-title').textContent;
            await addToCart(productId, productName, quantities[productId], prices[productId]);
        });

        productCard.querySelector('.quantity-btn:first-child').addEventListener('click', async () => {
            if (quantities[productId] > 1) {
                quantities[productId]--;
                quantityValue.textContent = quantities[productId];
            } else {
                quantities[productId] = 0;
                quantityControls.style.display = "none";
                addButton.style.display = "block";
            }
            updateTotalAmount();
        });
    });

    // Carousel Code
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.slide');
    const indicatorsContainer = document.querySelector('.indicators');
    let currentSlide = 0;
    const slideCount = slides.length;
    let isTransitioning = false;

    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            if (!isTransitioning) goToSlide(index);
        });
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.indicator');

    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-nav prev';
    prevButton.innerHTML = '❮';
    prevButton.addEventListener('click', () => {
        if (!isTransitioning) prevSlide();
    });

    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-nav next';
    nextButton.innerHTML = '❯';
    nextButton.addEventListener('click', () => {
        if (!isTransitioning) nextSlide();
    });

    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.appendChild(prevButton);
    carouselContainer.appendChild(nextButton);

    function updateSlide() {
        isTransitioning = true;
        carousel.style.transition = 'transform 0.8s ease';
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlide();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlide();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlide();
    }

    let slideInterval = setInterval(nextSlide, 5000);

    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));

    // MongoDB Cart Functions
    async function addToCart(productId, productName, quantity, price) {
        try {
            const response = await fetch('http://localhost:3000/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, productName, quantity, price, totalPrice: quantity * price }),
            });

            if (!response.ok) throw new Error('Failed to add item to cart');

            showNotification('Item added to cart');
        } catch (error) {
            showNotification('Failed to add item to cart: ' + error.message, 'error');
        }
    }

    async function fetchCartItems() {
        try {
            const response = await fetch('http://localhost:3000/api/cart');
            const items = await response.json();
            
            const cartItemsContainer = document.querySelector('.cart-items');
            const cartTotal = document.querySelector('.cart-total');

            cartItemsContainer.innerHTML = items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <span>${item.productName}</span>
                        <span>₹${item.totalPrice}</span>
                    </div>
                    <div class="cart-item-details">
                        Quantity: ${item.quantity} × ₹${item.price}
                    </div>
                    <button onclick="removeFromCart('${item._id}')" class="remove-btn">
                        Remove
                    </button>
                </div>
            `).join('');

            const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
            cartTotal.innerHTML = `<strong>Total: ₹${total}</strong>`;
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    async function removeFromCart(itemId) {
        try {
            const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to remove item');

            fetchCartItems();
            showNotification('Item removed from cart');
        } catch (error) {
            showNotification('Failed to remove item', 'error');
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    function updateTotalAmount() {
        totalAmount = Object.keys(quantities).reduce((sum, productId) => sum + (quantities[productId] * prices[productId]), 0);
        document.querySelector('.amount-header span:last-child').textContent = `₹ ${totalAmount}`;
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const infoContainer = document.querySelector(".info-container");
  
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.4 } 
    );
  
    observer.observe(infoContainer);
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const infoContainer = document.querySelector(".container");
  
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.4 } 
    );
  
    observer.observe(infoContainer);
  });

  document.addEventListener("DOMContentLoaded", function () {
    const infoContainer = document.querySelector(".add-logo-btn");
  
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.4 } 
    );
  
    observer.observe(infoContainer);
  });
  

  document.addEventListener("DOMContentLoaded", function () {
    const infoContainer = document.querySelector(".donation-panel");
  
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.4 } 
    );
  
    observer.observe(infoContainer);
  });


