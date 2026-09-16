import WeatherSnapLogo from "@/components/WeatherSnapLogo";

const faqSections = [
  {
    title: "About WeatherSnap",
    questions: [
      {
        question: "What is a Weather Snapshot?",
        answer:
          "A Weather Snapshot is a concise property-specific weather report designed to help you quickly review documented hail, wind, and tornado activity near a property and date of loss. It is intended as an efficient first step before deciding whether additional investigation or more comprehensive weather research is warranted.",
      },
      {
        question: "How much does a Weather Snapshot cost?",
        answer:
          "A single Weather Snapshot is $5.99. The report can be reviewed online after purchase and downloaded as a PDF.",
      },
      {
        question: "Who is WeatherSnap designed for?",
        answer:
          "WeatherSnap is designed for insurance, restoration, roofing, construction, property, and other professionals who need a quick way to review documented severe-weather activity associated with a property.",
      },
      {
        question: "How quickly is the report generated?",
        answer:
          "WeatherSnap automatically searches available weather records after you submit the property address and date of loss. Most reports are generated within a short period of time, although processing time can vary depending on the weather records being reviewed.",
      },
    ],
  },
  {
    title: "Weather Data",
    questions: [
      {
        question: "What date range does WeatherSnap review?",
        answer:
          "WeatherSnap reviews a 31-day window centered on the selected date of loss: 15 days before the selected date, the date itself, and 15 days after.",
      },
      {
        question: "What types of weather does WeatherSnap review?",
        answer:
          "The Weather Snapshot focuses on documented hail, damaging or severe wind, and tornado-related activity relevant to the property and review period. It also incorporates available nearby weather-station information and other supporting weather records.",
      },
      {
        question: "Where does the weather information come from?",
        answer:
          "WeatherSnap organizes information from authoritative governmental and meteorological data sources, including records made available by NOAA, the National Weather Service, the National Centers for Environmental Information, and the Storm Prediction Center.",
      },
      {
        question: 'What does "documented" weather activity mean?',
        answer:
          "Documented activity means WeatherSnap found a weather record in one or more of the data sources reviewed. The report presents the available record and its relationship to the property rather than independently determining whether a weather condition occurred directly at the structure.",
      },
      {
        question: "How close does a weather event need to be to the property?",
        answer:
          "WeatherSnap focuses on documented events within approximately 5 miles of the property. When no qualifying event is found within that area, the report may identify the closest documented event within approximately 25 miles to provide additional geographic context.",
      },
      {
        question: "What if there was no significant weather on the selected date?",
        answer:
          "The selected date is only one part of the review. WeatherSnap also searches the surrounding 15 days before and after that date. If documented activity occurred elsewhere within the review window, those dates can help identify weather activity that may warrant additional investigation.",
      },
      {
        question: "Does no reported event mean no weather occurred?",
        answer:
          "No. Weather observations and storm-event databases have geographic, reporting, and observational limitations. The absence of a documented event near a property should not be interpreted as proof that a particular weather condition did not occur.",
      },
    ],
  },
  {
    title: "Understanding the Report",
    questions: [
      {
        question: "What information is included in the report?",
        answer:
          "Depending on the available records, a Weather Snapshot can include the property and date of loss, review window, documented event information, event proximity, hail and wind metrics, tornado-related activity, nearby weather-station observations, an activity map, event timeline, data-source references, and report verification information.",
      },
      {
        question: "Why can station wind and reported storm wind be different?",
        answer:
          "Weather-station observations and storm-event reports are separate records collected at different locations and sometimes through different reporting methods. WeatherSnap keeps these records distinct so the report does not imply that a wind measurement recorded elsewhere occurred at the subject property.",
      },
      {
        question: "Does WeatherSnap determine whether a property was damaged?",
        answer:
          "No. WeatherSnap documents available weather information. It does not inspect the property and does not determine whether damage occurred.",
      },
      {
        question: "Does the report determine causation or insurance coverage?",
        answer:
          "No. WeatherSnap does not determine property-damage causation, policy coverage, claim validity, or whether a weather event caused a particular condition at a property. Those determinations may require inspection, engineering, adjusting, policy review, or other professional evaluation.",
      },
      {
        question: "Is WeatherSnap a replacement for a comprehensive weather report?",
        answer:
          "No. WeatherSnap is intentionally designed as a concise screening report. Cases requiring broader historical research, specialized meteorological analysis, expert opinions, certification, or litigation support may require a more comprehensive weather investigation.",
      },
    ],
  },
  {
    title: "PDF & Verification",
    questions: [
      {
        question: "Can I download the report?",
        answer:
          "Yes. After purchase, the Weather Snapshot can be downloaded as a PDF for your records and is also sent to the email address associated with the purchase.",
      },
      {
        question: "What is the WeatherSnap Report ID?",
        answer:
          "Each generated Weather Snapshot receives a unique Report ID. The identifier connects the report to its WeatherSnap record and helps distinguish it from other reports.",
      },
      {
        question: "What does the QR code in the PDF do?",
        answer:
          "The QR code directs the reader to the WeatherSnap verification page associated with that Report ID. This provides a simple way to confirm that the report corresponds to a WeatherSnap record.",
      },
      {
        question: "Can I share the PDF with someone else?",
        answer:
          "Yes. The downloaded PDF is designed to be saved and shared as part of your normal property, claim, inspection, or project documentation.",
      },
    ],
  },
];

export default function FAQPage() {
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
              href="/faq"
              className="text-[var(--storm-blue)]"
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

      {/* INTRO */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--storm-blue)]">
            Frequently Asked Questions
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">
            Questions about WeatherSnap?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Learn how WeatherSnap searches documented
            weather activity, what&apos;s included in a
            Weather Snapshot, and how to interpret the
            information in your report.
          </p>

        </div>
      </section>

      {/* FAQ CONTENT */}

      <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">

        <div className="space-y-14">

          {faqSections.map((section) => (
            <section key={section.title}>

              <div className="mb-6 flex items-center gap-4">

                <div className="h-8 w-1 rounded-full bg-[var(--orange)]" />

                <h2 className="text-2xl font-bold text-[var(--navy)]">
                  {section.title}
                </h2>

              </div>

              <div className="space-y-4">

                {section.questions.map((item) => (
                  <details
                    key={item.question}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
                  >

                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-bold text-[var(--navy)]">

                      <span>
                        {item.question}
                      </span>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl font-normal text-[var(--storm-blue)] transition group-open:rotate-45">
                        +
                      </span>

                    </summary>

                    <div className="border-t border-slate-100 px-6 py-5">

                      <p className="leading-7 text-slate-600">
                        {item.answer}
                      </p>

                    </div>

                  </details>
                ))}

              </div>

            </section>
          ))}

        </div>

      </section>

      {/* CTA */}

      <section className="border-t border-slate-200 bg-[var(--navy)]">

        <div className="mx-auto max-w-4xl px-6 py-14 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#8FD3FF]">
            Weather Intelligence. Instantly.
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            Ready to check a property?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            Generate a Weather Snapshot for an address and
            date of loss in just a few steps.
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