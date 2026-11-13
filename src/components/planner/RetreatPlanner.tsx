import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  Loader2,
  Mail,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { contact, countries, getVenue, venues, type RetreatType } from "@/data/site";
import {
  addOnOptions,
  budgetOptions,
  cateringOptions,
  contactSchema,
  defaultAnswers,
  planningStages,
  roomingOptions,
  seasons,
  type ContactDetails,
  type DestinationChoice,
  type PlannerAnswers,
} from "@/lib/planner/types";
import {
  describeMinimumStay,
  effectiveNights,
  matchVenues,
  nightsFromDates,
} from "@/lib/planner/matching";
import {
  briefRows,
  briefText,
  describeGuests,
  describeTiming,
  experienceLabel,
  headline,
} from "@/lib/planner/brief";
import { submitEnquiry } from "@/lib/planner/submit";
import { track } from "@/lib/analytics";
import {
  ImageCard,
  Label,
  Pill,
  PillGroup,
  RollingNumber,
  StepHeading,
  ease,
  inputCls,
} from "./controls";
import { NotSuitableList, VenueMatchCard } from "./VenueMatches";

const STEPS = [
  "The experience",
  "Your guests",
  "Your destination",
  "Dates & duration",
  "Make it yours",
  "Your brief",
];
const STORAGE_KEY = "rr-planner-v2";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const experienceCards: { id: RetreatType; title: string; subtitle: string; image: string }[] = [
  {
    id: "yoga",
    title: "Yoga & Wellness",
    subtitle: "Practice, movement, restoration",
    image: "/images/studio.webp",
  },
  {
    id: "art",
    title: "Art & Creativity",
    subtitle: "Making and learning together",
    image: "/images/art.webp",
  },
  {
    id: "business",
    title: "Business & Leadership",
    subtitle: "Teams, leaders, offsites",
    image: "/images/manor-house.webp",
  },
  { id: "golf", title: "Golf", subtitle: "Days on the course", image: "/images/glenalmond.webp" },
  {
    id: "interest",
    title: "Shared Interests",
    subtitle: "Communities & celebrations",
    image: "/images/food-gnocchi.webp",
  },
  {
    id: "scotland",
    title: "Discover Scotland",
    subtitle: "Castles, lochs, adventure",
    image: "/images/stirling-castle.webp",
  },
];

const destinationImages: Record<DestinationChoice, { image: string; line: string }> = {
  Scotland: {
    image: "/images/buchlyvie.webp",
    line: "Estates in Stirlingshire, Perthshire and the Cairngorms.",
  },
  England: {
    image: "/images/lakeside-lodge.webp",
    line: "A Victorian mansion on the shore of Lake Windermere.",
  },
  Ireland: {
    image: "/images/manor-house.webp",
    line: "A country house in 400 acres of County Monaghan.",
  },
  Italy: {
    image: "/images/villa-senesi.webp",
    line: "Two restored villas south of Siena, towards Montalcino.",
  },
  France: {
    image: "/images/chateau.webp",
    line: "A château in Gascony, coming to the collection.",
  },
  "Help me choose": {
    image: "/images/glenalmond.webp",
    line: "Seven settings across five countries. We'll help you choose.",
  },
};

const addOnImages: Record<string, string> = {
  dining: "/images/food-fish.webp",
  practice: "/images/studio.webp",
  workshops: "/images/art.webp",
  excursions: "/images/highland-cattle.webp",
  transfers: "/images/kelpies.webp",
  team: "/images/buchlyvie-lodges.webp",
};

export type PlannerPrefill = {
  type?: string | undefined;
  venue?: string | undefined;
  guests?: number | undefined;
  destination?: string | undefined;
};

function loadSaved(): { answers: PlannerAnswers; step: number } | null {
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as { answers?: Partial<PlannerAnswers>; step?: number };
    return {
      answers: { ...defaultAnswers, ...parsed.answers },
      step: Math.min(parsed.step ?? 0, 4),
    };
  } catch {
    return null;
  }
}

const hasPrefill = (p: PlannerPrefill) => Boolean(p.type || p.venue || p.guests || p.destination);

function initialAnswers(
  prefill: PlannerPrefill,
  saved: { answers: PlannerAnswers; step: number } | null = null,
): { answers: PlannerAnswers; step: number } {
  const base = saved ?? { answers: defaultAnswers, step: 0 };
  const a = { ...base.answers };
  if (prefill.type && experienceCards.some((e) => e.id === prefill.type)) {
    const t = prefill.type as RetreatType;
    a.experiences = a.experiences.includes(t) ? a.experiences : [t, ...a.experiences];
  }
  const v = prefill.venue ? getVenue(prefill.venue) : undefined;
  if (v && v.rules.status === "bookable") {
    a.venue = v.slug;
    a.destination = v.country;
  }
  if (prefill.destination && (countries as string[]).includes(prefill.destination))
    a.destination = prefill.destination as DestinationChoice;
  if (prefill.guests && prefill.guests > 0) a.guests = Math.min(60, Math.round(prefill.guests));
  return { answers: a, step: hasPrefill(prefill) ? 0 : base.step };
}

const emptyContact: ContactDetails = {
  name: "",
  email: "",
  organisation: "",
  phone: "",
  requirements: "",
  consent: false as unknown as true,
};

type SubmitState = "idle" | "submitting" | "success" | "handoff" | "error";

export function RetreatPlanner({ prefill }: { prefill: PlannerPrefill }) {
  const [{ answers: initial, step: initialStep }] = useState(() => initialAnswers(prefill));
  const [a, setA] = useState<PlannerAnswers>(initial);
  const [step, setStep] = useState(initialStep);
  const [dir, setDir] = useState(1);
  const [c, setC] = useState<ContactDetails>(emptyContact);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitState>("idle");
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(Date.now());
  const formTop = useRef<HTMLDivElement>(null);

  const set = useCallback(
    <K extends keyof PlannerAnswers>(k: K, v: PlannerAnswers[K]) => setA((p) => ({ ...p, [k]: v })),
    [],
  );
  const toggle = <T,>(list: T[], item: T) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

  // Restore this session's earlier answers after hydration (never on the server).
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      const next = initialAnswers(prefill, saved);
      setA(next.answers);
      setStep(next.step);
    }
    setRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist non-personal answers for this browser session only.
  useEffect(() => {
    if (!restored) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: a, step }));
    } catch {
      /* ignore */
    }
  }, [a, step, restored]);

  useEffect(() => {
    track("planner_started", { prefilled_venue: prefill.venue ?? null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matches = useMemo(() => matchVenues(a), [a]);
  const suitable = matches.filter((m) => m.status !== "not-suitable");
  const unsuitable = matches.filter(
    (m) => m.status === "not-suitable" && m.venue.rules.status === "bookable",
  );
  const venueLines = suitable.map(
    (m) =>
      `- ${m.venue.name} (${m.status === "potential" ? "potential match" : "requires team confirmation"})`,
  );
  const text = briefText(
    a,
    status === "success" || status === "handoff" ? c : undefined,
    venueLines,
  );

  const go = (n: number) => {
    if (n < 0 || n >= STEPS.length) return;
    if (n > step) track("planner_step_completed", { step: step + 1, name: STEPS[step] ?? "" });
    if (n === STEPS.length - 1) track("planner_completed", { matches: suitable.length });
    setDir(n > step ? 1 : -1);
    setStep(n);
    requestAnimationFrame(() =>
      formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const submit = async () => {
    if (status === "submitting") return;
    const parsed = contactSchema.safeParse(c);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      for (const issue of parsed.error.issues) e[String(issue.path[0])] = issue.message;
      setErrors(e);
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await submitEnquiry({
        data: {
          contact: parsed.data,
          answers: a,
          brief: briefText(a, parsed.data, venueLines),
          website: honeypot,
          startedAt: startedAt.current,
        },
      });
      if (res.ok) {
        setReference(res.reference);
        setStatus("success");
        track("planner_enquiry_submitted", { matches: suitable.length });
      } else if (res.reason === "not-configured") {
        setStatus("handoff");
        track("planner_enquiry_failed", { reason: "not-configured" });
      } else {
        setStatus("error");
        track("planner_enquiry_failed", { reason: res.reason });
      }
    } catch {
      setStatus("error");
      track("planner_enquiry_failed", { reason: "network" });
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "rachels-retreats-brief.txt";
    link.click();
    URL.revokeObjectURL(url);
  };
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`Retreat brief: ${headline(a)}${c.name ? ` — ${c.name}` : ""}`)}&body=${encodeURIComponent(text)}`;

  // ---- Visual panel --------------------------------------------------
  const lastExperience = experienceCards.find(
    (e) => e.id === a.experiences[a.experiences.length - 1],
  );
  const preferred = a.venue ? getVenue(a.venue) : undefined;
  const visual = (() => {
    if (step === 0)
      return {
        image: lastExperience?.image ?? "/images/villa-senesi.webp",
        eyebrow: "The experience",
        line: lastExperience
          ? `${lastExperience.title}: ${lastExperience.subtitle}.`
          : "Places worth travelling for.",
      };
    if (step === 1)
      return {
        image: "/images/buchlyvie-bedroom.webp",
        eyebrow: "Your guests",
        line: "Rooms ready for their arrival.",
      };
    if (step === 2)
      return preferred
        ? { image: preferred.image, eyebrow: preferred.location, line: preferred.headline }
        : {
            image: destinationImages[a.destination].image,
            eyebrow: a.destination,
            line: destinationImages[a.destination].line,
          };
    if (step === 3)
      return {
        image: "/images/glenalmond.webp",
        eyebrow: "Dates & duration",
        line: "Time away, shaped around your programme.",
      };
    if (step === 4)
      return {
        image: addOnImages[a.addOns[a.addOns.length - 1] ?? "dining"] ?? "/images/food-fish.webp",
        eyebrow: "Make it yours",
        line: "Menus, experiences and the details around them.",
      };
    const top = preferred ?? suitable[0]?.venue;
    return {
      image: top?.image ?? "/images/villa-senesi.webp",
      eyebrow: "Your retreat",
      line: "Taking shape.",
    };
  })();

  const destVenues = venues.filter(
    (v) => a.destination === "Help me choose" || v.country === a.destination,
  );
  const done = status === "success" || status === "handoff";

  return (
    <div className="lg:grid lg:min-h-[100svh] lg:grid-cols-[45fr_55fr]">
      {/* Mobile visual header */}
      <div className="relative h-56 overflow-hidden bg-ink sm:h-72 lg:hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={visual.image}
            src={visual.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-ink/10" />
        <p className="eyebrow absolute bottom-5 left-5 text-[0.6rem] text-ivory">
          {visual.eyebrow}
        </p>
      </div>

      {/* Form column */}
      <div
        ref={formTop}
        className="scroll-mt-24 px-5 pb-36 pt-10 sm:px-10 lg:px-14 lg:pb-16 lg:pt-32 xl:px-20"
      >
        <p className="eyebrow text-[0.62rem] text-muted-foreground">Design your perfect retreat</p>

        {/* Progress */}
        <ol className="mt-6 grid grid-cols-6 gap-1.5" aria-label="Planner progress">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => !done && i <= step && go(i)}
                disabled={done || i > step}
                aria-label={`Step ${i + 1}: ${s}`}
                aria-current={i === step ? "step" : undefined}
                className="block w-full py-2 disabled:cursor-default"
              >
                <span className="relative block h-0.5 bg-border">
                  <motion.span
                    className="absolute inset-0 origin-left bg-forest"
                    initial={false}
                    animate={{ scaleX: done || i < step ? 1 : i === step ? 0.5 : 0 }}
                    transition={{ duration: 0.4, ease }}
                  />
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>

        <div className="relative mt-10 overflow-hidden px-1 pb-1">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={done ? "done" : step}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 48 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -48 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease }}
            >
              {done ? (
                <Completion
                  status={status}
                  reference={reference}
                  text={text}
                  mailto={mailto}
                  copied={copied}
                  onCopy={async () => {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                  }}
                  onDownload={download}
                />
              ) : step === 0 ? (
                <>
                  <StepHeading
                    eyebrow="01 · The experience"
                    title={
                      <>
                        What kind of experience would you <em>love to create?</em>
                      </>
                    }
                    intro="Choose one or more. You can change this at any time."
                  />
                  <div
                    role="group"
                    aria-label="Retreat types"
                    className="grid grid-cols-2 gap-3 xl:grid-cols-3"
                  >
                    {experienceCards.map((e) => (
                      <ImageCard
                        key={e.id}
                        multi
                        selected={a.experiences.includes(e.id)}
                        onClick={() => set("experiences", toggle(a.experiences, e.id))}
                        image={e.image}
                        title={e.title}
                        subtitle={e.subtitle}
                      />
                    ))}
                  </div>
                </>
              ) : step === 1 ? (
                <GuestsStep a={a} set={set} />
              ) : step === 2 ? (
                <>
                  <StepHeading
                    eyebrow="03 · Your destination"
                    title={
                      <>
                        Where would you like <em>to escape to?</em>
                      </>
                    }
                  />
                  <div
                    role="radiogroup"
                    aria-label="Destination"
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                  >
                    {(
                      [
                        "Scotland",
                        "England",
                        "Ireland",
                        "Italy",
                        "France",
                        "Help me choose",
                      ] as DestinationChoice[]
                    ).map((d) => (
                      <ImageCard
                        key={d}
                        compact
                        selected={a.destination === d}
                        onClick={() => {
                          set("destination", d);
                          if (a.venue && getVenue(a.venue)?.country !== d) set("venue", null);
                        }}
                        image={destinationImages[d].image}
                        title={d === "Help me choose" ? "Surprise me" : d}
                        subtitle={d === "France" ? "Coming to the collection" : undefined}
                      />
                    ))}
                  </div>
                  <div className="mt-10">
                    <Label optional>A particular property in mind?</Label>
                    <PillGroup label="Preferred venue">
                      <Pill active={a.venue === null} onClick={() => set("venue", null)}>
                        No preference
                      </Pill>
                      {destVenues
                        .filter((v) => v.rules.status === "bookable")
                        .map((v) => (
                          <Pill
                            key={v.slug}
                            active={a.venue === v.slug}
                            onClick={() => {
                              set("venue", v.slug);
                              set("destination", v.country);
                            }}
                          >
                            {v.name}
                          </Pill>
                        ))}
                    </PillGroup>
                    {a.destination === "France" && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        The Château in Gascony is joining the collection; release dates are to be
                        confirmed. Tell us your plans and the team will keep you informed.
                      </p>
                    )}
                  </div>
                  <ul className="mt-10 grid gap-3">
                    {destVenues
                      .filter((v) => v.rules.status === "bookable")
                      .slice(0, 4)
                      .map((v, i) => (
                        <VenueMatchCard
                          key={v.slug}
                          i={i}
                          compact
                          match={matches.find((m) => m.venue.slug === v.slug)!}
                        />
                      ))}
                  </ul>
                </>
              ) : step === 3 ? (
                <DatesStep a={a} set={set} />
              ) : step === 4 ? (
                <>
                  <StepHeading
                    eyebrow="05 · Make it yours"
                    title={
                      <>
                        What would make this retreat <em>unforgettable?</em>
                      </>
                    }
                    intro="Everything on this step is optional."
                  />
                  <div
                    role="group"
                    aria-label="Experiences to include"
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                  >
                    {addOnOptions.map((o) => (
                      <ImageCard
                        key={o.id}
                        compact
                        multi
                        selected={a.addOns.includes(o.id)}
                        onClick={() => set("addOns", toggle(a.addOns, o.id))}
                        image={addOnImages[o.id] ?? ""}
                        title={o.label}
                      />
                    ))}
                  </div>
                  <div className="mt-10 space-y-10">
                    <div>
                      <Label>Catering</Label>
                      <PillGroup label="Catering">
                        {cateringOptions.map((x) => (
                          <Pill
                            key={x}
                            active={a.catering === x}
                            onClick={() => set("catering", x)}
                          >
                            {x}
                          </Pill>
                        ))}
                      </PillGroup>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Accommodation-only bookings are available at Buchlyvie; catering and hosting
                        are required at every other venue.
                      </p>
                    </div>
                    <div className="grid gap-10 sm:grid-cols-2">
                      <label className="block">
                        <Label optional>Total group budget</Label>
                        <select
                          className={inputCls}
                          value={a.budget}
                          onChange={(e) =>
                            set("budget", e.target.value as PlannerAnswers["budget"])
                          }
                        >
                          {budgetOptions.map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </label>
                      <div>
                        <Label optional>How far along are you with planning?</Label>
                        <select
                          className={inputCls}
                          value={a.planningStage ?? ""}
                          onChange={(e) =>
                            set(
                              "planningStage",
                              (e.target.value || null) as PlannerAnswers["planningStage"],
                            )
                          }
                          aria-label="Planning stage"
                        >
                          <option value="">Prefer not to say</option>
                          {planningStages.map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <label className="block">
                      <Label optional>Tell us a little about the idea</Label>
                      <textarea
                        rows={3}
                        className={inputCls}
                        value={a.ideaNotes}
                        onChange={(e) => set("ideaNotes", e.target.value)}
                        placeholder="A week of practice for my community…"
                      />
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <StepHeading
                    eyebrow="06 · Your brief"
                    title={
                      <>
                        Your retreat is <em>taking shape.</em>
                      </>
                    }
                    intro="Check your choices, see which venues could suit, and send your brief to our Retreat Partnership Team."
                  />
                  <div className="bg-forest p-6 text-ivory sm:p-8">
                    <p className="font-display text-3xl">{headline(a)}</p>
                    <dl className="mt-6 divide-y divide-ivory/15">
                      {briefRows(a).map((r) => (
                        <div
                          key={r.label}
                          className="flex items-baseline justify-between gap-4 py-3"
                        >
                          <dt className="eyebrow shrink-0 text-[0.56rem] text-ivory/60">
                            {r.label}
                          </dt>
                          <dd className="flex items-baseline gap-3 text-right text-sm">
                            {r.value}
                            <button
                              type="button"
                              onClick={() => go(r.step)}
                              className="shrink-0 text-brass hover:text-ivory"
                              aria-label={`Edit ${r.label}`}
                            >
                              <Pencil className="size-3.5" />
                            </button>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <h3 className="mt-14 text-4xl">Venues that could suit</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Based on published venue details. The team confirms suitability, availability
                    and an itemised quote.
                  </p>
                  {suitable.length ? (
                    <ul className="mt-6 grid gap-4">
                      {suitable.map((m, i) => (
                        <VenueMatchCard key={m.venue.slug} match={m} i={i} />
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-6 bg-stone p-6 text-sm">
                      None of the listed venues fits every choice yet. Send your brief anyway: the
                      team can advise on alternatives, or edit your choices above.
                    </p>
                  )}
                  <NotSuitableList matches={unsuitable} />

                  <h3 className="mt-14 text-4xl">Who shall we plan with?</h3>
                  <div className="mt-8 grid gap-8 sm:grid-cols-2">
                    <TextField
                      label="Your name *"
                      name="name"
                      value={c.name}
                      error={errors["name"]}
                      onChange={(v) => setC({ ...c, name: v })}
                      autoComplete="name"
                    />
                    <TextField
                      label="Email address *"
                      name="email"
                      type="email"
                      value={c.email}
                      error={errors["email"]}
                      onChange={(v) => setC({ ...c, email: v })}
                      autoComplete="email"
                    />
                    <TextField
                      label="Organisation or retreat brand"
                      name="organisation"
                      value={c.organisation ?? ""}
                      onChange={(v) => setC({ ...c, organisation: v })}
                      autoComplete="organization"
                      optional
                    />
                    <TextField
                      label="Phone number"
                      name="phone"
                      type="tel"
                      value={c.phone ?? ""}
                      error={errors["phone"]}
                      onChange={(v) => setC({ ...c, phone: v })}
                      autoComplete="tel"
                      optional
                    />
                  </div>
                  <label className="mt-8 block">
                    <Label optional>Additional requirements</Label>
                    <textarea
                      rows={3}
                      className={inputCls}
                      value={c.requirements ?? ""}
                      onChange={(e) => setC({ ...c, requirements: e.target.value })}
                    />
                  </label>
                  <div className="absolute -left-[9999px]" aria-hidden>
                    <label>
                      Leave this field empty
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </label>
                  </div>
                  <label className="mt-8 flex cursor-pointer items-start gap-4 text-sm leading-relaxed">
                    <input
                      type="checkbox"
                      checked={c.consent === true}
                      onChange={(e) => setC({ ...c, consent: e.target.checked as true })}
                      className="mt-1 size-4 accent-[var(--forest)]"
                      aria-invalid={!!errors["consent"]}
                    />
                    <span>
                      I understand Rachel's Retreats will store my brief and contact me about
                      planning this retreat. Sending it does not reserve dates, create a booking or
                      subscribe me to marketing.
                      {errors["consent"] && (
                        <span className="mt-1 block text-destructive">{errors["consent"]}</span>
                      )}
                    </span>
                  </label>
                  {status === "error" && (
                    <p role="alert" className="mt-6 bg-destructive/10 p-4 text-sm">
                      We couldn't send your brief just now. Please try again, or{" "}
                      <a href={mailto} className="underline">
                        email it to the team
                      </a>{" "}
                      instead.
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation: sticky on mobile */}
        {!done && (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-ivory/95 px-5 py-4 backdrop-blur sm:px-10 lg:static lg:mt-12 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => go(step - 1)}
                className={cn("inline-flex items-center gap-2 text-sm", step === 0 && "invisible")}
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <div className="flex items-center gap-5">
                {step > 0 && step < 5 && (
                  <button
                    type="button"
                    onClick={() => go(step + 1)}
                    className="hidden text-sm text-muted-foreground hover:text-ink sm:inline"
                  >
                    Skip
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => (step < 5 ? go(step + 1) : submit())}
                  disabled={status === "submitting"}
                  className="group inline-flex items-center gap-3 bg-forest px-6 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-ink disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Sending
                    </>
                  ) : step < 5 ? (
                    <>
                      Continue{" "}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </>
                  ) : (
                    <>Request my personalised proposal</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile collapsible summary */}
        {!done && step < 5 && (
          <details className="mt-12 bg-forest text-ivory lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between p-5">
              <span className="eyebrow text-[0.6rem] text-brass">Your brief so far</span>
              <ChevronDown className="size-4" />
            </summary>
            <div className="px-5 pb-5">
              <LiveSummary a={a} matchesCount={suitable.length} />
            </div>
          </details>
        )}
      </div>

      {/* Desktop cinematic panel */}
      <div className="relative hidden lg:block">
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink text-ivory">
          <AnimatePresence initial={false}>
            <motion.img
              key={visual.image}
              src={visual.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/30" />
          <div className="absolute inset-x-0 bottom-0 grid gap-8 p-10 xl:grid-cols-[1fr_22rem] xl:items-end xl:p-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={visual.eyebrow + visual.line}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
              >
                <p className="eyebrow text-[0.6rem] text-brass">{visual.eyebrow}</p>
                <p className="mt-3 max-w-md font-display text-4xl leading-tight">{visual.line}</p>
              </motion.div>
            </AnimatePresence>
            <div className="bg-ivory/10 p-6 backdrop-blur-md">
              <p className="eyebrow text-[0.56rem] text-brass">Your brief so far</p>
              <LiveSummary a={a} matchesCount={suitable.length} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveSummary({ a, matchesCount }: { a: PlannerAnswers; matchesCount: number }) {
  const nights = effectiveNights(a);
  const rows = [
    { k: "Experience", v: a.experiences.map(experienceLabel).join(", ") || "—" },
    { k: "Guests", v: describeGuests(a) },
    { k: "Destination", v: a.venue ? (getVenue(a.venue)?.name ?? a.destination) : a.destination },
    { k: "When", v: describeTiming(a) },
    { k: "Stay", v: nights ? `${nights} nights` : "Open" },
    { k: "Extras", v: a.addOns.length ? `${a.addOns.length} selected` : "—" },
  ];
  return (
    <dl className="mt-3 space-y-2 text-sm" aria-live="polite">
      {rows.map((r) => (
        <div key={r.k} className="flex justify-between gap-4">
          <dt className="text-ivory/60">{r.k}</dt>
          <AnimatePresence mode="wait" initial={false}>
            <motion.dd
              key={r.v}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-right"
            >
              {r.v}
            </motion.dd>
          </AnimatePresence>
        </div>
      ))}
      <div className="flex justify-between gap-4 border-t border-ivory/15 pt-2">
        <dt className="text-ivory/60">Venues that could suit</dt>
        <dd>
          <RollingNumber value={matchesCount} />
        </dd>
      </div>
    </dl>
  );
}

type SetFn = <K extends keyof PlannerAnswers>(k: K, v: PlannerAnswers[K]) => void;

function GuestsStep({ a, set }: { a: PlannerAnswers; set: SetFn }) {
  const guests = a.guests ?? 16;
  return (
    <>
      <StepHeading
        eyebrow="02 · Your guests"
        title={
          <>
            Who will be <em>joining you?</em>
          </>
        }
        intro="Include retreat leaders in the total."
      />
      <div className={cn("transition-opacity", a.guests === null && "opacity-50")}>
        <div className="flex items-end justify-between">
          <Label>Total guests</Label>
          <p className="font-display text-6xl leading-none text-forest">
            <RollingNumber value={a.guests === null ? "—" : guests >= 60 ? "60+" : guests} />
          </p>
        </div>
        <input
          type="range"
          min={2}
          max={60}
          value={guests}
          onChange={(e) => set("guests", Number(e.target.value))}
          aria-label="Total guests including leaders"
          aria-valuetext={a.guests === null ? "Not sure yet" : `${guests} guests`}
          className="mt-4 w-full accent-[var(--forest)]"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>2</span>
          <span>30</span>
          <span>60+</span>
        </div>
      </div>
      <label className="mt-5 flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={a.guests === null}
          onChange={(e) => set("guests", e.target.checked ? null : 16)}
          className="size-4 accent-[var(--forest)]"
        />
        Not sure yet
      </label>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <Label>Retreat leaders (included above)</Label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => set("leaders", Math.max(0, a.leaders - 1))}
              className="grid size-11 place-items-center rounded-full border border-ink/25 hover:bg-ink hover:text-ivory"
              aria-label="Fewer leaders"
            >
              −
            </button>
            <span className="w-8 text-center font-display text-3xl">
              <RollingNumber value={a.leaders} />
            </span>
            <button
              type="button"
              onClick={() => set("leaders", Math.min(10, a.leaders + 1))}
              className="grid size-11 place-items-center rounded-full border border-ink/25 hover:bg-ink hover:text-ivory"
              aria-label="More leaders"
            >
              +
            </button>
          </div>
        </div>
        {a.leaders > 0 && (
          <div>
            <Label>Do leaders need bedrooms?</Label>
            <PillGroup label="Leaders need bedrooms">
              <Pill active={a.leadersNeedRooms} onClick={() => set("leadersNeedRooms", true)}>
                Yes
              </Pill>
              <Pill active={!a.leadersNeedRooms} onClick={() => set("leadersNeedRooms", false)}>
                No
              </Pill>
            </PillGroup>
          </div>
        )}
      </div>

      <div className="mt-10">
        <Label>Rooming preference</Label>
        <PillGroup label="Rooming preference">
          {roomingOptions.map((r) => (
            <Pill key={r} active={a.rooming === r} onClick={() => set("rooming", r)}>
              {r}
            </Pill>
          ))}
        </PillGroup>
        <p className="mt-3 text-xs text-muted-foreground">
          Bedroom configurations differ by venue. The team confirms twin, double and bathroom
          arrangements for your group.
        </p>
      </div>
    </>
  );
}

function DatesStep({ a, set }: { a: PlannerAnswers; set: SetFn }) {
  const rangeNights = nightsFromDates(a.startDate, a.endDate);
  const shown = venues.filter(
    (v) =>
      v.rules.status === "bookable" &&
      (a.destination === "Help me choose" || v.country === a.destination),
  );
  const modes: { id: PlannerAnswers["timingMode"]; label: string }[] = [
    { id: "dates", label: "Specific dates" },
    { id: "month", label: "A month" },
    { id: "season", label: "A season" },
    { id: "flexible", label: "My dates are flexible" },
  ];
  return (
    <>
      <StepHeading
        eyebrow="04 · Dates & duration"
        title={
          <>
            When do you imagine bringing <em>everyone together?</em>
          </>
        }
      />
      <PillGroup label="How to describe timing">
        {modes.map((m) => (
          <Pill key={m.id} active={a.timingMode === m.id} onClick={() => set("timingMode", m.id)}>
            {m.label}
          </Pill>
        ))}
      </PillGroup>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={a.timingMode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          {a.timingMode === "dates" && (
            <div className="grid gap-8 sm:grid-cols-2">
              <label>
                <Label>Arrival</Label>
                <input
                  type="date"
                  className={inputCls}
                  value={a.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </label>
              <label>
                <Label>Departure</Label>
                <input
                  type="date"
                  className={inputCls}
                  min={a.startDate || undefined}
                  value={a.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                />
              </label>
              {rangeNights && (
                <p className="text-sm text-forest sm:col-span-2">{rangeNights} nights</p>
              )}
            </div>
          )}
          {a.timingMode === "month" && (
            <div
              role="radiogroup"
              aria-label="Month"
              className="grid grid-cols-4 gap-2 sm:grid-cols-6"
            >
              {MONTHS.map((m, i) => (
                <Pill key={m} active={a.month === i + 1} onClick={() => set("month", i + 1)}>
                  {m}
                </Pill>
              ))}
            </div>
          )}
          {a.timingMode === "season" && (
            <PillGroup label="Season">
              {seasons.map((s) => (
                <Pill key={s} active={a.season === s} onClick={() => set("season", s)}>
                  {s}
                </Pill>
              ))}
            </PillGroup>
          )}
          {a.timingMode === "flexible" && (
            <p className="text-sm text-muted-foreground">
              No problem. The team can suggest dates that work for the venue and your group.
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {a.timingMode !== "dates" && (
        <div className="mt-10">
          <Label>How many nights?</Label>
          <PillGroup label="Number of nights">
            <Pill active={a.nights === null} onClick={() => set("nights", null)}>
              Open to advice
            </Pill>
            {[2, 3, 4, 5, 6, 7, 10, 14].map((n) => (
              <Pill key={n} active={a.nights === n} onClick={() => set("nights", n)}>
                {n === 14 ? "14+" : n}
              </Pill>
            ))}
          </PillGroup>
        </div>
      )}

      <div className="mt-10 bg-stone p-6">
        <p className="eyebrow text-[0.58rem] text-forest">
          Minimum stays{a.destination !== "Help me choose" ? ` in ${a.destination}` : ""}
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {shown.map((v) => (
            <li key={v.slug} className="flex justify-between gap-4">
              <span>{v.name}</span>
              <span className="text-right text-muted-foreground">{describeMinimumStay(v)}</span>
            </li>
          ))}
          {shown.length === 0 && (
            <li className="text-muted-foreground">
              The Château's release dates and stays are still to be confirmed.
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  optional,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  type?: string;
  autoComplete?: string;
  optional?: boolean;
}) {
  const id = `planner-${name}`;
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-[0.6rem] text-ink/70">
        {label}
        {optional && (
          <span className="ml-2 normal-case tracking-normal text-muted-foreground">(optional)</span>
        )}
      </label>
      <input
        id={id}
        type={type}
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function Completion({
  status,
  reference,
  text,
  mailto,
  copied,
  onCopy,
  onDownload,
}: {
  status: SubmitState;
  reference: string;
  text: string;
  mailto: string;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}) {
  const sent = status === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease }}
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease, delay: 0.15 }}
        className="grid size-16 place-items-center rounded-full bg-forest text-ivory"
      >
        <Check className="size-7" />
      </motion.span>
      <h2 className="mt-8 text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.02]">
        {sent ? (
          <>
            Thank you. Your brief <em>is with us.</em>
          </>
        ) : (
          <>
            Your brief <em>is ready to send.</em>
          </>
        )}
      </h2>
      {sent ? (
        <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
          Our Retreat Partnership Team will review it and come back to you with venue options and
          the next steps. Your reference is <strong className="text-ink">{reference}</strong>. No
          reservation has been made and no dates are held.
        </p>
      ) : (
        <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
          Online sending isn't switched on yet, so please send your brief by email. The button below
          opens your email app with everything filled in. No reservation has been made and no dates
          are held.
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        {!sent && (
          <a
            href={mailto}
            className="inline-flex items-center gap-3 bg-forest px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ivory hover:bg-ink"
          >
            <Mail className="size-4" /> Email my brief
          </a>
        )}
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-3 border border-ink/25 px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] hover:border-ink"
        >
          <Copy className="size-4" /> {copied ? "Copied" : "Copy brief"}
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-3 border border-ink/25 px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] hover:border-ink"
        >
          <Download className="size-4" /> Download brief
        </button>
      </div>
      <pre
        className="mt-10 max-h-80 overflow-auto whitespace-pre-wrap bg-stone p-6 text-xs leading-relaxed"
        data-lenis-prevent
      >
        {text}
      </pre>
      <p className="mt-6 text-sm">
        Prefer to talk?{" "}
        <a href={contact.phoneHref} className="link-draw pb-0.5 text-forest">
          {contact.phone}
        </a>
      </p>
    </motion.div>
  );
}
