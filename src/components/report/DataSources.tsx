export default function DataSources() {
  return (
    <div className="mt-8 rounded-xl border border-slate-300 bg-white p-6">

      <h2 className="text-xl font-bold text-slate-900">
        Data Sources
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-6">

        <div>

          <div className="font-semibold">
            NOAA National Centers for Environmental Information
          </div>

          <div className="mt-2 text-sm text-slate-600">
            Daily Summaries dataset
          </div>

        </div>

        <div>

          <div className="font-semibold">
            National Weather Service
          </div>

          <div className="mt-2 text-sm text-slate-600">
            Forecast Grid / Station metadata
          </div>

        </div>

      </div>

    </div>
  );
}