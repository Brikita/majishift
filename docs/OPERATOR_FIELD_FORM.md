# Operator meeting: questions and capture form

Take this form and the prototype. Target 30–45 minutes, with optional follow-up for documents. It is fine to leave a field unknown. Never turn an unknown into zero. Start with their experience before suggesting our preferred problem.

Date/time: ____  Interviewer: ____  Operator role: ____  System/site name: ____
Permission to take notes: ____  Permission to photograph documents/assets: ____
Permission to show anonymized data in demo: ____  Permission to quote feedback: ____
Restrictions/contact for follow-up: ____

Opening: “We are building a student prototype to help explain water-management decisions. We want to understand a real decision you make and check whether our approach is useful. Could you walk us through a recent difficult day?”

## The first ten questions — prioritize these if time is short

| ID | Ask exactly this | Record / request | Why it changes the project |
|---|---|---|---|
| Q01 | What is this reservoir used for today, and who receives its water? | Raw water, treated supply, irrigation, detention, research or other; source and destination names | Selects A1–A5; prevents wrong beneficiary claim |
| Q02 | Tell me about the last difficult decision you made. What happened, when, what did you know, what did you do? | One dated incident, consequence and action | Selects actual problem; gives demo case and baseline |
| Q03 | What can you change yourself: pumping time, pump choice, treatment rate, irrigation, or none? | Adjustable actions, approver and hard restrictions | Selects B1–B14; establishes feasible recommendations |
| Q04 | Can you sketch how water moves from source through storage/treatment to users? | Assets and arrows; raw vs treated; normal and alternative routes | Determines one vs multiple compartments |
| Q05 | How do you know how much water is available now? | Dated reading, unit, gauge datum, volume curve, usable capacity, dead storage | Selects C1–C4; determines whether numeric planning is possible |
| Q06 | How much does each pump actually deliver, and when can it run? | Measured m³/h or flow total/runtime; nameplate distinguished; source/power restrictions | Bounds supply; nameplate alone remains an estimate |
| Q07 | How much water must be supplied, to whom, and what can be postponed? | Time-profiled demand, essential minimum, irrigation windows and maximum delay | Defines objective and permissible trade-offs |
| Q08 | What reserve or level must be maintained, who sets it, and what happens below it? | Threshold, unit, rationale, compartment and authorizer | Separates reserve warning from service failure |
| Q09 | Could we receive a small authorized sample of readings and one incident log? | Best: 2–4 weeks or more; minimum: a dated week/event; data dictionary and timezone | Determines replay, calibration or scenario-only mode |
| Q10 | Where are these assets on a map, and which details may we show? | Operator identifies pond/intake/treatment/tanks/weather station; shareable map/sketch | Determines GIS accuracy and disclosure |

## Detailed follow-ups

Q11. What is the exact current capacity document/date? Is that total volume or usable volume? Where is the intake/dead-storage level? Has dredging/sedimentation changed it? Request level–area–volume table and operating range if available. Do not infer capacity from a satellite footprint.

Q12. What are the latest level and reading time? Is the reference gauge zero local or an elevation datum? How often are readings taken and checked? Does “80%” mean gauge height, volume or an estimate?

Q13. Does rain fall directly on the stored water? Does runoff enter, from where? Are river inflows pumped or natural? Are overflow and other inflows/withdrawals recorded? Are there bypasses, leaks under investigation, backwash or treatment losses? Separate observed facts from suspected losses.

Q14. For each pump: normal measured delivery, range, power/runtime record, maintenance downtime, allowed windows, minimum run, start limits, ability to run concurrently and delivery destination. Are there river-level or operator-supplied abstraction restrictions?

Q15. If treatment is involved: maximum and usual throughput, processing delay, yield/backwash, interruptions and destination storage. Does the reserve apply to raw pond or treated tank? What limits actual delivery to users?

Q16. For each demand class: measured or estimated volume, cadence, term/weekend variation, priorities, minimum service and consequences of delay. For farms: plot locations, area, crop/stage, current irrigation method, requested volume, minimum amount and latest acceptable time. Do not assume all irrigation is optional.

Q17. Are outages announced or unexpected? Typical duration and range? How early is notice received? Does bad weather restrict access/pumping/treatment? How do you currently prepare? Ask for one successful case too, not only failures.

Q18. How often do decisions need changing: hourly, daily or weekly? What format would be easiest: map, table, short briefing, printed plan or phone form? What would make you reject a recommendation?

Q19. What weather data do you actually use, if any? Which Conduit contact can provide an authorized export? Ask station coordinates, channel names, units, cadence, timezone, gauge increment vs cumulative semantics, missing/reset codes, calibration and data date range. The water operator may not own Conduit; record the correct referral instead of treating “I don't know” as “no data exists.”

Q20. Are archived forecasts available, with issue times? If not, can we use measured weather for retrospective accounting and separate scenario forecasts? Where do you expect weather to change an action?

Q21. If quality is the main concern: which measured parameter, units, test frequency, instrument/lab, authorized action threshold, event dates, inspections and outcomes? Weather association alone does not establish contamination.

Q22. What GIS records exist: campus boundary, reservoir polygon, asset coordinates, pipe routes, tank/plant footprints, elevations, survey date, coordinate system and permission to use? Ask them to distinguish accurate routes from a rough connectivity sketch. No need to request a new drone survey for this MVP.

Q23. Do notes use English, Kiswahili, mixed language or abbreviations? May we anonymize a few examples? What should the tool do when a date or unit is missing? Would a suggested structured update for your review be useful?

Q24. Which single result would convince you the tool helps? Examples to discuss only after their answer: fewer hours below reserve, less unmet demand, irrigation completed within its window, less unnecessary pumping, or faster planning. How would we measure that against your current method?

Q25. Can you review one completed scenario before September 16? Who else should verify the diagram, numbers and public disclosure? Confirm follow-up channel without asking for passwords/API keys.

## Copy this record for every important numeric answer

Variable / asset: ____
Answer exactly as supplied: ____
Unit and period (for example m³/day, not just m³): ____
Timestamp / effective date: ____
Measured / documented / operator estimate / unknown: ____
Source document or log row: ____
Minimum / normal / maximum if known: ____
Known uncertainty / limitations: ____
Permission to use / disclose: ____
Follow-up owner: ____

## Incident capture

Incident ID and date: ____
What the operator knew at decision time, including notice time: ____
Starting storage by compartment: ____
Available pumps/sources and time windows: ____
Expected demand and reserve rule: ____
Weather observed up to that time / forecast issued by then: ____
Actual chosen action and reason: ____
Observed outcome, measurement source and missing evidence: ____
What alternative the operator considers reasonable: ____

## Leave with this minimum packet

One accepted problem and real incident; shareable system sketch; dated starting reading or an explicit “unknown”; capacity basis; pump delivery basis; demand and flexibility; reserve rule; sample records or referral; map identity and disclosure permission; follow-up reviewer. If numeric evidence is missing, record C2/C3/C4/C11 rather than inventing it.

After meeting: fill decision log in OPERATOR_BRANCHES.md, resolve contradictions, select one primary route, and pass the completed form plus authorized data to the teammate. Keep personal contact details and restricted source records out of a public Git repository.
