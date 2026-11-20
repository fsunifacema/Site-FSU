import { COLOR_MODE_STORAGE_KEY, type ColorMode } from "@/lib/theme";

import type { Cleanup } from "./types";

const BURST_MS = 1000;

function applyColorMode(mode: ColorMode) {
  const light = mode === "light";
  const root = document.documentElement;
  root.dataset.colorMode = mode;
  root.style.colorScheme = mode;

  document.querySelectorAll<HTMLElement>(".cinematic-theme-switcher").forEach((switcher) => {
    switcher.dataset.theme = mode;
    switcher.setAttribute("aria-checked", String(!light));
    switcher.setAttribute("aria-label", light ? "Alternar para modo escuro" : "Alternar para modo claro");
  });
}

const currentMode = (): ColorMode => (document.documentElement.dataset.colorMode === "light" ? "light" : "dark");

export function mountColorMode(): Cleanup {
  const controller = new AbortController();
  const timers = new Set<number>();
  applyColorMode(currentMode());

  document.querySelectorAll<HTMLElement>(".cinematic-theme-switcher").forEach((switcher) => {
    switcher.addEventListener(
      "click",
      () => {
        switcher.classList.remove("is-burst");
        void switcher.offsetWidth;
        switcher.classList.add("is-burst");

        const next: ColorMode = currentMode() === "dark" ? "light" : "dark";
        applyColorMode(next);
        try {
          localStorage.setItem(COLOR_MODE_STORAGE_KEY, next);
        } catch {}

        const timer = window.setTimeout(() => {
          timers.delete(timer);
          switcher.classList.remove("is-burst");
        }, BURST_MS);
        timers.add(timer);
      },
      { signal: controller.signal }
    );
  });

  window.addEventListener(
    "storage",
    (event) => {
      if (event.key === COLOR_MODE_STORAGE_KEY) applyColorMode(event.newValue === "light" ? "light" : "dark");
    },
    { signal: controller.signal }
  );

  return () => {
    controller.abort();
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}
