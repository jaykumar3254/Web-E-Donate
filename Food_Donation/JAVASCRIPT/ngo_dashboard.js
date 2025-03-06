document.addEventListener("DOMContentLoaded", fetchDonations);

async function fetchDonations() {
    const ngoId = localStorage.getItem("ngoId");
    
    if (!ngoId) {
        alert("Unauthorized access! Please log in.");
        window.location.href = "ngo_login_register.html"; // Redirect to login
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/donations`); // Fetch all donations
        const donations = await response.json();

        const donationList = document.getElementById("donation-list");
        donationList.innerHTML = ""; // Clear existing data

        let total = donations.length;
        let pending = donations.filter(d => d.status === "pending").length;
        let accepted = donations.filter(d => d.status === "accepted").length;

        document.getElementById("total-donations").innerText = total;
        document.getElementById("pending-donations").innerText = pending;
        document.getElementById("accepted-donations").innerText = accepted;

        donations.forEach((donation) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${donation.name}</td>
                <td>${donation.foodType}</td>
                <td>${donation.quantity}</td>
                <td>${donation.location}</td>
                <td>${new Date(donation.pickupTime).toLocaleString()}</td>
                <td>
                    ${donation.status === "pending" ? 
                        '<span style="color:orange">Pending</span>' : 
                        '<span style="color:green">Accepted</span>'}
                </td>
                <td>
                    ${donation.status === "pending" ? 
                        `<button onclick="acceptDonation(${donation.id})">Accept</button>` :
                        `<span>✔️ Accepted</span>`
                    }
                </td>
            `;

            donationList.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching donations:", error);
    }
}

async function acceptDonation(donationId) {
    const ngoId = localStorage.getItem("ngoId");

    if (!ngoId) {
        alert("Unauthorized access! Please log in.");
        window.location.href = "ngo_login_register.html"; 
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/donations/${donationId}/accept/${ngoId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            fetchDonations(); // Refresh list
        } else {
            const data = await response.json();
            alert(data.error || "Failed to accept donation.");
        }
    } catch (error) {
        console.error("Error accepting donation:", error);
    }
}
