import ReportHeader from "./report/ReportHeader";
import PropertySection from "./report/PropertySection";
import ActivitySummary from "./report/ActivitySummary";
import MetricsRow from "./report/MetricsRow";
import ActivityMap from "./report/ActivityMap";
import Timeline from "./report/Timeline";
import WeatherContext from "./report/WeatherContext";
import DataSources from "./report/DataSources";
import Disclaimer from "./report/Disclaimer";
import ReportPaywall from "./report/ReportPaywall";

import { buildReportModel } from "@/lib/reportBuilder";

type Props = {
  report: any;
  isUnlocked: boolean;
};

export default function WeatherSnapshotReport({
  report,
  isUnlocked,
}: Props) {
  const model = buildReportModel(report);

  return (
    <div className="mx-auto max-w-7xl rounded-xl border border-slate-300 bg-slate-100 p-8">
      <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow">
        <div
          className={
            !isUnlocked
              ? "pointer-events-none select-none opacity-80"
              : ""
          }
        >
          <div className="flex items-start justify-between gap-4">
            <ReportHeader reportId={model.reportId} />

            {isUnlocked && (
              <a
                href={`/api/reports/${model.reportId}/pdf`}
                className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold !text-white transition hover:bg-slate-700"
              >
                Download PDF
              </a>
            )}
          </div>

          <PropertySection
            address={model.property.address}
            dateOfLoss={model.property.dateOfLoss}
            searchWindowStart={model.property.searchWindowStart}
            searchWindowEnd={model.property.searchWindowEnd}
          />

          <ActivitySummary
            summary={model.summary.description}
            findings={model.summary.findings}
          />

          <MetricsRow
            closestEvent={
              model.metrics[0].value === "--"
                ? null
                : Number(model.metrics[0].value)
            }
            closestHail={
              model.metrics[1].value === "--"
                ? null
                : Number(model.metrics[1].value)
            }
            largestHail={
              model.metrics[2].value === "--"
                ? 0
                : Number(model.metrics[2].value)
            }
            highestWind={
              model.metrics[3].value === "--"
                ? 0
                : Number(model.metrics[3].value)
            }
            tornadoReports={
              Number(model.metrics[4].value) || 0
            }
            totalEvents={
              Number(model.metrics[5].value) || 0
            }
          />

          <div
            className={
              !isUnlocked
                ? "relative pointer-events-none select-none opacity-70"
                : ""
            }
          >
            <div className="mt-8 grid grid-cols-[430px_1fr] gap-8">
              <ActivityMap
                address={model.property.address}
                latitude={model.map.propertyLatitude}
                longitude={model.map.propertyLongitude}
                events={model.timeline}
              />

              <Timeline
                events={model.timeline}
              />
            </div>

            <WeatherContext
              summary={model.context}
            />

            <DataSources />

            <Disclaimer />
          </div>
        </div>

        {!isUnlocked && (
          <ReportPaywall
            reportId={report.reportId}
          />
        )}
      </div>
    </div>
  );
}