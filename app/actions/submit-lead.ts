"use server";

import { headers } from "next/headers";

import { type LeadFormState } from "@/lib/lead-options";
import { leadSchema } from "@/lib/leads";
import { createRateLimiter } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase/server";

const SUCCESS_MESSAGE = "Obrigado! Recebemos sua mensagem e entraremos em contato em até 2 horas.";
const UNAVAILABLE_MESSAGE =
  "Não conseguimos enviar agora. Tente de novo em alguns minutos ou fale conosco pelas redes sociais.";
const TOO_MANY_MESSAGE = "Recebemos muitos envios em pouco tempo. Tente de novo mais tarde.";
const MAX_FIELD_LENGTH = 4000;
const TEN_MINUTES = 10 * 60 * 1000;
const UNTRUSTED_CLIENT = "cliente-sem-proxy";

const perClient = createRateLimiter({ limit: 5, windowMs: TEN_MINUTES });
const overall = createRateLimiter({ limit: 20, windowMs: TEN_MINUTES });

const field = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value.slice(0, MAX_FIELD_LENGTH) : "";
};

async function clientKey() {
  if (process.env.TRUST_PROXY_HEADERS !== "true") return UNTRUSTED_CLIENT;
  const list = await headers();
  const forwardedByProxy = list.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return list.get("x-real-ip")?.trim() || forwardedByProxy || UNTRUSTED_CLIENT;
}

export async function submitLead(_previous: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const key = await clientKey();
  const clientLimited = key !== UNTRUSTED_CLIENT && !perClient(key).allowed;
  if (clientLimited || !overall("todos").allowed) {
    return { status: "error", message: TOO_MANY_MESSAGE };
  }

  if (field(formData, "website")) {
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  const parsed = leadSchema.safeParse({
    name: field(formData, "name"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
    interest: field(formData, "interest"),
    details: field(formData, "details"),
    source: field(formData, "source")
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Confira os campos do formulário." };
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[submitLead] SUPABASE_URL ou SUPABASE_PUBLISHABLE_KEY não configurados.");
    return { status: "error", message: UNAVAILABLE_MESSAGE };
  }

  const lead = parsed.data;
  const { error, status } = await supabase.rpc("submit_lead", {
    p_name: lead.name,
    p_email: lead.email,
    p_phone: lead.phone ?? "",
    p_interest: lead.interest,
    p_details: lead.details ?? "",
    p_source: lead.source
  });

  if (error) {
    if (error.code === "PT429" || status === 429) return { status: "error", message: TOO_MANY_MESSAGE };
    console.error("[submitLead] falha ao gravar o contato:", error.code);
    return { status: "error", message: UNAVAILABLE_MESSAGE };
  }

  return { status: "success", message: SUCCESS_MESSAGE };
}
