type Props = {
  summary: string;
};

export default function WeatherContext({
  summary,
}: Props) {
  return (
    <div className="mt-8 rounded-xl border border-slate-300 bg-white p-6">

      <h2 className="text-xl font-bold text-slate-900">
        Weather Context
      </h2>

      <p className="mt-5 text-slate-700 leading-8">
        {summary}
      </p>

    </div>
  );
}