import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { EASE, Reveal, RevealImage, SplitLines } from "@/components/motion";
import { ClosingCTA, FaqItem, SectionHeading } from "@/components/ui-luxe";
import {
  GuestEnquiryForm,
  OrganiserSpotlight,
  RetreatFinder,
  upcomingRetreats,
} from "@/components/retreat-components";
import { SITE_URL } from "@/data/site";
import {
  discoverClosing,
  expect,
  experienceTypes,
  feelsRight,
  guestFaqs,
  meetPeople,
  preparing,
  retreatsHero,
  retreatsMeta,
  upcoming,
} from "@/data/retreats-seo";

const pageUrl = `${SITE_URL}/retreats`;
const prose = "leading-relaxed text-ink/80";

type RetreatsSearch = { retreat?: string | undefined };

export const Route = createFileRoute("/retreats/")({
  validateSearch: (s: Record<string, unknown>): RetreatsSearch => ({
    retreat: typeof s["retreat"] === "string" ? s["retreat"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: retreatsMeta.title },
      { name: "description", content: retreatsMeta.description },
      { property: "og:title", content: retreatsMeta.title },
      { property: "og:description", content: retreatsMeta.description },
      { property: "og:url", content: pageUrl },
    ],
    links: [{ rel: "canonical", href: pageUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guestFaqs.items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: RetreatsPage,
});

function RetreatsPage() {
  const { retreat } = Route.useSearch();
  const list = upcomingRetreats();

  return (
    <>
      {/* 01 · 60/40 editorial hero */}
      <section className="bg-ivory pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="container-luxe grid items-center gap-10 lg:grid-cols-[60fr_40fr] lg:gap-14">
          <div>
            <p className="animate-fade-up eyebrow flex items-center gap-4 text-forest">
              <span className="h-px w-10 bg-current" aria-hidden /> For guests
            </p>
            <SplitLines
              as="h1"
              animateOnMount
              delay={0.1}
              lines={["Find Your Next", <em key="e">Extraordinary Retreat</em>]}
              className="mt-6 text-[clamp(2.75rem,6vw,5.75rem)]"
            />
            <p
              className="animate-fade-up mt-7 max-w-2xl text-lg leading-relaxed text-ink/80"
              style={{ animationDelay: "350ms" }}
            >
              {retreatsHero.intro}
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "500ms" }}
            >
              <a
                href="#upcoming"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-ink"
              >
                Explore upcoming retreats <ArrowDown className="size-4" />
              </a>
              <Link to="/saved" className="link-draw pb-1 text-sm text-forest">
                View saved retreats
              </Link>
            </div>
          </div>
          <div className="relative">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-stone"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <img
                src="/images/art.webp"
                alt="Guests together during a retreat session at Rachel’s Retreats"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              className="absolute -bottom-6 -left-6 hidden w-40 overflow-hidden rounded-[1.25rem] shadow-xl ring-4 ring-ivory sm:block md:w-48"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            >
              <img src="/images/studio.webp" alt="" className="aspect-square w-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 02 · Upcoming retreats + finder (immediately after the hero) */}
      <section
        id="upcoming"
        className="scroll-mt-24 bg-stone py-12 md:py-16"
        aria-labelledby="upcoming-heading"
      >
        <div className="container-luxe">
          <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow mb-4 text-[0.62rem] text-forest">The calendar</p>
              <h2 id="upcoming-heading" className="text-[clamp(2.5rem,4.5vw,4rem)] leading-tight">
                {upcoming.heading}
              </h2>
            </div>
            <div className="space-y-2 text-ink/75 lg:pb-2">
              <p>{upcoming.intro}</p>
              <p>{upcoming.body[0]}</p>
            </div>
          </div>
          <div className="mt-8">
            <RetreatFinder retreats={list} />
          </div>
          <div className="mt-8 grid gap-3 text-sm text-ink/70 md:grid-cols-3">
            {upcoming.body.slice(1).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · Find a retreat that feels right: 45/55 split */}
      <section className="py-14 md:py-20">
        <div className="container-luxe grid items-center gap-10 lg:grid-cols-[45fr_55fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Choosing well" lines={[feelsRight.heading]} />
            <Reveal delay={0.1} className="mt-6 space-y-4">
              {feelsRight.body.map((p) => (
                <p key={p} className={prose}>
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <RevealImage
            src="/images/buchlyvie.webp"
            alt="Rachel’s Farm Buchlyvie in the Stirlingshire countryside"
            className="aspect-[4/3] lg:aspect-[5/4]"
          />
        </div>
      </section>

      {/* 04 · Experience types: image-led cards */}
      <section className="bg-stone py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="What kind of retreat feels right?"
            lines={[experienceTypes.heading]}
            intro="Four ways guests come together. Programmes are added as organisers confirm their dates."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {experienceTypes.items.map((t, i) => (
              <motion.article
                key={t.heading}
                className="group grid overflow-hidden rounded-[1.5rem] bg-card shadow-[0_0_0_1px_var(--color-border)] sm:grid-cols-[2fr_3fr]"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.5, ease: EASE, delay: (i % 2) * 0.1 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto">
                  <img
                    src={t.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="text-2xl leading-tight md:text-3xl">{t.heading}</h3>
                  <div className="mt-3 space-y-2.5 text-[0.93rem]">
                    {t.body.map((p) => (
                      <p key={p} className={prose}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 05 · Meet the organisers */}
      <section className="py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The people behind the experience"
              lines={[meetPeople.heading]}
            />
            <Reveal delay={0.1} className="mt-6 space-y-3">
              {meetPeople.body.map((p) => (
                <p key={p} className={prose}>
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <div className="lg:pt-24">
            <OrganiserSpotlight retreats={list} />
          </div>
        </div>
      </section>

      {/* 06 · What to expect: image + text */}
      <section className="bg-forest py-14 text-ivory md:py-20">
        <div className="container-luxe grid items-center gap-10 lg:grid-cols-[55fr_45fr] lg:gap-16">
          <RevealImage
            src="/images/food-fish.webp"
            alt="A shared meal on retreat"
            className="aspect-[4/3] lg:aspect-[5/4]"
          />
          <div>
            <SectionHeading light eyebrow="First retreat?" lines={[expect.heading]} />
            <Reveal delay={0.1} className="mt-6 space-y-3 text-ivory/80">
              {expect.body.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 07 · Preparing: three-step guide */}
      <section className="py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="Before you go"
            lines={[preparing.heading]}
            intro={preparing.lead}
          />
          <ol className="relative mt-10 grid gap-8 md:grid-cols-3">
            <motion.span
              aria-hidden
              className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-brass/60 md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: EASE }}
            />
            {preparing.steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="relative z-10 grid size-12 place-items-center rounded-full bg-ivory font-display text-xl text-forest ring-1 ring-brass">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-3xl leading-tight">{s.title}</h3>
                <div className="mt-3 space-y-3">
                  {s.body.map((p) => (
                    <p key={p} className={prose}>
                      {p}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <Link
            to="/guides/$slug"
            params={{ slug: "joining-a-retreat" }}
            className="link-draw mt-8 inline-flex items-center gap-2 pb-1 text-sm text-forest"
          >
            Read the guest guide: before you join a retreat <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* 08 · FAQs */}
      <section className="border-t border-border py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading eyebrow="Guest questions" lines={[guestFaqs.heading]} />
          <Reveal className="border-t border-border">
            {guestFaqs.items.map((f, i) => (
              <FaqItem key={f.q} q={f.q} defaultOpen={i === 0}>
                {f.a}
              </FaqItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Enquiry (server-side) */}
      <section id="enquire" className="scroll-mt-24 bg-stone py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow="Find your kind of retreat"
            lines={["Ask about a retreat"]}
            intro="Ask about a listed retreat, or tell us what you have in mind. Your enquiry comes to Rachel’s Retreats first; we confirm details with the organiser, who confirms your place and collects payment."
          />
          <div className="rounded-[1.5rem] bg-card p-7 shadow-[0_0_0_1px_var(--color-border)] md:p-10">
            <GuestEnquiryForm defaultRetreat={retreat ?? ""} />
          </div>
        </div>
      </section>

      {/* 09 · Final CTA */}
      <ClosingCTA
        eyebrow="Your next experience"
        lines={[discoverClosing.heading]}
        body={
          <>
            {discoverClosing.body.map((p) => (
              <p key={p} className="mt-3 first:mt-0">
                {p}
              </p>
            ))}
            <p className="mt-3 font-semibold text-ivory">{discoverClosing.cta}</p>
          </>
        }
        ctaLabel="Plan a private retreat"
        image="/images/villa-senesi.webp"
      />

      {/* Secondary organiser pathway (kept below guest discovery) */}
      <section className="py-10 md:py-12">
        <div className="container-luxe flex flex-col gap-4 rounded-[1.5rem] bg-stone p-7 md:flex-row md:items-center md:justify-between md:p-9">
          <div>
            <p className="eyebrow text-[0.6rem] text-forest">For organisers</p>
            <h2 className="mt-2 text-3xl">
              Have a retreat coming up? Feature it with Rachel’s Retreats.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Submissions are reviewed by our team before anything is published.
            </p>
          </div>
          <Link
            to="/list-your-retreat"
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm ring-1 ring-ink/25 transition-colors hover:bg-ink hover:text-ivory"
          >
            Submit a retreat <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
