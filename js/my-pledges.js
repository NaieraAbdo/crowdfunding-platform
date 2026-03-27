const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "login.html";
}

async function loadMyPledges(){

    const pledges = await getData(`pledges?userId=${user.id}`);
    const campaigns = await getData("campaigns");
    const container = document.getElementById("pledgesContainer");

    if(pledges.length === 0){
        container.innerHTML = "<p style='text-align:center;'>No pledges yet</p>";
        return;
    }

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Campaign</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${pledges.map(p => {

                    const campaign = campaigns.find(c => c.id == p.campaignId);

                    return `
                        <tr>
                            <td>${campaign ? campaign.title : "Deleted"}</td>
                            <td>$${p.amount}</td>
                        </tr>
                    `;
                }).join("")}
            </tbody>
        </table>
    `;
}

loadMyPledges();