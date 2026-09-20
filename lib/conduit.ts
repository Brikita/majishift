export type ConduitReading = {
  source: 'Conduit@Empathy';
  stationId: '61';
  observedAt: string;
  coordinates: [number, number, number | null];
  rain: {
    gauge1TotalMm: number;
    gauge2TotalMm: number;
    interpretation: 'cumulative totals; daily increment not established';
  };
  temperatureC: number;
  wetBulbC: number;
  heatIndexC: number;
  humidityPct: number;
  pressureHpa: number;
  windSpeedMs: number;
  windDirectionDeg: number;
  windGustMs: number;
  ultraviolet: number;
  infrared: number;
  visibleLight: number;
  provenance: {
    portal: string;
    dataset: string;
    retrievedAt: string;
  };
};
