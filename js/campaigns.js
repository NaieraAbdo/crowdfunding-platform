const container = document.getElementById("campaignsContainer");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

let allCampaigns = [];

async function loadCampaigns() {

    allCampaigns = await getData("campaigns?isApproved=true");
    displayCampaigns(allCampaigns);
}

async function displayCampaigns(campaigns) {

    container.innerHTML = "";
    for (const campaign of campaigns) {
        const pledges = await getData(`pledges?campaignId=${campaign.id}`);
        const total = pledges.reduce((sum, p) => sum + Number(p.amount), 0);
        const progress = Math.min(Math.floor((total / campaign.goal) * 100), 100);
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <img src="${campaign.image || 'https://picsum.photos/300/200'}">

        <div class="card-content">

            <h3 title="${campaign.title}">
                ${campaign.title.length > 40 ? campaign.title.substring(0, 40) + "..." : campaign.title}
            </h3>

            <div class="meta">
                <span>Goal: $${campaign.goal}</span>
                <span class="percent">${progress}%</span>
            </div>

            <div class="progress">
                <div class="progress-bar" style="width:${progress}%"></div>
            </div>

            ${progress === 100 ? "<p style='color:green;'>Fully Funded 🎉</p>" : ""}

            <button onclick="window.location.href='campaign-details.html?id=${campaign.id}'">
                View Details
            </button>
        </div>
        `;

        container.appendChild(card);
    }
}

function applyFilters() {

    let filtered = [...allCampaigns];
    const searchValue = searchInput.value.toLowerCase();

    filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchValue) ||
        c.description.toLowerCase().includes(searchValue)
    );

    const categoryValue = filterCategory.value;

    if (categoryValue !== "") {
        filtered = filtered.filter(c => c.category === categoryValue);
    }

    displayCampaigns(filtered);
}

// events
searchInput.addEventListener("input", applyFilters);
filterCategory.addEventListener("change", applyFilters);

loadCampaigns();