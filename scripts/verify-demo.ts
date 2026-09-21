import fs from 'node:fs';
import { defaults, compare } from '../lib/planner.ts';
import { conduitReplay } from '../lib/conduit-history.ts';
const rain = conduitReplay.map((d) => d.rainMm),
  et = conduitReplay.map((d) => d.referenceEtMm);
const evidence = {
  capturedAt: new Date().toISOString(),
  weather: conduitReplay,
  defaults,
  defaultResult: compare(defaults, rain, et),
  fixedWeather: compare(defaults, rain),
  editedResult: compare({ ...defaults, initial: 8000 }, rain, et),
};
fs.writeFileSync(
  'brag-output/evidence/calculations.json',
  JSON.stringify(evidence, null, 2),
);
console.log(
  JSON.stringify({
    withWeather: evidence.defaultResult.plan.map((d) => d.hours),
    fixedWeather: evidence.fixedWeather.plan.map((d) => d.hours),
  }),
);
