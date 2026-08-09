export type ReportMetric = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export type TimelineItem = {
  date: string;
  summary: string;
  severity: string;
  daysFromLoss: number;
  findings: {
    title: string;
  }[];
};

export type MapMarker = {
  id: string;

  label: string;

  latitude: number;
  longitude: number;

  type:
    | "property"
    | "hail"
    | "wind"
    | "tornado"
    | "warning"
    | "other";

  severity: "low" | "moderate" | "high";
};

export type ReportModel = {
  reportId: string;

  property: {
    address: string;
    dateOfLoss: string;
    searchWindowStart: string;
    searchWindowEnd: string;
  };

  summary: {
    title: string;
    description: string;
    findings: {
      summary: string;
      date: string;
    }[];
  };

  metrics: ReportMetric[];

  map: {
    centerLatitude: number;
    centerLongitude: number;

    zoom: number;

    bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    };

    propertyLatitude: number;
    propertyLongitude: number;

    markers: MapMarker[];
  };

  timeline: TimelineItem[];

  context: string;
};