# Paste this brief into the teammate's IDE coding agent

You are continuing MajiShift, a reservoir planning prototype for Hack The Weather, deadline September 18, 2026. Read README.md, docs/TEAM_HANDOFF.md, docs/OPERATOR_BRANCHES.md, docs/OPERATOR_FIELD_FORM.md, docs/GIS_SPEC.md, docs/ADAPTION.md and the current source before changing it. Also read applicable repository instructions and relevant installed skills. These docs describe future work as well as current code; inspect before claiming implementation.

The app is React/TypeScript using Vinext/Vite and Sites-compatible hosting. `lib/planner.ts` is the deterministic engine; `app/page.tsx` is the client UI. The latest public Conduit station 61 observation is normalized server-side. Its two cumulative gauge totals remain raw context because one snapshot cannot establish a daily increment. All rainfall and reservoir/operator inputs are explicitly synthetic scenarios. A responsive MapLibre campus atlas is implemented. Three AutoScientist runs finished: strict 30B at 0.5371, enhanced-label 30B at 0.5567 and fused-context Gemma 4B at 0.5345, all against a 0.80 target. No checkpoint is served or evaluated on the 20 untouched project cases. The numerical heuristic is not a proven optimizer or field-validated system.

First locate the completed operator form and authorized datasets. If missing, scaffold contracts, importer validation fixtures and GIS interfaces without inventing site facts. Report which branch-dependent tasks cannot be completed. Apply branch precedence in OPERATOR_BRANCHES.md and write a decision log naming selected IDs, evidence, scope and unresolved dependencies. Keep one primary problem.

Implement work packages in dependency order. Preserve the server-side Conduit adapter, data provenance, full-horizon planning, fair baseline comparison and receipts. Keep the map bound to the same calculated results. Do not invent asset coordinates, pipe routes, bathymetry, service effects, forecast history or savings. Preserve the accessible map fallback.

Represent missing values explicitly and distinguish observed, estimated, forecast and synthetic data. Validate units/timezones/quality and preserve source provenance. Raw water and treated water are separate when the system requires it. Unknown storage is not capacity; unknown rain is not zero; a nameplate rate is not measured pump delivery. Suppress precise operational recommendations when critical inputs remain unresolved.

Adaption is for extracting candidate constraints from reviewed operator notes. Evaluate base/prompted/adapted approaches on untouched cases. Keep credentials server-side and preserve the explicit operator review before applying a proposed input change. SDK scaffolding is not account-tested. Avoid starting duplicate training jobs; inspect supported models, credit/cost expectations and existing run IDs. Do not claim English-only seeds validate Kiswahili performance.

Use npm ci with the existing lockfile. Run npm test, npm run lint, npx tsc --noEmit and npm run build; add meaningful tests for changed contracts, planner cases and import behaviour. Run browser interaction checks for the new flows and GIS fallbacks. Report what was actually tested and what was not. Existing lint excludes the vendored Shadcn catalog and its hook; do not broaden exclusions to hide new errors.

Keep secrets and restricted source data out of Git/public assets. Do not replace the existing Sites project_id or publish/change audience merely because you received this handoff. Coordinate deployment and teammate/judge access with the project owner. A private preview link alone does not transfer source access. Use a shared approved repository/source archive; never reuse another person's temporary source credential.

At completion deliver: selected branch log, changed files, verified data provenance, tests/results, updated implementation inventory, reproducible demo instructions, open risks/dependencies and remaining tasks. Separate measured impact from simulated outcomes. Do not report optional future features as complete.

## Assignment fields for the human teammate

Assigned work package IDs: ____
Completed operator form location: ____
Authorized dataset location and disclosure restrictions: ____
Selected primary branch and unresolved answers: ____
Repository/branch and integration owner: ____
Deadline and expected demo: ____
Account-dependent actions authorized by owner: ____
