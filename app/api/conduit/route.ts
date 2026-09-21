import type { ConduitReading } from '@/lib/conduit';

const API_URL = 'https://conduit.jhubafrica.com/data.php';
const STATION_COORDINATES: [number, number, number] = [37.014528, -1.099736, 1523];
type UnknownRecord = Record<string, unknown>;

function object(value: unknown): UnknownRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function rowsFrom(payload: unknown): UnknownRecord[] {
  if (Array.isArray(payload)) return payload.map(object).filter(Boolean) as UnknownRecord[];
  const root = object(payload);
  if (!root) return [];
  for (const key of ['data', 'records', 'results', 'observations']) {
    if (Array.isArray(root[key])) {
      return (root[key] as unknown[]).map(object).filter(Boolean) as UnknownRecord[];
    }
  }
  return [];
}

function value(record: UnknownRecord, aliases: string[]): unknown {
  const normalized = new Map(
    Object.entries(record).map(([key, item]) => [
      key.toLowerCase().replace(/[^a-z0-9]/g, ''), item,
    ]),
  );
  for (const alias of aliases) {
    const found = normalized.get(alias.toLowerCase().replace(/[^a-z0-9]/g, ''));
    if (found !== undefined && found !== null && found !== '') return found;
  }
  return undefined;
}

function numeric(record: UnknownRecord, aliases: string[], label: string): number {
  const parsed = Number(value(record, aliases));
  if (!Number.isFinite(parsed)) throw new Error(`Conduit response has no valid ${label}.`);
  return parsed;
}

function textValue(input: unknown): string {
  return typeof input === 'string' || typeof input === 'number'
    ? String(input)
    : '';
}

function dateRange() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Nairobi', year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const now = new Date();
  return {
    fromdate: formatter.format(new Date(now.valueOf() - 86_400_000)),
    todate: formatter.format(now),
  };
}

export async function GET() {
  try {
    const apikey = process.env.CONDUIT_API_KEY;
    const email = process.env.CONDUIT_EMAIL;
    if (!apikey || !email) {
      throw new Error('Live Conduit credentials are not configured on the server.');
    }

    const response = await fetch(API_URL, {
      method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(15_000),
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ apikey, email, ...dateRange() }),
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`Conduit API returned HTTP ${response.status}.`);
    if (/^\s*</.test(body)) throw new Error('Conduit returned a webpage instead of API data.');

    let decoded: unknown;
    try { decoded = JSON.parse(body); } catch { throw new Error('Conduit returned invalid JSON.'); }
    const root = object(decoded);
    if (root?.status === 'error' || root?.success === false) {
      throw new Error(
        textValue(root.message ?? root.error) || 'Conduit rejected the request.',
      );
    }
    const records = rowsFrom(decoded);
    if (!records.length) throw new Error('Conduit returned no observations for the current date range.');

    const record = records.reduce((latest, candidate) => {
      const candidateTime = Date.parse(textValue(value(candidate, ['Time', 'time', 'timestamp', 'datetime'])));
      const latestTime = Date.parse(textValue(value(latest, ['Time', 'time', 'timestamp', 'datetime'])));
      return Number.isFinite(candidateTime) && candidateTime > latestTime ? candidate : latest;
    });
    const observedAt = textValue(value(record, ['Time', 'time', 'timestamp', 'datetime', 'created_at']));
    if (!observedAt) throw new Error('Conduit response has no observation timestamp.');

    const reading: ConduitReading = {
      source: 'Conduit@Empathy', stationId: '61', observedAt,
      coordinates: STATION_COORDINATES,
      rain: {
        gauge1TotalMm: numeric(record, ['Rain Gauge 1 Total Today', 'rgt', 'rain_gauge_1_total_today'], 'rain gauge 1 total'),
        gauge2TotalMm: numeric(record, ['Rain Gauge 2 Total Today', 'rgt2', 'rain_gauge_2_total_today'], 'rain gauge 2 total'),
        interpretation: 'cumulative totals; daily increment not established',
      },
      temperatureC: numeric(record, ['SHT Temperature', 'st1', 'sht_temperature'], 'SHT temperature'),
      wetBulbC: numeric(record, ['Wet Bulb Temperature', 'wbt', 'wet_bulb_temperature'], 'wet-bulb temperature'),
      heatIndexC: numeric(record, ['Heat Index', 'hi', 'heat_index'], 'heat index'),
      humidityPct: numeric(record, ['SHT Humidity', 'sh1', 'sht_humidity'], 'humidity'),
      pressureHpa: numeric(record, ['BMX Pressure 1', 'bp1', 'bmx_pressure_1'], 'air pressure'),
      windSpeedMs: numeric(record, ['Wind Speed', 'ws', 'wind_speed'], 'wind speed'),
      windDirectionDeg: numeric(record, ['Wind Direction', 'wd', 'wind_direction'], 'wind direction'),
      windGustMs: numeric(record, ['Wind Gust', 'wg', 'wind_gust'], 'wind gust'),
      ultraviolet: numeric(record, ['SI1145 Ultraviolet 1', 'su1', 'si1145_ultraviolet_1'], 'ultraviolet'),
      infrared: numeric(record, ['SI1145 Infrared 1', 'si1', 'si1145_infrared_1'], 'infrared'),
      visibleLight: numeric(record, ['SI1145 Visible 1', 'sv1', 'si1145_visible_1'], 'visible light'),
      provenance: {
        portal: 'https://conduit.jhubafrica.com/',
        dataset: 'Authenticated Conduit JKUAT API, station 61',
        retrievedAt: new Date().toISOString(),
      },
    };
    return Response.json(reading, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Conduit data could not be read.';
    return Response.json(
      { error: message, fallback: 'official historical Conduit replay' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
