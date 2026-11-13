import { experiences, getVenue } from "@/data/site";
import { addOnOptions, type ContactDetails, type PlannerAnswers } from "./types";
import { effectiveNights } from "./matching";

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

export const experienceLabel = (id: string) =>
  id === "interest" ? "Shared interests" : (experiences.find((e) => e.id === id)?.label ?? id);

export function describeTiming(a: PlannerAnswers): string {
  if (a.timingMode === "dates" && a.startDate)
    return a.endDate
      ? `${formatDate(a.startDate)} – ${formatDate(a.endDate)}`
      : `From ${formatDate(a.startDate)}`;
  if (a.timingMode === "month" && a.month) return MONTHS[a.month - 1] ?? "Flexible";
  if (a.timingMode === "season" && a.season) return a.season;
  return "Flexible";
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function describeGuests(a: PlannerAnswers): string {
  if (a.guests === null) return "Not sure yet";
  const leaders = Math.min(a.leaders, a.guests);
  return `${a.guests} in total${leaders ? `, including ${leaders} leader${leaders > 1 ? "s" : ""}` : ""}`;
}

export function headline(a: PlannerAnswers): string {
  const kind = a.experiences.length
    ? experienceLabel(a.experiences[0]!).split(/[,&]/)[0]!.trim()
    : "Your";
  const where = a.venue
    ? getVenue(a.venue)?.name
    : a.destination !== "Help me choose"
      ? a.destination
      : null;
  return `${kind} retreat${where ? ` · ${where}` : ""}`;
}

export function briefRows(a: PlannerAnswers): { step: number; label: string; value: string }[] {
  const nights = effectiveNights(a);
  return [
    {
      step: 0,
      label: "Experience",
      value: a.experiences.map(experienceLabel).join(", ") || "Still deciding",
    },
    { step: 1, label: "Guests", value: describeGuests(a) },
    {
      step: 1,
      label: "Rooming",
      value: `${a.rooming}${a.leaders ? (a.leadersNeedRooms ? "; leaders need bedrooms" : "; leaders don't need bedrooms") : ""}`,
    },
    { step: 2, label: "Destination", value: a.destination },
    {
      step: 2,
      label: "Preferred venue",
      value: a.venue ? (getVenue(a.venue)?.name ?? "—") : "Help me choose",
    },
    { step: 3, label: "When", value: describeTiming(a) },
    {
      step: 3,
      label: "Length of stay",
      value: nights ? `${nights} night${nights > 1 ? "s" : ""}` : "Open to advice",
    },
    {
      step: 4,
      label: "Experiences",
      value:
        a.addOns.map((id) => addOnOptions.find((o) => o.id === id)?.label ?? id).join(", ") || "—",
    },
    { step: 4, label: "Catering", value: a.catering },
    { step: 4, label: "Group budget", value: a.budget },
    { step: 4, label: "Planning stage", value: a.planningStage ?? "—" },
  ];
}

export function briefText(
  a: PlannerAnswers,
  c?: Partial<ContactDetails>,
  venueLines: string[] = [],
): string {
  return [
    "RACHEL'S RETREATS — RETREAT BRIEF",
    headline(a),
    "",
    ...briefRows(a).map((r) => `${r.label}: ${r.value}`),
    `The idea: ${a.ideaNotes || "—"}`,
    "",
    "POTENTIALLY SUITABLE VENUES (to be confirmed by the team)",
    ...(venueLines.length ? venueLines : ["The team will suggest options."]),
    "",
    ...(c
      ? [
          `Name: ${c.name ?? ""}`,
          `Email: ${c.email ?? ""}`,
          `Organisation: ${c.organisation || "—"}`,
          `Phone: ${c.phone || "—"}`,
          `Additional requirements: ${c.requirements || "—"}`,
          "",
        ]
      : []),
    "This brief is an enquiry only. No booking or reservation has been made.",
  ].join("\n");
}
