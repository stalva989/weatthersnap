"use client";

import { useState } from "react";
import AddressAutocomplete from "@/components/AddressAutocomplete";

type SelectedAddress = {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId: string;
};

export default function Home() {
  const [selectedAddress, setSelectedAddress] =
    useState<SelectedAddress | null>(null);
    const [dateOfLoss, setDateOfLoss] = useState("");
    const [formError, setFormError] = useState("");

      function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      if (!selectedAddress) {
      setFormError("Please select a property from the address suggestions.");
      return;
      }

      if (!dateOfLoss) {
      setFormError("Please select a date of loss.");
      return;
      }

      setFormError("");

      console.log("Weather Snapshot request:", {
        ...selectedAddress,
        dateOfLoss,
      });
      }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--navy)] text-lg font-bold text-white">
              W
            </div>

            <div>
              <p className="font-[var(--font-heading)] text-xl font-bold tracking-tight text-[var(--navy)]">
                WeatherSnap
              </p>
              <p className="text-xs text-slate-500">
                Weather Intelligence. Instantly.
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#how-it-works" className="transition hover:text-[var(--navy)]">
              How It Works
            </a>
            <a href="#report-preview" className="transition hover:text-[var(--navy)]">
              Report Preview
            </a>
            <a href="#faq" className="transition hover:text-[var(--navy)]">
              FAQ
            </a>
          </nav>

          <a
            href="#order"
            className="rounded-lg bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--storm-blue)]"
          >
            Get a Snapshot
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(47,93,140,0.14),_transparent_38%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--storm-blue)] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--orange)]" />
              Severe weather screening for property investigations
            </div>

            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-[var(--navy)] sm:text-6xl lg:text-7xl">
              Know whether a property is worth investigating.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Get a professional weather intelligence snapshot for hail, wind,
              and tornado activity near a property and date of loss.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#order"
                className="rounded-xl bg-[var(--orange)] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Generate Weather Snapshot
              </a>

              <div>
                <p className="text-2xl font-bold text-[var(--navy)]">$5.99</p>
                <p className="text-sm text-slate-500">Delivered as a verified PDF</p>
              </div>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                ["Hail", "Size, proximity, and event count"],
                ["Wind", "Peak gusts and documented reports"],
                ["Tornado", "Warnings and nearby activity"],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm"
                >
                  <p className="font-semibold text-[var(--navy)]">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div id="order" className="flex items-center justify-center">
            <div className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-white p-7 shadow-2xl shadow-slate-900/10 sm:p-9">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--storm-blue)]">
                    Weather Snapshot
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    Start your property search
                  </h2>
                </div>

                <div className="rounded-xl bg-[var(--light-blue)] px-3 py-2 text-sm font-bold text-[var(--navy)]">
                  $5.99
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Property address
                  </label>
                  <AddressAutocomplete onAddressSelect={setSelectedAddress} />
                  {selectedAddress && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                      <p>
                        <strong>Address:</strong> {selectedAddress.formattedAddress}
                      </p>
                      <p>
                        <strong>Latitude:</strong> {selectedAddress.latitude}
                      </p>
                      <p>
                        <strong>Longitude:</strong> {selectedAddress.longitude}
                      </p>
                      <p>
                        <strong>Place ID:</strong> {selectedAddress.placeId}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dateOfLoss"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Date of loss
                  </label>
                  <input
                    id="dateOfLoss"
                    name="dateOfLoss"
                    type="date"
                    value={dateOfLoss}
                    onChange={(event) => setDateOfLoss(event.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-[var(--storm-blue)] focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {formError && (
                  <p className="text-sm text-red-600" role="alert">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[var(--navy)] px-5 py-4 text-base font-semibold text-white transition hover:bg-[var(--storm-blue)]"
                >
                  Check Weather Activity
                </button>
              </form>

              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  Includes hail, wind, and tornado activity, key event metrics,
                  timeline, location map, source references, and report
                  verification.
                </p>
              </div>

              <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                Screening intelligence only. WeatherSnap does not determine
                property damage, causation, or coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-[var(--border)] bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["01", "Enter the property", "Provide the address and reported date of loss."],
              ["02", "We analyze weather", "WeatherSnap searches relevant severe weather activity near the property."],
              ["03", "Receive the report", "Download a professional, verified Weather Snapshot PDF."],
            ].map(([number, title, description]) => (
              <article key={number}>
                <p className="text-sm font-bold text-[var(--orange)]">{number}</p>
                <h3 className="mt-3 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}