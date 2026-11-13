import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring, useInView } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { countryOutlines } from "@/data/country-outlines";
import { EASE, Reveal, SplitLines } from "@/components/motion";
import { ButtonLink } from "@/components/ui-luxe";
import { experiences, heroSlides, type GalleryImage, type Retreat, type Venue } from "@/data/site";

const SLIDE_MS = 7000;

/* ------------------------------------------------------------------ */
/* Cinematic hero: crossfading Ken Burns slides with visible controls  */
/* ------------------------------------------------------------------ */
export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = heroSlides[index] ?? heroSlides[0]!;

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % heroSlides.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index, paused]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  return (
    <section
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-ivory"
      aria-roledescription="carousel"
      aria-label="Featured venues"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.image}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <img
            src={slide.image}
            alt={`${slide.label}, ${slide.place}`}
            className={cn("h-full w-full object-cover", !paused && "animate-kenburns")}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/45" />

      <div className="container-luxe relative z-10 flex flex-1 flex-col justify-end pb-32 pt-32 md:pb-36 md:pt-36">
        <p
          className="animate-fade-up eyebrow mb-8 flex items-center gap-4 text-ivory [text-shadow:0_1px_10px_rgb(0_0_0_/0.55)]"
          style={{ animationDelay: "200ms" }}
        >
          <span className="h-px w-10 bg-current" aria-hidden />
          Private venues · Personal hospitality
        </p>
        <SplitLines
          as="h1"
          animateOnMount
          delay={0.35}
          className="max-w-5xl text-[clamp(2.75rem,min(9vw,10.5vh),8.5rem)] leading-[0.95]"
          lines={[
            "Bring your people.",
            <em key="w" className="font-light">
              We'll take care
            </em>,
            "of the rest.",
          ]}
        />
        <div
          className="animate-fade-up mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          style={{ animationDelay: "900ms" }}
        >
          <div>
            <p className="max-w-md text-lg leading-relaxed text-ivory/85">
              Places worth travelling for. Food worth gathering around. Retreats shaped around the
              people you bring.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/host" variant="light">
                Host a retreat
              </ButtonLink>
              <ButtonLink to="/venues" variant="outline-light">
                Explore venues
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-ivory/15 bg-ink/20 backdrop-blur-sm">
        <div className="container-luxe flex items-center gap-6 py-5">
          <Link
            to="/venues/$slug"
            params={{ slug: slide.slug }}
            className="group hidden min-w-56 items-center gap-3 md:flex"
            aria-live="polite"
          >
            <span className="text-xs tabular-nums text-ivory/60">
              {String(index + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
            </span>
            <span>
              <span className="block font-display text-xl">{slide.label}</span>
              <span className="eyebrow text-[0.55rem] text-ivory/60">{slide.place}</span>
            </span>
            <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <div className="flex flex-1 gap-2">
            {heroSlides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${s.label}`}
                aria-current={i === index}
                className="group relative h-6 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-px bg-ivory/25 transition-colors group-hover:bg-ivory/50" />
                <span
                  key={`${i}-${index}`}
                  className={cn(
                    "absolute inset-x-0 top-1/2 h-px origin-left bg-ivory",
                    i < index && "scale-x-100",
                    i > index && "scale-x-0",
                  )}
                  style={
                    i === index
                      ? {
                          animation: `progress ${SLIDE_MS}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="grid size-10 place-items-center rounded-full border border-ivory/30 transition-colors hover:bg-ivory hover:text-ink"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Static destinations strip                                           */
/* ------------------------------------------------------------------ */
export function DestinationStrip({ items }: { items: string[] }) {
  return (
    <div className="border-b border-border bg-stone py-4 md:py-5">
      <ul
        className="container-luxe flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:gap-x-10"
        aria-label="Destinations"
      >
        {items.map((t, i) => (
          <li key={t} className="flex items-center gap-5 md:gap-10">
            {i > 0 && <span className="size-1.5 rotate-45 bg-brass" aria-hidden />}
            <span className="flex items-center gap-2.5">
              <svg viewBox="0 0 48 48" className="size-8 shrink-0 md:size-10" aria-hidden>
                <path
                  d={countryOutlines[t] ?? ""}
                  className="fill-forest/15 stroke-forest"
                  strokeWidth={1.2}
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-display text-2xl italic text-forest md:text-[2rem]">{t}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Venue card + editorial carousel                                     */
/* ------------------------------------------------------------------ */
export function VenueCard({
  venue,
  className,
  sizes = "tall",
}: {
  venue: Venue;
  className?: string;
  sizes?: "tall" | "wide";
}) {
  return (
    <Link
      to="/venues/$slug"
      params={{ slug: venue.slug }}
      className={cn("group block", className)}
      draggable={false}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-stone",
          sizes === "tall" ? "aspect-[4/5]" : "aspect-[4/3]",
        )}
      >
        <img
          src={venue.image}
          alt={venue.name}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="eyebrow absolute left-5 top-5 bg-ivory/90 px-3 py-2 text-[0.58rem] text-ink backdrop-blur">
          {venue.country}
        </span>
        {venue.comingSoon && (
          <span className="eyebrow absolute right-5 top-5 bg-brass px-3 py-2 text-[0.58rem] text-ink">
            Coming soon
          </span>
        )}
        <span className="eyebrow absolute bottom-5 left-5 flex translate-y-3 items-center gap-2 text-[0.62rem] text-ivory opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Explore venue <ArrowRight className="size-3.5" />
        </span>
      </div>
      <div className="pt-5">
        <p className="eyebrow text-[0.6rem] text-muted-foreground">{venue.location}</p>
        <h3 className="mt-2 text-3xl transition-colors group-hover:text-forest md:text-4xl">
          {venue.name}
        </h3>
        <p className="mt-1 font-display text-lg italic text-muted-foreground">{venue.tagline}</p>
        <p className="mt-3 text-sm text-ink/80">{venue.capacity}</p>
      </div>
    </Link>
  );
}

export function useEmblaNav(options: Parameters<typeof useEmblaCarousel>[0]) {
  const [ref, api] = useEmblaCarousel(options);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState(0);
  const update = useCallback(() => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
    setSelected(api.selectedScrollSnap());
    setProgress(Math.max(0, Math.min(1, api.scrollProgress())));
  }, [api]);
  useEffect(() => {
    if (!api) return;
    update();
    api.on("select", update).on("reInit", update).on("scroll", update);
    return () => {
      api.off("select", update).off("reInit", update).off("scroll", update);
    };
  }, [api, update]);
  return { ref, api, canPrev, canNext, progress, selected };
}

export function ArrowButtons({
  onPrev,
  onNext,
  canPrev,
  canNext,
  light = false,
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  light?: boolean;
}) {
  const cls = cn(
    "grid size-14 place-items-center rounded-full border transition-all duration-200 disabled:opacity-30",
    light
      ? "border-ivory/40 text-ivory enabled:hover:bg-ivory enabled:hover:text-ink"
      : "border-ink/25 enabled:hover:bg-ink enabled:hover:text-ivory",
  );
  return (
    <div className="flex gap-3">
      <button
        type="button"
        className={cls}
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous"
      >
        <ArrowLeft className="size-5" />
      </button>
      <button type="button" className={cls} onClick={onNext} disabled={!canNext} aria-label="Next">
        <ArrowRight className="size-5" />
      </button>
    </div>
  );
}

export function VenueCarousel({ venues, header }: { venues: Venue[]; header?: ReactNode }) {
  const { ref, api, canPrev, canNext, progress } = useEmblaNav({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  return (
    <div>
      <div className="container-luxe flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        {header}
        <div className="hidden md:block">
          <ArrowButtons
            onPrev={() => api?.scrollPrev()}
            onNext={() => api?.scrollNext()}
            canPrev={canPrev}
            canNext={canNext}
          />
        </div>
      </div>
      <Reveal className="mt-10">
        <div className="cursor-grab overflow-hidden active:cursor-grabbing" ref={ref}>
          <div className="flex gap-6 pl-5 md:pl-10 xl:pl-[max(3rem,calc((100vw-104rem)/2+3rem))]">
            {venues.map((v) => (
              <div key={v.slug} className="w-[82vw] shrink-0 sm:w-[52vw] lg:w-[36vw] xl:w-[32rem]">
                <VenueCard venue={v} />
              </div>
            ))}
            <div className="w-5 shrink-0 md:w-10" aria-hidden />
          </div>
        </div>
      </Reveal>
      <div className="container-luxe mt-12 flex items-center gap-6">
        <div className="relative h-px flex-1 bg-border">
          <div
            className="absolute inset-y-0 left-0 w-full origin-left bg-ink transition-transform duration-150"
            style={{ transform: `scaleX(${0.12 + progress * 0.88})` }}
          />
        </div>
        <ButtonLink to="/venues" variant="text" className="py-0">
          View all venues
        </ButtonLink>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll-driven story: sticky image changes as each step scrolls in   */
/* ------------------------------------------------------------------ */
function StoryStep({
  step,
  index,
  onActive,
  active,
}: {
  step: { n: string; title: string; body: string; image: string };
  index: number;
  onActive: (i: number) => void;
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  return (
    <div ref={ref} className="flex items-center py-6 lg:min-h-[52vh] lg:py-8">
      <div
        className={cn("transition-opacity duration-700", active ? "opacity-100" : "lg:opacity-30")}
      >
        <img
          src={step.image}
          alt=""
          className="mb-8 aspect-[4/3] w-full object-cover lg:hidden"
          loading="lazy"
        />
        <p className="font-display text-7xl italic text-brass md:text-8xl">{step.n}</p>
        <h3 className="mt-4 text-4xl md:text-5xl">{step.title}</h3>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">{step.body}</p>
      </div>
    </div>
  );
}

export function ScrollStory({
  steps,
  header,
}: {
  steps: { n: string; title: string; body: string; image: string }[];
  header?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const current = steps[active] ?? steps[0]!;
  return (
    <div ref={ref} className="container-luxe grid gap-8 lg:grid-cols-2 lg:gap-16">
      <div className="relative hidden lg:block">
        <div className="sticky top-24 flex h-[calc(100svh-7rem)] items-center">
          <div className="relative h-full max-h-[46rem] w-full overflow-hidden bg-stone">
            <AnimatePresence initial={false}>
              <motion.img
                key={current.image}
                src={current.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: EASE }}
              />
            </AnimatePresence>
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 text-ivory">
              <span className="eyebrow text-[0.6rem]">
                Step {current.n} of {String(steps.length).padStart(2, "0")}
              </span>
              <span className="relative h-px flex-1 bg-ivory/30">
                <motion.span
                  className="absolute inset-0 origin-left bg-ivory"
                  style={{ scaleX: bar }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        {header && <div className="pb-4 lg:pt-10">{header}</div>}
        {steps.map((s, i) => (
          <StoryStep key={s.n} step={s} index={i} active={i === active} onActive={setActive} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Experience selector: tabs swap imagery and copy                     */
/* ------------------------------------------------------------------ */
export function ExperienceSelector({ header }: { header?: ReactNode }) {
  const [active, setActive] = useState(0);
  const exp = experiences[active] ?? experiences[0]!;
  return (
    <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div>
        {header && <div className="mb-10">{header}</div>}
        <div role="tablist" aria-label="Retreat types" className="border-t border-border">
          {experiences.map((e, i) => (
            <button
              key={e.id}
              role="tab"
              type="button"
              id={`exp-tab-${e.id}`}
              aria-selected={i === active}
              aria-controls="exp-panel"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className="group flex w-full items-baseline gap-6 border-b border-border py-6 text-left"
            >
              <span
                className={cn(
                  "eyebrow text-[0.6rem] transition-colors",
                  i === active ? "text-brass" : "text-muted-foreground",
                )}
              >
                0{i + 1}
              </span>
              <span
                className={cn(
                  "font-display text-3xl transition-all duration-500 md:text-4xl",
                  i === active
                    ? "translate-x-2 italic text-ink"
                    : "text-ink/45 group-hover:text-ink/80",
                )}
              >
                {e.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div id="exp-panel" role="tabpanel" aria-labelledby={`exp-tab-${exp.id}`}>
        <div className="relative aspect-[5/4] overflow-hidden bg-stone">
          <AnimatePresence initial={false}>
            <motion.img
              key={exp.image}
              src={exp.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end"
          >
            <div>
              <h3 className="text-4xl">{exp.title}</h3>
              <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">{exp.body}</p>
            </div>
            <ButtonLink to="/plan" search={{ type: exp.id }} variant="outline">
              Plan this
            </ButtonLink>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Upcoming retreat card                                               */
/* ------------------------------------------------------------------ */
export function RetreatCard({ retreat }: { retreat: Retreat }) {
  return (
    <article className="group grid overflow-hidden bg-card shadow-[0_1px_0_0_var(--color-border)] md:grid-cols-[0.9fr_1.1fr]">
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
        <img
          src={retreat.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-col p-8 md:p-10">
        <p className="eyebrow text-[0.6rem] text-forest">{retreat.type}</p>
        <p className="mt-4 text-sm tabular-nums text-muted-foreground">{retreat.dates}</p>
        <h3 className="mt-3 text-3xl md:text-4xl">{retreat.title}</h3>
        <p className="mt-2 font-display text-lg italic text-muted-foreground">{retreat.venue}</p>
        <p className="mt-5 leading-relaxed text-ink/80">{retreat.body}</p>
        <div className="mt-auto pt-8">
          <ButtonLink
            to="/retreats"
            search={{ retreat: retreat.id }}
            hash="enquire"
            variant="text"
            className="py-0"
          >
            Enquire
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Venue gallery: slider + thumbnails + fullscreen lightbox            */
/* ------------------------------------------------------------------ */
export function Gallery({ images, venueName }: { images: GalleryImage[]; venueName: string }) {
  const { ref, api, canPrev, canNext, selected } = useEmblaNav({ loop: true });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div>
      <div className="relative">
        <div className="overflow-hidden" ref={ref}>
          <div className="flex">
            {images.map((img, i) => (
              <div key={img.src} className="relative min-w-0 shrink-0 basis-full">
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  className="group relative block aspect-[16/10] w-full overflow-hidden bg-stone md:aspect-[16/8]"
                  aria-label={`Open ${img.caption} fullscreen`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-ivory/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                    <Expand className="size-4" />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/70 to-transparent p-5 text-ivory md:p-8">
          <p className="font-display text-xl italic md:text-2xl">
            {images[selected]?.caption}
            {images[selected]?.shared && (
              <span className="eyebrow ml-3 not-italic text-[0.55rem] text-ivory/70">
                Rachel's Retreats hospitality
              </span>
            )}
          </p>
          <div className="pointer-events-auto flex items-center gap-5">
            <span className="text-xs tabular-nums">
              {selected + 1} / {images.length}
            </span>
            <ArrowButtons
              light
              onPrev={() => api?.scrollPrev()}
              onNext={() => api?.scrollNext()}
              canPrev={canPrev}
              canNext={canNext}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2" data-lenis-prevent>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => api?.scrollTo(i)}
            aria-label={`Show image ${i + 1}: ${img.caption}`}
            aria-current={i === selected}
            className={cn(
              "relative h-20 w-28 shrink-0 overflow-hidden transition-opacity duration-300",
              i === selected
                ? "opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-ivory"
                : "opacity-50 hover:opacity-90",
            )}
          >
            <img src={img.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
      <Lightbox images={images} index={lightbox} onChange={setLightbox} title={venueName} />
    </div>
  );
}

function Lightbox({
  images,
  index,
  onChange,
  title,
}: {
  images: GalleryImage[];
  index: number | null;
  onChange: (i: number | null) => void;
  title: string;
}) {
  const open = index !== null;
  const go = useCallback(
    (d: number) => index !== null && onChange((index + d + images.length) % images.length),
    [index, images.length, onChange],
  );
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, go, onChange]);
  const img = index !== null ? images[index] : undefined;
  return (
    <AnimatePresence>
      {open && img && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
          className="fixed inset-0 z-[70] flex flex-col bg-ink/97 text-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          data-lenis-prevent
        >
          <div className="flex items-center justify-between p-5 md:p-8">
            <p className="eyebrow text-[0.6rem] text-ivory/70">
              {title} · {(index ?? 0) + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="grid size-12 place-items-center rounded-full border border-ivory/30 hover:bg-ivory hover:text-ink"
              aria-label="Close gallery"
              autoFocus
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 md:px-24">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className="max-h-[78vh] max-w-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-4 grid size-12 place-items-center rounded-full border border-ivory/30 hover:bg-ivory hover:text-ink md:left-8"
              aria-label="Previous image"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-4 grid size-12 place-items-center rounded-full border border-ivory/30 hover:bg-ivory hover:text-ink md:right-8"
              aria-label="Next image"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
          <p className="p-6 text-center font-display text-xl italic">{img.caption}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
