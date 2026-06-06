document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".p-gallery__slider");
  if (!el || typeof Swiper === "undefined") return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const swiper = new Swiper(el, {
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 4,
    speed: 8000,
    allowTouchMove: true,
    grabCursor: true,
    autoplay: {
      delay: 1,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      reverseDirection: false,
    },
    breakpoints: {
      768: {
        spaceBetween: 10,
      },
    },
  });

  const syncAutoplay = () => {
    if (prefersReducedMotion.matches) {
      swiper.autoplay.stop();
    } else if (!swiper.autoplay.running) {
      swiper.autoplay.start();
    }
  };

  syncAutoplay();
  prefersReducedMotion.addEventListener("change", syncAutoplay);
  swiper.on("touchEnd", syncAutoplay);
});
