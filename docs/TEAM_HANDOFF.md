# MajiShift: complete implementation handoff

Prepared 11 September 2026. Working deadline: 18 September, as supplied by the team. Confirm submission time, timezone, deliverables and permitted pre-event work with organizers. This document is a build specification, not evidence that the proposed features are implemented.

## Start here

Read this file, [operator field form](OPERATOR_FIELD_FORM.md), [answer-to-decision matrix](OPERATOR_BRANCHES.md), [GIS specification](GIS_SPEC.md), and [coding-agent brief](CODING_AGENT_BRIEF.md). Existing background: PROJECT.md, EVIDENCE.md and ADAPTION.md.

Product hypothesis: help a water-system operator choose pumping and flexible withdrawals before a known interruption, with weather-informed water accounting and visible consequences. The interview may change this hypothesis. Do not force the operator's problem into the existing screen.

The differentiator we intend to demonstrate is a connected decision: verified site evidence -> weather contribution -> constrained plan -> geographically visible consequences -> exportable decision receipt -> operator review. Neither winning nor worldwide originality is established.

## Current implementation inventory

| Area | Present now | Remaining |
|---|---|---|
| Planner | Pure TypeScript daily seven-day balance; reserve-first heuristic; fixed-schedule comparator | Verified topology, real inputs, time series, uncertainty, operator's actual baseline, longer planning horizon if needed |
| Interface | Editable assumptions; presets; storage chart; daily table; what-changed summary; JSON export | Data import/review, provenance, input readiness, GIS, richer comparison, operator approval workflow |
| Weather | Latest public Conduit station 61 observation is fetched server-side; the two cumulative gauge totals are averaged for Day 1 direct-rain accounting; timestamp, coordinates, temperature, humidity and wind are shown with provenance | Confirm field semantics and station representativeness with the data owner; obtain history; keep Days 2–7 separate from observations unless a forecast source is added |
| AI | Original constraint-extraction fixtures plus a generated action-model package with 160 training rows and 20 held-out cases; UI shows the intended Conduit → balance → Adaption → operator flow | Human-review generated rows; activate account; estimate/adapt/train; evaluate base/prompted/adapted results; securely serve the selected checkpoint |
| Mapping | Responsive MapLibre campus atlas; open-map dam/campus points; 2D/3D context; scenario day and plan comparison linked to planner | Operator-verified asset identity, pipe/treatment topology, demand areas and any shareable surveyed geometry |
| Persistence | None; scenario export only | Import/reload receipt first; database only if shared saved records are actually needed |
| Validation | Seven planner tests including 200 stress scenarios, Conduit rainfall injection and invalid rainfall; type/lint/build checks; evaluator fixture checks | Field calibration, held-out replay, browser flows, data-owner acceptance and user feedback |
| Hosting | Owner-private Sites deployment | Explicitly authorized access for teammate/judges; deployment of changed application by responsible owner |

Current live preview: https://majishift-reservoir.briankinyua0101.chatgpt.site . Private access does not imply that teammates or judges can open it.

## Existing code and important limitations

- `lib/planner.ts`: Config, defaults, validate, simulate, compare. All operating defaults are invented. A validated seven-value rainfall array can be supplied; the UI replaces Day 1 with the latest Conduit gauge mean when available. `simulate` prioritizes essential use and conserves aggregate water.
- `app/api/conduit/route.ts`: server-side normalization of the public Conduit station 61 observation. It discovers the station endpoint from the official Conduit model page when `CONDUIT_DATA_URL` is not configured, so the upstream credential is not shipped to the browser.
- `app/page.tsx`: client UI, Conduit synchronization, calculations, JSON download and optional read-only WebMCP registration. No trained-model inference call exists.
- `tests/planner.test.ts`: numerical invariants and stress cases. `scripts/prepare-adaption-actions.ts` generates the action-model package. The older constraint-extraction scripts remain as a separate experiment.
- Current outage lookahead only pre-fills immediately before consecutive outage days. If several days of pumping are needed, it may miss a feasible plan. Add full-horizon planning before claiming scheduling adequacy.
- Daily totals can hide an empty tank before an afternoon refill or overflow before withdrawals. Use hourly steps when needed; daily feasibility is only daily aggregate feasibility.
- One storage compartment cannot represent raw pond -> treatment -> treated tank constraints. Do not label raw water as directly available for essential consumption.
- Fixed four-hour default pumping is not the operator's practice. Replace with a recorded schedule/rule before claiming improvement over current operations.
- Baseline and proposal differ in both pumping and irrigation policy. To attribute gains, add comparisons with the same withdrawal policy and report the combined intervention separately.
- No calibrated evaporation, catchment runoff, quality, leakage, tariff or energy model exists. Pumped volume is not energy consumption.
- `outageStart=0` with positive duration currently means no outage. New input normalization must reject/resolve contradictory outage combinations; clamp displayed intervals to the horizon or flag truncation.
- `compare` aggregates proposal metrics only. Compute equivalent baseline metrics, signed deltas and uncertainty ranges.

## Scope gates and order

Apply OPERATOR_BRANCHES.md before implementation. One primary decision workflow must be selected. Quality, leak diagnosis and flood modelling are separate conditional pivots, not required modules to build simultaneously.

P0 is required for a credible field-grounded submission: accepted problem, source permissions, input readiness, correct topology, meaningful Conduit use, honest comparison, failure handling and reproducible demo. P1 improves communication: linked GIS and reviewed note extraction. P2 is optional: high-detail terrain, live streaming, multi-user accounts, full optimization or sophisticated 3D assets.

If evidence is limited, submit a transparently labelled scenario prototype with an operator-reviewed use case. Do not pretend a prospective demo is a validated operational system.

## Work packages (assign one named owner to each)

| ID / priority | Task | Dependency | Definition of done |
|---|---|---|---|
| W01 P0 | Interview and scope decision | Operator contact | Completed field form, branch IDs selected, one problem statement, actual baseline, success metric, permissions recorded |
| W02 P0 | Site and observation contracts | W01; can scaffold now | Validated schema, explicit unknowns, raw/treated separation, timestamps/units/provenance, fixtures and rejected-input examples |
| W03 P0 | CSV import and review | W02, sample export | Original retained; column mapping; units and timezone confirmed; gaps/duplicates/reset counters surfaced; no silent corrections |
| W04 P0 | Planning engine fit to selected branch | W01–03 | Horizon inputs, constraints, relevant compartment balances, uncertainty, infeasibility report and fair baseline comparison |
| W05 P0 | Weather contribution | Conduit export + W03 | Real readings used in a justified calculation or decision; measured and forecast inputs separated; contribution quantified, including negligible findings |
| W06 P0 | Replay and decision receipts | W04–05 | Reproducible case, full provenance and model versions, baseline/proposal metrics, held-out replay or clearly marked synthetic demo |
| W07 P1 | Linked GIS | GIS_SPEC + shareable geometry + W04 | Atlas shell is implemented with reservoir selection, timeline, baseline/proposal view, provenance and map-unavailable fallback. Completion requires operator-confirmed topology and permitted assets; no invented hydraulic effects. |
| W08 P1 | Adaption experiment | Reviewed labels/account access | Base/prompted/adapted scores on unchanged test cases; cost/run records; ambiguous notes correctly request clarification |
| W09 P1 | Note review UI | W08 serving endpoint | Server-only credentials, schema validation, candidate old/new changes, operator apply/cancel, no direct equipment control |
| W10 P0 | Acceptance and submission | W01–07; W08–09 if ready | Operator feedback, meaningful browser tests, accessible fallback, stable demo, authorized judge access, clear claims and limitations |

W02 scaffolding, import UI structure, GIS shell and experiment harness can be developed before the interview. Actual site constants, realistic presets, demand allocation, scientific calibration and model labels depend on evidence. Never fill a missing answer with the current defaults without showing simulation mode.

## Data contracts to implement

Prefer Zod or equivalent runtime validation with shared TypeScript types; choose and pin a compatible version at implementation. Schemas below are specifications, not installed code.

Every measured/estimated quantity: `value: number|null`, `unit`, `evidenceStatus: measured|documented|operator_estimate|derived|synthetic|unknown`, `sourceId`, `observedAt` if measured, `validFrom/validTo` if applicable, `lower/upper` for estimates, `note`. Missing is null, never zero. A lone estimated value without justified bounds cannot become a precise forecast by formatting it to decimals.

`SiteConfig`: schemaVersion; siteId; timezone; systemPurpose; assets; connections; storage compartments; pump constraints; treatment limits; demand classes; reserve policy; effective dates; source references; disclosure scope. Use stable IDs in both GIS and planner. Version changes rather than overwriting evidence.

`Observation`: id, siteId, assetId/stationId, variable, value, unit, timestamp with offset, intervalStart/intervalEnd if aggregated, aggregation (instantaneous/increment/cumulative/mean), quality flags, sourceId, importBatchId. Preserve original file and row index; hash file contents. Reject mixed unknown timezones and ambiguous units pending review.

`Forecast`: variable, location/station relevance, issuedAt, validAt, value, unit, provider, member/scenario ID and sourceId. A future observation is not a forecast. Keep date-indexed arrays; never reconstruct a historical forecast with data observed after the decision.

`DecisionInput`: decisionTime, horizon and step, siteConfigVersion, observation/forecast IDs, initial state and uncertainty, demand profile, planned unavailability, available actions, objective priorities and baseline policy version.

`DecisionReceipt`: schemaVersion, scenarioId, mode (synthetic/replay/prospective), createdAt, input references and hashes, plannerVersion, baselinePolicyVersion, branch IDs, candidate schedule, baseline schedule, both metrics, constraint violations, assumptions, missing/stale inputs, explanations and operator review status. The GIS consumes this receipt's results; it must not run an independent calculation.

Local-first receipt import/export is the default persistence milestone. Add authenticated shared storage only if requested by the workflow; do not place restricted operational logs under `public/` or bundle them into the browser.

## Numerical and decision specification

For each compartment and interval: ending storage = starting storage + actual inflows + direct rain - actual withdrawals - evaporation - explicit measured/assumed losses - overflow. Bound each actual outflow by available water; expose unmet requested withdrawals. Separate requested from served quantities. Do not double-count treatment transfers or direct rainfall already included in measured inflow.

Use water source and treatment capacity as constraints, not only pump nameplate rate. Distinguish usable capacity from total volume/dead storage and datum. Each asset's balance must reconcile; graph transfers appear once as upstream outflow and once as downstream inflow.

Agree objective priorities with the operator. Provisional order: satisfy hard physical limits; quantify unmet essential demand; protect agreed reserve; satisfy time-bounded irrigation needs; then reduce pumping/energy if defensible. Define reserve crossing versus true unmet supply separately. Do not trade essential supply for a lower energy score without an agreed policy.

Start with a transparent full-horizon feasible scheduling method. Introduce an LP/MILP solver only if multiple pumps/windows/storages justify it, with solver timeouts and a tested fallback. Never call a heuristic an optimizer or optimal solution.

Run conservative/base/favorable input scenarios when uncertainty is material. These are bounds/scenarios, not calibrated probability levels. A robust candidate must meet relevant constraints across the agreed range; otherwise return conditional or infeasible, with binding constraints and the next information needed.

## Conduit: meaningful use gates

Confirm actual channels and station location/cadence with data owner. Event text lists possible channels; availability in our export is unverified.

1. Rain + verified reservoir surface area supports direct rainfall accounting: mm × m² / 1,000 = m³. Verify representativeness and whether the pond receives rain. This does not estimate river inflow.
2. Temperature/humidity/wind/radiation may support a documented evaporation method only when the required variables, units and siting exist. UV readings alone are not a substitute for solar radiation. Crop evapotranspiration is not automatically open-water evaporation.
3. Irrigation branch: rain/soil data may support timing when plots, crop requirements, effective rain and allowed deferral are established. Do not cancel irrigation from rainfall alone.
4. Validate against the same case without the Conduit contribution, holding all other inputs/policies fixed. Report changed action or water accounting, errors and limitations. If contribution is tiny, report that and seek a more relevant decision; a station marker is not meaningful data use by itself.

## Adaption deliverable

Keep the current seed set as pipeline fixtures, not a benchmark. Review operator vocabulary and units, collect authorized anonymized notes, create independent scenario families, and obtain fluent review for Kiswahili/mixed-language labels. A practical initial target is 100–200 reviewed training examples and 30–50 independent test cases if capacity allows; these are planning targets, not proof of sufficient sample size.

Compare base, prompted and adapted models with identical test cases and output schema. Record per-field exactness, invalid/missing output, false confident extraction, ambiguous-case handling, latency and serving cost. Separate language results if sample sizes permit. Never tune on the held-out test results repeatedly without a fresh test set.

Train one small supported model/iteration first after inspecting credits and reviewing data. Existing SDK runner remains untested against an account. Follow current official docs. Downloaded weights require separate serving. If serving/training is unavailable by the feature freeze, deliver the experiment artifacts and a manual structured-input workflow; label model integration as pending.

## Acceptance checklist

- Unit/contract tests: litres/m³ and rain depth conversions; level curve monotonicity/range; cumulative gauge reset; duplicate and out-of-order timestamps; missing vs zero; raw/treated transfer accounting.
- Planner: empty/full storage, zero pump flow, multiple-day preparation, simultaneous outage/high demand, reserve infeasibility, unknown values, pump source restrictions, per-compartment conservation and time-step sensitivity.
- Comparison: identical weather/initial states; actual baseline rules; equivalent metric aggregation; separate pumping-policy and withdrawal-policy effects; no future-data leakage.
- GIS: correct longitude/latitude order, operator-verified identity, stable asset joins, selected time agrees with table, no unsupported spatial risk colours, no-WebGL/no-tile fallback and usable keyboard/table view.
- AI: missing units/date anchors, contradictions, code-like instructions in notes, unsupported fields, invalid JSON, no silent overwrite and review required before application.
- Product: import -> review -> compare -> inspect on map -> export -> reload; stale input visible; infeasible case explained; no credentials in browser/logs; agreed disclosure and judge access.
- Evidence: at least one operator-reviewed case and a fair replay if data allows. Distinguish simulated benefit from observed benefit; include failures, not just best case.

## Suggested schedule and cut line

11 Sep: interview, freeze primary branch, collect sample and locations. 12 Sep: contracts/import and site topology. 13 Sep: planner correction and initial Conduit contribution. 14 Sep: linked GIS and replay. 15 Sep: operator review and Adaption experiment. 16 Sep: feature freeze and end-to-end checks. 17–18 Sep: reproducible demo, video/submission requirements and buffer. These are proposed internal targets, not official event phases.

If late: protect W01–06 and W10. Keep GIS to verified markers/polygon plus timeline. Cut photorealistic assets, live telemetry, accounts and advanced optimization first. Cut unvalidated AI integration rather than hiding its status. Do not expand into three products.

## Teammate transfer

Share the source checkout through the team's approved private Git repository or a source archive. Exclude `.env*`, node_modules, work, dist, .wrangler, private logs and source-write credentials. The current Sites Git upload credential is temporary and must not be handed around. The teammate needs Node 22.13+, `npm ci`, `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm run dev` for local work. Python is needed only for the Adaption scripts; install SDK dependencies separately when that work starts.

Agree file ownership before simultaneous edits: planner/data, GIS/UI, AI/evaluation, integration/submission. Review branch changes together; maintain one schema and calculation source. No remote teammate repository or account invitation has been created by this documentation task.
