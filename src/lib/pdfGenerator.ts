import {
  PDFDocument,
  PDFFont,
  PDFPage,
  PDFString,
  StandardFonts,
  rgb,
} from "pdf-lib";

import QRCode from "qrcode";

import type {
  ReportModel,
  TimelineItem,
} from "@/types/report";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

const NAVY = rgb(0.055, 0.13, 0.23);
const BLUE = rgb(0.10, 0.34, 0.62);
const ORANGE = rgb(0.94, 0.39, 0.08);

const DARK = rgb(0.12, 0.15, 0.20);
const GRAY = rgb(0.39, 0.44, 0.50);
const MEDIUM_GRAY = rgb(0.58, 0.62, 0.67);

const LIGHT_GRAY = rgb(0.955, 0.965, 0.975);
const VERY_LIGHT_BLUE = rgb(0.955, 0.975, 0.99);

const BORDER = rgb(0.83, 0.86, 0.89);
const WHITE = rgb(1, 1, 1);

function formatDate(value: string): string {
  if (!value) {
    return "--";
  }

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
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(
    0,
    maxLength - 3
  )}...`;
}

function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  if (!text) {
    return [];
  }

  const words = text.split(/\s+/);

  const lines: string[] = [];

  let currentLine = "";

  for (const word of words) {
    const candidate =
      currentLine.length === 0
        ? word
        : `${currentLine} ${word}`;

    const width =
      font.widthOfTextAtSize(
        candidate,
        fontSize
      );

    if (
      width <= maxWidth ||
      currentLine.length === 0
    ) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function getMetricValue(
  model: ReportModel,
  index: number
): string {
  const metric = model.metrics[index];

  if (!metric) {
    return "--";
  }

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

function getDocumentedEventCount(
  model: ReportModel
): number {
  const metric =
    model.metrics.find(
      (item) =>
        item.title ===
        "Documented Events"
    );

  if (!metric) {
    return model.timeline.length;
  }

  const count =
    Number(metric.value);

  return Number.isFinite(count)
    ? count
    : model.timeline.length;
}

function drawSectionLabel(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont
) {
  page.drawText(text, {
    x,
    y,
    size: 7,
    font,
    color: NAVY,
  });
}

function addLinkAnnotation(
  pdf: PDFDocument,
  page: PDFPage,
  url: string,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const annotation =
    pdf.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [
        x,
        y,
        x + width,
        y + height,
      ],
      Border: [0, 0, 0],
      A: {
        Type: "Action",
        S: "URI",
        URI: PDFString.of(url),
      },
    });

  const annotationRef =
    pdf.context.register(
      annotation
    );

  page.node.addAnnot(
    annotationRef
  );
}

function getMarkerColor(
  event: TimelineItem
): string {
  const type =
    event.type?.toLowerCase() ??
    event.eventType?.toLowerCase() ??
    "";

  if (type.includes("hail")) {
    return "3b82f6";
  }

  if (type.includes("wind")) {
    return "f97316";
  }

  if (
    type.includes("tornado") ||
    type.includes("funnel")
  ) {
    return "dc2626";
  }

  if (type.includes("warning")) {
    return "eab308";
  }

  if (type.includes("lightning")) {
    return "7c3aed";
  }

  return "64748b";
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

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return null;
    }

    const propertyMarker =
      `pin-l-home+14263d(${longitude},${latitude})`;

    const eventMarkers =
      model.timeline
        .filter(
          (event) =>
            typeof event.longitude ===
              "number" &&
            typeof event.latitude ===
              "number"
        )
        .slice(0, 6)
        .map((event, index) => {
          const color =
            getMarkerColor(event);

          return (
            `pin-s-${index + 1}+${color}` +
            `(${event.longitude},${event.latitude})`
          );
        });

    const overlays = [
      propertyMarker,
      ...eventMarkers,
    ].join(",");

    const mapUrl =
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
      `${overlays}/auto/` +
      `1000x620@2x` +
      `?padding=55` +
      `&access_token=${token}`;

    const response =
      await fetch(mapUrl, {
        cache: "no-store",
      });

    if (!response.ok) {
      console.error(
        "Mapbox static map failed:",
        response.status,
        await response.text()
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

async function getVerificationQrCode(
  verificationUrl: string
): Promise<Uint8Array | null> {
  try {
    const dataUrl =
      await QRCode.toDataURL(
        verificationUrl,
        {
          errorCorrectionLevel: "M",
          margin: 1,
          width: 300,
        }
      );

    const base64 =
      dataUrl.split(",")[1];

    if (!base64) {
      return null;
    }

    return Uint8Array.from(
      Buffer.from(
        base64,
        "base64"
      )
    );
  } catch (error) {
    console.error(
      "Unable to generate verification QR code:",
      error
    );

    return null;
  }
}

function drawTimelineEvent(
  page: PDFPage,
  event: TimelineItem,
  index: number,
  x: number,
  y: number,
  width: number,
  regular: PDFFont,
  bold: PDFFont
) {
  const markerRadius = 9;

  page.drawCircle({
    x: x + markerRadius,
    y: y - 1,
    size: markerRadius,
    color: NAVY,
  });

  const number =
    String(index + 1);

  const numberWidth =
    bold.widthOfTextAtSize(
      number,
      7
    );

  page.drawText(number, {
    x:
      x +
      markerRadius -
      numberWidth / 2,
    y: y - 3.5,
    size: 7,
    font: bold,
    color: WHITE,
  });

  page.drawText(
    formatDate(event.date),
    {
      x: x + 25,
      y: y + 5,
      size: 7.2,
      font: bold,
      color: BLUE,
    }
  );

  const summary =
    truncate(
      event.summary,
      88
    );

  const summaryLines =
    wrapText(
      summary,
      regular,
      7.2,
      width - 26
    ).slice(0, 2);

  summaryLines.forEach(
    (line, lineIndex) => {
      page.drawText(line, {
        x: x + 25,
        y:
          y -
          7 -
          lineIndex * 9,
        size: 7.2,
        font: regular,
        color: DARK,
      });
    }
  );

  page.drawLine({
    start: {
      x: x + 25,
      y: y - 25,
    },
    end: {
      x: x + width,
      y: y - 25,
    },
    thickness: 0.4,
    color: BORDER,
  });
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
    y: 702,
    width: PAGE_WIDTH,
    height: 90,
    color: NAVY,
  });

  page.drawText(
    "WeatherSnap",
    {
      x: 32,
      y: 750,
      size: 25,
      font: bold,
      color: WHITE,
    }
  );

  page.drawText(
    "WEATHER SNAPSHOT",
    {
      x: 32,
      y: 731,
      size: 8,
      font: bold,
      color: rgb(
        0.72,
        0.82,
        0.92
      ),
    }
  );

  page.drawText(
    "Weather Intelligence. Instantly.",
    {
      x: 32,
      y: 716,
      size: 8,
      font: regular,
      color: rgb(
        0.72,
        0.82,
        0.92
      ),
    }
  );

  page.drawText(
    "REPORT ID",
    {
      x: 465,
      y: 754,
      size: 6.5,
      font: bold,
      color: rgb(
        0.65,
        0.76,
        0.87
      ),
    }
  );

  page.drawText(
    model.reportId,
    {
      x: 465,
      y: 739,
      size: 9,
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
      78
    ),
    {
      x: 32,
      y: 676,
      size: 13,
      font: bold,
      color: DARK,
    }
  );

  page.drawText(
    "DATE OF LOSS",
    {
      x: 32,
      y: 655,
      size: 6.5,
      font: bold,
      color: MEDIUM_GRAY,
    }
  );

  page.drawText(
    formatDate(
      model.property.dateOfLoss
    ),
    {
      x: 32,
      y: 641,
      size: 9.5,
      font: bold,
      color: NAVY,
    }
  );

  page.drawText(
    "WEATHER REVIEW PERIOD",
    {
      x: 175,
      y: 655,
      size: 6.5,
      font: bold,
      color: MEDIUM_GRAY,
    }
  );

  page.drawText(
    `${formatDate(
      model.property.searchWindowStart
    )} - ${formatDate(
      model.property.searchWindowEnd
    )}`,
    {
      x: 175,
      y: 641,
      size: 9,
      font: regular,
      color: DARK,
    }
  );

  page.drawText(
    "SEARCH AREA",
    {
      x: 445,
      y: 655,
      size: 6.5,
      font: bold,
      color: MEDIUM_GRAY,
    }
  );

  page.drawText(
    "Primary: 5 miles",
    {
      x: 445,
      y: 641,
      size: 9,
      font: regular,
      color: DARK,
    }
  );

  /*
   * SUMMARY
   */

  page.drawRectangle({
    x: 32,
    y: 567,
    width: 548,
    height: 56,
    color: VERY_LIGHT_BLUE,
    borderColor: rgb(
      0.72,
      0.82,
      0.91
    ),
    borderWidth: 0.7,
  });

  page.drawRectangle({
    x: 32,
    y: 567,
    width: 4,
    height: 56,
    color: BLUE,
  });

  page.drawText(
    model.summary.title,
    {
      x: 46,
      y: 603,
      size: 10.5,
      font: bold,
      color: NAVY,
    }
  );

  const summaryLines =
    wrapText(
      model.summary.description,
      regular,
      8,
      515
    ).slice(0, 2);

  summaryLines.forEach(
    (line, index) => {
      page.drawText(line, {
        x: 46,
        y:
          586 -
          index * 10,
        size: 8,
        font: regular,
        color: DARK,
      });
    }
  );

  /*
   * METRICS
   */

  const metricCount = 6;
  const metricGap = 6;
  const totalMetricWidth = 548;

  const metricWidth =
    (totalMetricWidth -
      metricGap *
        (metricCount - 1)) /
    metricCount;

  const metricY = 504;
  const metricHeight = 48;

  model.metrics
    .slice(0, metricCount)
    .forEach(
      (metric, index) => {
        const x =
          32 +
          index *
            (metricWidth +
              metricGap);

        page.drawRectangle({
          x,
          y: metricY,
          width: metricWidth,
          height: metricHeight,
          color: WHITE,
          borderColor: BORDER,
          borderWidth: 0.7,
        });

        const titleLines =
          wrapText(
            metric.title.toUpperCase(),
            bold,
            5.7,
            metricWidth - 12
          ).slice(0, 2);

        titleLines.forEach(
          (line, lineIndex) => {
            page.drawText(
              line,
              {
                x: x + 7,
                y:
                  metricY +
                  35 -
                  lineIndex *
                    6.5,
                size: 5.7,
                font: bold,
                color: MEDIUM_GRAY,
              }
            );
          }
        );

        const value =
          getMetricValue(
            model,
            index
          );

        const valueColor =
          metric.title
            .toLowerCase()
            .includes("wind") ||
          metric.title
            .toLowerCase()
            .includes("hail")
            ? ORANGE
            : NAVY;

        page.drawText(
          value,
          {
            x: x + 7,
            y: metricY + 9,
            size:
              value.length > 9
                ? 10
                : 12,
            font: bold,
            color: valueColor,
          }
        );
      }
    );

  /*
   * MAP + TIMELINE
   */

  drawSectionLabel(
    page,
    "DOCUMENTED WEATHER ACTIVITY",
    32,
    482,
    bold
  );

  const mapX = 32;
  const mapY = 286;
  const mapWidth = 318;
  const mapHeight = 180;

  const timelineX = 370;
  const timelineWidth = 210;

  page.drawRectangle({
    x: mapX,
    y: mapY,
    width: mapWidth,
    height: mapHeight,
    color: LIGHT_GRAY,
    borderColor: BORDER,
    borderWidth: 0.7,
  });

  const mapData =
    await getStaticMap(model);

  if (mapData) {
    try {
      const image =
        await pdf.embedPng(
          mapData
        );

      page.drawImage(image, {
        x: mapX + 1,
        y: mapY + 1,
        width:
          mapWidth - 2,
        height:
          mapHeight - 2,
      });
    } catch (error) {
      console.error(
        "Unable to embed static map:",
        error
      );
    }
  } else {
    page.drawText(
      "Static map unavailable",
      {
        x: mapX + 92,
        y:
          mapY +
          mapHeight / 2,
        size: 8,
        font: regular,
        color: GRAY,
      }
    );
  }

  page.drawText(
    "Property and documented event locations shown for geographic context.",
    {
      x: mapX,
      y: 275,
      size: 5.8,
      font: regular,
      color: MEDIUM_GRAY,
    }
  );

  /*
   * TIMELINE
   */

  drawSectionLabel(
    page,
    "EVENT TIMELINE",
    timelineX,
    464,
    bold
  );

  if (
    model.timeline.length === 0
  ) {
    page.drawRectangle({
      x: timelineX,
      y: 345,
      width: timelineWidth,
      height: 100,
      color: LIGHT_GRAY,
      borderColor: BORDER,
      borderWidth: 0.6,
    });

    page.drawText(
      "No qualifying documented",
      {
        x: timelineX + 12,
        y: 406,
        size: 8,
        font: bold,
        color: DARK,
      }
    );

    page.drawText(
      "events were identified within",
      {
        x: timelineX + 12,
        y: 393,
        size: 7.5,
        font: regular,
        color: GRAY,
      }
    );

    page.drawText(
      "the primary search area.",
      {
        x: timelineX + 12,
        y: 381,
        size: 7.5,
        font: regular,
        color: GRAY,
      }
    );
  } else {
    const eventsToShow =
      model.timeline.slice(0, 6);

    eventsToShow.forEach(
      (event, index) => {
        drawTimelineEvent(
          page,
          event,
          index,
          timelineX,
          441 -
            index * 30,
          timelineWidth,
          regular,
          bold
        );
      }
    );

    const totalDocumentedEvents =
      getDocumentedEventCount(
        model
      );

    const remaining =
      Math.max(
        0,
        totalDocumentedEvents -
          eventsToShow.length
      );

    if (remaining > 0) {
      page.drawText(
        `+ ${remaining} additional documented event${
          remaining === 1
            ? ""
            : "s"
        } during the review period`,
        {
          x: timelineX + 25,
          y: 270,
          size: 6.2,
          font: bold,
          color: BLUE,
        }
      );
    }
  }

  /*
   * WEATHER CONTEXT
   */

  page.drawRectangle({
    x: 32,
    y: 188,
    width: 548,
    height: 68,
    color: LIGHT_GRAY,
    borderColor: BORDER,
    borderWidth: 0.6,
  });

  drawSectionLabel(
    page,
    "WEATHER CONTEXT",
    46,
    239,
    bold
  );

  const contextLines =
    wrapText(
      model.context,
      regular,
      7.3,
      518
    ).slice(0, 4);

  contextLines.forEach(
    (line, index) => {
      page.drawText(line, {
        x: 46,
        y:
          223 -
          index * 9.5,
        size: 7.3,
        font: regular,
        color: DARK,
      });
    }
  );

  /*
   * SOURCES
   */

  drawSectionLabel(
    page,
    "DATA SOURCES",
    32,
    165,
    bold
  );

  page.drawText(
    "NOAA/NCEI Daily Summaries  |  NOAA Storm Events  |  SPC Storm Reports  |  National Weather Service",
    {
      x: 32,
      y: 151,
      size: 6.5,
      font: regular,
      color: GRAY,
    }
  );

  /*
   * REPORT INFORMATION / VERIFICATION
   */

  page.drawLine({
    start: {
      x: 32,
      y: 133,
    },
    end: {
      x: 580,
      y: 133,
    },
    thickness: 0.6,
    color: BORDER,
  });

  drawSectionLabel(
    page,
    "REPORT INFORMATION",
    32,
    118,
    bold
  );

  const verificationUrl =
    `https://weathersnap.app/verify/${model.reportId}`;

  const verificationText =
    `Verify this report: weathersnap.app/verify/${model.reportId}`;

  page.drawText(
    verificationText,
    {
      x: 32,
      y: 104,
      size: 6.5,
      font: bold,
      color: BLUE,
    }
  );

  const verificationWidth =
    bold.widthOfTextAtSize(
      verificationText,
      6.5
    );

  addLinkAnnotation(
    pdf,
    page,
    verificationUrl,
    32,
    101,
    verificationWidth,
    11
  );

  /*
   * QR CODE
   */

  const qrCodeData =
    await getVerificationQrCode(
      verificationUrl
    );

  if (qrCodeData) {
    try {
      const qrImage =
        await pdf.embedPng(
          qrCodeData
        );

      const qrSize = 48;
      const qrX =
        PAGE_WIDTH - 32 - qrSize;
      const qrY = 70;

      page.drawRectangle({
        x: qrX - 3,
        y: qrY - 3,
        width: qrSize + 6,
        height: qrSize + 6,
        color: WHITE,
      });

      page.drawImage(
        qrImage,
        {
          x: qrX,
          y: qrY,
          width: qrSize,
          height: qrSize,
        }
      );

      addLinkAnnotation(
        pdf,
        page,
        verificationUrl,
        qrX,
        qrY,
        qrSize,
        qrSize
      );
    } catch (error) {
      console.error(
        "Unable to embed verification QR code:",
        error
      );
    }
  }

  /*
   * DISCLAIMER
   */

  const disclaimer =
    "WeatherSnap summarizes documented weather information from available governmental and meteorological sources. " +
    "This report does not determine causation, insurance coverage, property damage, or the exact weather conditions experienced at a specific structure.";

  const disclaimerLines =
    wrapText(
      disclaimer,
      regular,
      6.3,
      475
    ).slice(0, 3);

  disclaimerLines.forEach(
    (line, index) => {
      page.drawText(line, {
        x: 32,
        y:
          89 -
          index * 8.5,
        size: 6.3,
        font: regular,
        color: GRAY,
      });
    }
  );

  /*
   * FOOTER
   */

  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: 38,
    color: NAVY,
  });

  page.drawText(
    "WeatherSnap.app",
    {
      x: 32,
      y: 15,
      size: 7.5,
      font: bold,
      color: WHITE,
    }
  );

  page.drawText(
    "Weather Intelligence. Instantly.",
    {
      x: 120,
      y: 15,
      size: 6.5,
      font: regular,
      color: rgb(
        0.70,
        0.80,
        0.90
      ),
    }
  );

  const reportIdWidth =
    regular.widthOfTextAtSize(
      model.reportId,
      7
    );

  page.drawText(
    model.reportId,
    {
      x:
        PAGE_WIDTH -
        32 -
        reportIdWidth,
      y: 15,
      size: 7,
      font: regular,
      color: WHITE,
    }
  );

  return await pdf.save();
}