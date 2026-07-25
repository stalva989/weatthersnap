export type NoaaGridPoint = {
  gridId: string;
  gridX: number;
  gridY: number;
};

export async function getNoaaGridPoint(
  latitude: number,
  longitude: number
): Promise<NoaaGridPoint> {
  const response = await fetch(
    `https://api.weather.gov/points/${latitude},${longitude}`,
    {
      headers: {
        Accept: "application/geo+json",
        "User-Agent": "WeatherSnap.app (contact@weathersnap.app)",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to retrieve NOAA grid information.");
  }

  const data = await response.json();

  return {
    gridId: data.properties.gridId,
    gridX: data.properties.gridX,
    gridY: data.properties.gridY,
  };
}