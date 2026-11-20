import { ThemeLogo } from "@/components/ThemeLogo";
import { ContactButton } from "@/components/contact/ContactButton";

export function SiteHeader() {
  return (
    <header className="site-header">
      <canvas className="particle-field particle-field-header" data-particle-field="header" aria-hidden="true"></canvas>
      <div className="container header-container">
        <a href="#hero" className="header-brand" aria-label="FSU — início">
          <ThemeLogo
            dark="/assets/images/logo-fsu-horizontal.webp"
            light="/assets/images/fsu-logo-horizontal-light.webp"
            darkSize={[400, 144]}
            lightSize={[400, 134]}
            alt="FSU — Fábrica de Software"
            className="brand-logo-img"
            sizes="176px"
          />
        </a>
        <nav className="nimbus-nav" data-tone="dark" data-gl="on" data-sound="false" aria-label="Menu principal">
          <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
            <filter id="nimbus-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.006 0.02"
                numOctaves="2"
                seed="7"
                result="noise"
              ></feTurbulence>
              <feGaussianBlur in="noise" stdDeviation="2" result="soft"></feGaussianBlur>
              <feDisplacementMap
                in="SourceGraphic"
                in2="soft"
                scale="60"
                xChannelSelector="R"
                yChannelSelector="G"
              ></feDisplacementMap>
            </filter>
          </svg>{" "}
          <span className="nimbus-glass" aria-hidden="true"></span>
          <canvas className="nimbus-water" aria-hidden="true"></canvas>
          <span className="nimbus-drop" aria-hidden="true"></span>{" "}
          <a
            href="#o-que-fazemos"
            className="nimbus-item"
            aria-current="page"
            data-fx="spin"
            aria-label="O que fazemos"
          >
            <span className="nv-ico">
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8.5"></circle>
                <path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17"></path>
              </svg>
            </span>{" "}
            <span className="nimbus-label">O que fazemos</span>
          </a>{" "}
          <a href="#quem-somos" className="nimbus-item" data-fx="glow" aria-label="Quem somos">
            <span className="nv-ico">
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3.5 11.2 12 4l8.5 7.2"></path>
                <path d="M6 9.6V20h12V9.6"></path>
                <path className="nv-door" d="M10 20v-5h4v5Z"></path>
              </svg>
            </span>{" "}
            <span className="nimbus-label">Quem somos</span>
          </a>{" "}
          <a href="#cases" className="nimbus-item" data-fx="plane" aria-label="Cases">
            <span className="nv-ico">
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.2 3.6 5.4l2.7 6.8-2.7 6.4L21 12.2Zm-14.7 0H13"></path>
              </svg>
            </span>{" "}
            <span className="nimbus-label">Cases</span>
          </a>{" "}
          <a href="#contato" className="nimbus-item" data-fx="wave" aria-label="Contato">
            <span className="nv-ico">
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8.5" r="3.8"></circle>
                <path d="M4.8 20c1.2-3.4 4-5 7.2-5s6 1.6 7.2 5"></path>
              </svg>
            </span>{" "}
            <span className="nimbus-label">Contato</span>
          </a>
        </nav>
        <div className="header-actions">
          <div className="nimbus-nav nimbus-cta" data-tone="dark" data-gl="on" data-sound="false" data-liquid-action="">
            <span className="nimbus-glass" aria-hidden="true"></span>
            <canvas className="nimbus-water" aria-hidden="true"></canvas>
            <span className="nimbus-drop" aria-hidden="true"></span>{" "}
            <ContactButton service="Contato Geral" className="nimbus-item" data-fx="pop">
              {"Fale sobre seu projeto "}
              <span className="nv-ico" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width={16}
                  height={16}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </span>
            </ContactButton>
          </div>
        </div>
      </div>
    </header>
  );
}
