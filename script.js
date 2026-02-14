// Use global variables from UMD build
const PhotoSwipeLightbox = window.PhotoSwipeLightbox;
const PhotoSwipe = window.PhotoSwipe;

// Wait for font to load before showing loading text
document.fonts.load("1em Gruppo").then(() => {
  const loadingText = document.querySelector(".loading-text");
  if (loadingText) {
    loadingText.style.opacity = "1";
  }
});

const galleryElement = document.getElementById("gallery");
const slidesDir = "slides/";
let slideIndex = 1;

function createSlideHTML(index, slideData) {
  const item = document.createElement("div");
  item.className = "slide-item";

  // We will use a link for PhotoSwipe
  const link = document.createElement("a");
  link.href = slideData.src;
  link.dataset.pswpWidth = slideData.w;
  link.dataset.pswpHeight = slideData.h;
  link.target = "_blank";
  link.className = "slide-link";

  const img = document.createElement("img");
  img.className = "slide-image";
  img.loading = "lazy"; // Native lazy loading
  img.src = slideData.src;
  img.alt = `Slide ${index}`;

  link.appendChild(img);
  item.appendChild(link);

  const numContainer = document.createElement("div");
  numContainer.className = "slide-number-container";

  const num = document.createElement("span");
  num.className = "slide-number";
  num.textContent = index;

  numContainer.appendChild(num);
  item.appendChild(numContainer);

  return item;
}

function initGallery() {
  // Initialize PhotoSwipe
  const lightbox = new PhotoSwipeLightbox({
    gallery: "#gallery",
    children: "a.slide-link",
    pswpModule: PhotoSwipe,
    // Mobile-first adjustments
    paddingFn: (viewportSize) => {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      };
    },
  });

  lightbox.init();

  // Hide loading screen
  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.display = "none";
  }
}

function loadNextSlide() {
  const img = new Image();
  const currentSrc = `${slidesDir}${slideIndex}.jpg`;

  img.onload = function () {
    // Image exists
    const slideData = {
      src: currentSrc,
      w: this.naturalWidth,
      h: this.naturalHeight,
    };

    // Append to DOM
    const slideHTML = createSlideHTML(slideIndex, slideData);
    galleryElement.appendChild(slideHTML);

    slideIndex++;
    loadNextSlide();
  };

  img.onerror = function () {
    // Image does not exist, assume end of sequence
    console.log(`Finished loading slides. Total: ${slideIndex - 1}`);
    initGallery();
  };

  img.src = currentSrc;
}

// Start loading
loadNextSlide();
