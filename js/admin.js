const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
    window.location.href = "login.html";
}

function showSection(section) {

    document.getElementById("usersSection").style.display = "none";
    document.getElementById("campaignsSection").style.display = "none";
    document.getElementById("pledgesSection").style.display = "none";

    if (section === "users") {
        document.getElementById("usersSection").style.display = "block";
    }

    if (section === "campaigns") {
        document.getElementById("campaignsSection").style.display = "block";
        loadCampaigns();
    }

    if (section === "pledges") {
        document.getElementById("pledgesSection").style.display = "block";
        loadPledges();
    }
}

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("user");
    window.location.href = "login.html";
});

async function loadUsers() {

    const users = await getData("users");

    const container = document.getElementById("usersTable");

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                       <td>
    ${user.role !== "admin" ? `
        <button onclick="toggleBan('${user.id}', ${user.isActive})">
            ${user.isActive ? "Ban" : "Unban"}
        </button>
    ` : `<span>---</span>`}
</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}
async function toggleBan(id, currentStatus) {

    await updateData("users", id, {
        isActive: !currentStatus
    });

    loadUsers();
}
loadUsers();

async function loadCampaigns() {

    const campaigns = await getData("campaigns");

    const container = document.getElementById("campaignsTable");

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Goal</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${campaigns.map(c => `
                    <tr>
                        <td>${c.title}</td>
                        <td>$${c.goal}</td>
                        <td>${c.isApproved ? "Approved" : "Pending"}</td>
                        <td>
                            ${!c.isApproved ? `
                                <button onclick="approveCampaign('${c.id}')">Approve</button>
                                <button onclick="deleteCampaign('${c.id}')">Delete</button>
                            ` : `<span>---</span>`}
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

async function approveCampaign(id) {

    await updateData("campaigns", id, {
        isApproved: true
    });

    loadCampaigns();
}


async function loadPledges() {

    const pledges = await getData("pledges");
    const users = await getData("users");
    const campaigns = await getData("campaigns");

    const container = document.getElementById("pledgesTable");

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Campaign</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${pledges.map(p => {
        const user = users.find(u => u.id == p.userId);
        const campaign = campaigns.find(c => c.id == p.campaignId);

        return `
                 <tr>
                     <td>${user ? user.name : "Unknown"}</td>
                    <td>${campaign ? campaign.title : "Deleted Campaign"}</td>
                    <td>$${p.amount}</td>
                </tr>
                `;
    }).join("")}
            </tbody>
        </table>
    `;
}