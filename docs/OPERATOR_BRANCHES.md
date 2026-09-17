# Operator answers -> scenarios -> build decisions

Use with OPERATOR_FIELD_FORM.md. These are the decision-relevant answer categories, not a claim that every possible interview answer can be predicted. Apply rows together. Record new answers as unresolved; add a branch rather than forcing them into a category.

## Precedence when answers conflict

1. Establish purpose and real problem (A rows).
2. Establish physical connectivity and permitted actions (B rows).
3. Establish evidence readiness (C rows). Missing critical evidence limits any branch above it.
4. Select weather contribution (D rows), GIS level (E rows), AI scope (F rows).
5. Agree a success metric and baseline (G rows). Build only the surviving primary workflow.

An estimated capacity does not override a documented curve; a historic report does not override a current verified configuration. Record conflicts with source dates and seek resolution. If unresolved, calculate explicit alternatives or suppress the dependent result.

## A. Purpose and problem

| ID | Possible answer | Scenario and product decision | Required follow-up / implementation |
|---|---|---|---|
| A1 | Reservoir supplies raw water for campus treatment and irrigation | Keep MajiShift, separate treatment/treated reserve from raw storage | Trace compartments and treatment bottleneck before claiming essential-supply protection |
| A2 | Only irrigation; no essential campus supply | Reframe to protecting agreed crop water windows through supply interruptions | Remove essential-campus claims; obtain plot demand, crop stage, allowable delay; score fulfilment and deferral |
| A3 | Main purpose is stormwater detention/flood control | Current reserve-first strategy may oppose detention capacity; reassess primary project | Require outlet rules, levels, inflow evidence and qualified review; no flood prediction from current calculator; feasible fallback is rainfall/inspection timeline |
| A4 | Research/aquaculture/ecological pond | Reserve may represent a research/ecological constraint | Get responsible user, actual management action and thresholds; do not invent fish-health or water-quality inference |
| A5 | No recurring problem or relevant decisions | Do not claim a validated need | Ask for another responsible operator/site or retain an explicitly exploratory prototype; do not invent a shortage |
| A6 | Primary pain is uncertain inventory | Prioritize reading capture, level-volume conversion and reserve visibility | Defer precise scheduling until storage readiness improves; show uncertainty ranges |
| A7 | Primary pain is quality after rain | Conditional pivot to weather-linked inspection/sampling support | Require parameter-specific measurements and logs; no potability verdict, chemical dosing or algae diagnosis from weather alone |
| A8 | Primary pain is unexplained loss | Conditional residual investigation, not automated leak detection | Require synchronized levels and all major flows; separate uncertainty/evaporation/unrecorded use; label unexplained residual |

## B. Actions and system constraints

| ID | Possible answer | Scenario -> decision | Build / release consequence |
|---|---|---|---|
| B1 | Known future pumping outage; schedule adjustable | Compare pre-filling across all available preceding intervals | Full-horizon planner, verified pump/source limits; report if preparation cannot suffice |
| B2 | Only unannounced outages | No claim to predict them; compare readiness under explicit duration scenarios | Reserve stress test rather than precise outage forecast |
| B3 | Gravity/natural inflow; no controllable supply pump | Remove incoming pump action | Model measured/scenario inflow and permitted withdrawal decisions; ask whether any outlet is controllable |
| B4 | Pump schedule externally fixed | Treat schedule as a hard input | Recommend only permitted demand changes or monitoring; do not show impossible pump shifts |
| B5 | Multiple pumps with windows/capacities | Need asset-specific schedules | Include concurrency, shared source/electrical limits and minimum run rules where supplied; simplify to documented aggregate envelope only if justified |
| B6 | Raw pond -> treatment -> separate tank | Tank can empty while pond is full | Two or more compartments and treatment throughput/yield; single pond minimum cannot stand for service availability |
| B7 | More than one source/storage, routing changes | Same total water can have different availability | Model only verified active network; no fungible campus-wide pool; scope to one subsystem if time is insufficient |
| B8 | Irrigation freely deferrable | Show optional use curtailed to protect reserve | Record owner-agreed limit; expose unserved amount and opportunity cost |
| B9 | Irrigation has daily minimum or maximum delay | Cannot remove irrigation without penalty | Demand windows/minima; track backlog and deadlines, not a simple zero/one switch |
| B10 | All withdrawals essential/fixed | No demand-shedding action available | Pump/storage planning only; report shortage and request operator response without inventing rationing rules |
| B11 | Decisions hourly / tanks small / batch treatment | Daily totals hide failure | Hourly or event-step balance, aligned observations; block operational daily-feasibility claims |
| B12 | Pumping constrained by river level or abstraction limits | Rated capacity not always deliverable | Encode supplied limits with effective periods; source availability uncertainty; do not calculate permission from rainfall |
| B13 | High energy cost, reliable tariffs and kWh | Potential secondary cost objective | Keep service constraints first; use measured power/energy relation and tariff intervals |
| B14 | Energy concern but only runtime known | Runtime/pumped volume are proxies | Report those units, no kWh/cost/carbon saving claim |

## C. Data readiness

| ID | Possible answer | Scenario -> decision | Implementation / fallback |
|---|---|---|---|
| C1 | Current level-volume curve + gauge datum + reading | Storage can be derived | Monotonic interpolation within surveyed range; no extrapolation; distinguish usable/dead volume |
| C2 | Level known, no volume conversion | Cannot know m³ from depth alone | Level trend/threshold view or operator-bounded volume scenarios; do not assume rectangular geometry |
| C3 | Capacity known, starting storage unknown | Capacity is not available inventory | Request a dated reading; suppress precise reserve-duration claims; scenario mode until then |
| C4 | Only approximate dimensions/estimates | Large uncertainty possible | Label estimates with source and justified ranges; sensitivity analysis; no artificial confidence interval |
| C5 | Flow meters/time-stamped runtime exist | Calibrate actual delivery and baseline | Use measured integrated flow; reconcile runtime and meter periods; account for varying head if material |
| C6 | Nameplate pump rate only | Rated delivery may overstate inflow | Operator-reviewed range; request timed-volume test/records; explicitly estimated model |
| C7 | Essential demand measured by interval | Use profile and variability | Align period, separate treatment losses and storage transfer from final consumption |
| C8 | Demand estimated or supplied as headcount | Exact demand unknown | Operator-supported bounds; no unsourced per-capita conversion; show sensitivity |
| C9 | Dated digital history and event logs | Replay possible | Preserve issue-time information and split by time/event; evaluate held-out events |
| C10 | Paper logs/photos only | Small manual dataset feasible | Permission, transcription with row provenance and second check; retain original privately |
| C11 | No history or permission to share | No retrospective impact proof | Authorized prospective observations if possible; synthetic demo labelled throughout; no fabricated CSV history |
| C12 | Conflicting readings, gaps, counter reset, stale measurements | Readiness reduced | Quality flags; don't interpolate outages invisibly; operator review; freshness threshold based on decision cadence |
| C13 | Data exists but restricted | Separate internal analysis from public demo | Obtain anonymized/aggregated export and disclosure permission; prevent restricted rows reaching client bundle |

## D. Weather

| ID | Possible answer | Scenario -> decision | Implementation / fallback |
|---|---|---|---|
| D1 | Nearby representative rain with known accumulation semantics | Direct rainfall balance may be justified | Unit/counter-reset handling; area and coverage verification; quantify significance |
| D2 | Weather station elsewhere / siting unclear | Site relevance uncertain | Map distance and disclose limits; no assumption that station rainfall equals catchment rainfall |
| D3 | Sufficient meteorology for selected method | Evaporation/crop-demand method possible | Document method, inputs, calibration and uncertainty; do not substitute UV for solar radiation |
| D4 | Weather history only, no archived forecasts | Historical accounting is possible | Replay only with information available then; label hindsight analysis distinctly; prospective forecasts separate |
| D5 | Only upstream catchment rain, no runoff/flow calibration | River inflow cannot be inferred reliably | Scenario inflow; collect upstream flow; avoid a rainfall-to-river shortcut |
| D6 | Conduit export not available | Critical competition-data dependency remains open | Ask organizer/data owner for authorized sample and dictionary; prepare importer; do not replace it silently with generated data |
| D7 | Conduit quality or soil channel actually exists | Potential branch-specific enrichment | Confirm variable, units, calibration and spatial relevance; no inference of availability from event marketing |

## E. GIS and F. AI

| ID | Possible answer | Decision | Build consequence |
|---|---|---|---|
| E1 | Verified assets, footprints and permitted schematic connections | Linked campus map | Use stable asset IDs; line topology may be schematic, explicitly distinguish actual pipe route |
| E2 | Coordinates only | Useful point map | No invented reservoir boundary; marker and side-panel storage bar |
| E3 | No coordinates / identity uncertain | Schematic system diagram initially | Ask operator to locate on a map; do not guess which pond is the subject |
| E4 | Footprints but no building heights | 2D or illustrative extrusion | Heights labelled illustrative; no engineering or hydraulic analysis from them |
| E5 | Survey terrain/bathymetry and datum exist | Optional true water-surface elevation display | Convert using validated curve/datum; budget permitting; otherwise stick to quantitative side panel |
| E6 | Sensitive asset locations cannot be shared | Generalized public map or topology diagram | Restricted detail must remain out of publicly served assets |
| F1 | Operator uses short English/Kiswahili notes | Note-to-constraint extraction has a real workflow | Reviewed multilingual examples and candidate-change confirmation |
| F2 | Already uses structured logs / prefers forms | AI extraction is secondary | Preserve form workflow; experiment may remain separate, don't add unnecessary typing |
| F3 | Adaption account/training/serving unavailable or poor scores | Keep manual inputs | Report experiment limitation; don't claim a connected adapted model |

## G. Success and baseline

| ID | Answer | Decision |
|---|---|---|
| G1 | Existing rule or schedule and recorded outcomes | Reproduce rule on the same inputs; compare shortage, reserve violations, irrigation and pumping |
| G2 | Operator uses case-by-case judgement | Record the action for the selected case; compare that case, not a fabricated fixed routine |
| G3 | No accepted baseline or outcome measure | Agree one before impact claims; otherwise report functionality and usability only |
| G4 | Operator says plan is infeasible because of a missing constraint | Add documented constraint, rerun and retain failed earlier result in evaluation history |

## Worked combined routes (illustrations, not JKUAT findings)

| Route | Combined answers | Build next | Demonstration and claim boundary |
|---|---|---|---|
| R1 | A1+B1+B6+C1+C5+C9+D1+E1 | Multi-compartment outage preparation, measured baseline, weather balance, linked GIS | Show actual-event replay and essential tank reserve; simulated improvement until field use measured |
| R2 | A2+B9+C4+C8+D1+E2 | Irrigation demand windows, storage ranges, point map | Show what can be delayed under conservative assumptions; no hostel/essential supply claim |
| R3 | A1+B2+C3+C11+D6+E3 | Readiness form and explicitly synthetic stress scenarios | Operator-reviewed concept only; Conduit/data acquisition remains a release blocker for weather-data claim |
| R4 | A7+C9+D7+E1 | Inspection/sampling event timeline and map after confirming quality labels | No water-safety certification or chemical treatment recommendation |
| R5 | A1+B4+B10+C1+C7+D1 | Fixed-inflow shortfall visibility | Explain inability to avoid shortfall and request operator review; no fictional controllable action |
| R6 | A1+B1+C1+C5+D1+E1+F3 | Complete deterministic planning + map | Ship useful core and honest AI experiment status |

## Decision log template

For each scope decision record: date; field-question IDs; answer verbatim; source/evidence ID; branch IDs; confidence/status; selected workflow; discarded alternatives and reason; unresolved fact; owner; next action; acceptance criterion; deadline. Reopen a decision when contrary evidence arrives. There is no numeric recommendation until the relevant physical limits and input readiness are satisfied.
