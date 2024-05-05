const apiLogin = "https://v2.api.noroff.dev/auth/login";

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector(".login-cta");

    loginButton.addEventListener("click", async () => {
        const email = document.getElementById("login-form-name").value;
        const password = document.getElementById("login-form-password").value;

        try {
            const response = await fetch(apiLogin, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok && data.data && data.data.accessToken) {
                localStorage.setItem(`bearerToken_${data.data.name}`, data.data.accessToken);
                localStorage.setItem('currentUser', data.data.name);
                window.location.href = "/post/edit.html"; 
            } else {
                console.error("Failed to retrieve access token:", data);
                alert("Login failed. Please check your credentials and try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});
