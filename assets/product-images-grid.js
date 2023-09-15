function initializeSlider() {
  $(".product_main-gallery").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    https://cdn.shopify.com/s/files/1/0804/7368/6324/files/slider-right-arrow.svg?v=1691503011
  });
}

function destroySlider() {
  $(".product_main-gallery").slick("unslick");
}

function checkWindowSize() {
  if (window.innerWidth < 768) {
    // Adjust the breakpoint as needed
    initializeSlider();
  } else {
    destroySlider();
  }
}

// Initialize slider on page load
checkWindowSize();

window.addEventListener("resize", checkWindowSize);
