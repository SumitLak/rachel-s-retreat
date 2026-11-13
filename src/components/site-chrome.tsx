import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Heart, Mail, Phone } from "lucide-react";
import { useSavedRetreats } from "@/lib/saved-retreats";
import { cn } from "@/lib/utils";
import { contact, countries, venues } from "@/data/site";
import { EASE, getLenis } from "@/components/motion";

// Primary navigation, as agreed with Daniel (matches the original site).
const nav = [
  { to: "/venues", label: "Our venues", image: "/images/villa-senesi.webp" },
  { to: "/host", label: "Host a retreat", image: "/images/studio.webp" },
  { to: "/retreats", label: "Find a retreat", image: "/images/stirling-castle.webp" },
  { to: "/how-we-help", label: "How we help", image: "/images/food-gnocchi.webp" },
  { to: "/guides", label: "Guides & FAQs", image: "/images/buchlyvie-lodges.webp" },
] as const;

// Extra pages shown in the full-screen menu and footer only.
const moreNav = [
  { to: "/discover-scotland", label: "Discover Scotland", image: "/images/kelpies.webp" },
] as const;

function Logo({ light }: { light: boolean }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Rachel's Retreats home">
      <span
        className={cn(
          "grid size-16 shrink-0 place-items-center transition-colors duration-500 md:size-20",
          light ? "bg-transparent" : "bg-forest",
        )}
      >
        <img src="/images/brand.png" alt="" className="size-[3.6rem] md:size-[4.5rem]" />
      </span>
      <span className="whitespace-nowrap leading-none">
        <span className="block font-display text-2xl tracking-tight">Rachel's Retreats</span>
        <span className="eyebrow mt-1 block text-[0.55rem] opacity-70">by Rachel's Farm</span>
      </span>
    </Link>
  );
}

/** Header link to the anonymous shortlist, with a live count. */
function SavedLink() {
  const { saved, ready } = useSavedRetreats();
  const count = ready ? saved.length : 0;
  return (
    <Link
      to="/saved"
      aria-label={count ? `Saved retreats (${count})` : "Saved retreats"}
      title="Saved retreats"
      className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-current/10"
    >
      <Heart className={cn("size-5", count > 0 && "fill-current")} />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-brass px-1 text-[0.6rem] font-semibold leading-5 text-ink">
          {count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string>(nav[0].image);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > 80);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const forceSolid = pathname === "/plan";
  const isSolid = solid || forceSolid;
  const light = !isSolid || open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          isSolid && !open
            ? "bg-ivory/90 text-ink shadow-[0_1px_0_0_var(--color-border)] backdrop-blur-md"
            : "bg-gradient-to-b from-ink/50 to-transparent text-ivory",
        )}
      >
        <div className="container-luxe flex h-20 items-center justify-between gap-6 md:h-24">
          <Logo light={light} />
          <nav
            className="hidden items-center gap-6 whitespace-nowrap xl:flex 2xl:gap-8"
            aria-label="Main"
          >
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="link-draw pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
                activeProps={{ className: "bg-[length:100%_1px]!" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <SavedLink />
            <Link
              to="/plan"
              className={cn(
                "hidden px-6 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-200 sm:inline-flex",
                light ? "bg-ivory text-ink hover:bg-brass" : "bg-forest text-ivory hover:bg-ink",
              )}
            >
              Plan your retreat
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="group relative grid size-12 place-items-center"
            >
              <span
                className={cn(
                  "absolute h-px w-7 bg-current transition-transform duration-300 ease-out",
                  open ? "rotate-45" : "-translate-y-1.5 group-hover:w-8",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-7 bg-current transition-transform duration-300 ease-out",
                  open ? "-rotate-45" : "translate-y-1.5 group-hover:w-5",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 overflow-y-auto bg-forest text-ivory"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="container-luxe grid min-h-full gap-12 pb-12 pt-32 lg:grid-cols-[1.2fr_1fr] lg:pt-36">
              <div className="flex flex-col justify-between gap-12">
                <ul className="space-y-1">
                  {[
                    { to: "/", label: "Home", image: "/images/buchlyvie.webp" } as const,
                    ...nav,
                  ].map((item, i) => (
                    <li key={item.to} className="overflow-hidden">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.06 }}
                      >
                        <Link
                          to={item.to}
                          onMouseEnter={() => setPreview(item.image)}
                          onFocus={() => setPreview(item.image)}
                          className="group flex items-baseline gap-5 py-1 font-display text-5xl text-ivory/70 transition-colors hover:text-ivory md:text-6xl"
                        >
                          <span className="eyebrow text-[0.6rem] text-brass">0{i + 1}</span>
                          <span className="transition-transform duration-500 ease-out group-hover:translate-x-3 group-hover:italic">
                            {item.label}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="grid gap-8 border-t border-ivory/15 pt-8 text-sm sm:grid-cols-2"
                >
                  <div>
                    <p className="eyebrow mb-3 text-brass">Speak to the team</p>
                    <a href={`mailto:${contact.email}`} className="link-draw block pb-1">
                      {contact.email}
                    </a>
                    <a href={contact.phoneHref} className="link-draw mt-1 inline-block pb-1">
                      {contact.phone}
                    </a>
                  </div>
                  <div>
                    <p className="eyebrow mb-3 text-brass">Destinations</p>
                    <p className="text-ivory/70">{countries.join(" · ")}</p>
                  </div>
                </motion.div>
              </div>
              <div className="relative hidden overflow-hidden lg:block">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={preview}
                    src={preview}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                  />
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-ivory/80">
      <div className="container-luxe grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="text-ivory">
            <Logo light />
          </div>
          <p className="mt-6 leading-relaxed">
            Private venues and personal hospitality across Scotland, England, Ireland, Italy and
            France. From the team behind{" "}
            <a href={contact.farmUrl} className="link-draw text-ivory" rel="noopener">
              Rachel's Farm
            </a>
            .
          </p>
        </div>
        <div>
          <p className="eyebrow mb-5 text-brass">Explore</p>
          <ul className="space-y-3 text-sm">
            {[...nav, ...moreNav].map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-draw pb-0.5 hover:text-ivory">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/plan" className="link-draw pb-0.5 hover:text-ivory">
                Plan your retreat
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5 text-brass">The collection</p>
          <ul className="space-y-3 text-sm">
            {venues.map((v) => (
              <li key={v.slug}>
                <Link
                  to="/venues/$slug"
                  params={{ slug: v.slug }}
                  className="link-draw pb-0.5 hover:text-ivory"
                >
                  {v.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5 text-brass">Contact</p>
          <ul className="space-y-4 text-sm">
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 hover:text-ivory"
              >
                <Mail className="size-4 text-brass" /> {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.phoneHref} className="flex items-center gap-3 hover:text-ivory">
                <Phone className="size-4 text-brass" /> {contact.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-luxe flex flex-col justify-between gap-3 py-6 text-xs text-ivory/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Rachel's Retreats. All rights reserved.</p>
          <p>Group sizes and availability are confirmed by the Rachel's Retreats team.</p>
        </div>
      </div>
    </footer>
  );
}
