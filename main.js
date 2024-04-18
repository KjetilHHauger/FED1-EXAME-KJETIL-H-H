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
                
                // Check screen width and include image if above 768 pixels
                if (window.innerWidth > 768 && post.media && post.media.url) {
                    const image = document.createElement('img');
                    image.src = post.media.url;
                    image.alt = post.media.alt || ''; // Provide alternative text if available
                    postDiv.appendChild(image);
                }
                
                const title = document.createElement('h3');
                title.textContent = post.title;
                postDiv.appendChild(title);
                
                postsContainer.appendChild(postDiv);
            });
        } else {
            console.error('Data format is not as expected.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
