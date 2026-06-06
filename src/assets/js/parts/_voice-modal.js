document.addEventListener("DOMContentLoaded", () => {
  const openButtons = document.querySelectorAll(
    ".c-voice-card__more[aria-controls]"
  );
  if (openButtons.length === 0) return;

  const dialogs = new Map();

  const backgroundFix = (bool) => {
    const scrollingElement = () => {
      if ("scrollingElement" in document) return document.scrollingElement;
      return document.documentElement;
    };

    const scrollY = bool
      ? scrollingElement().scrollTop
      : parseInt(document.body.style.top || "0", 10);

    const fixedStyles = {
      height: "100vh",
      position: "fixed",
      top: `${scrollY * -1}px`,
      left: "0",
      width: "100vw",
    };

    Object.keys(fixedStyles).forEach((key) => {
      document.body.style[key] = bool ? fixedStyles[key] : "";
    });

    if (!bool) {
      window.scrollTo(0, scrollY * -1);
    }
  };

  openButtons.forEach((btn) => {
    const id = btn.getAttribute("aria-controls");
    if (!id) return;

    const dialog = document.getElementById(id);
    if (!dialog || dialog.tagName !== "DIALOG") return;

    dialogs.set(id, dialog);

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (dialog.open) return;

      dialog.dataset.triggerId = id;
      btn.dataset.modalTrigger = "true";
      backgroundFix(true);
      dialog.showModal();
    });
  });

  dialogs.forEach((dialog) => {
    dialog.querySelectorAll("[data-modal-close]").forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        dialog.close();
      });
    });

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });

    dialog.addEventListener("close", () => {
      backgroundFix(false);

      const trigger = document.querySelector(
        `.c-voice-card__more[aria-controls="${dialog.id}"]`
      );
      trigger?.focus();
    });
  });
});
