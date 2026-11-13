import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealImage } from "@/components/motion";
import {
  ButtonLink,
  ClosingCTA,
  FaqItem,
  LinkedParagraphs,
  LinkedText,
  PageHero,
  SectionHeading,
} from "@/components/ui-luxe";
import {
  DayExplorer,
  HostingJourney,
  ResponsibilitySplit,
  ServiceCards,
} from "@/components/host-sections";
import { SITE_URL } from "@/data/site";
import {
  chooseVenue,
  costs,
  dayExplorer,
  firstRetreat,
  hostClosing,
  hostFaqs,
  hostHero,
  hostMeta,
  journey,
  programmeFlow,
  visionSupport,
} from "@/data/host-content";

const pageUrl = `${SITE_URL}/host`;
const prose = "leading-relaxed text-ink/80";

export const Route = createFileRoute("/host")({
  head: () => ({
    meta: [
      { title: hostMeta.title },
      { name: "description", content: hostMeta.description },
      { property: "og:title", content: hostMeta.title },
      { property: "og:description", content: hostMeta.description },
      { property: "og:url", content: pageUrl },
    ],
    links: [{ rel: "canonical", href: pageUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: hostFaqs.items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: HostPage,
});

function HostPage() {
  return (
    <>
      {/* 01 · Hero */}
      <PageHero
        fitIntro
        eyebrow="For retreat organisers"
        lines={["Host an Extraordinary Retreat", <em key="b">with Rachel’s Retreats</em>]}
        intro={hostHero.intro}
        image="/images/studio.webp"
        alt="The studio at Rachel’s Farm Buchlyvie, set up for a retreat session"
      >
        <p className="mt-5 font-display text-2xl italic text-ivory">{hostHero.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/plan" variant="light">
            Design Your Retreat
          </ButtonLink>
          <ButtonLink to="/venues" variant="outline-light">
            Explore Our Venues
          </ButtonLink>
        </div>
      </PageHero>

      {/* 02 · What we help you plan: interactive service cards */}
      <section className="py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            splitColumns="lg:grid-cols-[7fr_3fr]"
            headingClassName="lg:text-[clamp(3.25rem,5.3vw,4.5rem)]"
            eyebrow="What we help you plan"
            lines={["More time with your people.", <em key="l">Less time on the detail.</em>]}
            intro={hostHero.collection}
          />
          <div className="mt-10">
            <ServiceCards />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Hover, tap or press <span className="font-semibold">+</span> on a card to read more.
          </p>
        </div>
      </section>

      {/* 03 · Who does what */}
      <section className="bg-stone py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="Who does what"
            lines={[visionSupport.heading]}
            intro={visionSupport.intro[0]}
          />
          <div className="mt-10">
            <ResponsibilitySplit />
          </div>
          <Reveal className="mt-8 max-w-3xl">
            <p className={prose}>{visionSupport.outro}</p>
          </Reveal>
        </div>
      </section>

      {/* 04 · Hosting journey (click-driven) */}
      <section className="py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="How hosting works"
            lines={[journey.heading]}
            intro={journey.intro}
          />
          <div className="mt-8">
            <HostingJourney />
          </div>
        </div>
      </section>

      {/* 05 · Sample retreat day */}
      <section className="bg-stone py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="A day designed around your programme"
            lines={[dayExplorer.heading]}
            intro="Choose a retreat format to see how a day might come together around your sessions."
          />
          <div className="mt-10">
            <DayExplorer />
          </div>
          <div className="mt-14 grid gap-8 border-t border-ink/10 pt-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <h3 className="text-[clamp(2rem,3.2vw,2.75rem)] leading-tight">
              {programmeFlow.heading}
            </h3>
            <Reveal className="space-y-4">
              {programmeFlow.body.map((p) => (
                <p key={p} className={prose}>
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 06 · Booking considerations: photo + expandable panels */}
      <section className="py-14 md:py-20">
        <div className="container-luxe grid items-start gap-10 lg:grid-cols-[45fr_55fr] lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <RevealImage
              src="/images/buchlyvie-bedroom.webp"
              alt="A bedroom at Rachel’s Farm Buchlyvie"
              className="aspect-[4/5]"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="The details that matter"
              lines={[costs.heading]}
              intro={costs.intro}
            />
            <div className="mt-8 border-t border-border">
              {costs.panels.map((p, i) => (
                <FaqItem key={p.title} q={p.title} defaultOpen={i === 0}>
                  <LinkedParagraphs paragraphs={p.body} className="mt-3 first:mt-0" />
                </FaqItem>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <InlineGuide slug="retreat-costs">What affects the cost of a retreat</InlineGuide>
              <InlineGuide slug="minimum-stays-and-group-sizes">Minimum stays by venue</InlineGuide>
              <InlineGuide slug="venue-hire-or-hosted-retreat">
                Venue hire or a hosted retreat
              </InlineGuide>
            </div>
          </div>
        </div>
      </section>

      {/* 07 · First retreat + choosing a venue */}
      <section className="bg-stone py-14 md:py-20">
        <div className="container-luxe grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full rounded-[1.5rem] bg-card p-8 shadow-[0_0_0_1px_var(--color-border)] md:p-10">
            <p className="eyebrow text-[0.6rem] text-forest">New to hosting</p>
            <h2 className="mt-4 text-[clamp(2rem,3.4vw,3rem)] leading-tight">
              {firstRetreat.heading}
            </h2>
            <div className="mt-5 space-y-3">
              {firstRetreat.body.map((p) => (
                <p key={p} className={prose}>
                  {p}
                </p>
              ))}
            </div>
            <InlineGuide slug="planning-your-first-retreat" className="mt-6">
              Read the first-retreat guide
            </InlineGuide>
          </Reveal>
          <Reveal
            delay={0.1}
            className="h-full overflow-hidden rounded-[1.5rem] bg-forest text-ivory"
          >
            <img
              src="/images/manor-house.webp"
              alt="The Manor House, County Monaghan"
              loading="lazy"
              className="aspect-[16/7] w-full object-cover"
            />
            <div className="p-8 md:p-10">
              <p className="eyebrow text-[0.6rem] text-brass">Finding the fit</p>
              <h2 className="mt-4 text-[clamp(2rem,3.4vw,3rem)] leading-tight">
                {chooseVenue.heading}
              </h2>
              <div className="mt-5 space-y-3 text-ivory/80">
                {chooseVenue.body.map((p) => (
                  <p key={p} className="leading-relaxed">
                    <LinkedText text={p} />
                  </p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <Link
                  to="/venues"
                  className="link-draw inline-flex items-center gap-2 pb-1 text-brass"
                >
                  Browse our venues <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/guides/$slug"
                  params={{ slug: "choosing-a-venue" }}
                  className="link-draw inline-flex items-center gap-2 pb-1 text-brass"
                >
                  Guide: choose a venue <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 08 · FAQs */}
      <section className="py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Practical questions" lines={[hostFaqs.heading]} />
            <Reveal delay={0.2} className="mt-8">
              <Link
                to="/guides"
                className="link-draw inline-flex items-center gap-2 pb-1 text-sm text-forest"
              >
                All guides & FAQs <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>
          <Reveal className="border-t border-border">
            {hostFaqs.items.map((f, i) => (
              <FaqItem key={f.q} q={f.q} defaultOpen={i === 0}>
                <LinkedText text={f.a} />
              </FaqItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 09 · Conversion */}
      <ClosingCTA
        eyebrow="Ready when you are"
        lines={[hostClosing.heading]}
        body={
          <>
            {hostClosing.body.map((p) => (
              <p key={p} className="mt-3 first:mt-0">
                {p}
              </p>
            ))}
          </>
        }
        ctaLabel={hostClosing.cta}
        image="/images/lakeside-lodge.webp"
      />
    </>
  );
}

function InlineGuide({
  slug,
  children,
  className,
}: {
  slug: string;
  children: string;
  className?: string;
}) {
  return (
    <Link
      to="/guides/$slug"
      params={{ slug }}
      className={`link-draw inline-flex items-center gap-2 pb-1 text-sm text-forest ${className ?? ""}`}
    >
      {children} <ArrowRight className="size-3.5" />
    </Link>
  );
}
