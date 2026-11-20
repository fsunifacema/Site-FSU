"use client";

import { useEffect, useRef } from "react";

import { LeadForm } from "./LeadForm";

export type ContactRequest = { source: string };

type ContactModalProps = { request: ContactRequest | null; onClose: () => void };

export function ContactModal({ request, onClose }: ContactModalProps) {
  const isOpen = request !== null;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    cardRef.current?.querySelector<HTMLInputElement>("#formName")?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  return (
    <div
      id="contactModal"
      className={isOpen ? "modal-overlay is-visible" : "modal-overlay"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      inert={!isOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-card" ref={cardRef}>
        <div className="modal-header">
          <h3 id="modalTitle" className="modal-title">
            Fale sobre seu projeto
          </h3>
          <button type="button" className="modal-close-btn" aria-label="Fechar modal" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <LeadForm key={isOpen ? "open" : "closed"} source={request?.source ?? ""} onSent={onClose} />
        </div>
      </div>
    </div>
  );
}
