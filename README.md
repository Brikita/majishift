# MajiShift

Help reservoir operators compare pumping plans and maintain essential water reserves during interruptions.

## Current slice

A working seven-day scenario calculator with a reserve-first planning heuristic, fixed-schedule comparison, editable assumptions, shortfall accounting, an accessible daily table, JSON export, and a responsive JKUAT campus atlas. A server-side adapter reads the latest public Conduit@Empathy station 61 observation; the mean of its two cumulative rain-gauge totals replaces Day 1 scenario rain and the station appears on the map. Days 2–7, reservoir state and every operating input remain assumptions. Pipe routes, treatment links, demand areas and the dam profile remain unverified. This is not a live campus control system, validated digital twin, forecast product or optimization proof.

## Run

Node 22.13+; `npm install`, `npm run dev`. `npm test` checks mass balance, outages, infeasibility and input validation. `npm run build` creates the Sites-compatible Worker. `npx tsc --noEmit` checks types.

React + TypeScript, Vinext/Vite, Tailwind and Shadcn components. A pure TypeScript domain module is shared independently of the UI. Sites provides the private preview. No database is needed for the first session-based simulator; exported scenarios preserve inputs and computed outputs. No inputs are saved automatically between visits.

## Read next

- [Complete teammate handoff and remaining work](docs/TEAM_HANDOFF.md)
- [Submission assumption register and claim boundaries](docs/ASSUMPTIONS.md)
- [Operator answers mapped to build decisions](docs/OPERATOR_BRANCHES.md)
- [Detailed operator meeting form](docs/OPERATOR_FIELD_FORM.md)
- [GIS and 3D campus specification](docs/GIS_SPEC.md)
- [Copyable IDE coding-agent brief](docs/CODING_AGENT_BRIEF.md)
- [Project specification](docs/PROJECT.md)
- [Operator interview](docs/OPERATOR_INTERVIEW.md)
- [Adaption experiment](docs/ADAPTION.md)
- [Evidence and assumptions](docs/EVIDENCE.md)

`npm run prepare:adaption` creates 160 training rows and 20 held-out cases for an Adaption action model that turns Conduit context plus deterministic water-balance results into a concise operator brief. No checkpoint has been trained or served yet. Training needs an activated account, API key, human review and a credit estimate. Never put an API key in the browser or commit a secret.

## Verification

The planner suite covers 200 stress scenarios, rainfall injection, invalid rainfall, outages, infeasibility and mass balance. TypeScript, lint and the production build are required before publication. The Adaption action dataset is generated from the same planner but remains synthetic training material, not a model benchmark. Campus-atlas interactions were checked at phone, tablet and normal in-app browser widths; the mobile page has no horizontal overflow, map controls remain touch-sized, and the timeline scrolls within its component. There is still no field validation, real-device test or assistive-technology user test.
