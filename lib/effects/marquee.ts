import type { Cleanup } from "./types";

export function mountMarquee(track: HTMLElement): Cleanup {
  const glass = track.querySelector<HTMLElement>(".marquee-glass");
  if (!glass) return () => {};
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let pressedItem: HTMLElement | null = null;

  const itemFrom = (target: EventTarget | null) =>
    target instanceof Element ? target.closest<HTMLElement>(".marquee-item") : null;

  const showGlass = (item: HTMLElement) => {
    glass.style.left = `${item.offsetLeft - 10}px`;
    glass.style.width = `${item.offsetWidth + 20}px`;
    track.classList.add("has-glass");
  };
  const hideGlass = () => track.classList.remove("has-glass");
  const releaseItem = () => {
    pressedItem?.classList.remove("is-pressed");
    pressedItem = null;
    track.classList.remove("is-pressed");
  };

  track.addEventListener(
    "pointerover",
    (event) => {
      const item = itemFrom(event.target);
      if (item) showGlass(item);
    },
    options
  );
  track.addEventListener("pointerleave", hideGlass, options);
  track.addEventListener(
    "pointerdown",
    (event) => {
      const item = itemFrom(event.target);
      if (!item) return;
      releaseItem();
      pressedItem = item;
      item.classList.add("is-pressed");
      track.classList.add("is-pressed");
      showGlass(item);
    },
    options
  );
  window.addEventListener(
    "pointerup",
    (event) => {
      releaseItem();
      if (event.pointerType !== "mouse") hideGlass();
    },
    options
  );
  window.addEventListener(
    "pointercancel",
    () => {
      releaseItem();
      hideGlass();
    },
    options
  );
  track.classList.add("is-ready");

  return () => {
    controller.abort();
    track.classList.remove("is-ready", "has-glass", "is-pressed");
  };
}
