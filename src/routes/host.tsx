import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { EASE, ParallaxImage, Reveal } from "@/components/motion";
import { ButtonLink, ClosingCTA, PageHero, SectionHeading } from "@/components/ui-luxe";
import { ExperienceSelector, ScrollStory } from "@/components/sections";
import { faqs, hostSteps } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/host")({
  head: () => ({
    meta: [
      { title: "Host a retreat — Rachel's Retreats" },
      {
        name: "description",
        content:
          "For yoga teachers, artists, company organisers and communities. Bring your programme; we coordinate venue, catering, hosting and experiences.",
      },
    ],
  }),
  component: HostPage,
});

const services = [
  { title: "Venue & accommodation", image: "/images/buchlyvie-bedroom.webp" },
  { title: "Catering & dietary planning", image: "/images/food-gnocchi.webp" },
  { title: "Activities & excursions", image: "/images/highland-cattle.webp" },
  { title: "Guest care & coordination", image: "/images/buchlyvie-lodges.webp" },
];

function Faq({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-7 text-left"
      >
        <span className="font-display text-2xl md:text-3xl">{q}</span>
        <Plus
          className={cn("size-5 shrink-0 transition-transform duration-300", open && "rotate-45")}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="overflow-hidden"
      >
        <p className="max-w-2xl pb-8 leading-relaxed text-muted-foreground">{a}</p>
      </motion.div>
    </div>
  );
}

function HostPage() {
  return (
    <>
      <PageHero
        eyebrow="For retreat organisers"
        lines={["Bring the idea.", <em key="b">We'll help bring</em>, <em key="c">it to life.</em>]}
        intro="Yoga teachers, artists, company organisers, communities and tour operators. Tell us what you want to create, and let's shape the place, food and experience around it."
        image="/images/studio.webp"
        alt="The studio at Rachel's Farm Buchlyvie"
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/plan" variant="light">
            Build your retreat brief
          </ButtonLink>
        </div>
      </PageHero>

      <section className="py-16 md:py-24">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="Fully managed, thoughtfully personal"
            lines={["More time with your people.", <em key="l">Less time on the detail.</em>]}
            intro="A private setting, menus to suit your guests and hosts who help the days run smoothly. Bring your programme and ask us for the support around it."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="group">
                  <ParallaxImage src={s.image} alt="" className="aspect-[3/4]" strength={6} />
                  <p className="mt-5 font-display text-2xl">{s.title}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <ScrollStory
          steps={hostSteps}
          header={
            <SectionHeading
              eyebrow="How hosting works"
              lines={["From your first idea", <em key="a">to arrival.</em>]}
              intro="You deliver the programme and sell the places. We coordinate the agreed accommodation, hospitality and practical arrangements."
            />
          }
        />
      </section>

      <section className="bg-stone py-16 md:py-24">
        <ExperienceSelector
          header={
            <SectionHeading
              eyebrow="Space for your ideas"
              lines={["Every kind of", <em key="g">gathering.</em>]}
            />
          }
        />
      </section>

      <section className="py-16 md:py-24">
        <div className="container-luxe grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading
            eyebrow="Before you enquire"
            lines={["The practical", <em key="q">questions.</em>]}
            intro="Understand the arrangement before choosing your venue and programme."
          />
          <Reveal className="border-t border-border">
            {faqs.map((f, i) => (
              <Faq key={f.q} q={f.q} a={f.a} i={i} />
            ))}
            <ButtonLink to="/guides" variant="text" className="mt-8 py-0">
              All guides & FAQs
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <ClosingCTA image="/images/lakeside-lodge.webp" />
    </>
  );
}
