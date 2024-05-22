const apiPost = "https://v2.api.noroff.dev/blog/posts/Hauk/";
let currentPage = 1;
let postsPerPage = 12;
let totalPosts = [];
let filteredPosts = [];
let currentSlide = 0;
let slideInterval;

document.addEventListener("DOMContentLoaded", async () => {
  await refreshPostsAndCarousel();
  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearch);
  document
    .getElementById("filterTags")
    .addEventListener("change", handleFilter);
});

async function refreshPostsAndCarousel() {
  try {
    const response = await fetch(apiPost);
    const responseData = await response.json();
    totalPosts = responseData.data;
    totalPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
    filteredPosts = totalPosts;

    populateFilterOptions(filteredPosts);
    initCarousel(totalPosts.slice(0, 3));
    displayPosts();
    setupTouchEvents();
  } catch (error) {
    console.error("Error fetching and refreshing data:", error);
  }
}

function initCarousel(posts) {
  const carouselSlides = document.querySelector(".index-carousel-slides");
  const sideDivs = [
    ".index-sides-one",
    ".index-sides-two",
    ".index-sides-three",
  ];
  const carouselDots = document.querySelector(".carousel-dots");
  carouselSlides.innerHTML = "";
  carouselDots.innerHTML = "";

  posts.forEach((post, index) => {
    const carouselItem = createCarouselItem(post);
    carouselSlides.appendChild(carouselItem);

    if (index < sideDivs.length) {
      const sideDiv = document.querySelector(sideDivs[index]);
      if (sideDiv) {
        sideDiv.innerHTML = "";
        const sideImage = document.createElement("img");
        sideImage.src = post.media.url;
        sideImage.alt = post.media.alt || "Default alt text";
        sideImage.onclick = () => {
          window.location.href = `/post/index.html?id=${post.id}`;
        };
        sideImage.style.cursor = "pointer";
        sideDiv.appendChild(sideImage);
      }
    }

    const dot = document.createElement("div");
    dot.classList.add("carousel-dot");
    dot.addEventListener("click", () => {
      clearInterval(slideInterval);
      showSlide(index);
    });
    carouselDots.appendChild(dot);
  });

  initializeCarouselControls();
}

function createCarouselItem(post) {
  const carouselItem = document.createElement("div");
  carouselItem.classList.add("index-carousel-item");
  const image = document.createElement("img");
  image.src = post.media.url;
  image.alt = post.media.alt || "Default alt text";
  carouselItem.appendChild(image);

  carouselItem.onclick = () => {
    window.location.href = `/post/index.html?id=${post.id}`;
  };

  return carouselItem;
}

function initializeCarouselControls() {
  const slides = document.querySelectorAll(".index-carousel-item");
  const prevButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");
  const dots = document.querySelectorAll(".carousel-dot");

  slideInterval = setInterval(nextSlide, 5000);

  prevButton.addEventListener('click', previousSlide);
  nextButton.addEventListener('click', nextSlide);
  showSlide(currentSlide);

  function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
  }

  function previousSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
  }
}


function showSlide(index) {
  const slides = document.querySelectorAll(".index-carousel-item");
  const dots = document.querySelectorAll(".carousel-dot");

  slides.forEach((slide) => (slide.style.display = "none"));
  dots.forEach((dot) => dot.classList.remove("active"));
  slides[index].style.display = "block";
  dots[index].classList.add("active");
  currentSlide = index;
}

function displayPosts() {
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = Math.min(startIndex + postsPerPage, filteredPosts.length);
  const postsContainer = document.querySelector(".index-posts");
  postsContainer.innerHTML = "";

  filteredPosts.slice(startIndex, endIndex).forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("index-post-title");
    const image = document.createElement("img");
    image.src = post.media.url;
    image.alt = post.media.alt || "";
    const title = document.createElement("h3");
    title.textContent = post.title;
    postDiv.appendChild(image);
    postDiv.appendChild(title);
    postDiv.onclick = () => {
      window.location.href = `/post/index.html?id=${post.id}`;
    };
    postsContainer.appendChild(postDiv);
  });
  updatePaginationControls();
}

function handleSearch() {
  updateFilteredPosts();
}

function handleFilter() {
  updateFilteredPosts();
}

function updateFilteredPosts() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const filterTag = document.getElementById("filterTags").value;
  filteredPosts = totalPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchText) &&
      (!filterTag || (post.tags && post.tags.includes(filterTag)))
  );
  currentPage = 1;
  displayPosts();
}

function populateFilterOptions(posts) {
  const filterSelect = document.getElementById("filterTags");
  filterSelect.innerHTML = '<option value="">Filter by tag (ALL)</option>';
  const tags = new Set();

  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => tags.add(tag));
    }
  });

  tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.text = tag;
    filterSelect.appendChild(option);
  });
}

function updatePaginationControls() {
  const paginationDiv = document.querySelector(".pagination");
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  paginationDiv.innerHTML = "";

  if (totalPages > 1) {
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
}

function setupTouchEvents() {
  const carouselContainer = document.querySelector(".carousel-container");
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwipeAction = false; 

  carouselContainer.addEventListener(
    "touchstart",
    function (event) {
      touchStartX = event.changedTouches[0].screenX;
      isSwipeAction = false; 
    },
    false
  );

  carouselContainer.addEventListener(
    "touchmove",
    function (event) {
      touchEndX = event.changedTouches[0].screenX;

      if (Math.abs(touchEndX - touchStartX) > 30) {
        isSwipeAction = true; 
      }
    },
    false
  );

  carouselContainer.addEventListener(
    "touchend",
    function (event) {
      if (isSwipeAction) { 
        handleSwipeGesture();
      }
    },
    false
  );

  function handleSwipeGesture() {
    if (touchEndX < touchStartX) {
      nextSlide();
    } else if (touchEndX > touchStartX) {
      previousSlide();
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % document.querySelectorAll(".index-carousel-item").length;
    showSlide(currentSlide);
  }

  function previousSlide() {
    currentSlide = (currentSlide - 1 + document.querySelectorAll(".index-carousel-item").length) % document.querySelectorAll(".index-carousel-item").length;
    showSlide(currentSlide);
  }
}

