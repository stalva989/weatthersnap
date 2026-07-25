type WeatherRequest = {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId: string;
  dateOfLoss: string;
};

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

    return Response.json({
      success: true,
      message: "Weather request received.",
      request: body,
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