import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, HeartHandshake, Plus, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion";
import { dayExplorer, journey, serviceCards, visionSupport } from "@/data/host-content";

/* ------------------------------------------------------------------ */
/* Interactive service cards                                           */
/* Descriptions are always in the HTML; hover/focus/tap reveals them.  */
/* ------------------------------------------------------------------ */
export function ServiceCards() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {serviceCards.map((s, i) => (
        <ServiceCard
          key={s.title}
          card={s}
          index={i}
          open={open === i}
          onOpen={() => setOpen(i)}
          onClose={() => setOpen((o) => (o === i ? null : o))}
          onToggle={() => setOpen((o) => (o === i ? null : i))}
        />
      ))}
    </ul>
  );
}

function ServiceCard({
  card,
  index,
  open,
  onOpen,
  onClose,
  onToggle,
}: {
  card: (typeof serviceCards)[number];
  index: number;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  const descId = useId();
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] [mask-image:radial-gradient(white,black)]">
        <img
          src={card.image}
          alt={card.alt}
          loading="lazy"
          decoding="async"
          className={cn(
            "h-full w-full object-cover transition-transform duration-[400ms] ease-[var(--ease-luxe)]",
            open && "scale-[1.03]",
          )}
        />
        {/* Forest gradient rises from the bottom */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-forest via-forest/80 to-forest/10 transition-opacity duration-[350ms]",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          id={descId}
          className={cn(
            "absolute inset-x-0 bottom-0 p-6 text-ivory transition-all duration-[300ms] ease-[var(--ease-luxe)]",
            open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
          )}
        >
          <p className="text-[0.95rem] leading-relaxed">{card.body}</p>
          <Link
            to={card.cta.to}
            tabIndex={open ? 0 : -1}
            className="eyebrow mt-4 inline-flex items-center gap-2 text-[0.62rem] text-brass hover:text-ivory"
          >
            {card.cta.label} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <div>
          <p className="eyebrow text-[0.58rem] text-muted-foreground">
            {card.n} · {card.label}
          </p>
          <h3 className="mt-1.5 font-display text-2xl leading-tight">
            <span className="relative">
              {card.title}
              <span
                aria-hidden
                className={cn(
                  "absolute -bottom-1 left-0 h-px w-full origin-left bg-brass transition-transform duration-[350ms]",
                  open ? "scale-x-100" : "scale-x-0",
                )}
              />
            </span>
          </h3>
        </div>
        <button
          type="button"
          onClick={onToggle}
          onFocus={onOpen}
          aria-expanded={open}
          aria-controls={descId}
          aria-label={`${open ? "Hide" : "Read more about"} ${card.title}`}
          className="mt-1 grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-ink/20 transition-colors hover:bg-ink hover:text-ivory"
        >
          <Plus className={cn("size-4 transition-transform duration-300", open && "rotate-45")} />
        </button>
      </div>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs keyboard helper (arrow keys / Home / End)                      */
/* ------------------------------------------------------------------ */
function useTabKeys(count: number, setActive: (i: number) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % count;
    if (e.key === "ArrowLeft") next = (i - 1 + count) % count;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = count - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };
  return { refs, onKeyDown };
}

/* ------------------------------------------------------------------ */
/* Five-stage hosting journey (click-driven, not scroll-driven)        */
/* ------------------------------------------------------------------ */
export function HostingJourney() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const steps = journey.steps;
  const { refs, onKeyDown } = useTabKeys(steps.length, setActive);
  const baseId = useId();

  return (
    <div>
      {/* Milestone selector: sticky within the section on desktop */}
      <div className="z-20 bg-ivory/95 py-4 backdrop-blur lg:sticky lg:top-24">
        <div role="tablist" aria-label="Hosting journey stages" className="grid grid-cols-5 gap-2">
          {steps.map((s, i) => (
            <button
              key={s.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${baseId}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-full font-display text-lg transition-colors duration-300 md:size-12 md:text-xl",
                  i === active
                    ? "bg-forest text-ivory"
                    : i < active
                      ? "bg-brass/25 text-forest"
                      : "bg-stone text-ink/60 group-hover:text-ink",
                )}
              >
                {i < active ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[0.62rem] font-semibold uppercase tracking-[0.14em] sm:text-[0.68rem]",
                  i === active ? "text-ink" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
        <div className="relative mt-4 h-0.5 rounded-full bg-border">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-brass"
            initial={false}
            animate={{ width: `${((active + 1) / steps.length) * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
          />
        </div>
      </div>

      {/* Panels: all stages are in the HTML; inactive ones are hidden */}
      {steps.map((s, i) => (
        <div
          key={s.key}
          id={`${baseId}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={i !== active}
          className="mt-6"
        >
          {i === active && (
            <div className="grid gap-6 lg:grid-cols-[45fr_55fr] lg:gap-10">
              <motion.div
                key={s.image}
                className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-stone lg:aspect-auto lg:min-h-[26rem]"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <img
                  src={s.image}
                  alt={s.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </motion.div>
              <div className="flex flex-col">
                <p className="eyebrow text-[0.6rem] text-forest">
                  Stage {i + 1} of {steps.length} · {s.label}
                </p>
                <h3 className="mt-3 text-[clamp(2rem,3vw,2.75rem)] leading-tight">{s.title}</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: UserRound, label: "Your role", text: s.you },
                    { icon: HeartHandshake, label: "Our role", text: s.us },
                  ].map((r, k) => (
                    <motion.div
                      key={r.label}
                      className="rounded-[1.25rem] bg-card p-5 shadow-[0_0_0_1px_var(--color-border)]"
                      initial={reduce ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.08 + k * 0.08 }}
                    >
                      <p className="flex items-center gap-2 font-display text-xl">
                        <r.icon className="size-4 text-brass" /> {r.label}
                      </p>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/80">{r.text}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className="mt-4 rounded-[1.25rem] bg-stone p-5"
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.24 }}
                >
                  <p className="eyebrow text-[0.58rem] text-forest">The outcome</p>
                  <p className="mt-2 leading-relaxed">{s.outcome}</p>
                </motion.div>
                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setActive(Math.max(0, i - 1))}
                    disabled={i === 0}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm ring-1 ring-ink/20 transition-colors enabled:hover:bg-ink enabled:hover:text-ivory disabled:opacity-35"
                  >
                    <ArrowLeft className="size-4" /> Previous
                  </button>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {i + 1} of {steps.length}
                  </span>
                  {i < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActive(i + 1)}
                      className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-ink"
                    >
                      Next step <ArrowRight className="size-4" />
                    </button>
                  ) : (
                    <Link
                      to="/plan"
                      className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-ink"
                    >
                      Design your retreat <ArrowRight className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Inactive stages keep their text in the document for search engines */}
          {i !== active && (
            <div>
              <h3>{s.title}</h3>
              <p>Your role: {s.you}</p>
              <p>Our role: {s.us}</p>
              <p>The outcome: {s.outcome}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sample retreat-day explorer                                         */
/* ------------------------------------------------------------------ */
export function DayExplorer() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const formats = dayExplorer.formats;
  const f = formats[active] ?? formats[0]!;
  const { refs, onKeyDown } = useTabKeys(formats.length, setActive);
  const baseId = useId();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-stone lg:aspect-auto lg:min-h-[34rem]">
        <AnimatePresence initial={false}>
          <motion.img
            key={f.image}
            src={f.image}
            alt={f.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          />
        </AnimatePresence>
      </div>
      <div>
        <div
          role="tablist"
          aria-label="Sample retreat formats"
          className="inline-flex gap-1 rounded-full bg-stone p-1"
        >
          {formats.map((x, i) => (
            <button
              key={x.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${baseId}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "relative rounded-full px-5 py-2.5 text-sm transition-colors",
                i === active ? "text-ivory" : "text-ink/70 hover:text-ink",
              )}
            >
              {i === active && (
                <motion.span
                  layoutId={`${baseId}-pill`}
                  className="absolute inset-0 rounded-full bg-forest"
                  transition={{ duration: 0.35, ease: EASE }}
                />
              )}
              <span className="relative">{x.label}</span>
            </button>
          ))}
        </div>

        {formats.map((x, i) => (
          <div
            key={x.key}
            id={`${baseId}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${i}`}
            hidden={i !== active}
          >
            <ol className="mt-6 divide-y divide-border">
              {x.day.map((d, k) => (
                <motion.li
                  key={`${x.key}-${d.time}`}
                  className="grid grid-cols-[4rem_1fr] gap-4 py-4"
                  initial={reduce || i !== active ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: k * 0.05 }}
                >
                  <span className="font-display text-xl tabular-nums text-forest">{d.time}</span>
                  <span>
                    <span className="block font-display text-2xl leading-tight">{d.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{d.note}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <p className="text-sm italic text-muted-foreground">{dayExplorer.disclaimer}</p>
              <Link
                to="/plan"
                search={{ type: x.plannerType }}
                className="link-draw inline-flex items-center gap-2 pb-1 text-sm text-forest"
              >
                Design a {x.label.toLowerCase()} retreat <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* You lead / We support                                               */
/* ------------------------------------------------------------------ */
export function ResponsibilitySplit() {
  const panels = [
    {
      icon: UserRound,
      title: "You lead",
      text: [visionSupport.youLead],
      list: visionSupport.youList,
      dark: false,
    },
    {
      icon: HeartHandshake,
      title: "We support",
      text: visionSupport.weSupport,
      list: visionSupport.usList,
      dark: true,
    },
  ];
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {panels.map((p, i) => (
        <motion.article
          key={p.title}
          className={cn(
            "rounded-[1.5rem] p-8 md:p-10",
            p.dark ? "bg-forest text-ivory" : "bg-card shadow-[0_0_0_1px_var(--color-border)]",
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.4, ease: EASE, delay: i * 0.1 }}
        >
          <span
            className={cn(
              "grid size-12 place-items-center rounded-full",
              p.dark ? "bg-brass/20 text-brass" : "bg-stone text-forest",
            )}
          >
            <p.icon className="size-5" />
          </span>
          <h3 className="mt-6 text-3xl">{p.title}</h3>
          <ul className="mt-5 space-y-2.5">
            {p.list.map((li) => (
              <li key={li} className="flex gap-3">
                <Check
                  className={cn("mt-1 size-4 shrink-0", p.dark ? "text-brass" : "text-forest")}
                />
                <span>{li}</span>
              </li>
            ))}
          </ul>
          <div
            className={cn(
              "mt-6 space-y-3 border-t pt-5 text-[0.95rem] leading-relaxed",
              p.dark ? "border-ivory/15 text-ivory/75" : "border-border text-ink/75",
            )}
          >
            {p.text.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
