document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".p-fv__slider");
  if (!el || typeof Swiper === "undefined") return;

  new Swiper(el, {
    effect: "fade",
    fadeEffect: { crossFade: true },
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    allowTouchMove: false,
  });
});
