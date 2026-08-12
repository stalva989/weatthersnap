import type { StormEvent } from "./stormEvents";

export type UnifiedWeatherEvent = {
  id: string;

  date: string;

  type:
    | "hail"
    | "wind"
    | "tornado"
    | "lightning"
    | "flood"
    | "warning"
    | "other";

  eventType: string;

  title: string;
  summary: string;

  severity: "low" | "moderate" | "high";

  daysFromLoss: number;

  latitude: number;
  longitude: number;

  distanceMiles: number;

  magnitude: number | null;
  magnitudeUnit: string | null;

  source: string;

  narrative: string;

  findings: {
    title: string;
  }[];
};

import type { NwsWarning } from "./nwsWarnings";

type BuildWeatherEventsRequest = {
  stormEvents: StormEvent[];
  nwsWarnings: NwsWarning[];
  dateOfLoss: string;
};

function getDaysFromLoss(
  eventDate: string,
  dateOfLoss: string
): number {
  const event = new Date(`${eventDate}T12:00:00Z`);
  const loss = new Date(`${dateOfLoss}T12:00:00Z`);

  return Math.round(
    (event.getTime() - loss.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function getEventType(
  eventType: string
): UnifiedWeatherEvent["type"] {
  const type = eventType.toLowerCase();

  if (type.includes("hail")) {
    return "hail";
  }

  if (type.includes("wind")) {
    return "wind";
  }

  if (
    type.includes("tornado") ||
    type.includes("funnel")
  ) {
    return "tornado";
  }

  if (type.includes("lightning")) {
    return "lightning";
  }

  if (
    type.includes("flood") ||
    type.includes("heavy rain")
  ) {
    return "flood";
  }

  if (type.includes("warning")) {
    return "warning";
  }

  return "other";
}

function getSeverity(
  event: StormEvent
): UnifiedWeatherEvent["severity"] {
  const type = event.eventType.toLowerCase();

  if (
    type.includes("tornado") ||
    type.includes("funnel cloud")
  ) {
    return "high";
  }

  if (type.includes("hail")) {
    if ((event.magnitude ?? 0) >= 1) {
      return "high";
    }

    return "moderate";
  }

  if (
    type.includes("thunderstorm wind") ||
    type.includes("high wind")
  ) {
    if ((event.magnitude ?? 0) >= 50) {
      return "high";
    }

    return "moderate";
  }

  if (
    type.includes("lightning") ||
    type.includes("flash flood")
  ) {
    return "moderate";
  }

  return "low";
}

function getMagnitudeUnit(
  event: StormEvent
): string | null {
  const type = event.eventType.toLowerCase();

  if (event.magnitude === null) {
    return null;
  }

  if (type.includes("hail")) {
    return "in";
  }

  if (type.includes("wind")) {
    return "kt";
  }

  return event.magnitudeType || null;
}

function buildTitle(
  event: StormEvent
): string {
  if (event.magnitude !== null) {
    const unit = getMagnitudeUnit(event);

    return `${event.eventType} — ${event.magnitude}${
      unit ? ` ${unit}` : ""
    }`;
  }

  return event.eventType;
}

function buildSummary(
  event: StormEvent
): string {
  const distance =
    event.distanceMiles.toFixed(1);

  if (event.magnitude !== null) {
    const unit = getMagnitudeUnit(event);

    return `${event.eventType} with a reported magnitude of ${
      event.magnitude
    }${unit ? ` ${unit}` : ""}, located approximately ${distance} miles from the property.`;
  }

  return `${event.eventType} reported approximately ${distance} miles from the property.`;
}

export function buildUnifiedWeatherEvents({
  stormEvents,
  nwsWarnings,
  dateOfLoss,
}: BuildWeatherEventsRequest): UnifiedWeatherEvent[] {
  const events = stormEvents.map(
    (event): UnifiedWeatherEvent => ({
      id: event.id,

      date: event.date,

      type: getEventType(event.eventType),

      eventType: event.eventType,

      title: buildTitle(event),

      summary: buildSummary(event),

      severity: getSeverity(event),

      daysFromLoss: getDaysFromLoss(
        event.date,
        dateOfLoss
      ),

      latitude: event.latitude,
      longitude: event.longitude,

      distanceMiles: event.distanceMiles,

      magnitude: event.magnitude,

      magnitudeUnit:
        getMagnitudeUnit(event),

      source: "NOAA Storm Events",

      narrative: event.narrative,

      findings: [
        {
          title: event.eventType,
        },
      ],
    })
  );

  return events.sort((a, b) => {
    const dateDistanceA =
      Math.abs(a.daysFromLoss);

    const dateDistanceB =
      Math.abs(b.daysFromLoss);

    if (dateDistanceA !== dateDistanceB) {
      return dateDistanceA - dateDistanceB;
    }

    return (
      a.distanceMiles -
      b.distanceMiles
    );
  });
}