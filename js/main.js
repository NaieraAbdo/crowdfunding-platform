document.addEventListener("DOMContentLoaded", function () {

    const authArea = document.getElementById("authArea");
    const toast = document.getElementById("toast");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (currentUser) {
       authArea.innerHTML = `
    <span class="welcome">Hi, ${currentUser.name}</span>
    <button id="logoutBtn" class="logout-btn">Logout</button>
`;

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                alert("Logged out successfully");
                localStorage.removeItem("user");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            });
        }

    } else {
        authArea.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }

});


window.addEventListener("scroll", function () {

    const nav = document.querySelector("nav");

    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }

});

function handleCreateCampaign(){
    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
        window.location.href = "login.html?redirect=create-campaign.html";
    }else{
        window.location.href = "create-campaign.html";
    }
}