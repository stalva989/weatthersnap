import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { buildReportModel } from "@/lib/reportBuilder";
import { generateWeatherSnapPdf } from "@/lib/pdfGenerator";

type Props = {
  params: Promise<{
    reportId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    const { reportId } =
      await params;

    if (!reportId) {
      return Response.json(
        {
          error:
            "Report ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Retrieve the permanent saved report.
     */
    const {
      data: savedReport,
      error,
    } = await supabaseAdmin
      .from("weather_reports")
      .select(
        "report_id, report_data, payment_status"
      )
      .eq(
        "report_id",
        reportId
      )
      .single();

    if (
      error ||
      !savedReport
    ) {
      console.error(
        "PDF report lookup failed:",
        error
      );

      return Response.json(
        {
          error:
            "Weather Snapshot not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Never generate a downloadable report
     * for an unpaid Weather Snapshot.
     */
    if (
      savedReport.payment_status !==
      "paid"
    ) {
      return Response.json(
        {
          error:
            "Weather Snapshot has not been purchased.",
        },
        {
          status: 403,
        }
      );
    }

    const reportData = {
      ...savedReport.report_data,

      /*
       * Guarantee the permanent Supabase
       * Report ID is used by the PDF.
       */
      reportId:
        savedReport.report_id,
    };

    const model =
      buildReportModel(
        reportData
      );

    const pdfBytes =
      await generateWeatherSnapPdf(
        model
      );

    return new Response(
      Buffer.from(pdfBytes),
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="WeatherSnap-${reportId}.pdf"`,

          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "WeatherSnap PDF generation failed:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to generate Weather Snapshot PDF.",
      },
      {
        status: 500,
      }
    );
  }
}