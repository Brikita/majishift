import test from 'node:test';
import assert from 'node:assert/strict';
import { referenceEt } from '../lib/reference-et.ts';

void test('FAO-56 Hargreaves converts radiation energy to equivalent depth', () => {
  // Independent calculation: Ra = 36.31680982 MJ/m²/day = 14.81725841 mm/day.
  // Omitting 0.408 incorrectly yields 11.60 mm/day rather than 4.73.
  assert.ok(
    Math.abs(
      referenceEt('2026-08-29', -1.099736, 14.1, 27.7, 19.86) - 4.733097608,
    ) < 1e-8,
  );
});
