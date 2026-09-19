import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults, simulate, compare, validate } from '../lib/planner.ts';
void test('water balance is conserved across stress scenarios', () => {
  for (let k = 0; k < 200; k++) {
    const c = {
      ...defaults,
      initial: (k * 719) % 20000,
      reserve: (k * 131) % 20000,
      pumpRate: (k * 29) % 900,
      essential: (k * 17) % 2500,
      irrigation: (k * 31) % 700,
      rainScale: k % 4,
      outageStart: k % 8,
      outageDays: k % 8,
    };
    for (const proposed of [true, false])
      for (const d of simulate(c, proposed)) {
        assert.ok(
          Math.abs(
            d.start +
              d.rain +
              d.pumped -
              d.evaporation -
              d.essential -
              d.irrigation -
              d.overflow -
              d.end,
          ) < 1e-7,
        );
        assert.ok(d.end >= 0 && d.end <= c.capacity);
        assert.ok(d.hours >= 0 && d.hours <= c.maxHours);
        assert.ok(Math.abs(d.essential + d.unmet - c.essential) < 1e-7);
        assert.ok(Math.abs(d.irrigation + d.deferred - c.irrigation) < 1e-7);
        if (d.outage) assert.equal(d.pumped, 0);
      }
  }
});
void test('outage preparation preserves reserve for default scenario', () => {
  const r = compare(defaults);
  assert.ok(r.minimum >= defaults.reserve);
  assert.equal(r.unmet, 0);
  assert.ok(r.baseline.some((d) => d.end < defaults.reserve));
});
void test('impossible supply is reported rather than invented', () => {
  const r = compare({ ...defaults, initial: 0, pumpRate: 0, rainScale: 0 });
  assert.equal(r.unmet, 7 * defaults.essential);
  assert.equal(r.pumped, 0);
  assert.equal(r.minimum, 0);
});
void test('one millimetre over 1,000 square metres is one cubic metre', () => {
  const d = simulate({ ...defaults, area: 1000, rainScale: 1 }, true)[2];
  assert.equal(d.rain, 2);
});
void test('invalid inputs are rejected', () => {
  for (const c of [
    { ...defaults, initial: NaN },
    { ...defaults, reserve: 25000 },
    { ...defaults, maxHours: 25 },
    { ...defaults, outageStart: 1.5 },
    { ...defaults, pumpRate: -1 },
  ]) {
    assert.ok(validate(c).length);
    assert.throws(() => simulate(c, true));
  }
});
void test('Conduit rainfall can replace the first scenario day', () => {
  const rainfall = [12, 0, 2, 8, 4, 0, 0];
  const day = simulate({ ...defaults, area: 1000 }, true, rainfall)[0];
  assert.equal(day.rainMm, 12);
  assert.equal(day.rain, 12);
});
void test('rainfall input requires seven credible daily values', () => {
  assert.throws(() => simulate(defaults, true, [1, 2]));
  assert.throws(() => simulate(defaults, true, [0, 0, 0, -1, 0, 0, 0]));
});
