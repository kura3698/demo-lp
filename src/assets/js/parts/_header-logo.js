document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".l-header__logo");
  if (!logo) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      logo.style.opacity = "0";
      logo.style.visibility = "hidden";
    } else {
      logo.style.opacity = "1";
      logo.style.visibility = "visible";
    }
  });
});
