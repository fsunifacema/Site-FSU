import type { Cleanup } from "./types";

export function mountScrollReveal(): Cleanup {
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!targets.length || reduceMotion) return () => {};

  const root = document.documentElement;
  root.classList.add("has-reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );
  targets.forEach((target) => {
    [...target.children].forEach((child, index) =>
      (child as HTMLElement).style.setProperty("--reveal-index", String(index))
    );
    observer.observe(target);
  });

  return () => observer.disconnect();
}
