document.addEventListener("DOMContentLoaded", function() {
    const textElement = document.querySelector(".typewriter-text");
    const text = "Every Child Deserves a Future";

    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            textElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    }

    typeWriter();
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