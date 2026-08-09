type Props = {
  events: any[];
};

export default function Timeline({ events }: Props) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6">

      <h2 className="text-xl font-bold text-slate-900">
        Weather Timeline
      </h2>

      <div className="mt-6 space-y-5">

        {events.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
            No significant weather events identified.
          </div>
        )}

        {events.map((event: any, index: number) => (
          <div
            key={index}
            className="relative rounded-lg border-l-4 border-red-500 bg-slate-50 p-5"
          >
            <div className="flex items-start justify-between">

              <div>

                <div className="text-lg font-bold">
                  {event.date}
                </div>

                <div className="mt-2 text-slate-700">
                  {event.summary}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">

                  {(event.findings ?? []).map(
                    (finding: any, i: number) => (
                      <span
                        key={i}
                        className="rounded-full bg-white border px-3 py-1 text-xs font-medium"
                      >
                        {finding.title}
                      </span>
                    )
                  )}

                </div>

              </div>

              <div className="text-right">

                <div className="text-xs uppercase tracking-wider text-slate-500">
                  Severity
                </div>

                <div
                  className={`mt-2 rounded-full px-3 py-1 text-sm font-bold ${
                    event.severity === "high"
                      ? "bg-red-100 text-red-700"
                      : event.severity === "moderate"
                      ? "bg-orange-100 text-orange-700"
                      : event.severity === "low"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {event.severity.toUpperCase()}
                </div>

                <div className="mt-4 text-sm text-slate-500">
                  {event.daysFromLoss === 0
                    ? "Date of Loss"
                    : event.daysFromLoss < 0
                    ? `${Math.abs(event.daysFromLoss)} days before`
                    : `${event.daysFromLoss} days after`}
                </div>

              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}