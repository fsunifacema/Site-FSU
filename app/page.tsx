import { ContactProvider } from "@/components/contact/ContactProvider";
import { SiteEffects } from "@/components/SiteEffects";
import { AmbientGlow } from "@/components/site/AmbientGlow";
import { CasesSection } from "@/components/site/CasesSection";
import { FinalCta } from "@/components/site/FinalCta";
import { GlassSidebar } from "@/components/site/GlassSidebar";
import { Hero } from "@/components/site/Hero";
import { ServicesSection } from "@/components/site/ServicesSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { TeamSection } from "@/components/site/TeamSection";
import { TechMarquee } from "@/components/site/TechMarquee";

export default function HomePage() {
  return (
    <ContactProvider>
      <AmbientGlow />
      <SiteHeader />
      <GlassSidebar />
      <main>
        <Hero />
        <TechMarquee />
        <ServicesSection />
        <TeamSection />
        <CasesSection />
        <FinalCta />
      </main>
      <SiteFooter />
      <SiteEffects />
    </ContactProvider>
  );
}
