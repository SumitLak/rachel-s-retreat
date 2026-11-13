import { useId, useState, type ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { motion } from "motion/react";
import { venues } from "@/data/site";
import { cn } from "@/lib/utils";
import { EASE, Reveal, SplitLines, ParallaxImage } from "@/components/motion";

type Variant = "solid" | "light" | "outline" | "outline-light" | "text";

const variants: Record<Variant, string> = {
  solid: "bg-forest text-ivory hover:bg-ink",
  light: "bg-ivory text-ink hover:bg-brass",
  outline: "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
  "outline-light": "border border-ivory/50 text-ivory hover:bg-ivory hover:text-ink",
  text: "px-0! text-current",
};

const base =
  "group inline-flex items-center justify-center gap-3 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-all duration-200 ease-out";

export function ButtonLink({
  variant = "solid",
  className,
  children,
  arrow = true,
  ...props
}: LinkProps & { variant?: Variant; className?: string; children: ReactNode; arrow?: boolean }) {
  return (
    <Link {...props} className={cn(base, variants[variant], className)}>
      <span className={variant === "text" ? "link-draw pb-1" : undefined}>{children}</span>
      {arrow && (
        <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
      )}
    </Link>
  );
}

export function ButtonA({
  variant = "solid",
  className,
  children,
  href,
  arrow = false,
}: {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  href: string;
  arrow?: boolean;
}) {
  return (
    <a href={href} className={cn(base, variants[variant], className)}>
      <span>{children}</span>
      {arrow && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
    </a>
  );
}

export function SectionHeading({
  eyebrow,
  lines,
  intro,
  className,
  light = false,
  align = "left",
  split = false,
}: {
  eyebrow: string;
  lines: ReactNode[];
  intro?: ReactNode;
  className?: string;
  light?: boolean;
  align?: "left" | "center";
  /** Full-width: heading left, intro right (lg+), so no empty right side. */
  split?: boolean;
}) {
  if (split) {
    return (
      <div className={cn("grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16", className)}>
        <SectionHeading eyebrow={eyebrow} lines={lines} light={light} />
        {intro && (
          <Reveal delay={0.2}>
            <div
              className={cn(
                "max-w-xl text-lg leading-relaxed lg:pb-3",
                light ? "text-ivory/80" : "text-muted-foreground",
              )}
            >
              {intro}
            </div>
          </Reveal>
        )}
      </div>
    );
  }
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <Reveal>
        <p
          className={cn(
            "eyebrow mb-6 flex items-center gap-4",
            light ? "text-brass" : "text-forest",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-10 bg-current" aria-hidden />
          {eyebrow}
        </p>
      </Reveal>
      <SplitLines
        lines={lines}
        className={cn("text-5xl md:text-6xl lg:text-7xl", light ? "text-ivory" : "text-ink")}
      />
      {intro && (
        <Reveal delay={0.2}>
          <div
            className={cn(
              "mt-8 text-lg leading-relaxed",
              light ? "text-ivory/80" : "text-muted-foreground",
            )}
          >
            {intro}
          </div>
        </Reveal>
      )}
    </div>
  );
}

/** Full-bleed photographic page header used on interior pages. */
export function PageHero({
  eyebrow,
  lines,
  intro,
  image,
  alt,
  children,
  compact = false,
}: {
  eyebrow: string;
  lines: ReactNode[];
  intro?: ReactNode;
  image: string;
  alt: string;
  children?: ReactNode;
  /** Shorter hero for content-heavy pages, so what follows is visible sooner. */
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "grain relative flex items-end overflow-hidden bg-ink text-ivory",
        compact ? "min-h-[68svh]" : "min-h-[88svh]",
      )}
    >
      <ParallaxImage src={image} alt={alt} className="absolute inset-0" strength={8} priority />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
      <div className="container-luxe relative z-10 pb-20 pt-40 md:pb-28">
        <Reveal>
          <p className="eyebrow mb-6 flex items-center gap-4 text-ivory [text-shadow:0_1px_10px_rgb(0_0_0_/0.55)]">
            <span className="h-px w-10 bg-current" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <SplitLines
          as="h1"
          animateOnMount
          lines={lines}
          className="max-w-5xl text-[clamp(2.75rem,min(8vw,9.5vh),6rem)]"
        />
        {intro && (
          <Reveal delay={0.35}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory/80">{intro}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.5}>{children}</Reveal>}
      </div>
    </section>
  );
}

/** Closing cinematic invitation used at the foot of every page. */
export function ClosingCTA({
  eyebrow = "Let's make it happen",
  lines = [
    "Tell us about",
    <em key="r" className="text-brass">
      your retreat.
    </em>,
  ],
  body = "A favourite place, a programme you love, or the beginnings of a plan. Share what you know and our Retreat Partnership Team will come back to you personally with venue ideas and the next step. No booking is made at this stage.",
  image = "/images/buchlyvie.webp",
}: {
  eyebrow?: string;
  lines?: ReactNode[];
  body?: ReactNode;
  image?: string;
}) {
  return (
    <section className="grain relative overflow-hidden bg-ink py-24 text-ivory md:py-32">
      <ParallaxImage src={image} alt="" className="absolute inset-0 opacity-55" strength={14} />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/20" />
      <div className="container-luxe relative z-10">
        <SectionHeading eyebrow={eyebrow} lines={lines} light intro={body} />
        <Reveal delay={0.3} className="mt-12 flex flex-wrap gap-4">
          <ButtonLink to="/plan" variant="light">
            Start planning
          </ButtonLink>
          <ButtonA href="mailto:reservations@rachelsfarm.com" variant="outline-light">
            Email the team
          </ButtonA>
        </Reveal>
      </div>
    </section>
  );
}

/** Accordion row. The answer stays in the HTML when closed, so it is crawlable. */
export function FaqItem({
  q,
  children,
  defaultOpen = false,
}: {
  q: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-border">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-2xl leading-snug md:text-3xl"
        >
          {q}
          <Plus
            className={cn("size-5 shrink-0 transition-transform duration-300", open && "rotate-45")}
          />
        </button>
      </h3>
      <motion.div
        id={id}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="overflow-hidden"
      >
        <div className="max-w-3xl pb-7 leading-relaxed text-muted-foreground">{children}</div>
      </motion.div>
    </div>
  );
}

const venueNamePatterns = venues
  .map((v) => ({ slug: v.slug, name: v.name.replace(/'/g, "’") }))
  .concat([
    { slug: "glenalmond", name: "Glenalmond" },
    { slug: "buchlyvie", name: "Buchlyvie" },
  ]);

/**
 * Pure helper: for a list of paragraphs, find the first mention of each venue
 * (skipping `exclude`) and return each paragraph as text/link segments.
 * Computed in one pass with no shared mutable state, so server and client
 * render identically.
 */
export function linkVenueMentions(
  paragraphs: string[],
  exclude: string[] = [],
): ({ text: string } | { slug: string; name: string })[][] {
  const used = new Set(exclude);
  return paragraphs.map((text) => {
    const segs: ({ text: string } | { slug: string; name: string })[] = [];
    let rest = text;
    for (;;) {
      let best: { idx: number; slug: string; name: string } | null = null;
      for (const p of venueNamePatterns) {
        if (used.has(p.slug)) continue;
        const idx = rest.indexOf(p.name);
        if (
          idx >= 0 &&
          (best === null ||
            idx < best.idx ||
            (idx === best.idx && p.name.length > best.name.length))
        )
          best = { idx, ...p };
      }
      if (!best) break;
      segs.push({ text: rest.slice(0, best.idx) }, { slug: best.slug, name: best.name });
      used.add(best.slug);
      rest = rest.slice(best.idx + best.name.length);
    }
    segs.push({ text: rest });
    return segs;
  });
}

function Segments({ segs }: { segs: ({ text: string } | { slug: string; name: string })[] }) {
  return (
    <>
      {segs.map((seg, i) =>
        "slug" in seg ? (
          <Link
            key={i}
            to="/venues/$slug"
            params={{ slug: seg.slug }}
            className="font-semibold text-forest underline decoration-brass/50 underline-offset-4 transition-colors hover:decoration-forest"
          >
            {seg.name}
          </Link>
        ) : (
          seg.text
        ),
      )}
    </>
  );
}

/** One paragraph with the first mention of each venue linked. */
export function LinkedText({ text }: { text: string }) {
  return <Segments segs={linkVenueMentions([text])[0] ?? []} />;
}

/** Several paragraphs; each venue is linked once across the whole group. */
export function LinkedParagraphs({
  paragraphs,
  exclude,
  className,
}: {
  paragraphs: string[];
  exclude?: string[];
  className?: string;
}) {
  const linked = linkVenueMentions(paragraphs, exclude);
  return (
    <>
      {linked.map((segs, i) => (
        <p key={i} className={className}>
          <Segments segs={segs} />
        </p>
      ))}
    </>
  );
}
