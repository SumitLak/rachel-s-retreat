import { useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock, MapPin, UserRound } from "lucide-react";
import { Reveal, SplitLines } from "@/components/motion";
import { FaqItem, SectionHeading } from "@/components/ui-luxe";
import {
  EmailRetreatButton,
  GuestEnquiryForm,
  isUpcoming,
  SaveButton,
} from "@/components/retreat-components";
import { getRetreat, getVenue, retreatNights, SITE_URL } from "@/data/site";
import { guestFaqs } from "@/data/retreats-seo";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/retreats/$slug")({
  loader: ({ params }) => {
    const retreat = getRetreat(params.slug);
    if (!retreat) throw notFound();
    return { retreat };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.retreat;
    if (!r) return { meta: [] };
    const url = `${SITE_URL}/retreats/${r.slug}`;
    const venue = getVenue(r.venueSlug);
    const title = `${r.title} · ${r.dates} | Rachel’s Retreats`;
    // Event structured data, using verified fields only (no price or availability).
    const event = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: r.title,
      description: r.body,
      startDate: r.startDate,
      endDate: r.endDate,
      eventStatus:
        r.status === "cancelled"
          ? "https://schema.org/EventCancelled"
          : "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      image: [`${SITE_URL}${r.image}`],
      url,
      location: {
        "@type": "Place",
        name: venue?.name ?? r.venue,
        address: {
          "@type": "PostalAddress",
          addressLocality: venue?.location ?? r.venue,
          addressCountry: "GB",
        },
      },
      organizer: { "@type": "Organization", name: r.organiser.name },
    };
    return {
      meta: [
        { title },
        { name: "description", content: `${r.body} ${r.dates} at ${r.venue}.` },
        { property: "og:title", content: title },
        { property: "og:description", content: r.body },
        { property: "og:image", content: `${SITE_URL}${r.image}` },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(event) }],
    };
  },
  component: RetreatPage,
});

const toConfirm = [
  "The full programme and daily itinerary",
  "Who the retreat suits, and any experience level or entry requirements",
  "Room choices, prices and what each option includes",
  "Inclusions and exclusions, such as meals, activities and transfers",
  "Booking terms, payment schedule and cancellation policy",
];

function RetreatPage() {
  const { retreat: r } = Route.useLoaderData();
  const venue = getVenue(r.venueSlug);
  const nights = retreatNights(r);
  const open = isUpcoming(r) && r.status === "published";
  const faqs = guestFaqs.items.filter((f) =>
    [
      "How do I book a place on a retreat?",
      "What is normally included in the retreat price?",
      "Can I join a retreat on my own?",
    ].includes(f.q),
  );

  useEffect(() => {
    track("retreat_viewed", { retreat: r.slug });
  }, [r.slug]);

  return (
    <>
      {/* Hero: 60/40 split */}
      <section className="pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="container-luxe grid items-center gap-10 lg:grid-cols-[55fr_45fr] lg:gap-14">
          <div>
            <Link
              to="/retreats"
              className="eyebrow inline-flex items-center gap-2 text-[0.6rem] text-forest hover:text-ink"
            >
              <ArrowLeft className="size-4" /> All retreats
            </Link>
            <p className="eyebrow mt-6 text-[0.6rem] text-muted-foreground">
              {r.type} · {r.destination}
            </p>
            <SplitLines
              as="h1"
              animateOnMount
              lines={[r.title]}
              className="mt-3 text-[clamp(2.5rem,5vw,4.75rem)]"
            />
            <p
              className="animate-fade-up mt-5 max-w-xl text-lg leading-relaxed text-ink/80"
              style={{ animationDelay: "300ms" }}
            >
              {r.body}
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "450ms" }}
            >
              {open ? (
                <a
                  href="#enquire"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm text-ivory transition-colors hover:bg-ink"
                >
                  Enquire about this retreat <ArrowRight className="size-4" />
                </a>
              ) : (
                <span className="rounded-full bg-stone px-6 py-3 text-sm">
                  This retreat has ended
                </span>
              )}
              <SaveButton slug={r.slug} title={r.title} variant="text" />
              <EmailRetreatButton retreat={r} />
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-stone lg:aspect-[4/5]">
            <img
              src={r.image}
              alt={r.imageAlt}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* At a glance */}
      <section className="bg-stone py-10">
        <dl className="container-luxe grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarDays, k: "Dates", v: r.dates },
            { icon: Clock, k: "Duration", v: `${nights} nights` },
            { icon: MapPin, k: "Venue", v: r.venue },
            { icon: UserRound, k: "Led by", v: r.organiser.name },
          ].map((x) => (
            <div key={x.k} className="flex gap-4">
              <x.icon className="mt-1 size-5 shrink-0 text-brass" />
              <div>
                <dt className="eyebrow text-[0.56rem] text-muted-foreground">{x.k}</dt>
                <dd className="mt-1">{x.v}</dd>
              </div>
            </div>
          ))}
        </dl>
        <p className="container-luxe mt-6 text-sm text-ink/70">
          {r.price ? `From ${r.price}.` : "Pricing is provided by the organiser on enquiry."} Places
          are confirmed by the organiser; an enquiry does not reserve a place.
        </p>
      </section>

      {/* Overview + what to confirm */}
      <section className="py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="The programme" lines={["About this retreat"]} />
            <Reveal className="mt-6 space-y-4">
              <p className="leading-relaxed text-ink/80">{r.body}</p>
              <p className="leading-relaxed text-ink/80">
                This programme is led by {r.organiser.name} and takes place at {r.venue}. The
                organiser publishes the full programme and confirms the details with each guest.
              </p>
            </Reveal>
          </div>
          <Reveal className="rounded-[1.5rem] bg-card p-7 shadow-[0_0_0_1px_var(--color-border)] md:p-9">
            <h2 className="text-3xl">What to confirm with the organiser</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              These details aren’t published here yet. Ask about them when you enquire.
            </p>
            <ul className="mt-5 space-y-3">
              {toConfirm.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-forest" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Organiser */}
      <section className="border-t border-border py-14 md:py-16">
        <div className="container-luxe flex flex-col gap-6 md:flex-row md:items-center">
          <span
            aria-hidden
            className="grid size-20 shrink-0 place-items-center rounded-full bg-forest font-display text-3xl text-ivory"
          >
            {r.organiser.name
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </span>
          <div>
            <p className="eyebrow text-[0.6rem] text-forest">Your organiser</p>
            <h2 className="mt-2 text-4xl">{r.organiser.name}</h2>
            <p className="mt-1 text-muted-foreground">
              {r.organiser.role}. Biography to follow once approved.
            </p>
          </div>
        </div>
      </section>

      {/* Venue */}
      {venue && (
        <section className="bg-forest py-14 text-ivory md:py-20">
          <div className="container-luxe grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
              <img
                src={venue.image}
                alt={venue.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="eyebrow text-[0.6rem] text-brass">Where you’ll stay</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{venue.name}</h2>
              <p className="mt-2 font-display text-xl italic text-ivory/80">{venue.location}</p>
              <p className="mt-5 leading-relaxed text-ivory/80">{venue.intro}</p>
              <ul className="mt-5 space-y-2 text-ivory/85">
                {venue.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-brass" /> {h}
                  </li>
                ))}
              </ul>
              <Link
                to="/venues/$slug"
                params={{ slug: venue.slug }}
                className="link-draw mt-6 inline-flex items-center gap-2 pb-1 text-sm text-brass"
              >
                Explore {venue.name} <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading eyebrow="Good to know" lines={["Questions before you enquire"]} />
          <div className="border-t border-border">
            {faqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} defaultOpen={i === 0}>
                {f.a}
              </FaqItem>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="scroll-mt-24 bg-stone py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow={open ? "Enquire" : "Missed this retreat?"}
            lines={[open ? "Ask about this retreat" : "Ask about future dates"]}
            intro="Your enquiry comes to Rachel’s Retreats first. We confirm the details with the organiser, who confirms your place and collects payment."
          />
          <div className="rounded-[1.5rem] bg-card p-7 shadow-[0_0_0_1px_var(--color-border)] md:p-10">
            <GuestEnquiryForm defaultRetreat={open ? r.slug : ""} />
          </div>
        </div>
      </section>
    </>
  );
}
