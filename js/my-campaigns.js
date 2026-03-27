const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "login.html";
}

let currentId = null;

async function loadMyCampaigns(){

    const campaigns = await getData(`campaigns?creatorId=${user.id}`);
    const container = document.getElementById("myCampaignsContainer");

    if(campaigns.length === 0){
        container.innerHTML = "<p style='text-align:center;'>No campaigns yet</p>";
        return;
    }
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
                            ${c.isApproved ? `
                                <span>Locked</span>
                            ` : `
                                <button onclick="openEdit('${c.id}')">Edit</button>
                                <button onclick="deleteCampaign('${c.id}')">Delete</button>
                            `}
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

async function deleteCampaign(id){

    if(confirm("Are you sure?")){
        await deleteData("campaigns", id);
        loadMyCampaigns();
    }
}

async function openEdit(id){

    currentId = id;
    const campaign = await getData(`campaigns/${id}`);

    document.getElementById("editTitle").value = campaign.title;
    document.getElementById("editGoal").value = campaign.goal;
    document.getElementById("editDeadline").value = campaign.deadline;

    document.getElementById("editModal").style.display = "flex";
}

async function saveEdit(){

    const title = document.getElementById("editTitle").value;
    const goal = document.getElementById("editGoal").value;
    const deadline = document.getElementById("editDeadline").value;

    await updateData("campaigns", currentId, {
        title,
        goal,
        deadline
    });

    closeModal();
    loadMyCampaigns();
}

function closeModal(){
    document.getElementById("editModal").style.display = "none";
}
loadMyCampaigns();