function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById('register-form-name').value;
    const email = document.getElementById('register-form-email').value;
    const password = document.getElementById('register-form-password').value;
    const confirmPassword = document.getElementById('register-form-confirm').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long!');
        return;
    }

    const payload = {
        name: name,
        email: email,
        password: password
    };

    fetch('https://v2.api.noroff.dev/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(`Failed to register. Error: ${err.message || response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Registration successful!');
        window.location.href = '/account/login.html'; 
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Failed to register. ${error.message}`);
    });
}
