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
import { mountEach } from "@/lib/effects/types";

export function SiteEffects() {
  useEffect(() => {
    const cleanups = [
      mountColorMode(),
      mountHeaderScroll(),
      mountAccordions(),
      mountDevelopersGallery(),
      mountCardMotion(),
      mountScrollReveal(),
      mountGlassSidebar(),
      mountEach<HTMLElement>(".nimbus-nav", mountLiquidNavbar),
      mountEach<HTMLElement>(".marquee-track", mountMarquee),
      mountEach<HTMLCanvasElement>("canvas[data-particle-field]", mountParticleField)
    ];
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
