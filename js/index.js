const container = document.getElementById("featuredContainer");

async function loadFeatured() {

    const campaigns = await getData("campaigns?isApproved=true");
    const featured = campaigns.slice(0, 3);

    for (const campaign of featured) {
        const pledges = await getData(`pledges?campaignId=${campaign.id}`);
        const total = pledges.reduce((sum, p) => sum + Number(p.amount), 0);
        const progress = Math.min(Math.floor((total / campaign.goal) * 100), 100);

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${campaign.image || 'https://picsum.photos/300/200'}">

            <h3>${campaign.title}</h3>

            <p>$${total} raised of $${campaign.goal}</p>

            <div class="progress">
                <div class="progress-bar" style="width:${progress}%"></div>
            </div>

            ${progress === 100 ? "<p style='color:green;'>Fully Funded </p>" : ""}

            <button onclick="window.location.href='campaign-details.html?id=${campaign.id}'">
                Donate
            </button>
        `;

        container.appendChild(card);
    }
}
loadFeatured();

const createBtn = document.getElementById("createBtn");

createBtn.addEventListener("click", function () {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        window.location.href = "create-campaign.html";
    } else {
        alert("Please login first");
        window.location.href = "login.html?redirect=create-campaign.html";
    }

});