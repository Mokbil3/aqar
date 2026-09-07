function renderNavAuth() {
    const container = document.getElementById("nav-auth");
    if (!container) return;

    const rawUser = localStorage.getItem("aqar_user");

    if (!rawUser) {
        container.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
        return;
    }

    let user;
    try {
        user = JSON.parse(rawUser);
    } catch (error) {
        // Corrupted session data — treat as logged out
        localStorage.removeItem("aqar_user");
        localStorage.removeItem("aqar_token");
        renderNavAuth();
        return;
    }

    container.innerHTML = `
        <span class="nav-greeting">Hi, ${user.first_name}</span>
        <a href="add-property.html">List a property</a>
        <a href="dashboard.html">Dashboard</a>
        <a href="#" id="logout-link">Logout</a>
    `;

    document.getElementById("logout-link").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("aqar_user");
        localStorage.removeItem("aqar_token");
        window.location.href = "index.html";
    });
}

document.addEventListener("DOMContentLoaded", renderNavAuth);
