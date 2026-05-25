document.addEventListener("DOMContentLoaded", () => {
  const swiperEls = document.querySelectorAll(".js-swiper");
  if (!swiperEls.length || typeof Swiper === "undefined") return;

  swiperEls.forEach((el) => {
    new Swiper(el, {
      loop: true,
      slidesPerView: 1,
      pagination: {
        el: el.querySelector(".swiper-pagination"),
        clickable: true,
      },
      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev"),
      },
    });
  });
});
