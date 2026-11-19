(() => {
  window.FSU_THEME_STORAGE_KEY = "fsu-theme-selected";
  const DEFAULT_THEME_KEY = "fsu_blue";

  window.FSUThemes = {
    fsu_blue: {
      name: "FSU Azul Elétrico (Padrão)",
      accent: "#016CF1",
      "accent-dark": "#0152CF",
      "accent-light": "#3b8bf7",
      "accent-glow": "rgba(1, 108, 241, 0.45)",
      "accent-rgb": "1, 108, 241"
    },
    royal_navy: {
      name: "Azul Royal Intenso",
      accent: "#0152CF",
      "accent-dark": "#016CF1",
      "accent-light": "#016CF1",
      "accent-glow": "rgba(1, 82, 207, 0.45)",
      "accent-rgb": "1, 82, 207"
    }
  };

  const ACCENT_PROPERTIES = ["accent", "accent-dark", "accent-light", "accent-glow", "accent-rgb"];

  window.applyFSUTheme = function applyFSUTheme(themeKey) {
    const selectedKey = Object.hasOwn(window.FSUThemes, themeKey) ? themeKey : DEFAULT_THEME_KEY;
    const theme = window.FSUThemes[selectedKey];
    const root = document.documentElement;

    for (const property of ACCENT_PROPERTIES) {
      root.style.setProperty(`--ui-${property}`, theme[property]);
    }

    root.style.removeProperty("--bg-body");
    root.style.removeProperty("--bg-card");

    try {
      localStorage.setItem(window.FSU_THEME_STORAGE_KEY, selectedKey);
    } catch (_) {}
  };
})();
