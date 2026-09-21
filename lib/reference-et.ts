/** FAO-56 equations 21, 23–25 and 52. Radiation converted from MJ/m²/day to mm/day.
 * https://www.fao.org/4/x0490e/x0490e07.htm
 * Climatic reference demand, not measured open-water evaporation.
 */
export function referenceEt(
  date: string,
  latitude: number,
  min: number,
  max: number,
  mean: number,
): number {
  const timestamp = Date.parse(date);
  const year = new Date(timestamp).getUTCFullYear();
  const day = (timestamp - Date.UTC(year, 0, 0)) / 86400000;
  const phi = (latitude * Math.PI) / 180;
  const distance = 1 + 0.033 * Math.cos((2 * Math.PI * day) / 365);
  const declination = 0.409 * Math.sin((2 * Math.PI * day) / 365 - 1.39);
  const sunset = Math.acos(-Math.tan(phi) * Math.tan(declination));
  const radiationMJ =
    ((24 * 60) / Math.PI) *
    0.082 *
    distance *
    (sunset * Math.sin(phi) * Math.sin(declination) +
      Math.cos(phi) * Math.cos(declination) * Math.sin(sunset));
  return Math.max(
    0,
    0.0023 * (mean + 17.8) * Math.sqrt(max - min) * radiationMJ * 0.408,
  );
}
