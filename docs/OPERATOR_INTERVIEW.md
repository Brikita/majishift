# Operator conversation — September 11

Expanded meeting checklist: [Operator field form](OPERATOR_FIELD_FORM.md). After the meeting use [answer-to-decision branches](OPERATOR_BRANCHES.md) and [teammate handoff](TEAM_HANDOFF.md).

Opening: We are students exploring a planning prototype for Hack The Weather. We want to understand one difficult decision in your current water system before choosing the final features. We are not asking to control equipment.

## Start with a real example

1. Tell us about the most recent time you had to change pumping, irrigation or maintenance plans. What happened, what did you know, and what did you decide?
2. What is hardest: knowing available water, pumping availability, changing demand, water quality, or something else? How often does it happen?
3. What information would have changed that decision? What would make a recommendation unhelpful?

## Establish the system

- Which structure is the dam/storage pond? How does it connect to river intake, treatment, treated storage and irrigation?
- Current usable capacity, dead storage, level gauge and level-volume relationship?
- Current sources and pump delivery rates; how are flow/runtime/power recorded?
- Essential daily demand, farm requirements and what can actually be delayed?
- Minimum reserves, permitted pumping windows and relevant operator-provided limits?
- Existing monitoring or planning tools? Who approves operational changes?

## Ask for a small authorized sample

- A diagram or current specification, if shareable.
- A week of level readings, timestamps, pump runtime/flow, treatment production and irrigation withdrawals.
- One historical interruption and its operating log.
- A Conduit export with data dictionary, timezone, units, cadence and missing-value meanings; check whether rain columns are increments or cumulative totals.
- Longer history if easily available. Do not request credentials; ask for an authorized export.

## Test the concept

Show the scenario prototype. Ask: Does this match a decision you make? Which input is wrong or missing? Would daily planning be useful, or do you need hourly decisions? What outcome would convince you it helped?

## Leave with

One agreed problem, primary user, decision frequency, baseline method, available records, one success measure, and a follow-up contact. Record permission to quote feedback or show data separately. Do not promise savings or assume the 2001 infrastructure description is current.
