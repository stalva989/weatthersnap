import WeatherSnapLogo from "@/components/WeatherSnapLogo";
import WeatherSnapshotReport from "@/components/WeatherSnapshotReport";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const SAMPLE_REPORT_ID = "WS-5A244E5C1A";

export default async function ReportPreviewPage() {
  /*
   * Retrieve the permanent WeatherSnap sample report.
   *
   * This report was generated through the normal
   * WeatherSnap weather pipeline and is used only
   * as a public demonstration of the report format.
   */
  const { data: sampleReport, error } =
    await supabaseAdmin
      .from("weather_reports")
      .select(
        `
        report_id,
        address,
        date_of_loss,
        report_data
        `
      )
      .eq("report_id", SAMPLE_REPORT_ID)
      .single();

  if (error || !sampleReport) {
    console.error(
      "Unable to load WeatherSnap sample report:",
      error
    );

    return (
      <main className="min-h-screen bg-slate-50">

        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
            <a href="/">
              <WeatherSnapLogo />
            </a>

            <a
              href="/#order"
              className="rounded-xl bg-[var(--orange)] px-5 py-3 text-sm font-bold text-white"
            >
              Get a Snapshot
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-[var(--navy)]">
            Sample Report Unavailable
          </h1>

          <p className="mt-4 text-slate-600">
            The WeatherSnap sample report could not be
            loaded. Please try again later.
          </p>
        </div>

      </main>
    );
  }

  /*
   * Guarantee that the report model receives
   * the permanent sample Report ID.
   */
  const reportData = {
    ...sampleReport.report_data,
    reportId: sampleReport.report_id,
  };

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
              className="text-[var(--storm-blue)]"
            >
              Report Preview
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

      {/* PAGE INTRO */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 text-center lg:px-8">

          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--storm-blue)]">
            Sample Report
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--navy)] sm:text-5xl">
            See what&apos;s inside a Weather Snapshot.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Preview the weather metrics, mapping, timeline,
            event details, and source documentation included
            with a WeatherSnap report.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            Sample report for demonstration purposes
          </div>

        </div>
      </section>

      {/* SAMPLE REPORT */}

      <section className="px-4 py-10 sm:px-6 lg:px-8">

        <div className="mx-auto mb-5 max-w-7xl rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">

          <p className="text-sm leading-6 text-slate-700">
            <strong>Sample Weather Snapshot:</strong>{" "}
            This report was generated using WeatherSnap&apos;s
            standard weather-data workflow and is displayed
            here to demonstrate the report format.
          </p>

        </div>

        <WeatherSnapshotReport
          report={reportData}
          isUnlocked={true}
        />

      </section>

      {/* CTA */}

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">

          <h2 className="text-3xl font-bold text-[var(--navy)]">
            Check weather activity for your property.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Enter an address and date of loss to generate
            your own Weather Snapshot.
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