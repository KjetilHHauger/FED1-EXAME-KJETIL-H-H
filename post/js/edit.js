const createAPI = 'https://v2.api.noroff.dev/blog/posts';

let isEditing = false;
let currentEditingId = null;

document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.querySelector('.edit-form');
    if (editForm) {
        editForm.addEventListener('submit', handleFormSubmit);
    }

    const textArea = document.getElementById('edit-text');
    if (textArea) {
        textArea.addEventListener('input', updateCharacterCount); 
    }

    const cancelButton = document.getElementById('cancel-edit');
    if (cancelButton) {
        cancelButton.addEventListener('click', resetForm);
    }

    fetchOldPosts();
    updateCharacterCount(); 
});


function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('edit-title').value.trim();
    const url = document.getElementById('edit-url').value.trim();
    const alt = document.getElementById('edit-alt').value.trim();
    const tag = document.getElementById('edit-tag').value.trim();
    const bodyText = document.getElementById('edit-text').value;

    if (!url || !isValidHttpUrl(url)) {
        alert('Please enter a valid HTTPS link for the image URL.');
        return;
    }

    if (!title || !alt || !tag) {
        alert('All fields are required and must not be empty, except for the image URL which must be a valid HTTPS link.');
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

    const username = localStorage.getItem('currentUser');
    const accessToken = localStorage.getItem(`bearerToken_${username}`);
    if (!accessToken) {
        alert("You are not logged in. Please log in to continue.");
        return;
    }

    const apiEndpoint = isEditing ? `${createAPI}/${username}/${currentEditingId}` : `${createAPI}/${username}`;
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
        alert(`Post ${isEditing ? 'updated' : 'created'} successfully!`);
        resetForm();
        fetchOldPosts();
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Failed to ${isEditing ? 'update' : 'create'} post: ${error.message}`);
    });
}

function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }
    return url.protocol === "https:"; 
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

function updateCharacterCount() {
    const textArea = document.getElementById('edit-text');
    const remaining = 2000 - textArea.value.length;
    const countFeedback = document.getElementById('char-count-feedback') || document.createElement('div');
    countFeedback.id = 'char-count-feedback';
    countFeedback.textContent = `Characters left: ${remaining}`;
    textArea.parentNode.insertBefore(countFeedback, textArea.nextSibling);
}

function fetchOldPosts() {
    const username = localStorage.getItem('currentUser');
    const accessToken = localStorage.getItem(`bearerToken_${username}`);
    if (!accessToken) {
        console.error("Not logged in");
        return;
    }

    fetch(`${createAPI}/${username}`, {
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
        editBtn.classList.add('old-post-edit');
        editBtn.alt = 'Edit';
        editBtn.onclick = () => loadPostInForm(post);
        postDiv.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('old-post-delete');
        deleteBtn.alt = 'Delete';
        deleteBtn.onclick = () => deletePost(post.id);
        postDiv.appendChild(deleteBtn);

        postsContainer.appendChild(postDiv);
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
    window.scrollTo(0, 0);
}

function deletePost(postId) {
    const username = localStorage.getItem('currentUser');
    const accessToken = localStorage.getItem(`bearerToken_${username}`);
    const deleteUrl = `${createAPI}/${username}/${postId}`;

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
        alert('Post deleted successfully');
        fetchOldPosts();
    })
    .catch(error => {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
    });
}
