
const form = document.getElementById("registerForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // check if email exists
    const existing = await getData(`users?email=${email}`);

    if (existing.length > 0) {
        alert("Email already exists");
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }
    if (!email.includes("@")) {
        alert("Invalid email format");
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password,
        role: "user",
        isActive: true
    };

    await postData("users", newUser);

    alert("Account created successfully!");
    localStorage.setItem("user", JSON.stringify(newUser));

// redirect
window.location.href = "index.html";

    // window.location.href = "login.html";
});
