      let slideIndex = 0;
        function showSlides() {
            let slides = document.getElementsByClassName("slide");
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slideIndex++;
            if (slideIndex > slides.length) { slideIndex = 1; }
            slides[slideIndex - 1].style.display = "block";
            setTimeout(showSlides, 3000);
        }
        document.addEventListener("DOMContentLoaded", showSlides);

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