import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE, ParallaxImage, Reveal } from "@/components/motion";
import {
  ButtonLink,
  ClosingCTA,
  FaqItem,
  LinkedText,
  PageHero,
  SectionHeading,
} from "@/components/ui-luxe";
import { VenueCard } from "@/components/sections";
import { countries, SITE_URL, venues, type Country } from "@/data/site";
import { venuesSeo as c } from "@/data/venues-seo";

const pageUrl = `${SITE_URL}/venues`;

export const Route = createFileRoute("/venues/")({
  head: () => ({
    meta: [
      { title: c.title },
      { name: "description", content: c.description },
      { property: "og:title", content: c.title },
      { property: "og:description", content: c.description },
      { property: "og:url", content: pageUrl },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: pageUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: c.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Rachel’s Retreats venue collection",
          itemListElement: venues.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: v.name,
            url: `${SITE_URL}/venues/${v.slug}`,
          })),
        }),
      },
    ],
  }),
  component: VenuesPage,
});

const sizes = [
  { label: "Any size", max: 0 },
  { label: "Up to 20", max: 20 },
  { label: "Around 28", max: 28 },
  { label: "Around 30", max: 30 },
];

const prose = "leading-relaxed text-ink/80";

function VenuesPage() {
  const [country, setCountry] = useState<Country | "All">("All");
  const [size, setSize] = useState(0);

  const filtered = useMemo(
    () =>
      venues.filter((v) => {
        if (country !== "All" && v.country !== country) return false;
        // Venues without a published maximum stay visible: the team confirms capacity.
        if (size > 0 && v.maxGuests !== null && v.maxGuests < size) return false;
        return true;
      }),
    [country, size],
  );

  return (
    <>
      {/* 01 · Above the fold */}
      <PageHero
        compact
        eyebrow="The collection"
        lines={["Luxury Retreat Venues", <em key="p">Across the UK & Europe</em>]}
        intro={c.intro[0]}
        image="/images/manor-house.webp"
        alt="The Manor House, County Monaghan"
      />

      <section className="pt-10 md:pt-14">
        <div className="container-luxe grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <Reveal className="space-y-4 text-lg">
            {c.intro.slice(1).map((p) => (
              <p key={p} className={prose}>
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="lg:pb-1">
            <p className="font-display text-2xl leading-snug">
              <strong className="font-normal">{c.introCta}</strong>
            </p>
            <ButtonLink to="/plan" className="mt-5">
              Plan your retreat
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* 02 · Filters and venue cards, immediately below the intro */}
      <section className="py-10 md:py-14" aria-labelledby="collection-heading">
        <div className="container-luxe">
          <h2 id="collection-heading" className="eyebrow mb-4 text-[0.62rem] text-forest">
            Explore the collection
          </h2>
          <Reveal className="flex flex-col gap-6 border-y border-border py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-3 text-[0.6rem] text-muted-foreground">Destination</span>
              {(["All", ...countries] as const).map((cn_) => (
                <FilterButton
                  key={cn_}
                  group="country"
                  active={country === cn_}
                  onClick={() => setCountry(cn_)}
                >
                  {cn_ === "All" ? "All" : cn_}
                </FilterButton>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-3 text-[0.6rem] text-muted-foreground">Group</span>
              {sizes.map((s) => (
                <FilterButton
                  key={s.label}
                  group="size"
                  active={size === s.max}
                  onClick={() => setSize(s.max)}
                >
                  {s.label}
                </FilterButton>
              ))}
            </div>
          </Reveal>

          <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
            Showing {filtered.length} of {venues.length} venues
          </p>

          <motion.div layout className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((v) => (
                <motion.div
                  key={v.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <VenueCard venue={v} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="mt-6 rounded-[1.5rem] bg-stone p-10 text-center">
              <h3 className="text-4xl">Let's find the right fit.</h3>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                No venues in this selection match that group size. Try another destination or ask
                our team for advice.
              </p>
              <ButtonLink to="/plan" className="mt-8">
                Ask us about your group
              </ButtonLink>
            </div>
          )}

          <p className="mt-10 max-w-2xl text-sm text-muted-foreground">
            Group sizes depend on rooming, the properties reserved and your programme. Our team will
            confirm the right arrangement and availability.
          </p>
        </div>
      </section>

      {/* 03 · Find the perfect venue */}
      <section className="border-t border-border py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="Choosing your setting" lines={[c.findVenue.heading]} />
          <Reveal delay={0.1} className="space-y-5 text-lg">
            {c.findVenue.body.map((p) => (
              <p key={p} className={prose}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 04 · Destinations */}
      <section className="bg-stone py-14 md:py-20" aria-labelledby="destinations-heading">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Scotland · England · Ireland · Italy · France"
            lines={[
              <span key="h" id="destinations-heading">
                {c.destinationsHeading}
              </span>,
            ]}
          />
          <div className="mt-12 space-y-16 md:space-y-24">
            {c.destinations.map((d, i) => (
              <Destination key={d.country} d={d} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* 05 · Retreat types */}
      <section className="py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="Retreat types"
            lines={[c.types.heading]}
            intro={c.types.intro[0]}
          />
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {c.types.items.map((t, i) => (
              <Reveal key={t.heading} delay={i * 0.08}>
                <article>
                  <ParallaxImage
                    src={t.image}
                    alt=""
                    className="aspect-[4/3] rounded-[1.5rem] [mask-image:radial-gradient(white,black)]"
                    strength={6}
                  />
                  <h3 className="mt-6 text-3xl leading-tight">{t.heading}</h3>
                  <div className="mt-4 space-y-3">
                    {t.body.map((p) => (
                      <p key={p} className={prose}>
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <InlineLink to="/host">How hosting works</InlineLink>
            <InlineLink to="/retreats">Find a retreat to join</InlineLink>
            <InlineLink to="/discover-scotland">Discover Scotland</InlineLink>
          </Reveal>
        </div>
      </section>

      {/* 06 · Why choose us */}
      <section className="grain relative overflow-hidden bg-forest py-14 text-ivory md:py-20">
        <div className="container-luxe">
          <SectionHeading light eyebrow="Our difference" lines={[c.why.heading]} />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] bg-ivory/15 md:grid-cols-3">
            {c.why.items.map((w, i) => (
              <Reveal key={w.heading} delay={i * 0.08} className="bg-forest">
                <article className="h-full p-8 md:p-10">
                  <p className="font-display text-4xl italic text-brass">0{i + 1}</p>
                  <h3 className="mt-6 text-3xl leading-tight">{w.heading}</h3>
                  <div className="mt-4 space-y-3 text-ivory/75">
                    {w.body.map((p) => (
                      <p key={p} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <Link
              to="/how-we-help"
              className="link-draw inline-flex items-center gap-2 pb-1 text-sm text-brass"
            >
              See how our team supports your retreat <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* How to choose */}
      <section className="py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Before you decide" lines={[c.choose.heading]} />
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <InlineLink to="/guides/$slug" params={{ slug: "choosing-a-venue" }}>
                Guide: choose a venue
              </InlineLink>
              <InlineLink to="/guides/$slug" params={{ slug: "minimum-stays-and-group-sizes" }}>
                Minimum stays by venue
              </InlineLink>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="space-y-5 text-lg">
            {c.choose.body.map((p) => (
              <p key={p} className={prose}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 07 · FAQs */}
      <section className="border-t border-border py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Guides & FAQs" lines={[c.faqHeading]} />
            <Reveal delay={0.2} className="mt-8">
              <InlineLink to="/guides">All guides & FAQs</InlineLink>
            </Reveal>
          </div>
          <Reveal className="border-t border-border">
            {c.faqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} defaultOpen={i === 0}>
                <LinkedText text={f.a} />
              </FaqItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Closing enquiry CTA (planner integration preserved) */}
      <ClosingCTA
        eyebrow="Let’s make it happen"
        lines={[c.closing.heading]}
        body={
          <>
            {c.closing.body.map((p) => (
              <p key={p} className="mt-3 first:mt-0">
                {p}
              </p>
            ))}
            <p className="mt-3 font-semibold text-ivory">{c.closing.cta}</p>
          </>
        }
        image="/images/glenalmond.webp"
      />
    </>
  );
}

type Dest = (typeof c.destinations)[number];

function Destination({ d, flip }: { d: Dest; flip: boolean }) {
  const seen = new Set<string>();
  return (
    <article className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn("lg:sticky lg:top-28", flip && "lg:order-2")}>
        <ParallaxImage
          src={d.image}
          alt={d.imageAlt}
          className="aspect-[4/3] rounded-[1.5rem] [mask-image:radial-gradient(white,black)]"
          strength={6}
        />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="eyebrow text-[0.6rem] text-forest">{d.country}</p>
        <h3 className="mt-3 text-[clamp(2rem,3.2vw,2.75rem)] leading-tight">{d.heading}</h3>
        <div className="mt-5 space-y-4">
          {d.intro.map((p) => (
            <p key={p} className={prose}>
              <LinkedText text={p} seen={seen} />
            </p>
          ))}
        </div>
        {d.venues.map((v) => {
          seen.add(v.slug);
          return (
            <div key={v.slug} className="mt-8 border-t border-ink/10 pt-6">
              <h4 className="font-display text-2xl">
                <Link
                  to="/venues/$slug"
                  params={{ slug: v.slug }}
                  className="group inline-flex items-center gap-2 text-forest hover:text-ink"
                >
                  {v.name}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </h4>
              <div className="mt-3 space-y-3">
                {v.body.map((p) => (
                  <p key={p} className={prose}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
        {d.outro && <p className={cn(prose, "mt-6")}>{d.outro}</p>}
        {d.country === "France" && (
          <ButtonLink
            to="/venues/$slug"
            params={{ slug: "the-chateau" }}
            variant="outline"
            className="mt-6"
          >
            Register interest in The Château
          </ButtonLink>
        )}
      </Reveal>
    </article>
  );
}

function InlineLink({
  children,
  ...props
}: { children: string } & (
  | { to: "/host" | "/retreats" | "/discover-scotland" | "/guides" | "/how-we-help" }
  | { to: "/guides/$slug"; params: { slug: string } }
)) {
  return (
    <Link {...props} className="link-draw inline-flex items-center gap-2 pb-1 text-forest">
      {children} <ArrowRight className="size-3.5" />
    </Link>
  );
}

function FilterButton({
  group,
  active,
  onClick,
  children,
}: {
  group: string;
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative px-4 py-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-200",
        active ? "text-ivory" : "text-ink/65 hover:text-ink",
      )}
    >
      {active && (
        <motion.span
          layoutId={`filter-${group}`}
          className="absolute inset-0 rounded-full bg-forest"
          transition={{ duration: 0.45, ease: EASE }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
