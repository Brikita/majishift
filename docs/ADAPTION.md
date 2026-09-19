# Adaption action-model experiment

## Chosen role

Adaption is the language and explanation layer in MajiShift:

**Conduit observation → deterministic water balance → Adaption operator brief → human review**

The model receives the latest labelled Conduit context, the explicit reservoir scenario and calculated outputs. It returns a short brief with five text fields: `headline`, `action`, `rationale`, `safeguard`, and `data_scope`.

The model does not calculate storage, invent forecasts, alter inputs or operate equipment. The tested TypeScript planner remains the numerical source of truth. This boundary lets the team use an adapted model for useful communication without allowing a language model to silently change safety-critical quantities.

## What is implemented

- `app/api/conduit/route.ts` reads and normalizes the latest public Conduit station 61 observation on the server.
- The application uses the two cumulative gauge totals to calculate Day 1 rainfall and exports the complete observation provenance.
- `scripts/prepare-adaption-actions.ts` creates 160 training rows and 20 held-out cases from the tested planner.
- Training contexts use synthetic observations shaped to the Conduit schema. At inference time the app will supply the real latest observation.
- `scripts/evaluate-adaption-actions.mjs` checks the five-field contract, missing/invalid output, exact match and per-field accuracy.
- The web interface explains the complete integration and honestly reports that no checkpoint is connected yet.

Run `npm run prepare:adaption` after planner changes. Generated files are placed in `work/adaption-actions/`:

- `train.csv`: `instruction`, `context`, and `response` columns for Adaption.
- `test.jsonl`: untouched held-out cases.
- `manifest.json`: row counts, provenance and limitations.

Generated completions are deterministic candidate labels. A team member must review them before upload; generation by the same planner proves pipeline consistency, not language quality or real-world validity.

## Account activation and training sequence

1. Activate the hackathon account at <https://adaptionlabs.ai/app/auth> with the email that received the credits.
2. Create an API key in Adaption settings and place it in the local `ADAPTION_API_KEY` environment variable. Never paste it into client code, commit it or place it in a public deployment variable.
3. Run `npm run prepare:adaption`, then review every training completion and a sample from each scenario family.
4. Upload `work/adaption-actions/train.csv`. Map `instruction` to prompt, `context` to context and `response` to completion.
5. Request an Adaptive Data estimate before starting a billed run. Use deduplication and prompt rephrasing conservatively; reasoning traces are optional. Localize a reviewed subset to Kiswahili for Kenya only if a fluent reviewer can verify numerical fidelity.
6. Download and inspect the adapted dataset. Check that units, source labels, negative cases and safeguards survived adaptation.
7. Run the same held-out cases against a base model and a carefully prompted base model. Save predictions with the model name, prompt, decoding settings, latency and date.
8. Ask AutoScientist for supported models and train one small supported model with one iteration and an idempotency key. Check the credit estimate before starting another run.
9. Download the best checkpoint when the run succeeds. Adaption supplies the trained checkpoint; serving is a separate deployment step.
10. Serve the checkpoint behind a server-side authenticated endpoint, validate its five-field output and show the brief as a proposal that an operator must review.

Official documentation:

- <https://docs.adaptionlabs.ai/adaptive-data-quickstart>
- <https://docs.adaptionlabs.ai/autoscientist-quickstart/>
- <https://docs.adaptionlabs.ai/autoscientist/running-autoscientist/>
- <https://docs.adaptionlabs.ai/autoscientist/download-the-model/>

## Evaluation

Prediction files use one JSON object per line:

```json
{"id":"action-001","prediction":{"headline":"…","action":"…","rationale":"…","safeguard":"…","data_scope":"…"}}
```

Run:

```text
npm run evaluate:adaption -- work/adaption-actions/test.jsonl predictions.jsonl
```

Report base, prompted and adapted results on the same held-out file. Exact wording is intentionally strict for this first pipeline check. Before claiming model quality, add human scoring for factual consistency, action usefulness, unsupported claims, number preservation and English/Kiswahili clarity.

## Release gates

- Human review of training labels and all source claims.
- An activated account, recorded dataset ID, credit estimate and run ID.
- Base/prompted/adapted comparison on untouched cases.
- No lower reserve, changed volume or invented observation in model output.
- Server-side credentials and output validation.
- Visible operator approval before any recommendation is treated as accepted.
- A clear fallback to the deterministic planner when inference is unavailable or invalid.

Until these gates pass, say **“Adaption training package prepared; checkpoint not connected.”** Do not say the displayed brief was generated by an adapted model.
