import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const { reportId } = await request.json();

    if (!reportId) {
      return Response.json(
        {
          error: "Report ID is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Make sure this report actually exists
     * before creating a Stripe Checkout Session.
     */
    const { data: report, error: reportError } =
      await supabaseAdmin
        .from("weather_reports")
        .select("report_id")
        .eq("report_id", reportId)
        .single();

    if (reportError || !report) {
      console.error(
        "Unable to locate report:",
        reportError
      );

      return Response.json(
        {
          error: "Weather Snapshot could not be found.",
        },
        { status: 404 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    /*
     * Create Stripe Checkout Session.
     * reportId is stored in Stripe metadata.
     */
    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "usd",

              product_data: {
                name: "WeatherSnap Report",
                description:
                  "Professional Weather Snapshot PDF",
              },

              unit_amount: 599,
            },

            quantity: 1,
          },
        ],

        metadata: {
          reportId,
        },

        success_url:
          `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${appUrl}/`,
      });

    /*
     * Save Stripe Session ID against
     * this exact WeatherSnap report.
     */
    const { error: updateError } =
      await supabaseAdmin
        .from("weather_reports")
        .update({
          stripe_session_id: session.id,
        })
        .eq("report_id", reportId);

    if (updateError) {
      console.error(
        "Unable to save Stripe Session ID:",
        updateError
      );

      return Response.json(
        {
          error:
            "Unable to connect checkout to Weather Snapshot.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Stripe checkout session failed:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to create checkout session.",
      },
      { status: 500 }
    );
  }
}