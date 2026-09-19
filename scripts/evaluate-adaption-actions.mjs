import { readFileSync } from 'node:fs';

const [truthPath, predictionPath] = process.argv.slice(2);
if (!truthPath || !predictionPath) {
  throw new Error(
    'Usage: node scripts/evaluate-adaption-actions.mjs test.jsonl predictions.jsonl',
  );
}

const lines = (path) =>
  readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        throw new Error(`${path}:${index + 1} is not valid JSON.`);
      }
    });

const truth = lines(truthPath);
const predictions = new Map(
  lines(predictionPath).map((row) => [row.id, row.prediction]),
);
const fields = ['headline', 'action', 'rationale', 'safeguard', 'data_scope'];
const fieldMatches = Object.fromEntries(fields.map((field) => [field, 0]));
let exact = 0;
let invalid = 0;

for (const row of truth) {
  const expected = JSON.parse(row.response);
  let prediction = predictions.get(row.id);
  if (typeof prediction === 'string') {
    try {
      prediction = JSON.parse(prediction);
    } catch {
      prediction = null;
    }
  }
  if (
    !prediction ||
    typeof prediction !== 'object' ||
    Array.isArray(prediction) ||
    fields.some((field) => typeof prediction[field] !== 'string')
  ) {
    invalid++;
    continue;
  }
  let rowExact = true;
  for (const field of fields) {
    if (prediction[field] === expected[field]) fieldMatches[field]++;
    else rowExact = false;
  }
  if (rowExact) exact++;
}

const total = truth.length;
console.log(
  JSON.stringify(
    {
      cases: total,
      predictionsReceived: predictions.size,
      invalidOrMissing: invalid,
      exactMatches: exact,
      exactMatchRate: total ? exact / total : 0,
      fieldAccuracy: Object.fromEntries(
        fields.map((field) => [field, total ? fieldMatches[field] / total : 0]),
      ),
    },
    null,
    2,
  ),
);

if (invalid > 0 || predictions.size !== total) process.exitCode = 1;
