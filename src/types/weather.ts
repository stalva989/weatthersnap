export type WeatherRequest = {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId: string;
  dateOfLoss: string;
};

export type DailyWeatherObservation = {
  date: string;

  highTemp: number | null;
  lowTemp: number | null;

  precipitation: number | null;

  averageWind: number | null;
  maxWind1Minute: number | null;
  maxWind2Minute: number | null;
  maxWind5Second: number | null;

  snowfall: number | null;
  snowDepth: number | null;

  thunder: boolean;
  hail: boolean;
  damagingWind: boolean;
  tornado: boolean;
};