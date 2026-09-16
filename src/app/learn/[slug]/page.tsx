import type { Metadata } from "next";
import { notFound } from "next/navigation";

import WeatherSnapLogo from "@/components/WeatherSnapLogo";
import {
  getLearnArticle,
  learnArticles,
} from "@/lib/learnArticles";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return learnArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getLearnArticle(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/learn/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/learn/${article.slug}`,
    },
  };
}

export default async function LearnArticlePage({
  params,
}: Props) {
  const { slug } = await params;
  const article = getLearnArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = article.relatedSlugs
    .map((relatedSlug) => getLearnArticle(relatedSlug))
    .filter(
      (
        related
      ): related is NonNullable<
        ReturnType<typeof getLearnArticle>
      > => Boolean(related)
    );

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          <a href="/">
            <WeatherSnapLogo />
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[var(--navy)] md:flex">

            <a
              href="/#how-it-works"
              className="transition hover:text-[var(--storm-blue)]"
            >
              How It Works
            </a>

            <a
              href="/report-preview"
              className="transition hover:text-[var(--storm-blue)]"
            >
              Report Preview
            </a>

            <a
              href="/learn"
              className="rounded-lg bg-[var(--storm-blue)] px-4 py-2 font-semibold !text-[#EAF6FF] shadow-sm"
            >
              Learn
            </a>

            <a
              href="/faq"
              className="transition hover:text-[var(--storm-blue)]"
            >
              FAQ
            </a>

          </nav>

          <a
            href="/#order"
            className="rounded-xl bg-[var(--orange)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Get a Snapshot
          </a>

        </div>
      </header>

      {/* ARTICLE */}

      <article className="mx-auto max-w-4xl px-6 py-14">

        <a
          href="/learn"
          className="text-sm font-semibold text-[var(--storm-blue)] hover:underline"
        >
          ← WeatherSnap Learning Center
        </a>

        <header className="mt-8 border-b border-slate-200 pb-10">

          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--storm-blue)]">
            {article.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-[var(--navy)] sm:text-5xl">
            {article.title}
          </h1>

          <p className="mt-6 text-xl leading-8 text-slate-600">
            {article.intro}
          </p>

        </header>

        {/* ARTICLE CONTENT */}

        <div className="py-10">

          <div className="space-y-10">

            {article.sections.map((section) => (
              <section key={section.heading}>

                <h2 className="text-2xl font-bold text-[var(--navy)]">
                  {section.heading}
                </h2>

                <div className="mt-4 space-y-4">

                  {section.paragraphs.map(
                    (paragraph, index) => (
                      <p
                        key={index}
                        className="text-[17px] leading-8 text-slate-700"
                      >
                        {paragraph}
                      </p>
                    )
                  )}

                </div>

              </section>
            ))}

          </div>

        </div>

        {/* CTA */}

        <section className="rounded-2xl bg-[var(--navy)] p-8 text-center">

          <h2 className="text-2xl font-bold text-white">
            Need weather data for a specific property?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-300">
            Enter an address and date of loss to generate a
            Weather Snapshot using documented weather data
            from authoritative sources.
          </p>

          <a
            href="/#order"
            className="mt-6 inline-block rounded-xl bg-[var(--orange)] px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            Generate a Weather Snapshot — $5.99
          </a>

        </section>

        {/* RELATED ARTICLES */}

        {relatedArticles.length > 0 && (
          <section className="mt-12">

            <h2 className="text-2xl font-bold text-[var(--navy)]">
              Related Weather Guides
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">

              {relatedArticles.map((related) => (
                <a
                  key={related.slug}
                  href={`/learn/${related.slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--storm-blue)]">
                    {related.eyebrow}
                  </p>

                  <h3 className="mt-2 font-bold leading-6 text-[var(--navy)]">
                    {related.title}
                  </h3>

                </a>
              ))}

            </div>

          </section>
        )}

      </article>

    </main>
  );
}