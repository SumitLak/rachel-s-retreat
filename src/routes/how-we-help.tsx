import { createFileRoute } from "@tanstack/react-router";
import { ParallaxImage, Reveal } from "@/components/motion";
import { ClosingCTA, PageHero, SectionHeading } from "@/components/ui-luxe";
import { team } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/how-we-help")({
  head: () => ({
    meta: [
      { title: "Our hospitality — Rachel's Retreats" },
      {
        name: "description",
        content:
          "Retreat planners, event managers, dedicated hosts and private chefs: one team around your retreat.",
      },
    ],
  }),
  component: HowWeHelp,
});

const chapters = [
  {
    n: "01 · The place & the plan",
    title: "Start with what you have in mind.",
    body: [
      "You may know the venue already, or simply have a group and an idea. Our planning team helps with suitability, dates, rooming and the shape of the stay.",
      "We bring the practical decisions together, from menus and suppliers to the programme around your own sessions.",
    ],
    image: "/images/buchlyvie-lodges.webp",
  },
  {
    n: "02 · Food to gather around",
    title: "Meals become part of the memory.",
    body: [
      "Family-style suppers, a special dinner or a menu built around your programme. Our chefs work with the group's preferences and dietary requirements.",
      "Agree the catering style and inclusions with the team, then leave the preparation and hospitality in their hands.",
    ],
    image: "/images/food-fish.webp",
  },
  {
    n: "03 · Experiences with a little thought",
    title: "Make the days your own.",
    body: [
      "Bring your own teaching, facilitation or creative programme. We can help you add local experiences, movement, outdoor time and specialist sessions.",
      "The balance is yours: structured time together, time to explore, and enough room to simply enjoy being there.",
    ],
    image: "/images/art.webp",
  },
];

function HowWeHelp() {
  return (
    <>
      <PageHero
        eyebrow="The Rachel's Retreats team"
        lines={["Everything your", <em key="r">retreat needs.</em>]}
        intro="People who care about the detail. From the first conversation to the last breakfast, we help bring the retreat together so you can focus on your guests and programme."
        image="/images/food-gnocchi.webp"
        alt="A dish prepared by the Rachel's Retreats chefs"
      />

      <section className="space-y-16 py-16 md:space-y-24 md:py-24">
        {chapters.map((c, i) => (
          <div
            key={c.n}
            className="container-luxe grid items-center gap-12 lg:grid-cols-2 lg:gap-24"
          >
            <ParallaxImage
              src={c.image}
              alt=""
              className={cn("aspect-[4/5] max-h-[85vh]", i % 2 === 1 && "lg:order-2")}
              strength={12}
            />
            <SectionHeading
              eyebrow={c.n}
              lines={[c.title]}
              intro={c.body.map((p) => (
                <p key={p} className="mt-4 first:mt-0">
                  {p}
                </p>
              ))}
            />
          </div>
        ))}
      </section>

      <section className="grain relative overflow-hidden bg-forest py-16 text-ivory md:py-24">
        <div className="container-luxe">
          <SectionHeading
            split
            light
            eyebrow="The people behind the welcome"
            lines={[
              "One team around",
              <em key="y" className="text-brass">
                your retreat.
              </em>,
            ]}
            intro="Rachel's approach puts guest experience at the heart of the stay. The team brings that care into the planning, the food and the everyday details."
          />
          <div className="mt-12 grid gap-px bg-ivory/15 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.1} className="bg-forest">
                <div className="h-full p-8 transition-colors duration-500 hover:bg-ink/40 md:p-10">
                  <p className="font-display text-5xl italic text-brass">{t.n}</p>
                  <h3 className="mt-8 text-3xl">{t.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/70">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA image="/images/manor-house.webp" />
    </>
  );
}
