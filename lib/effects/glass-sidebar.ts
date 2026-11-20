import type { Cleanup } from "./types";

export function mountGlassSidebar(): Cleanup {
  const launcher = document.querySelector<HTMLButtonElement>(".glass-sidebar-launcher");
  const backdrop = document.querySelector<HTMLElement>(".glass-sidebar-backdrop");
  const sidebar = document.getElementById("glassSidebar");
  const closeButton = sidebar?.querySelector<HTMLButtonElement>(".glass-sidebar-toggle");
  const list = sidebar?.querySelector<HTMLElement>(".glass-sidebar-list");
  const indicator = sidebar?.querySelector<HTMLElement>(".glass-sidebar-indicator");
  const items = sidebar ? [...sidebar.querySelectorAll<HTMLAnchorElement>(".glass-sidebar-item")] : [];
  if (!launcher || !backdrop || !sidebar || !closeButton || !list || !indicator || !items.length) return () => {};

  const targets = items.map((item) => document.querySelector(item.getAttribute("href") ?? ""));
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let scrollFrame = 0;

  const updateIndicator = () => {
    const active = sidebar.querySelector('.glass-sidebar-item[aria-current="page"]');
    if (!active) return;
    const itemRect = active.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    indicator.style.left = `${itemRect.left - listRect.left + list.scrollLeft}px`;
    indicator.style.top = `${itemRect.top - listRect.top + list.scrollTop}px`;
    indicator.style.width = `${itemRect.width}px`;
    indicator.style.height = `${itemRect.height}px`;
    sidebar.classList.add("is-ready");
  };

  const activate = (item: HTMLAnchorElement) => {
    items.forEach((link) => {
      if (link === item) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    updateIndicator();
  };

  const updateFromScroll = () => {
    const threshold = window.innerHeight * 0.38;
    let selected = 0;
    targets.forEach((target, index) => {
      if (target && target.getBoundingClientRect().top <= threshold) selected = index;
    });
    activate(items[selected]);
  };

  const openSidebar = () => {
    sidebar.removeAttribute("inert");
    sidebar.setAttribute("aria-hidden", "false");
    sidebar.classList.add("is-open");
    backdrop.classList.add("is-open");
    document.body.classList.add("glass-sidebar-open");
    launcher.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      updateFromScroll();
      closeButton.focus({ preventScroll: true });
    });
  };

  const closeSidebar = () => {
    sidebar.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    sidebar.setAttribute("inert", "");
    sidebar.setAttribute("aria-hidden", "true");
    document.body.classList.remove("glass-sidebar-open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus({ preventScroll: true });
  };

  launcher.addEventListener("click", openSidebar, options);
  closeButton.addEventListener("click", closeSidebar, options);
  backdrop.addEventListener("click", closeSidebar, options);
  items.forEach((item) =>
    item.addEventListener(
      "click",
      () => {
        activate(item);
        closeSidebar();
      },
      options
    )
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (!sidebar.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeSidebar();
      } else if (event.key === "Tab") {
        const first = closeButton;
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    options
  );

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        updateFromScroll();
      });
    },
    { ...options, passive: true }
  );
  window.addEventListener("resize", updateIndicator, { ...options, passive: true });
  list.addEventListener("scroll", updateIndicator, { ...options, passive: true });

  const resizeObserver = new ResizeObserver(updateIndicator);
  resizeObserver.observe(sidebar);
  resizeObserver.observe(list);
  const initialFrame = requestAnimationFrame(updateFromScroll);

  return () => {
    controller.abort();
    resizeObserver.disconnect();
    cancelAnimationFrame(scrollFrame);
    cancelAnimationFrame(initialFrame);
    document.body.classList.remove("glass-sidebar-open");
  };
}
