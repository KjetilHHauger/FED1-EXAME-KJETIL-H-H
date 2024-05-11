document.addEventListener('DOMContentLoaded', function() {
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');

    if (postId) {
        fetchPost(postId);
    } else {
        console.error('Post ID not found in URL');
    }
});

function fetchPost(postId) {
    const apiURL = `https://v2.api.noroff.dev/blog/posts/Hauk/${postId}`;

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayPost(data.data))
        .catch(error => {
            console.error('Error fetching the post:', error);
        });
}

function displayPost(post) {
    const postImage = document.getElementById('postImage');
    const postAuthorDiv = document.querySelector('.post-author');
    const postTagDiv = document.querySelector('.post-tag');
    const postTitleDiv = document.querySelector('.post-title');
    const postTextDiv = document.querySelector('.post-text');
    const postDateDiv = document.querySelector('.post-date'); 

    postImage.src = post.media.url;
    postImage.alt = post.media.alt;

    postAuthorDiv.textContent = `Author: ${post.author.name}`;
    if (post.author.avatar) {
        postAuthorDiv.setAttribute('alt', post.author.avatar.alt);
    }

    postTagDiv.textContent = `Tag: ${post.tags.join(', ')}`;
    postTitleDiv.textContent = post.title;
    postTextDiv.innerHTML = `<p>${post.body}</p>`;

    const publishDate = new Date(post.created);
    postDateDiv.textContent = `Published on: ${publishDate.toLocaleDateString()}`;
}
