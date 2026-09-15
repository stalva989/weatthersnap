"use client";

import { useEffect, useState } from "react";

const loadingMessages = [
  "Locating property...",
  "Finding nearby weather stations...",
  "Reviewing NOAA records...",
  "Checking documented storm activity...",
  "Building your Weather Snapshot...",
];

export default function WeatherLoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((current) => {
        if (current >= loadingMessages.length - 1) {
          return current;
        }

        return current + 1;
      });
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-[#06182c]">

      {/* Atmospheric background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#123c63_0%,_#071d33_45%,_#041321_100%)]" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/30" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/30" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/30" />
      </div>

      {/* Main content */}

      <div className="relative z-10 flex flex-col items-center px-6 text-center">

        {/* Radar */}

        <div className="relative h-64 w-64 sm:h-72 sm:w-72">

          <div className="absolute inset-0 rounded-full border-2 border-[#2E9BFF]/70 shadow-[0_0_45px_rgba(46,155,255,0.18)]" />

          <div className="absolute inset-[16.5%] rounded-full border border-[#2E9BFF]/40" />

          <div className="absolute inset-[33%] rounded-full border border-[#2E9BFF]/40" />

          {/* Radar crosshairs */}

          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#2E9BFF]/25" />

          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#2E9BFF]/25" />

          {/* Radar sweep */}

          <div className="absolute inset-0 animate-[spin_2.8s_linear_infinite] rounded-full">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(46,155,255,0.08) 320deg, rgba(46,155,255,0.65) 358deg, rgba(143,211,255,0.95) 360deg)",
              }}
            />
          </div>

          {/* Radar returns */}

          <div className="absolute left-[30%] top-[28%] h-3 w-3 rounded-full bg-[#FF8A00] shadow-[0_0_14px_rgba(255,138,0,0.95)] animate-pulse" />

          <div className="absolute right-[24%] top-[43%] h-2.5 w-2.5 rounded-full bg-[#FF8A00] shadow-[0_0_12px_rgba(255,138,0,0.9)] animate-pulse" />

          <div className="absolute bottom-[27%] left-[39%] h-2 w-2 rounded-full bg-[#8FD3FF] shadow-[0_0_12px_rgba(143,211,255,0.9)] animate-pulse" />

          {/* Center point */}

          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#2E9BFF] shadow-[0_0_18px_rgba(46,155,255,0.9)]" />

        </div>

        {/* Branding */}

        <div className="mt-10">

          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8FD3FF]">
            WeatherSnap
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Building your Weather Snapshot
          </h2>

          <p
            key={messageIndex}
            className="mt-4 min-h-7 text-base font-medium text-slate-300 sm:text-lg"
          >
            {loadingMessages[messageIndex]}
          </p>

        </div>

        {/* Progress indicator */}

        <div className="mt-8 flex items-center gap-2">
          {loadingMessages.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index <= messageIndex
                  ? "w-8 bg-[#2E9BFF]"
                  : "w-4 bg-white/20"
              }`}
            />
          ))}
        </div>

        <p className="mt-7 max-w-md text-sm leading-6 text-slate-400">
          Reviewing documented weather activity from authoritative
          weather data sources.
        </p>

      </div>
    </div>
  );
}