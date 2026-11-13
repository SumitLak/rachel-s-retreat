import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Copy, Download, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion";
import { contact, countries, experiences, venues } from "@/data/site";

const types = [
  ...experiences.map((e) => ({ id: e.id as string, label: e.label, short: e.short })),
  { id: "interest", label: "A shared interest", short: "A community, celebration or specialist programme." },
];
const groupSizes = ["Not sure yet", "Up to 12", "13–20", "21–30", "31–40", "41–56", "More than 56"];
const lengths = ["Open to advice", "2–3 nights", "4–5 nights", "6–7 nights", "8+ nights"];
const budgets = ["Not yet decided", "Under £10,000", "£10,000–£25,000", "£25,000–£50,000", "£50,000–£100,000", "£100,000+"];
const cateringOpts = ["Let's discuss the options", "Fully catered with hosts", "Accommodation only at Buchlyvie"];
const timing = ["Exploring ideas", "Within a month", "In the next 1–3 months", "Later in the year"];
const extras = ["Yoga & movement", "Creative workshops", "Food & tastings", "Outdoor experiences", "Culture & excursions", "Facilitated sessions"];

type Brief = {
  type: string;
  group: string;
  length: string;
  idea: string;
  venue: string;
  destination: string;
  dates: string;
  budget: string;
  catering: string;
  decide: string;
  extras: string[];
  name: string;
  email: string;
  organisation: string;
  phone: string;
  notes: string;
  consent: boolean;
};

const steps = ["Your retreat", "The details", "About you"];

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border px-4 py-2.5 text-sm transition-all duration-200",
        active ? "border-forest bg-forest text-ivory" : "border-border bg-card hover:border-ink/40",
      )}
    >
      {children}
    </button>
  );
}

function Field({ label, optional, children }: { label: string; optional?: boolean; children: ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3 text-[0.6rem] text-ink/70">
        {label} {optional && <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>}
      </p>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-ink/35 focus:border-forest focus-visible:outline-none";

export function Planner({ initialType, initialVenue }: { initialType?: string | undefined; initialVenue?: string | undefined }) {
  const preVenue = venues.find((v) => v.slug === initialVenue);
  const preType = types.find((t) => t.id === initialType);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [b, setB] = useState<Brief>({
    type: preType?.label ?? "",
    group: "Not sure yet",
    length: "Open to advice",
    idea: "",
    venue: preVenue?.name ?? "Help me choose",
    destination: preVenue?.country ?? "Open to advice",
    dates: "",
    budget: "Not yet decided",
    catering: "Let's discuss the options",
    decide: "Exploring ideas",
    extras: [],
    name: "",
    email: "",
    organisation: "",
    phone: "",
    notes: "",
    consent: false,
  });
  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => setB((p) => ({ ...p, [k]: v }));

  const go = (n: number) => {
    setError("");
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const briefText = useMemo(
    () =>
      [
        "RACHEL'S RETREATS — RETREAT BRIEF",
        "",
        `Retreat type: ${b.type || "Not specified"}`,
        `Group size: ${b.group}`,
        `Length of stay: ${b.length}`,
        `The idea: ${b.idea || "—"}`,
        "",
        `Preferred venue: ${b.venue}`,
        `Preferred destination: ${b.destination}`,
        `Dates or time of year: ${b.dates || "—"}`,
        `Total group budget: ${b.budget}`,
        `Catering: ${b.catering}`,
        `Deciding: ${b.decide}`,
        `Would like to include: ${b.extras.join(", ") || "—"}`,
        "",
        `Name: ${b.name}`,
        `Email: ${b.email}`,
        `Organisation: ${b.organisation || "—"}`,
        `Phone: ${b.phone || "—"}`,
        `Anything else: ${b.notes || "—"}`,
      ].join("\n"),
    [b],
  );

  const submit = () => {
    if (!b.name.trim()) return setError("Please add your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) return setError("Please add a valid email address.");
    if (!b.consent) return setError("Please confirm you're happy for us to store your brief.");
    setError("");
    setSent(true);
  };

  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
    `Retreat brief: ${b.type || "New retreat"}${b.name ? ` — ${b.name}` : ""}`,
  )}&body=${encodeURIComponent(briefText)}`;

  const download = () => {
    const url = URL.createObjectURL(new Blob([briefText], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "rachels-retreats-brief.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const summary = [
    { k: "The idea", v: b.type || "Your choice" },
    { k: "Your people", v: b.group },
    { k: "The place", v: b.venue === "Help me choose" ? b.destination : b.venue },
    { k: "Time away", v: b.length },
    { k: "When", v: b.dates || "Still open" },
    { k: "Group budget", v: b.budget },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      <div className="bg-card p-6 shadow-[0_0_0_1px_var(--color-border)] md:p-12">
        {/* Progress */}
        <ol className="mb-12 grid grid-cols-3 gap-3" aria-label="Planner progress">
          {steps.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                disabled={sent || i > step}
                onClick={() => go(i)}
                className="w-full text-left disabled:cursor-default"
                aria-current={i === step ? "step" : undefined}
              >
                <span className="relative block h-0.5 bg-border">
                  <motion.span
                    className="absolute inset-0 origin-left bg-forest"
                    animate={{ scaleX: sent || i < step ? 1 : i === step ? 0.5 : 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </span>
                <span className={cn("eyebrow mt-3 block text-[0.58rem]", i <= step ? "text-ink" : "text-muted-foreground")}>
                  0{i + 1} · {s}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={sent ? "sent" : step}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -40 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: EASE }}
            >
              {sent ? (
                <div>
                  <span className="grid size-14 place-items-center rounded-full bg-forest text-ivory">
                    <Check className="size-6" />
                  </span>
                  <h3 className="mt-8 text-4xl md:text-5xl">Your brief is ready.</h3>
                  <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
                    Send it to the Retreat Partnership Team using the button below — it opens your email
                    app with everything filled in. Keep a copy for yourself if you like. No booking is
                    made at this stage.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={mailto} className="inline-flex items-center gap-3 bg-forest px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ivory hover:bg-ink">
                      <Mail className="size-4" /> Send to the team
                    </a>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(briefText);
                        setCopied(true);
                      }}
                      className="inline-flex items-center gap-3 border border-ink/25 px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] hover:border-ink"
                    >
                      <Copy className="size-4" /> {copied ? "Copied" : "Copy brief"}
                    </button>
                    <button
                      type="button"
                      onClick={download}
                      className="inline-flex items-center gap-3 border border-ink/25 px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] hover:border-ink"
                    >
                      <Download className="size-4" /> Download
                    </button>
                  </div>
                  <pre className="mt-10 max-h-72 overflow-auto whitespace-pre-wrap bg-stone p-6 text-xs leading-relaxed" data-lenis-prevent>
                    {briefText}
                  </pre>
                  <button type="button" onClick={() => { setSent(false); go(0); }} className="link-draw mt-8 pb-1 text-sm">
                    Start a new brief
                  </button>
                </div>
              ) : step === 0 ? (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-4xl md:text-5xl">What are you bringing together?</h3>
                    <p className="mt-3 text-muted-foreground">Rough ideas are welcome.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {types.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={b.type === t.label}
                        onClick={() => set("type", t.label)}
                        className={cn(
                          "group relative border p-5 text-left transition-all duration-300",
                          b.type === t.label ? "border-forest bg-forest text-ivory" : "border-border hover:-translate-y-0.5 hover:border-ink/40",
                        )}
                      >
                        <span className="block font-display text-2xl">{t.label}</span>
                        <span className={cn("mt-1 block text-sm", b.type === t.label ? "text-ivory/75" : "text-muted-foreground")}>{t.short}</span>
                        {b.type === t.label && (
                          <motion.span layoutId="type-check" className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-brass text-ink">
                            <Check className="size-3.5" />
                          </motion.span>
                        )}
                      </button>
                    ))}
                  </div>
                  <Field label="How many people?">
                    <div className="flex flex-wrap gap-2">
                      {groupSizes.map((g) => (
                        <Pill key={g} active={b.group === g} onClick={() => set("group", g)}>{g}</Pill>
                      ))}
                    </div>
                  </Field>
                  <Field label="How long are you thinking?">
                    <div className="flex flex-wrap gap-2">
                      {lengths.map((g) => (
                        <Pill key={g} active={b.length === g} onClick={() => set("length", g)}>{g}</Pill>
                      ))}
                    </div>
                  </Field>
                  <Field label="Tell us a little about the idea" optional>
                    <textarea rows={3} className={inputCls} value={b.idea} onChange={(e) => set("idea", e.target.value)} placeholder="A week of practice for my community…" />
                  </Field>
                </div>
              ) : step === 1 ? (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-4xl md:text-5xl">A favourite place? A few preferences?</h3>
                    <p className="mt-3 text-muted-foreground">Choose what you know. Every question here is optional.</p>
                  </div>
                  <Field label="Preferred venue">
                    <div className="flex flex-wrap gap-2">
                      {["Help me choose", ...venues.filter((v) => !v.comingSoon).map((v) => v.name)].map((n) => (
                        <Pill key={n} active={b.venue === n} onClick={() => {
                          set("venue", n);
                          const v = venues.find((x) => x.name === n);
                          if (v) set("destination", v.country);
                        }}>{n}</Pill>
                      ))}
                    </div>
                  </Field>
                  <Field label="Preferred destination">
                    <div className="flex flex-wrap gap-2">
                      {["Open to advice", ...countries, "Another destination"].map((n) => (
                        <Pill key={n} active={b.destination === n} onClick={() => set("destination", n)}>{n}</Pill>
                      ))}
                    </div>
                  </Field>
                  <div className="grid gap-10 md:grid-cols-2">
                    <Field label="Dates or time of year">
                      <input className={inputCls} value={b.dates} onChange={(e) => set("dates", e.target.value)} placeholder="e.g. Late spring 2027" />
                    </Field>
                    <Field label="Total group budget">
                      <select className={inputCls} value={b.budget} onChange={(e) => set("budget", e.target.value)}>
                        {budgets.map((x) => <option key={x}>{x}</option>)}
                      </select>
                    </Field>
                    <Field label="What sort of catering?">
                      <select className={inputCls} value={b.catering} onChange={(e) => set("catering", e.target.value)}>
                        {cateringOpts.map((x) => <option key={x}>{x}</option>)}
                      </select>
                    </Field>
                    <Field label="When would you like to decide?">
                      <select className={inputCls} value={b.decide} onChange={(e) => set("decide", e.target.value)}>
                        {timing.map((x) => <option key={x}>{x}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Anything you'd like to include?">
                    <div className="flex flex-wrap gap-2">
                      {extras.map((x) => (
                        <Pill key={x} active={b.extras.includes(x)} onClick={() => set("extras", b.extras.includes(x) ? b.extras.filter((y) => y !== x) : [...b.extras, x])}>
                          {x}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
              ) : (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-4xl md:text-5xl">Who shall we plan with?</h3>
                    <p className="mt-3 text-muted-foreground">Your brief goes directly to our Retreat Partnership Team.</p>
                  </div>
                  <div className="grid gap-10 md:grid-cols-2">
                    <Field label="Your name *">
                      <input className={inputCls} autoComplete="name" value={b.name} onChange={(e) => set("name", e.target.value)} />
                    </Field>
                    <Field label="Email address *">
                      <input type="email" className={inputCls} autoComplete="email" value={b.email} onChange={(e) => set("email", e.target.value)} />
                    </Field>
                    <Field label="Organisation or retreat brand" optional>
                      <input className={inputCls} autoComplete="organization" value={b.organisation} onChange={(e) => set("organisation", e.target.value)} />
                    </Field>
                    <Field label="Phone number" optional>
                      <input type="tel" className={inputCls} autoComplete="tel" value={b.phone} onChange={(e) => set("phone", e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Anything else you'd like us to know?" optional>
                    <textarea rows={3} className={inputCls} value={b.notes} onChange={(e) => set("notes", e.target.value)} />
                  </Field>
                  <label className="flex cursor-pointer items-start gap-4 text-sm leading-relaxed">
                    <input type="checkbox" checked={b.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 size-4 accent-[var(--forest)]" />
                    I understand Rachel's Retreats will store my brief and contact me about planning the
                    retreat. Sending an enquiry does not reserve dates or subscribe me to marketing.
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {!sent && (
          <div className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-8">
            <button
              type="button"
              onClick={() => go(step - 1)}
              className={cn("inline-flex items-center gap-2 text-sm transition-opacity", step === 0 && "pointer-events-none opacity-0")}
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <p className="flex-1 text-right text-sm text-destructive" role="alert">{error}</p>
            <button
              type="button"
              onClick={() => (step < 2 ? go(step + 1) : submit())}
              className="group inline-flex items-center gap-3 bg-forest px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-ink"
            >
              {step < 2 ? "Continue" : "Create my brief"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Live summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <div className="grain relative overflow-hidden bg-forest p-8 text-ivory md:p-10">
          <p className="eyebrow text-brass">Coming together</p>
          <h3 className="mt-4 text-4xl">
            Your retreat, <em>taking shape.</em>
          </h3>
          <dl className="mt-8 divide-y divide-ivory/15">
            {summary.map((s) => (
              <div key={s.k} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="eyebrow text-[0.58rem] text-ivory/60">{s.k}</dt>
                <AnimatePresence mode="wait">
                  <motion.dd
                    key={s.v}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="text-right font-display text-xl"
                  >
                    {s.v}
                  </motion.dd>
                </AnimatePresence>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm leading-relaxed text-ivory/70">
            Good retreats begin with a conversation. You don't need every answer yet.
          </p>
          <p className="mt-4 text-sm">
            Prefer to talk?{" "}
            <a href={contact.phoneHref} className="link-draw pb-0.5 text-brass">
              {contact.phone}
            </a>
          </p>
        </div>
      </aside>
    </div>
  );
}
