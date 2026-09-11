# MajiShift project specification

## Problem

Proposed user: a reservoir/water-treatment operator managing pumped inflows and essential campus demand alongside irrigation. Decision: how much to pump before and after a known interruption, and whether optional irrigation can be served without crossing an agreed reserve.

This workflow is a hypothesis for the September 11 operator interview. Do not imply JKUAT currently uses a fixed schedule, has leaks, or has a shortage. Confirm before writing the submission.

## Differentiation

1. A reviewable decision, not just a weather display: compare pumping hours and water reserves under the same scenario.
2. Explicit trade-offs: never hide unmet essential demand, unserved irrigation, extra pumping or overflow.
3. A planned decision receipt: snapshot readings, assumptions, evidence timestamps, scenario, computed plan and operator outcome. JSON export is the first slice.
4. Planned counterfactuals: distinguish effects of weather, demand and an outage; show which changed input changes the action. Do not claim causal field impact from simulation.
5. A specialist note-to-constraint model using Adaption, measured against a general model and a prompted baseline.

## Implemented

- Seven-day daily aggregate mass balance in m³.
- Synthetic rainfall, explicit evaporation rate, adjustable storage/pumps/demand.
- Reserve-first heuristic in half-hour pumping increments (availability may cap the last increment).
- Immediate preparation for consecutive upcoming outage days. No claim of globally optimal scheduling; longer lookahead is future work.
- Essential demand served before optional irrigation. Unserved irrigation is reported, not silently rescheduled.
- Fixed schedule uses the same rainfall, losses, demands, limits and outages.
- Invalid inputs rejected; zero pumping and infeasible scenarios supported.
- Proposed versus fixed storage chart, daily proposed table, scenario presets and JSON export.

## Limitations

Daily aggregation can miss intraday emptying/overflow and network constraints. Surface area is constant; evaporation is assumed, not calculated from Conduit. No leakage estimator, inflow forecast, water-right determination, tariff optimization, quality model or automatic actuation. Scenario names are relative days, not actual historical events. No saved operator records or model inference endpoint yet.

## Next increments after interview

1. Obtain an authorized Conduit export and preserve original timestamps, units, station identity, missing values and provenance. Never generate observations to fill missing data invisibly.
2. Define site configuration from the operator's documents, including usable/dead storage and level-volume curve. Distinguish raw from treated-water storage.
3. Import operational readings, initially CSV, with schema validation and quality flags. Original records stay immutable.
4. Separate observations from forecasts, and use issue-time forecasts for replay. Obtain upstream data before modelling river inflow. Keep measured or operator-entered inflow as the initial source.
5. Add a weather contribution experiment: external forecast alone versus forecast plus Conduit under identical constraints and held-out time periods.
6. Add uncertainty scenarios and hourly scheduling if the operator's decision requires them. Start with constrained optimization only after the objective and constraints are verified.
7. Add the reviewed Adaption constraint extractor. Show its proposed changes for explicit operator application.

## Architecture

Browser UI -> validated scenario -> deterministic planner -> comparison and exported receipt.
Future: immutable observations + issue-time forecasts + site config -> planner. Adaption-trained extraction -> validated candidate constraints -> operator review -> planner. Model outputs never operate pumps.

The current stack is React/TypeScript + Vinext/Vite + Tailwind/Shadcn on Sites. Use Python for Adaption SDK jobs and later scientific analysis. Add persistent SQL storage only when real records and access requirements are known. A separate model-serving service will be required for a downloaded checkpoint; do not attempt to load model weights into the web Worker.

## Success evidence

Technical: conservation, capacity bounds, outage enforcement, explicit infeasibility, no future-data leakage.
Decision: shortage volume, days/hours below reserve, irrigation fulfilled, pumped volume and measured energy if available.
Product: operator can explain the proposed action and identify its supporting inputs.
AI: constraint extraction accuracy, invalid JSON, false confident extraction and bilingual review on untouched cases.
Impact: report modelled outcomes separately from operationally measured outcomes. No fabricated saving percentages.

## Roadmap to September 18

September 10: foundation and experiment design. September 11: interview and data inspection. September 12–13: actual ingestion and calibrated site model if records permit. September 14–15: held-out replay, specialist-model experiment and operator feedback. September 16: choose the single strongest demonstrable story. September 17–18: fix failures, prepare reproducible demo and submission. Confirm event rules on permitted pre-event work before representing eligibility.

## Demo narrative

Show a known interruption. Enter verified storage and demand. Compare the current operating approach with a proposed schedule. Change one constraint, expose the new trade-off, export the decision receipt. Show an infeasible case and an input gap. End with measured evaluation results, not a list of planned features.
