# MajiShift — Devpost submission copy

## Tagline

Turn JKUAT Conduit weather observations into reviewable reservoir pumping decisions.

## Inspiration

Water operators must protect essential supply while preparing for pump interruptions, dry periods and uncertain weather. A weather dashboard can describe conditions, but it does not answer the operational question: what should change in the water plan? MajiShift connects local Conduit@Empathy observations to a transparent reservoir water balance so an operator can inspect the evidence, compare schedules and review the next action.

## What it does

MajiShift runs a seven-day historical counterfactual for a JKUAT reservoir scenario. It converts official Conduit station 61 observations into daily rainfall and temperature-derived reference evapotranspiration, applies those values to surface-water gains and losses, and compares a reserve-first pumping schedule with a fixed schedule.

The default replay uses 29 August–4 September 2026. Across that period, 9,885 deduplicated Conduit observations recorded 0 mm rainfall. The corrected FAO-56 Hargreaves calculation produces 32.45 mm of reference evapotranspiration. For the explicitly synthetic 8,000 m² reservoir surface, this represents 259.6 m³ of estimated surface loss, compared with 224.0 m³ under the editable 4 mm/day assumption. The weather evidence changes the storage trajectory; under the default half-hour pump increments it does not change the total 7,875 m³ pumping schedule. Reporting that threshold result is part of the product: MajiShift shows when weather changes a decision and when it does not.

Operators can change capacity, storage, reserve, demand, pump delivery and outage assumptions, compare the resulting plan, inspect every daily balance, view the reservoir and station in a responsive GIS interface, and export a provenance-rich JSON record. The planner never operates equipment automatically.

## How we used Conduit data meaningfully

Conduit data is an input to the calculation, not a decorative card:

1. We downloaded the three official GeoCSV files from the Hack The Weather resource folder.
2. We deduplicated overlapping station timestamps and selected a complete seven-day replay window.
3. The final daily values from both `Total Today` rain gauges determine measured rainfall.
4. Daily minimum, maximum and mean SHT temperatures feed the FAO-56 Hargreaves reference-evapotranspiration calculation using the station latitude and day of year.
5. Rainfall and reference ET enter the reservoir mass balance and change daily surface gains/losses, storage and potentially the pump schedule.
6. The interface and exported record show the with-Conduit result against the fixed evaporation assumption.

The source files, hashes, station metadata, equations, daily aggregates and verification fixtures are included in the repository.

## How we built it

- React 19 and TypeScript
- Vinext and Vite
- A deterministic, mass-conserving seven-day planner
- MapLibre with OpenStreetMap/OpenFreeMap context
- Official Conduit@Empathy station 61 GeoCSV data
- FAO-56 Hargreaves reference evapotranspiration
- Adaption Adaptive Data and AutoScientist experiments for future operator-brief generation
- Node test runner, Oxlint and TypeScript validation

## Adaption contribution

We used Adaption to build and reshape a domain-specific operator-action dataset and run three AutoScientist experiments. Adaptive Data improved the dataset quality score from 9.0 to 9.5. The enhanced-label 30B run achieved the best result at 55.67%, below our 80% serving threshold. We therefore do not present the checkpoint as production-ready or let it control numerical decisions. The deterministic planner remains authoritative, while the adapted model is positioned as a future human-reviewed explanation layer.

## Challenges

The live Conduit endpoint intermittently returned an HTML page instead of GeoJSON. We added strict content validation and a safe fallback, then based the reproducible submission demonstration on the official historical CSVs. We also corrected an early evapotranspiration implementation that omitted the radiation-to-water-depth conversion factor. A regression test now protects the corrected calculation.

Operator-approved reservoir records were not available before the deadline. Every storage, capacity, demand, pumping and outage value is therefore labelled as a synthetic scenario. The project makes no field-performance, savings, forecast or automatic-control claim.

## Accomplishments

- Conduit observations materially enter the water balance.
- Exact source provenance and input hashes are preserved.
- The planner conserves mass across 200 stress scenarios.
- The interface works on desktop and mobile and retains a usable fallback without WebGL.
- Users can trace each recommendation through the daily table and exported JSON.
- Ten automated tests, lint, TypeScript and the production build pass.
- A four-minute, 1080p captioned demonstration was fully decoded and visually reviewed.

## What we learned

Meaningful data use is not the same as showing a sensor value. The data must change a calculation or decision, and an honest system must also report when the effect is too small to cross an operational threshold. We also learned that environmental models need unit-level verification: a plausible-looking result can still be wrong if an energy-to-depth conversion is omitted.

## What's next

With operator approval, we will replace the synthetic layer with verified storage, pump, demand and outage records; calibrate reference ET against open-water evaporation; validate the reservoir geometry and pipe topology; add issue-time weather forecasts for prospective planning; replay held-out operating periods; and evaluate the adapted explanation model against the deterministic results before serving it.

## Links

- Working application: https://majishift-reservoir.briankinyua0101.chatgpt.site/
- Source code: https://github.com/Brikita/majishift
- Demonstration video: add the final public or unlisted video URL before submission

