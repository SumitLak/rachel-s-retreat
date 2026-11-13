import { createFileRoute } from "@tanstack/react-router";
import { Planner } from "@/components/planner";
import { PageHero } from "@/components/ui-luxe";

type PlanSearch = { type?: string | undefined; venue?: string | undefined };

export const Route = createFileRoute("/plan")({
  validateSearch: (s: Record<string, unknown>): PlanSearch => ({
    type: typeof s["type"] === "string" ? s["type"] : undefined,
    venue: typeof s["venue"] === "string" ? s["venue"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Plan your retreat — Rachel's Retreats" },
      {
        name: "description",
        content: "Build your retreat brief in three short steps. Rough dates and early ideas are welcome.",
      },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const { type, venue } = Route.useSearch();
  return (
    <>
      <PageHero
        eyebrow="A useful first conversation starts here"
        lines={["Tell us what", <em key="m">you have in mind.</em>]}
        intro="Three short steps. Rough dates and early ideas are welcome — our Retreat Partnership Team will help with the rest."
        image="/images/glenalmond.webp"
        alt="Glenalmond Retreats, Perthshire"
      />
      <section className="bg-stone py-20 md:py-28">
        <div className="container-luxe">
          <Planner key={`${type}-${venue}`} initialType={type} initialVenue={venue} />
        </div>
      </section>
    </>
  );
}
