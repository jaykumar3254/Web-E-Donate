async function fetchFundraisers() {
    let response = await fetch("http://127.0.0.1:5000/get_fundraisers");
    let fundraisers = await response.json();
    let container = document.getElementById("cards-container");
    fundraisers.forEach(fund => {
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<h3>${fund.ngo_name}</h3><p>${fund.reason}</p><img src="static/${fund.image}" width="100%"><p>₹${fund.target_amount}</p>`;
        container.appendChild(card);
    });
}
fetchFundraisers();
