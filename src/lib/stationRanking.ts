import { NceiStation } from "./ncei";

export type RankedStation = NceiStation & {
  score: number;
  reasons: string[];
};

export function rankStations(
  stations: NceiStation[]
): RankedStation[] {
  return stations
    .map((station) => {
      let score = 100;
      const reasons: string[] = [];

      // Distance scoring
      score -= Math.round(station.distanceMiles);

      reasons.push(
        `Located ${station.distanceMiles} miles from the property`
      );

      // Bonus for ASOS stations
      if (station.platforms.includes("ASOS")) {
        score += 10;
        reasons.push("ASOS weather station");
      }

      // Bonus for many available weather fields
      if (station.dataTypes.length >= 40) {
        score += 10;
        reasons.push("Extensive weather observations available");
      }

      return {
        ...station,
        score,
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score);
}