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
    drawer.classList.add("is-open");
    drawerBtn.classList.add("is-open");
    body.classList.add("is-open");
    drawerBtn.setAttribute("aria-expanded", "true");
    drawerBtn.setAttribute("aria-label", "メニューを閉じる");
    drawer.setAttribute("aria-hidden", "false");

    backgroundFix(true);
    document.addEventListener("keydown", handleKeydown);

    const focusableEls = drawer.querySelectorAll(focusableSelector);
    if (focusableEls.length > 0) {
      focusableEls[0].focus();
    }
  }

  function closeDrawer({ restoreFocus = true, scrollTo = null } = {}) {
    drawer.classList.remove("is-open");
    drawerBtn.classList.remove("is-open");
    body.classList.remove("is-open");
    drawerBtn.setAttribute("aria-expanded", "false");
    drawerBtn.setAttribute("aria-label", "メニューを開く");
    drawer.setAttribute("aria-hidden", "true");

    const savedScrollY = parseInt(body.style.top || "0", 10) * -1;
    const offsetPosition = scrollTo
      ? scrollTo.getBoundingClientRect().top + savedScrollY
      : null;

    ["height", "position", "top", "left", "width"].forEach((key) => {
      body.style[key] = "";
    });

    if (offsetPosition !== null) {
      window.scrollTo({ top: offsetPosition, behavior: "auto" });
    } else {
      window.scrollTo(0, savedScrollY);
    }

    document.removeEventListener("keydown", handleKeydown);

    if (restoreFocus) {
      drawerBtn.focus();
    }
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

    if (drawer.classList.contains("is-open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawer.addEventListener("click", (e) => {
    if (!drawer.classList.contains("is-open")) return;
    if (!e.target.closest(".c-drawer__link")) {
      closeDrawer();
    }
  });

  drawer.querySelectorAll(".c-drawer__link").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!drawer.classList.contains("is-open")) return;

      const href = link.getAttribute("href");
      const target =
        href?.startsWith("#") && href !== "#"
          ? document.getElementById(href.slice(1))
          : null;

      event.preventDefault();
      closeDrawer({ restoreFocus: false, scrollTo: target });
    });
  });
});
