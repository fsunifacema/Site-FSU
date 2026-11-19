(() => {
  const storageKey = "fsu-color-mode";
  const root = document.documentElement;
  let savedMode = "dark";
  try {
    if (localStorage.getItem(storageKey) === "light") savedMode = "light";
  } catch (_) {}
  root.dataset.colorMode = savedMode;

  const updatePage = (mode) => {
    const light = mode === "light";
    root.dataset.colorMode = light ? "light" : "dark";
    root.style.colorScheme = light ? "light" : "dark";

    document.querySelectorAll("[data-logo-dark][data-logo-light]").forEach((logo) => {
      logo.src = light ? logo.dataset.logoLight : logo.dataset.logoDark;
      if (logo.classList.contains("hero-logo")) {
        logo.alt = light
          ? "Logo azul da FSU - Fabrica de Software UNIFACEMA"
          : "Logo branca da FSU - Fabrica de Software UNIFACEMA";
      }
    });

    document.querySelectorAll(".cinematic-theme-switcher").forEach((switcher) => {
      switcher.dataset.theme = light ? "light" : "dark";
      switcher.setAttribute("aria-checked", String(!light));
      switcher.setAttribute("aria-label", light ? "Alternar para modo escuro" : "Alternar para modo claro");
    });
  };

  window.setFSUColorMode = (mode, persist = true) => {
    const nextMode = mode === "light" ? "light" : "dark";
    updatePage(nextMode);
    if (persist) {
      try {
        localStorage.setItem(storageKey, nextMode);
      } catch (_) {}
    }
    window.dispatchEvent(new CustomEvent("fsu-color-mode-change", { detail: { mode: nextMode } }));
  };

  document.addEventListener("DOMContentLoaded", () => {
    updatePage(root.dataset.colorMode);
    document.querySelectorAll(".cinematic-theme-switcher").forEach((switcher) => {
      switcher.addEventListener("click", () => {
        switcher.classList.remove("is-burst");
        void switcher.offsetWidth;
        switcher.classList.add("is-burst");
        window.setFSUColorMode(root.dataset.colorMode === "dark" ? "light" : "dark");
        window.setTimeout(() => switcher.classList.remove("is-burst"), 1000);
      });
    });
  });

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) updatePage(event.newValue === "light" ? "light" : "dark");
  });
})();
