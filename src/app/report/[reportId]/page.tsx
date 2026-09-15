import { supabaseAdmin } from "@/lib/supabaseAdmin";
import WeatherSnapshotReport from "@/components/WeatherSnapshotReport";
import WeatherSnapLogo from "@/components/WeatherSnapLogo";

type Props = {
  params: Promise<{
    reportId: string;
  }>;
};

export default async function ReportPage({
  params,
}: Props) {
  const { reportId } = await params;

  /*
   * Retrieve the exact saved WeatherSnap report.
   */
  const { data: report, error } =
    await supabaseAdmin
      .from("weather_reports")
      .select(
        `
        report_id,
        created_at,
        address,
        date_of_loss,
        payment_status,
        report_data
        `
      )
      .eq("report_id", reportId)
      .single();

  /*
   * REPORT NOT FOUND
   */
  if (error || !report) {
    return (
      <main className="min-h-screen bg-slate-100">

        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center px-6 py-4 lg:px-8">
            <a href="/">
              <WeatherSnapLogo />
            </a>
          </div>
        </header>

        <section className="px-6 py-20">

          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--storm-blue)]">
              WeatherSnap
            </p>

            <h1 className="mt-3 text-3xl font-bold text-[var(--navy)]">
              Report Not Found
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              We could not locate a Weather Snapshot with the
              following Report ID:
            </p>

            <p className="mt-4 font-mono text-lg font-semibold text-slate-900">
              {reportId}
            </p>

            <a
              href="/"
              className="mt-8 inline-flex rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--storm-blue)]"
            >
              Return to WeatherSnap
            </a>

          </div>

        </section>

      </main>
    );
  }

  /*
   * Determine whether this report
   * has already been purchased.
   */
  const isUnlocked =
    report.payment_status === "paid";

  /*
   * Use the exact weather data saved
   * when this report was generated.
   */
  const weatherReport = report.report_data;

  return (
    <main className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          <a href="/">
            <WeatherSnapLogo />
          </a>

          <a
            href="/"
            className="text-sm font-semibold text-[var(--navy)] transition hover:text-[var(--storm-blue)]"
          >
            New Weather Snapshot
          </a>

        </div>
      </header>

      {/* REPORT IDENTIFICATION */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--storm-blue)]">
                Weather Snapshot
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--navy)]">
                {report.address}
              </h1>

              <p className="mt-2 text-slate-600">
                Date of Loss:{" "}
                <span className="font-semibold text-slate-900">
                  {report.date_of_loss}
                </span>
              </p>

            </div>

            <div className="sm:text-right">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Report ID
              </p>

              <p className="mt-1 font-mono font-semibold text-slate-700">
                {report.report_id}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* REPORT */}

      <section className="py-12">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <WeatherSnapshotReport
            report={weatherReport}
            isUnlocked={isUnlocked}
          />

        </div>

      </section>

    </main>
  );
}