const donationInputs = document.querySelectorAll('.donation-input');
    const totalCount = document.getElementById('total-count');
    
    donationInputs.forEach(input => {
      input.addEventListener('input', updateTotal);
    });
    
    function updateTotal() {
      let total = 0;
      donationInputs.forEach(input => {
        total += parseInt(input.value) || 0;
      });
      totalCount.textContent = total;
      
      // Animate total count
      totalCount.style.transform = 'scale(1.2)';
      setTimeout(() => {
        totalCount.style.transform = 'scale(1)';
      }, 200);
    }
    
    // Form validation
    function validateForm() {
      let isValid = true;
      
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const address = document.getElementById('address');
      
      // Reset errors
      document.querySelectorAll('.error-message').forEach(err => err.style.display = 'none');
      
      if (!name.value.trim()) {
        document.getElementById('name-error').style.display = 'block';
        isValid = false;
      }
      
      if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
      }
      
      if (!phone.value.match(/^\d{10}$/)) {
        document.getElementById('phone-error').style.display = 'block';
        isValid = false;
      }
      
      if (!address.value.trim()) {
        document.getElementById('address-error').style.display = 'block';
        isValid = false;
      }
      
      return isValid;
    }
    
    // Confetti animation
    function createConfetti() {
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        document.body.appendChild(confetti);
        
        const colors = ['#ff3333', '#ff6666', '#ff9999', '#ffcccc'];
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const startX = Math.random() * window.innerWidth;
        const startY = -10;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = window.innerHeight + 10;
        
        confetti.style.left = startX + 'px';
        confetti.style.top = startY + 'px';
        
        const animation = confetti.animate([
          { transform: `translate(0, 0) rotate(0deg)` },
          { transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(720deg)` }
        ], {
          duration: 2000 + Math.random() * 1000,
          easing: 'cubic-bezier(.25,.46,.45,.94)'
        });
        
        animation.onfinish = () => confetti.remove();
      }
    }
    
    // Form submission
    function submitForm() {
      if (!validateForm()) return;
      
      // Show success message
      const successMessage = document.getElementById('success-message');
      successMessage.style.right = '20px';
      
      // Create confetti effect
      createConfetti();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        successMessage.style.right = '-300px';
      }, 3000);
      
      // Reset form
      document.querySelectorAll('input').forEach(input => input.value = '');
      updateTotal();
    }
    
    // Animate cards on scroll
    const cards = document.querySelectorAll('.donation-card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    });
    
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      observer.observe(card);
    });