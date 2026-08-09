import ReportHeader from "./report/ReportHeader";
import PropertySection from "./report/PropertySection";
import ActivitySummary from "./report/ActivitySummary";
import MetricsRow from "./report/MetricsRow";
import ActivityMap from "./report/ActivityMap";
import Timeline from "./report/Timeline";
import WeatherContext from "./report/WeatherContext";
import DataSources from "./report/DataSources";
import Disclaimer from "./report/Disclaimer";

import { buildReportModel } from "@/lib/reportBuilder";

type Props = {
  report: any;
};

export default function WeatherSnapshotReport({ report }: Props) {
  const model = buildReportModel(report);

  return (
    <div className="mx-auto max-w-7xl rounded-xl border border-slate-300 bg-slate-100 p-8">

      <div className="rounded-xl bg-white p-8 shadow">

        <ReportHeader reportId={model.reportId} />

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
          highestWind={Number(model.metrics[2].value) || 0}
          largestHail={Number(model.metrics[1].value) || 0}
          tornadoReports={Number(model.metrics[3].value) || 0}
          warningCount={Number(model.metrics[4].value) || 0}
          totalEvents={Number(model.metrics[5].value) || 0}
        />

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
  );
}