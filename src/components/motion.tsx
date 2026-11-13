import { useEffect, useRef, useState, type ReactNode } from "react";
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
  const Tag = motion[as];
  const trigger = animateOnMount
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <Tag className={className} {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn("block", lineClassName)}
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration: 1.1, ease: EASE, delay: delay + i * 0.12 } },
            }}
          >
            {line}
          </motion.span>
        </span>
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
