const container = document.getElementById("campaignDetails");
const form = document.getElementById("pledgeForm");

const params = new URLSearchParams(window.location.search);
const campaignId = params.get("id");

async function loadCampaign() {

    const campaign = await getData(`campaigns/${campaignId}`);
    const pledges = await getData(`pledges?campaignId=${campaignId}`);l
    const total = pledges.reduce((sum, p) => sum + Number(p.amount), 0);
    const progress = Math.min((total / campaign.goal) * 100, 100);
    const supporters = pledges.length;

    container.innerHTML = `
        <img src="${campaign.image || 'https://picsum.photos/800/400'}" class="details-img">

        <h2>${campaign.title}</h2>

        <p class="desc">${campaign.description}</p>

        <div class="info">
            <span>Goal: $${campaign.goal}</span>
            <span>Raised: $${total}</span>
            <span>${Math.floor(progress)}% funded</span>
            <span>${supporters} supporters</span>
        </div>

        <div class="progress">
            <div class="progress-bar" style="width:${progress}%"></div>
        </div>

        ${total === 0 ? "<p>No supporters yet</p>" : ""}
        ${progress === 100 ? "<p style='color:green;'>Fully Funded </p>" : ""}
    `;
}

loadCampaign();

// donate
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }
    const campaign = await getData(`campaigns/${campaignId}`);
    const pledges = await getData(`pledges?campaignId=${campaignId}`);

    const total = pledges.reduce((sum, p) => sum + Number(p.amount), 0);
    if (total >= campaign.goal) {
        alert("This campaign is already fully funded ");
        return;
    }

    const newPledge = {
        campaignId: campaignId,
        userId: user.id,
        amount: amount
    };

    await postData("pledges", newPledge);
    alert("Thank you for supporting!");
    loadCampaign();
    form.reset();
});