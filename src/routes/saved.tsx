import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Heart } from "lucide-react";
import { EmailRetreatButton, RetreatListingCard } from "@/components/retreat-components";
import { publicRetreats } from "@/data/site";
import { useSavedRetreats } from "@/lib/saved-retreats";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "My saved retreats | Rachel’s Retreats" },
      // Personal, per-browser page: keep it out of search results.
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { saved, ready } = useSavedRetreats();
  const items = publicRetreats.filter((r) => saved.includes(r.slug));

  return (
    <section className="min-h-[70vh] pb-16 pt-28 md:pt-32">
      <div className="container-luxe">
        <p className="eyebrow flex items-center gap-4 text-forest">
          <span className="h-px w-10 bg-current" aria-hidden /> My retreats
        </p>
        <h1 className="mt-5 text-[clamp(2.75rem,5vw,4.5rem)]">Saved retreats</h1>
        <p className="mt-4 max-w-2xl text-ink/75">
          Your shortlist is kept in this browser only, so it won’t appear on other devices. Saving a
          retreat doesn’t reserve a place. Use “Email me this retreat” to keep the details somewhere
          you can find them later.
        </p>

        {ready && items.length === 0 && (
          <div className="mt-10 rounded-[1.5rem] bg-stone p-10 text-center">
            <Heart className="mx-auto size-8 text-forest" />
            <h2 className="mt-4 text-3xl">Nothing saved yet</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Tap the heart on any retreat to keep it here while you decide.
            </p>
            <Link
              to="/retreats"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm text-ivory"
            >
              Explore upcoming retreats <ArrowRight className="size-4" />
            </Link>
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {items.map((r, i) => (
              <motion.div key={r.slug} layout exit={{ opacity: 0 }}>
                <RetreatListingCard retreat={r} index={i} />
                <div className="mt-3 flex justify-end">
                  <EmailRetreatButton retreat={r} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
