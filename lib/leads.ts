import "server-only";

import { z } from "zod";

import { INTEREST_OPTIONS, LEAD_SOURCES } from "./lead-options";

const interestValues = INTEREST_OPTIONS.map((option) => option.value) as [string, ...string[]];

const INVISIBLE_RANGES: Array<[number, number]> = [
  [0x0000, 0x0008],
  [0x000b, 0x000c],
  [0x000e, 0x001f],
  [0x007f, 0x009f],
  [0x00ad, 0x00ad],
  [0x200b, 0x200f],
  [0x202a, 0x202e],
  [0x2060, 0x2069],
  [0xfeff, 0xfeff]
];

const hex = (code: number) => code.toString(16).padStart(4, "0");
const INVISIBLE_CHARACTERS = new RegExp(
  `[${INVISIBLE_RANGES.map(([from, to]) => `\\u${hex(from)}-\\u${hex(to)}`).join("")}]`,
  "g"
);
const FORMULA_START = /^[=+\-@\t\r]/;

const cleanText = (value: string) => value.replace(INVISIBLE_CHARACTERS, "").trim();
const neutralizeFormula = (value: string) => (FORMULA_START.test(value) ? `'${value}` : value);

const freeText = () => z.string().transform(cleanText).transform(neutralizeFormula);

export const leadSchema = z.object({
  name: freeText().pipe(z.string().min(2, "Informe seu nome.").max(120, "O nome pode ter até 120 caracteres.")),
  email: z
    .string()
    .transform(cleanText)
    .pipe(z.string().toLowerCase().max(254, "E-mail longo demais."))
    .pipe(z.email("Informe um e-mail válido.")),
  phone: z
    .string()
    .transform(cleanText)
    .pipe(z.string().max(30, "O telefone pode ter até 30 caracteres."))
    .refine((value) => value === "" || /^[\d\s()+-]{8,30}$/.test(value), "Informe um telefone válido.")
    .transform((value) => value || null),
  interest: z.enum(interestValues, "Escolha um modelo de interesse."),
  details: freeText()
    .pipe(z.string().max(2000, "A descrição pode ter até 2000 caracteres."))
    .transform((value) => value || null),
  source: z.enum(LEAD_SOURCES).catch("Contato Geral")
});

export type Lead = z.output<typeof leadSchema>;
