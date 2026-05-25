document.addEventListener("DOMContentLoaded", () => {
  const toTopButton = document.querySelector(".c-to-top");
  if (!toTopButton) return;

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    if (scrollPosition > 300) {
      toTopButton.classList.add("js-show");
    } else {
      toTopButton.classList.remove("js-show");
    }
  });

  toTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
