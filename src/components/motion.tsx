import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Lenis from "lenis";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + rise into view once. 16–24px travel per the motion spec. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Headline that reveals line by line from behind a mask. */
export function SplitLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  as = "h2",
  animateOnMount = false,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  animateOnMount?: boolean;
}) {
  // Above-the-fold headlines use a CSS animation so they appear immediately,
  // even before hydration or if JavaScript is slow/blocked.
  if (animateOnMount) {
    const Plain = as;
    return (
      <Plain className={className}>
        {lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="block overflow-hidden pb-[0.08em]">
              <span
                className={cn("animate-line-up block", lineClassName)}
                style={{ animationDelay: `${(delay + i * 0.12) * 1000}ms` }}
              >
                {line}
              </span>
            </span>
          </Fragment>
        ))}
      </Plain>
    );
  }
  const Tag = motion[as];
  const trigger = {
    initial: "hidden",
    whileInView: "show",
    viewport: { once: true, margin: "0px 0px -10% 0px" },
  };
  return (
    <Tag className={className} {...trigger}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className={cn("block", lineClassName)}
              variants={{
                hidden: { y: "110%" },
                show: {
                  y: "0%",
                  transition: { duration: 1.1, ease: EASE, delay: delay + i * 0.12 },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}

/** Image that drifts gently against the scroll inside a clipped frame. */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  strength = 10,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  strength?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={reduce ? {} : { y, scale: 1 + strength / 50 }}
        className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}

/**
 * Parallax that never zooms or crops sideways: the image is shown full-width at
 * its natural aspect ratio inside a frame `travel` shorter than it, and slides
 * through that spare height as the frame crosses the viewport. At mid-scroll the
 * centre (100 - travel)% of the image is visible.
 */
export function FullFrameParallax({
  src,
  alt,
  className,
  travel = 15,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  travel?: number;
  /** Intrinsic size, so the image keeps its aspect ratio before it loads. */
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `-${travel}%`]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
        style={reduce ? { y: `-${travel / 2}%` } : { y }}
        className="absolute inset-x-0 top-0 block h-auto w-full"
      />
    </div>
  );
}

/** Number that counts up when it scrolls into view. */
export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref}>
      {value.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Inertia scrolling for the whole document; off for reduced-motion users. */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisInstance = lenis;
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    lenisInstance?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}

/**
 * Editorial photograph that reveals through a soft mask (clip-path) while easing
 * from 1.04 to 1 scale. One restrained effect; static for reduced-motion users.
 */
export function RevealImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("relative overflow-hidden rounded-[1.5rem] bg-stone", className)}
      initial={reduce ? false : { clipPath: "inset(10% 6% 10% 6% round 1.5rem)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.5rem)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduce ? false : { scale: 1.04 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE }}
      />
    </motion.div>
  );
}

/** Thin brass rule that extends as it enters the viewport. */
export function AccentLine({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={cn("block h-px w-16 origin-left bg-brass", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
    />
  );
}
