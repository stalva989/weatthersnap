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
  dailySummaries: Record<string, string | number | null>[];
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
    //const dailySummaries = await getNceiDailySummaries({
        //latitude: request.latitude,
       // longitude: request.longitude,
        //startDate: windowStart,
       // endDate: windowEnd,
    //});

  console.log("Historical weather lookup:", {
    ...request,
    windowStart,
    windowEnd,
  });

    return {
        success: true,
        requestedDate: request.dateOfLoss,
        windowStart,
        windowEnd,
        totalDays: 31,
        weatherEvents: [],
        nearbyStations,
        dailySummaries: [],
    };
}