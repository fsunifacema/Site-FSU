import type { Cleanup } from "./types";

const ITEM_SELECTOR = ".accordion-item, .faq-item";
const TRIGGER_SELECTOR = ".accordion-header, .faq-question-btn";

const setOpen = (item: Element, open: boolean) => {
  item.classList.toggle("is-open", open);
  item.querySelector(TRIGGER_SELECTOR)?.setAttribute("aria-expanded", String(open));
};

export function mountAccordions(): Cleanup {
  const controller = new AbortController();

  document.querySelectorAll(ITEM_SELECTOR).forEach((item) => {
    item.querySelector(TRIGGER_SELECTOR)?.addEventListener(
      "click",
      () => {
        const willOpen = !item.classList.contains("is-open");
        item.parentElement?.querySelectorAll(ITEM_SELECTOR).forEach((sibling) => {
          if (sibling !== item) setOpen(sibling, false);
        });
        setOpen(item, willOpen);
      },
      { signal: controller.signal }
    );
  });

  return () => controller.abort();
}
