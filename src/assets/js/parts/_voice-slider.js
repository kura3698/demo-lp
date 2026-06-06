document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".p-voice__slider");
  if (!el || typeof Swiper === "undefined") return;

  const MQ = "(max-width: 959px)";
  let swiper = null;

  const getOptions = () => ({
    slidesPerView: 1,
    spaceBetween: 30,
    loop: false,
    speed: 400,
    allowTouchMove: true,
    resizeObserver: true,
    navigation: {
      prevEl: el.querySelector(".p-voice__nav--prev"),
      nextEl: el.querySelector(".p-voice__nav--next"),
    },
    pagination: {
      el: el.querySelector(".p-voice__pagination"),
      clickable: true,
      bulletClass: "p-voice__bullet",
      bulletActiveClass: "is-active",
    },
  });

  const init = () => {
    if (swiper) return;
    swiper = new Swiper(el, getOptions());
  };

  const destroy = () => {
    if (!swiper) return;
    swiper.destroy(true, true);
    swiper = null;
  };

  const mq = window.matchMedia(MQ);
  const onChange = () => {
    if (mq.matches) {
      init();
    } else {
      destroy();
    }
  };

  mq.addEventListener("change", onChange);
  onChange();
});
