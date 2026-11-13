import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const ease = [0.22, 1, 0.36, 1] as const;

export function StepHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <div className="mb-10">
      <p className="eyebrow mb-4 text-[0.62rem] text-forest">{eyebrow}</p>
      <h2 className="text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.02]">{title}</h2>
      {intro && <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}

export function Label({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <p className="eyebrow mb-4 text-[0.6rem] text-ink/70">
      {children}
      {optional && (
        <span className="ml-2 normal-case tracking-normal text-muted-foreground">(optional)</span>
      )}
    </p>
  );
}

/** Large selectable photo card with zoom + border highlight on select. */
export function ImageCard({
  selected,
  onClick,
  image,
  title,
  subtitle,
  multi = false,
  compact = false,
}: {
  selected: boolean;
  onClick: () => void;
  image: string;
  title: string;
  subtitle?: string | undefined;
  multi?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden text-left outline-offset-4 transition-shadow duration-[250ms]",
        compact ? "aspect-[4/3]" : "aspect-[4/5] sm:aspect-[3/4]",
        selected
          ? "shadow-[0_0_0_2px_var(--color-brass)]"
          : "shadow-[0_0_0_1px_var(--color-border)]",
      )}
    >
      <img
        src={image}
        alt=""
        loading="lazy"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-[var(--ease-luxe)]",
          selected ? "scale-[1.06]" : "group-hover:scale-[1.03]",
        )}
      />
      <span
        className={cn(
          "absolute inset-0 bg-gradient-to-t transition-opacity duration-300",
          selected
            ? "from-forest/90 via-forest/40 to-transparent"
            : "from-ink/80 via-ink/20 to-transparent",
        )}
      />
      <span className="absolute inset-x-0 bottom-0 p-4 text-ivory">
        <span className="block font-display text-xl leading-tight md:text-2xl">{title}</span>
        {subtitle && <span className="mt-1 block text-xs text-ivory/75">{subtitle}</span>}
      </span>
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-brass text-ink"
          >
            <Check className="size-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function Pill({
  active,
  onClick,
  children,
  multi = false,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "border px-4 py-2.5 text-sm transition-all duration-[250ms]",
        active ? "border-forest bg-forest text-ivory" : "border-border bg-card hover:border-ink/40",
      )}
    >
      {children}
    </button>
  );
}

export function PillGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {children}
    </div>
  );
}

export const inputCls =
  "w-full border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-ink/35 focus:border-forest";

/** Number that rolls when it changes. */
export function RollingNumber({ value }: { value: number | string }) {
  return (
    <span className="relative inline-flex overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "-60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "60%", opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
