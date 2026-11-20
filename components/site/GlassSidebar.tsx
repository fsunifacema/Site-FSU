export function GlassSidebar() {
  return (
    <>
      <button
        className="glass-sidebar-launcher"
        type="button"
        aria-label="Abrir menu lateral"
        aria-expanded="false"
        aria-controls="glassSidebar"
        title="Abrir menu lateral"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width={18} height={18} rx="2"></rect>
          <path d="M9 3v18"></path>
        </svg>
      </button>
      <div className="glass-sidebar-backdrop" aria-hidden="true"></div>
      <aside
        className="glass-sidebar"
        id="glassSidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Menu lateral"
        aria-hidden="true"
        inert
      >
        <div className="glass-sidebar-header">
          <button
            className="glass-sidebar-toggle"
            type="button"
            aria-label="Fechar menu lateral"
            title="Fechar menu lateral"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 5l14 14M19 5 5 19"></path>
            </svg>
          </button>
        </div>
        <nav className="glass-sidebar-list" id="glassSidebarLinks" aria-label="Seções do site">
          <span className="glass-sidebar-indicator" aria-hidden="true"></span>
          <div className="glass-sidebar-group" role="group" aria-label="Navegação">
            <div className="glass-sidebar-group-label">Navegação</div>
            <a className="glass-sidebar-item" href="#hero" aria-label="Início" aria-current="page" title="Início">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m3.5 10 8.5-7 8.5 7V20a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1z"></path>
                <path d="M9 21v-7h6v7"></path>
              </svg>
              <span className="glass-sidebar-item-label">Início</span>
            </a>{" "}
            <a className="glass-sidebar-item" href="#o-que-fazemos" aria-label="O que fazemos" title="O que fazemos">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"></path>
              </svg>
              <span className="glass-sidebar-item-label">O que fazemos</span>
            </a>{" "}
            <a className="glass-sidebar-item" href="#quem-somos" aria-label="Quem somos" title="Quem somos">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="8" r="3"></circle>
                <path d="M2.5 20c.5-3.6 3-5.5 6.5-5.5s6 1.9 6.5 5.5M16 5.5a3 3 0 0 1 0 5.8M17.5 14.5c2.3.4 3.8 2.2 4 5.5"></path>
              </svg>
              <span className="glass-sidebar-item-label">Quem somos</span>
            </a>{" "}
            <a className="glass-sidebar-item" href="#cases" aria-label="Cases" title="Cases">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="7" width={18} height={14} rx="2"></rect>
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"></path>
              </svg>
              <span className="glass-sidebar-item-label">Cases</span>
            </a>{" "}
            <a className="glass-sidebar-item" href="#contato" aria-label="Contato" title="Contato">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width={18} height={14} rx="2"></rect>
                <path d="m4 7 8 6 8-6"></path>
              </svg>
              <span className="glass-sidebar-item-label">Contato</span>
            </a>
          </div>
        </nav>
        <div className="glass-sidebar-footer">
          <button
            className="cinematic-theme-switcher"
            type="button"
            role="switch"
            aria-checked="true"
            aria-label="Alternar para modo claro"
            title="Alternar modo claro e escuro"
          >
            <span className="theme-switcher-groove" aria-hidden="true"></span>{" "}
            <span className="theme-switcher-gloss" aria-hidden="true"></span>{" "}
            <span className="theme-switcher-ambient" aria-hidden="true"></span>{" "}
            <span className="theme-switcher-icon theme-switcher-sun" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>
              </svg>
            </span>{" "}
            <span className="theme-switcher-icon theme-switcher-moon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"></path>
              </svg>
            </span>{" "}
            <span className="theme-switcher-thumb" aria-hidden="true">
              <span className="theme-switcher-thumb-shine"></span>
              <span className="theme-switcher-particles">
                <i></i>
                <i></i>
                <i></i>
              </span>
              <span className="theme-switcher-thumb-icon theme-switcher-thumb-sun">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>
                </svg>
              </span>
              <span className="theme-switcher-thumb-icon theme-switcher-thumb-moon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"></path>
                </svg>
              </span>
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
