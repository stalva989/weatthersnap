"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

type WeatherEvent = {
  latitude?: number;
  longitude?: number;
  type?: string;
};

type Props = {
  latitude: number;
  longitude: number;
  events?: WeatherEvent[];
};

function getMarkerColor(type?: string): string {
  switch (type) {
    case "hail":
      return "#ef4444";

    case "wind":
      return "#3b82f6";

    case "tornado":
      return "#22c55e";

    case "lightning":
      return "#8b5cf6";

    case "flood":
      return "#06b6d4";

    case "warning":
      return "#f97316";

    default:
      return "#6b7280";
  }
}

export default function MapboxMap({
  latitude,
  longitude,
  events = [],
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    const validEvents = events.filter(
      (event) =>
        Number.isFinite(event.latitude) &&
        Number.isFinite(event.longitude)
    );

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [longitude, latitude],
      zoom: 13,
      attributionControl: false,
    });

    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();

    map.on("load", () => {
      // PROPERTY MARKER

      const propertyMarker =
        document.createElement("div");

      propertyMarker.style.width = "36px";
      propertyMarker.style.height = "36px";
      propertyMarker.style.borderRadius = "50%";
      propertyMarker.style.backgroundColor = "#000000";
      propertyMarker.style.color = "#ffffff";
      propertyMarker.style.display = "flex";
      propertyMarker.style.alignItems = "center";
      propertyMarker.style.justifyContent = "center";
      propertyMarker.style.fontWeight = "700";
      propertyMarker.style.fontSize = "14px";
      propertyMarker.style.border = "2px solid white";
      propertyMarker.style.boxShadow =
        "0 2px 6px rgba(0,0,0,0.25)";

      propertyMarker.innerHTML = "P";

      new mapboxgl.Marker({
        element: propertyMarker,
        anchor: "center",
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      // WEATHER EVENT MARKERS

      validEvents.forEach((event, index) => {
        const marker =
          document.createElement("div");

        marker.style.width = "30px";
        marker.style.height = "30px";
        marker.style.borderRadius = "50%";
        marker.style.backgroundColor =
          getMarkerColor(event.type);
        marker.style.color = "#ffffff";
        marker.style.display = "flex";
        marker.style.alignItems = "center";
        marker.style.justifyContent = "center";
        marker.style.fontWeight = "700";
        marker.style.fontSize = "12px";
        marker.style.border = "2px solid white";
        marker.style.boxShadow =
          "0 2px 6px rgba(0,0,0,0.25)";

        marker.innerHTML =
          String(index + 1);

        new mapboxgl.Marker({
          element: marker,
          anchor: "center",
        })
          .setLngLat([
            event.longitude as number,
            event.latitude as number,
          ])
          .addTo(map);
      });

      // AUTO-FIT MAP

      if (validEvents.length > 0) {
        const bounds =
          new mapboxgl.LngLatBounds();

        bounds.extend([
          longitude,
          latitude,
        ]);

        validEvents.forEach((event) => {
          bounds.extend([
            event.longitude as number,
            event.latitude as number,
          ]);
        });

        map.fitBounds(bounds, {
          padding: 55,
          maxZoom: 13,
          duration: 0,
        });
      }
    });

    return () => {
      map.remove();
    };
  }, [latitude, longitude, events]);

  return (
    <div
      ref={mapContainer}
      className="h-full w-full"
    />
  );
}