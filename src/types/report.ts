export type ReportMetric = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export type TimelineItem = {
  id?: string;

  date: string;
  summary: string;

  type?: string;

  severity: string;

  daysFromLoss: number;

  latitude?: number;
  longitude?: number;

  eventType?: string;

  magnitude?: number | null;
  magnitudeType?: string | null;

  distanceMiles?: number;

  source?: string;

  narrative?: string;

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