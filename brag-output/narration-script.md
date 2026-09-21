# MajiShift — optional narration

240 seconds. Read naturally within each time window; pauses allow the viewer to inspect the app. No narration is embedded in the silent MP4.

## 00:00:00–00:00:08 | THE QUESTION

MajiShift helps an operator compare pumping plans before an interruption puts essential water reserves under pressure.

## 00:00:08–00:00:22 | THE TEAM

Brian Mwangi: backend engineering, Adaption model training and data aggregation. Patrick Leon: frontend development, UI/UX, QA and GIS.

## 00:00:22–00:00:32 | 01 / THE PROBLEM

Essential use, irrigation and pumping availability all draw on the same limited water balance. Operators need to see the trade-offs.

## 00:00:32–00:00:42 | 01 / THE PROBLEM

Our JKUAT pilot exploration asks a practical question: can a proposed schedule maintain a minimum reserve through two unavailable pumping days?

## 00:00:42–00:00:54 | 02 / CONDUIT DATA

The historical replay uses official Conduit station 61 observations from 29 August to 4 September 2026. Operating values remain synthetic.

## 00:00:54–00:01:05 | 02 / CONDUIT DATA

Daily temperature ranges drive a Hargreaves reference evapotranspiration estimate. Measured rain also enters the water balance; this replay recorded no rain.

## 00:01:05–00:01:16 | 02 / CONDUIT DATA

Compared with four millimetres per day, Conduit weather adds 35.6 cubic metres of estimated loss. Total default pumping remains unchanged.

## 00:01:16–00:01:27 | 03 / SET THE SCENARIO

This example starts with 9,000 cubic metres in storage, a 5,000 cubic metre reserve, and essential demand of 1,400 cubic metres daily.

## 00:01:27–00:01:38 | 03 / SET THE SCENARIO

Pumping is unavailable on days two and three. The fixed schedule pumps four hours on available days; the proposed plan prepares a buffer.

## 00:01:38–00:01:50 | 04 / COMPARE

Both schedules use the same weather and operating assumptions. The teal line follows the proposed schedule; the dashed line follows the fixed schedule.

## 00:01:50–00:02:01 | 04 / COMPARE

In this scenario, the fixed schedule falls below the reserve on five days. The proposed schedule stays above the reserve throughout.

## 00:02:01–00:02:12 | 04 / COMPARE

The proposed plan pumps 7,875 cubic metres versus 5,000 for the fixed schedule. This protects the reserve through more pumping, not water savings.

## 00:02:12–00:02:24 | 05 / REVIEW THE SCHEDULE

Day one calls for 4.5 hours of pumping. Days two and three correctly show zero pumping because equipment is unavailable.

## 00:02:24–00:02:35 | 05 / REVIEW THE SCHEDULE

The table exposes each day’s rain, estimated loss, pumping hours and ending storage. Unserved irrigation and unmet essential demand are tracked explicitly.

## 00:02:35–00:02:48 | 06 / CHANGE AN ASSUMPTION

Now reduce starting storage from 9,000 to 8,000 cubic metres and compare again. The same weather and outage assumptions remain in place.

## 00:02:48–00:03:02 | 06 / CHANGE AN ASSUMPTION

Day-one pumping rises from 4.5 to 8.5 hours. The revised plan builds the same outage buffer from a lower starting level.

## 00:03:02–00:03:16 | 07 / KEEP THE EVIDENCE

Export saves the inputs, weather provenance and calculated schedules as JSON. That gives the operator a record to review and share.

## 00:03:16–00:03:27 | 08 / HOW IT WORKS

React and TypeScript present the planner and GIS view. A shared water-balance module compares schedules; the historical weather replay supplies daily inputs.

## 00:03:27–00:03:36 | 08 / HOW IT WORKS

Adaption model-training experiments are a separate research track. The working schedules shown here come from the transparent planner, not a served AI model.

## 00:03:36–00:03:46 | 09 / IMPACT

The intended benefit is earlier preparation and clearer reserve planning. These scenario results are not measured campus savings or evidence of field performance.

## 00:03:46–00:03:54 | 09 / NEXT STEP

Next: approved operating records, calibrated surface-loss estimates and pilot evaluation. Reference evapotranspiration is a proxy, not measured reservoir evaporation.

## 00:03:54–00:04:00 | MAJISHIFT

MajiShift. From environmental observations to an inspectable water-planning decision.