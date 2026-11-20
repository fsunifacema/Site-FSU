import type { Cleanup } from "./types";

const IMAGE_ROOT = "/assets/images/";

const TECHNOLOGIES: Record<string, string[]> = {
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

type TechnologyMotion = { start: () => void; stop: () => void; dispose: Cleanup };
type PhysicsBody = {
  image: HTMLImageElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
};

export function mountDevelopersGallery(): Cleanup {
  const gallery = document.querySelector<HTMLElement>(".developers-gallery");
  if (!gallery) return () => {};

  const controller = new AbortController();
  const options = { signal: controller.signal };
  const cards = [...gallery.querySelectorAll<HTMLElement>(".developer-card")];
  const motions = new Map<HTMLElement, TechnologyMotion>();

  for (const [name, sources] of Object.entries(TECHNOLOGIES)) {
    const card = gallery.querySelector<HTMLElement>(`.developer-card--${name}`);
    if (card) motions.set(card, createTechnologyPhysics(card, sources));
  }

  const setFlipped = (card: HTMLElement, flipped: boolean) => {
    if (!card.classList.contains("developer-card--flip")) return;
    const changed = card.classList.contains("is-flipped") !== flipped;
    card.classList.toggle("is-flipped", flipped);
    const control = card.querySelector(".developer-flip-trigger") ?? card;
    const back = card.querySelector<HTMLElement>(".developer-card-back");
    const name = card.querySelector(".developer-bio-name")?.textContent ?? "";
    control.setAttribute("aria-expanded", String(flipped));
    control.setAttribute("aria-label", flipped ? `Voltar à foto de ${name}` : `Ver biografia de ${name}`);
    card.querySelector(".developer-card-front")?.setAttribute("aria-hidden", String(flipped));
    back?.setAttribute("aria-hidden", String(!flipped));
    const github = card.querySelector<HTMLElement>(".developer-github");
    if (github) github.tabIndex = flipped ? 0 : -1;
    if (!flipped && back) back.scrollTop = 0;
    if (changed) motions.get(card)?.[flipped ? "start" : "stop"]();
  };

  const activate = (card: HTMLElement) => {
    cards.forEach((item) => {
      const selected = item === card;
      if (!selected) setFlipped(item, false);
      item.classList.toggle("is-active", selected);
      (item.querySelector(".developer-flip-trigger") ?? item).setAttribute("aria-pressed", String(selected));
    });
  };

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  cards.forEach((card) => {
    card.addEventListener(
      "click",
      (event) => {
        if (event.target instanceof Element && event.target.closest("a")) return;
        activate(card);
        setFlipped(card, !card.classList.contains("is-flipped"));
      },
      options
    );
    card.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") setFlipped(card, false);
        if (card.classList.contains("is-flipped") && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
          event.preventDefault();
          const back = card.querySelector<HTMLElement>(".developer-card-back");
          if (back) back.scrollTop += event.key === "ArrowDown" ? 40 : -40;
        }
      },
      options
    );
    card.addEventListener("focusin", () => activate(card), options);
    if (finePointer) card.addEventListener("pointerenter", () => activate(card), options);
  });

  return () => {
    controller.abort();
    motions.forEach((motion) => motion.dispose());
  };
}

function createTechnologyPhysics(card: HTMLElement, sources: string[]): TechnologyMotion {
  const back = card.querySelector<HTMLElement>(".developer-card-back");
  if (!back) return { start() {}, stop() {}, dispose() {} };

  const controller = new AbortController();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const layer = document.createElement("span");
  layer.className = "developer-tech-physics";
  layer.setAttribute("aria-hidden", "true");
  const bodies: PhysicsBody[] = sources.map((source) => {
    const image = document.createElement("img");
    image.src = IMAGE_ROOT + source;
    image.alt = "";
    image.draggable = false;
    layer.appendChild(image);
    return { image, x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0 };
  });
  back.prepend(layer);

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
    width = back!.clientWidth;
    height = back!.clientHeight;
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

  function collide() {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= size || distance < 0.01) continue;
        const nx = dx / distance;
        const ny = dy / distance;
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
  }

  function start() {
    stop();
    reset();
    if (reduce.matches || document.hidden) return;
    let previous = 0;
    let elapsed = 0;
    const tick = (time: number) => {
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
        collide();
        bodies.forEach((body) => {
          body.x = Math.max(0, Math.min(width - size, body.x));
          body.y = Math.min(height - size - 8, body.y);
        });
        paint();
      }
      frame = elapsed < 6 ? requestAnimationFrame(tick) : 0;
    };
    frame = requestAnimationFrame(tick);
  }

  const resizeObserver = new ResizeObserver(() => {
    if (card.classList.contains("is-flipped") && Math.abs(back.clientWidth - width) > 2) start();
  });
  resizeObserver.observe(back);
  reduce.addEventListener(
    "change",
    () => {
      if (card.classList.contains("is-flipped")) start();
    },
    { signal: controller.signal }
  );
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) stop();
    },
    { signal: controller.signal }
  );

  return {
    start,
    stop,
    dispose() {
      stop();
      controller.abort();
      resizeObserver.disconnect();
      layer.remove();
    }
  };
}
