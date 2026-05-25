document.addEventListener("DOMContentLoaded", () => {
  const inviewElements = document.querySelectorAll(".inview");
  if (!inviewElements.length) return;

  window.addEventListener("scroll", () => {
    inviewElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const targetPosition = rect.top + window.pageYOffset;
      const scroll = window.pageYOffset;
      const windowHeight = window.innerHeight;

      if (scroll > targetPosition - windowHeight) {
        el.classList.add("show");
      }
    });
  });
});
