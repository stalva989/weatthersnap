import type { Metadata } from "next";
import WeatherSnapLogo from "@/components/WeatherSnapLogo";
import { learnArticles } from "@/lib/learnArticles";

export const metadata: Metadata = {
  title: "Weather & Storm Research Guides",
  description:
    "Learn how to research hail history, wind speeds, storm reports, historical weather, and weather conditions surrounding a property date of loss.",
  alternates: {
    canonical: "/learn",
  },
};

type CardTheme = {
  gradient: string;
  accent: string;
  icon: string;
};

function getCardTheme(slug: string): CardTheme {
  switch (slug) {
    case "check-hail-history-for-property":
      return {
        gradient:
          "from-sky-500 via-blue-500 to-blue-700",
        accent: "text-sky-600",
        icon: "●",
      };

    case "historical-weather-specific-date":
      return {
        gradient:
          "from-slate-600 via-slate-700 to-slate-900",
        accent: "text-slate-600",
        icon: "☁",
      };

    case "check-wind-speed-specific-date":
      return {
        gradient:
          "from-cyan-400 via-sky-500 to-blue-600",
        accent: "text-cyan-600",
        icon: "≋",
      };

    case "find-noaa-storm-reports-near-address":
      return {
        gradient:
          "from-blue-700 via-indigo-700 to-slate-900",
        accent: "text-blue-700",
        icon: "⌖",
      };

    case "weather-date-of-loss":
      return {
        gradient:
          "from-orange-400 via-orange-500 to-amber-600",
        accent: "text-orange-600",
        icon: "▣",
      };

    case "storm-events-vs-weather-station-data":
      return {
        gradient:
          "from-indigo-500 via-blue-600 to-slate-800",
        accent: "text-indigo-600",
        icon: "◉",
      };

    case "what-no-hail-reported-means":
      return {
        gradient:
          "from-sky-400 via-sky-500 to-indigo-600",
        accent: "text-sky-600",
        icon: "?",
      };

    case "how-far-away-can-hail-report-be":
      return {
        gradient:
          "from-blue-500 via-indigo-500 to-violet-600",
        accent: "text-indigo-600",
        icon: "◎",
      };

    case "understanding-hail-sizes":
      return {
        gradient:
          "from-cyan-500 via-blue-500 to-blue-700",
        accent: "text-blue-600",
        icon: "●",
      };

    case "property-insurance-weather-reports":
      return {
        gradient:
          "from-slate-700 via-blue-800 to-[#0B1F3B]",
        accent: "text-blue-700",
        icon: "▤",
      };

    default:
      return {
        gradient:
          "from-sky-500 to-blue-700",
        accent: "text-sky-600",
        icon: "◉",
      };
  }
}

export default function LearnPage() {
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

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">

        <div className="absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-sky-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--storm-blue)]">
            WeatherSnap Learning Center
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">
            Understand historical weather data.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Practical guides for researching hail, wind,
            severe weather, weather stations, storm reports,
            and conditions surrounding a property date of
            loss.
          </p>

        </div>
      </section>

      {/* ARTICLES */}

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

        <div className="mb-8">

          <h2 className="text-2xl font-bold text-[var(--navy)]">
            Weather Research Guides
          </h2>

          <p className="mt-2 text-slate-600">
            Explore the data, terminology, and methods used
            to research historical weather near a property.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {learnArticles.map((article) => {
            const theme = getCardTheme(article.slug);

            return (
              <a
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                {/* THEMED HEADER */}

                <div
                  className={`relative flex h-24 items-center overflow-hidden bg-gradient-to-r ${theme.gradient} px-7`}
                >

                  <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border border-white/15" />

                  <div className="absolute -right-1 -top-6 h-24 w-24 rounded-full border border-white/15" />

                  <div className="absolute right-12 top-7 h-2 w-2 rounded-full bg-white/30" />

                  <div className="absolute right-24 top-14 h-3 w-3 rounded-full bg-white/20" />

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-2xl font-bold text-white shadow-sm backdrop-blur-sm">
                      {theme.icon}
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/90">
                      {article.eyebrow}
                    </p>

                  </div>

                </div>

                {/* CARD CONTENT */}

                <div className="p-7">

                  <h3 className="text-xl font-bold leading-7 text-[var(--navy)] transition group-hover:text-[var(--storm-blue)]">
                    {article.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {article.description}
                  </p>

                  <div
                    className={`mt-6 flex items-center gap-2 text-sm font-bold ${theme.accent}`}
                  >
                    <span>
                      Read guide
                    </span>

                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                </div>

              </a>
            );
          })}

        </div>

      </section>

      {/* CTA */}

      <section className="border-t border-slate-200 bg-[var(--navy)]">

        <div className="mx-auto max-w-4xl px-6 py-16 text-center">

          <h2 className="text-3xl font-bold text-white">
            Researching weather for a specific property?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            Generate a Weather Snapshot to review documented
            hail, wind, tornado, and weather activity around
            an address and date of loss.
          </p>

          <a
            href="/#order"
            className="mt-7 inline-block rounded-xl bg-[var(--orange)] px-7 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Generate Weather Snapshot — $5.99
          </a>

        </div>

      </section>

    </main>
  );
}