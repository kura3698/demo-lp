document.addEventListener("DOMContentLoaded", () => {
  const loadingID = document.getElementById("js-loading");
  if (!loadingID) return;

  function loadedPage() {
    loadingID.classList.add("js-loaded");
  }

  if (!sessionStorage.getItem("visited")) {
    sessionStorage.setItem("visited", "first");
    setTimeout(loadedPage, 4000);
  } else {
    setTimeout(loadedPage, 0);
  }
});
