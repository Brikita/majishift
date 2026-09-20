# Synthetic operator-record contract

## Submission position

The team did not obtain authorized JKUAT reservoir operating records before the online submission deadline. MajiShift therefore uses fabricated records only as **explicitly labelled synthetic demonstration data**. They are not historical records, measurements, operator statements or evidence of current campus operations.

The latest public Conduit station observation remains separately attributed as measured weather data. The application never relabels synthetic storage, demand, pumping, outage or operator-action fields as Conduit observations.

## Generated demonstration file

`npm run prepare:adaption` creates `work/adaption-actions/synthetic-operator-records.csv` with 1,260 relative-day records from 180 deterministic seven-day scenarios. Every row has:

- `evidence_status=synthetic` and `operator_review_status=not_reviewed`;
- a stable scenario and record identifier;
- relative day rather than a fabricated calendar timestamp;
- storage, pumping, essential-service, irrigation, rainfall and overflow quantities from the tested water-balance code;
- a review suggestion rather than a claimed operator decision; and
- a rainfall source that distinguishes a Conduit-shaped synthetic Day 1 observation from later scenario rainfall.

These records demonstrate the import, planning, comparison and explanation workflow. They must never be presented as JKUAT history or used to estimate real savings.

## October replacement path

If the team advances to the in-person event, obtain the required institutional and operator approval before collecting or using operational records. Preserve the originals privately and create a reviewed, versioned import with the following evidence:

1. reservoir level or stored volume with the level-to-volume conversion source;
2. pump start/stop time, availability, delivered flow and maintenance interruptions;
3. essential and discretionary demand estimates or meter readings;
4. irrigation timing and area when relevant;
5. operator action, reason, outcome and reviewer;
6. timestamp, timezone, units, missing-value meaning and source identifier; and
7. the matching Conduit observation window, without assuming station rainfall equals catchment inflow.

Replace synthetic rows rather than blending them invisibly. Retain `evidence_status`, add the approved source IDs and record the transformation from source documents to model-ready fields. Re-run the same held-out replay and planner checks before changing any prototype claim.

## Judge-facing wording

> For the online qualification round, reservoir operating records are synthetic and labelled on every row because operator-approved history was not available before submission. Live Conduit weather is kept separate. If selected for the October event, we will replace the synthetic layer with approved operator records, replay the same decisions, and report measured and simulated outcomes separately.
