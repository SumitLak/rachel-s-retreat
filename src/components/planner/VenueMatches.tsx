import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight, CircleCheck, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import { describeMinimumStay, type VenueMatch } from "@/lib/planner/matching";
import { track } from "@/lib/analytics";
import { ease } from "./controls";

export function VenueMatchCard({
  match,
  i,
  compact = false,
}: {
  match: VenueMatch;
  i: number;
  compact?: boolean;
}) {
  const { venue, status } = match;
  const potential = status === "potential";
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease, delay: i * 0.07 }}
      className={cn(
        "grid overflow-hidden bg-card shadow-[0_0_0_1px_var(--color-border)]",
        compact ? "grid-cols-[6rem_1fr]" : "grid-cols-[8rem_1fr] sm:grid-cols-[11rem_1fr]",
      )}
    >
      <img src={venue.image} alt="" loading="lazy" className="h-full w-full object-cover" />
      <div className="p-4 sm:p-5">
        <p
          className={cn(
            "eyebrow flex items-center gap-2 text-[0.56rem]",
            potential ? "text-forest" : "text-brass",
          )}
        >
          {potential ? <CircleCheck className="size-3.5" /> : <CircleHelp className="size-3.5" />}
          {potential ? "Potential match" : "Requires team confirmation"}
        </p>
        <h4 className="mt-2 font-display text-2xl leading-tight">{venue.name}</h4>
        <p className="text-xs text-muted-foreground">
          {venue.location} · {venue.capacity}
        </p>
        {!compact && (
          <>
            {match.notes.length > 0 && (
              <p className="mt-3 text-sm text-ink/80">{match.notes.slice(0, 3).join(" · ")}</p>
            )}
            {match.checks.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {match.checks.slice(0, 3).map((c) => (
                  <li key={c}>To confirm: {c}</li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-muted-foreground">{describeMinimumStay(venue)}</p>
            <Link
              to="/venues/$slug"
              params={{ slug: venue.slug }}
              target="_blank"
              onClick={() => track("planner_venue_viewed", { venue: venue.slug })}
              className="link-draw mt-3 inline-flex items-center gap-1 pb-0.5 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              View venue <ArrowUpRight className="size-3.5" />
            </Link>
          </>
        )}
      </div>
    </motion.li>
  );
}

export function NotSuitableList({ matches }: { matches: VenueMatch[] }) {
  if (!matches.length) return null;
  return (
    <details className="mt-6 text-sm">
      <summary className="cursor-pointer text-muted-foreground hover:text-ink">
        Why {matches.length} other venue{matches.length > 1 ? "s" : ""}{" "}
        {matches.length > 1 ? "aren't" : "isn't"} shown
      </summary>
      <ul className="mt-3 space-y-2">
        {matches.map((m) => (
          <li key={m.venue.slug}>
            <span className="font-semibold">{m.venue.name}:</span>{" "}
            <span className="text-muted-foreground">{m.reasons.join(" ")}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
