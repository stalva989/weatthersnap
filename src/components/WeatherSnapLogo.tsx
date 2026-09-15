type WeatherSnapLogoProps = {
  variant?: "dark" | "light";
  showTagline?: boolean;
  className?: string;
};

export default function WeatherSnapLogo({
  variant = "dark",
  showTagline = true,
  className = "",
}: WeatherSnapLogoProps) {
  const primaryText =
    variant === "light" ? "text-white" : "text-[var(--navy)]";

  const taglineText =
    variant === "light" ? "text-slate-300" : "text-slate-500";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="h-12 w-12 shrink-0"
        role="img"
        aria-label="WeatherSnap radar logo"
      >
        <defs>
          <clipPath id="weatherSnapRadarClip">
            <circle cx="32" cy="32" r="28" />
          </clipPath>

          <linearGradient
            id="weatherSnapSweep"
            x1="32"
            y1="32"
            x2="57"
            y2="10"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0"
              stopColor="#2E9BFF"
              stopOpacity="0.75"
            />
            <stop
              offset="1"
              stopColor="#2E9BFF"
              stopOpacity="0.08"
            />
          </linearGradient>
        </defs>

        {/* Radar background */}
        <circle cx="32" cy="32" r="30" fill="#0B1F3B" />

        <g clipPath="url(#weatherSnapRadarClip)">
          {/* Radar rings */}
          <circle
            cx="32"
            cy="32"
            r="9"
            fill="none"
            stroke="#2E9BFF"
            strokeOpacity="0.5"
            strokeWidth="1"
          />

          <circle
            cx="32"
            cy="32"
            r="18"
            fill="none"
            stroke="#2E9BFF"
            strokeOpacity="0.38"
            strokeWidth="1"
          />

          <circle
            cx="32"
            cy="32"
            r="27"
            fill="none"
            stroke="#2E9BFF"
            strokeOpacity="0.3"
            strokeWidth="1"
          />

          {/* Crosshairs */}
          <line
            x1="32"
            y1="4"
            x2="32"
            y2="60"
            stroke="#2E9BFF"
            strokeOpacity="0.28"
            strokeWidth="1"
          />

          <line
            x1="4"
            y1="32"
            x2="60"
            y2="32"
            stroke="#2E9BFF"
            strokeOpacity="0.28"
            strokeWidth="1"
          />

          {/* Radar sweep */}
          <path
            d="M32 32 L58 9 A35 35 0 0 1 60 35 Z"
            fill="url(#weatherSnapSweep)"
          />

          {/* Storm returns */}
          <circle cx="45" cy="20" r="4.2" fill="#FF8A00" />

          <circle
            cx="49"
            cy="25"
            r="2.7"
            fill="#FFB347"
          />

          <circle
            cx="42"
            cy="25"
            r="2.3"
            fill="#FF8A00"
            fillOpacity="0.85"
          />

          <circle
            cx="21"
            cy="43"
            r="2.8"
            fill="#2E9BFF"
            fillOpacity="0.85"
          />

          {/* Center point */}
          <circle
            cx="32"
            cy="32"
            r="3.6"
            fill="white"
          />

          <circle
            cx="32"
            cy="32"
            r="1.8"
            fill="#2E9BFF"
          />
        </g>

        {/* Outer border */}
        <circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke="#2E9BFF"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
      </svg>

      <div className="leading-none">
        <div
          className={`font-[var(--font-heading)] text-xl font-bold tracking-tight ${primaryText}`}
        >
          Weather
          <span className="text-[var(--storm-blue)]">
            Snap
          </span>
        </div>

        {showTagline && (
          <div
            className={`mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${taglineText}`}
          >
            Weather Intelligence. Instantly.
          </div>
        )}
      </div>
    </div>
  );
}