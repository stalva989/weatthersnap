import { calculateDistanceMiles } from "./geo";

export type NceiDailySummaryRequest = {
  stationId: string;
  startDate: string;
  endDate: string;
};

export type NceiDailySummaryRecord = Record<string, string | number | null>;

function createBoundingBox(
  latitude: number,
  longitude: number,
  radiusDegrees = 0.2
): string {
  const north = latitude + radiusDegrees;
  const west = longitude - radiusDegrees;
  const south = latitude - radiusDegrees;
  const east = longitude + radiusDegrees;

  return `${north},${west},${south},${east}`;
}

export type NceiStation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceMiles: number;
  platforms: string[];
  dataTypes: string[];
  startDate: string;
  endDate: string;
};

export async function findNearbyNceiStations(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<NceiStation[]> {
  const boundingBox = createBoundingBox(latitude, longitude);

  const params = new URLSearchParams({
    dataset: "daily-summaries",
    startDate,
    endDate,
    bbox: boundingBox,
  });

  const response = await fetch(
    `https://www.ncei.noaa.gov/access/services/search/v1/data?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "WeatherSnap.app (contact@weathersnap.app)",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Unable to search for NCEI stations: ${response.status} - ${errorBody}`
    );
  }

  const data = await response.json();

    
  const stations: NceiStation[] = data.results
    .map((result: any) => {
        const station = result.stations?.[0];
        const coordinates = result.location?.coordinates ?? result.centroid;

        if (
        !station?.id ||
        !station?.name ||
        !Array.isArray(coordinates) ||
        coordinates.length < 2
        ) {
        return null;
        }

        return {
            id: station.id,
            name: station.name,
            latitude: coordinates[1],
            longitude: coordinates[0],
            distanceMiles: calculateDistanceMiles(
                latitude,
                longitude,
                coordinates[1],
                coordinates[0]
            ),
            platforms:
                station.platforms?.map((platform: any) => platform.id) ?? [],
            dataTypes:
                station.dataTypes?.map((dataType: any) => dataType.id) ?? [],
            startDate: result.startDate,
            endDate: result.endDate,
        };
    })
    .filter((station: NceiStation | null): station is NceiStation => {
        return station !== null;
    });

    console.log(
        "Parsed NCEI stations:",
        stations.map((station) => ({
            id: station.id,
            name: station.name,
            distanceMiles: station.distanceMiles,
            platforms: station.platforms,
            dataTypeCount: station.dataTypes.length,
        }))
    );

    return stations;
    }

export async function getNceiDailySummaries(
    request: NceiDailySummaryRequest
    ): Promise<NceiDailySummaryRecord[]> {
    const params = new URLSearchParams({
        dataset: "daily-summaries",
        stations: request.stationId,
        startDate: request.startDate,
        endDate: request.endDate,
        format: "json",
        units: "standard",
        includeStationName: "true",
        includeStationLocation: "true",
        includeAttributes: "true",
    });

    const response = await fetch(
        `https://www.ncei.noaa.gov/access/services/data/v1?${params.toString()}`,
        {
        headers: {
            Accept: "application/json",
            "User-Agent": "WeatherSnap.app (contact@weathersnap.app)",
        },
        cache: "no-store",
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();

        console.error("NCEI request failed:", {
        status: response.status,
        url: response.url,
        response: errorBody,
        });

        throw new Error(
        `Unable to retrieve NCEI daily summaries: ${response.status} - ${errorBody}`
        );
    }

    const data = await response.json();

    console.log(
        `Retrieved ${data.length} daily summaries from station ${request.stationId}`
    );

    return data;
    }

  