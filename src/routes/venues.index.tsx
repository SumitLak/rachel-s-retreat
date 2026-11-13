import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, HeartHandshake, KeyRound, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccentLine, EASE, getLenis, Reveal, RevealImage } from "@/components/motion";
import {
  ButtonLink,
  ClosingCTA,
  FaqItem,
  LinkedParagraphs,
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
      >
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Jump to a destination">
          {c.destinations.map((d) => (
            <li key={d.country}>
              <a
                href={`#${destinationId(d.country)}`}
                className="block rounded-full px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ivory ring-1 ring-ivory/40 transition-colors hover:bg-ivory hover:text-ink"
              >
                {d.country}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

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

      {/* 03 · Introduction: 45/55 editorial split */}
      <section className="border-t border-border py-14 md:py-20">
        <div className="container-luxe grid items-center gap-10 lg:grid-cols-[45fr_55fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Choosing your setting" lines={[c.findVenue.heading]} />
            <Reveal delay={0.1} className="mt-8 space-y-4 text-[1.05rem]">
              {c.findVenue.body.map((p) => (
                <p key={p} className={prose}>
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <RevealImage
            src="/images/studio.webp"
            alt="The studio at Rachel’s Farm Buchlyvie, set up for a group session"
            className="aspect-[4/5] lg:aspect-[5/6]"
          />
        </div>
      </section>

      {/* 04 · Destination stories, with sticky destination navigation */}
      <section className="bg-stone py-14 md:py-20" aria-labelledby="destinations-heading">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="Explore the collection by destination"
            lines={[
              <span key="h" id="destinations-heading">
                {c.destinationsHeading}
              </span>,
            ]}
            intro="Five destinations, seven settings. Choose a country to jump to its story."
          />
        </div>
        <DestinationNav />
        <div className="container-luxe mt-10 space-y-16 md:space-y-24">
          {c.destinations.map((d, i) => (
            <Destination key={d.country} d={d} index={i} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* 05 · Retreat experiences: image-led cards (swipeable on mobile) */}
      <section className="py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="Every retreat has its own story"
            lines={[c.types.heading]}
            intro={c.types.intro[0]}
          />
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mx-auto md:grid md:max-w-[104rem] md:snap-none md:grid-cols-3 md:gap-8 md:overflow-visible md:px-10 md:pb-0 xl:px-12">
          {c.types.items.map((t, i) => (
            <motion.article
              key={t.heading}
              className="group w-[85vw] shrink-0 snap-start sm:w-[60vw] md:w-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] [mask-image:radial-gradient(white,black)]">
                <img
                  src={t.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <h3 className="absolute inset-x-0 bottom-0 p-6 font-display text-3xl leading-tight text-ivory">
                  {t.heading}
                </h3>
              </div>
              <div className="mt-5 space-y-3 px-1 text-[0.95rem]">
                {t.body.map((p) => (
                  <p key={p} className={prose}>
                    {p}
                  </p>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
        <div className="container-luxe mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <InlineLink to="/host">How hosting works</InlineLink>
          <InlineLink to="/retreats">Find a retreat to join</InlineLink>
          <InlineLink to="/discover-scotland">Discover Scotland</InlineLink>
        </div>
      </section>

      {/* 06 · Why Rachel's Retreats: three benefit panels */}
      <section className="grain relative overflow-hidden bg-forest py-14 text-ivory md:py-20">
        <div className="container-luxe">
          <SectionHeading
            light
            split
            eyebrow="More than a beautiful location"
            lines={[c.why.heading]}
            intro="Private venues, hosting support and the flexibility to fit your group."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {c.why.items.map((w, i) => {
              const Icon = benefitIcons[i] ?? KeyRound;
              return (
                <motion.article
                  key={w.heading}
                  className="h-full rounded-[1.5rem] bg-ivory/[0.06] p-8 ring-1 ring-ivory/15 transition-colors duration-300 hover:bg-ivory/[0.1] md:p-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
                >
                  <span className="grid size-12 place-items-center rounded-full bg-brass/20 text-brass">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-6 text-3xl leading-tight">{w.heading}</h3>
                  <div className="mt-4 space-y-3 text-[0.95rem] text-ivory/75">
                    {w.body.map((p) => (
                      <p key={p} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
          <div className="mt-8">
            <Link
              to="/how-we-help"
              className="link-draw inline-flex items-center gap-2 pb-1 text-sm text-brass"
            >
              See how our team supports your retreat <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How to choose: three-step visual guide */}
      <section className="py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="Before you decide"
            lines={[c.choose.heading]}
            intro={c.choose.body[0]}
          />
          <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            <motion.span
              aria-hidden
              className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-brass/60 md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 1.4, ease: EASE }}
            />
            {chooseSteps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="relative z-10 grid size-12 place-items-center rounded-full bg-ivory font-display text-xl text-forest ring-1 ring-brass">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-3xl leading-tight">{s.title}</h3>
                <div className="mt-3 space-y-3">
                  {s.paras.map((p) => (
                    <p key={p} className={prose}>
                      {p}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-col gap-5 rounded-[1.5rem] bg-stone p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <p className="font-display text-2xl leading-snug">{c.choose.body[5]}</p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <InlineLink to="/guides/$slug" params={{ slug: "choosing-a-venue" }}>
                Guide: choose a venue
              </InlineLink>
              <InlineLink to="/guides/$slug" params={{ slug: "minimum-stays-and-group-sizes" }}>
                Minimum stays by venue
              </InlineLink>
            </div>
          </div>
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

const destinationId = (country: string) => `destination-${country.toLowerCase()}`;

const benefitIcons = [KeyRound, HeartHandshake, MapPinned];

// Steps group the approved "How to choose" paragraphs; titles are layout labels.
const chooseSteps = [
  { title: "Your group and rooming", paras: [c.choose.body[1] ?? ""] },
  {
    title: "Your programme and destination",
    paras: [c.choose.body[2] ?? "", c.choose.body[3] ?? ""],
  },
  { title: "Dates, budget and length of stay", paras: [c.choose.body[4] ?? ""] },
];

/** Sticky on desktop; scrolls smoothly to each destination story. */
function DestinationNav() {
  const [active, setActive] = useState<string>(c.destinations[0]?.country ?? "");
  useEffect(() => {
    const els = c.destinations
      .map((d) => document.getElementById(destinationId(d.country)))
      .filter((e): e is HTMLElement => e !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActive(e.target.getAttribute("data-country") ?? "");
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const go = (country: string) => {
    const el = document.getElementById(destinationId(country));
    if (!el) return;
    setActive(country);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -170 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Destinations"
      className="sticky top-20 z-30 mt-8 border-y border-ink/10 bg-stone/90 backdrop-blur-md md:top-24"
    >
      <ul className="container-luxe flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
        {c.destinations.map((d) => (
          <li key={d.country}>
            <a
              href={`#${destinationId(d.country)}`}
              onClick={(e) => {
                e.preventDefault();
                go(d.country);
              }}
              aria-current={active === d.country ? "location" : undefined}
              className={cn(
                "relative block whitespace-nowrap rounded-full px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                active === d.country ? "text-ivory" : "text-ink/65 hover:text-ink",
              )}
            >
              {active === d.country && (
                <motion.span
                  layoutId="dest-nav"
                  className="absolute inset-0 rounded-full bg-forest"
                  transition={{ duration: 0.4, ease: EASE }}
                />
              )}
              <span className="relative">{d.country}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Destination({ d, index, flip }: { d: Dest; index: number; flip: boolean }) {
  return (
    <article
      id={destinationId(d.country)}
      data-country={d.country}
      className="grid scroll-mt-44 items-start gap-8 lg:grid-cols-[45fr_55fr] lg:gap-16"
    >
      <div className={cn("lg:sticky lg:top-44", flip ? "lg:order-1" : "lg:order-2")}>
        <RevealImage src={d.image} alt={d.imageAlt} className="aspect-[4/3] lg:aspect-[5/4]" />
      </div>
      <div className={flip ? "lg:order-2" : "lg:order-1"}>
        <p className="eyebrow text-[0.6rem] text-forest">
          {String(index + 1).padStart(2, "0")} / {d.country}
        </p>
        <AccentLine className="mt-4" />
        <Reveal y={20}>
          <h3 className="mt-4 text-[clamp(2rem,3.2vw,2.75rem)] leading-tight">{d.heading}</h3>
        </Reveal>
        <div className="mt-5 space-y-4">
          <LinkedParagraphs
            paragraphs={d.intro}
            exclude={d.venues.map((v) => v.slug)}
            className={prose}
          />
        </div>
        {d.venues.map((v) => {
          return (
            <div key={v.slug} className="mt-8 border-t border-ink/10 pt-6">
              <h4 className="font-display text-2xl">
                <Link
                  to="/venues/$slug"
                  params={{ slug: v.slug }}
                  className="group inline-flex items-center gap-2 text-forest hover:text-ink"
                >
                  {v.name}
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
      </div>
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
