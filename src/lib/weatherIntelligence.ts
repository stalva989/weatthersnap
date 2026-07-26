import { DailyWeatherObservation } from "@/types/weather";
import { WeatherThresholds } from "./weatherThresholds";

export type WeatherEvent = {
  date: string;

  severity: "none" | "low" | "moderate" | "high";

  severityScore: number;

  daysFromLoss: number;

  summary: string;

  findings: WeatherFinding[];

  observation: DailyWeatherObservation;
};

export type WeatherFinding = {
  severity: "none" | "low" | "moderate" | "high";

  title: string;

  description: string;

  date: string;

  daysFromLoss: number;
};

export type SnapshotSummary = {
  selectedDate: string;

  selectedDateFindings: WeatherFinding[];

  nearbyFindings: WeatherFinding[];

  highestSeverity: "none" | "low" | "moderate" | "high";

  recommendation:
    | "No Significant Weather"
    | "Further Investigation Recommended";

  conclusion: string;

  nearbyActivity: string;
};

export function evaluateObservation(
  observation: DailyWeatherObservation,
  selectedDate: string
): WeatherFinding[] {
  const findings: WeatherFinding[] = [];
  const daysFromLoss = Math.round(
    (new Date(observation.date).getTime() - new Date(selectedDate).getTime()) /
        (1000 * 60 * 60 * 24)
);

  if ((observation.maxWind5Second ?? 0) >= WeatherThresholds.wind.damaging) {
    findings.push({
        severity: "high",
        title: "Damaging Wind",
        description: `Peak 5-second wind gust reached ${observation.maxWind5Second} mph.`,
        date: observation.date,
        daysFromLoss,
    });
  }

  if ((observation.precipitation ?? 0) >= WeatherThresholds.precipitation.heavy) {
    findings.push({
        severity: "high",
        title: "Damaging Wind",
        description: `Peak 5-second wind gust reached ${observation.maxWind5Second} mph.`,
        date: observation.date,
        daysFromLoss,
    });
  }

  if (observation.hail) {
   findings.push({
        severity: "high",
        title: "Damaging Wind",
        description: `Peak 5-second wind gust reached ${observation.maxWind5Second} mph.`,
        date: observation.date,
        daysFromLoss,
    });
  }

  if (observation.thunder) {
    findings.push({
        severity: "high",
        title: "Damaging Wind",
        description: `Peak 5-second wind gust reached ${observation.maxWind5Second} mph.`,
        date: observation.date,
        daysFromLoss,
    });
  }

  if (observation.tornado) {
    findings.push({
        severity: "high",
        title: "Damaging Wind",
        description: `Peak 5-second wind gust reached ${observation.maxWind5Second} mph.`,
        date: observation.date,
        daysFromLoss,
    });
  }

  if (findings.length === 0) {
    findings.push({
        severity: "high",
        title: "Damaging Wind",
        description: `Peak 5-second wind gust reached ${observation.maxWind5Second} mph.`,
        date: observation.date,
        daysFromLoss,
    });
  }

  return findings;
}

function buildEventSummary(findings: WeatherFinding[]): string {
  const titles = findings
    .filter((finding) => finding.severity !== "none")
    .map((finding) => finding.title);

  if (titles.length === 0) {
    return "No significant weather identified.";
  }

  return titles.join(", ");
}

export function buildWeatherEvents(
  observations: DailyWeatherObservation[],
  selectedDate: string
): WeatherEvent[] {
  return observations
    .map((observation) => {
      const findings = evaluateObservation(observation, selectedDate);

      const severityOrder = {
        none: 0,
        low: 1,
        moderate: 2,
        high: 3,
      };

      const highestSeverity = findings.reduce(
        (highest, finding) =>
          severityOrder[finding.severity] > severityOrder[highest]
            ? finding.severity
            : highest,
        "none" as WeatherFinding["severity"]
      );

      let severityScore = 0;

        for (const finding of findings) {
            switch (finding.severity) {
                case "high":
                    severityScore += 100;
                    break;

                case "moderate":
                    severityScore += 50;
                    break;

                case "low":
                    severityScore += 20;
                    break;
            }
        }

      return {
        date: observation.date,
        daysFromLoss: findings[0]?.daysFromLoss ?? 0,
        severity: highestSeverity,
        severityScore,
        summary: buildEventSummary(findings),
        findings,
        observation,
      };
    })
    .sort((a, b) => {
      const severityOrder = {
        none: 0,
        low: 1,
        moderate: 2,
        high: 3,
      };

      if (a.severityScore !== b.severityScore) {
        return b.severityScore - a.severityScore;
      }

      return (
        Math.abs(a.daysFromLoss) - Math.abs(b.daysFromLoss)
      );
    });
}

export function buildSnapshotSummary(
  events: WeatherEvent[],
  selectedDate: string
): SnapshotSummary {

  const selectedDateFindings = events
  .filter((event) => event.date === selectedDate)
  .flatMap((event) => event.findings);

    const nearbyFindings = events
    .filter(
        (event) =>
        event.date !== selectedDate &&
        event.severity !== "none"
    )
    .flatMap((event) => event.findings);

    const severities = events.map((event) => event.severity);

  const highestSeverity = severities.includes("high")
    ? "high"
    : severities.includes("moderate")
    ? "moderate"
    : severities.includes("low")
    ? "low"
    : "none";

  return {
    selectedDate,

    selectedDateFindings,

    nearbyFindings,

    highestSeverity,

    recommendation:
        highestSeverity === "none"
        ? "No Significant Weather"
        : "Further Investigation Recommended",

    conclusion:
        selectedDateFindings.length > 0 &&
        selectedDateFindings.some((f) => f.severity !== "none")
        ? "Potentially significant weather activity was identified on the selected Date of Loss."
        : "No significant weather activity was identified on the selected Date of Loss.",

    nearbyActivity:
        nearbyFindings.length > 0
        ? `Potentially significant weather activity was identified on ${nearbyFindings.length} nearby day(s).`
        : "No significant nearby weather activity was identified.",
  };
}