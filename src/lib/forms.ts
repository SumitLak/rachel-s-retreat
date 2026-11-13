import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Guest-facing (B2C) and organiser-facing (B2B) form submissions.
 * Each is validated on the server, checked for spam, and forwarded to the
 * webhook in the ENQUIRY_WEBHOOK_URL secret with a distinct `kind`, so the
 * receiving system (CRM, Zapier/Make, Supabase function) can route them
 * separately. Without the secret, the client falls back to the email app.
 */

export type FormResult =
  { ok: true; reference: string } | { ok: false; reason: "not-configured" | "spam" | "upstream" };

const antiSpam = {
  website: z.string().max(0), // honeypot: must stay empty
  startedAt: z.number().int(),
};

const email = z.string().trim().email("Please add a valid email address.").max(200);
const name = z.string().trim().min(2, "Please add your name.").max(120);
const consent = z.literal(true, {
  errorMap: () => ({ message: "Please confirm you’re happy for us to store these details." }),
});

export const guestEnquirySchema = z.object({
  retreat: z.string().max(120),
  name,
  email,
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+\d\s().-]*$/, "Please use digits, spaces and + only."),
  question: z.string().trim().max(2000),
  consent,
  ...antiSpam,
});

export const listingSchema = z.object({
  organiser: name,
  email,
  website: z.string().max(0),
  organisationSite: z.string().trim().max(200),
  title: z.string().trim().min(3, "Please add the retreat title.").max(160),
  dates: z.string().trim().min(3, "Please add the dates or timing.").max(120),
  venue: z.string().trim().min(2, "Please add the venue or destination.").max(160),
  description: z.string().trim().min(20, "Please add a short description.").max(3000),
  imageRights: z.literal(true, {
    errorMap: () => ({ message: "Please confirm you have the rights to any images you share." }),
  }),
  consent,
  startedAt: z.number().int(),
});

export const emailRetreatSchema = z.object({
  retreatSlug: z.string().max(120),
  email,
  marketingOptIn: z.boolean(),
  ...antiSpam,
});

async function forward(kind: string, payload: unknown, startedAt: number): Promise<FormResult> {
  if (Date.now() - startedAt < 3000) return { ok: false, reason: "spam" };
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
        kind,
        reference,
        submittedAt: new Date().toISOString(),
        ...(payload as object),
      }),
      signal: controller.signal,
    });
    return res.ok ? { ok: true, reference } : { ok: false, reason: "upstream" };
  } catch {
    return { ok: false, reason: "upstream" };
  } finally {
    clearTimeout(timer);
  }
}

export const submitGuestEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => guestEnquirySchema.parse(input))
  .handler(async ({ data }) => {
    const { website: _w, startedAt, ...rest } = data;
    return forward("guest-enquiry", { enquiry: rest }, startedAt);
  });

export const submitListing = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => listingSchema.parse(input))
  .handler(async ({ data }) => {
    const { website: _w, startedAt, ...rest } = data;
    // Submissions are reviewed by the team; nothing is published automatically.
    return forward("organiser-listing", { listing: { ...rest, status: "draft" } }, startedAt);
  });

export const emailRetreat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => emailRetreatSchema.parse(input))
  .handler(async ({ data }) => {
    const { website: _w, startedAt, ...rest } = data;
    // marketingOptIn is recorded separately from the one-off service email.
    return forward("email-retreat", { request: rest }, startedAt);
  });
