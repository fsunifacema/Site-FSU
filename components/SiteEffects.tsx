"use client";

import { useEffect } from "react";

import { mountAccordions } from "@/lib/effects/accordions";
import { mountCardMotion } from "@/lib/effects/card-motion";
import { mountColorMode } from "@/lib/effects/color-mode";
import { mountDevelopersGallery } from "@/lib/effects/developers-gallery";
import { mountGlassSidebar } from "@/lib/effects/glass-sidebar";
import { mountHeaderScroll } from "@/lib/effects/header-scroll";
import { mountLiquidNavbar } from "@/lib/effects/liquid-navbar";
import { mountMarquee } from "@/lib/effects/marquee";
import { mountParticleField } from "@/lib/effects/particle-field";
import { mountScrollReveal } from "@/lib/effects/scroll-reveal";
import { type Cleanup, mountEach } from "@/lib/effects/types";

// O que o visitante usa logo (tema, menu, acordeões, revelação ao rolar).
const interactive: Array<() => Cleanup> = [
  mountColorMode,
  mountHeaderScroll,
  mountAccordions,
  mountScrollReveal,
  mountGlassSidebar,
  mountDevelopersGallery
];

// Só enfeite: espera o navegador ficar livre para não somar à hidratação, e cada elemento monta
// na sua própria tarefa (as duas telas de partículas juntas davam uma tarefa longa no celular).
const each = <T extends Element>(selector: string, mount: (element: T) => Cleanup) =>
  [...document.querySelectorAll<T>(selector)].map((element) => () => mount(element));

const decorative = (): Array<() => Cleanup> => [
  () => mountEach<HTMLElement>(".marquee-track", mountMarquee),
  ...each<HTMLCanvasElement>("canvas[data-particle-field]", mountParticleField),
  ...each<HTMLElement>(".nimbus-nav", mountLiquidNavbar),
  mountCardMotion
];

const DECORATIVE_TIMEOUT_MS = 2000;

// scheduler.yield mantém a prioridade da continuação; setTimeout é o fallback (web.dev "Optimize long tasks").
function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function whenIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback, { timeout: DECORATIVE_TIMEOUT_MS });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(callback, 200);
  return () => window.clearTimeout(handle);
}

export function SiteEffects() {
  useEffect(() => {
    const cleanups: Cleanup[] = [];
    let cancelled = false;

    const mountInTurns = async (mounts: Array<() => Cleanup>) => {
      for (const mount of mounts) {
        if (cancelled) return;
        cleanups.push(mount());
        await yieldToMain();
      }
    };

    let cancelIdle = () => {};
    void mountInTurns(interactive).then(() => {
      if (!cancelled) cancelIdle = whenIdle(() => void mountInTurns(decorative()));
    });

    return () => {
      cancelled = true;
      cancelIdle();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
