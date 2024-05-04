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
    const postImageDiv = document.querySelector('.post-image');
    const postAuthorDiv = document.querySelector('.post-author');
    const postTagDiv = document.querySelector('.post-tag');
    const postTitleDiv = document.querySelector('.post-title');
    const postTextDiv = document.querySelector('.post-text');

    // Set up post image
    postImageDiv.style.backgroundImage = `url(${post.media.url})`;
    postImageDiv.setAttribute('alt', post.media.alt);

    // Set up author info
    postAuthorDiv.textContent = `Author: ${post.author.name}`;
    postAuthorDiv.setAttribute('alt', post.author.avatar.alt);

    // Set up post tags
    postTagDiv.textContent = `Tags: ${post.tags.join(', ')}`;

    // Set post title
    postTitleDiv.textContent = post.title;

    // Set post body text
    postTextDiv.textContent = post.body;
}
