import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import WeatherSnapshotReport from "@/components/WeatherSnapshotReport";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

type Props = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function SuccessPage({
  searchParams,
}: Props) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Unable to Verify Payment
          </h1>

          <p className="mt-4 text-slate-600">
            No Stripe checkout session was provided.
          </p>
        </div>
      </main>
    );
  }

  try {
    /*
     * Verify the Checkout Session directly
     * with Stripe on the server.
     */
    const session =
      await stripe.checkout.sessions.retrieve(
        session_id
      );

    if (session.payment_status !== "paid") {
      return (
        <main className="min-h-screen bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Payment Not Completed
            </h1>

            <p className="mt-4 text-slate-600">
              This Weather Snapshot has not been paid for.
            </p>
          </div>
        </main>
      );
    }

    /*
     * The reportId was attached to the
     * Stripe Checkout Session when checkout
     * was created.
     */
    const reportId =
      session.metadata?.reportId;

    if (!reportId) {
      console.error(
        "Stripe session is missing reportId metadata."
      );

      return (
        <main className="min-h-screen bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Report Not Found
            </h1>

            <p className="mt-4 text-slate-600">
              Payment was verified, but the Weather Snapshot
              could not be identified.
            </p>
          </div>
        </main>
      );
    }

    /*
     * Mark this exact WeatherSnap report paid
     * and associate it with the verified
     * Stripe Checkout Session.
     */
    const { error: updateError } =
      await supabaseAdmin
        .from("weather_reports")
        .update({
          payment_status: "paid",
          stripe_session_id: session.id,
        })
        .eq("report_id", reportId);

    if (updateError) {
      console.error(
        "Unable to mark report paid:",
        updateError
      );

      throw new Error(
        "Unable to update Weather Snapshot."
      );
    }

    /*
     * Retrieve the exact report that
     * was purchased.
     */
    const {
      data: savedReport,
      error: reportError,
    } = await supabaseAdmin
      .from("weather_reports")
      .select(
        "report_id, address, date_of_loss, report_data, payment_status"
      )
      .eq("report_id", reportId)
      .single();

    if (reportError || !savedReport) {
      console.error(
        "Unable to retrieve paid report:",
        reportError
      );

      throw new Error(
        "Unable to retrieve Weather Snapshot."
      );
    }

    return (
      <main className="min-h-screen bg-slate-50">

        <div className="border-b border-emerald-200 bg-emerald-50 px-6 py-4">
          <div className="mx-auto max-w-6xl text-center">
            <p className="font-semibold text-emerald-800">
              Payment Verified — Weather Snapshot Unlocked
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              Report {savedReport.report_id}
            </p>
          </div>
        </div>

        <WeatherSnapshotReport
          report={savedReport.report_data}
          isUnlocked={true}
        />

      </main>
    );
  } catch (error) {
    console.error(
      "WeatherSnap payment verification failed:",
      error
    );

    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold text-slate-900">
            Unable to Load Weather Snapshot
          </h1>

          <p className="mt-4 text-slate-600">
            Your payment could not be connected to the
            Weather Snapshot. Please try again.
          </p>

        </div>
      </main>
    );
  }
}