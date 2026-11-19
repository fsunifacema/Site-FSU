(() => {
  const glyphs = "01FSU<>/{}+";
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  function createField(canvas) {
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const host = canvas.parentElement;
    const isHeader = canvas.dataset.particleField === "header";
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let nodes = [];
    let beams = [];
    let accent = "1, 108, 241";
    let visible = true;
    let frameId = 0;
    let previousTime = 0;
    const mouse = { x: -1000, y: -1000 };

    const randomGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)];
    const color = (alpha) => `rgba(${accent}, ${alpha})`;
    const linkDistance = isHeader ? 90 : 125;
    const pointerReach = isHeader ? 70 : 150;
    const linkAlpha = isHeader ? 0.17 : 0.2;
    const LINK_LEVELS = 6;
    const linkPaths = Array.from({ length: LINK_LEVELS }, () => []);

    function updateAccent() {
      const value = getComputedStyle(document.documentElement).getPropertyValue("--ui-accent-rgb").trim();
      if (/^\d+\s*,\s*\d+\s*,\s*\d+$/.test(value) && value !== accent) {
        accent = value;
        beams.forEach(paintBeam);
      }
      if (motionPreference.matches) draw(0);
    }

    function paintBeam(beam) {
      beam.gradient = context.createLinearGradient(0, 0, 0, beam.length);
      beam.gradient.addColorStop(0, color(beam.alpha));
      beam.gradient.addColorStop(1, color(0));
    }

    function makeParticles() {
      const count = isHeader
        ? Math.min(30, Math.max(12, Math.round(width / 70)))
        : Math.min(65, Math.max(24, Math.round((width * height) / 14500)));
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
      const bounds = host.getBoundingClientRect();
      const nextWidth = Math.round(bounds.width);
      const nextHeight = Math.round(bounds.height);
      if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return;
      width = nextWidth;
      height = nextHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      makeParticles();
      draw(0);
    }

    function draw(delta) {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);

      context.lineWidth = isHeader ? 1 : 1.4;
      for (const beam of beams) {
        beam.y -= beam.speed * delta;
        if (beam.y + beam.length < 0) {
          beam.y = height + beam.length;
          beam.x = Math.random() * width;
        }
        context.setTransform(pixelRatio, 0, 0, pixelRatio, beam.x * pixelRatio, beam.y * pixelRatio);
        context.strokeStyle = beam.gradient;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, beam.length);
        context.stroke();
      }
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      drawLinks();

      context.font = `${isHeader ? 10 : 12}px ui-monospace, Consolas, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
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
          context.strokeStyle = color(0.18 * (1 - distance / pointerReach));
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(mouse.x, mouse.y);
          context.stroke();
        }
        context.fillStyle = color(nearby ? 0.78 : isHeader ? 0.52 : 0.58);
        context.fillText(node.glyph, node.x, node.y);
      }
    }

    function drawLinks() {
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
      context.lineWidth = 0.55;
      linkPaths.forEach((points, level) => {
        if (!points.length) return;
        context.strokeStyle = color(linkAlpha * ((level + 0.5) / LINK_LEVELS));
        context.beginPath();
        for (let k = 0; k < points.length; k += 4) {
          context.moveTo(points[k], points[k + 1]);
          context.lineTo(points[k + 2], points[k + 3]);
        }
        context.stroke();
      });
    }

    const FRAME_INTERVAL = 1000 / 30;

    function tick(now) {
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

    host.addEventListener(
      "pointermove",
      (event) => {
        const bounds = host.getBoundingClientRect();
        mouse.x = event.clientX - bounds.left;
        mouse.y = event.clientY - bounds.top;
        if (motionPreference.matches) draw(0);
      },
      { passive: true }
    );
    host.addEventListener("pointerleave", () => {
      mouse.x = -1000;
      mouse.y = -1000;
      if (motionPreference.matches) draw(0);
    });

    new ResizeObserver(resize).observe(host);
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    }).observe(host);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
    motionPreference.addEventListener("change", () => {
      if (motionPreference.matches) {
        stop();
        draw(0);
      } else start();
    });
    new MutationObserver(updateAccent).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"]
    });
    updateAccent();
    resize();
    start();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-particle-field]").forEach(createField);
  });
})();
