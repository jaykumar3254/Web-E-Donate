document.addEventListener("DOMContentLoaded", async function() {
    let container = document.getElementById("fundraising-container");

    try {
        let response = await fetch("http://127.0.0.1:5000/get_fundraisers");
        let fundraisers = await response.json();

        fundraisers.forEach(fundraiser => {
            let card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h2>${fundraiser.ngo_name}</h2>
                <p>${fundraiser.reason}</p>
                <img src="static/${fundraiser.image}" alt="Fundraiser Image">
                <p><strong>Target:</strong> ₹${fundraiser.target_amount}</p>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching fundraisers:", error);
    }
});
