const form = document.getElementById("campaignForm");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

let imageBase64 = "";
imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";

            imageBase64 = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const goal = document.getElementById("goal").value;
    const deadline = document.getElementById("deadline").value;
    const category = document.getElementById("category").value; // 🟢

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("You must login first");
        window.location.href = "login.html";
        return;
    }
    if (!category) {
        alert("Please select a category");
        return;
    }

    const newCampaign = {
        title: title,
        description: description,
        goal: goal,
        deadline: deadline,
        image: imageBase64,
        category: category, 
        creatorId: user.id,
        isApproved: false
    };

    await postData("campaigns", newCampaign);
    alert("Campaign created! Waiting for admin approval");
    window.location.href = "campaigns.html";
});