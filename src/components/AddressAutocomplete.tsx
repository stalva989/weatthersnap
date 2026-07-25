"use client";

import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

type SelectedAddress = {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId: string;
};

type AddressAutocompleteProps = {
  onAddressSelect?: (address: SelectedAddress) => void;
};

export default function AddressAutocomplete({
  onAddressSelect,
}: AddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("Google Maps API key is missing.");
      return;
    }

    let autocompleteElement: google.maps.places.PlaceAutocompleteElement | null =
      null;

    async function initializeAutocomplete() {
      try {
        setOptions({
          key: apiKey,
          v: "weekly",
        });

        const { PlaceAutocompleteElement } =
          (await importLibrary("places")) as google.maps.PlacesLibrary;

        autocompleteElement = new PlaceAutocompleteElement({
          includedRegionCodes: ["us"],
        });

        autocompleteElement.placeholder = "Enter property address";

        autocompleteElement.addEventListener(
          "gmp-select",
          async (event: Event) => {
            const placePrediction =
              (
                event as google.maps.places.PlacePredictionSelectEvent
              ).placePrediction;

            const place = placePrediction.toPlace();

            await place.fetchFields({
              fields: ["formattedAddress", "location", "id"],
            });

            if (!place.location || !place.formattedAddress || !place.id) {
              setError("Please select a complete address.");
              return;
            }

            setError("");

            onAddressSelect?.({
              formattedAddress: place.formattedAddress,
              latitude: place.location.lat(),
              longitude: place.location.lng(),
              placeId: place.id,
            });
          }
        );

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(autocompleteElement);
        }
      } catch (err) {
        console.error("Google Places failed to load:", err);
        setError("Address search could not be loaded.");
      }
    }

    initializeAutocomplete();

    return () => {
      autocompleteElement?.remove();
    };
  }, [onAddressSelect]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full" />

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
} 