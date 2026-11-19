const SITE_CONFIG = {
  formSuccessMessage: "Obrigado! Recebemos sua mensagem e entraremos em contato em até 2 horas.",

  closeSiblingAccordions: true
};

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initAccordions();
  initDevelopersGallery();
  initContactModal();
  initSmoothScroll();
  restoreAccentTheme();
  initScrollReveal();
});

function initDevelopersGallery() {
  const gallery = document.querySelector(".developers-gallery");
  if (!gallery) return;

  const cards = [...gallery.querySelectorAll(".developer-card")];
  const technologyMotion = new Map();
  const technologies = {
    marcelo: [
      "technologies/php.svg",
      "technologies/laravel.svg",
      "technologies/docker.svg",
      "marquee/react.svg",
      "marquee/javascript.svg",
      "technologies/html5.svg",
      "technologies/css3.svg"
    ],
    felipe: [
      "technologies/typescript.svg",
      "technologies/nextjs.svg",
      "technologies/laravel.svg",
      "technologies/linux.svg",
      "technologies/cybersecurity.svg"
    ],
    isac: [
      "marquee/javascript.svg",
      "technologies/php.svg",
      "technologies/roblox.svg",
      "technologies/blender.svg",
      "technologies/davinci-resolve.svg",
      "technologies/cybersecurity.svg"
    ],
    thiago: [
      "technologies/html5.svg",
      "technologies/css3.svg",
      "marquee/javascript.svg",
      "technologies/typescript.svg",
      "marquee/react.svg",
      "marquee/tailwind.svg",
      "technologies/php.svg"
    ]
  };
  for (const [name, sources] of Object.entries(technologies)) {
    const card = gallery.querySelector(`.developer-card--${name}`);
    if (card) technologyMotion.set(card, createTechnologyPhysics(card, sources));
  }
  const setFlipped = (card, flipped) => {
    if (!card.classList.contains("developer-card--flip")) return;
    const changed = card.classList.contains("is-flipped") !== flipped;
    card.classList.toggle("is-flipped", flipped);
    const control = card.querySelector(".developer-flip-trigger") || card;
    control.setAttribute("aria-expanded", String(flipped));
    const front = card.querySelector(".developer-card-front");
    const back = card.querySelector(".developer-card-back");
    front.setAttribute("aria-hidden", String(flipped));
    back.setAttribute("aria-hidden", String(!flipped));
    const name = card.querySelector(".developer-bio-name").textContent;
    control.setAttribute("aria-label", flipped ? `Voltar à foto de ${name}` : `Ver biografia de ${name}`);
    const github = card.querySelector(".developer-github");
    if (github) github.tabIndex = flipped ? 0 : -1;
    if (!flipped) back.scrollTop = 0;
    if (changed) technologyMotion.get(card)?.[flipped ? "start" : "stop"]();
  };
  const activate = (card) => {
    cards.forEach((item) => {
      const selected = item === card;
      if (!selected) setFlipped(item, false);
      item.classList.toggle("is-active", selected);
      (item.querySelector(".developer-flip-trigger") || item).setAttribute("aria-pressed", String(selected));
    });
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      activate(card);
      setFlipped(card, !card.classList.contains("is-flipped"));
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setFlipped(card, false);
      if (card.classList.contains("is-flipped") && ["ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        card.querySelector(".developer-card-back").scrollTop += event.key === "ArrowDown" ? 40 : -40;
      }
    });
    card.addEventListener("focusin", () => activate(card));
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      card.addEventListener("pointerenter", () => activate(card));
    }
  });
}

function createTechnologyPhysics(card, sources) {
  const back = card.querySelector(".developer-card-back");
  const layer = document.createElement("span");
  layer.className = "developer-tech-physics";
  layer.setAttribute("aria-hidden", "true");
  const bodies = sources.map((source) => {
    const image = document.createElement("img");
    image.src = `assets/images/${source}`;
    image.alt = "";
    image.draggable = false;
    layer.appendChild(image);
    return { image, x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0 };
  });
  back.prepend(layer);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let width = 0;
  let height = 0;
  let size = 40;
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const paint = () =>
    bodies.forEach((body) => {
      body.image.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.angle}deg)`;
    });
  function reset() {
    width = back.clientWidth;
    height = back.clientHeight;
    size = Math.min(44, Math.max(24, width / 7));
    layer.style.height = `${height}px`;
    bodies.forEach((body, i) => {
      body.image.style.width = `${size}px`;
      body.image.style.height = `${size}px`;
      body.x = (width - size) * (i / Math.max(1, bodies.length - 1));
      body.y = reduce.matches ? height - size - 12 : -size - (i % 3) * size;
      body.vx = (i % 2 ? -1 : 1) * (65 + i * 9);
      body.vy = 0;
      body.angle = (i % 2 ? -1 : 1) * 12;
      body.spin = (i % 2 ? -1 : 1) * (65 + i * 7);
    });
    paint();
  }
  function start() {
    stop();
    reset();
    if (reduce.matches || document.hidden) return;
    let previous = 0;
    let elapsed = 0;
    function tick(time) {
      const dt = previous ? Math.min((time - previous) / 1000, 1 / 30) : 0;
      previous = time;
      elapsed += dt;
      if (elapsed > 0.25) {
        bodies.forEach((body) => {
          body.vy += 850 * dt;
          body.x += body.vx * dt;
          body.y += body.vy * dt;
          body.angle += body.spin * dt;
          if (body.x < 0 || body.x > width - size) {
            body.x = Math.max(0, Math.min(width - size, body.x));
            body.vx *= -0.65;
            body.spin *= -0.7;
          }
          if (body.y > height - size - 8) {
            body.y = height - size - 8;
            body.vy = Math.abs(body.vy) < 35 ? 0 : -body.vy * 0.48;
            body.vx *= 0.94;
            body.spin *= 0.85;
          }
        });
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i],
              b = bodies[j];
            const dx = b.x - a.x,
              dy = b.y - a.y;
            const distance = Math.hypot(dx, dy);
            if (distance >= size || distance < 0.01) continue;
            const nx = dx / distance,
              ny = dy / distance;
            const overlap = (size - distance) / 2;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;
            const velocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (velocity < 0) {
              const impulse = -velocity * 0.7;
              a.vx -= impulse * nx;
              a.vy -= impulse * ny;
              b.vx += impulse * nx;
              b.vy += impulse * ny;
            }
          }
        }
        bodies.forEach((body) => {
          body.x = Math.max(0, Math.min(width - size, body.x));
          body.y = Math.min(height - size - 8, body.y);
        });
        paint();
      }
      frame = elapsed < 6 ? requestAnimationFrame(tick) : 0;
    }
    frame = requestAnimationFrame(tick);
  }
  new ResizeObserver(() => {
    if (card.classList.contains("is-flipped") && Math.abs(back.clientWidth - width) > 2) start();
  }).observe(back);
  reduce.addEventListener("change", () => {
    if (card.classList.contains("is-flipped")) start();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  return { start, stop };
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastScrollY = Math.max(0, window.scrollY);
  let direction = 0;
  let distanceInDirection = 0;
  let scheduled = false;

  const handleScroll = () => {
    const scrollY = Math.max(0, window.scrollY);
    const delta = scrollY - lastScrollY;
    const keyboardFocusInHeader =
      header.contains(document.activeElement) && document.activeElement.matches(":focus-visible");
    lastScrollY = scrollY;

    header.classList.toggle("is-scrolled", scrollY > 20);

    if (scrollY <= header.offsetHeight + 24 || keyboardFocusInHeader) {
      header.classList.remove("is-hidden");
      direction = 0;
      distanceInDirection = 0;
    } else if (delta !== 0) {
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
    }

    scheduled = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(handleScroll);
    },
    { passive: true }
  );
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
  handleScroll();
}

function initAccordions() {
  const ITEM_SELECTOR = ".accordion-item, .faq-item";
  const TRIGGER_SELECTOR = ".accordion-header, .faq-question-btn";

  const setOpen = (item, open) => {
    item.classList.toggle("is-open", open);
    item.querySelector(TRIGGER_SELECTOR)?.setAttribute("aria-expanded", String(open));
  };

  document.querySelectorAll(ITEM_SELECTOR).forEach((item) => {
    const trigger = item.querySelector(TRIGGER_SELECTOR);
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      if (SITE_CONFIG.closeSiblingAccordions && item.parentElement) {
        item.parentElement.querySelectorAll(ITEM_SELECTOR).forEach((sibling) => {
          if (sibling !== item) setOpen(sibling, false);
        });
      }
      setOpen(item, willOpen);
    });
  });
}

function initContactModal() {
  const modalOverlay = document.getElementById("contactModal");
  if (!modalOverlay) return;

  const closeBtn = modalOverlay.querySelector(".modal-close-btn");
  const contactForm = document.getElementById("leadForm");
  const feedbackBox = modalOverlay.querySelector(".form-feedback");

  window.openContactModal = (servicoPreSelecionado = "") => {
    modalOverlay.classList.add("is-visible");
    document.body.style.overflow = "hidden";

    if (servicoPreSelecionado && contactForm) {
      const select = contactForm.querySelector("#formInterest");
      if (select) select.value = servicoPreSelecionado;
    }
  };

  window.closeContactModal = () => {
    modalOverlay.classList.remove("is-visible");
    document.body.style.overflow = "";
    if (feedbackBox) feedbackBox.classList.remove("is-success");
  };

  document.querySelectorAll(".js-open-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const service = btn.getAttribute("data-service") || "";
      openContactModal(service);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeContactModal);
  }

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeContactModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("is-visible")) {
      closeContactModal();
    }
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (feedbackBox) {
        feedbackBox.textContent = SITE_CONFIG.formSuccessMessage;
        feedbackBox.classList.add("is-success");
      }

      contactForm.reset();

      setTimeout(() => {
        closeContactModal();
      }, 3000);
    });
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.startsWith("#/")) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

function restoreAccentTheme() {
  if (!window.applyFSUTheme) return;
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(window.FSU_THEME_STORAGE_KEY);
  } catch (_) {}
  window.applyFSUTheme(savedTheme);
}

function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!targets.length || reduceMotion || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("has-reveal");
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
    [...target.children].forEach((child, index) => child.style.setProperty("--reveal-index", String(index)));
    observer.observe(target);
  });
}
