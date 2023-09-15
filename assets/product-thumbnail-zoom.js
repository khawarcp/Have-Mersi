// Get the gallery images and modal elements
const gallery = document.querySelector(".product_main-gallery");
const modal = document.getElementById("myModal");
const modalImage = document.getElementById("modalImage");
const modalActiveClose = document.querySelector(
  ".desktop-zoom__image-wrapper-Fkt"
);

// Get the navigation buttons
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Get the close button
const closeBtn = document.getElementsByClassName("close")[0];

// Initially, set the current image index to -1
let currentImageIndex = -1;

// Function to open the modal with a specific image
function openModal(index) {
  currentImageIndex = index;
  modalImage.src =
    gallery.children[index].querySelector(".photoswipe__image").src;
  modalImage.classList.add("active"); // Add the 'active' class
  modal.classList.add("gallery-active-modal");
  document.body.classList.add("body-overflow");
}

// Function to close the modal
function closeModal() {
  modalImage.classList.remove("active"); // Remove the 'active' class
  modal.classList.remove("gallery-active-modal");
  document.body.classList.remove("body-overflow");
}

function showPrev() {
  let prevIndex = currentImageIndex - 1;

  // Loop to find the previous image with display: block
  while (prevIndex !== currentImageIndex) {
    if (prevIndex < 0) {
      prevIndex = gallery.children.length - 1; // Wrap around to the last image
    }

    const imageElementParent = gallery.children[prevIndex].closest(
      ".product-image-slide"
    );

    if (
      imageElementParent &&
      window
        .getComputedStyle(imageElementParent)
        .getPropertyValue("display") === "block"
    ) {
      openModal(prevIndex);
      break;
    }

    prevIndex--;
  }
}

// Function to show the next image
function showNext() {
  let nextIndex = currentImageIndex + 1;

  // Loop to find the next image with display: block
  while (nextIndex !== currentImageIndex) {
    if (nextIndex >= gallery.children.length) {
      nextIndex = 0; // Wrap around to the first image
    }

    const imageElement =
      gallery.children[nextIndex].querySelector(".photoswipe__image");
    const imageElementParent = gallery.children[nextIndex];
    console.clear();
    console.log("imageElementParent", imageElementParent);
    if (
      window
        .getComputedStyle(imageElementParent)
        .getPropertyValue("display") === "block"
    ) {
      openModal(nextIndex);
      break;
    }

    nextIndex++;
  }
}

// Attach click event listeners to gallery images
for (let i = 0; i < gallery.children.length; i++) {
  gallery.children[i].addEventListener("click", () => openModal(i));
}

// Attach click event listener to close button
closeBtn.addEventListener("click", closeModal);
modalActiveClose.addEventListener("click", closeModal);

// Attach click event listeners to navigation buttons
prevBtn.addEventListener("click", showPrev);
nextBtn.addEventListener("click", showNext);

// Attach key press event listener to navigate with arrow keys
document.addEventListener("keydown", function (e) {
  if (modal.style.display === "block") {
    if (e.key === "ArrowLeft") {
      showPrev();
    } else if (e.key === "ArrowRight") {
      showNext();
    } else if (e.key === "Escape") {
      closeModal();
    }
  }
});
