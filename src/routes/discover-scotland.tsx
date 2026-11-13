import { createFileRoute } from "@tanstack/react-router";
import { ParallaxImage, Reveal } from "@/components/motion";
import { ButtonLink, ClosingCTA, PageHero, SectionHeading } from "@/components/ui-luxe";
import { RetreatCard, VenueCarousel } from "@/components/sections";
import { retreats, venues } from "@/data/site";

export const Route = createFileRoute("/discover-scotland")({
  head: () => ({
    meta: [
      { title: "Discover Scotland — Rachel's Retreats" },
      {
        name: "description",
        content:
          "Make a Scottish retreat your base for days of history, landscapes and shared experiences.",
      },
    ],
  }),
  component: Scotland,
});

const stories = [
  {
    title: "Stories in the stone",
    body: "Castles, heritage and the history around Stirling and Edinburgh.",
    image: "/images/stirling-castle.webp",
  },
  {
    title: "A different kind of company",
    body: "Countryside, wildlife and time in the Scottish landscape.",
    image: "/images/highland-cattle.webp",
  },
  {
    title: "Days worth remembering",
    body: "Landmarks, local culture and experiences chosen around your group.",
    image: "/images/kelpies.webp",
  },
];

function Scotland() {
  return (
    <>
      <PageHero
        eyebrow="Discover Scotland"
        lines={[
          "A little adventure.",
          <em key="l">A lovely place</em>,
          <em key="r">to return to.</em>,
        ]}
        intro="Explore the country by day. Feel at home each evening."
        image="/images/kelpies.webp"
        alt="The Kelpies, Falkirk"
      />

      <section className="py-28 md:py-36">
        <div className="container-luxe grid gap-12 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="Stay a while. See a little more."
            lines={["One base.", <em key="s">So much to discover.</em>]}
          />
          <Reveal delay={0.2} className="self-end text-lg leading-relaxed text-muted-foreground">
            <p>
              Make a Scottish retreat your base for days of history, landscapes and shared
              experiences.
            </p>
            <p className="mt-5">
              Build a private group stay around the places you want to see, or explore an organised
              programme. We can help shape the excursions, transport and hospitality around your
              plans.
            </p>
            <ButtonLink to="/plan" search={{ type: "scotland" }} className="mt-10">
              Plan a private Scottish retreat
            </ButtonLink>
          </Reveal>
        </div>
        <div className="container-luxe mt-20 grid gap-8 md:grid-cols-3">
          {stories.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className={i === 1 ? "md:mt-20" : ""}>
              <ParallaxImage src={s.image} alt="" className="aspect-[3/4]" strength={10} />
              <h3 className="mt-6 text-3xl">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-stone py-28 md:py-36">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Join a Scottish experience"
            lines={["A programme", <em key="p">to step into.</em>]}
          />
          <div className="mt-14 grid gap-8">
            {retreats.slice(0, 1).map((r) => (
              <Reveal key={r.id}>
                <RetreatCard retreat={r} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 md:py-36">
        <VenueCarousel
          venues={venues.filter((v) => v.country === "Scotland")}
          header={
            <SectionHeading
              eyebrow="Scottish venues"
              lines={["Your base", <em key="b">in Scotland.</em>]}
            />
          }
        />
      </section>

      <ClosingCTA
        eyebrow="Your own group?"
        lines={[
          "Make the journey",
          <em key="y" className="text-brass">
            yours.
          </em>,
        ]}
        body="We can discuss a private stay built around your people and interests, from heritage and food to walking and creative practice."
        image="/images/buchlyvie.webp"
      />
    </>
  );
}
