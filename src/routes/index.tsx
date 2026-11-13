import { createFileRoute } from "@tanstack/react-router";
import { Counter, ParallaxImage, Reveal, SplitLines } from "@/components/motion";
import { ButtonLink, ClosingCTA, SectionHeading } from "@/components/ui-luxe";
import {
  ExperienceSelector,
  HeroSlider,
  Marquee,
  RetreatCard,
  ScrollStory,
  VenueCarousel,
} from "@/components/sections";
import { hostSteps, retreats, venues } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rachel's Retreats — Host a retreat. Find your escape." },
      {
        name: "description",
        content:
          "Private retreat venues in Scotland, England, Ireland, Italy and France. Chefs, hosts and one team around the people you bring.",
      },
    ],
  }),
  component: Home,
});

const pillars = [
  { title: "Private settings", body: "Estates, villas and country houses reserved for your group." },
  { title: "Chefs & hosts", body: "Menus planned around your guests, and hosts who keep days running smoothly." },
  { title: "Thoughtful experiences", body: "Local excursions, movement and specialist sessions around your programme." },
  { title: "One team around you", body: "Planners, event managers, hosts and chefs working alongside you." },
];

function Home() {
  return (
    <>
      <HeroSlider />

      {/* Introduction */}
      <section className="py-28 md:py-40">
        <div className="container-luxe grid gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-24">
          <div>
            <SectionHeading
              eyebrow="This is Rachel's Retreats"
              lines={["A beautiful setting.", <em key="m" className="text-forest">A whole lot more.</em>]}
              intro={
                <>
                  <p>
                    You bring the programme and market and sell your places. We coordinate the agreed
                    venue, catering, hosting, experiences and scheduled transfers around your retreat.
                  </p>
                  <p className="mt-5">
                    For yoga teachers, artists, company organisers and communities, it's space to focus
                    on what you came to do. For guests, it's a chance to join a retreat that feels right
                    for you.
                  </p>
                </>
              }
            />
            <Reveal delay={0.3} className="mt-10">
              <ButtonLink to="/how-we-help" variant="outline">
                Discover how we help
              </ButtonLink>
            </Reveal>
          </div>
          <div className="relative grid grid-cols-5 gap-4">
            <ParallaxImage
              src="/images/studio.webp"
              alt="The studio at Rachel's Farm Buchlyvie"
              className="col-span-3 aspect-[3/4] self-start"
              strength={8}
            />
            <ParallaxImage
              src="/images/food-gnocchi.webp"
              alt="A dish prepared by the Rachel's Retreats chefs"
              className="col-span-2 mt-24 aspect-[3/4]"
              strength={14}
            />
          </div>
        </div>

        <div className="container-luxe mt-24 grid grid-cols-2 gap-y-12 border-t border-border pt-14 md:grid-cols-4">
          {[
            { n: 7, s: "", label: "Venues in the collection" },
            { n: 5, s: "", label: "Countries" },
            { n: 400, s: "", label: "Acres at The Manor House" },
            { n: 1000, s: "", label: "Acres at Wild River Lodge" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <p className="font-display text-6xl text-forest md:text-7xl">
                <Counter to={stat.n} suffix={stat.s} />
              </p>
              <p className="eyebrow mt-3 text-[0.6rem] text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee items={["Scotland", "England", "Ireland", "Italy", "France"]} />

      {/* Collection carousel */}
      <section className="py-28 md:py-40">
        <VenueCarousel
          venues={venues}
          header={
            <SectionHeading
              eyebrow="Our collection"
              lines={["Find your kind", <em key="e">of elsewhere.</em>]}
              intro="From the Scottish countryside to the warmth of Tuscany, choose a setting that suits your people."
            />
          }
        />
      </section>

      {/* Pillars on dark */}
      <section className="grain relative overflow-hidden bg-forest py-28 text-ivory md:py-36">
        <div className="container-luxe">
          <SectionHeading
            light
            eyebrow="For the people who bring people together"
            lines={["You lead the retreat.", <em key="w" className="text-brass">We look after the rest.</em>]}
            intro="Menus planned around your guests. Rooms ready for their arrival. The right people, places and experiences brought together with care."
          />
          <div className="mt-20 grid gap-px bg-ivory/15 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1} className="bg-forest">
                <div className="group h-full p-8 transition-colors duration-500 hover:bg-ink/40 md:p-10">
                  <p className="font-display text-5xl italic text-brass">0{i + 1}</p>
                  <h3 className="mt-8 text-3xl">{p.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/70">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll story */}
      <section className="pt-28 md:pt-40">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="How hosting works"
            lines={["From your first idea", <em key="a">to arrival.</em>]}
            intro="You deliver the programme and sell the places. We coordinate the agreed accommodation, hospitality and practical arrangements."
          />
        </div>
        <div className="mt-10">
          <ScrollStory steps={hostSteps} />
        </div>
        <div className="container-luxe pb-28 md:pb-40">
          <Reveal>
            <ButtonLink to="/host">See the full hosting journey</ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* Experience selector */}
      <section className="bg-stone py-28 md:py-40">
        <div className="container-luxe mb-16">
          <SectionHeading
            eyebrow="Space for your ideas"
            lines={["What will", <em key="b">you bring?</em>]}
            intro="A week of practice, a creative community, a team coming together. We shape the setting and hospitality around your programme."
          />
        </div>
        <ExperienceSelector />
      </section>

      {/* Scotland parallax band */}
      <section className="grain relative flex min-h-[90vh] items-center overflow-hidden bg-ink text-ivory">
        <ParallaxImage src="/images/kelpies.webp" alt="The Kelpies, Falkirk" className="absolute inset-0" strength={16} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
        <div className="container-luxe relative z-10 py-28">
          <Reveal>
            <p className="eyebrow mb-6 text-brass">A place to come back to</p>
          </Reveal>
          <SplitLines lines={["See Scotland.", <em key="f">Feel at home.</em>]} className="text-6xl md:text-8xl" />
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ivory/80">
              Castles, lochs and a little adventure. Explore by day, then return to good food and a
              familiar welcome each evening.
            </p>
            <div className="mt-10">
              <ButtonLink to="/discover-scotland" variant="light">
                Discover Scotland
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Upcoming retreats */}
      <section className="py-28 md:py-40">
        <div className="container-luxe">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Come along"
              lines={["Your next retreat", <em key="s">starts here.</em>]}
              intro="Join a programme led by people who love what they do. Enquire with our team for details and help with the next step."
            />
            <Reveal>
              <ButtonLink to="/retreats" variant="outline">
                Find a retreat
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-8">
            {retreats.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.1}>
                <RetreatCard retreat={r} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA image="/images/villa-senesi.webp" />
    </>
  );
}
