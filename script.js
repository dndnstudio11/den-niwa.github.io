const images = [
  "images/01.jpg",
  "images/02.jpg",
  "images/03.jpg"
];

let imageIndex = 0;
const img = document.getElementById("photo");

// download friction
img.setAttribute("draggable", "false");
img.addEventListener("dragstart", (e) => e.preventDefault());
img.addEventListener("contextmenu", (e) => e.preventDefault());

function preload(src) {
  const pre = new Image();
  pre.src = src;
}

function preloadNextTwo() {
  const next1 = (imageIndex + 1) % images.length;
  const next2 = (imageIndex + 2) % images.length;
  preload(images[next1]);
  preload(images[next2]);
}

function updateCounter() {
  document.getElementById("counter").textContent =
    String(imageIndex + 1).padStart(2, "0");
}

function next() {
  imageIndex = (imageIndex + 1) % images.length;
  img.src = images[imageIndex];
  preloadNextTwo();
  updateCounter();
}

// click on image advances
img.addEventListener("click", next);

// random entry
imageIndex = Math.floor(Math.random() * images.length);
img.src = images[imageIndex];
updateCounter();
preloadNextTwo();

// click margins advances
document.querySelector(".zone.left").addEventListener("click", next);
document.querySelector(".zone.right").addEventListener("click", next);

// keyboard
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") next();
});

// swipe
let startX = null;
window.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchend", (e) => {
  if (startX === null) return;
  const endX = e.changedTouches[0].clientX;
  if (Math.abs(endX - startX) > 40) next();
  startX = null;
}, { passive: true });
