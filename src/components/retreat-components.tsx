import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Heart,
  Loader2,
  Mail,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion";
import { contact, publicRetreats, retreatNights, type Retreat } from "@/data/site";
import { useSavedRetreats } from "@/lib/saved-retreats";
import { emailRetreat, guestEnquirySchema, submitGuestEnquiry } from "@/lib/forms";
import { track } from "@/lib/analytics";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const isUpcoming = (r: Retreat, today = new Date()) =>
  r.status === "published" && Date.parse(r.endDate) >= Date.parse(today.toISOString().slice(0, 10));

export const upcomingRetreats = () => publicRetreats.filter((r) => isUpcoming(r));

/* ------------------------------------------------------------------ */
/* Save                                                                */
/* ------------------------------------------------------------------ */
export function SaveButton({
  slug,
  title,
  variant = "icon",
  className,
}: {
  slug: string;
  title: string;
  variant?: "icon" | "text";
  className?: string;
}) {
  const { isSaved, toggle } = useSavedRetreats();
  const saved = isSaved(slug);
  const label = saved ? `Remove ${title} from saved retreats` : `Save ${title}`;
  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={saved}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm ring-1 ring-ink/20 transition-colors hover:bg-ink hover:text-ivory",
          className,
        )}
      >
        <Heart className={cn("size-4", saved && "fill-current text-[#b4544a]")} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={label}
      title={saved ? "Saved" : "Save to my retreats"}
      className={cn(
        "grid size-11 place-items-center rounded-full bg-ivory/90 text-ink shadow-sm backdrop-blur transition-transform hover:scale-105",
        className,
      )}
    >
      <motion.span
        key={String(saved)}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
      >
        <Heart className={cn("size-5", saved && "fill-current text-[#b4544a]")} />
      </motion.span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Email me this retreat                                               */
/* ------------------------------------------------------------------ */
export function EmailRetreatButton({
  retreat,
  className,
}: {
  retreat: Retreat;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm ring-1 ring-ink/20 transition-colors hover:bg-ink hover:text-ivory",
          className,
        )}
      >
        <Mail className="size-4" /> Email me this retreat
      </button>
      <EmailRetreatDialog retreat={retreat} open={open} onOpenChange={setOpen} />
    </>
  );
}

function EmailRetreatDialog({
  retreat,
  open,
  onOpenChange,
}: {
  retreat: Retreat;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [state, setState] = useState<"idle" | "sending" | "sent" | "handoff" | "error">("idle");
  const [error, setError] = useState("");

  const link =
    typeof window !== "undefined" ? `${window.location.origin}/retreats/${retreat.slug}` : "";
  const selfMailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
    `Retreat to look at later: ${retreat.title}`,
  )}&body=${encodeURIComponent(`${retreat.title}\n${retreat.dates}\n${retreat.venue}\nLed by ${retreat.organiser.name}\n\n${retreat.body}\n\n${link}`)}`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please add a valid email address.");
    setError("");
    setState("sending");
    try {
      const res = await emailRetreat({
        data: {
          retreatSlug: retreat.slug,
          email,
          marketingOptIn: optIn,
          website: honeypot,
          startedAt,
        },
      });
      if (res.ok) {
        setState("sent");
        track("retreat_emailed", { retreat: retreat.slug, opt_in: optIn });
      } else setState(res.reason === "not-configured" ? "handoff" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[1.5rem] bg-ivory p-8">
        <DialogTitle className="font-display text-3xl font-normal">
          Keep this experience close.
        </DialogTitle>
        <DialogDescription className="text-ink/75">
          We’ll send you a link to {retreat.title} so you can revisit the details whenever you like.
        </DialogDescription>
        {state === "sent" ? (
          <p className="mt-2 flex items-center gap-2 rounded-xl bg-stone p-4 text-sm">
            <Check className="size-4 text-forest" /> On its way. Check your inbox shortly.
          </p>
        ) : state === "handoff" ? (
          <div className="mt-2 rounded-xl bg-stone p-4 text-sm">
            <p>
              Email sending isn’t switched on yet. Open your email app to send yourself the details
              instead.
            </p>
            <a
              href={selfMailto}
              className="mt-3 inline-flex items-center gap-2 font-semibold text-forest underline"
            >
              <Mail className="size-4" /> Open in my email app
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-2 space-y-4">
            <label className="block">
              <span className="eyebrow text-[0.58rem] text-ink/70">Email address</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full border-0 border-b border-ink/25 bg-transparent px-0 py-2.5 outline-none focus:border-forest"
              />
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
                className="mt-0.5 size-4 accent-[var(--forest)]"
              />
              Also send me occasional updates about new retreats and experiences. (Optional)
            </label>
            <input
              tabIndex={-1}
              aria-hidden
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px]"
            />
            {(error || state === "error") && (
              <p role="alert" className="text-sm text-destructive">
                {error || "We couldn’t send that just now. Please try again."}
              </p>
            )}
            <button
              type="submit"
              disabled={state === "sending"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm text-ivory transition-colors hover:bg-ink disabled:opacity-60"
            >
              {state === "sending" && <Loader2 className="size-4 animate-spin" />}
              Email me this retreat
            </button>
            <p className="text-xs text-muted-foreground">
              This sends one email about this retreat. You won’t receive marketing unless you tick
              the box above.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Listing card                                                        */
/* ------------------------------------------------------------------ */
export function RetreatListingCard({ retreat, index = 0 }: { retreat: Retreat; index?: number }) {
  const nights = retreatNights(retreat);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.06 }}
      className="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-card shadow-[0_0_0_1px_var(--color-border)]"
    >
      <Link
        to="/retreats/$slug"
        params={{ slug: retreat.slug }}
        className="relative block aspect-[4/3] overflow-hidden"
        tabIndex={-1}
        aria-hidden
      >
        <img
          src={retreat.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[700ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
        />
        <span className="eyebrow absolute left-4 top-4 rounded-full bg-ivory/90 px-3.5 py-1.5 text-[0.56rem] text-ink backdrop-blur">
          {retreat.type}
        </span>
      </Link>
      <SaveButton
        slug={retreat.slug}
        title={retreat.title}
        className="absolute right-4 top-4 z-10"
      />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="eyebrow text-[0.58rem] text-muted-foreground">
          {retreat.dates} · {retreat.destination}
        </p>
        <h3 className="mt-2 text-3xl leading-tight">
          <Link to="/retreats/$slug" params={{ slug: retreat.slug }} className="hover:text-forest">
            {retreat.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-ink/70">
          Led by {retreat.organiser.name} · {nights} nights · {retreat.venue}
        </p>
        <p className="mt-4 leading-relaxed text-ink/80">{retreat.body}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <p className="text-sm">
            {retreat.price ? (
              <span className="font-semibold">{retreat.price}</span>
            ) : (
              <span className="text-muted-foreground">Enquire about places and pricing</span>
            )}
          </p>
          <Link
            to="/retreats/$slug"
            params={{ slug: retreat.slug }}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-ink"
          >
            Explore retreat <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Finder: categories, filters, search, results                        */
/* ------------------------------------------------------------------ */
type Filters = {
  category: string;
  destination: string;
  month: string;
  duration: string;
  q: string;
};
const emptyFilters: Filters = {
  category: "all",
  destination: "any",
  month: "any",
  duration: "any",
  q: "",
};

const durations = [
  { id: "any", label: "Any duration", test: () => true },
  { id: "week", label: "Up to a week", test: (n: number) => n <= 7 },
  { id: "fortnight", label: "8 to 14 nights", test: (n: number) => n >= 8 && n <= 14 },
  { id: "long", label: "15 nights or more", test: (n: number) => n >= 15 },
];

const monthKey = (r: Retreat) => r.startDate.slice(0, 7);
const monthLabel = (key: string) => `${MONTHS[Number(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}`;

export function RetreatFinder({ retreats }: { retreats: Retreat[] }) {
  const [f, setF] = useState<Filters>(emptyFilters);
  const [drawer, setDrawer] = useState(false);
  const set = (patch: Partial<Filters>) => {
    setF((p) => ({ ...p, ...patch }));
    track("retreat_filtered", { ...patch } as Record<string, string>);
  };

  // Options derive from published retreats only, so no empty categories.
  const categories = useMemo(() => {
    const m = new Map<string, { label: string; count: number }>();
    for (const r of retreats)
      m.set(r.typeId, { label: r.type, count: (m.get(r.typeId)?.count ?? 0) + 1 });
    return [...m.entries()];
  }, [retreats]);
  const destinations = [...new Set(retreats.map((r) => r.destination))];
  const months = [...new Set(retreats.map(monthKey))].sort();

  const match = (r: Retreat, filters: Filters) => {
    if (filters.category !== "all" && r.typeId !== filters.category) return false;
    if (filters.destination !== "any" && r.destination !== filters.destination) return false;
    if (filters.month !== "any" && monthKey(r) !== filters.month) return false;
    const d = durations.find((x) => x.id === filters.duration);
    if (d && !d.test(retreatNights(r))) return false;
    const q = filters.q.trim().toLowerCase();
    if (
      q &&
      ![r.title, r.organiser.name, r.venue, r.body, r.type].join(" ").toLowerCase().includes(q)
    )
      return false;
    return true;
  };
  const results = retreats.filter((r) => match(r, f));
  const active = JSON.stringify(f) !== JSON.stringify(emptyFilters);

  const selectCls =
    "w-full appearance-none rounded-full bg-card px-4 py-2.5 text-sm shadow-[0_0_0_1px_var(--color-border)] outline-none focus:shadow-[0_0_0_2px_var(--color-brass)]";

  const secondary = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block">
        <span className="eyebrow mb-1.5 block text-[0.56rem] text-ink/60">Destination</span>
        <select
          className={selectCls}
          value={f.destination}
          onChange={(e) => set({ destination: e.target.value })}
        >
          <option value="any">Any destination</option>
          {destinations.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow mb-1.5 block text-[0.56rem] text-ink/60">When</span>
        <select
          className={selectCls}
          value={f.month}
          onChange={(e) => set({ month: e.target.value })}
        >
          <option value="any">Any date</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {monthLabel(m)}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow mb-1.5 block text-[0.56rem] text-ink/60">Duration</span>
        <select
          className={selectCls}
          value={f.duration}
          onChange={(e) => set({ duration: e.target.value })}
        >
          {durations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow mb-1.5 block text-[0.56rem] text-ink/60">Search</span>
        <span className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/50" />
          <input
            type="search"
            value={f.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Retreat or organiser"
            className={cn(selectCls, "pl-10")}
          />
        </span>
      </label>
    </div>
  );

  return (
    <div>
      {/* Categories */}
      <div className="flex items-center gap-3">
        <div
          role="group"
          aria-label="Retreat type"
          className="flex flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
        >
          {[["all", { label: "All retreats", count: retreats.length }] as const, ...categories].map(
            ([id, c]) => (
              <button
                key={id}
                type="button"
                aria-pressed={f.category === id}
                onClick={() => set({ category: id })}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2.5 text-sm transition-colors",
                  f.category === id
                    ? "text-ivory"
                    : "bg-card text-ink/75 shadow-[0_0_0_1px_var(--color-border)] hover:text-ink",
                )}
              >
                {f.category === id && (
                  <motion.span
                    layoutId="retreat-cat"
                    className="absolute inset-0 rounded-full bg-forest"
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                )}
                <span className="relative">
                  {c.label} <span className="opacity-60">({c.count})</span>
                </span>
              </button>
            ),
          )}
        </div>
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm shadow-[0_0_0_1px_var(--color-border)] lg:hidden"
        >
          <SlidersHorizontal className="size-4" /> Filters
        </button>
      </div>

      {/* Secondary filters: inline on desktop, drawer on mobile */}
      <div className="mt-5 hidden lg:block">{secondary}</div>
      <Drawer open={drawer} onOpenChange={setDrawer}>
        <DrawerContent className="bg-ivory">
          <div className="mx-auto w-full max-w-lg px-5 pt-4">
            <DrawerTitle className="font-display text-3xl font-normal">Filter retreats</DrawerTitle>
            <DrawerDescription className="mb-5 text-sm text-muted-foreground">
              Narrow by destination, dates, duration or name.
            </DrawerDescription>
            {secondary}
          </div>
          <DrawerFooter className="mx-auto w-full max-w-lg flex-row gap-3 px-5">
            <button
              type="button"
              onClick={() => setF(emptyFilters)}
              className="flex-1 rounded-full px-4 py-3 text-sm ring-1 ring-ink/20"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="flex-[2] rounded-full bg-forest px-4 py-3 text-sm text-ivory"
            >
              Show {results.length} retreat{results.length === 1 ? "" : "s"}
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm">
        <p aria-live="polite" className="text-muted-foreground">
          Showing {results.length} of {retreats.length} published retreat
          {retreats.length === 1 ? "" : "s"}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => setF(emptyFilters)}
            className="inline-flex items-center gap-1.5 text-forest hover:text-ink"
          >
            Clear filters <X className="size-4" />
          </button>
        )}
      </div>

      <motion.div layout className="mt-6 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {results.map((r, i) => (
            <RetreatListingCard key={r.slug} retreat={r} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {results.length === 0 && (
        <div className="mt-6 rounded-[1.5rem] bg-stone p-10 text-center">
          <h3 className="text-3xl">No retreats match those filters yet.</h3>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Try a different selection, or tell us what you’d like to join and we’ll let you know
            when something suitable is listed.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setF(emptyFilters)}
              className="rounded-full px-5 py-2.5 text-sm ring-1 ring-ink/20"
            >
              Clear filters
            </button>
            <a href="#enquire" className="rounded-full bg-forest px-5 py-2.5 text-sm text-ivory">
              Tell us your interests
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Guest enquiry (server-side)                                         */
/* ------------------------------------------------------------------ */
export function GuestEnquiryForm({ defaultRetreat = "" }: { defaultRetreat?: string }) {
  const options = upcomingRetreats();
  const [v, setV] = useState({
    retreat:
      options.find((r) => r.slug === defaultRetreat || r.id === defaultRetreat)?.title ??
      "Help me find a retreat",
    name: "",
    email: "",
    phone: "",
    question: "",
    consent: false,
  });
  const [honeypot, setHoneypot] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "handoff" | "error">("idle");
  const [reference, setReference] = useState("");
  const set = (k: keyof typeof v, val: string | boolean) => setV((p) => ({ ...p, [k]: val }));

  const body = `Retreat: ${v.retreat}\nName: ${v.name}\nEmail: ${v.email}\nPhone: ${v.phone || "—"}\nQuestion: ${v.question || "—"}`;
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`Guest enquiry: ${v.retreat}`)}&body=${encodeURIComponent(body)}`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    const payload = {
      ...v,
      consent: v.consent === true ? (true as const) : v.consent,
      website: honeypot,
      startedAt,
    };
    const parsed = guestEnquirySchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const res = await submitGuestEnquiry({ data: parsed.data });
      if (res.ok) {
        setReference(res.reference);
        setState("sent");
        track("retreat_enquiry_submitted", { retreat: v.retreat });
      } else setState(res.reason === "not-configured" ? "handoff" : "error");
    } catch {
      setState("error");
    }
  };

  const field =
    "w-full border-0 border-b border-ink/25 bg-transparent px-0 py-3 outline-none transition-colors focus:border-forest";
  const Err = ({ k }: { k: string }) =>
    errors[k] ? <p className="mt-1.5 text-sm text-destructive">{errors[k]}</p> : null;

  if (state === "sent" || state === "handoff") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className="grid size-14 place-items-center rounded-full bg-forest text-ivory">
          <Check className="size-6" />
        </span>
        {state === "sent" ? (
          <>
            <h3 className="mt-6 text-4xl">Thank you. Your enquiry is with us.</h3>
            <p className="mt-3 max-w-lg text-muted-foreground">
              We’ll confirm the details with the organiser and come back to you. Your reference is{" "}
              <strong className="text-ink">{reference}</strong>. An enquiry does not reserve a
              place.
            </p>
          </>
        ) : (
          <>
            <h3 className="mt-6 text-4xl">Almost there.</h3>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Online sending isn’t switched on yet, so please send your enquiry by email. The button
              opens your email app with everything filled in. An enquiry does not reserve a place.
            </p>
            <a
              href={mailto}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm text-ivory"
            >
              <Mail className="size-4" /> Email my enquiry
            </a>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-7 md:grid-cols-2">
      <label className="md:col-span-2">
        <span className="eyebrow text-[0.6rem] text-ink/70">Which retreat?</span>
        <select
          className={field}
          value={v.retreat}
          onChange={(e) => set("retreat", e.target.value)}
        >
          <option>Help me find a retreat</option>
          {options.map((r) => (
            <option key={r.slug}>{r.title}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="eyebrow text-[0.6rem] text-ink/70">Your name *</span>
        <input
          className={field}
          autoComplete="name"
          value={v.name}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={!!errors["name"]}
        />
        <Err k="name" />
      </label>
      <label>
        <span className="eyebrow text-[0.6rem] text-ink/70">Email address *</span>
        <input
          type="email"
          className={field}
          autoComplete="email"
          value={v.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={!!errors["email"]}
        />
        <Err k="email" />
      </label>
      <label>
        <span className="eyebrow text-[0.6rem] text-ink/70">Phone (optional)</span>
        <input
          type="tel"
          className={field}
          autoComplete="tel"
          value={v.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
        <Err k="phone" />
      </label>
      <label className="md:col-span-2">
        <span className="eyebrow text-[0.6rem] text-ink/70">
          Your question or requirements (optional)
        </span>
        <textarea
          rows={3}
          className={field}
          value={v.question}
          onChange={(e) => set("question", e.target.value)}
        />
      </label>
      <input
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px]"
      />
      <label className="flex items-start gap-3 text-sm md:col-span-2">
        <input
          type="checkbox"
          checked={v.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-0.5 size-4 accent-[var(--forest)]"
        />
        <span>
          I understand Rachel’s Retreats will store my enquiry and contact me about it. An enquiry
          does not reserve a place or subscribe me to marketing.
          <Err k="consent" />
        </span>
      </label>
      {state === "error" && (
        <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm md:col-span-2">
          We couldn’t send your enquiry just now. Please try again, or{" "}
          <a href={mailto} className="underline">
            email it to the team
          </a>
          .
        </p>
      )}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm text-ivory transition-colors hover:bg-ink disabled:opacity-60"
        >
          {state === "sending" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Mail className="size-4" />
          )}
          Send my enquiry
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Organiser spotlight (names and programmes only, no invented bios)   */
/* ------------------------------------------------------------------ */
export function OrganiserSpotlight({ retreats }: { retreats: Retreat[] }) {
  const organisers = [...new Map(retreats.map((r) => [r.organiser.name, r.organiser])).values()];
  return (
    <ul className="flex snap-x gap-5 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible">
      {organisers.map((o, i) => {
        const progs = retreats.filter((r) => r.organiser.name === o.name);
        const initials = o.name
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2);
        return (
          <motion.li
            key={o.name}
            className="w-[82vw] shrink-0 snap-start rounded-[1.5rem] bg-card p-7 shadow-[0_0_0_1px_var(--color-border)] md:w-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden
                className="grid size-16 place-items-center rounded-full bg-forest font-display text-2xl text-ivory"
              >
                {initials}
              </span>
              <div>
                <h3 className="text-3xl leading-tight">{o.name}</h3>
                <p className="text-sm text-muted-foreground">{o.role}</p>
              </div>
            </div>
            <p className="eyebrow mt-6 text-[0.56rem] text-forest">Programmes</p>
            <ul className="mt-2 space-y-2">
              {progs.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/retreats/$slug"
                    params={{ slug: r.slug }}
                    className="link-draw inline-flex items-center gap-2 pb-0.5"
                  >
                    {r.title} <ArrowRight className="size-3.5" />
                  </Link>
                  <span className="block text-sm text-muted-foreground">{r.dates}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted-foreground">
              Organiser biography to follow once approved.
            </p>
          </motion.li>
        );
      })}
    </ul>
  );
}

export function SectionNote({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
