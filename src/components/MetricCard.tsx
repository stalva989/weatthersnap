type Props = {
  title: string;
  value: string | number;
  subtitle: string;
};

export default function MetricCard({
  title,
  value,
  subtitle,
}: Props) {
  return (
    <div className="p-5 text-center">

      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </div>

      <div className="mt-4 text-3xl font-bold text-red-600">
        {value}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {subtitle}
      </div>

    </div>
  );
}