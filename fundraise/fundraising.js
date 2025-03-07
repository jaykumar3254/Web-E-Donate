document.getElementById("fundraising-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append("ngo_name", document.getElementById("ngo_name").value);
    formData.append("reason", document.getElementById("reason").value);
    formData.append("image", document.getElementById("image").files[0]);
    formData.append("target_amount", document.getElementById("target_amount").value);
    try {
        let response = await fetch("http://127.0.0.1:5000/submit_fundraiser", { method: "POST", body: formData });
        let result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit.");
    }
});