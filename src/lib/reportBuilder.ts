import { ReportModel } from "@/types/report";

const PRIMARY_RADIUS_MILES = 5;
const FALLBACK_RADIUS_MILES = 25;

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

  const type = String(event.eventType ?? "").toLowerCase();

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

function buildStormEventSummary(event: any): string {
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
      description = `${event.magnitude}" Hail`;
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
  const allStormEvents = report?.events ?? [];
  const request = report?.request;
  const historical =
    report?.historicalWeather ?? {};

  const observations =
    historical.dailySummaries ?? [];

  /*
   * NORMAL SNAPSHOT:
   * Show events within 5 miles.
   */
  const nearbyEvents = allStormEvents.filter(
    (event: any) =>
      typeof event.distanceMiles === "number" &&
      event.distanceMiles <= PRIMARY_RADIUS_MILES
  );

  /*
   * FALLBACK:
   * If nothing happened within 5 miles,
   * show only the single closest documented
   * event within 25 miles.
   */
  let displayedEvents = nearbyEvents;

  let usingClosestEventFallback = false;

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

    if (fallbackCandidates.length > 0) {
      displayedEvents = [
        fallbackCandidates[0],
      ];

      usingClosestEventFallback = true;
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
   * Use nearby events only.
   * A hail report 20 miles away should not
   * populate the normal Snapshot hail boxes.
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
   * BUILD REPORT TIMELINE
   */
  const timeline =
    displayedEvents.map(
      (event: any, index: number) => ({
        id:
          event.id ??
          `event-${index + 1}`,

        date: event.date,

        /*
         * IMPORTANT:
         * Mapbox uses this field to assign
         * event marker colors.
         */
        type: getMapEventType(event),

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

        latitude: event.latitude,
        longitude: event.longitude,

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
   * FACTUAL SUMMARY LANGUAGE
   */
  let summaryTitle =
    "No Documented Nearby Weather Events";

  let summaryDescription =
    "No documented storm events were identified within 5 miles of the property during the selected 3-day review window.";

  let context =
    "No documented storm events were identified within 5 miles of the property during the selected review window.";

  if (nearbyEvents.length > 0) {
    summaryTitle =
      "Documented Weather Activity Identified";

    summaryDescription =
      `${nearbyEvents.length} documented weather event${
        nearbyEvents.length === 1
          ? ""
          : "s"
      } identified within 5 miles of the property during the selected 3-day review window.`;

    context =
      "Documented weather activity was identified near the property during the selected review window. Event locations, magnitudes, distances, and source information are shown where available.";
  } else if (
    usingClosestEventFallback &&
    displayedEvents.length > 0
  ) {
    const closest =
      displayedEvents[0];

    summaryTitle =
      "No Documented Events Within 5 Miles";

    summaryDescription =
      `No documented storm events were identified within 5 miles of the property during the selected 3-day review window. The closest documented event was ${closest.distanceMiles.toFixed(
        1
      )} miles away.`;

    context =
      `No documented events were identified within 5 miles of the property. For context, the closest documented event during the review window was a ${closest.eventType} approximately ${closest.distanceMiles.toFixed(
        1
      )} miles away.`;
  }

  return {
    reportId: `WS-${Date.now()
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
      title: summaryTitle,

      description:
        summaryDescription,

      findings: timeline
        .slice(0, 5)
        .map((event: any) => ({
          summary: event.summary,
          date: event.date,
        })),
    },

    metrics: [
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
        value: tornadoReports,
      },

      {
        title: "Warnings",
        value: 0,
      },

      {
        title: "Total Events",
        value: nearbyEvents.length,
      },
    ],

    map: {
      radiusMiles:
        PRIMARY_RADIUS_MILES,

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