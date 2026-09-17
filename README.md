# MajiShift

Help reservoir operators compare pumping plans and maintain essential water reserves during interruptions.

## Current slice

A working seven-day scenario calculator with a reserve-first planning heuristic, fixed-schedule comparison, editable assumptions, shortfall accounting, an accessible daily table, JSON export, and a responsive JKUAT campus atlas. The atlas uses open-map context, a published JKUAT Dam point, 2D/3D views, a day selector, and the same proposed/fixed calculations as the rest of the interface. All current operating inputs and rainfall are synthetic. Pipe routes, treatment links, demand areas and the dam profile remain unverified. This is not a live campus system, a validated digital twin, or an optimization proof.

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

No Adaption model has been trained. Training needs an activated account, API key and reviewed examples. Never put an API key in the browser or commit a secret.

## Verification

September 17: planner tests pass (including 200 stress scenarios), TypeScript and application lint pass, and the production build succeeds. The Adaption evaluator accepts exact fixtures and rejects invalid/missing outputs; this is not a model benchmark. npm reported zero dependency vulnerabilities after the pinned upgrades. Lint excludes the unmodified Shadcn component catalog and its mobile hook. WebMCP registration was observed in the local supporting browser. Campus-atlas interactions were checked at phone, tablet and normal in-app browser widths; the mobile page has no horizontal overflow, map controls remain touch-sized, and the timeline scrolls within its component. There is still no field validation, real-device test or assistive-technology user test.
