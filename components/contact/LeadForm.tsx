"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  type AnimationEvent,
  type PointerEvent,
  type SubmitEvent
} from "react";

import { submitLead } from "@/app/actions/submit-lead";
import { INTEREST_OPTIONS, type LeadFormState } from "@/lib/lead-options";

const AUTO_CLOSE_MS = 3000;
const INITIAL_STATE: LeadFormState = { status: "idle" };

type LeadFormProps = { source: string; onSent: () => void };

export function LeadForm({ source, onSent }: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(submitLead, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status !== "success") return;
    formRef.current?.reset();
    const timer = window.setTimeout(onSent, AUTO_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [state, onSent]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  const startRipple = (event: PointerEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
    button.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
    button.classList.remove("is-rippling");
    void button.offsetWidth;
    button.classList.add("is-rippling");
  };

  const endRipple = (event: AnimationEvent<HTMLButtonElement>) => {
    if (event.animationName === "glass-ripple") event.currentTarget.classList.remove("is-rippling");
  };

  return (
    <form id="leadForm" ref={formRef} onSubmit={handleSubmit}>
      <input type="hidden" name="source" value={source} />
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="formWebsite">Não preencha este campo</label>
        <input type="text" id="formWebsite" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-group">
        <label htmlFor="formName">Seu Nome *</label>
        <input
          type="text"
          id="formName"
          name="name"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          placeholder="Como podemos te chamar?"
        />
      </div>

      <div className="form-group">
        <label htmlFor="formEmail">E-mail Corporativo *</label>
        <input
          type="email"
          id="formEmail"
          name="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="seu@empresa.com.br"
        />
      </div>

      <div className="form-group">
        <label htmlFor="formPhone">WhatsApp / Telefone</label>
        <input type="tel" id="formPhone" name="phone" maxLength={30} autoComplete="tel" placeholder="(11) 99999-9999" />
      </div>

      <div className="form-group">
        <label htmlFor="formInterest">Modelo de Interesse</label>
        <select id="formInterest" name="interest" defaultValue={INTEREST_OPTIONS[0].value}>
          {INTEREST_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="formDetails">Descreva brevemente seu objetivo ou problema</label>
        <textarea
          id="formDetails"
          name="details"
          maxLength={2000}
          placeholder="Conte um pouco sobre o que sua empresa precisa construir ou melhorar..."
        />
      </div>

      <button
        type="submit"
        className="btn btn-accent glass-submit"
        style={{ width: "100%" }}
        disabled={isPending}
        onPointerDown={startRipple}
        onAnimationEnd={endRipple}
      >
        {isPending ? "Enviando..." : "Enviar informações"}
      </button>

      <p className="form-privacy-note">
        Usamos estes dados só para responder ao seu contato. Nome e e-mail são obrigatórios; o resto é opcional.
      </p>

      <div className={state.status === "idle" ? "form-feedback" : `form-feedback is-${state.status}`} role="alert">
        {state.status === "idle" ? null : state.message}
      </div>
    </form>
  );
}
