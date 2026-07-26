export function calculateDistanceMiles(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number {
  const earthRadiusMiles = 3958.8;

  const toRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };

  const latitudeDifference = toRadians(latitude2 - latitude1);
  const longitudeDifference = toRadians(longitude2 - longitude1);

  const firstLatitude = toRadians(latitude1);
  const secondLatitude = toRadians(latitude2);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((earthRadiusMiles * c).toFixed(2));
}