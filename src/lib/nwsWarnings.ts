export type NwsWarning = {
  id: string;
  event: string;
  headline: string;

  issued: string;
  expires: string;

  geometry: GeoJSON.Geometry | null;
};

export async function getNwsWarnings(
  latitude: number,
  longitude: number
): Promise<NwsWarning[]> {

  const url =
    `https://api.weather.gov/alerts/active?point=${latitude},${longitude}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "WeatherSnap (contact@weathersnap.app)",
      Accept: "application/geo+json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error(
      "Unable to retrieve NWS warnings."
    );

    return [];
  }

  const data = await response.json();

  return (data.features ?? []).map(
    (feature: any) => ({
      id: feature.id,

      event:
        feature.properties.event,

      headline:
        feature.properties.headline,

      issued:
        feature.properties.sent,

      expires:
        feature.properties.ends,

      geometry:
        feature.geometry,
    })
  );
}