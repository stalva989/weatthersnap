import { DailyWeatherObservation } from "@/types/weather";

function parseNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed) ? null : parsed;
}

function parseBoolean(value: unknown): boolean {
  return value === "1" || value === 1 || value === true;
}

export function mapNceiDailySummary(
  record: Record<string, unknown>
): DailyWeatherObservation {
  return {
    date: String(record.DATE ?? ""),

    highTemp: parseNumber(record.TMAX),
    lowTemp: parseNumber(record.TMIN),

    precipitation: parseNumber(record.PRCP),

    averageWind: parseNumber(record.AWND),
    maxWind1Minute: parseNumber(record.WSF1),
    maxWind2Minute: parseNumber(record.WSF2),
    maxWind5Second: parseNumber(record.WSF5),

    snowfall: parseNumber(record.SNOW),
    snowDepth: parseNumber(record.SNWD),

    thunder: parseBoolean(record.WT03),
    hail: parseBoolean(record.WT05),
    damagingWind: parseBoolean(record.WT11),
    tornado: parseBoolean(record.WT10),
  };
}