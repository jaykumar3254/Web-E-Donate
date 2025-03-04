/* script.js */
function setAmount(value) {
    document.getElementById("amount").value = value;
    updateSummary();
}

function setFrequency(type) {
    document.getElementById("one-time").classList.remove("active");
    document.getElementById("recurring").classList.remove("active");
    document.getElementById(type).classList.add("active");
}

function updateTip() {
    let tip = document.getElementById("tip").value;
    document.getElementById("tipValue").textContent = tip + "%";
    updateSummary();
}

function updateSummary() {
    let amount = parseFloat(document.getElementById("amount").value) || 0;
    let tipPercentage = parseFloat(document.getElementById("tip").value) || 0;
    let platformFee = (amount * 0.05).toFixed(2);
    let tipAmount = ((tipPercentage / 100) * amount).toFixed(2);
    let totalAmount = (amount + parseFloat(platformFee) + parseFloat(tipAmount)).toFixed(2);
    
    document.getElementById("donation").textContent = amount;
    document.getElementById("platformFee").textContent = platformFee;
    document.getElementById("total").textContent = totalAmount;
    
    let donateBtn = document.getElementById("donateBtn");
    donateBtn.textContent = `Donate now (₹ ${totalAmount})`;
    donateBtn.classList.toggle("active", totalAmount > 0);
}

function payNow() {
    let totalAmount = parseFloat(document.getElementById("total").textContent);
    if (totalAmount <= 0) {
        alert("Please enter a valid donation amount.");
        return;
    }

    // Show Personal Details Card After Clicking Donate
    document.getElementById("personalDetailsCard").classList.remove("hidden");

    var options = {
        "key": "YOUR_RAZORPAY_KEY", // Replace with your Razorpay Key
        "amount": totalAmount * 100,
        "currency": "INR",
        "name": "NGO Donation",
        "description": "Donation for a cause",
        "handler": function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        },
        "theme": {
            "color": "#28a745"
        }
    };
    var rzp = new Razorpay(options);
    rzp.open();
}

function togglePAN() {
    const panSection = document.getElementById("pan-section");
    panSection.classList.toggle("hidden");
}
