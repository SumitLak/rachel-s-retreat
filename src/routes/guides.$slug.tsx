import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal, SplitLines } from "@/components/motion";
import { ButtonLink, ClosingCTA } from "@/components/ui-luxe";
import { getGuide, guides } from "@/data/guides";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    const g = loaderData?.guide;
    return {
      meta: g
        ? [
            { title: `${g.title} — Guides & FAQs — Rachel's Retreats` },
            { name: "description", content: g.summary },
          ]
        : [],
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const related = guides
    .filter((g) => g.category === guide.category && g.slug !== guide.slug)
    .slice(0, 3);

  return (
    <>
      <section className="bg-forest pb-14 pt-32 text-ivory md:pb-20 md:pt-40">
        <div className="container-luxe max-w-5xl">
          <Reveal>
            <Link
              to="/guides"
              className="eyebrow inline-flex items-center gap-3 text-[0.62rem] text-ivory/75 hover:text-ivory"
            >
              <ArrowLeft className="size-4" /> Guides & FAQs
            </Link>
            <p className="eyebrow mt-8 text-[0.62rem] text-brass">
              {guide.category} · {guide.n}
            </p>
          </Reveal>
          <SplitLines
            as="h1"
            animateOnMount
            lines={[guide.title]}
            className="mt-4 text-[clamp(2.75rem,6vw,5.5rem)]"
          />
          {guide.intro.map((p) => (
            <Reveal key={p} delay={0.2}>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ivory/80">{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <article className="py-12 md:py-20">
        <div className="container-luxe max-w-5xl space-y-12 md:space-y-16">
          {guide.sections.map((s) => (
            <Reveal key={s.heading}>
              <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
                <h2 className="text-3xl leading-tight md:text-4xl">{s.heading}</h2>
                <div>
                  {s.body.map((p) => (
                    <p key={p} className="mt-4 leading-relaxed text-ink/80 first:mt-0">
                      {p}
                    </p>
                  ))}
                  {s.table && (
                    <div className="mt-2 overflow-x-auto rounded-[1.25rem] shadow-[0_0_0_1px_var(--color-border)]">
                      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                        <thead className="bg-stone">
                          <tr>
                            {s.table[0]?.map((h) => (
                              <th key={h} className="eyebrow px-5 py-4 text-[0.58rem] text-ink/70">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {s.table.slice(1).map((row) => (
                            <tr key={row.join("|")} className="border-t border-border">
                              {row.map((cell, i) => (
                                <td
                                  key={i}
                                  className={
                                    i === 0 ? "px-5 py-4 font-semibold" : "px-5 py-4 text-ink/80"
                                  }
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            </Reveal>
          ))}

          {guide.outro && (
            <Reveal className="rounded-[1.25rem] bg-stone p-8 md:p-10">
              <p className="font-display text-2xl leading-snug md:text-3xl">{guide.outro}</p>
              <ButtonLink to="/plan" className="mt-6">
                Plan your retreat
              </ButtonLink>
            </Reveal>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border py-12 md:py-16">
          <div className="container-luxe">
            <p className="eyebrow text-[0.62rem] text-forest">Keep exploring</p>
            <h2 className="mt-3 text-4xl">A little more to help you plan.</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link
                    to="/guides/$slug"
                    params={{ slug: g.slug }}
                    className="group flex h-full flex-col rounded-[1.25rem] bg-card p-6 shadow-[0_0_0_1px_var(--color-border)] transition-all duration-300 hover:-translate-y-1"
                  >
                    <h3 className="text-2xl leading-tight">{g.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{g.summary}</p>
                    <span className="eyebrow mt-auto flex items-center gap-2 pt-5 text-[0.6rem] text-forest">
                      Read the guide{" "}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ClosingCTA image="/images/villa-senesi.webp" />
    </>
  );
}
