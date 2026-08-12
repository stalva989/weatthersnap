type Props = {
  events: any[];
};

function getBorderColor(type: string) {
  switch (type) {
    case "hail":
      return "border-red-500";

    case "wind":
      return "border-blue-500";

    case "tornado":
      return "border-green-500";

    case "lightning":
      return "border-violet-500";

    case "flood":
      return "border-cyan-500";

    default:
      return "border-slate-400";
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-700";

    case "moderate":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function Timeline({
  events,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6">

      <h2 className="text-xl font-bold text-slate-900">
        Documented Weather Events
      </h2>

      <div className="mt-6 space-y-5">

        {events.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
            No documented weather events identified.
          </div>
        )}

        {events.map((event: any) => (

          <div
            key={event.id}
            className={`rounded-lg border-l-4 bg-slate-50 p-5 ${getBorderColor(
              event.type
            )}`}
          >

            <div className="flex items-start justify-between">

              <div>

                <div className="text-lg font-bold text-slate-900">
                  {event.eventType}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  {event.date}
                </div>

              </div>

              <div
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getSeverityBadge(
                  event.severity
                )}`}
              >
                {event.severity.charAt(0).toUpperCase() +
                  event.severity.slice(1)}
              </div>

            </div>

            <div className="mt-5 grid grid-cols-3 gap-6">

              <div>

                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Distance
                </div>

                <div className="mt-1 font-semibold">
                  {event.distanceMiles?.toFixed(1)} mi
                </div>

              </div>

              <div>

                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Magnitude
                </div>

                <div className="mt-1 font-semibold">
                  {event.magnitude !== null &&
                  event.magnitude !== undefined
                    ? `${event.magnitude}${
                        event.magnitudeType
                          ? ` ${event.magnitudeType}`
                          : ""
                      }`
                    : "--"}
                </div>

              </div>

              <div>

                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Source
                </div>

                <div className="mt-1 font-semibold">
                  {event.source}
                </div>

              </div>

            </div>

            <div className="mt-5 border-t pt-4 text-sm leading-6 text-slate-600">
              {event.summary}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}