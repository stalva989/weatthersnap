import { gunzipSync } from "node:zlib";
import { parse } from "csv-parse/sync";
import { calculateDistanceMiles } from "./geo";

export type StormEvent = {
  id: string;
  date: string;

  latitude: number;
  longitude: number;

  eventType: string;

  magnitude: number | null;
  magnitudeType: string | null;

  source: string;

  distanceMiles: number;

  narrative: string;
};

type StormEventCsvRow = {
  EVENT_ID?: string;

  BEGIN_YEARMONTH?: string;
  BEGIN_DAY?: string;
  BEGIN_DATE_TIME?: string;

  EVENT_TYPE?: string;

  MAGNITUDE?: string;
  MAGNITUDE_TYPE?: string;

  SOURCE?: string;

  BEGIN_LAT?: string;
  BEGIN_LON?: string;

  EVENT_NARRATIVE?: string;
};

const NOAA_DIRECTORY =
  "https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/";

function getYearsBetween(
  startDate: string,
  endDate: string
): number[] {
  const startYear = Number(startDate.slice(0, 4));
  const endYear = Number(endDate.slice(0, 4));

  const years: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}

function buildEventDate(
  row: StormEventCsvRow
): string | null {
  /*
    Preferred method:
    BEGIN_YEARMONTH = 202506
    BEGIN_DAY = 30
  */

  const yearMonth = row.BEGIN_YEARMONTH?.trim();
  const day = row.BEGIN_DAY?.trim();

  if (
    yearMonth &&
    yearMonth.length === 6 &&
    day
  ) {
    const year = yearMonth.slice(0, 4);
    const month = yearMonth.slice(4, 6);
    const paddedDay = day.padStart(2, "0");

    return `${year}-${month}-${paddedDay}`;
  }

  /*
    Backup method:
    BEGIN_DATE_TIME = 06/30/2025 17:30:00
  */

  const value = row.BEGIN_DATE_TIME?.trim();

  if (!value) {
    return null;
  }

  const match = value.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
  );

  if (!match) {
    return null;
  }

  const month = match[1].padStart(2, "0");
  const dateDay = match[2].padStart(2, "0");
  const year = match[3];

  return `${year}-${month}-${dateDay}`;
}

async function findDetailsFileUrl(
  year: number
): Promise<string> {
  const response = await fetch(NOAA_DIRECTORY, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Unable to read NOAA Storm Events directory: ${response.status}`
    );
  }

  const html = await response.text();

  const pattern = new RegExp(
    `StormEvents_details-ftp_v1\\.0_d${year}_c\\d{8}\\.csv\\.gz`,
    "g"
  );

  const matches = html.match(pattern);

  if (!matches || matches.length === 0) {
    throw new Error(
      `No NOAA Storm Events details file found for ${year}.`
    );
  }

  /*
    Remove duplicates and choose the latest
    creation-date filename.
  */

  const filenames = [...new Set(matches)].sort();

  const filename =
    filenames[filenames.length - 1];

  return `${NOAA_DIRECTORY}${filename}`;
}

async function downloadYear(
  year: number
): Promise<StormEventCsvRow[]> {
  const url = await findDetailsFileUrl(year);

  console.log("Downloading NOAA Storm Events:", {
    year,
    url,
  });

  /*
    Do not ask Next.js to cache this.
    NOAA yearly files are too large for
    the Next.js data cache.
  */

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Unable to download NOAA Storm Events ${year}: ${response.status}`
    );
  }

  const compressed = Buffer.from(
    await response.arrayBuffer()
  );

  const csv = gunzipSync(compressed).toString("utf8");

  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
    bom: true,
  }) as StormEventCsvRow[];

  console.log(
    `NOAA Storm Events rows loaded for ${year}:`,
    rows.length
  );

  return rows;
}

export async function getStormEvents(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string,
  radiusMiles = 25
): Promise<StormEvent[]> {
  const years = getYearsBetween(
    startDate,
    endDate
  );

  const yearlyData = await Promise.all(
    years.map(downloadYear)
  );

  const rows = yearlyData.flat();

  console.log("NOAA Storm Events total rows:", rows.length);

  const allowedTypes = new Set([
    "Hail",
    "Thunderstorm Wind",
    "High Wind",
    "Strong Wind",
    "Tornado",
    "Funnel Cloud",
    "Lightning",
    "Heavy Rain",
    "Flash Flood",
    "Flood",
  ]);

  let allowedTypeCount = 0;
  let dateRangeCount = 0;
  let coordinateCount = 0;
  let radiusCount = 0;

  const events: StormEvent[] = [];

  for (const row of rows) {
    const eventType =
      row.EVENT_TYPE?.trim();

    if (
      !eventType ||
      !allowedTypes.has(eventType)
    ) {
      continue;
    }

    allowedTypeCount++;

    const date = buildEventDate(row);

    if (
      !date ||
      date < startDate ||
      date > endDate
    ) {
      continue;
    }

    dateRangeCount++;

    const eventLatitude =
      Number(row.BEGIN_LAT);

    const eventLongitude =
      Number(row.BEGIN_LON);

    if (
      !Number.isFinite(eventLatitude) ||
      !Number.isFinite(eventLongitude)
    ) {
      continue;
    }

    coordinateCount++;

    const distanceMiles =
      calculateDistanceMiles(
        latitude,
        longitude,
        eventLatitude,
        eventLongitude
      );

    if (
      !Number.isFinite(distanceMiles) ||
      distanceMiles > radiusMiles
    ) {
      continue;
    }

    radiusCount++;

    const magnitudeValue =
      Number(row.MAGNITUDE);

    events.push({
      id:
        row.EVENT_ID?.trim() ||
        `${date}-${eventType}-${events.length}`,

      date,

      latitude: eventLatitude,
      longitude: eventLongitude,

      eventType,

      magnitude:
        row.MAGNITUDE != null &&
        row.MAGNITUDE.trim() !== "" &&
        Number.isFinite(magnitudeValue)
          ? magnitudeValue
          : null,

      magnitudeType:
        row.MAGNITUDE_TYPE?.trim() ||
        null,

      source:
        row.SOURCE?.trim() ||
        "NOAA Storm Events",

      distanceMiles,

      narrative:
        row.EVENT_NARRATIVE?.trim() ||
        "",
    });
  }

  events.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }

    return (
      a.distanceMiles -
      b.distanceMiles
    );
  });

  console.log("NOAA Storm Events filter diagnostics:", {
    totalRows: rows.length,
    allowedTypeCount,
    dateRangeCount,
    coordinateCount,
    radiusCount,
    finalEventCount: events.length,
    searchStart: startDate,
    searchEnd: endDate,
    radiusMiles,
  });

  console.log(
    "NOAA Storm Events near property:",
    events.map((event) => ({
      date: event.date,
      type: event.eventType,
      magnitude: event.magnitude,
      distanceMiles:
        Number(
          event.distanceMiles.toFixed(2)
        ),
    }))
  );

  return events;
}