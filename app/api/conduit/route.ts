import type { ConduitReading } from '@/lib/conduit';

const PORTAL_URL = 'https://conduit.jhubafrica.com/model.html';

type UnknownRecord = Record<string, unknown>;

function object(value: unknown, label: string): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Conduit response is missing ${label}.`);
  }
  return value as UnknownRecord;
}

function number(value: unknown, label: string): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Conduit response has an invalid ${label}.`);
  }
  return parsed;
}

async function dataUrl(): Promise<string> {
  if (process.env.CONDUIT_DATA_URL) return process.env.CONDUIT_DATA_URL;

  const portal = await fetch(PORTAL_URL, {
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  if (!portal.ok) throw new Error('Conduit portal is unavailable.');
  const html = await portal.text();
  const match = html.match(/fetch\(["'](https:\/\/[^"']+)["']\)/);
  if (!match) throw new Error('Conduit public data link was not found.');
  return match[1];
}

export async function GET() {
  try {
    const endpoint = await dataUrl();
    const response = await fetch(endpoint, {
      cache: 'no-store',
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new Error('Conduit station feed is unavailable.');

    const payload = object(await response.json(), 'payload');
    const features = payload.features;
    if (!Array.isArray(features) || !features.length) {
      throw new Error('Conduit response contains no station feature.');
    }
    const feature = object(features[0], 'station feature');
    const properties = object(feature.properties, 'station properties');
    const records = properties.data;
    if (!Array.isArray(records) || !records.length) {
      throw new Error('Conduit response contains no observation.');
    }
    const record = object(records[0], 'latest observation');
    const measurements = object(record.measurements, 'measurements');
    const geometry = object(feature.geometry, 'station geometry');
    const coordinates = geometry.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      throw new Error('Conduit response contains no station coordinates.');
    }

    const gauge1TotalMm = number(measurements.rgt, 'rain gauge 1 total');
    const gauge2TotalMm = number(measurements.rgt2, 'rain gauge 2 total');
    const reading: ConduitReading = {
      source: 'Conduit@Empathy',
      stationId: '61',
      observedAt: String(record.time),
      coordinates: [
        number(coordinates[0], 'longitude'),
        number(coordinates[1], 'latitude'),
        coordinates[2] == null ? null : number(coordinates[2], 'elevation'),
      ],
      rain: {
        gauge1TotalMm,
        gauge2TotalMm,
        planningMm: (gauge1TotalMm + gauge2TotalMm) / 2,
        method: 'mean of two cumulative station gauges',
      },
      temperatureC: number(measurements.st1, 'SHT temperature'),
      wetBulbC: number(measurements.wbt, 'wet-bulb temperature'),
      heatIndexC: number(measurements.hi, 'heat index'),
      humidityPct: number(measurements.sh1, 'humidity'),
      pressureHpa: number(measurements.bp1, 'air pressure'),
      windSpeedMs: number(measurements.ws, 'wind speed'),
      windDirectionDeg: number(measurements.wd, 'wind direction'),
      windGustMs: number(measurements.wg, 'wind gust'),
      ultraviolet: number(measurements.su1, 'ultraviolet'),
      infrared: number(measurements.si1, 'infrared'),
      visibleLight: number(measurements.sv1, 'visible light'),
      provenance: {
        portal: 'https://conduit.jhubafrica.com/',
        dataset: 'Conduit public JKUAT station feed, station 61',
        retrievedAt: new Date().toISOString(),
      },
    };

    return Response.json(reading, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Conduit data could not be read.';
    return Response.json(
      { error: message, fallback: 'synthetic scenario rainfall' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
