import { createFileRoute } from "@tanstack/react-router";
import { RetreatPlanner, type PlannerPrefill } from "@/components/planner/RetreatPlanner";

export const Route = createFileRoute("/plan")({
  validateSearch: (s: Record<string, unknown>): PlannerPrefill => {
    const guests = Number(s["guests"]);
    return {
      type: typeof s["type"] === "string" ? s["type"] : undefined,
      venue: typeof s["venue"] === "string" ? s["venue"] : undefined,
      destination: typeof s["destination"] === "string" ? s["destination"] : undefined,
      guests: Number.isFinite(guests) && guests > 0 ? guests : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Design your perfect retreat — Rachel's Retreats" },
      {
        name: "description",
        content:
          "Plan your retreat in six short steps: experience, guests, destination, dates and extras. See venues that could suit and send a personalised brief.",
      },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const search = Route.useSearch();
  return <RetreatPlanner key={JSON.stringify(search)} prefill={search} />;
}
