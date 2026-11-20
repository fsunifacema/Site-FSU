import { ContactButton } from "@/components/contact/ContactButton";
import { ThemeLogo } from "@/components/ThemeLogo";

export function Hero() {
  return (
    <section id="hero" className="hero-section">
      <canvas className="particle-field particle-field-hero" data-particle-field="hero" aria-hidden="true"></canvas>
      <div className="container hero-container">
        <div className="hero-copy">
          <h1 className="hero-title">
            {"Software "}
            <span className="hero-highlight">sob medida</span>
            <br />
            {" para a realidade do seu negócio."}
          </h1>
          <p className="hero-description">
            Desenvolvemos sistemas personalizados com escopo claro, arquitetura sólida e evolução estruturada — do
            entendimento do problema à entrega e continuidade da solução.
          </p>
          <div className="hero-actions">
            <ContactButton service="Novo Projeto" className="btn btn-primary">
              {"Fale sobre seu projeto "}
              <svg
                className="btn-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </ContactButton>
          </div>
        </div>
        <div className="hero-visual">
          <span className="hero-orbit hero-orbit-inner" aria-hidden="true"></span>{" "}
          <span className="hero-orbit hero-orbit-outer" aria-hidden="true"></span>{" "}
          <span className="hero-pixel hero-pixel-one" aria-hidden="true"></span>{" "}
          <span className="hero-pixel hero-pixel-two" aria-hidden="true"></span>{" "}
          <span className="hero-pixel hero-pixel-three" aria-hidden="true"></span>{" "}
          <ThemeLogo
            dark="/assets/images/logo-fsu-branca.webp"
            light="/assets/images/fsu-logo-light.webp"
            darkSize={[740, 740]}
            lightSize={[740, 754]}
            alt="Logo branca da FSU — Fábrica de Software UNIFACEMA"
            lightAlt="Logo azul da FSU — Fábrica de Software UNIFACEMA"
            priority
            className="hero-logo"
            sizes="370px"
          />
        </div>
      </div>
    </section>
  );
}
