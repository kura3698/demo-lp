document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const fadeInItems = document.querySelectorAll(".c-animated__fadeIn");
  if (!fadeInItems.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const timeDelay = 250;
  const maxItemNumber = 3;

  for (let i = 0; i < maxItemNumber; i++) {
    const items = document.querySelectorAll(`.c-animated__fadeIn.--delay${i}`);
    fadeInFunction(items, i * timeDelay);
  }

  function fadeInFunction(items, timeout) {
    items.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top 70%",
        onEnter: () => {
          setTimeout(() => {
            item.classList.add("js-show");
          }, timeout);
        },
      });
    });
  }
});
