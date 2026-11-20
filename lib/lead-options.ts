export const INTEREST_OPTIONS = [
  { value: "Escopo Definido", label: "Projeto com escopo definido" },
  { value: "Time Dedicado", label: "Time dedicado para evolução contínua" },
  { value: "Diagnóstico e Arquitetura", label: "Diagnóstico e Arquitetura de Software" },
  { value: "Outro", label: "Outro desafio operacional" }
] as const;

export const LEAD_SOURCES = ["Contato Geral", "Novo Projeto", "Agendamento 30min"] as const;

export type LeadFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };
