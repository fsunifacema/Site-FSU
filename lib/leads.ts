import { z } from "zod";

export const INTEREST_OPTIONS = [
  { value: "Escopo Definido", label: "Projeto com escopo definido" },
  { value: "Time Dedicado", label: "Time dedicado para evolução contínua" },
  { value: "Diagnóstico e Arquitetura", label: "Diagnóstico e Arquitetura de Software" },
  { value: "Outro", label: "Outro desafio operacional" }
] as const;

export const LEAD_SOURCES = ["Contato Geral", "Novo Projeto", "Agendamento 30min"] as const;

const interestValues = INTEREST_OPTIONS.map((option) => option.value) as [string, ...string[]];

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((value) => value || null);

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120, "O nome pode ter até 120 caracteres."),
  email: z.string().trim().toLowerCase().max(254, "E-mail longo demais.").pipe(z.email("Informe um e-mail válido.")),
  phone: optionalText(30, "O telefone pode ter até 30 caracteres.").refine(
    (value) => value === null || /^[\d\s()+-]{8,30}$/.test(value),
    "Informe um telefone válido."
  ),
  interest: z.enum(interestValues, "Escolha um modelo de interesse."),
  details: optionalText(2000, "A descrição pode ter até 2000 caracteres."),
  source: z.enum(LEAD_SOURCES).catch("Contato Geral")
});

export type Lead = z.output<typeof leadSchema>;

export type LeadFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };
