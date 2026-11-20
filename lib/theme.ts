export type ColorMode = "light" | "dark";

export const COLOR_MODE_STORAGE_KEY = "fsu-color-mode";
export const ACCENT_STORAGE_KEY = "fsu-theme-selected";

const ACCENT_THEMES = {
  royal_navy: {
    accent: "#0152CF",
    "accent-dark": "#016CF1",
    "accent-light": "#016CF1",
    "accent-glow": "rgba(1, 82, 207, 0.45)",
    "accent-rgb": "1, 82, 207"
  }
} as const;

export const THEME_BOOT_SCRIPT = `(() => {
  const root = document.documentElement;
  let mode = "dark";
  let accent = null;
  try {
    if (localStorage.getItem(${JSON.stringify(COLOR_MODE_STORAGE_KEY)}) === "light") mode = "light";
    accent = localStorage.getItem(${JSON.stringify(ACCENT_STORAGE_KEY)});
  } catch (_) {}
  root.dataset.colorMode = mode;
  root.style.colorScheme = mode;
  const themes = ${JSON.stringify(ACCENT_THEMES)};
  const theme = accent && Object.hasOwn(themes, accent) ? themes[accent] : null;
  if (theme) for (const key in theme) root.style.setProperty("--ui-" + key, theme[key]);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    root.classList.add("has-reveal");
  }
})();`;
