import type { Cleanup } from "./types";

const MAX_TILT_DEG = 7;
const PHOTO_SHIFT_PX = 10;

const DECOR_CLASSES = ["developer-card-sheen", "developer-card-ring"] as const;

export function mountCardMotion(): Cleanup {
  const gallery = document.querySelector<HTMLElement>(".developers-gallery");
  if (!gallery) return () => {};

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const cards = [...gallery.querySelectorAll<HTMLElement>(".developer-card")];
  const decorations: HTMLElement[] = [];

  cards.forEach((card, index) => {
    card.style.setProperty("--card-index", String(index));
    card.classList.add("has-motion");
    for (const className of DECOR_CLASSES) {
      const span = document.createElement("span");
      span.className = className;
      span.setAttribute("aria-hidden", "true");
      card.append(span);
      decorations.push(span);
    }
  });

  let frame = 0;
  let pending: { card: HTMLElement; x: number; y: number } | null = null;

  const resetTilt = (card: HTMLElement) => {
    card.classList.remove("is-tilting");
    for (const name of ["--tilt-x", "--tilt-y", "--photo-x", "--photo-y"]) card.style.removeProperty(name);
  };

  const applyTilt = () => {
    frame = 0;
    if (!pending) return;
    const { card, x, y } = pending;
    pending = null;
    const rect = card.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (x - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (y - rect.top) / rect.height));
    const flipped = card.classList.contains("is-flipped");
    card.classList.add("is-tilting");
    card.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
    card.style.setProperty("--tilt-x", `${((0.5 - py) * MAX_TILT_DEG * 2 * (flipped ? 0.4 : 1)).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${((px - 0.5) * MAX_TILT_DEG * 2 * (flipped ? 0.4 : 1)).toFixed(2)}deg`);
    card.style.setProperty("--photo-x", `${((0.5 - px) * PHOTO_SHIFT_PX).toFixed(1)}px`);
    card.style.setProperty("--photo-y", `${((0.5 - py) * PHOTO_SHIFT_PX * 0.6).toFixed(1)}px`);
  };

  const tiltEnabled = () => finePointer.matches && !reduceMotion.matches;

  cards.forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        if (!tiltEnabled() || !card.classList.contains("is-active")) return;
        pending = { card, x: event.clientX, y: event.clientY };
        if (!frame) frame = requestAnimationFrame(applyTilt);
      },
      options
    );
    card.addEventListener("pointerleave", () => resetTilt(card), options);
    card.addEventListener(
      "animationend",
      (event) => {
        if (event.animationName === "card-sweep") card.classList.remove("is-sweeping");
      },
      options
    );
  });

  const activationObserver = new MutationObserver((records) => {
    for (const record of records) {
      const card = record.target as HTMLElement;
      const wasActive = (record.oldValue ?? "").split(/\s+/).includes("is-active");
      const isActive = card.classList.contains("is-active");
      if (isActive && !wasActive && !reduceMotion.matches) {
        card.classList.remove("is-sweeping");
        void card.offsetWidth;
        card.classList.add("is-sweeping");
      }
      if (!isActive && wasActive) {
        resetTilt(card);
        card.classList.remove("is-sweeping");
      }
    }
  });
  cards.forEach((card) =>
    activationObserver.observe(card, { attributes: true, attributeFilter: ["class"], attributeOldValue: true })
  );

  // O anel do card ativo só gira com a seção na tela (cards-premium.css pausa fora dela).
  const section = gallery.closest<HTMLElement>(".developers-section");
  const visibilityObserver = new IntersectionObserver(([entry]) =>
    section?.classList.toggle("is-onscreen", entry.isIntersecting)
  );
  visibilityObserver.observe(gallery);

  return () => {
    controller.abort();
    activationObserver.disconnect();
    visibilityObserver.disconnect();
    section?.classList.remove("is-onscreen");
    cancelAnimationFrame(frame);
    decorations.forEach((span) => span.remove());
    cards.forEach((card) => {
      resetTilt(card);
      card.classList.remove("has-motion", "is-sweeping");
      for (const name of ["--card-index", "--glare-x", "--glare-y"]) card.style.removeProperty(name);
    });
  };
}
