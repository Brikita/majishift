export const conduitReplay = [
  { date: '2026-08-29', samples: 1415, rainMm: 0, temperatureMinC: 14.1, temperatureMaxC: 27.7, temperatureMeanC: 19.86, referenceEtMm: 11.6 },
  { date: '2026-08-30', samples: 1403, rainMm: 0, temperatureMinC: 15.1, temperatureMaxC: 26.6, temperatureMeanC: 19.79, referenceEtMm: 10.67 },
  { date: '2026-08-31', samples: 1415, rainMm: 0, temperatureMinC: 14.6, temperatureMaxC: 22.6, temperatureMeanC: 17.99, referenceEtMm: 8.48 },
  { date: '2026-09-01', samples: 1411, rainMm: 0, temperatureMinC: 15.2, temperatureMaxC: 27.9, temperatureMeanC: 20.03, referenceEtMm: 11.32 },
  { date: '2026-09-02', samples: 1415, rainMm: 0, temperatureMinC: 13.8, temperatureMaxC: 29.5, temperatureMeanC: 20.46, referenceEtMm: 12.75 },
  { date: '2026-09-03', samples: 1414, rainMm: 0, temperatureMinC: 13.7, temperatureMaxC: 28.3, temperatureMeanC: 19.94, referenceEtMm: 12.14 },
  { date: '2026-09-04', samples: 1412, rainMm: 0, temperatureMinC: 11.8, temperatureMaxC: 27.6, temperatureMeanC: 19.8, referenceEtMm: 12.61 },
] as const;

export const conduitReplayProvenance = {
  source: 'Official Hack The Weather Conduit Data CSV',
  stationId: '61',
  coordinates: [37.014528, -1.099736, 1523] as const,
  attribution: '3d-fewsnet.icdp.ucar.edu',
  doi: 'https://doi.org/10.5065/d6v1236q',
  method:
    'Daily rain is the mean of the final Rain Gauge 1/2 Total Today values. Daily reference evapotranspiration uses the FAO-56 Hargreaves equation with Conduit SHT temperature minima, maxima and means, station latitude and day of year.',
  limitation:
    'This is a historical weather replay. Reference evapotranspiration is a transparent estimate, not measured reservoir evaporation or a future forecast.',
} as const;
