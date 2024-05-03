const apiPost = "https://v2.api.noroff.dev/blog/posts/Hauk/";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(apiPost);
    const responseData = await response.json();
    const data = responseData.data;

    const postsContainer = document.querySelector(".index-posts");
    if (Array.isArray(data)) {
      data.forEach((post) => {
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

      initCarousel(data);
    } else {
      console.error("Data format is not as expected.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

function initCarousel(data) {
  if (!data || data.length === 0) {
      console.error("No data available for carousel");
      return;
  }

  data.sort((a, b) => new Date(b.created) - new Date(a.created));

  const carouselSlides = document.querySelector(".index-carousel-slides");
  const recentThreePosts = data.slice(0, 3);  
  console.log("Recent three posts for carousel:", recentThreePosts);

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
  setInterval(nextSlide, 10000); 
}