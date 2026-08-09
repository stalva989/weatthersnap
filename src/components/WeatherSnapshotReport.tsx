import ReportHeader from "./report/ReportHeader";
import PropertySection from "./report/PropertySection";
import ActivitySummary from "./report/ActivitySummary";
import MetricsRow from "./report/MetricsRow";
import ActivityMap from "./report/ActivityMap";

type Props={report:any};

export default function WeatherSnapshotReport({report}:Props){
 const snapshot=report?.snapshot;
 const events=report?.events??[];
 const request=report?.request;
 const historical=report?.historicalWeather??{};
 const observations=historical.dailySummaries??report?.dailySummaries??[];

 const highestWind=observations.reduce((m:number,o:any)=>Math.max(m,o.maxWind5Second??0),0);
 const largestHail=observations.reduce((m:number,o:any)=>Math.max(m,o.hailSize??0),0);
 const tornadoReports=observations.filter((o:any)=>o.tornado).length;
 const warningCount=observations.filter((o:any)=>o.warning).length;

 const findings=events.filter((e:any)=>e.severity!=="none").slice(0,5).map((e:any)=>({summary:e.summary,date:e.date}));

 return (
  <div className="mx-auto max-w-7xl rounded-xl border border-slate-300 bg-slate-100 p-8">
   <div className="rounded-xl bg-white p-8 shadow">
    <ReportHeader reportId={`WS-${Date.now().toString().slice(-8)}`} />
    <PropertySection
      address={request?.formattedAddress??""}
      dateOfLoss={request?.dateOfLoss??""}
      searchWindowStart={historical.windowStart??""}
      searchWindowEnd={historical.windowEnd??""}
    />
    <ActivitySummary summary={snapshot?.conclusion??""} findings={findings}/>
    <MetricsRow
      highestWind={highestWind}
      largestHail={largestHail}
      tornadoReports={tornadoReports}
      warningCount={warningCount}
      totalEvents={events.length}
    />
    <div className="mt-8 grid grid-cols-[430px_1fr] gap-8">
      <ActivityMap />
      <div className="rounded-xl border border-slate-300 bg-white p-6">
        <h2 className="text-xl font-bold">Weather Timeline</h2>
        <div className="mt-6 space-y-4">
          {events.map((event:any,index:number)=>(
            <div key={index} className="rounded-lg border-l-4 border-red-500 bg-slate-50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold">{event.date}</div>
                  <div className="mt-2 text-slate-600">{event.summary}</div>
                </div>
                <div className="text-right text-sm text-slate-500">
                  {event.daysFromLoss===0?"Date of Loss":event.daysFromLoss<0?`${Math.abs(event.daysFromLoss)} days before`:`${event.daysFromLoss} days after`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
   </div>
  </div>
 );
}