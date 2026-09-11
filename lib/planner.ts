export type Config = {
  capacity: number;
  initial: number;
  reserve: number;
  essential: number;
  irrigation: number;
  pumpRate: number;
  maxHours: number;
  baselineHours: number;
  area: number;
  evaporation: number;
  outageStart: number;
  outageDays: number;
  rainScale: number;
};
export const defaults: Config = {
  capacity: 20000,
  initial: 9000,
  reserve: 5000,
  essential: 1400,
  irrigation: 250,
  pumpRate: 250,
  maxHours: 10,
  baselineHours: 4,
  area: 8000,
  evaporation: 4,
  outageStart: 2,
  outageDays: 2,
  rainScale: 1,
};
export type Day = {
  day: number;
  start: number;
  end: number;
  rainMm: number;
  rain: number;
  evaporation: number;
  hours: number;
  pumped: number;
  essential: number;
  unmet: number;
  irrigation: number;
  deferred: number;
  overflow: number;
  outage: boolean;
  reason: string;
};
export function validate(c: Config): string[] {
  const errors: string[] = [];
  for (const key of Object.keys(defaults) as (keyof Config)[])
    if (!Number.isFinite(c[key]) || c[key] < 0)
      errors.push(`${key} must be a non-negative number.`);
  if (c.capacity <= 0 || c.capacity > 1e8)
    errors.push('Capacity must be between 0 and 100 million m³.');
  if (c.initial > c.capacity || c.reserve > c.capacity)
    errors.push('Starting storage and reserve cannot exceed capacity.');
  if (c.maxHours > 24 || c.baselineHours > c.maxHours)
    errors.push('Pumping hours must fit within availability and 24 hours.');
  if (
    !Number.isInteger(c.outageStart) ||
    c.outageStart > 7 ||
    !Number.isInteger(c.outageDays) ||
    c.outageDays > 7
  )
    errors.push(
      'Outage start and duration must be whole days between 0 and 7.',
    );
  if (c.rainScale > 3) errors.push('Rain multiplier must be between 0 and 3.');
  if (
    c.pumpRate > 1e6 ||
    c.essential > 1e8 ||
    c.irrigation > 1e8 ||
    c.area > 1e9 ||
    c.evaporation > 100
  )
    errors.push('One or more inputs exceed the supported scenario range.');
  return errors;
}
const rain = [0, 0, 2, 8, 4, 0, 0];
export function simulate(c: Config, proposed: boolean): Day[] {
  const errors = validate(c);
  if (errors.length) throw new Error(errors.join(' '));
  let storage = c.initial;
  const rows: Day[] = [];
  const unavailable = (i: number) =>
    c.outageStart > 0 &&
    i + 1 >= c.outageStart &&
    i + 1 < c.outageStart + c.outageDays;
  for (let i = 0; i < 7; i++) {
    const start = storage,
      rainMm = rain[i] * c.rainScale,
      rainVolume = (rainMm * c.area) / 1000,
      evapRequest = (c.evaporation * c.area) / 1000;
    let ahead = 0;
    for (let j = i + 1; j < 7 && unavailable(j); j++) ahead++;
    // Reserve-first heuristic; future rainfall is not counted on for the outage buffer.
    const target = Math.min(
      c.capacity,
      c.reserve + ahead * (c.essential + c.irrigation + evapRequest),
    );
    const needed = Math.max(
      0,
      target + c.essential + c.irrigation + evapRequest - start - rainVolume,
    );
    const hours =
      unavailable(i) || c.pumpRate === 0
        ? 0
        : proposed
          ? Math.min(c.maxHours, Math.ceil((needed / c.pumpRate) * 2) / 2)
          : c.baselineHours;
    const pumped = hours * c.pumpRate;
    // Daily aggregate balance: no claim of intraday hydraulic feasibility.
    const available = start + rainVolume + pumped;
    const evaporation = Math.min(available, evapRequest);
    const essential = Math.min(
      Math.max(0, available - evaporation),
      c.essential,
    );
    const left = Math.max(0, available - evaporation - essential);
    const irrigation = Math.min(
      c.irrigation,
      proposed ? Math.max(0, left - c.reserve) : left,
    );
    const raw = left - irrigation,
      overflow = Math.max(0, raw - c.capacity);
    storage = Math.min(c.capacity, raw);
    rows.push({
      day: i + 1,
      start,
      end: storage,
      rainMm,
      rain: rainVolume,
      evaporation,
      hours,
      pumped,
      essential,
      unmet: c.essential - essential,
      irrigation,
      deferred: c.irrigation - irrigation,
      overflow,
      outage: unavailable(i),
      reason: unavailable(i)
        ? 'Pumping is unavailable. Stored water serves essential demand first.'
        : ahead > 0
          ? `Build a buffer before ${ahead} unavailable pumping day${ahead === 1 ? '' : 's'}. Future rainfall is not counted on for that buffer.`
          : hours > 0
            ? 'Replenish the end-of-day reserve after essential demand and the irrigation request.'
            : 'Available storage and scenario rainfall cover the daily request and reserve.',
    });
  }
  return rows;
}
export function compare(c: Config) {
  const baseline = simulate(c, false),
    plan = simulate(c, true);
  const sum = (key: 'unmet' | 'deferred' | 'pumped' | 'overflow') =>
    plan.reduce((s, d) => s + d[key], 0);
  return {
    baseline,
    plan,
    minimum: Math.min(...plan.map((d) => d.end)),
    unmet: sum('unmet'),
    deferred: sum('deferred'),
    pumped: sum('pumped'),
    overflow: sum('overflow'),
  };
}
