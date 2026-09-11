# Adaption experiment: operator notes to verified planning constraints

## Why this task

An operator may know the constraints but express them in a short English/Kiswahili note. Extract a structured candidate change, with nulls and clarification when information is missing. Numerical planning remains deterministic. Do not claim training improves weather forecasts or invent missing sensor observations.

Example: 'Pump off on day 2 for 2 days. Essential demand is 1400 cubic metres per day.' -> outage_start_day=2, outage_duration_days=2, essential_m3_day=1400, irrigation_m3_day=null, needs_clarification=false.

## Experiment stages

1. Activate the account with the hackathon email. Confirm starting credit balance, training estimates, supported model, and export/serving options.
2. Review `adaption/cases.jsonl` with the operator and a fluent Kiswahili reviewer. Current cases are synthetic, English-only seeds; not a sufficient training corpus. Keep test cases untouched and split by wording/scenario family as the dataset grows.
3. Run `node scripts/prepare-adaption.mjs` to produce training CSV and held-out JSONL in `work/adaption`. Test cases are never uploaded by this script.
4. Use Adaptive Data in the platform to expand/localize TRAINING examples only. Inspect adaptations: numbers, units and labels must remain correct. Include missing dates, ambiguous capacities, contradictions, litre/m³ conversions, and instructions embedded in notes. Add bilingual cases only after review.
5. Evaluate a base model and the same model with a carefully specified prompt on the held-out test set before training. Store model identity, prompt, dataset hash and decoding settings. Never use the test set to adapt data.
6. Train one explicit small supported model with AutoScientist, LoRA and one iteration initially. The script uses an idempotency key to avoid accidental duplicate runs. No job has been submitted by this project.
7. Export and serve the checkpoint separately; the web Worker cannot host large model weights. An inference endpoint is not yet integrated. Adaption credits may not cover external serving.
8. Evaluate adapted predictions using the same harness; inspect false confident extraction, not only exact-match accuracy. A tiny seed test set is a pipeline check, not a credible performance benchmark.

## Commands

Python environment with `adaption>=0.7.0` and `httpx`; set ADAPTION_API_KEY in the shell/secret manager, never the browser. `python scripts/adaption_job.py --list-models` is read-only. `python scripts/adaption_job.py --upload work/adaption/train.csv` uploads only the reviewed training CSV. `python scripts/adaption_job.py --train DATASET_ID --model MODEL_ID --run-key UNIQUE_EXPERIMENT_KEY` starts one credit-consuming iteration. Inspect balance/cost first; retain returned IDs. `python scripts/adaption_job.py --status RUN_ID` checks progress without another training run.

For evaluation: prepare predictions as JSONL `{ "id": "test-01", "prediction": { ...schema fields... } }` and run `node scripts/evaluate-adaption.mjs work/adaption/test.jsonl predictions.jsonl`.

## Output contract

Exactly five keys: outage_start_day (integer 1–7 or null), outage_duration_days (integer 1–7 or null), essential_m3_day (non-negative number or null), irrigation_m3_day (non-negative number or null), needs_clarification (boolean). Relative dates must be anchored before integration; the seed task uses numbered scenario days. Unmentioned quantities remain null, not zero. The model cannot lower a reserve or change the plant configuration.

## Release gates

Operator-confirmed labels; independent English/Kiswahili review; larger untouched test set; input/output validation; operator applies candidate changes explicitly; no secret in client code. Quantities and provenance must survive the entire chain. Report actual results for base/prompted/adapted models; no benchmark numbers exist yet.

Official sources: https://docs.adaptionlabs.ai/autoscientist-quickstart/ and https://docs.adaptionlabs.ai/autoscientist/running-autoscientist/ . The latter documents max_iterations, explicit model selection and idempotency_key.
