document.addEventListener("DOMContentLoaded", () => {
  const telLinks = document.querySelectorAll('a[href^="tel:"]');
  if (!telLinks.length) return;

  const isMobile = /iphone|android(.+)?mobile/.test(
    navigator.userAgent.toLowerCase()
  );

  if (!isMobile) {
    telLinks.forEach((el) => {
      el.removeAttribute("href");
      el.style.cursor = "default";
      el.addEventListener("click", (e) => {
        e.preventDefault();
      });
    });
  }
});
