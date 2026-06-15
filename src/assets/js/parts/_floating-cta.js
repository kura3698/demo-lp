document.addEventListener("DOMContentLoaded", () => {
  const cta = document.querySelector(".c-floating-cta");
  const link = document.querySelector(".c-floating-cta__link");
  if (!cta || !link) return;

  // FV通過後の表示開始スクロール量（px / c-floating-cta.scss と同値）
  const SCROLL_THRESHOLD = 70;
  const mq = window.matchMedia("(min-width: 768px)");

  function updateFloatingCta() {
    if (mq.matches) {
      cta.classList.add("is-visible");
      cta.removeAttribute("aria-hidden");
      link.removeAttribute("tabindex");
      return;
    }

    const isVisible = window.scrollY >= SCROLL_THRESHOLD;
    cta.classList.toggle("is-visible", isVisible);
    cta.setAttribute("aria-hidden", String(!isVisible));
    link.tabIndex = isVisible ? 0 : -1;
  }

  window.addEventListener("scroll", updateFloatingCta, { passive: true });
  window.addEventListener("resize", updateFloatingCta);
  mq.addEventListener("change", updateFloatingCta);
  updateFloatingCta();
});
