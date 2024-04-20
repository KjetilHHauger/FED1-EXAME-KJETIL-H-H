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

            if (response.ok) {
                // Successful login
                window.location.href = "/post/edit.html";
            } else {
                // Unsuccessful login, display error message
                alert("Invalid email or password. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});
