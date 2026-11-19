document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".marquee-track").forEach((track) => {
    const group = track.querySelector(".marquee-group");
    if (!group) return;

    for (let copy = 0; copy < 2; copy++) {
      const clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }

    const glass = document.createElement("span");
    glass.className = "marquee-glass";
    glass.setAttribute("aria-hidden", "true");
    track.prepend(glass);

    const showGlass = (item) => {
      glass.style.left = `${item.offsetLeft - 10}px`;
      glass.style.width = `${item.offsetWidth + 20}px`;
      track.classList.add("has-glass");
    };

    const hideGlass = () => track.classList.remove("has-glass");

    track.addEventListener("pointerover", (event) => {
      if (!(event.target instanceof Element)) return;
      const item = event.target.closest(".marquee-item");
      if (item) showGlass(item);
    });
    track.addEventListener("pointerleave", hideGlass);

    let pressedItem = null;
    const releaseItem = () => {
      pressedItem?.classList.remove("is-pressed");
      pressedItem = null;
      track.classList.remove("is-pressed");
    };

    track.addEventListener("pointerdown", (event) => {
      if (!(event.target instanceof Element)) return;
      const item = event.target.closest(".marquee-item");
      if (!item) return;
      releaseItem();
      pressedItem = item;
      item.classList.add("is-pressed");
      track.classList.add("is-pressed");
      showGlass(item);
    });

    window.addEventListener("pointerup", (event) => {
      releaseItem();
      if (event.pointerType !== "mouse") hideGlass();
    });
    window.addEventListener("pointercancel", () => {
      releaseItem();
      hideGlass();
    });
    track.classList.add("is-ready");
  });
});
