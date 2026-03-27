
const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // لأن json-server أحيانًا بيرجع نتيجة غلط أو فاضية بسبب encoding أو spaces
    // فكان ده سبب إن الأدمن مش بيتعرف عليه رغم إنه موجود
    // الحل: نجيب كل اليوزرز ونفلتر بإيدنا

    const users = await getData("users");

    const user = users.find(u =>
        u.email === email && u.password === password
    );

    if (user) {
    if(user.isActive === false){
        alert("Your account has been banned");
        return;
    }
        localStorage.setItem("user", JSON.stringify(user));

        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");

        if (user.role === "admin") {
            window.location.href = "admin.html";
        } else {
            if (redirect) {
                window.location.href = redirect;
            } else {
                window.location.href = "index.html";
            }
        }

    } else {
        alert("Invalid email or password");
    }
});
