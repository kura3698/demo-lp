document.addEventListener("DOMContentLoaded", () => {
  const drawerBtn = document.querySelector(".c-hamburger-icon");
  const drawer = document.querySelector(".c-drawer");
  if (!drawerBtn || !drawer) return;

  const body = document.body;

  const focusableSelector = `
    a[href], area[href],
    button:not([disabled]),
    input:not([disabled]),
    select:not([disabled]),
    textarea:not([disabled]),
    [tabindex]:not([tabindex="-1"])
  `;

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

  function openDrawer() {
    drawer.classList.add("js-show");
    drawerBtn.classList.add("js-show");
    body.classList.add("js-show");
    drawerBtn.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");

    backgroundFix(true);
    document.addEventListener("keydown", handleKeydown);

    const focusableEls = drawer.querySelectorAll(focusableSelector);
    if (focusableEls.length > 0) {
      focusableEls[0].focus();
    }
  }

  function closeDrawer() {
    drawer.classList.remove("js-show");
    drawerBtn.classList.remove("js-show");
    body.classList.remove("js-show");
    drawerBtn.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");

    backgroundFix(false);
    document.removeEventListener("keydown", handleKeydown);
    drawerBtn.focus();
  }

  function handleKeydown(e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      closeDrawer();
      return;
    }

    if (e.key === "Tab" || e.keyCode === 9) {
      trapFocus(e);
    }
  }

  function trapFocus(e) {
    const focusableEls = drawer.querySelectorAll(focusableSelector);
    if (!focusableEls.length) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }

  drawerBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (drawer.classList.contains("js-show")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawer.addEventListener("click", (e) => {
    const buttons = drawer.querySelectorAll(".c-hamburger-icon");
    const isButtonClick = Array.from(buttons).some((button) =>
      button.contains(e.target)
    );

    if (drawer.classList.contains("js-show") && !isButtonClick) {
      closeDrawer();
    }
  });
});
