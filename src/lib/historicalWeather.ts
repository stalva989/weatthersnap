import { rankStations } from "./stationRanking";
import { mapNceiDailySummary } from "./weatherMapper";
import {
  buildWeatherEvents,
  buildSnapshotSummary,
  SnapshotSummary,
  WeatherEvent,
} from "./weatherIntelligence";
import { DailyWeatherObservation } from "@/types/weather";
import { WeatherFinding } from "./weatherIntelligence";

import {
  findNearbyNceiStations,
  getNceiDailySummaries,
} from "@/lib/ncei";

export type HistoricalWeatherRequest = {
  latitude: number;
  longitude: number;
  gridId: string;
  gridX: number;
  gridY: number;
  dateOfLoss: string;
};

export type HistoricalWeatherResult = {
  success: true;
  requestedDate: string;
  windowStart: string;
  windowEnd: string;
  totalDays: number;

  weatherEvents: [];

  nearbyStations: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }[];

    dailySummaries: DailyWeatherObservation[];
    events: WeatherEvent[];

    snapshot: SnapshotSummary;
};

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(dateString: string, numberOfDays: number): string {
  const date = new Date(`${dateString}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + numberOfDays);

  return formatDate(date);
}

export async function getHistoricalWeather(
  request: HistoricalWeatherRequest
): Promise<HistoricalWeatherResult> {
    const windowStart = addDays(request.dateOfLoss, -15);
    const windowEnd = addDays(request.dateOfLoss, 15);
    const nearbyStations = await findNearbyNceiStations(
        request.latitude,
        request.longitude,
        windowStart,
        windowEnd
    );
    const rankedStations = rankStations(nearbyStations);
    const primaryStation = rankedStations[0];

    if (!primaryStation) {
        throw new Error("No suitable weather stations found.");
    }
    const dailySummaries = await getNceiDailySummaries({
        stationId: primaryStation.id,
        startDate: windowStart,
        endDate: windowEnd,
    });
    const observations = dailySummaries.map(mapNceiDailySummary);
    const events = buildWeatherEvents(
        observations,
        request.dateOfLoss
    );

    const snapshot = buildSnapshotSummary(
        events,
        request.dateOfLoss
    );

  console.log("Historical weather lookup:", {
    ...request,
    windowStart,
    windowEnd,
  });

  console.log(
    "Top ranked station:",
    rankedStations.length > 0
        ? {
            name: rankedStations[0].name,
            score: rankedStations[0].score,
            distance: rankedStations[0].distanceMiles,
        }
        : "No stations found"
    );

   console.log("Using primary weather station:", {
        id: primaryStation.id,
        name: primaryStation.name,
        score: primaryStation.score,
    });

    return {
        success: true,
        requestedDate: request.dateOfLoss,
        windowStart,
        windowEnd,
        totalDays: 31,
        weatherEvents: [],
        nearbyStations: rankedStations,
        dailySummaries: observations,
        events,
        snapshot,
    };
}