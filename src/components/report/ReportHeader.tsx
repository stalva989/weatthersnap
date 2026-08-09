type Props = {
  reportId: string;
};

export default function ReportHeader({ reportId }: Props) {
  return (
    <div className="border-b border-slate-300 pb-6">

      <div className="flex items-start justify-between">

        <div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Weather Snapshot
          </h1>

          <p className="mt-2 text-lg text-slate-500">
            Weather Intelligence. Instantly.
          </p>

        </div>

        <div className="text-right">

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Report ID
          </div>

          <div className="mt-1 text-lg font-bold text-slate-900">
            {reportId}
          </div>

          <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Generated
          </div>

          <div className="mt-1 text-sm text-slate-700">
            {new Date().toLocaleString()}
          </div>

        </div>

      </div>

    </div>
  );
}