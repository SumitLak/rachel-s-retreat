import { venues as allVenues, type Venue } from "@/data/site";
import type { PlannerAnswers } from "./types";

/**
 * Deterministic venue matching. Hard constraints decide whether a venue is
 * "not-suitable"; anything the team must check moves it to "confirm"; soft
 * preferences only change ordering and notes. Nothing here implies
 * availability, price or a reservation.
 */
export type MatchStatus = "potential" | "confirm" | "not-suitable";

export type VenueMatch = {
  venue: Venue;
  status: MatchStatus;
  reasons: string[]; // why it is not suitable
  checks: string[]; // what the team will confirm
  notes: string[]; // positive soft-preference notes
  minNights: number;
  score: number;
  summary: string;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const seasonMonths: Record<string, number[]> = {
  Spring: [3, 4, 5],
  Summer: [6, 7, 8],
  Autumn: [9, 10, 11],
  Winter: [12, 1, 2],
};

/** Months the visitor is considering, or [] when unknown. */
export function travelMonths(a: PlannerAnswers): number[] {
  if (a.timingMode === "month" && a.month) return [a.month];
  if (a.timingMode === "season" && a.season) return seasonMonths[a.season] ?? [];
  if (a.timingMode === "dates" && a.startDate) {
    const m = Number(a.startDate.slice(5, 7));
    return m >= 1 && m <= 12 ? [m] : [];
  }
  return [];
}

/** Nights implied by a date range, if both dates are valid. */
export function nightsFromDates(start: string, end: string): number | null {
  if (!start || !end) return null;
  const s = Date.parse(start);
  const e = Date.parse(end);
  if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return null;
  return Math.round((e - s) / 86_400_000);
}

export function effectiveNights(a: PlannerAnswers): number | null {
  if (a.timingMode === "dates") return nightsFromDates(a.startDate, a.endDate) ?? a.nights;
  return a.nights;
}

/** Strictest minimum stay that could apply for the months considered. */
export function minimumNights(v: Venue, months: number[]): number {
  const { peak, offPeak, peakMonths } = v.rules.minNights;
  if (months.length === 0) return Math.max(peak, offPeak);
  return Math.max(...months.map((m) => (peakMonths.includes(m) ? peak : offPeak)));
}

export function describeMinimumStay(v: Venue): string {
  const { peak, offPeak, peakMonths } = v.rules.minNights;
  if (peak === offPeak || peakMonths.length === 0) return `${peak}-night minimum`;
  const first = MONTHS[(peakMonths[0] ?? 1) - 1];
  const last = MONTHS[(peakMonths[peakMonths.length - 1] ?? 12) - 1];
  return `${peak}-night minimum ${first} to ${last}; ${offPeak} nights off season`;
}

function bedroomsNeeded(a: PlannerAnswers): number | null {
  if (a.guests === null) return null;
  const leaders = Math.min(a.leaders, a.guests);
  const guestsOnly = a.guests - leaders;
  const leaderRooms = a.leadersNeedRooms ? leaders : 0;
  if (a.rooming === "Private rooms") return guestsOnly + leaderRooms;
  if (a.rooming === "Shared rooms") return Math.ceil(guestsOnly / 2) + leaderRooms;
  return null; // flexible / undecided: the team advises
}

export function matchVenue(v: Venue, a: PlannerAnswers): VenueMatch {
  const reasons: string[] = [];
  const checks: string[] = [];
  const notes: string[] = [];
  let score = 0;
  const months = travelMonths(a);
  const minNights = minimumNights(v, months);
  const nights = effectiveNights(a);

  // ---- Hard constraints -------------------------------------------------
  if (v.rules.status === "coming-soon")
    reasons.push("Joining the collection; release dates are still to be confirmed.");
  if (a.destination !== "Help me choose" && v.country !== a.destination)
    reasons.push(`Located in ${v.country}.`);
  if (a.guests !== null && v.maxGuests !== null && a.guests > v.maxGuests)
    reasons.push(`Welcomes up to ${v.maxGuests} guests; your group is ${a.guests}.`);
  if (a.catering === "Accommodation only (Buchlyvie)" && !v.rules.accommodationOnly)
    reasons.push("Catering and hosting are required at this venue.");
  if (nights !== null && nights < minNights)
    reasons.push(
      `Has a ${minNights}-night minimum${months.length ? " for your timing" : ""}; you're planning ${nights}.`,
    );

  // ---- Needs team confirmation -----------------------------------------
  if (a.guests !== null && v.maxGuests === null)
    checks.push("Total guest capacity depends on the rooming and properties reserved.");
  const needed = bedroomsNeeded(a);
  if (needed !== null && v.rules.bedrooms !== null && needed > v.rules.bedrooms) {
    if (v.rules.extraRooms)
      checks.push(
        `Your rooming needs about ${needed} bedrooms; additional rooms may be available by arrangement.`,
      );
    else reasons.push(`Has ${v.rules.bedrooms} bedrooms; your rooming plan needs about ${needed}.`);
  }
  if (a.guests !== null && (a.rooming === "Flexible" || a.rooming === "Help me decide"))
    checks.push("Room-by-room arrangements for your group.");
  if (nights === null) checks.push(`Length of stay (${describeMinimumStay(v)}).`);
  else if (months.length === 0 && v.rules.minNights.peak !== v.rules.minNights.offPeak)
    checks.push(`Seasonal minimum stay: ${describeMinimumStay(v)}.`);

  const wantsPractice =
    a.experiences.includes("yoga") ||
    a.addOns.includes("practice") ||
    a.addOns.includes("workshops");
  const practiceSpace = v.rules.facilities.some(
    (f) => f === "studio" || f === "practice-hall" || f === "wellbeing-space",
  );
  if (wantsPractice && !practiceSpace) checks.push("Indoor space for your sessions.");

  // ---- Soft preferences (ordering + notes only) ------------------------
  if (a.venue === v.slug) {
    score += 100;
    notes.push("Your preferred venue.");
  }
  if (wantsPractice && practiceSpace) {
    score += 10;
    notes.push(
      v.rules.facilities.includes("studio")
        ? "Dedicated studio"
        : v.rules.facilities.includes("practice-hall")
          ? "Converted hall for group practice"
          : "Dedicated wellbeing spaces",
    );
  }
  if (a.experiences.includes("scotland") && v.country === "Scotland") {
    score += 8;
    notes.push("A Scottish base for days of exploring");
  }
  if (v.rules.facilities.includes("pools")) notes.push("Two pools");
  if (v.rules.facilities.includes("hot-tubs")) notes.push("Hot tubs");
  if (v.rules.facilities.includes("river")) notes.push("River access");
  if (v.rules.facilities.includes("lake"))
    notes.push(v.country === "England" ? "On the shore of Lake Windermere" : "Spring-fed lakes");
  if (a.guests !== null && v.maxGuests !== null)
    score += Math.max(0, 5 - Math.abs(v.maxGuests - a.guests) / 4);

  const status: MatchStatus = reasons.length
    ? "not-suitable"
    : checks.length
      ? "confirm"
      : "potential";
  if (status === "potential") score += 20;
  if (status === "confirm") score += 10;

  const group = a.guests !== null ? `your group of ${a.guests}` : "your group";
  const summary =
    status === "not-suitable"
      ? `${v.name} is unlikely to suit this brief.`
      : `${v.name} could be a suitable option for ${group}. Our Retreat Partnership Team will confirm rooming arrangements, dates and availability.`;

  return { venue: v, status, reasons, checks, notes, minNights, score, summary };
}

export function matchVenues(a: PlannerAnswers, venues: Venue[] = allVenues): VenueMatch[] {
  const order: Record<MatchStatus, number> = { potential: 0, confirm: 1, "not-suitable": 2 };
  return venues
    .map((v) => matchVenue(v, a))
    .sort((x, y) => order[x.status] - order[y.status] || y.score - x.score);
}

/** Venues worth showing as recommendations: bookable and not ruled out. */
export function recommendations(a: PlannerAnswers): VenueMatch[] {
  return matchVenues(a).filter((m) => m.status !== "not-suitable");
}
