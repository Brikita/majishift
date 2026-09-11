'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Droplets,
  ArrowUpRight,
  Waves,
  FlaskConical,
  RotateCcw,
  Download,
  CircleHelp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { defaults, compare, validate, type Config } from '@/lib/planner';
const number = (n: number) => Math.round(n).toLocaleString('en-KE');
export default function Home() {
  const [config, setConfig] = useState<Config>({ ...defaults }),
    [draft, setDraft] = useState<Config>({ ...defaults }),
    [errors, setErrors] = useState<string[]>([]);
  const result = useMemo(() => compare(config), [config]);
  const [previous, setPrevious] = useState<Config | null>(null);
  useEffect(() => {
    type Context = {
      registerTool: (
        tool: {
          name: string;
          description: string;
          inputSchema: object;
          annotations: object;
          execute: (input: unknown) => unknown;
        },
        options: { signal: AbortSignal },
      ) => unknown;
    };
    const context = (document as Document & { modelContext?: Context })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'read_reservoir_plan',
            description:
              'Read the currently applied synthetic scenario and calculated schedules. Does not apply edits or operate equipment.',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true, untrustedContentHint: false },
            execute: (input) => {
              if (
                !input ||
                typeof input !== 'object' ||
                Array.isArray(input) ||
                Object.keys(input).length
              )
                throw new Error('Expected an empty object');
              return { mode: 'synthetic scenario', config, ...result };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      /* Optional browser capability; planner remains available. */
    }
    return () => lifecycle.abort();
  }, [config, result]);
  const max = Math.max(
    config.initial,
    ...result.baseline.map((d) => d.end),
    ...result.plan.map((d) => d.end),
    config.reserve * 1.2,
    1,
  );
  const point = (n: number, i: number) =>
    `${55 + i * 100},${240 - (n / max) * 200}`;
  const path = (rows: typeof result.plan) =>
    [config.initial, ...rows.map((d) => d.end)].map(point).join(' ');
  function apply() {
    const e = validate(draft);
    setErrors(e);
    if (!e.length) {
      setPrevious(config);
      setConfig({ ...draft });
    }
  }
  function preset(kind: 'outage' | 'dry' | 'normal') {
    const c = {
      ...defaults,
      outageStart: kind === 'outage' ? 2 : 0,
      outageDays: kind === 'outage' ? 2 : 0,
      rainScale: kind === 'dry' ? 0 : 1,
    };
    setPrevious(config);
    setDraft(c);
    setConfig(c);
    setErrors([]);
  }
  function exportPlan() {
    const data = {
      product: 'MajiShift',
      mode: 'synthetic scenario — not campus operations',
      createdAt: new Date().toISOString(),
      config,
      ...result,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'majishift-scenario.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  const fields: { key: keyof Config; label: string; unit: string }[] = [
    { key: 'capacity', label: 'Usable capacity', unit: 'm³' },
    { key: 'initial', label: 'Starting storage', unit: 'm³' },
    { key: 'reserve', label: 'Minimum reserve', unit: 'm³' },
    { key: 'essential', label: 'Essential use / day', unit: 'm³' },
    { key: 'irrigation', label: 'Irrigation request / day', unit: 'm³' },
    { key: 'pumpRate', label: 'Pump delivery', unit: 'm³/h' },
    { key: 'maxHours', label: 'Available pumping / day', unit: 'hours' },
    { key: 'baselineHours', label: 'Fixed schedule / day', unit: 'hours' },
    { key: 'area', label: 'Water surface area', unit: 'm²' },
    { key: 'evaporation', label: 'Assumed evaporation / day', unit: 'mm' },
    { key: 'outageStart', label: 'Outage starts (0 = none)', unit: 'day 1–7' },
    { key: 'outageDays', label: 'Outage duration', unit: 'days' },
    { key: 'rainScale', label: 'Rainfall scenario multiplier', unit: '0–3' },
  ];
  return (
    <main>
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-icon">
            <Droplets size={23} />
          </span>
          MajiShift<span className="brand-sub">RESERVOIR OPERATIONS</span>
        </Link>
        <span className="prototype">
          <FlaskConical size={15} />
          Working prototype
        </span>
      </header>
      <div className="workspace">
        <div className="intro">
          <div>
            <p className="eyebrow">JKUAT PILOT EXPLORATION / 7-DAY PLANNING</p>
            <h1>
              Keep the reserve.
              <br />
              <span>Plan the next move.</span>
            </h1>
            <p>
              Compare a fixed pumping schedule with a plan that prepares for
              interruptions.
            </p>
          </div>
          <div className="intro-actions">
            <Button variant="outline" onClick={exportPlan}>
              <Download />
              Export scenario
            </Button>
            <a href="#evidence">
              About the inputs <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="notice">
          <FlaskConical size={18} />
          <p>
            <strong>Scenario lab.</strong> All readings, weather and operating
            values below are invented for testing. Conduit data and the current
            dam profile are not connected.
          </p>
        </div>
        <div className="layout">
          <section className="main-panel">
            <div className="presets">
              <span>Explore a situation</span>
              <Button variant="outline" onClick={() => preset('outage')}>
                Two-day pump outage
              </Button>
              <Button variant="outline" onClick={() => preset('dry')}>
                No rainfall
              </Button>
              <Button variant="outline" onClick={() => preset('normal')}>
                Normal availability
              </Button>
            </div>
            <div className="metrics" aria-live="polite">
              <div>
                <p>Lowest end-of-day reserve</p>
                <strong>
                  {number(result.minimum)} <small>m³</small>
                </strong>
                <span>Proposed schedule</span>
              </div>
              <div>
                <p>Days below reserve</p>
                <strong>
                  {result.plan.filter((d) => d.end < config.reserve).length}
                  <small> / 7</small>
                </strong>
                <span>
                  Fixed schedule:{' '}
                  {result.baseline.filter((d) => d.end < config.reserve).length}{' '}
                  days
                </span>
              </div>
              <div>
                <p>Essential demand unmet</p>
                <strong>
                  {number(result.unmet)} <small>m³</small>
                </strong>
                <span>
                  {result.unmet > 0
                    ? 'More supply or reduced demand is needed'
                    : 'Covered in this scenario'}
                </span>
              </div>
            </div>
            <section className="chart-card">
              <div className="section-head">
                <div>
                  <p className="eyebrow">STORAGE OUTLOOK</p>
                  <h2>Two plans. One water balance.</h2>
                </div>
                <span className="unit">m³ · daily steps</span>
              </div>
              <svg
                className="chart"
                viewBox="0 0 790 285"
                aria-label="End-of-day storage comparison; exact proposed values are in the table below"
              >
                <defs>
                  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#087f84" stopOpacity=".19" />
                    <stop offset="100%" stopColor="#087f84" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                  <g key={t}>
                    <line
                      x1="55"
                      x2="755"
                      y1={240 - t * 200}
                      y2={240 - t * 200}
                      stroke="#e0e8ec"
                    />
                    <text x="0" y={244 - t * 200} fontSize="12" fill="#526673">
                      {number(max * t)}
                    </text>
                  </g>
                ))}
                <polygon
                  points={`55,240 ${path(result.plan)} 755,240`}
                  fill="url(#water)"
                />
                <line
                  x1="55"
                  x2="755"
                  y1={240 - (config.reserve / max) * 200}
                  y2={240 - (config.reserve / max) * 200}
                  stroke="#b27719"
                  strokeDasharray="5 5"
                />
                <polyline
                  points={path(result.baseline)}
                  fill="none"
                  stroke="#8394a1"
                  strokeWidth="3"
                  strokeDasharray="7 5"
                />
                <polyline
                  points={path(result.plan)}
                  fill="none"
                  stroke="#087f84"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                {[config.initial, ...result.plan.map((d) => d.end)].map(
                  (n, i) => (
                    <circle
                      key={i}
                      cx={55 + i * 100}
                      cy={240 - (n / max) * 200}
                      r="4"
                      fill="#087f84"
                      stroke="white"
                      strokeWidth="2"
                    />
                  ),
                )}
                {Array.from({ length: 8 }, (_, i) => (
                  <text
                    key={i}
                    x={55 + i * 100}
                    y="269"
                    textAnchor="middle"
                    fill="#526673"
                    fontSize="13"
                  >
                    {i === 0 ? 'Start' : `Day ${i}`}
                  </text>
                ))}
              </svg>
              <div className="legend">
                <span>
                  <i />
                  Proposed schedule
                </span>
                <span>
                  <i className="fixed" />
                  Fixed schedule
                </span>
                <span>
                  <i className="reserve" />
                  Minimum reserve
                </span>
              </div>
            </section>
            <section className="decision">
              <div className="decision-icon">
                <Waves />
              </div>
              <div>
                <p className="eyebrow">THE NEXT MOVE</p>
                <h2>
                  {result.plan[0].hours > 0
                    ? `Plan ${result.plan[0].hours.toFixed(1)} hours of pumping on day 1`
                    : 'No pumping needed on day 1'}
                </h2>
                <p>{result.plan[0].reason}</p>
                <p className="decision-foot">
                  {result.unmet > 0 || result.minimum < config.reserve
                    ? 'Reserve target is not met throughout this scenario. Review the capacity and demand constraints.'
                    : 'The end-of-day reserve target is met throughout this scenario.'}{' '}
                  Operator review is required before real use.
                </p>
              </div>
            </section>
            {previous && <section className="change-card" aria-live="polite"><p className="eyebrow">WHAT CHANGED?</p><h2>The effect of your last edit</h2><p>{fields.filter(f=>previous[f.key]!==config[f.key]).map(f=>`${f.label}: ${previous[f.key]} → ${config[f.key]} ${f.unit}`).join(' · ') || 'No input values changed.'}</p><p>Lowest proposed end-of-day storage: {number(compare(previous).minimum)} → {number(result.minimum)} m³. This comparison changes all edited inputs together; it does not isolate individual causes.</p></section>}
            <section className="schedule">
              <div className="section-head">
                <div>
                  <p className="eyebrow">PROPOSED OPERATING PLAN</p>
                  <h2>Every day, accounted for.</h2>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      'Day',
                      'Rain (mm)',
                      'Pump (h)',
                      'Irrigation (m³)',
                      'End storage (m³)',
                      'Status',
                    ].map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.plan.map((d) => (
                    <TableRow key={d.day}>
                      <TableCell>Day {d.day}</TableCell>
                      <TableCell>{d.rainMm.toFixed(1)}</TableCell>
                      <TableCell>
                        {d.hours.toFixed(1)}
                        {d.outage ? ' · unavailable' : ''}
                      </TableCell>
                      <TableCell>{number(d.irrigation)}</TableCell>
                      <TableCell>{number(d.end)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            d.end < config.reserve ? 'status warning' : 'status'
                          }
                        >
                          {d.end < config.reserve
                            ? 'Below reserve'
                            : 'Reserve met'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="table-note">
                Essential use is served before irrigation. Irrigation not
                served: {number(result.deferred)} m³. Pumped volume:{' '}
                {number(result.pumped)} m³. Overflow: {number(result.overflow)}{' '}
                m³. Daily balance does not establish intraday availability.
              </p>
            </section>
          </section>
          <aside className="inputs">
            <div className="section-head">
              <div>
                <p className="eyebrow">SCENARIO INPUTS</p>
                <h2>Set the conditions</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Reset scenario"
                onClick={() => preset('outage')}
              >
                <RotateCcw size={17} />
              </Button>
            </div>
            <p className="input-note">
              Editable assumptions, awaiting the operator’s records. 1 m³ =
              1,000 litres.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                apply();
              }}
            >
              {fields.map((f) => (
                <label className="field" key={f.key}>
                  <span>{f.label}</span>
                  <div>
                    <Input
                      type="number"
                      step="any"
                      value={Number.isNaN(draft[f.key]) ? '' : draft[f.key]}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          [f.key]:
                            e.target.value === ''
                              ? NaN
                              : Number(e.target.value),
                        })
                      }
                    />
                    <small>{f.unit}</small>
                  </div>
                </label>
              ))}
              {errors.length > 0 && (
                <ul className="errors" role="alert">
                  {errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              )}
              <Button className="apply" type="submit">
                Compare schedules <ArrowUpRight />
              </Button>
            </form>
          </aside>
        </div>
        <section className="evidence" id="evidence">
          <div>
            <CircleHelp size={23} />
            <h2>A plan is only as good as its inputs.</h2>
            <p>
              This is a daily scenario calculator, not a validated digital twin
              or a live dam-control system.
            </p>
          </div>
          <div>
            <h3>What is connected?</h3>
            <p>
              No live sources yet. Rain is synthetic; evaporation is an explicit
              assumption. No upstream river-flow prediction is made.
            </p>
            <a
              href="https://conduit.jhubafrica.com/"
              target="_blank"
              rel="noreferrer"
            >
              Conduit data platform ↗
            </a>
          </div>
          <div>
            <h3>Next: the operator meeting</h3>
            <p>
              Confirm the storage profile, pump delivery, essential demand,
              available records and the operator’s most frequent decision.
            </p>
            <p>
              Adaption model: not trained. Briefings currently use deterministic
              explanations.
            </p>
          </div>
        </section>
        <footer>
          <span>MajiShift · Hack The Weather 2026</span>
          <span>Observe → compare → review → act</span>
        </footer>
      </div>
    </main>
  );
}
