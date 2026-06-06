document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".p-service-mongol__plans");
  if (!el || typeof Swiper === "undefined") return;

  new Swiper(el, {
    slidesPerView: 1,
    spaceBetween: 20, // $plans-gap-sp と同値
    loop: true,
    speed: 400,
    allowTouchMove: true,
    pagination: {
      el: el.querySelector(".swiper-pagination"),
      clickable: true,
    },
    breakpoints: {
      768: {
        enabled: false,
      },
    },
  });
});
