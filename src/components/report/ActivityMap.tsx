export default function ActivityMap() {
  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6">

      <div className="mb-4 flex items-center justify-between">

        <h3 className="text-lg font-bold text-slate-900">
          Event Location Map
        </h3>

        <div className="text-xs uppercase tracking-wider text-slate-500">
          2 Mile Radius
        </div>

      </div>

      {/* Map Placeholder */}

      <div className="relative h-[420px] overflow-hidden rounded-lg border bg-slate-50">

        {/* Property */}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            P
          </div>

        </div>

        {/* Search Radius */}

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-slate-300" />

        <div className="absolute bottom-4 right-4 rounded bg-white px-3 py-2 text-xs text-slate-500 shadow">
          Live event map coming next
        </div>

      </div>

      {/* Legend */}

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">

        <Legend color="black" label="Property" />

        <Legend color="red" label="Hail" />

        <Legend color="blue" label="Wind" />

        <Legend color="orange" label="Warning" />

        <Legend color="green" label="Tornado" />

        <Legend color="gray" label="Other Weather" />

      </div>

    </div>
  );
}

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: color }}
      />

      <span>{label}</span>

    </div>
  );
}