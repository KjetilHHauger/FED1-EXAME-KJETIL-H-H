const apiPost = "https://v2.api.noroff.dev/blog/posts/Hauk/";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(apiPost);
    const responseData = await response.json();
    const data = responseData.data; // Accessing the 'data' key

    const postsContainer = document.querySelector(".index-posts");
    if (Array.isArray(data)) {
      data.forEach((post) => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("index-post-title");
        const image = document.createElement("img");
        image.src = post.media.url;
        image.alt = post.media.alt || ""; // Provide alternative text if available
        postDiv.appendChild(image);

        const title = document.createElement("h3");
        title.textContent = post.title;
        postDiv.appendChild(title);

        // Add click event listener to navigate to post page on click
        postDiv.addEventListener("click", () => {
          window.location.href = `/post/index.html?id=${post.id}`;
        });

        postsContainer.appendChild(postDiv);
      });

      // Initialize the carousel
      initCarousel(data);
    } else {
      console.error("Data format is not as expected.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

function initCarousel(data) {
  const carouselSlides = document.querySelector(".index-carousel-slides");
  const lastThreePosts = data.slice(-3);
  lastThreePosts.forEach((post) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("index-carousel-item");
    const image = document.createElement("img");
    image.src = post.media.url;
    image.alt = post.media.alt || "";
    carouselItem.appendChild(image);

    const title = document.createElement("h3");
    title.textContent = post.title;
    carouselItem.appendChild(title);

    // Add click event listener to navigate to post page on click
    carouselItem.addEventListener("click", () => {
      window.location.href = `/post/index.html?id=${post.id}`;
    });

    carouselSlides.appendChild(carouselItem);
  });

  // Initialize carousel functionality
  let currentSlide = 0;
  const slides = document.querySelectorAll(".index-carousel-item");
  const totalSlides = slides.length;
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.style.display = "block";
      } else {
        slide.style.display = "none";
      }
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

  // Show initial slide
  showSlide(currentSlide);
}
