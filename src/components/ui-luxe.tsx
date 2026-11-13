import type { ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, SplitLines, ParallaxImage } from "@/components/motion";

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
}: {
  eyebrow: string;
  lines: ReactNode[];
  intro?: ReactNode;
  className?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <Reveal>
        <p className={cn("eyebrow mb-6 flex items-center gap-4", light ? "text-brass" : "text-forest", align === "center" && "justify-center")}>
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
          <div className={cn("mt-8 text-lg leading-relaxed", light ? "text-ivory/80" : "text-muted-foreground")}>
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
}: {
  eyebrow: string;
  lines: ReactNode[];
  intro?: ReactNode;
  image: string;
  alt: string;
  children?: ReactNode;
}) {
  return (
    <section className="grain relative flex min-h-[88svh] items-end overflow-hidden bg-ink text-ivory">
      <ParallaxImage src={image} alt={alt} className="absolute inset-0" strength={8} priority />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
      <div className="container-luxe relative z-10 pb-20 pt-40 md:pb-28">
        <Reveal>
          <p className="eyebrow mb-6 flex items-center gap-4 text-brass">
            <span className="h-px w-10 bg-current" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <SplitLines as="h1" animateOnMount lines={lines} className="max-w-5xl text-6xl md:text-7xl lg:text-8xl" />
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
  lines = ["Tell us about", <em key="r" className="text-brass">your retreat.</em>],
  body = "A favourite place, a programme you love, or the beginnings of a plan. Share what you know and our Retreat Partnership Team will come back to you personally with venue ideas and the next step. No booking is made at this stage.",
  image = "/images/buchlyvie.webp",
}: {
  eyebrow?: string;
  lines?: ReactNode[];
  body?: string;
  image?: string;
}) {
  return (
    <section className="grain relative overflow-hidden bg-ink py-36 text-ivory md:py-48">
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
