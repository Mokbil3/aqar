// Adjust this if your backend runs somewhere other than localhost:5000
const API_BASE = "https://aqar-production-b2a2.up.railway.app/api"; 
function showMessage(text, type) {
    const el = document.getElementById("message");
    el.textContent = text;
    el.className = `message ${type}`;
}

function saveSession(token, user) {
    localStorage.setItem("aqar_token", token);
    localStorage.setItem("aqar_user", JSON.stringify(user));
}

function setupLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const button = form.querySelector("button");

        button.disabled = true;
        showMessage("", "");

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
                saveSession(data.token, data.user);
                showMessage("Login successful — redirecting…", "success");
                setTimeout(() => { window.location.href = "index.html"; }, 1000);
            } else {
                showMessage(data.message || data.error || "Login failed", "error");
                button.disabled = false;
            }
        } catch (error) {
            console.error(error);
            showMessage("Unable to connect to server", "error");
            button.disabled = false;
        }
    });
}

function setupRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const first_name = document.getElementById("first_name").value;
        const last_name = document.getElementById("last_name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const button = form.querySelector("button");

        button.disabled = true;
        showMessage("", "");

        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ first_name, last_name, email, password })
            });

            const data = await res.json();

            if (data.success) {
                saveSession(data.token, data.user);
                showMessage("Account created — redirecting…", "success");
                setTimeout(() => { window.location.href = "index.html"; }, 1000);
            } else {
                showMessage(data.message || data.error || "Registration failed", "error");
                button.disabled = false;
            }
        } catch (error) {
            console.error(error);
            showMessage("Unable to connect to server", "error");
            button.disabled = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupLoginForm();
    setupRegisterForm();
});
