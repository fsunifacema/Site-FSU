"use server";

import { leadSchema, type LeadFormState } from "@/lib/leads";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const SUCCESS_MESSAGE = "Obrigado! Recebemos sua mensagem e entraremos em contato em até 2 horas.";
const UNAVAILABLE_MESSAGE =
  "Não conseguimos enviar agora. Tente de novo em alguns minutos ou fale conosco pelas redes sociais.";

const field = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
};

export async function submitLead(_previous: LeadFormState, formData: FormData): Promise<LeadFormState> {
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

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[submitLead] SUPABASE_URL ou SUPABASE_SECRET_KEY não configurados.");
    return { status: "error", message: UNAVAILABLE_MESSAGE };
  }

  const { error } = await supabase.from("leads").insert(parsed.data);
  if (error) {
    console.error("[submitLead] falha ao gravar o contato:", error.code, error.message);
    return { status: "error", message: UNAVAILABLE_MESSAGE };
  }

  return { status: "success", message: SUCCESS_MESSAGE };
}
