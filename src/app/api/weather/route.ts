import type { WeatherRequest } from "@/types/weather";
import { getNoaaGridPoint } from "@/lib/noaa";
import { getHistoricalWeather } from "@/lib/historicalWeather";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WeatherRequest;

    if (
      !body.formattedAddress ||
      typeof body.latitude !== "number" ||
      typeof body.longitude !== "number" ||
      !body.placeId ||
      !body.dateOfLoss
    ) {
      return Response.json(
        {
          success: false,
          error: "Missing or invalid property information.",
        },
        { status: 400 }
      );
    }

    const grid = await getNoaaGridPoint(body.latitude, body.longitude);

    const historicalWeather = await getHistoricalWeather({
      latitude: body.latitude,
      longitude: body.longitude,
      gridId: grid.gridId,
      gridX: grid.gridX,
      gridY: grid.gridY,
      dateOfLoss: body.dateOfLoss,
    });

    return Response.json({
      success: true,
      message: "Historical weather service connected.",
      request: body,
      grid,
      historicalWeather,
    });
  } catch (error) {
    console.error("Weather request failed:", error);

    return Response.json(
      {
        success: false,
        error: "Unable to process the weather request.",
      },
      { status: 500 }
    );
  }
}