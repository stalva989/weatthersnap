export type SpcStormReport = {
  id: string;

  date: string;

  latitude: number;
  longitude: number;

  type: "Hail" | "Wind" | "Tornado";

  magnitude: number | null;

  source: "SPC";
};

export async function getSpcStormReports(
  startDate: string,
  endDate: string
): Promise<SpcStormReport[]> {

  /*
   * Temporary stub.
   * We'll connect the real SPC data next.
   */

  console.log("SPC lookup", {
    startDate,
    endDate,
  });

  return [];
}