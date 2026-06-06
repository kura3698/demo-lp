document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  links.forEach((item) => {
    item.addEventListener("click", (event) => {
      const targetId = item.getAttribute("href");

      if (targetId === "#" || !targetId.startsWith("#")) return;

      const target = document.getElementById(targetId.replace("#", ""));
      if (!target) return;

      event.preventDefault();

      const MQ_PC = "(min-width: 960px)";
      const header = document.querySelector(".l-header");
      const headerOffset =
        window.matchMedia(MQ_PC).matches && header ? header.offsetHeight : 0;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });
});
