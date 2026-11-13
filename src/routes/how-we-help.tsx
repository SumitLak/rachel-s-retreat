import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealImage, SplitLines } from "@/components/motion";
import { ButtonLink, ClosingCTA, FaqItem, LinkedText, SectionHeading } from "@/components/ui-luxe";
import {
  HospitalityExplorer,
  InclusionPanels,
  ServiceExplorer,
  TeamCards,
} from "@/components/help-sections";
import { SITE_URL } from "@/data/site";
import {
  culinary,
  designedAround,
  helpClosing,
  helpFaqs,
  helpHero,
  helpMeta,
  services,
  team,
  thought,
} from "@/data/help-content";

const pageUrl = `${SITE_URL}/how-we-help`;
const prose = "leading-relaxed text-ink/80";

export const Route = createFileRoute("/how-we-help")({
  head: () => ({
    meta: [
      { title: helpMeta.title },
      { name: "description", content: helpMeta.description },
      { property: "og:title", content: helpMeta.title },
      { property: "og:description", content: helpMeta.description },
      { property: "og:url", content: pageUrl },
    ],
    links: [{ rel: "canonical", href: pageUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: helpFaqs.items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: HowWeHelp,
});

function HowWeHelp() {
  return (
    <>
      {/* 01 · Editorial hero, people first */}
      <section className="pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="container-luxe grid items-center gap-10 lg:grid-cols-[55fr_45fr] lg:gap-14">
          <div>
            <p className="animate-fade-up eyebrow flex items-center gap-4 text-forest">
              <span className="h-px w-10 bg-current" aria-hidden /> Our hospitality
            </p>
            <h1
              className="animate-fade-up mt-6 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-ink/70"
              style={{ animationDelay: "100ms" }}
            >
              {helpHero.h1}
            </h1>
            <SplitLines
              as="p"
              animateOnMount
              delay={0.15}
              lines={["The art of hosting,", <em key="b">beautifully done.</em>]}
              className="mt-4 font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]"
            />
            <div
              className="animate-fade-up mt-7 max-w-2xl space-y-3 text-lg leading-relaxed text-ink/80"
              style={{ animationDelay: "400ms" }}
            >
              {helpHero.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "550ms" }}
            >
              <ButtonLink to="/plan">Design your retreat</ButtonLink>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-2 py-4 text-sm text-forest link-draw"
              >
                Explore our services
              </a>
            </div>
          </div>
          {/* Reveal is CSS-driven so the image shows before hydration; disabled for reduced motion. */}
          <div className="animate-image-reveal relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-stone">
            <img
              src="/images/hospitality-table-setting.webp"
              alt="A member of the Rachel’s Retreats team arranging heather and candles on a dining table before guests arrive"
              width={425}
              height={637}
              fetchPriority="high"
              decoding="async"
              className="animate-image-settle absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="animate-fade-up absolute inset-x-4 bottom-4 rounded-[1.25rem] bg-ivory/90 p-4 backdrop-blur"
              style={{ animationDelay: "500ms" }}
            >
              <p className="eyebrow text-[0.56rem] text-forest">The people behind the experience</p>
              <p className="mt-1 font-display text-xl">Every detail, thoughtfully considered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 · Signature: the details behind a beautiful retreat */}
      <section className="bg-stone py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="The details behind a beautiful retreat"
            lines={[thought.heading]}
            intro={thought.body[0]}
          />
          <div className="mt-10">
            <HospitalityExplorer />
          </div>
          <Reveal className="mt-12 grid gap-4 border-t border-ink/10 pt-8 text-ink/80 md:grid-cols-2 md:gap-10">
            {thought.body.slice(1).map((p) => (
              <p key={p} className="leading-relaxed">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 03 · Culinary storytelling */}
      <section className="py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="Private dining & catering"
            lines={[culinary.heading]}
            intro={culinary.body[0]}
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
            {/* Asymmetrical gallery; swipeable on small screens */}
            <div className="flex snap-x gap-5 overflow-x-auto pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-[1.4fr_1fr] lg:overflow-visible">
              {culinary.gallery.map((g, i) => (
                <figure
                  key={g.image}
                  className={
                    i === 0
                      ? "w-[80vw] shrink-0 snap-start lg:w-auto"
                      : "w-[70vw] shrink-0 snap-start lg:mt-16 lg:w-auto"
                  }
                >
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-[1.5rem]">
                    <img
                      src={g.image}
                      alt={g.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[300ms] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <figcaption className="mt-3 px-1">
                    <span className="block font-display text-2xl">{g.caption}</span>
                    <span className="text-sm text-muted-foreground">{g.sub}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div>
              <h3 className="text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight">
                {culinary.subheading}
              </h3>
              <Reveal className="mt-4 space-y-3">
                {culinary.body.slice(1).map((p) => (
                  <p key={p} className={prose}>
                    {p}
                  </p>
                ))}
              </Reveal>
              <div className="mt-8 rounded-[1.5rem] bg-forest p-7 text-ivory">
                <p className="eyebrow text-[0.56rem] text-brass">Dietary considerations</p>
                <h3 className="mt-2 text-3xl">{culinary.dietary.heading}</h3>
                <div className="mt-3 space-y-2.5 text-[0.95rem] text-ivory/80">
                  {culinary.dietary.body.map((p) => (
                    <p key={p} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 · Meet the team */}
      <section className="bg-stone py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow={team.subheading}
            lines={[team.heading]}
            intro={team.intro}
          />
          <div className="mt-10">
            <TeamCards />
          </div>
          <p className={`${prose} mt-8 max-w-3xl`}>{team.outro}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Team portraits will replace these photographs once approved.
          </p>
        </div>
      </section>

      {/* 05 · Service explorer */}
      <section id="services" className="scroll-mt-24 py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="Personalised support"
            lines={[services.heading]}
            intro={services.intro}
          />
          <div className="mt-10">
            <ServiceExplorer />
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-stone py-14 md:py-20">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="What’s included?"
            lines={["Clear arrangements,", <em key="c">agreed in advance.</em>]}
            intro="Services vary by venue and booking package. Here is how each part of a retreat is arranged."
          />
          <div className="mt-10">
            <InclusionPanels />
          </div>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <GuideLink slug="venue-hire-or-hosted-retreat">
              Venue hire or a hosted retreat
            </GuideLink>
            <GuideLink slug="food-and-transfers">Food and transfers for your retreat</GuideLink>
            <GuideLink slug="retreat-hosts-and-support">Who looks after your group</GuideLink>
          </div>
        </div>
      </section>

      {/* 06 · Hospitality in action */}
      <section className="py-14 md:py-20">
        <div className="container-luxe grid items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Hospitality in action" lines={[designedAround.heading]} />
            <Reveal className="mt-6 space-y-3">
              {designedAround.body.map((p) => (
                <p key={p} className={prose}>
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {designedAround.gallery.map((g, i) => (
              <figure key={g.image} className={i === 0 ? "col-span-2" : ""}>
                <RevealImage
                  src={g.image}
                  alt={g.alt}
                  className={i === 0 ? "aspect-[16/9]" : "aspect-[4/5]"}
                />
                <figcaption className="mt-2 text-sm text-muted-foreground">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 07 · FAQs: image + intro left, accordions right */}
      <section className="border-t border-border py-14 md:py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Hospitality questions" lines={[helpFaqs.heading]} />
            <RevealImage
              src="/images/food-gnocchi.webp"
              alt="Food prepared for a retreat group"
              className="mt-8 hidden aspect-[4/3] lg:block"
            />
            <Link
              to="/guides"
              className="link-draw mt-6 inline-flex items-center gap-2 pb-1 text-sm text-forest"
            >
              All guides & FAQs <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="border-t border-border">
            {helpFaqs.items.map((f, i) => (
              <FaqItem key={f.q} q={f.q} defaultOpen={i === 0}>
                <LinkedText text={f.a} />
              </FaqItem>
            ))}
          </div>
        </div>
      </section>

      {/* 08 · Conversion */}
      <ClosingCTA
        eyebrow="Let’s make it happen"
        lines={[helpClosing.heading]}
        body={
          <>
            {helpClosing.body.map((p) => (
              <p key={p} className="mt-3 first:mt-0">
                {p}
              </p>
            ))}
          </>
        }
        ctaLabel={helpClosing.cta}
        image="/images/food-fish.webp"
      />
    </>
  );
}

function GuideLink({ slug, children }: { slug: string; children: string }) {
  return (
    <Link
      to="/guides/$slug"
      params={{ slug }}
      className="link-draw inline-flex items-center gap-2 pb-1 text-forest"
    >
      {children} <ArrowRight className="size-3.5" />
    </Link>
  );
}
