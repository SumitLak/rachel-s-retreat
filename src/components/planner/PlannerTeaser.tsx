import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { countries } from "@/data/site";
import { Reveal } from "@/components/motion";
import { Pill, RollingNumber, ease } from "./controls";

const teaserTypes = [
  { id: "yoga", label: "Yoga & Wellness", image: "/images/studio.webp" },
  { id: "art", label: "Art & Creativity", image: "/images/art.webp" },
  { id: "business", label: "Business & Leadership", image: "/images/manor-house.webp" },
  { id: "scotland", label: "Discover Scotland", image: "/images/stirling-castle.webp" },
] as const;

/** Compact homepage entry point; choices carry into the full planner. */
export function PlannerTeaser() {
  const [type, setType] = useState<string>("yoga");
  const [guests, setGuests] = useState(18);
  const [destination, setDestination] = useState<string>("");
  const image = teaserTypes.find((t) => t.id === type)?.image ?? "/images/studio.webp";

  return (
    <section className="bg-ivory py-16 md:py-24">
      <div className="container-luxe grid overflow-hidden bg-card shadow-[0_0_0_1px_var(--color-border)] lg:grid-cols-[45fr_55fr]">
        <div className="p-8 md:p-12 xl:p-16">
          <Reveal>
            <p className="eyebrow text-[0.62rem] text-forest">Design your perfect retreat</p>
            <h2 className="mt-5 text-[clamp(2.5rem,4.5vw,4rem)]">
              Start with three <em>simple choices.</em>
            </h2>
          </Reveal>
          <div className="mt-10 space-y-9">
            <div>
              <p className="eyebrow mb-3 text-[0.58rem] text-ink/70">The experience</p>
              <div role="radiogroup" aria-label="Retreat type" className="flex flex-wrap gap-2">
                {teaserTypes.map((t) => (
                  <Pill key={t.id} active={type === t.id} onClick={() => setType(t.id)}>
                    {t.label}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-end justify-between">
                <p className="eyebrow mb-3 text-[0.58rem] text-ink/70">Guests, including leaders</p>
                <p className="font-display text-5xl leading-none text-forest">
                  <RollingNumber value={guests >= 60 ? "60+" : guests} />
                </p>
              </div>
              <input
                type="range"
                min={2}
                max={60}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                aria-label="Number of guests"
                className="mt-3 w-full accent-[var(--forest)]"
              />
            </div>
            <div>
              <p className="eyebrow mb-3 text-[0.58rem] text-ink/70">Destination</p>
              <div role="radiogroup" aria-label="Destination" className="flex flex-wrap gap-2">
                <Pill active={destination === ""} onClick={() => setDestination("")}>
                  Help me choose
                </Pill>
                {countries.map((c) => (
                  <Pill key={c} active={destination === c} onClick={() => setDestination(c)}>
                    {c}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
          <Link
            to="/plan"
            search={{ type, guests, ...(destination ? { destination } : {}) }}
            className="group mt-12 inline-flex items-center gap-3 bg-forest px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-ink"
          >
            Design my retreat{" "}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="relative min-h-72 overflow-hidden bg-ink">
          <AnimatePresence initial={false}>
            <motion.img
              key={image}
              src={image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease }}
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
