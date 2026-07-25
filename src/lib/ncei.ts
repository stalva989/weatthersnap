export type NceiDailySummaryRequest = {
  latitude: number;
  longitude: number;
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

    console.log(
        "First NCEI station result:",
        JSON.stringify(data.results?.[0], null, 2)
    );

  return [];
}

export async function getNceiDailySummaries(
  request: NceiDailySummaryRequest
): Promise<NceiDailySummaryRecord[]> {
  const boundingBox = createBoundingBox(
    request.latitude,
    request.longitude
  );

  const params = new URLSearchParams({
    dataset: "daily-summaries",
    startDate: request.startDate,
    endDate: request.endDate,
    bbox: boundingBox,
    format: "json",
    units: "standard",
    includeStationName: "true",
    includeStationLocation: "true",
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

  return response.json();
}