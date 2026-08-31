import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      reportId,
      address,
      dateOfLoss,
      reportData,
    } = body;

    if (
      !reportId ||
      !address ||
      !dateOfLoss ||
      !reportData
    ) {
      return Response.json(
        {
          error: "Missing required report information.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from("weather_reports")
        .insert({
          report_id: reportId,
          address,
          date_of_loss: dateOfLoss,
          report_data: reportData,
          payment_status: "unpaid",
        })
        .select()
        .single();

    if (error) {
      console.error(
        "Supabase report save failed:",
        error
      );

      return Response.json(
        {
          error: "Unable to save Weather Snapshot.",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
      reportId: data.report_id,
    });
  } catch (error) {
    console.error(
      "Report API failed:",
      error
    );

    return Response.json(
      {
        error: "Unable to save Weather Snapshot.",
      },
      {
        status: 500,
      }
    );
  }
}