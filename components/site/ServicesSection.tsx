export function ServicesSection() {
  return (
    <section id="o-que-fazemos" className="diagnostic-section">
      <div className="container" data-reveal="">
        <div className="diagnostic-header">
          <div className="section-badge">
            <span className="badge-dot"></span>
            {" Software sob medida x pronto"}
          </div>
          <h2 className="section-title">
            {"Software sob medida para "}
            <span className="text-highlight">resolver, problemas reais</span>
            {" da operação."}
          </h2>
          <p className="section-desc">
            Quando sistemas prontos não atendem a operação, o software sob medida permite construir uma solução alinhada
            aos processos, integrações e objetivos específicos da empresa.
          </p>
        </div>
        <div className="diagnostic-grid">
          <div className="problems-column">
            <div className="accordion-item is-open">
              <button type="button" className="accordion-header" aria-expanded="true">
                <span className="header-title-wrap">O sistema atual limita a operação</span>{" "}
                <span className="toggle-icon">+</span>
              </button>
              <div className="accordion-body">
                <p>
                  Ferramentas de prateleira forçam sua empresa a adaptar processos em vez de apoiar o crescimento.
                  Criamos arquiteturas moldadas ao fluxo operacional da sua equipe.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button type="button" className="accordion-header" aria-expanded="false">
                <span className="header-title-wrap">O escopo precisa mudar sem perder controle</span>{" "}
                <span className="toggle-icon">+</span>
              </button>
              <div className="accordion-body">
                <p>
                  Negócios ágeis mudam rápido. Nossa metodologia em sprints permite repriorizar funcionalidades com
                  transparência de custos e prazos em cada etapa.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button type="button" className="accordion-header" aria-expanded="false">
                <span className="header-title-wrap">Erros são descobertos tarde demais</span>{" "}
                <span className="toggle-icon">+</span>
              </button>
              <div className="accordion-body">
                <p>
                  Validações contínuas, testes automatizados e prototipagem prévia eliminam retrabalhos caros e garantem
                  entregas confiáveis desde a primeira sprint.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button type="button" className="accordion-header" aria-expanded="false">
                <span className="header-title-wrap">Tecnologia e negócio não conseguem avançar juntos</span>{" "}
                <span className="toggle-icon">+</span>
              </button>
              <div className="accordion-body">
                <p>
                  Nossa equipe fala a língua do seu negócio. Traduzimos metas comerciais em especificações técnicas
                  precisas e métricas reais de resultado.
                </p>
              </div>
            </div>
          </div>
          <div className="diagram-column">
            <h3 className="diagram-card-title">Do problema à evolução da solução</h3>
            <div className="diagram-flow">
              <div className="flow-node">
                <div className="node-circle is-active">01</div>
                <span className="node-label">Entendimento real do problema</span>
              </div>
              <div className="flow-node">
                <div className="node-circle">02</div>
                <span className="node-label">Arquitetura e validações</span>
              </div>
              <div className="flow-node">
                <div className="node-circle">03</div>
                <span className="node-label">Construção e evolução</span>
              </div>
            </div>
            <div className="diagram-caption">
              Fluxo iterativo com validações técnicas contínuas em cada ciclo de entrega.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
