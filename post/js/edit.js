const createAPI = 'https://v2.api.noroff.dev/blog/posts/Hauk';

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('input[type="submit"]');
    const body = document.getElementById('edit-text');

    body.setAttribute('maxlength', '280');
    body.addEventListener('input', () => {
        const remaining = 280 - body.value.length;
        let feedback = document.getElementById('char-count-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'char-count-feedback';
            body.parentNode.insertBefore(feedback, body.nextSibling);
        }
        feedback.textContent = `Characters left: ${remaining}`;
    });

    submitButton.addEventListener('click', (event) => {
        event.preventDefault();

        const title = document.getElementById('edit-title').value.trim();
        const url = document.getElementById('edit-url').value.trim();
        const alt = document.getElementById('edit-alt').value.trim();
        const tag = document.getElementById('edit-tag').value.trim();

        if (!title || !url || !alt || !tag) {
            alert('All fields are required and must not be empty.');
            return;
        }

        const payload = {
            title: title,
            body: body.value,
            tags: [tag],  
            media: {
                url: url,
                alt: alt
            }
        };

        const accessToken = localStorage.getItem('bearerToken');
        if (!accessToken) {
            alert("You are not logged in. Please log in to continue.");
            return;
        }

        fetch(createAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` 
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create post, server responded with an error.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Post created successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to create post.');
        });
    });
});
