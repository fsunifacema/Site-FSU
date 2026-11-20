export function CasesSection() {
  return (
    <section id="cases" className="included-section">
      <div className="container" data-reveal="">
        <div className="included-header">
          <div className="section-badge">
            <span className="badge-dot"></span>
            {" Como trabalhamos"}
          </div>
          <h2 className="section-title">
            {"O que está incluído em um projeto "}
            <span className="text-highlight">com a FSU</span>
          </h2>
          <p className="section-desc">
            Além do desenvolvimento, o projeto inclui acompanhamento técnico, validações contínuas, documentação e
            visibilidade sobre a evolução da solução.
          </p>
        </div>
        <div className="included-grid">
          <div className="included-card">
            <div className="card-icon-wrap">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width={20} height={14} rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3 className="card-title">Decisões técnicas alinhadas ao negócio</h3>
            <p className="card-text">
              A solução é definida a partir do problema, da operação e dos objetivos da empresa — não apenas da
              tecnologia.
            </p>
          </div>
          <div className="included-card">
            <div className="card-icon-wrap">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="card-title">Entrega com previsibilidade</h3>
            <p className="card-text">
              Você acompanha o que está em andamento, o que foi entregue e o que virá no próximo período do projeto.
            </p>
          </div>
          <div className="included-card">
            <div className="card-icon-wrap">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="card-title">Comunicação direta</h3>
            <p className="card-text">
              Contato próximo com o time técnico para esclarecer dúvidas, validar entregas e manter o projeto alinhado.
            </p>
          </div>
          <div className="included-card">
            <div className="card-icon-wrap">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 className="card-title">Qualidade como parte do processo</h3>
            <p className="card-text">
              Testes, revisões e validações acontecem durante o desenvolvimento, reduzindo problemas acumulados para o
              final.
            </p>
          </div>
          <div className="included-card">
            <div className="card-icon-wrap">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="card-title">Gestão de risco e continuidade</h3>
            <p className="card-text">
              Documentação, compartilhamento de conhecimento e organização técnica reduzem dependência de pessoas e
              facilitam a continuidade do projeto.
            </p>
          </div>
          <div className="included-card card-with-visual">
            <div>
              <div className="card-icon-wrap">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3 className="card-title">Visibilidade do progresso</h3>
              <p className="card-text">
                Você acompanha entregas, itens em andamento, próximos passos e pontos de atenção ao longo de todo o
                ciclo.
              </p>
            </div>
            <div className="visual-container">
              <img src="/assets/images/laptop-preview.svg" alt="Preview da esteira e dashboard de entregas FSU" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
