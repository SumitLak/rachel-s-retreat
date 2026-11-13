import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Mail } from "lucide-react";
import { EASE, Reveal } from "@/components/motion";
import { ButtonLink, PageHero, SectionHeading } from "@/components/ui-luxe";
import { RetreatCard } from "@/components/sections";
import { contact, experiences, retreats } from "@/data/site";
import { cn } from "@/lib/utils";

type RetreatSearch = { retreat?: string | undefined };

export const Route = createFileRoute("/retreats")({
  validateSearch: (s: Record<string, unknown>): RetreatSearch => ({
    retreat: typeof s["retreat"] === "string" ? s["retreat"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Find a retreat — Rachel's Retreats" },
      {
        name: "description",
        content: "Join a retreat around the things you love: yoga, creativity, food, golf and Scottish adventure.",
      },
    ],
  }),
  component: RetreatsPage,
});

const inputCls =
  "w-full border-0 border-b border-ink/25 bg-transparent px-0 py-3 outline-none transition-colors focus:border-forest";

function RetreatsPage() {
  const { retreat } = Route.useSearch();
  const [filter, setFilter] = useState<string>("all");
  const shown = useMemo(() => retreats.filter((r) => filter === "all" || r.typeId === filter), [filter]);

  const [form, setForm] = useState({
    which: retreats.find((r) => r.id === retreat)?.title ?? "Help me find a retreat",
    interest: "",
    when: "",
    name: "",
    email: "",
    question: "",
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const body = [
    `Retreat: ${form.which}`,
    `Interested in: ${form.interest || "—"}`,
    `Where or when: ${form.when || "—"}`,
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Question: ${form.question || "—"}`,
  ].join("\n");
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`Guest enquiry: ${form.which}`)}&body=${encodeURIComponent(body)}`;
  const ready = form.name.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const tabs = [{ id: "all", label: "All retreats" }, ...experiences.map((e) => ({ id: e.id as string, label: e.label }))];

  return (
    <>
      <PageHero
        eyebrow="For the guests"
        lines={["Come for something", <em key="y">you love.</em>]}
        intro="Find a retreat around the things you enjoy. Enquire with our team, and we'll help with the details and introduce you to the organiser."
        image="/images/stirling-castle.webp"
        alt="Stirling Castle"
      />

      <section className="py-20 md:py-28">
        <div className="container-luxe">
          <Reveal className="flex flex-wrap gap-2 border-y border-border py-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={filter === t.id}
                onClick={() => setFilter(t.id)}
                className={cn(
                  "relative px-4 py-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] transition-colors",
                  filter === t.id ? "text-ivory" : "text-ink/65 hover:text-ink",
                )}
              >
                {filter === t.id && (
                  <motion.span layoutId="retreat-filter" className="absolute inset-0 bg-forest" transition={{ duration: 0.45, ease: EASE }} />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </Reveal>

          <div className="mt-14 grid gap-8">
            <AnimatePresence mode="popLayout">
              {shown.map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <RetreatCard retreat={r} />
                </motion.div>
              ))}
            </AnimatePresence>
            {shown.length === 0 && (
              <div className="bg-stone p-10 text-center md:p-16">
                <h3 className="text-4xl">A different time or interest?</h3>
                <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                  Try another selection, or tell us what you would like to join.
                </p>
                <a href="#enquire" className="link-draw mt-6 inline-block pb-1 text-sm font-semibold uppercase tracking-[0.18em]">
                  Tell us your interests
                </a>
              </div>
            )}
          </div>
          <p className="mt-10 max-w-2xl text-sm text-muted-foreground">
            Enquiries come to Rachel's Retreats first. We'll confirm details with the organiser before
            you make any booking; the organiser confirms your place and collects your payment.
          </p>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-24 bg-stone py-24 md:py-32">
        <div className="container-luxe grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading
            eyebrow="Find your kind of retreat"
            lines={["Let's find", <em key="n">your next retreat.</em>]}
            intro="Ask about a listed retreat, or tell us what you have in mind. An enquiry does not reserve a place or subscribe you to marketing."
          />
          <Reveal delay={0.15} className="bg-card p-8 shadow-[0_0_0_1px_var(--color-border)] md:p-12">
            <div className="grid gap-8 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="eyebrow text-[0.6rem] text-ink/70">Which retreat?</span>
                <select className={inputCls} value={form.which} onChange={(e) => set("which", e.target.value)}>
                  <option>Help me find a retreat</option>
                  {retreats.map((r) => (
                    <option key={r.id}>{r.title}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="eyebrow text-[0.6rem] text-ink/70">I'm interested in</span>
                <select className={inputCls} value={form.interest} onChange={(e) => set("interest", e.target.value)}>
                  <option value="">Choose one</option>
                  {experiences.map((e) => (
                    <option key={e.id}>{e.label}</option>
                  ))}
                  <option>Food & culinary</option>
                  <option>Something else</option>
                </select>
              </label>
              <label>
                <span className="eyebrow text-[0.6rem] text-ink/70">Where or when?</span>
                <input className={inputCls} value={form.when} onChange={(e) => set("when", e.target.value)} />
              </label>
              <label>
                <span className="eyebrow text-[0.6rem] text-ink/70">Your name *</span>
                <input className={inputCls} autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </label>
              <label>
                <span className="eyebrow text-[0.6rem] text-ink/70">Email address *</span>
                <input type="email" className={inputCls} autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label className="md:col-span-2">
                <span className="eyebrow text-[0.6rem] text-ink/70">Your question (optional)</span>
                <textarea rows={3} className={inputCls} value={form.question} onChange={(e) => set("question", e.target.value)} />
              </label>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href={ready ? mailto : undefined}
                aria-disabled={!ready}
                className={cn(
                  "inline-flex items-center gap-3 bg-forest px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-ink",
                  !ready && "pointer-events-none opacity-40",
                )}
              >
                <Mail className="size-4" /> Send my enquiry
              </a>
              <p className="text-xs text-muted-foreground">Opens your email app with the details filled in.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 text-center md:py-32">
        <div className="container-luxe">
          <SectionHeading align="center" eyebrow="Organising your own?" lines={["Host a retreat", <em key="w">with us.</em>]} />
          <Reveal delay={0.2} className="mt-10">
            <ButtonLink to="/host">How hosting works</ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
