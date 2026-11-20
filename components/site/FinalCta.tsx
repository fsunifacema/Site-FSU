import { ContactButton } from "@/components/contact/ContactButton";

export function FinalCta() {
  return (
    <section id="contato" className="final-cta-section">
      <div className="container" data-reveal="">
        <div className="cta-container-card">
          <h2 className="cta-heading">Vamos tirar seu projeto do papel?</h2>
          <p className="cta-subheading">
            Agende uma conversa de 30 minutos sem compromisso para avaliarmos juntos o melhor caminho para o seu
            sistema.
          </p>
          <ContactButton service="Agendamento 30min" className="btn btn-primary">
            Agendar uma conversa
          </ContactButton>
        </div>
      </div>
    </section>
  );
}
