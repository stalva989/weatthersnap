"use client";

import { useState } from "react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import WeatherSnapLogo from "@/components/WeatherSnapLogo";
import WeatherLoadingScreen from "@/components/WeatherLoadingScreen";

type SelectedAddress = {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId: string;
};

function createReportId() {
  return `WS-${crypto.randomUUID()
    .replace(/-/g, "")
    .slice(0, 10)
    .toUpperCase()}`;
}

export default function Home() {
  const [selectedAddress, setSelectedAddress] =
    useState<SelectedAddress | null>(null);

  const [dateOfLoss, setDateOfLoss] =
    useState("");

  const [formError, setFormError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedAddress) {
      setFormError(
        "Please select a property from the address suggestions."
      );
      return;
    }

    if (!dateOfLoss) {
      setFormError(
        "Please select a date of loss."
      );
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      /*
       * STEP 1
       * Generate weather data.
       */
      const response =
        await fetch("/api/weather", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...selectedAddress,
            dateOfLoss,
          }),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Weather request failed."
        );
      }

      /*
       * STEP 2
       * Create permanent WeatherSnap
       * report identifier.
       */
      const reportId =
        createReportId();

      /*
       * STEP 3
       * Add the Report ID to the exact
       * data object that will eventually
       * become the paid report and PDF.
       */
      const reportWithId = {
        ...data,
        reportId,
      };

      /*
       * STEP 4
       * Save the exact report to Supabase.
       */
      const saveResponse =
        await fetch("/api/reports", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            reportId,

            address:
              selectedAddress.formattedAddress,

            dateOfLoss,

            reportData:
              reportWithId,
          }),
        });

      const saveResult =
        await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(
          saveResult.error ||
            "Unable to save Weather Snapshot."
        );
      }

      console.log(
        "Weather API response:",
        reportWithId
      );

      console.log(
        "WeatherSnap report saved:",
        saveResult
      );

      /*
       * STEP 5
       * Navigate to the dedicated report page.
       *
       * The loading screen remains visible
       * until the browser leaves this page.
       */
      window.location.href =
        `/report/${reportId}`;

    } catch (error) {
      console.error(
        "Weather Snapshot request failed:",
        error
      );

      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to process the weather request."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">

      {/* FULL-SCREEN WEATHER LOADING EXPERIENCE */}

      {isSubmitting && <WeatherLoadingScreen />}

      {/* HEADER */}

      <header className="relative z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          <a href="/">
            <WeatherSnapLogo />
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[var(--navy)] md:flex">
            <a
              href="#how-it-works"
              className="transition hover:text-[var(--storm-blue)]"
            >
              How It Works
            </a>

            <a
              href="#report-preview"
              className="transition hover:text-[var(--storm-blue)]"
            >
              Report Preview
            </a>

            <a
              href="#faq"
              className="transition hover:text-[var(--storm-blue)]"
            >
              FAQ
            </a>
          </nav>

          <a
            href="#order"
            className="rounded-xl bg-[var(--orange)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Get a Snapshot
          </a>

        </div>
      </header>

      {/* HERO */}

      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/weather-hero-storm.png')",
        }}
      >

        {/* Dark blue atmospheric overlay */}

        <div className="absolute inset-0 bg-[#061a30]/20" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#06182c]/45 via-[#071d33]/15 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">

          {/* LEFT HERO */}

          <div className="flex flex-col justify-center">

            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">

              <span className="h-2.5 w-2.5 rounded-full bg-[var(--orange)] shadow-[0_0_12px_rgba(255,138,0,0.7)]" />

              Severe weather screening for property investigations

            </div>

            <h1
              className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight [text-shadow:0_3px_14px_rgba(0,0,0,0.85),0_1px_3px_rgba(0,0,0,0.9)] sm:text-6xl lg:text-[4.4rem]"
              style={{ color: "#8FD3FF" }}
            >
              Know whether a property is worth investigating.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Get a professional weather intelligence snapshot for hail,
              wind, and tornado activity near a property and date of loss.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-7">

              <a
                href="#order"
                className="rounded-xl bg-[var(--orange)] px-7 py-4 text-base font-bold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Generate Weather Snapshot →
              </a>

              <div className="border-l border-white/30 pl-7">

                <p className="text-3xl font-bold text-white">
                  $5.99
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Delivered as a verified PDF
                </p>

              </div>

            </div>

            {/* WEATHER CARDS */}

            <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/25 bg-[#08233d]/65 p-5 shadow-xl backdrop-blur-md">

                <div className="mb-3 text-3xl">
                  🌧️
                </div>

                <p className="font-bold text-white">
                  Hail
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Size, proximity, and event count
                </p>

              </div>

              <div className="rounded-2xl border border-white/25 bg-[#08233d]/65 p-5 shadow-xl backdrop-blur-md">

                <div className="mb-3 text-3xl">
                  ≋
                </div>

                <p className="font-bold text-white">
                  Wind
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Peak gusts and documented reports
                </p>

              </div>

              <div className="rounded-2xl border border-white/25 bg-[#08233d]/65 p-5 shadow-xl backdrop-blur-md">

                <div className="mb-3 text-3xl">
                  🌪
                </div>

                <p className="font-bold text-white">
                  Tornado
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Warnings and nearby activity
                </p>

              </div>

            </div>

          </div>

          {/* REPORT FORM */}

          <div
            id="order"
            className="flex items-center justify-center"
          >

            <div className="w-full max-w-xl rounded-3xl border border-white/60 bg-white/95 p-7 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-9">

              <div className="flex items-start justify-between gap-5">

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--storm-blue)]">
                    Weather Snapshot
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--navy)]">
                    Start your property search
                  </h2>

                </div>

                <div className="rounded-xl bg-blue-100 px-4 py-3 text-lg font-bold text-blue-700">
                  $5.99
                </div>

              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                <div>

                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-bold text-[var(--navy)]"
                  >
                    Property address
                  </label>

                  <AddressAutocomplete
                    onAddressSelect={
                      setSelectedAddress
                    }
                  />

                  {selectedAddress && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">

                      <p>
                        <strong>
                          Address:
                        </strong>{" "}
                        {
                          selectedAddress.formattedAddress
                        }
                      </p>

                      <p>
                        <strong>
                          Latitude:
                        </strong>{" "}
                        {
                          selectedAddress.latitude
                        }
                      </p>

                      <p>
                        <strong>
                          Longitude:
                        </strong>{" "}
                        {
                          selectedAddress.longitude
                        }
                      </p>

                      <p>
                        <strong>
                          Place ID:
                        </strong>{" "}
                        {
                          selectedAddress.placeId
                        }
                      </p>

                    </div>
                  )}

                </div>

                <div>

                  <label
                    htmlFor="dateOfLoss"
                    className="mb-2 block text-sm font-bold text-[var(--navy)]"
                  >
                    Date of loss
                  </label>

                  <input
                    id="dateOfLoss"
                    name="dateOfLoss"
                    type="date"
                    value={dateOfLoss}
                    onChange={(event) =>
                      setDateOfLoss(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-[var(--storm-blue)] focus:ring-4 focus:ring-blue-100"
                  />

                </div>

                {formError && (
                  <p
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[var(--navy)] px-5 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[var(--storm-blue)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Checking Weather Activity..."
                    : "Check Weather Activity"}
                </button>

              </form>

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

                <p className="text-sm leading-6 text-slate-600">
                  Includes hail, wind, and tornado activity,
                  key event metrics, timeline, location map,
                  source references, and report verification.
                </p>

              </div>

              <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                Screening intelligence only. WeatherSnap does
                not determine property damage, causation, or
                coverage.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section
        id="how-it-works"
        className="relative overflow-hidden border-y border-slate-200 bg-white"
      >

        <div className="absolute inset-0 opacity-[0.035]">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full border border-[var(--storm-blue)]" />
          <div className="absolute -left-16 top-16 h-72 w-72 rounded-full border border-[var(--storm-blue)]" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full border border-[var(--storm-blue)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--storm-blue)]">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--navy)] sm:text-4xl">
              From address to answers in three simple steps.
            </h2>

          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            {[
              [
                "01",
                "Enter the property",
                "Provide the address and reported date of loss.",
              ],

              [
                "02",
                "We analyze weather",
                "WeatherSnap searches relevant severe weather activity near the property.",
              ],

              [
                "03",
                "Receive the report",
                "Download a professional, verified Weather Snapshot PDF.",
              ],
            ].map(
              ([number, title, description]) => (
                <article
                  key={number}
                  className="flex gap-5"
                >

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-[var(--storm-blue)]">
                    {number}
                  </div>

                  <div>

                    <h3 className="text-xl font-bold text-[var(--navy)]">
                      {title}
                    </h3>

                    <p className="mt-2 leading-7 text-slate-600">
                      {description}
                    </p>

                  </div>

                </article>
              )
            )}

          </div>

        </div>

      </section>

    </main>
  );
}