document.addEventListener("DOMContentLoaded", () => {
  const launcher = document.querySelector(".glass-sidebar-launcher");
  const backdrop = document.querySelector(".glass-sidebar-backdrop");
  const sidebar = document.getElementById("glassSidebar");
  if (!launcher || !backdrop || !sidebar) return;

  const closeButton = sidebar.querySelector(".glass-sidebar-toggle");
  const list = sidebar.querySelector(".glass-sidebar-list");
  const indicator = sidebar.querySelector(".glass-sidebar-indicator");
  const items = [...sidebar.querySelectorAll(".glass-sidebar-item")];
  const targets = items.map((item) => document.querySelector(item.getAttribute("href")));
  if (!closeButton || !list || !indicator || !items.length) return;

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

  const activate = (item) => {
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

  launcher.addEventListener("click", openSidebar);
  closeButton.addEventListener("click", closeSidebar);
  backdrop.addEventListener("click", closeSidebar);
  items.forEach((item) =>
    item.addEventListener("click", () => {
      activate(item);
      closeSidebar();
    })
  );

  document.addEventListener("keydown", (event) => {
    if (!sidebar.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeSidebar();
    } else if (event.key === "Tab") {
      const focusable = [closeButton, ...items];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  let scrollScheduled = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        updateFromScroll();
        scrollScheduled = false;
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", updateIndicator, { passive: true });
  list.addEventListener("scroll", updateIndicator, { passive: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(sidebar);
    observer.observe(list);
  }

  requestAnimationFrame(updateFromScroll);
});
