import type { Cleanup } from "./types";

export function mountHeaderScroll(): Cleanup {
  const header = document.querySelector<HTMLElement>(".site-header");
  if (!header) return () => {};

  const controller = new AbortController();
  let lastScrollY = Math.max(0, window.scrollY);
  let direction = 0;
  let distanceInDirection = 0;
  let frame = 0;

  const handleScroll = () => {
    frame = 0;
    const scrollY = Math.max(0, window.scrollY);
    const delta = scrollY - lastScrollY;
    const focused = document.activeElement;
    const keyboardFocusInHeader =
      focused instanceof Element && header.contains(focused) && focused.matches(":focus-visible");
    lastScrollY = scrollY;

    header.classList.toggle("is-scrolled", scrollY > 20);

    if (scrollY <= header.offsetHeight + 24 || keyboardFocusInHeader) {
      header.classList.remove("is-hidden");
      direction = 0;
      distanceInDirection = 0;
      return;
    }
    if (delta === 0) return;

    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) {
      direction = nextDirection;
      distanceInDirection = 0;
    }
    distanceInDirection += Math.abs(delta);

    if (direction > 0 && scrollY > header.offsetHeight + 48 && distanceInDirection >= 28) {
      header.classList.add("is-hidden");
    } else if (direction < 0 && distanceInDirection >= 18) {
      header.classList.remove("is-hidden");
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = requestAnimationFrame(handleScroll);
    },
    { passive: true, signal: controller.signal }
  );
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"), { signal: controller.signal });
  handleScroll();

  return () => {
    controller.abort();
    cancelAnimationFrame(frame);
  };
}
