import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, CircleCheck, Plus, Receipt, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion";
import { inclusions, services, team, thought } from "@/data/help-content";

function useTabKeys(count: number, setActive: (i: number) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const map: Record<string, number> = {
      ArrowRight: (i + 1) % count,
      ArrowDown: (i + 1) % count,
      ArrowLeft: (i - 1 + count) % count,
      ArrowUp: (i - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };
  return { refs, onKeyDown };
}

/* ------------------------------------------------------------------ */
/* Signature: hotspots over a genuine photograph                       */
/* Desktop: hotspots + side panel. Mobile: labelled controls under the */
/* image. Every panel's text is in the HTML; inactive ones are hidden. */
/* ------------------------------------------------------------------ */
export function HospitalityExplorer() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const spots = thought.hotspots;
  const spot = spots[active] ?? spots[0]!;
  const { refs, onKeyDown } = useTabKeys(spots.length, setActive);
  const baseId = useId();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-stone">
        <img
          src="/images/buchlyvie.webp"
          alt="Rachel’s Farm Buchlyvie: the main house, grounds and countryside"
          loading="lazy"
          className="aspect-[16/9] w-full object-cover lg:aspect-[4/3]"
        />
        <div className="absolute inset-0 bg-ink/15" />
        {/* Hotspots (desktop and tablet) */}
        {spots.map((s, i) => (
          <button
            key={s.key}
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => setActive(i)}
            className="group absolute hidden -translate-x-1/2 -translate-y-1/2 md:block"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <span className="relative grid size-10 place-items-center">
              {i === active && !reduce && (
                <motion.span
                  key={`pulse-${i}`}
                  className="absolute inset-0 rounded-full bg-ivory/60"
                  initial={{ scale: 0.6, opacity: 0.8 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.4, repeat: 2, ease: "easeOut" }}
                />
              )}
              <span
                className={cn(
                  "relative grid size-9 place-items-center rounded-full font-display text-sm shadow-lg transition-colors duration-[250ms]",
                  i === active
                    ? "bg-forest text-ivory ring-2 ring-ivory"
                    : "bg-ivory/95 text-forest hover:bg-ivory",
                )}
              >
                {i + 1}
              </span>
            </span>
            <span
              className={cn(
                "absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs shadow transition-opacity",
                i === active
                  ? "bg-forest text-ivory opacity-100"
                  : "bg-ivory/95 text-ink opacity-0 group-hover:opacity-100",
              )}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        <p className="eyebrow text-[0.6rem] text-forest">Explore the details</p>
        <div
          role="tablist"
          aria-label="Hospitality details"
          aria-orientation="vertical"
          className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1"
        >
          {spots.map((s, i) => (
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
              className={cn(
                "relative flex items-center gap-3 rounded-full px-4 py-3 text-left text-sm transition-colors",
                i === active
                  ? "text-ivory"
                  : "bg-card text-ink/75 shadow-[0_0_0_1px_var(--color-border)] hover:text-ink",
              )}
            >
              {i === active && (
                <motion.span
                  layoutId={`${baseId}-pill`}
                  className="absolute inset-0 rounded-full bg-forest"
                  transition={{ duration: 0.3, ease: EASE }}
                />
              )}
              <span className="relative font-display">{i + 1}</span>
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>
        {spots.map((s, i) => (
          <div
            key={s.key}
            id={`${baseId}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${i}`}
            hidden={i !== active}
            className="mt-6"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={spot.key}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <h3 className="text-3xl leading-tight md:text-4xl">{s.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-ink/80">{s.body}</p>
                <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-forest" /> {s.note}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Team cards with expandable detail                                   */
/* ------------------------------------------------------------------ */
export function TeamCards() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {team.roles.map((r, i) => {
        const isOpen = open === i;
        const id = `team-more-${i}`;
        return (
          <motion.li
            key={r.title}
            className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-card shadow-[0_0_0_1px_var(--color-border)]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={r.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-2xl leading-tight">{r.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/80">{r.intro}</p>
              <motion.div
                id={id}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="overflow-hidden"
              >
                <p className="pt-3 text-[0.95rem] leading-relaxed text-ink/70">{r.more}</p>
              </motion.div>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={id}
                className="mt-auto inline-flex items-center gap-2 self-start pt-5 text-sm font-semibold text-forest"
              >
                <Plus
                  className={cn("size-4 transition-transform duration-300", isOpen && "rotate-45")}
                />
                {isOpen
                  ? "Show less"
                  : `Meet the ${r.title.replace(/^Retreat /, "").toLowerCase()}`}
              </button>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Service explorer                                                    */
/* ------------------------------------------------------------------ */
export function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const items = services.items;
  const current = items[active] ?? items[0]!;
  const { refs, onKeyDown } = useTabKeys(items.length, setActive);
  const baseId = useId();

  return (
    <div>
      <div
        role="tablist"
        aria-label="Hospitality services"
        className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]"
      >
        {items.map((s, i) => (
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
            className={cn(
              "relative shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors",
              i === active
                ? "text-ivory"
                : "bg-card text-ink/75 shadow-[0_0_0_1px_var(--color-border)] hover:text-ink",
            )}
          >
            {i === active && (
              <motion.span
                layoutId={`${baseId}-pill`}
                className="absolute inset-0 rounded-full bg-forest"
                transition={{ duration: 0.35, ease: EASE }}
              />
            )}
            <span className="relative">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[45fr_55fr] lg:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-stone lg:sticky lg:top-28 lg:self-start">
          <AnimatePresence initial={false}>
            <motion.img
              key={current.image}
              src={current.image}
              alt={current.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              initial={reduce ? false : { opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </AnimatePresence>
        </div>
        <div>
          {items.map((s, i) => (
            <div
              key={s.key}
              id={`${baseId}-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${i}`}
              hidden={i !== active}
            >
              {s.h2 ? (
                <>
                  <h2 className="text-[clamp(2rem,3.4vw,3rem)] leading-tight">{s.h2}</h2>
                  {s.h3 && (
                    <h3 className="mt-2 font-display text-2xl italic text-forest">{s.h3}</h3>
                  )}
                </>
              ) : (
                <h3 className="text-[clamp(2rem,3.4vw,3rem)] leading-tight">{s.label}</h3>
              )}
              <div className="mt-5 space-y-3">
                {s.body.map((p) => (
                  <p key={p} className="leading-relaxed text-ink/80">
                    {p}
                  </p>
                ))}
              </div>
              <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Sparkles, k: "What the team coordinates", v: s.coordinates },
                  { icon: Check, k: "What must be confirmed", v: s.confirm },
                  { icon: Receipt, k: "Charges", v: s.charges },
                ].map((x, k) => (
                  <motion.div
                    key={x.k}
                    className="rounded-[1.25rem] bg-card p-4 shadow-[0_0_0_1px_var(--color-border)]"
                    initial={reduce || i !== active ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.1 + k * 0.06 }}
                  >
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-forest">
                      <x.icon className="size-3.5" /> {x.k}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink/80">{x.v}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* What's included: two expandable panels                              */
/* ------------------------------------------------------------------ */
export function InclusionPanels() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {inclusions.map((panel, i) => (
        <details
          key={panel.title}
          open
          className="group rounded-[1.5rem] bg-card p-7 shadow-[0_0_0_1px_var(--color-border)] md:p-8"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <span className="font-display text-3xl">{panel.title}</span>
            <Plus className="size-5 shrink-0 rotate-45 transition-transform group-[:not([open])]:rotate-0" />
          </summary>
          <dl className="mt-5 divide-y divide-border">
            {panel.rows.map((r) => (
              <div key={r.k} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="font-semibold">{r.k}</dt>
                <dd className="text-sm leading-relaxed text-ink/75">{r.v}</dd>
              </div>
            ))}
          </dl>
          {i === 1 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Your proposal itemises the services being arranged and their costs.
            </p>
          )}
        </details>
      ))}
    </div>
  );
}
