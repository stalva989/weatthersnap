import { MapMarker } from "@/types/report";

export type MapModel = {
  centerLatitude: number;
  centerLongitude: number;
  zoom: number;

  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };

  markers: MapMarker[];
};

export function buildMapModel(
  propertyLatitude: number,
  propertyLongitude: number,
  events: any[]
): MapModel {

  const markers: MapMarker[] = [
    {
      id: "property",
      label: "P",
      latitude: propertyLatitude,
      longitude: propertyLongitude,
      type: "property",
      severity: "low",
    },
  ];

  events.forEach((event: any, index: number) => {

    if (
      event.latitude == null ||
      event.longitude == null
    ) {
      return;
    }

    markers.push({
      id: `event-${index + 1}`,
      label: String(index + 1),

      latitude: event.latitude,
      longitude: event.longitude,

      type: event.type ?? "other",
      severity: event.severity ?? "low",
    });

  });

  const lats = markers.map((m) => m.latitude);
  const lngs = markers.map((m) => m.longitude);

  const north = Math.max(...lats);
  const south = Math.min(...lats);
  const east = Math.max(...lngs);
  const west = Math.min(...lngs);

  const centerLatitude = (north + south) / 2;
  const centerLongitude = (east + west) / 2;

  const span = Math.max(
    north - south,
    east - west
  );

  let zoom = 13;

  if (span > 0.15) zoom = 11;
  if (span > 0.30) zoom = 10;
  if (span > 0.60) zoom = 9;
  if (span > 1.20) zoom = 8;

  return {
    centerLatitude,
    centerLongitude,
    zoom,

    bounds: {
      north,
      south,
      east,
      west,
    },

    markers,
  };
}