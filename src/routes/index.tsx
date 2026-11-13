import { createFileRoute } from "@tanstack/react-router";
import { Counter, ParallaxImage, Reveal, SplitLines } from "@/components/motion";
import { ButtonLink, ClosingCTA, SectionHeading } from "@/components/ui-luxe";
import {
  ExperienceSelector,
  HeroSlider,
  DestinationStrip,
  RetreatCard,
  ScrollStory,
  VenueCarousel,
} from "@/components/sections";
import { hostSteps, retreats, venues } from "@/data/site";
import { PlannerTeaser } from "@/components/planner/PlannerTeaser";

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
  {
    title: "Private settings",
    body: "Estates, villas and country houses reserved for your group.",
  },
  {
    title: "Chefs & hosts",
    body: "Menus planned around your guests, and hosts who keep days running smoothly.",
  },
  {
    title: "Thoughtful experiences",
    body: "Local excursions, movement and specialist sessions around your programme.",
  },
  {
    title: "One team around you",
    body: "Planners, event managers, hosts and chefs working alongside you.",
  },
];

function Home() {
  return (
    <>
      <HeroSlider />
      <DestinationStrip items={["Scotland", "England", "Ireland", "Italy", "France"]} />
      <section
        className="border-b border-border py-8 md:py-10"
        aria-label="The collection in numbers"
      >
        <div className="container-luxe grid grid-cols-2 gap-y-8 md:grid-cols-4">
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

      {/* Introduction */}
      <section className="py-16 md:py-24">
        <div className="container-luxe grid items-center gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="This is Rachel's Retreats"
              lines={[
                "A beautiful setting.",
                <em key="m" className="text-forest">
                  A whole lot more.
                </em>,
              ]}
              intro={
                <>
                  <p>
                    You bring the programme and market and sell your places. We coordinate the
                    agreed venue, catering, hosting, experiences and scheduled transfers around your
                    retreat.
                  </p>
                  <p className="mt-5">
                    For yoga teachers, artists, company organisers and communities, it's space to
                    focus on what you came to do. For guests, it's a chance to join a retreat that
                    feels right for you.
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
              className="col-span-3 aspect-[3/4] min-h-[22rem] lg:min-h-[34rem]"
              strength={8}
            />
            <ParallaxImage
              src="/images/food-gnocchi.webp"
              alt="A dish prepared by the Rachel's Retreats chefs"
              className="col-span-2 mt-16 aspect-[3/4] lg:mt-28"
              strength={14}
            />
          </div>
        </div>
      </section>

      {/* Collection carousel */}
      <section className="py-16 md:py-24">
        <VenueCarousel
          venues={venues}
          header={
            <SectionHeading
              split
              className="flex-1"
              eyebrow="Our collection"
              lines={["Find your kind", <em key="e">of elsewhere.</em>]}
              intro="From the Scottish countryside to the warmth of Tuscany, choose a setting that suits your people."
            />
          }
        />
      </section>

      {/* Pillars on dark */}
      <section className="grain relative overflow-hidden bg-forest py-16 text-ivory md:py-24">
        <div className="container-luxe">
          <SectionHeading
            split
            light
            eyebrow="For the people who bring people together"
            lines={[
              "You lead the retreat.",
              <em key="w" className="text-brass">
                We look after the rest.
              </em>,
            ]}
            intro="Menus planned around your guests. Rooms ready for their arrival. The right people, places and experiences brought together with care."
          />
          <div className="mt-12 grid gap-px bg-ivory/15 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="pt-12 md:pt-16">
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
        <div className="container-luxe pb-12 pt-4 md:pb-16">
          <Reveal>
            <ButtonLink to="/host">See the full hosting journey</ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* Experience selector */}
      <section className="bg-stone py-16 md:py-24">
        <ExperienceSelector
          header={
            <SectionHeading
              eyebrow="Space for your ideas"
              lines={["What will", <em key="b">you bring?</em>]}
              intro="A week of practice, a creative community, a team coming together. We shape the setting and hospitality around your programme."
            />
          }
        />
      </section>

      <PlannerTeaser />

      {/* Scotland parallax band */}
      <section className="grain relative flex min-h-[75vh] items-center overflow-hidden bg-ink text-ivory md:aspect-[1200/868] md:min-h-0">
        <ParallaxImage
          src="/images/kelpies.webp"
          alt="The Kelpies, Falkirk"
          className="absolute inset-0"
          strength={4}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent md:via-ink/15" />
        <div className="container-luxe relative z-10 py-20">
          <Reveal>
            <p className="eyebrow mb-6 text-ivory [text-shadow:0_1px_10px_rgb(0_0_0_/0.55)]">
              A place to come back to
            </p>
          </Reveal>
          <SplitLines
            lines={["See Scotland.", <em key="f">Feel at home.</em>]}
            className="text-6xl md:text-8xl"
          />
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
      <section className="py-16 md:py-24">
        <div className="container-luxe">
          <SectionHeading
            split
            eyebrow="Come along"
            lines={["Your next retreat", <em key="s">starts here.</em>]}
            intro={
              <>
                <p>
                  Join a programme led by people who love what they do. Enquire with our team for
                  details and help with the next step.
                </p>
                <ButtonLink to="/retreats" variant="outline" className="mt-6">
                  Find a retreat
                </ButtonLink>
              </>
            }
          />
          <div className="mt-10 grid gap-8">
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
