document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://v2.api.noroff.dev/blog/posts/Hauk/');
        const responseData = await response.json();
        const data = responseData.data; // Accessing the 'data' key
        
        const postsContainer = document.querySelector('.index-posts');
        if (Array.isArray(data)) {
            data.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.classList.add('index-post-title');
                postDiv.innerHTML = `
                    <h3>${post.title}</h3>
                `;
                postsContainer.appendChild(postDiv);
            });
        } else {
            console.error('Data format is not as expected.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
