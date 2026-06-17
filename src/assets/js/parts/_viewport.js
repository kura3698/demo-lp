// 390px以下で viewport を固定
!(function () {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;

  function switchViewport() {
    const value =
      window.outerWidth > 390
        ? "width=device-width,initial-scale=1"
        : "width=390";
    if (viewport.getAttribute("content") !== value) {
      viewport.setAttribute("content", value);
    }
  }

  addEventListener("resize", switchViewport, false);
  switchViewport();
})();
