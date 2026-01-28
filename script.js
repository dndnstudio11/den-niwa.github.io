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

function preloadAround() {
  const next1 = (imageIndex + 1) % images.length;
  const next2 = (imageIndex + 2) % images.length;
  const prev1 = (imageIndex - 1 + images.length) % images.length;
  preload(images[next1]);
  preload(images[next2]);
  preload(images[prev1]);
}

function updateCounter() {
  document.getElementById("counter").textContent =
    String(imageIndex + 1).padStart(2, "0");
}

function show() {
  img.src = images[imageIndex];
  updateCounter();
  preloadAround();
}

function next() {
  imageIndex = (imageIndex + 1) % images.length;
  show();
}

function prev() {
  imageIndex = (imageIndex - 1 + images.length) % images.length;
  show();
}

// click on image: left half = prev, right half = next
img.addEventListener("click", (e) => {
  const rect = img.getBoundingClientRect();
  const x = e.clientX - rect.left;
  (x < rect.width / 2) ? prev() : next();
});

// random entry
imageIndex = Math.floor(Math.random() * images.length);
show();

// click margins
document.querySelector(".zone.left").addEventListener("click", prev);
document.querySelector(".zone.right").addEventListener("click", next);

// keyboard
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
});

// swipe
let startX = null;
window.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchend", (e) => {
  if (startX === null) return;
  const endX = e.changedTouches[0].clientX;
  const dx = endX - startX;
  if (Math.abs(dx) > 40) (dx > 0) ? prev() : next();
  startX = null;
}, { passive: true });
