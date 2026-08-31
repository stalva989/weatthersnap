import type { WeatherRequest } from "@/types/weather";
import { getNoaaGridPoint } from "@/lib/noaa";
import { getHistoricalWeather } from "@/lib/historicalWeather";
import { getStormEvents } from "@/lib/stormEvents";
import { buildUnifiedWeatherEvents } from "@/lib/weatherEngine";
import { getNwsWarnings } from "@/lib/nwsWarnings";
import { getSpcStormReports } from "@/lib/spcReports";

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

    const stormEvents = await getStormEvents(
      body.latitude,
      body.longitude,
      historicalWeather.windowStart,
      historicalWeather.windowEnd
    );

    const spcReports = await getSpcStormReports(
      historicalWeather.windowStart,
      historicalWeather.windowEnd
    );

    console.log("SPC Reports:", spcReports.length);

    const nwsWarnings = await getNwsWarnings(
      body.latitude,
      body.longitude
    );

    console.log(
      "NWS Warnings:",
      nwsWarnings.map((w) => w.event)
    );

    const events = buildUnifiedWeatherEvents({
      stormEvents,
      nwsWarnings,
      dateOfLoss: body.dateOfLoss,
    });

    return Response.json({
      success: true,
      message: "Historical weather service connected.",
      request: body,
      grid,
      historicalWeather,

      // Temporary until we merge the pipelines
      events,
      spcReports,
      nwsWarnings,
      snapshot: historicalWeather.snapshot,
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