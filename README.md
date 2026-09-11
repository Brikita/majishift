# MajiShift

Help reservoir operators compare pumping plans and maintain essential water reserves during interruptions.

## Current slice

A working seven-day scenario calculator with a reserve-first planning heuristic, fixed-schedule comparison, editable assumptions, shortfall accounting, an accessible daily table, and JSON export. All current inputs and rainfall are synthetic. This is not a live campus system, a validated digital twin, or an optimization proof.

## Run

Node 22.13+; `npm install`, `npm run dev`. `npm test` checks mass balance, outages, infeasibility and input validation. `npm run build` creates the Sites-compatible Worker. `npx tsc --noEmit` checks types.

React + TypeScript, Vinext/Vite, Tailwind and Shadcn components. A pure TypeScript domain module is shared independently of the UI. Sites provides the private preview. No database is needed for the first session-based simulator; exported scenarios preserve inputs and computed outputs. No inputs are saved automatically between visits.

## Read next

- [Project specification](docs/PROJECT.md)
- [Operator interview](docs/OPERATOR_INTERVIEW.md)
- [Adaption experiment](docs/ADAPTION.md)
- [Evidence and assumptions](docs/EVIDENCE.md)

No Adaption model has been trained. Training needs an activated account, API key and reviewed examples. Never put an API key in the browser or commit a secret.

## Verification

September 11: planner tests pass (including 200 stress scenarios), TypeScript and application lint pass, and the production build succeeds. The Adaption evaluator accepts exact fixtures and rejects invalid/missing outputs; this is not a model benchmark. npm reported zero dependency vulnerabilities after the pinned upgrades. Lint excludes the unmodified Shadcn component catalog and its mobile hook. Optional WebMCP registration is implemented but has not been verified in a supporting browser. No field validation or browser interaction test has been performed.
