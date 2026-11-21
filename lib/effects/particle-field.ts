import type { Cleanup } from "./types";

const GLYPHS = "01FSU<>/{}+";
const LINK_LEVELS = 6;
// Toque (celular): menos quadros, menos pixels e menos partículas; o efeito é de fundo e o visual se mantém.
const TOUCH = typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;
const FRAME_INTERVAL = 1000 / (TOUCH ? 24 : 30);
const MAX_PIXEL_RATIO = TOUCH ? 1.5 : 2;
const DENSITY = TOUCH ? 0.6 : 1;

type Particle = { x: number; y: number; vx: number; vy: number; glyph: string };
type Beam = { x: number; y: number; length: number; speed: number; alpha: number; gradient?: CanvasGradient };

export function mountParticleField(canvas: HTMLCanvasElement): Cleanup {
  const context = canvas.getContext("2d", { alpha: true });
  const host = canvas.parentElement;
  if (!context || !host) return () => {};

  const controller = new AbortController();
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const isHeader = canvas.dataset.particleField === "header";
  const linkDistance = isHeader ? 90 : 125;
  const pointerReach = isHeader ? 70 : 150;
  const linkAlpha = isHeader ? 0.17 : 0.2;
  const fontSize = isHeader ? 10 : 12;
  const glyphBox = Math.ceil(fontSize * 1.6);
  const baseAlpha = isHeader ? 0.52 : 0.58;
  const nearAlpha = 0.78;
  const linkPaths: number[][] = Array.from({ length: LINK_LEVELS }, () => []);
  const mouse = { x: -1000, y: -1000 };

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let nodes: Particle[] = [];
  let beams: Beam[] = [];
  let accent = "1, 108, 241";
  let visible = true;
  let frameId = 0;
  let previousTime = 0;
  // Cada símbolo é desenhado uma vez numa tela fora da página e copiado com drawImage a cada quadro:
  // fillText por partícula e por quadro era o maior custo do efeito (MDN, Optimizing canvas).
  let sprites = new Map<string, HTMLCanvasElement>();

  const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  const color = (alpha: number) => `rgba(${accent}, ${alpha})`;

  function paintBeam(beam: Beam) {
    beam.gradient = context!.createLinearGradient(0, 0, 0, beam.length);
    beam.gradient.addColorStop(0, color(beam.alpha));
    beam.gradient.addColorStop(1, color(0));
  }

  function buildSprites() {
    const next = new Map<string, HTMLCanvasElement>();
    const side = Math.ceil(glyphBox * pixelRatio);
    for (const alpha of [baseAlpha, nearAlpha]) {
      for (const glyph of GLYPHS) {
        const sprite = document.createElement("canvas");
        sprite.width = side;
        sprite.height = side;
        const spriteContext = sprite.getContext("2d");
        if (!spriteContext) return;
        spriteContext.scale(pixelRatio, pixelRatio);
        spriteContext.font = `${fontSize}px ui-monospace, Consolas, monospace`;
        spriteContext.textAlign = "center";
        spriteContext.textBaseline = "middle";
        spriteContext.fillStyle = color(alpha);
        spriteContext.fillText(glyph, glyphBox / 2, glyphBox / 2);
        next.set(alpha + glyph, sprite);
      }
    }
    sprites = next;
  }

  function updateAccent() {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--ui-accent-rgb").trim();
    if (/^\d+\s*,\s*\d+\s*,\s*\d+$/.test(value) && value !== accent) {
      accent = value;
      beams.forEach(paintBeam);
      buildSprites();
    }
    if (motionPreference.matches) draw(0);
  }

  function makeParticles() {
    const full = isHeader
      ? Math.min(30, Math.max(12, Math.round(width / 70)))
      : Math.min(65, Math.max(24, Math.round((width * height) / 14500)));
    const count = Math.round(full * DENSITY);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isHeader ? 0.12 : 0.2),
      vy: 0.08 + Math.random() * (isHeader ? 0.12 : 0.2),
      glyph: randomGlyph()
    }));
    beams = Array.from({ length: isHeader ? 3 : 8 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: isHeader ? 16 + Math.random() * 35 : 55 + Math.random() * 90,
      speed: isHeader ? 0.25 + Math.random() * 0.4 : 0.5 + Math.random() * 0.9,
      alpha: 0.18 + Math.random() * 0.17
    }));
    beams.forEach(paintBeam);
  }

  function resize() {
    const bounds = host!.getBoundingClientRect();
    const nextWidth = Math.round(bounds.width);
    const nextHeight = Math.round(bounds.height);
    if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return;
    width = nextWidth;
    height = nextHeight;
    const nextRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    if (nextRatio !== pixelRatio || !sprites.size) {
      pixelRatio = nextRatio;
      buildSprites();
    }
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    makeParticles();
    draw(0);
  }

  function drawLinks() {
    const ctx = context!;
    const maxSquared = linkDistance * linkDistance;
    for (const path of linkPaths) path.length = 0;
    for (let i = 0; i < nodes.length; i++) {
      const first = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const second = nodes[j];
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        const squared = dx * dx + dy * dy;
        if (squared >= maxSquared) continue;
        const closeness = 1 - Math.sqrt(squared) / linkDistance;
        const level = Math.min(LINK_LEVELS - 1, Math.floor(closeness * LINK_LEVELS));
        linkPaths[level].push(first.x, first.y, second.x, second.y);
      }
    }
    ctx.lineWidth = 0.55;
    linkPaths.forEach((points, level) => {
      if (!points.length) return;
      ctx.strokeStyle = color(linkAlpha * ((level + 0.5) / LINK_LEVELS));
      ctx.beginPath();
      for (let k = 0; k < points.length; k += 4) {
        ctx.moveTo(points[k], points[k + 1]);
        ctx.lineTo(points[k + 2], points[k + 3]);
      }
      ctx.stroke();
    });
  }

  function draw(delta: number) {
    if (!width || !height) return;
    const ctx = context!;
    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = isHeader ? 1 : 1.4;
    for (const beam of beams) {
      beam.y -= beam.speed * delta;
      if (beam.y + beam.length < 0) {
        beam.y = height + beam.length;
        beam.x = Math.random() * width;
      }
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, beam.x * pixelRatio, beam.y * pixelRatio);
      ctx.strokeStyle = beam.gradient ?? color(beam.alpha);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, beam.length);
      ctx.stroke();
    }
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    drawLinks();

    for (const node of nodes) {
      node.x += node.vx * delta;
      node.y += node.vy * delta;
      if (node.y > height + 12) node.y = -12;
      if (node.x < -12) node.x = width + 12;
      if (node.x > width + 12) node.x = -12;

      const distance = Math.hypot(mouse.x - node.x, mouse.y - node.y);
      const nearby = distance < pointerReach;
      if (delta && (nearby ? Math.random() < 0.045 : Math.random() < 0.003)) {
        node.glyph = randomGlyph();
      }
      if (nearby) {
        ctx.strokeStyle = color(0.18 * (1 - distance / pointerReach));
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
      const sprite = sprites.get((nearby ? nearAlpha : baseAlpha) + node.glyph);
      if (sprite) ctx.drawImage(sprite, node.x - glyphBox / 2, node.y - glyphBox / 2, glyphBox, glyphBox);
    }
  }

  function tick(now: number) {
    frameId = 0;
    if (previousTime && now - previousTime < FRAME_INTERVAL - 1) {
      start();
      return;
    }
    const delta = previousTime ? Math.min((now - previousTime) / 16.67, 2) : 1;
    previousTime = now;
    draw(delta);
    start();
  }

  function start() {
    if (frameId || !visible || document.hidden || motionPreference.matches) return;
    frameId = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    previousTime = 0;
  }

  const options = { signal: controller.signal };
  host.addEventListener(
    "pointermove",
    (event) => {
      const bounds = host.getBoundingClientRect();
      mouse.x = event.clientX - bounds.left;
      mouse.y = event.clientY - bounds.top;
      if (motionPreference.matches) draw(0);
    },
    { ...options, passive: true }
  );
  host.addEventListener(
    "pointerleave",
    () => {
      mouse.x = -1000;
      mouse.y = -1000;
      if (motionPreference.matches) draw(0);
    },
    options
  );
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) stop();
      else start();
    },
    options
  );
  motionPreference.addEventListener(
    "change",
    () => {
      if (motionPreference.matches) {
        stop();
        draw(0);
      } else start();
    },
    options
  );

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  intersectionObserver.observe(host);
  const accentObserver = new MutationObserver(updateAccent);
  accentObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });

  updateAccent();
  resize();
  start();

  return () => {
    stop();
    controller.abort();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    accentObserver.disconnect();
  };
}
