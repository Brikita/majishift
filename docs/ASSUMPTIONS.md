# MajiShift submission assumption register

## Status

The team could not validate current operating records with the reservoir operator before the submission deadline. MajiShift is therefore an assumption-driven scenario prototype. The defaults below demonstrate the decision workflow and water accounting; they do not describe current JKUAT operations.

Every operating value remains editable in the application. Replace this register with an approved site configuration before any pilot or operational use.

For the online qualification round, generated operator-day records are retained only as explicitly labelled synthetic demonstration data. If the team advances to the October event, collect and replay approved operator records before changing any operational or impact claim.

## Default scenario inputs

| Input | Prototype default | Status | What must replace it |
| --- | ---: | --- | --- |
| Usable reservoir capacity | 20,000 m³ | Invented scenario value | Survey, design record or operator-approved estimate |
| Starting stored water | 9,000 m³ | Invented scenario value | Gauge reading or storage curve conversion |
| Protected reserve | 5,000 m³ | Invented policy value | Approved minimum operating level |
| Essential demand | 1,400 m³/day | Invented scenario value | Metered or operator-estimated daily essential demand |
| Irrigation demand | 250 m³/day | Invented scenario value | Irrigated area, crop plan and system efficiency |
| Pump delivery | 250 m³/hour | Invented scenario value | Nameplate flow checked against field delivery |
| Maximum pumping | 10 hours/day | Invented constraint | Power, permit, maintenance and operator limits |
| Fixed-plan pumping | 4 hours/day | Invented comparison plan | Actual baseline schedule |
| Reservoir surface area | 8,000 m² | Invented scenario value | Survey or GIS water-surface polygon |
| Evaporation | 4 mm/day | Constant synthetic value | Local observation or weather-data series |
| Simulated outage | Days 2–3 | Invented stress event | Known maintenance or outage forecast |
| Seven-day rainfall | 0, 0, 2, 8, 4, 0, 0 mm | Synthetic scenario | Confirm gauge semantics, obtain historical increments and add an authorized forecast for future days |

## Assumed network topology

The interface shows this conceptual flow:

**Ndarugu source / intake → JKUAT Dam → treatment and essential campus use**, with a separate **irrigation branch**.

This schematic is based on historical context, not on a verified current pipe survey. It must not be interpreted as a mapped pipe route, confirmed intake arrangement or current treatment configuration.

## Map evidence

- The JKUAT Dam marker uses the public OpenStreetMap feature identified as way 330895323 near 37.0186°E, 1.0926°S.
- The campus reference marker comes from public OpenStreetMap context.
- The Conduit station marker uses the coordinates returned with the latest station 61 observation.
- Pipes, valves, meters, pumps, treatment units, demand zones and ownership boundaries have not been verified.
- The 3D buildings are visualization context from the public map style. Their presence does not establish water-system connectivity.

## Decision-model assumptions

- Essential demand is served before irrigation demand.
- The proposed plan may vary pump hours by day; the fixed comparison uses the same daily hours when pumping is available.
- Pumped volume equals pump delivery multiplied by scheduled hours.
- Rain contribution equals rainfall depth multiplied by reservoir surface area, with millimetres converted to metres.
- Evaporation loss uses the same surface area and daily evaporation depth.
- The simulation aggregates flows once per day and does not model hourly peaks, leakage, hydraulic pressure or water quality.
- The planner reports storage, reserve breaches and unmet demand; it does not control physical equipment.
- Future deployment must use authorized observations and keep a human operator responsible for final action.

## Claims the team may make

- MajiShift demonstrates transparent seven-day reservoir planning under rainfall, demand, pumping, reserve and outage scenarios.
- It preserves the latest public Conduit station timestamp and two gauge totals as environmental context; one cumulative snapshot is not used in direct-rain accounting.
- It compares an adaptive proposal with a fixed schedule using visible water accounting.
- It gives judges an interactive, mobile-compatible GIS context and an auditable explanation for each daily decision.
- The interface is ready for site-specific calibration once verified inputs become available.

## Claims the team must not make

- The displayed reservoir storage, demand, capacity, pumping and future rainfall values are live JKUAT readings or official records. The separately labelled Conduit station card is the only live observation.
- The displayed water network is a surveyed or authoritative pipe map.
- The suggested schedule has been approved by JKUAT or a reservoir operator.
- The system currently controls pumps, guarantees water availability or predicts water quality.

## Honest demo wording

> We could not validate current operating records before the deadline, so this is a mixed-evidence scenario prototype. The latest public Conduit station observation supplies environmental context when available; its cumulative rain-gauge totals are not treated as a daily increment. The dam point comes from OpenStreetMap, while rainfall, system flow and every reservoir operating number remain editable assumptions. Our contribution is the traceable path from observation to water balance to reviewable action. Deployment would begin by verifying the site configuration, gauge semantics and operator workflow.
