type Props = {
  summary: string;
  findings: {
    summary: string;
    date: string;
  }[];
};

export default function ActivitySummary({
  summary,
  findings,
}: Props) {
  return (
    <div className="mt-8 rounded-xl border-2 border-red-300 bg-white overflow-hidden">

      <div className="grid grid-cols-[1.3fr_1fr]">

        {/* Left Side */}

        <div className="border-r p-8">

          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Weather Activity Summary
          </div>

          <h2 className="mt-4 text-5xl font-extrabold leading-tight text-red-600">
            Significant Weather
            <br />
            Activity Identified
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
            {summary}
          </p>

        </div>

        {/* Right Side */}

        <div className="p-8">

          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Key Weather Findings
          </div>

          <div className="mt-6 space-y-5">

            {findings.map((finding, index) => (

              <div
                key={index}
                className="flex items-start gap-3"
              >

                <div className="mt-2 h-2.5 w-2.5 rounded-full bg-red-500" />

                <div>

                  <div className="font-semibold text-slate-900">
                    {finding.summary}
                  </div>

                  <div className="text-sm text-slate-500">
                    {finding.date}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}