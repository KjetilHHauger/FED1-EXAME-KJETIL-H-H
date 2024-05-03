const createAPI = 'https://v2.api.noroff.dev/blog/posts/Hauk';
let isEditing = false;
let currentEditingId = null;

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('input[type="submit"]');
    const cancelButton = document.getElementById('cancel-edit');
    const body = document.getElementById('edit-text');

    body.setAttribute('maxlength', '2000');
    body.addEventListener('input', updateCharacterCount);

    submitButton.addEventListener('click', handleFormSubmit);
    cancelButton.addEventListener('click', resetForm);

    fetchOldPosts();  
});

function updateCharacterCount() {
    const body = document.getElementById('edit-text');
    const remaining = 2000 - body.value.length;
    let feedback = document.getElementById('char-count-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'char-count-feedback';
        body.parentNode.insertBefore(feedback, body.nextSibling);
    }
    feedback.textContent = `Characters left: ${remaining}`;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('edit-title').value.trim();
    const url = document.getElementById('edit-url').value.trim();
    const alt = document.getElementById('edit-alt').value.trim();
    const tag = document.getElementById('edit-tag').value.trim();
    const bodyText = document.getElementById('edit-text').value;

    if (!title || !url || !alt || !tag) {
        alert('All fields are required and must not be empty.');
        return;
    }

    const payload = {
        title: title,
        body: bodyText,
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

    const apiEndpoint = isEditing ? `${createAPI}/${currentEditingId}` : createAPI;
    const method = isEditing ? 'PUT' : 'POST';

    fetch(apiEndpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to process post, server responded with an error.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert(`Post ${isEditing ? 'updated' : 'created'} successfully!`);
        resetForm();
        fetchOldPosts();  
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(`Failed to ${isEditing ? 'update' : 'create'} post.`);
    });
}

function loadPostInForm(post) {
    isEditing = true;
    currentEditingId = post.id;
    document.getElementById('edit-title').value = post.title;
    document.getElementById('edit-url').value = post.media.url;
    document.getElementById('edit-alt').value = post.media.alt;
    document.getElementById('edit-tag').value = post.tags.join(', ');
    document.getElementById('edit-text').value = post.body;
    updateCharacterCount();  
}

function resetForm() {
    isEditing = false;
    currentEditingId = null;
    document.getElementById('edit-title').value = '';
    document.getElementById('edit-url').value = '';
    document.getElementById('edit-alt').value = '';
    document.getElementById('edit-tag').value = '';
    document.getElementById('edit-text').value = '';
    updateCharacterCount(); 
}

function fetchOldPosts() {
    const accessToken = localStorage.getItem('bearerToken');
    if (!accessToken) {
        console.error("Not logged in");
        return;
    }

    fetch(createAPI, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(responseData => {
        if (Array.isArray(responseData.data)) {
            displayOldPosts(responseData.data);
        } else {
            console.error("Expected data array but got:", responseData.data);
        }
    })
    .catch(error => {
        console.error('Failed to fetch old posts:', error);
    });
}

function displayOldPosts(posts) {
    const postsContainer = document.querySelector('.edit-old-posts');
    postsContainer.innerHTML = ''; 
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('old-post');

        const title = document.createElement('h4');
        title.textContent = post.title;
        postDiv.appendChild(title);

        const editBtn = document.createElement('button');
        editBtn.classList = 'old-post-edit'
        editBtn.onclick = () => loadPostInForm(post);
        postDiv.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList = 'old-post-delete'
        deleteBtn.onclick = () => deletePost(post.id);
        postDiv.appendChild(deleteBtn);

        postsContainer.appendChild(postDiv);
    });
}

function deletePost(postId) {
    const accessToken = localStorage.getItem('bearerToken');
    const deleteUrl = `${createAPI}/${postId}`;
    
    fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete the post');
        }
        fetchOldPosts(); 
        alert('Post deleted successfully');
    })
    .catch(error => {
        console.error('Error deleting post:', error);
    });
}
