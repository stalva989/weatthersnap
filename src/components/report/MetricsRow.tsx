import MetricCard from "../MetricCard";

type Props = {
  closestEvent: number | null;
  closestHail: number | null;
  largestHail: number;
  highestWind: number;
  tornadoReports: number;
  totalEvents: number;
};

export default function MetricsRow({
  closestEvent,
  closestHail,
  largestHail,
  highestWind,
  tornadoReports,
  totalEvents,
}: Props) {
  return (
    <div className="mt-6 grid grid-cols-6 divide-x rounded-xl border border-slate-300 bg-white">

      <MetricCard
        title="Closest Event"
        value={
          closestEvent !== null
            ? closestEvent.toFixed(1)
            : "--"
        }
        subtitle="mi"
      />

      <MetricCard
        title="Closest Hail"
        value={
          closestHail !== null
            ? closestHail.toFixed(1)
            : "--"
        }
        subtitle="mi"
      />

      <MetricCard
        title="Largest Hail"
        value={
          largestHail > 0
            ? largestHail.toFixed(2)
            : "--"
        }
        subtitle="in"
      />

      <MetricCard
        title="Highest Wind"
        value={
          highestWind > 0
            ? highestWind.toFixed(0)
            : "--"
        }
        subtitle="mph"
      />

      <MetricCard
        title="Tornado Reports"
        value={tornadoReports}
        subtitle=""
      />

      <MetricCard
        title="Documented Events"
        value={totalEvents}
        subtitle=""
      />

    </div>
  );
}