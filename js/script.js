(async () => {
  const img = document.getElementById("photo");
  if (!img) throw new Error("Missing element: #photo");

  const counterEl = document.getElementById("counter");

  // Use deterministic site version from meta tag for cache-busting
  const versionTag = document.querySelector('meta[name="site-version"]');
  const bust = (versionTag && versionTag.content) || String(Date.now());
  const res = await fetch(`images/list.json?v=${bust}`, { cache: "no-store" });
  if (!res.ok)
    throw new Error(
      "Missing images/list.json (ensure it exists or regenerate).",
    );

  const files = await res.json();
  const images = files
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .map((f) => encodeURI(`images/${f}`));

  if (!images.length) throw new Error("No images found in images/list.json");

  img.draggable = false;
  img.loading = "eager";
  img.addEventListener("dragstart", (e) => e.preventDefault());
  img.addEventListener("contextmenu", (e) => e.preventDefault());

  let _preloadImg = new Image();
  _preloadImg.loading = "eager";
  const preload = (src) => {
    if (!src || _preloadImg.src === src) return;
    _preloadImg.src = src;
  };

  let imageIndex = 0; // first image in the list

  const toJapaneseNumeral = (num) => {
    const japaneseMap = [
      { value: 1000, numeral: "千" },
      { value: 100, numeral: "百" },
      { value: 10, numeral: "十" },
      { value: 1, numeral: "" },
    ];
    const digits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

    if (num === 0) return "零";

    let result = "";
    let tempNum = num;

    for (const { value, numeral } of japaneseMap) {
      const digit = Math.floor(tempNum / value);
      if (digit > 0) {
        if (value === 1) {
          result += digits[digit];
        } else {
          result += digits[digit] + numeral;
        }
        tempNum %= value;
      }
    }
    return result;
  };

  const updateCounter = () => {
    if (!counterEl) return;
    counterEl.textContent = toJapaneseNumeral(imageIndex + 1);
  };

  let firstLoad = true;
  const onFirstLoad = () => {
    if (!firstLoad) return;
    firstLoad = false;
    // Use rAF to ensure style application after paint
    requestAnimationFrame(() => img.classList.add("loaded"));
    img.removeEventListener("load", onFirstLoad);
  };
  img.addEventListener("load", onFirstLoad);

  const show = (i) => {
    imageIndex = (i + images.length) % images.length;
    img.src = images[imageIndex];
    preload(images[(imageIndex + 1) % images.length]);
    updateCounter();
  };

  const next = () => show(imageIndex + 1);

  img.addEventListener("click", next);

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(imageIndex - 1);
    if (e.key === "ArrowRight") show(imageIndex + 1);
  });

  let startX = 0;
  let isTransitioning = false;

  window.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchend",
    (e) => {
      if (isTransitioning) return;
      if (Math.abs(e.changedTouches[0].clientX - startX) > 40) {
        isTransitioning = true;
        next();
        setTimeout(() => {
          isTransitioning = false;
        }, 300);
      }
    },
    { passive: true },
  );

  show(0); // load first image
})();
