document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  if (!header) return;

  const observeHeaderBlockSize = new ResizeObserver((entries) => {
    const entry = entries[0];

    if (entry.borderBoxSize) {
      const { blockSize } = entry.borderBoxSize[0];
      const roundedBlockSize = Math.round(blockSize);
      document.documentElement.style.setProperty(
        "--header-block-size",
        `${roundedBlockSize}px`
      );
    }
  });

  observeHeaderBlockSize.observe(header);
});
