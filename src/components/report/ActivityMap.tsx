import MapboxMap from "./MapboxMap";

type Props = {
  address?: string;
  latitude: number;
  longitude: number;
  events?: any[];
};

export default function ActivityMap({
  address,
  latitude,
  longitude,
  events = [],
}: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-300 bg-white">

      {/* Header */}

      <div className="flex items-center justify-between border-b px-6 py-4">

        <div>

          <h3 className="text-lg font-bold text-slate-900">
            Event Location Map
          </h3>

          <div className="text-sm text-slate-500">
            Approximate weather activity relative to the property
          </div>

        </div>

        <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Auto Scale
        </div>

      </div>

      {/* Map */}

      <div className="h-[430px]">

        <MapboxMap
          latitude={latitude}
          longitude={longitude}
          events={events}
        />

      </div>

      {/* Footer */}

      <div className="border-t px-6 py-5">

        <div className="grid grid-cols-2 gap-4 text-sm">

          <Legend color="black" label="Property" />
          <Legend color="#ef4444" label="Weather Event" />
          <Legend color="#3b82f6" label="Wind" />
          <Legend color="#f97316" label="Warning" />
          <Legend color="#22c55e" label="Tornado" />
          <Legend color="#6b7280" label="Other" />

        </div>

        {address && (
          <div className="mt-5 border-t pt-4 text-xs text-slate-500">
            Property: {address}
          </div>
        )}

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