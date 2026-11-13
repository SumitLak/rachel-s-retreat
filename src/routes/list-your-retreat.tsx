import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, Mail } from "lucide-react";
import { SectionHeading } from "@/components/ui-luxe";
import { contact, SITE_URL } from "@/data/site";
import { listingSchema, submitListing } from "@/lib/forms";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/list-your-retreat")({
  head: () => ({
    meta: [
      { title: "Feature your retreat | Rachel’s Retreats" },
      {
        name: "description",
        content:
          "Organisers can submit an upcoming retreat to be considered for the Rachel’s Retreats calendar. Every submission is reviewed before publication.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/list-your-retreat` }],
  }),
  component: ListYourRetreat,
});

const field =
  "w-full border-0 border-b border-ink/25 bg-transparent px-0 py-3 outline-none transition-colors focus:border-forest";

function ListYourRetreat() {
  const [v, setV] = useState({
    organiser: "",
    email: "",
    organisationSite: "",
    title: "",
    dates: "",
    venue: "",
    description: "",
    imageRights: false,
    consent: false,
  });
  const [honeypot, setHoneypot] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "handoff" | "error">("idle");
  const [reference, setReference] = useState("");
  const set = (k: keyof typeof v, val: string | boolean) => setV((p) => ({ ...p, [k]: val }));

  const body = Object.entries(v)
    .map(([k, val]) => `${k}: ${String(val)}`)
    .join("\n");
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`Retreat listing submission: ${v.title}`)}&body=${encodeURIComponent(body)}`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    const parsed = listingSchema.safeParse({ ...v, website: honeypot, startedAt });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const res = await submitListing({ data: parsed.data });
      if (res.ok) {
        setReference(res.reference);
        setState("sent");
        track("organiser_listing_submitted", {});
      } else setState(res.reason === "not-configured" ? "handoff" : "error");
    } catch {
      setState("error");
    }
  };

  const Err = ({ k }: { k: string }) =>
    errors[k] ? <p className="mt-1.5 text-sm text-destructive">{errors[k]}</p> : null;

  return (
    <section className="pb-16 pt-28 md:pt-32">
      <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="For retreat organisers"
            lines={["Feature your retreat"]}
            intro="Running a retreat at one of our venues, or elsewhere? Share the details and our team will review whether it’s a good fit for the Rachel’s Retreats calendar."
          />
          <ul className="mt-8 space-y-3 text-ink/80">
            {[
              "Every submission is reviewed by our team before anything is published.",
              "We may ask for more information, photography or verification.",
              "Submitting doesn’t guarantee a listing, and there is no charge to submit.",
              "You remain responsible for your programme, guest bookings and payments.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <Check className="mt-1 size-4 shrink-0 text-forest" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.5rem] bg-card p-7 shadow-[0_0_0_1px_var(--color-border)] md:p-10">
          {state === "sent" || state === "handoff" ? (
            <div>
              <span className="grid size-14 place-items-center rounded-full bg-forest text-ivory">
                <Check className="size-6" />
              </span>
              {state === "sent" ? (
                <>
                  <h2 className="mt-6 text-4xl">Thank you. We’ll review your retreat.</h2>
                  <p className="mt-3 text-muted-foreground">
                    Your reference is <strong className="text-ink">{reference}</strong>. Nothing is
                    published until our team has reviewed and approved it.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-6 text-4xl">Almost there.</h2>
                  <p className="mt-3 text-muted-foreground">
                    Online submission isn’t switched on yet. Please send the details by email; the
                    button opens your email app with everything filled in.
                  </p>
                  <a
                    href={mailto}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm text-ivory"
                  >
                    <Mail className="size-4" /> Email my submission
                  </a>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-7 md:grid-cols-2">
              <label>
                <span className="eyebrow text-[0.6rem] text-ink/70">Organiser name *</span>
                <input
                  className={field}
                  autoComplete="name"
                  value={v.organiser}
                  onChange={(e) => set("organiser", e.target.value)}
                />
                <Err k="organiser" />
              </label>
              <label>
                <span className="eyebrow text-[0.6rem] text-ink/70">Email address *</span>
                <input
                  type="email"
                  className={field}
                  autoComplete="email"
                  value={v.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <Err k="email" />
              </label>
              <label className="md:col-span-2">
                <span className="eyebrow text-[0.6rem] text-ink/70">
                  Website or social profile (optional)
                </span>
                <input
                  className={field}
                  value={v.organisationSite}
                  onChange={(e) => set("organisationSite", e.target.value)}
                />
              </label>
              <label className="md:col-span-2">
                <span className="eyebrow text-[0.6rem] text-ink/70">Retreat title *</span>
                <input
                  className={field}
                  value={v.title}
                  onChange={(e) => set("title", e.target.value)}
                />
                <Err k="title" />
              </label>
              <label>
                <span className="eyebrow text-[0.6rem] text-ink/70">Dates *</span>
                <input
                  className={field}
                  value={v.dates}
                  onChange={(e) => set("dates", e.target.value)}
                  placeholder="e.g. 3–10 July 2027"
                />
                <Err k="dates" />
              </label>
              <label>
                <span className="eyebrow text-[0.6rem] text-ink/70">Venue or destination *</span>
                <input
                  className={field}
                  value={v.venue}
                  onChange={(e) => set("venue", e.target.value)}
                />
                <Err k="venue" />
              </label>
              <label className="md:col-span-2">
                <span className="eyebrow text-[0.6rem] text-ink/70">Programme description *</span>
                <textarea
                  rows={4}
                  className={field}
                  value={v.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                <Err k="description" />
              </label>
              <input
                tabIndex={-1}
                aria-hidden
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute -left-[9999px]"
              />
              <label className="flex items-start gap-3 text-sm md:col-span-2">
                <input
                  type="checkbox"
                  checked={v.imageRights}
                  onChange={(e) => set("imageRights", e.target.checked)}
                  className="mt-0.5 size-4 accent-[var(--forest)]"
                />
                <span>
                  I confirm I have the rights to any photographs or materials I share for this
                  listing.
                  <Err k="imageRights" />
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm md:col-span-2">
                <input
                  type="checkbox"
                  checked={v.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  className="mt-0.5 size-4 accent-[var(--forest)]"
                />
                <span>
                  I understand Rachel’s Retreats will store these details to review my submission
                  and may contact me about it.
                  <Err k="consent" />
                </span>
              </label>
              {state === "error" && (
                <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm md:col-span-2">
                  We couldn’t send that just now. Please try again, or{" "}
                  <a href={mailto} className="underline">
                    email it to the team
                  </a>
                  .
                </p>
              )}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm text-ivory transition-colors hover:bg-ink disabled:opacity-60"
                >
                  {state === "sending" && <Loader2 className="size-4 animate-spin" />}
                  Submit for review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
