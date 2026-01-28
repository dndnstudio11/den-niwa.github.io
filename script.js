(async () => {
  const img = document.getElementById("photo");
  if (!img) throw new Error("Missing element: #photo");

  const counterEl = document.getElementById("counter");

  const res = await fetch("images/list.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Missing images/list.json (run workflow once).");

  const files = await res.json();
  const images = files
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .map((f) => `images/${f}`);

  if (!images.length) throw new Error("No images found in images/list.json");

  img.draggable = false;
  img.addEventListener("dragstart", (e) => e.preventDefault());
  img.addEventListener("contextmenu", (e) => e.preventDefault());

  // restore same image on refresh (comment out next 2 lines to go back to random)
  let imageIndex = Number(localStorage.getItem("imageIndex") ?? 0);
  if (!Number.isFinite(imageIndex)) imageIndex = 0;

  const preload = (src) => { const im = new Image(); im.src = src; };

  const updateCounter = () => {
    if (!counterEl) return;
    counterEl.textContent = String(imageIndex + 1).padStart(2, "0");
  };

  const show = (i) => {
    imageIndex = (i + images.length) % images.length;
    localStorage.setItem("imageIndex", String(imageIndex)); // remove if you want random each load

    img.src = images[imageIndex];
    preload(images[(imageIndex + 1) % images.length]);
    preload(images[(imageIndex + 2) % images.length]);
    updateCounter();
  };

  const next = () => show(imageIndex + 1);

  // only click image advances
  img.addEventListener("click", next);

  // optional: keyboard
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") next();
  });

  // optional: swipe
  let startX = 0;
  window.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  window.addEventListener("touchend", (e) => {
    if (Math.abs(e.changedTouches[0].clientX - startX) > 40) next();
  }, { passive: true });

  show(imageIndex);
})();
