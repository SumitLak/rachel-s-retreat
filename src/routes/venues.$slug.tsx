import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BedDouble, CalendarDays, Check, KeyRound, UtensilsCrossed } from "lucide-react";
import { ParallaxImage, Reveal, SplitLines } from "@/components/motion";
import { ButtonA, ButtonLink, ClosingCTA, SectionHeading } from "@/components/ui-luxe";
import { Gallery, VenueCarousel } from "@/components/sections";
import { contact, getVenue, venues } from "@/data/site";

export const Route = createFileRoute("/venues/$slug")({
  loader: ({ params }) => {
    const venue = getVenue(params.slug);
    if (!venue) throw notFound();
    return { venue };
  },
  head: ({ loaderData }) => {
    const v = loaderData?.venue;
    return {
      meta: v
        ? [
            { title: `${v.name}, ${v.location} — Rachel's Retreats` },
            { name: "description", content: v.intro },
            { property: "og:title", content: `${v.name} — Rachel's Retreats` },
            { property: "og:description", content: v.headline },
            { property: "og:image", content: v.image },
          ]
        : [],
    };
  },
  component: VenuePage,
});

function VenuePage() {
  const { venue } = Route.useLoaderData();
  const others = venues.filter((v) => v.slug !== venue.slug);
  const glance = [
    { icon: BedDouble, label: "Accommodation", value: venue.capacity },
    { icon: CalendarDays, label: "Minimum stay", value: venue.minimumStay },
    { icon: KeyRound, label: "Booking options", value: venue.bookingOptions },
    { icon: UtensilsCrossed, label: "Catering & hosts", value: venue.catering },
  ];

  return (
    <>
      {/* Hero */}
      <section className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-ink text-ivory">
        <ParallaxImage
          src={venue.image}
          alt={venue.name}
          className="absolute inset-0"
          strength={10}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
        <div className="container-luxe relative z-10 pb-20 pt-40 md:pb-28">
          <Reveal>
            <Link
              to="/venues"
              className="eyebrow mb-10 inline-flex items-center gap-3 text-[0.62rem] text-ivory/80 hover:text-ivory"
            >
              <ArrowLeft className="size-4" /> The collection
            </Link>
            <p className="eyebrow mb-6 flex items-center gap-4 text-ivory [text-shadow:0_1px_10px_rgb(0_0_0_/0.55)]">
              <span className="h-px w-10 bg-current" aria-hidden />
              {venue.country} · {venue.location}
            </p>
          </Reveal>
          <SplitLines
            as="h1"
            animateOnMount
            lines={[venue.name]}
            className="text-[clamp(2.75rem,min(9vw,12vh),8rem)]"
          />
          <Reveal delay={0.35}>
            <p className="mt-6 font-display text-2xl italic text-ivory/85 md:text-3xl">
              {venue.tagline}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/plan" search={{ venue: venue.slug }} variant="light">
                Ask about this venue
              </ButtonLink>
              <a
                href="#gallery"
                className="inline-flex items-center px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ivory ring-1 ring-ivory/50 transition-colors hover:bg-ivory hover:text-ink"
              >
                View gallery
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Intro + at a glance */}
      <section className="py-16 md:py-24">
        <div className="container-luxe grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <div>
            <SectionHeading
              eyebrow={venue.comingSoon ? "Coming to the collection" : "The setting"}
              lines={[venue.headline]}
              intro={venue.intro}
            />
            <ul className="mt-10 grid gap-px bg-border sm:grid-cols-2">
              {venue.highlights.map((h, i) => (
                <Reveal key={h} delay={i * 0.06} className="bg-ivory">
                  <li className="flex h-full gap-4 py-6 pr-6">
                    <Check className="mt-1 size-4 shrink-0 text-brass" />
                    <span className="leading-relaxed">{h}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal delay={0.15}>
            <aside
              className="bg-forest p-8 text-ivory md:p-10 lg:sticky lg:top-28"
              aria-label="Venue at a glance"
            >
              <p className="eyebrow text-brass">At a glance</p>
              <dl className="mt-8 divide-y divide-ivory/15">
                {glance.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-5 py-5">
                    <Icon className="mt-0.5 size-5 shrink-0 text-brass" />
                    <div>
                      <dt className="eyebrow text-[0.58rem] text-ivory/60">{label}</dt>
                      <dd className="mt-2 leading-relaxed">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-8 grid gap-3">
                <ButtonLink
                  to="/plan"
                  search={{ venue: venue.slug }}
                  variant="light"
                  className="w-full"
                >
                  Plan this venue
                </ButtonLink>
                <ButtonA
                  href={`mailto:${contact.email}?subject=${encodeURIComponent(`Room layout and photo library: ${venue.name}`)}`}
                  variant="outline-light"
                  className="w-full"
                >
                  Request room layouts
                </ButtonA>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-ivory/60">
                Ask us for the room-by-room layout, bathroom arrangements, studio details and the
                best arrival route for your group.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="scroll-mt-24 pb-16 md:pb-24">
        <div className="container-luxe">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Gallery"
              lines={["Imagine your", <em key="h">retreat here.</em>]}
            />
            <p className="max-w-sm text-sm text-muted-foreground">
              Swipe, use the arrows or open any image fullscreen. The full venue photo library is
              available from the team on request.
            </p>
          </div>
          <Reveal>
            <Gallery images={venue.gallery} venueName={venue.name} />
          </Reveal>
        </div>
      </section>

      {/* Hospitality band */}
      <section className="bg-stone py-14 md:py-20">
        <div className="container-luxe grid items-center gap-14 lg:grid-cols-2">
          <ParallaxImage
            src="/images/food-fish.webp"
            alt="A meal prepared by the Rachel's Retreats team"
            className="aspect-[4/5] max-h-[80vh]"
            strength={10}
          />
          <div>
            <SectionHeading
              eyebrow="The hospitality around your stay"
              lines={["Good food.", <em key="t">Thoughtful detail.</em>]}
              intro="Bring your programme. Let us help with the people and practicalities around it. Talk to us about catering, hosting, activities, rooming and transfers — your proposal will set out the arrangements, inclusions and costs for your retreat."
            />
            <Reveal delay={0.3} className="mt-10">
              <ButtonLink to="/how-we-help" variant="outline">
                See how we help
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Other venues */}
      <section className="py-16 md:py-24">
        <VenueCarousel
          venues={others}
          header={
            <SectionHeading
              eyebrow="Explore further"
              lines={["More of", <em key="c">the collection.</em>]}
            />
          }
        />
      </section>

      <ClosingCTA
        eyebrow="Let's make it happen"
        lines={[
          "Could this be",
          <em key="p" className="text-brass">
            your place?
          </em>,
        ]}
        image={venue.image}
      />
    </>
  );
}
