import { ReportModel } from "@/types/report";

const PRIMARY_RADIUS_MILES = 5;
const FALLBACK_RADIUS_MILES = 25;
const REVIEW_WINDOW_DAYS = 31;

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

function getSeverity(
  eventType: string
): "low" | "moderate" | "high" {
  const type = eventType.toLowerCase();

  if (
    type.includes("tornado") ||
    type.includes("funnel") ||
    type.includes("hail") ||
    type.includes("thunderstorm wind") ||
    type.includes("high wind")
  ) {
    return "high";
  }

  if (
    type.includes("strong wind") ||
    type.includes("heavy rain") ||
    type.includes("flash flood") ||
    type.includes("lightning")
  ) {
    return "moderate";
  }

  return "low";
}

function getMapEventType(event: any): string {
  if (event.type) {
    return event.type;
  }

  const type = String(
    event.eventType ?? ""
  ).toLowerCase();

  if (type.includes("hail")) return "hail";
  if (type.includes("wind")) return "wind";

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

function buildStormEventSummary(
  event: any
): string {
  const eventType =
    event.eventType ?? "Weather Event";

  const distance =
    typeof event.distanceMiles === "number"
      ? event.distanceMiles.toFixed(1)
      : null;

  let description = eventType;

  if (
    event.magnitude !== null &&
    event.magnitude !== undefined
  ) {
    if (eventType === "Hail") {
      description =
        `${event.magnitude}" Hail`;
    } else if (
      eventType === "Thunderstorm Wind" ||
      eventType === "High Wind" ||
      eventType === "Strong Wind"
    ) {
      const unit =
        event.magnitudeUnit ??
        event.magnitudeType ??
        "kt";

      description =
        `${eventType} — ${event.magnitude} ${unit}`;
    }
  }

  if (distance !== null) {
    return `${description} • ${distance} mi from property`;
  }

  return description;
}

export function buildReportModel(
  report: any
): ReportModel {
  const snapshot = report?.snapshot;

  const allStormEvents =
    report?.events ?? [];

  const request = report?.request;

  const historical =
    report?.historicalWeather ?? {};

  const observations =
    historical.dailySummaries ?? [];

  /*
   * DATA AVAILABILITY
   *
   * Daily station observations give us an
   * important distinction between:
   *
   * 1. Weather data was returned but no
   *    qualifying nearby storm event exists.
   *
   * 2. No daily observation data was returned.
   */
  const hasObservationData =
    observations.length > 0;

  /*
   * PRIMARY WEATHER AREA
   *
   * Normal WeatherSnap event results include
   * documented events within 5 miles.
   */
  const nearbyEvents =
    allStormEvents.filter(
      (event: any) =>
        typeof event.distanceMiles ===
          "number" &&
        event.distanceMiles <=
          PRIMARY_RADIUS_MILES
    );

  const closestEvent =
    nearbyEvents.length > 0
      ? Math.min(
          ...nearbyEvents.map(
            (event: any) =>
              event.distanceMiles
          )
        )
      : null;

  /*
   * FALLBACK AREA
   *
   * If there are no documented events within
   * 5 miles, show the single closest documented
   * event within 25 miles for context.
   */
  let displayedEvents =
    nearbyEvents;

  let usingClosestEventFallback =
    false;

  if (nearbyEvents.length === 0) {
    const fallbackCandidates =
      allStormEvents
        .filter(
          (event: any) =>
            typeof event.distanceMiles ===
              "number" &&
            event.distanceMiles <=
              FALLBACK_RADIUS_MILES
        )
        .sort(
          (a: any, b: any) =>
            a.distanceMiles -
            b.distanceMiles
        );

    if (
      fallbackCandidates.length > 0
    ) {
      displayedEvents = [
        fallbackCandidates[0],
      ];

      usingClosestEventFallback =
        true;
    }
  }

  /*
   * DAILY STATION WIND
   */
  const highestWind =
    observations.reduce(
      (max: number, obs: any) =>
        Math.max(
          max,
          obs.maxWind5Second ?? 0
        ),
      0
    );

  /*
   * HAIL METRICS
   *
   * Only hail events within the primary
   * 5-mile area populate these metrics.
   */
  const nearbyHailEvents =
    nearbyEvents.filter(
      (event: any) =>
        event.eventType === "Hail"
    );

  const largestHail =
    nearbyHailEvents.reduce(
      (max: number, event: any) =>
        Math.max(
          max,
          event.magnitude ?? 0
        ),
      0
    );

  const closestHail =
    nearbyHailEvents.length > 0
      ? Math.min(
          ...nearbyHailEvents.map(
            (event: any) =>
              event.distanceMiles
          )
        )
      : null;

  const tornadoReports =
    nearbyEvents.filter(
      (event: any) =>
        event.eventType === "Tornado" ||
        event.eventType ===
          "Funnel Cloud"
    ).length;

  /*
   * REPORT TIMELINE
   */
  const timeline =
    displayedEvents.map(
      (event: any, index: number) => ({
        id:
          event.id ??
          `event-${index + 1}`,

        date: event.date,

        type:
          getMapEventType(event),

        summary:
          buildStormEventSummary(event),

        severity:
          event.severity ??
          getSeverity(
            event.eventType ?? ""
          ),

        daysFromLoss:
          typeof event.daysFromLoss ===
          "number"
            ? event.daysFromLoss
            : getDaysFromLoss(
                event.date,
                request?.dateOfLoss ??
                  event.date
              ),

        latitude:
          event.latitude,

        longitude:
          event.longitude,

        eventType:
          event.eventType,

        magnitude:
          event.magnitude,

        magnitudeType:
          event.magnitudeType ??
          event.magnitudeUnit,

        distanceMiles:
          event.distanceMiles,

        source:
          event.source,

        narrative:
          event.narrative,

        findings: [
          {
            title:
              event.eventType ??
              "Weather Event",
          },
        ],
      })
    );

  /*
   * FACTUAL REPORT SUMMARY
   */
  let summaryTitle =
    "No Documented Significant Weather Events";

  let summaryDescription =
    `WeatherSnap reviewed the selected Date of Loss and the surrounding ±15-day period (${REVIEW_WINDOW_DAYS} calendar days). No qualifying documented storm events were identified within 5 miles of the property during this review period.`;

  let context =
    "Available weather records were reviewed for the selected period. No qualifying documented storm events were identified within 5 miles of the property.";

  /*
   * Data availability is different from
   * a legitimate no-event result.
   */
  if (!hasObservationData) {
    summaryTitle =
      "Weather Data Availability Limited";

    summaryDescription =
      `Daily weather observation data was not available for the selected Date of Loss and surrounding ±15-day review period. The absence of observations should not be interpreted as confirmation that no weather activity occurred.`;

    context =
      "Available data for the selected review period was limited. No conclusion regarding the absence of weather activity should be based solely on unavailable observation records.";
  } else if (nearbyEvents.length > 0) {
    summaryTitle =
      "Documented Weather Activity Identified";

    summaryDescription =
      `${nearbyEvents.length} documented weather event${
        nearbyEvents.length === 1
          ? ""
          : "s"
      } identified within 5 miles of the property during the selected ${REVIEW_WINDOW_DAYS}-day review period.`;

    context =
      "Documented weather activity was identified near the property during the selected review period. Event locations, magnitudes, distances, and source information are shown where available.";
  } else if (
    usingClosestEventFallback &&
    displayedEvents.length > 0
  ) {
    const closest =
      displayedEvents[0];

    summaryTitle =
      "No Documented Events Within 5 Miles";

    summaryDescription =
      `No documented storm events were identified within 5 miles of the property during the selected ${REVIEW_WINDOW_DAYS}-day review period. The closest documented event was ${closest.distanceMiles.toFixed(
        1
      )} miles from the property.`;

    context =
      `No documented events were identified within 5 miles of the property. For additional context, the closest documented event during the review period was a ${closest.eventType} approximately ${closest.distanceMiles.toFixed(
        1
      )} miles from the property.`;
  }

  return {
    reportId:
      report?.reportId ??
      `WS-${Date.now()
        .toString()
        .slice(-8)}`,

    property: {
      address:
        request?.formattedAddress ?? "",

      dateOfLoss:
        request?.dateOfLoss ?? "",

      searchWindowStart:
        historical.windowStart ?? "",

      searchWindowEnd:
        historical.windowEnd ?? "",
    },

    summary: {
      title:
        summaryTitle,

      description:
        summaryDescription,

      findings:
        timeline
          .slice(0, 5)
          .map((event: any) => ({
            summary:
              event.summary,

            date:
              event.date,
          })),
    },

    metrics: [
      {
        title: "Closest Event",
        value:
          closestEvent !== null
            ? closestEvent.toFixed(1)
            : "--",
        subtitle: "mi",
      },

      {
        title: "Closest Hail",
        value:
          closestHail !== null
            ? closestHail.toFixed(1)
            : "--",
        subtitle: "mi",
      },

      {
        title: "Largest Hail",
        value:
          largestHail > 0
            ? largestHail.toFixed(2)
            : "--",
        subtitle: "in",
      },

      {
        title: "Highest Wind",
        value:
          highestWind > 0
            ? highestWind.toFixed(0)
            : "--",
        subtitle: "mph",
      },

      {
        title: "Tornado Reports",
        value:
          tornadoReports,
      },

      {
        title: "Documented Events",
        value:
          nearbyEvents.length,
      },
    ],

    map: {
      centerLatitude:
        request?.latitude ?? 0,

      centerLongitude:
        request?.longitude ?? 0,

      zoom: 11,

      bounds: {
        north:
          (request?.latitude ?? 0) + 0.08,

        south:
          (request?.latitude ?? 0) - 0.08,

        east:
          (request?.longitude ?? 0) + 0.08,

        west:
          (request?.longitude ?? 0) - 0.08,
      },

      propertyLatitude:
        request?.latitude ?? 0,

      propertyLongitude:
        request?.longitude ?? 0,

      markers: [],
    },

    timeline,

    context:
      context ||
      snapshot?.nearbyActivity ||
      snapshot?.conclusion ||
      "",
  };
}