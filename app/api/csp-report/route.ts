import { createRateLimiter } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 8 * 1024;
const MAX_REPORTS_PER_REQUEST = 10;
const limiter = createRateLimiter({ limit: 60, windowMs: 60 * 1000 });

type Violation = { directive: string; blocked: string };

const text = (value: unknown) => (typeof value === "string" ? value : "");

const blockedOrigin = (value: string) => {
  if (!value.includes(":") || ["inline", "eval", "data", "blob"].includes(value)) return value.slice(0, 20);
  try {
    return new URL(value).origin;
  } catch {
    return value.slice(0, 40);
  }
};

function readViolations(payload: unknown): Violation[] {
  const reports = Array.isArray(payload) ? payload : [payload];
  return reports.slice(0, MAX_REPORTS_PER_REQUEST).flatMap((report) => {
    if (!report || typeof report !== "object") return [];
    const legacy = (report as Record<string, unknown>)["csp-report"];
    const body = (legacy ?? (report as Record<string, unknown>).body) as Record<string, unknown> | undefined;
    if (!body || typeof body !== "object") return [];
    const directive =
      text(body.effectiveDirective) || text(body["effective-directive"]) || text(body["violated-directive"]);
    const blocked = text(body.blockedURL) || text(body["blocked-uri"]);
    return directive ? [{ directive: directive.slice(0, 40), blocked: blockedOrigin(blocked) }] : [];
  });
}

export async function POST(request: Request) {
  if (!limiter("csp").allowed) return new Response(null, { status: 429 });

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  try {
    for (const violation of readViolations(JSON.parse(raw))) {
      console.warn("[csp] bloqueado:", violation.directive, violation.blocked);
    }
  } catch {
    return new Response(null, { status: 400 });
  }
  return new Response(null, { status: 204 });
}
