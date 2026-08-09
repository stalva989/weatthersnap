import MetricCard from "../MetricCard";

type Props = {
  highestWind: number;
  largestHail: number;
  tornadoReports: number;
  warningCount: number;
  totalEvents: number;
};

export default function MetricsRow({
  highestWind,
  largestHail,
  tornadoReports,
  warningCount,
  totalEvents,
}: Props) {
  return (
    <div className="mt-6 grid grid-cols-6 divide-x rounded-xl border border-slate-300 bg-white">

      <MetricCard
        title="Closest Hail"
        value="--"
        subtitle="mi"
      />

      <MetricCard
        title="Largest Hail"
        value={largestHail > 0 ? largestHail.toFixed(2) : "--"}
        subtitle="in"
      />

      <MetricCard
        title="Highest Wind"
        value={highestWind > 0 ? highestWind.toFixed(0) : "--"}
        subtitle="mph"
      />

      <MetricCard
        title="Tornado Reports"
        value={tornadoReports}
        subtitle=""
      />

      <MetricCard
        title="Warnings"
        value={warningCount}
        subtitle=""
      />

      <MetricCard
        title="Total Events"
        value={totalEvents}
        subtitle=""
      />

    </div>
  );
}