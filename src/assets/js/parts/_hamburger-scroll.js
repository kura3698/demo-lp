document.addEventListener("DOMContentLoaded", () => {
  const cDrawerBtn = document.querySelector(".c-hamburger-icon");
  const cDrawerBar = document.querySelector(".c-hamburger-icon--bar");
  if (!cDrawerBtn || !cDrawerBar) return;

  const cDrawerBarSpan = cDrawerBar.querySelectorAll("span");

  function setDrawerBarSpanColor(color) {
    cDrawerBarSpan.forEach((span) => {
      span.style.backgroundColor = color;
    });
  }

  function handleScroll() {
    if (window.innerWidth <= 1279 && window.scrollY > 0) {
      cDrawerBtn.style.backgroundColor = "#FF7733";
      setDrawerBarSpanColor("#FFFFFF");
    } else {
      cDrawerBtn.style.backgroundColor = "";
      setDrawerBarSpanColor("");
    }
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
  handleScroll();
});
