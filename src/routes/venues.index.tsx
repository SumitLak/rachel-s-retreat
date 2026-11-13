import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE, Reveal } from "@/components/motion";
import { ButtonLink, ClosingCTA, PageHero } from "@/components/ui-luxe";
import { VenueCard } from "@/components/sections";
import { countries, venues, type Country } from "@/data/site";

export const Route = createFileRoute("/venues/")({
  head: () => ({
    meta: [
      { title: "The collection — Rachel's Retreats venues" },
      {
        name: "description",
        content:
          "Seven private retreat venues across Scotland, England, Ireland, Italy and France. Filter by destination and group size.",
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
      <PageHero
        eyebrow="The collection"
        lines={["A place for", <em key="p">your people.</em>]}
        intro="Explore private settings across the UK and Europe. Choose a destination and group size, or let the team help you find the right fit."
        image="/images/manor-house.webp"
        alt="The Manor House, County Monaghan"
      />

      <section className="py-20 md:py-28">
        <div className="container-luxe">
          <Reveal className="flex flex-col gap-6 border-y border-border py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-3 text-[0.6rem] text-muted-foreground">Destination</span>
              {(["All", ...countries] as const).map((c) => (
                <FilterButton key={c} group="country" active={country === c} onClick={() => setCountry(c)}>
                  {c === "All" ? "All" : c}
                </FilterButton>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-3 text-[0.6rem] text-muted-foreground">Group</span>
              {sizes.map((s) => (
                <FilterButton key={s.label} group="size" active={size === s.max} onClick={() => setSize(s.max)}>
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
            <div className="mt-6 bg-stone p-10 text-center">
              <h3 className="text-4xl">Let's find the right fit.</h3>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                No venues in this selection match that group size. Try another destination or ask our
                team for advice.
              </p>
              <ButtonLink to="/plan" className="mt-8">
                Ask us about your group
              </ButtonLink>
            </div>
          )}

          <p className="mt-16 max-w-2xl text-sm text-muted-foreground">
            Group sizes depend on rooming, the properties reserved and your programme. Our team will
            confirm the right arrangement and availability.
          </p>
        </div>
      </section>

      <ClosingCTA
        eyebrow="Not sure which place?"
        lines={["Let us help you", <em key="c" className="text-brass">choose.</em>]}
        body="Start with your group, your dates and what matters to you. We'll help you explore the options."
        image="/images/glenalmond.webp"
      />
    </>
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
        <motion.span layoutId={`filter-${group}`} className="absolute inset-0 bg-forest" transition={{ duration: 0.45, ease: EASE }} />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
