document.addEventListener("DOMContentLoaded", () => {
  setUpAccordion();
});

const setUpAccordion = () => {
  const details = document.querySelectorAll(".p-faq__item.c-accordion__item");
  if (!details.length) return;

  const list = document.querySelector(".p-faq__list.c-accordion");
  if (list) list.classList.add("js-faq-accordion");

  const IS_OPENED_CLASS = "is-opened";
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  details.forEach((element) => {
    const summary = element.querySelector(".c-accordion__summary");
    const content = element.querySelector(".c-accordion__panel");
    const inner = content?.querySelector(".p-faq__a");
    if (!summary || !content || !inner) return;

    let isAnimating = false;

    // 初期 open（1件目）: アニメなし
    if (element.open) {
      element.classList.add(IS_OPENED_CLASS);
      content.style.height = "auto";
      content.style.opacity = "1";
    }

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (isAnimating) return;

      if (prefersReducedMotion.matches) {
        if (element.classList.contains(IS_OPENED_CLASS)) {
          element.classList.remove(IS_OPENED_CLASS);
          element.removeAttribute("open");
          content.style.height = "";
          content.style.opacity = "";
        } else {
          element.classList.add(IS_OPENED_CLASS);
          element.setAttribute("open", "true");
          content.style.height = "auto";
          content.style.opacity = "1";
        }
        return;
      }

      if (element.classList.contains(IS_OPENED_CLASS)) {
        // アコーディオンを閉じる
        element.classList.remove(IS_OPENED_CLASS);
        const contentHeight = inner.scrollHeight;
        content.style.height = `${contentHeight}px`;
        content.offsetHeight; // reflow — アニメ開始を保証
        isAnimating = true;
        requestAnimationFrame(() => {
          content.style.height = "0";
          content.style.opacity = "0";
        });
        content.addEventListener("transitionend", function handler(e) {
          if (e.propertyName === "height") {
            element.removeAttribute("open");
            content.style.height = "";
            content.style.opacity = "";
            isAnimating = false;
            content.removeEventListener("transitionend", handler);
          }
        });
      } else {
        // アコーディオンを開く
        element.classList.add(IS_OPENED_CLASS);
        element.setAttribute("open", "true");

        content.style.height = "0";
        content.style.opacity = "1";

        const contentHeight = inner.scrollHeight;

        isAnimating = true;
        requestAnimationFrame(() => {
          content.style.height = `${contentHeight}px`;
        });

        content.addEventListener("transitionend", function handler(e) {
          if (e.propertyName === "height") {
            content.style.height = "auto";
            isAnimating = false;
            content.removeEventListener("transitionend", handler);
          }
        });
      }
    });
  });
};
