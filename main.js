const apiPost = "https://v2.api.noroff.dev/blog/posts/Hauk/";
const postsPerPage = 12;
let currentPage = 1;
let totalPosts = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(apiPost);
    const responseData = await response.json();
    totalPosts = responseData.data; 

    if (totalPosts.length > 0) {
      displayPosts(); 
      initCarousel(totalPosts); 
      if (totalPosts.length > postsPerPage) {
        createPaginationControls(); 
      }
    } else {
      console.error("No posts available.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

function displayPosts() {
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const postsToShow = totalPosts.slice(startIndex, endIndex);

  const postsContainer = document.querySelector(".index-posts");
  postsContainer.innerHTML = ''; 

  postsToShow.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("index-post-title");

    const image = document.createElement("img");
    image.src = post.media.url;
    image.alt = post.media.alt || "";
    postDiv.appendChild(image);

    const title = document.createElement("h3");
    title.textContent = post.title;
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
  if (paginationDiv) {
    const pageNumber = paginationDiv.querySelector("#pageNumber");
    pageNumber.textContent = currentPage;
  }
}

function createPaginationControls() {
  const existingPagination = document.querySelector(".pagination-container");
  if (!existingPagination && totalPosts.length > postsPerPage) {
    const paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination";

    const prevButton = document.createElement("button");
    prevButton.id = "prevPage";
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        displayPosts();
      }
    });

    const pageNumber = document.createElement("span");
    pageNumber.id = "pageNumber";
    pageNumber.textContent = currentPage;

    const nextButton = document.createElement("button");
    nextButton.id = "nextPage";
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      if (currentPage * postsPerPage < totalPosts.length) {
        currentPage++;
        displayPosts();
      }
    });

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(pageNumber);
    paginationDiv.appendChild(nextButton);

    const footer = document.querySelector('footer');
    footer.parentNode.insertBefore(paginationDiv, footer);
  }
}

function initCarousel(data) {
  const carouselSlides = document.querySelector(".index-carousel-slides");
  carouselSlides.innerHTML = ''; 

  const recentThreePosts = data.slice(0, 3);
  recentThreePosts.forEach((post) => {
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

  showSlide(currentSlide); 
}
