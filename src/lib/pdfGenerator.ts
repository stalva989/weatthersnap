import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

import type {
  ReportModel,
  TimelineItem,
} from "@/types/report";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

const NAVY = rgb(0.08, 0.18, 0.30);
const BLUE = rgb(0.12, 0.38, 0.65);
const ORANGE = rgb(0.95, 0.38, 0.08);
const DARK = rgb(0.12, 0.16, 0.22);
const GRAY = rgb(0.42, 0.47, 0.54);
const LIGHT_GRAY = rgb(0.94, 0.95, 0.97);
const BORDER = rgb(0.82, 0.84, 0.87);
const WHITE = rgb(1, 1, 1);

function formatDate(value: string): string {
  if (!value) return "--";

  const date = new Date(
    `${value}T12:00:00Z`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

function truncate(
  text: string,
  maxLength: number
): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(
    0,
    maxLength - 3
  )}...`;
}

function getMetricValue(
  model: ReportModel,
  index: number
): string {
  const metric = model.metrics[index];

  if (!metric) return "--";

  const value =
    metric.value === ""
      ? "--"
      : String(metric.value);

  if (
    value === "--" ||
    !metric.subtitle
  ) {
    return value;
  }

  return `${value} ${metric.subtitle}`;
}

async function getStaticMap(
  model: ReportModel
): Promise<ArrayBuffer | null> {
  try {
    const token =
      process.env
        .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ??
      process.env
        .NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      console.warn(
        "Mapbox token unavailable for PDF."
      );

      return null;
    }

    const longitude =
      model.map.propertyLongitude;

    const latitude =
      model.map.propertyLatitude;

    const propertyMarker =
      `pin-s-home+16324f(${longitude},${latitude})`;

    const eventMarkers =
      model.timeline
        .filter(
          (event: TimelineItem) =>
            typeof event.longitude ===
              "number" &&
            typeof event.latitude ===
              "number"
        )
        .slice(0, 8)
        .map(
          (
            event: TimelineItem,
            index: number
          ) =>
            `pin-s-${
              index + 1
            }+f97316(${event.longitude},${event.latitude})`
        );

    const overlays = [
      propertyMarker,
      ...eventMarkers,
    ].join(",");

    const mapUrl =
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
      `${overlays}/` +
      `${longitude},${latitude},10.5,0/` +
      `900x460@2x` +
      `?access_token=${token}`;

    const response =
      await fetch(mapUrl, {
        cache: "no-store",
      });

    if (!response.ok) {
      console.error(
        "Mapbox static map failed:",
        response.status
      );

      return null;
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error(
      "Unable to create PDF map:",
      error
    );

    return null;
  }
}

export async function generateWeatherSnapPdf(
  model: ReportModel
): Promise<Uint8Array> {
  const pdf =
    await PDFDocument.create();

  const page =
    pdf.addPage([
      PAGE_WIDTH,
      PAGE_HEIGHT,
    ]);

  const regular =
    await pdf.embedFont(
      StandardFonts.Helvetica
    );

  const bold =
    await pdf.embedFont(
      StandardFonts.HelveticaBold
    );

  /*
   * HEADER
   */
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 82,
    width: PAGE_WIDTH,
    height: 82,
    color: NAVY,
  });

  page.drawText(
    "WeatherSnap",
    {
      x: 32,
      y: 747,
      size: 24,
      font: bold,
      color: WHITE,
    }
  );

  page.drawText(
    "WEATHER SNAPSHOT",
    {
      x: 32,
      y: 728,
      size: 8,
      font: bold,
      color: rgb(
        0.72,
        0.82,
        0.93
      ),
    }
  );

  page.drawText(
    "Weather Intelligence. Instantly.",
    {
      x: 32,
      y: 714,
      size: 8,
      font: regular,
      color: rgb(
        0.72,
        0.82,
        0.93
      ),
    }
  );

  page.drawText(
    `Report ID: ${model.reportId}`,
    {
      x: 420,
      y: 746,
      size: 8,
      font: bold,
      color: WHITE,
    }
  );

  /*
   * PROPERTY INFORMATION
   */
  page.drawText(
    truncate(
      model.property.address,
      82
    ),
    {
      x: 32,
      y: 686,
      size: 12,
      font: bold,
      color: DARK,
    }
  );

  page.drawText(
    `Date of Loss: ${formatDate(
      model.property.dateOfLoss
    )}`,
    {
      x: 32,
      y: 669,
      size: 8.5,
      font: regular,
      color: GRAY,
    }
  );

  page.drawText(
    `Weather Review: ${formatDate(
      model.property
        .searchWindowStart
    )} - ${formatDate(
      model.property
        .searchWindowEnd
    )}`,
    {
      x: 205,
      y: 669,
      size: 8.5,
      font: regular,
      color: GRAY,
    }
  );

  /*
   * SUMMARY
   */
  page.drawRectangle({
    x: 32,
    y: 585,
    width: 548,
    height: 66,
    color: LIGHT_GRAY,
    borderColor: BORDER,
    borderWidth: 0.7,
  });

  page.drawText(
    model.summary.title,
    {
      x: 46,
      y: 628,
      size: 11,
      font: bold,
      color: NAVY,
    }
  );

  const summary =
    truncate(
      model.summary.description,
      245
    );

  const summaryLines =
    summary.match(
      /.{1,95}(?:\s|$)/g
    ) ?? [summary];

  summaryLines
    .slice(0, 3)
    .forEach(
      (
        line,
        index
      ) => {
        page.drawText(
          line.trim(),
          {
            x: 46,
            y:
              612 -
              index * 11,
            size: 8,
            font: regular,
            color: DARK,
          }
        );
      }
    );

  /*
   * METRICS
   */
  const metricTitles = [
    "Closest Event",
    "Closest Hail",
    "Largest Hail",
    "Highest Wind",
    "Tornado Reports",
    "Documented Events",
  ];

  const metricWidth = 86;
  const metricGap = 6;

  metricTitles.forEach(
    (title, index) => {
      const x =
        32 +
        index *
          (metricWidth +
            metricGap);

      page.drawRectangle({
        x,
        y: 522,
        width: metricWidth,
        height: 48,
        color: WHITE,
        borderColor: BORDER,
        borderWidth: 0.6,
      });

      page.drawText(
        title,
        {
          x: x + 7,
          y: 555,
          size: 6.5,
          font: bold,
          color: GRAY,
        }
      );

      page.drawText(
        getMetricValue(
          model,
          index
        ),
        {
          x: x + 7,
          y: 536,
          size: 12,
          font: bold,
          color:
            index === 2 ||
            index === 3
              ? ORANGE
              : NAVY,
        }
      );
    }
  );

  /*
   * MAP
   */
  page.drawText(
    "DOCUMENTED WEATHER ACTIVITY",
    {
      x: 32,
      y: 499,
      size: 8,
      font: bold,
      color: NAVY,
    }
  );

  const mapData =
    await getStaticMap(model);

  if (mapData) {
    try {
      const image =
        await pdf.embedPng(
          mapData
        );

      page.drawImage(image, {
        x: 32,
        y: 327,
        width: 278,
        height: 155,
      });
    } catch {
      page.drawRectangle({
        x: 32,
        y: 327,
        width: 278,
        height: 155,
        color: LIGHT_GRAY,
      });
    }
  } else {
    page.drawRectangle({
      x: 32,
      y: 327,
      width: 278,
      height: 155,
      color: LIGHT_GRAY,
      borderColor: BORDER,
      borderWidth: 0.6,
    });

    page.drawText(
      "Static map unavailable.",
      {
        x: 95,
        y: 402,
        size: 8,
        font: regular,
        color: GRAY,
      }
    );
  }

  /*
   * EVENT TIMELINE
   */
  page.drawText(
    "EVENT TIMELINE",
    {
      x: 330,
      y: 479,
      size: 8,
      font: bold,
      color: NAVY,
    }
  );

  if (model.timeline.length === 0) {
    page.drawText(
      "No qualifying documented events",
      {
        x: 330,
        y: 456,
        size: 9,
        font: bold,
        color: DARK,
      }
    );

    page.drawText(
      "were identified within the primary",
      {
        x: 330,
        y: 443,
        size: 8,
        font: regular,
        color: GRAY,
      }
    );

    page.drawText(
      "search radius during this review period.",
      {
        x: 330,
        y: 431,
        size: 8,
        font: regular,
        color: GRAY,
      }
    );
  } else {
    model.timeline
      .slice(0, 6)
      .forEach(
        (
          event,
          index
        ) => {
          const y =
            458 -
            index * 25;

          page.drawText(
            formatDate(
              event.date
            ),
            {
              x: 330,
              y,
              size: 7,
              font: bold,
              color: BLUE,
            }
          );

          page.drawText(
            truncate(
              event.summary,
              48
            ),
            {
              x: 330,
              y: y - 11,
              size: 7.5,
              font: regular,
              color: DARK,
            }
          );
        }
      );
  }

  /*
   * WEATHER CONTEXT
   */
  page.drawRectangle({
    x: 32,
    y: 230,
    width: 548,
    height: 77,
    color: rgb(
      0.97,
      0.98,
      0.99
    ),
    borderColor: BORDER,
    borderWidth: 0.6,
  });

  page.drawText(
    "WEATHER CONTEXT",
    {
      x: 46,
      y: 287,
      size: 8,
      font: bold,
      color: NAVY,
    }
  );

  const context =
    truncate(
      model.context,
      285
    );

  const contextLines =
    context.match(
      /.{1,100}(?:\s|$)/g
    ) ?? [context];

  contextLines
    .slice(0, 4)
    .forEach(
      (
        line,
        index
      ) => {
        page.drawText(
          line.trim(),
          {
            x: 46,
            y:
              271 -
              index * 11,
            size: 7.5,
            font: regular,
            color: DARK,
          }
        );
      }
    );

  /*
   * SOURCES
   */
  page.drawText(
    "DATA SOURCES",
    {
      x: 32,
      y: 205,
      size: 7.5,
      font: bold,
      color: NAVY,
    }
  );

  page.drawText(
    "NOAA / NCEI Daily Summaries | NOAA Storm Events | SPC Storm Reports | National Weather Service",
    {
      x: 32,
      y: 191,
      size: 6.8,
      font: regular,
      color: GRAY,
    }
  );

  /*
   * DISCLAIMER
   */
  page.drawLine({
    start: {
      x: 32,
      y: 170,
    },
    end: {
      x: 580,
      y: 170,
    },
    thickness: 0.6,
    color: BORDER,
  });

  page.drawText(
    "REPORT INFORMATION",
    {
      x: 32,
      y: 153,
      size: 7,
      font: bold,
      color: NAVY,
    }
  );

  const disclaimer =
    "WeatherSnap summarizes documented weather information from available governmental and meteorological sources. " +
    "This report does not determine causation, coverage, damage, or the exact conditions experienced at a structure.";

  const disclaimerLines =
    disclaimer.match(
      /.{1,115}(?:\s|$)/g
    ) ?? [disclaimer];

  disclaimerLines
    .slice(0, 3)
    .forEach(
      (
        line,
        index
      ) => {
        page.drawText(
          line.trim(),
          {
            x: 32,
            y:
              139 -
              index * 10,
            size: 6.6,
            font: regular,
            color: GRAY,
          }
        );
      }
    );

  /*
   * FOOTER
   */
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: 36,
    color: NAVY,
  });

  page.drawText(
    "WeatherSnap.app",
    {
      x: 32,
      y: 14,
      size: 7.5,
      font: bold,
      color: WHITE,
    }
  );

  page.drawText(
    model.reportId,
    {
      x: 485,
      y: 14,
      size: 7,
      font: regular,
      color: WHITE,
    }
  );

  return await pdf.save();
}