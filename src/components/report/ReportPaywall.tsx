"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function ReportPaywall() {
  async function handleCheckout() {
    try {
      const response = await fetch(
        "/api/create-checkout-session",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Unable to start checkout."
        );
      }

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error(
          "Unable to initialize Stripe."
        );
      }

      window.location.href = data.url;

    } catch (error) {
      console.error(error);
      alert(
        "Unable to start checkout. Please try again."
      );
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white via-white/85 to-transparent backdrop-blur-[3px]">

      <div className="w-full max-w-lg rounded-2xl border border-slate-300 bg-white p-8 text-center shadow-2xl">

        <h2 className="text-2xl font-bold text-slate-900">
          Unlock the Complete Weather Snapshot
        </h2>

        <p className="mt-4 leading-7 text-slate-600">
          Download the professional Weather Snapshot
          including a printable PDF, verification ID,
          documented weather records, and detailed event
          information.
        </p>

        <div className="mt-8 space-y-3 text-left text-slate-700">

          <div>✓ Professional PDF Report</div>

          <div>✓ Verification ID</div>

          <div>✓ Documented Weather Events</div>

          <div>✓ Printable & Shareable Format</div>

          <div>✓ Official Government Data Sources</div>

        </div>

        <button
          onClick={handleCheckout}
          className="mt-8 w-full rounded-xl bg-orange-500 px-6 py-4 text-lg font-bold text-white transition hover:bg-orange-600"
        >
          Unlock for $5.99
        </button>

      </div>

    </div>
  );
}