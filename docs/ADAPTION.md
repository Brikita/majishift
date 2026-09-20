# Adaption action-model experiment

## Chosen role

Adaption is the language and explanation layer in MajiShift:

**Conduit observation → deterministic water balance → Adaption operator brief → human review**

The model receives the latest labelled Conduit context, the explicit reservoir scenario and calculated outputs. It returns a short brief with five text fields: `headline`, `action`, `rationale`, `safeguard`, and `data_scope`.

The model does not calculate storage, invent forecasts, alter inputs or operate equipment. The tested TypeScript planner remains the numerical source of truth. This boundary lets the team use an adapted model for useful communication without allowing a language model to silently change safety-critical quantities.

## Account run record

The first Adaptive Data job was launched from the hackathon account on 2026-09-19.

- Dataset ID: `b76c48ba-b1b1-460f-9c48-0176388f3714`
- Source: `work/adaption-actions/train.csv`, 160 rows
- Coverage: 160 unique contexts; 84 reserve-maintained, 60 reserve-crossed and 16 essential-demand-gap examples
- Mapping: `instruction` → prompt, `context` → context, `response` → completion
- Source evaluation: 9/10, classified as excellent; English 100%; Science 100%
- Recipe: hallucination mitigation enabled; prompt rephrasing, prompt metadata injection, reasoning traces, checklist verification and House Special disabled
- Deduplication: disabled because the constant task instruction is intentional and each row has different per-row water-balance context
- Blueprint: preserve values, units, provenance categories and JSON contract; make only reviewable recommendations; require a verification safeguard
- Length: concise
- Launch estimate: 2 credits for 160 rows from a 650-credit balance
- Completed status: succeeded; 160/160 rows processed with no error
- Dataset result: quality increased from 9.0 to 9.5 (5.6% reported improvement)
- Adaptive Data run ID: `dataset-b76c48ba-b1b1-460f-9c48-0176388f3714-1789845088229`

Do not upload `work/adaption-actions/test.jsonl` to Adaptive Data or AutoScientist. It is the untouched evaluation set.

### AutoScientist experiments

Both experiments use `nvidia/Nemotron-3-Nano-Omni-30B-A3B-Reasoning-BF16`, LoRA, three epochs per iteration, up to three iterations and a target win rate of 0.80. Each run expands the 160 source rows with 20,000 domain examples and 8,000 general-diversity examples, producing 28,160 training rows. Expansion costs 280 credits per run; training and evaluation are zero credits under the activated `AdaptYourWorld` voucher.

| Experiment | Run ID | Completion labels | Status | Best win rate |
|---|---|---|---|---|
| Strict JSON contract | `a28a2263-4033-4e27-bab3-c97d56eb5d93` | `original_completion` | Succeeded after 3/3 iterations | 0.5371 against a 0.80 target |
| Adaption enhanced labels | `62a90de1-0309-4a16-9b17-0018c58235cd` | internal `fused_generation` column | Succeeded after 3/3 iterations | 0.5567 against a 0.80 target |
| Fused context, compact labels | `762945d7-87d9-4e5f-884f-3317d63a88be` | raw `prompt` → `completion` | Succeeded after 3/3 iterations | 0.5345 against a 0.80 target |

The two 30B runs succeeded because they completed their iteration budgets; neither reached the target win rate. The enhanced-label experiment finished 1.96 percentage points above the strict-label run (0.5567 versus 0.5371), so it is the leading 30B checkpoint from AutoScientist's evaluation, but that difference does not replace evaluation on the 20 untouched project cases. The strict checkpoint was downloaded to the ignored `work/adaption-actions/` directory and its Zstandard tar stream was verified successfully. The archive contains the expected LoRA adapter, including a 2,830,128,272-byte `adapter_model.safetensors` file. This verifies transfer integrity, not inference quality. The enhanced-label download was interrupted after 1.41 GB of an expected 2.61 GB and must be restarted and archive-verified before use. Its Markdown-fenced outputs will require a tolerant parser or output cleanup if selected.

### Score diagnosis and corrected run

The completed adapted export contains 28,097 rows. Only 160 are project source rows, so the source task is about 0.57% of the effective dataset. The run mapping selected a prompt column while the reservoir scenario remained in a separate context column; this did not guarantee that the model saw the numbers it had to preserve. The export also contains extreme response-length outliers, while enhanced completions average roughly 3,486 characters compared with roughly 433 characters for the intended concise JSON labels. These are stronger explanations for the stalled score than a shortage of raw weather readings.

`train-fused.csv` fixes the input contract by placing the instruction and full scenario JSON in one prompt and keeping the compact five-field JSON response. It was uploaded as raw dataset `ce570660-fd6f-4829-bbb8-5f89a89f3050`. The corrected experiment uses Gemma 3 4B, the 160 reviewed source rows, the minimum 840 domain-augmentation rows required to reach Adaption's 1,000-row training floor, no general augmentation and the `AdaptYourWorld` voucher. This preserves a 16% source share instead of 0.57% and costs about 8.4 augmentation credits.

The corrected run finished at 0.5345: 0.26 percentage points below the strict 30B run and 2.22 points below the enhanced-label 30B run. The result shows that fixing context and reducing augmentation did not overcome the smaller base model or other label/evaluation limitations. Its 116,433,415-byte checkpoint archive downloaded successfully and its Zstandard tar stream was verified; it contains a 119,273,568-byte LoRA `adapter_model.safetensors` file. The enhanced-label 30B checkpoint remains the leading AutoScientist result, subject to archive verification and the untouched 20-case project evaluation. Cross-run win rates use each run's dataset-derived comparison and should be treated as directional rather than a field-performance ranking.

Credit record: 2 credits for Adaptive Data, 280 credits for each 30B augmentation and about 8.4 credits for the corrected 4B augmentation, for approximately 570.4 credits committed from the original 650-credit balance. Approximately 79.6 credits remain for recovery or a focused follow-up.

## What is implemented

- `app/api/conduit/route.ts` reads and normalizes the latest public Conduit station 61 observation on the server.
- The application uses the two cumulative gauge totals to calculate Day 1 rainfall and exports the complete observation provenance.
- `scripts/prepare-adaption-actions.ts` creates 160 training rows and 20 held-out cases from the tested planner.
- Training contexts use synthetic observations shaped to the Conduit schema. At inference time the app will supply the real latest observation.
- `scripts/evaluate-adaption-actions.mjs` checks the five-field contract, missing/invalid output, exact match and per-field accuracy.
- The web interface reports the completed strict-label checkpoint, its below-target score and the still-unconnected serving layer.

Run `npm run prepare:adaption` after planner changes. Generated files are placed in `work/adaption-actions/`:

- `train.csv`: `instruction`, `context`, and `response` columns for Adaption.
- `train-fused.csv`: one complete `prompt` plus `completion`, used by the corrected run.
- `test.jsonl`: untouched held-out cases.
- `synthetic-operator-records.csv`: 1,260 explicitly synthetic relative-day records for the demo workflow.
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

Until serving and held-out evaluation pass, say **“Adaption checkpoint trained; comparison and serving validation remain.”** Do not say the displayed brief was generated by the adapted model.
