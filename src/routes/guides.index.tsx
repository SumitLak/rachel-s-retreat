import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE, Reveal } from "@/components/motion";
import { ClosingCTA, PageHero, SectionHeading } from "@/components/ui-luxe";
import { guideCategories, guides } from "@/data/guides";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Guides & FAQs — Rachel's Retreats" },
      {
        name: "description",
        content:
          "Practical answers to help you choose a venue, plan the stay and know what happens next.",
      },
    ],
  }),
  component: GuidesPage,
});

type Filter = "all" | (typeof guideCategories)[number]["id"];

function GuidesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const groups = guideCategories.filter((c) => filter === "all" || c.id === filter);
  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All guides" },
    { id: "Planning", label: "Planning your retreat" },
    { id: "Your stay", label: "During your stay" },
    { id: "For guests", label: "Joining a retreat" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Guides & FAQs"
        lines={["A clearer plan.", <em key="b">A better retreat.</em>]}
        intro="Practical answers to help you choose a venue, plan the stay and know what happens next."
        image="/images/buchlyvie-lodges.webp"
        alt="The lodges at Rachel's Farm Buchlyvie"
      />

      <section className="py-12 md:py-20">
        <div className="container-luxe">
          <Reveal className="flex flex-wrap gap-2 border-y border-border py-5">
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
                  <motion.span
                    layoutId="guide-filter"
                    className="absolute inset-0 rounded-full bg-forest"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </Reveal>

          <AnimatePresence mode="popLayout">
            {groups.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-14"
              >
                <SectionHeading split eyebrow={c.id} lines={[c.title]} intro={c.intro} />
                <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {guides
                    .filter((g) => g.category === c.id)
                    .map((g) => (
                      <li key={g.slug}>
                        <Link
                          to="/guides/$slug"
                          params={{ slug: g.slug }}
                          className="group flex h-full flex-col rounded-[1.25rem] bg-card p-7 shadow-[0_0_0_1px_var(--color-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgb(0_0_0/0.25)]"
                        >
                          <span className="font-display text-4xl italic text-brass">{g.n}</span>
                          <h3 className="mt-4 text-3xl leading-tight">{g.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {g.summary}
                          </p>
                          <span className="eyebrow mt-auto flex items-center gap-2 pt-6 text-[0.62rem] text-forest">
                            Read the guide
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <ClosingCTA
        eyebrow="Let's make it happen"
        lines={[
          "Let's plan it",
          <em key="t" className="text-brass">
            together.
          </em>,
        ]}
        body="Tell us your idea, dates and expected group size. Our team will help you explore the next step."
        image="/images/glenalmond.webp"
      />
    </>
  );
}
