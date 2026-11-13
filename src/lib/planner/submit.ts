import { createServerFn } from "@tanstack/react-start";
import { enquirySchema } from "./types";

export type SubmitResult =
  { ok: true; reference: string } | { ok: false; reason: "not-configured" | "spam" | "upstream" };

/**
 * Validates the enquiry on the server and forwards it to the webhook in the
 * ENQUIRY_WEBHOOK_URL secret (e.g. a CRM, Zapier/Make, or a Supabase edge
 * function). Without that secret it reports "not-configured" and the client
 * falls back to handing the brief to the visitor's email app.
 */
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }): Promise<SubmitResult> => {
    // Anti-spam: honeypot is enforced by the schema; reject instant submissions.
    if (Date.now() - data.startedAt < 4000) return { ok: false, reason: "spam" };

    const url = typeof process !== "undefined" ? process.env["ENQUIRY_WEBHOOK_URL"] : undefined;
    if (!url) return { ok: false, reason: "not-configured" };

    const reference = `RR-${Date.now().toString(36).toUpperCase()}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reference,
          source: "rachels-retreats-planner",
          submittedAt: new Date().toISOString(),
          contact: data.contact,
          answers: data.answers,
          brief: data.brief,
        }),
        signal: controller.signal,
      });
      if (!res.ok) return { ok: false, reason: "upstream" };
      return { ok: true, reference };
    } catch {
      return { ok: false, reason: "upstream" };
    } finally {
      clearTimeout(timer);
    }
  });
