const apiPost = "https://v2.api.noroff.dev/blog/posts/Hauk/";
let currentPage = 1;
let postsPerPage = 12;
let totalPosts = [];
let filteredPosts = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(apiPost);
        const responseData = await response.json();
        totalPosts = responseData.data; 
        filteredPosts = totalPosts; 

        if (totalPosts.length > 0) {
            initCarousel(totalPosts);
            populateFilterOptions(totalPosts);
            displayPosts();
            createPaginationControls();
        } else {
            console.error("No posts available.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('filterTags').addEventListener('change', handleFilter);
});

function initCarousel(posts) {
    const carouselSlides = document.querySelector(".index-carousel-slides");
    carouselSlides.innerHTML = '';

    posts.slice(0, 3).forEach(post => {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("index-carousel-item");
        const image = document.createElement("img");
        image.src = post.media.url;
        image.alt = post.media.alt || "Default alt text";
        carouselItem.appendChild(image);
        carouselItem.addEventListener("click", () => {
            window.location.href = `/post/index.html?id=${post.id}`;
        });
        carouselSlides.appendChild(carouselItem);
    });

    initializeCarouselControls();
}

function populateFilterOptions(posts) {
    const allTags = new Set();
    posts.forEach(post => post.tags && post.tags.forEach(tag => allTags.add(tag)));
    const filterSelect = document.getElementById('filterTags');
    allTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.text = tag;
        filterSelect.appendChild(option);
    });
}

function handleSearch() {
    updateFilteredPosts();
}

function handleFilter() {
    updateFilteredPosts();
}

function updateFilteredPosts() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filterTag = document.getElementById('filterTags').value;
    filteredPosts = totalPosts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(searchText);
        const tagMatch = !filterTag || (post.tags && post.tags.includes(filterTag));
        return titleMatch && tagMatch;
    });
    currentPage = 1; 
    displayPosts();
}

function displayPosts() {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, filteredPosts.length);
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    const postsContainer = document.querySelector(".index-posts");
    postsContainer.innerHTML = '';

    postsToShow.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("index-post-title");
        const image = document.createElement("img");
        image.src = post.media.url;
        image.alt = post.media.alt || "";
        const title = document.createElement("h3");
        title.textContent = post.title;
        postDiv.appendChild(image);
        postDiv.appendChild(title);
        postDiv.addEventListener("click", () => {
            window.location.href = `/post/index.html?id=${post.id}`;
        });
        postsContainer.appendChild(postDiv);
    });
    updatePaginationControls();
}

function updatePaginationControls() {
    const paginationDiv = document.querySelector(".pagination");
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayPosts();
        };
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        paginationDiv.appendChild(pageButton);
    }
}

function initializeCarouselControls() {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".index-carousel-item");
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    const nextBtn = document.getElementById("carousel-next-btn");
    const prevBtn = document.getElementById("carousel-prev-btn");

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? "block" : "none";
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    setInterval(nextSlide, 5000);

    showSlide(currentSlide); 
}
