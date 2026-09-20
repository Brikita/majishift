import { mkdirSync, writeFileSync } from 'node:fs';
import { compare, defaults } from '../lib/planner.ts';

type Row = {
  id: string;
  split: 'train' | 'test';
  instruction: string;
  context: string;
  response: string;
};

type SyntheticOperatorRecord = {
  record_id: string;
  scenario_id: string;
  relative_day: number;
  evidence_status: 'synthetic';
  rainfall_source: 'synthetic_conduit_shaped' | 'synthetic_scenario';
  rain_mm: number;
  start_storage_m3: number;
  end_storage_m3: number;
  pump_available: boolean;
  pump_hours: number;
  pumped_m3: number;
  essential_served_m3: number;
  essential_unmet_m3: number;
  irrigation_served_m3: number;
  irrigation_deferred_m3: number;
  overflow_m3: number;
  suggested_review: string;
  operator_review_status: 'not_reviewed';
};

const instruction =
  'Write a concise reservoir-operator brief from the supplied Conduit observation and verified deterministic water-balance result. Preserve every number and source label. Do not invent forecasts, sensor readings, infrastructure, commands, or certainty. State the next reviewable action, the reason, and one safeguard. Return JSON only with headline, action, rationale, safeguard, and data_scope.';

const rainProfiles = [
  [0, 0, 2, 8, 4, 0, 0],
  [18, 2, 0, 0, 0, 5, 1],
  [0, 0, 0, 0, 0, 0, 0],
  [4, 9, 12, 3, 0, 0, 0],
] as const;
const initialLevels = [2500, 5000, 9000, 14000, 19000];
const essentialDemands = [900, 1400, 2200];
const outages = [
  [0, 0],
  [2, 2],
  [4, 3],
] as const;

function quote(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function completion(
  minimum: number,
  unmet: number,
  reserve: number,
  dayOneHours: number,
  observedRain: number,
) {
  if (unmet > 0) {
    return {
      headline: 'Essential-demand gap in this scenario',
      action:
        'Escalate the supply gap for operator review before scheduling irrigation.',
      rationale: `${Math.round(unmet)} m3 of essential demand is unmet across the seven-day calculation.`,
      safeguard:
        'Do not treat the model as a pump command; verify storage, demand and supply constraints.',
      data_scope: `Day 1 rain is a Conduit-shaped observation (${observedRain} mm); later rain and all operating values are labelled scenarios.`,
    };
  }
  if (minimum < reserve) {
    return {
      headline: 'Reserve threshold is crossed',
      action:
        'Protect essential demand and review discretionary irrigation with the operator.',
      rationale: `Calculated minimum storage is ${Math.round(minimum)} m3 against a ${Math.round(reserve)} m3 reserve.`,
      safeguard:
        'Confirm the reservoir storage curve and usable capacity before operational use.',
      data_scope: `Day 1 rain is a Conduit-shaped observation (${observedRain} mm); later rain and all operating values are labelled scenarios.`,
    };
  }
  return {
    headline: 'Reserve maintained in the current scenario',
    action:
      dayOneHours > 0
        ? `Review a ${dayOneHours.toFixed(1)} hour Day 1 pumping window with the operator.`
        : 'Continue monitoring; the calculation does not require Day 1 pumping.',
    rationale: `Calculated minimum storage remains ${Math.round(minimum)} m3, at or above the ${Math.round(reserve)} m3 reserve.`,
    safeguard:
      'Refresh Conduit data and re-run the balance when inputs change.',
    data_scope: `Day 1 rain is a Conduit-shaped observation (${observedRain} mm); later rain and all operating values are labelled scenarios.`,
  };
}

const rows: Row[] = [];
const operatorRecords: SyntheticOperatorRecord[] = [];
let index = 0;
for (const rain of rainProfiles) {
  for (const initial of initialLevels) {
    for (const essential of essentialDemands) {
      for (const [outageStart, outageDays] of outages) {
        const config = {
          ...defaults,
          initial,
          essential,
          outageStart,
          outageDays,
        };
        const result = compare(config, rain);
        const temperatureC = 18 + ((index * 7) % 16);
        const humidityPct = 35 + ((index * 11) % 55);
        const windSpeedMs = ((index * 3) % 24) / 10;
        const context = {
          provenance: {
            observation:
              'synthetic training row shaped to Conduit station 61 fields',
            planning: 'deterministic MajiShift daily water balance',
          },
          conduit: {
            rain_today_mm: rain[0],
            temperature_c: temperatureC,
            humidity_pct: humidityPct,
            wind_speed_m_s: windSpeedMs,
          },
          scenario: config,
          calculation: {
            minimum_storage_m3: result.minimum,
            essential_unmet_m3: result.unmet,
            irrigation_deferred_m3: result.deferred,
            day_1_pump_hours: result.plan[0].hours,
            reserve_breaches: result.plan.filter(
              (day) => day.end < config.reserve,
            ).length,
          },
        };
        const answer = completion(
          result.minimum,
          result.unmet,
          config.reserve,
          result.plan[0].hours,
          rain[0],
        );
        rows.push({
          id: `action-${String(index + 1).padStart(3, '0')}`,
          split: index % 9 === 0 ? 'test' : 'train',
          instruction,
          context: JSON.stringify(context),
          response: JSON.stringify(answer),
        });
        for (const day of result.plan) {
          operatorRecords.push({
            record_id: `synthetic-${String(index + 1).padStart(3, '0')}-d${day.day}`,
            scenario_id: `action-${String(index + 1).padStart(3, '0')}`,
            relative_day: day.day,
            evidence_status: 'synthetic',
            rainfall_source:
              day.day === 1
                ? 'synthetic_conduit_shaped'
                : 'synthetic_scenario',
            rain_mm: day.rainMm,
            start_storage_m3: day.start,
            end_storage_m3: day.end,
            pump_available: !day.outage,
            pump_hours: day.hours,
            pumped_m3: day.pumped,
            essential_served_m3: day.essential,
            essential_unmet_m3: day.unmet,
            irrigation_served_m3: day.irrigation,
            irrigation_deferred_m3: day.deferred,
            overflow_m3: day.overflow,
            suggested_review: day.reason,
            operator_review_status: 'not_reviewed',
          });
        }
        index++;
      }
    }
  }
}

const directory = 'work/adaption-actions';
mkdirSync(directory, { recursive: true });
const training = rows.filter((row) => row.split === 'train');
const testing = rows.filter((row) => row.split === 'test');
writeFileSync(
  `${directory}/train.csv`,
  `instruction,context,response\n${training
    .map((row) =>
      [row.instruction, row.context, row.response].map(quote).join(','),
    )
    .join('\n')}\n`,
);
writeFileSync(
  `${directory}/train-fused.csv`,
  `prompt,completion\n${training
    .map((row) =>
      [
        `${row.instruction}\n\nInput context (JSON):\n${row.context}`,
        row.response,
      ]
        .map(quote)
        .join(','),
    )
    .join('\n')}\n`,
);
const operatorFields = Object.keys(operatorRecords[0]) as Array<
  keyof SyntheticOperatorRecord
>;
writeFileSync(
  `${directory}/synthetic-operator-records.csv`,
  `${operatorFields.join(',')}\n${operatorRecords
    .map((record) =>
      operatorFields
        .map((field) => quote(String(record[field])))
        .join(','),
    )
    .join('\n')}\n`,
);
writeFileSync(
  `${directory}/test.jsonl`,
  `${testing.map((row) => JSON.stringify(row)).join('\n')}\n`,
);
writeFileSync(
  `${directory}/manifest.json`,
  `${JSON.stringify(
    {
      purpose:
        'Adaption action-model training and held-out pipeline evaluation',
      generatedAt: new Date().toISOString(),
      trainingRows: training.length,
      heldOutRows: testing.length,
      source:
        'Synthetic scenarios generated by the tested MajiShift water balance',
      syntheticOperatorRecords: operatorRecords.length,
      fusedTrainingFile:
        'train-fused.csv keeps the instruction and scenario context in one prompt so AutoScientist cannot drop the context column.',
      conduitUse:
        'Schema-shaped synthetic observations for training; the application supplies the real latest Conduit observation at inference time.',
      warning:
        'Every operator record and training observation is synthetic demonstration data. Generated completions require human review before upload. This is not a performance benchmark or JKUAT history.',
    },
    null,
    2,
  )}\n`,
);
console.log(
  `Prepared ${training.length} training rows and ${testing.length} held-out rows in ${directory}.`,
);
