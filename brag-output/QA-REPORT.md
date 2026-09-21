# MajiShift demo QA

## Verified output
- Duration: 240 seconds; 1920 × 1080; H.264, 24/1 fps.
- Exactly 5,760 frames; no audio stream, as requested.
- Full video decoded without errors.
- 22 timed caption scenes; subtitle and narration wording match the video source.
- Each caption has at least 0.3 seconds per word.
- Source CSV sample counts, temperature minima/maxima/means and rainfall match all seven replay days.
- The actual downloaded JSON matches the independently calculated edited scenario.
- Browser workflow: zero page errors; starting storage changed to 8,000 m³, compare executed, export downloaded.
- Application tests: all ten passed, including water balance across 200 stress scenarios and the radiation-unit regression. TypeScript and lint passed.
- Composition lint: zero errors and warnings. Runtime validation: no errors or contrast failures. All scene midpoints were inspected for layout; the intentionally cropped input was subsequently reframed and passed its final inspection.

## Numerical claims
Default scenario: proposed reserve breaches 0/7; fixed schedule breaches 5/7. Proposed pumping 7,875 m³ versus fixed 5,000 m³. Lowest proposed reserve rounds to 5,007 m³. Starting storage edit changes day-one pumping from 4.5 to 8.5 hours. These are synthetic operating scenarios, not field outcomes.

The corrected Conduit weather estimate is 32.45 mm reference evapotranspiration, giving 259.6 m³ estimated surface loss at 8,000 m², versus 224.0 m³ under the fixed assumption. The 35.6 m³ difference changes storage, while the default pumping schedule and total remain unchanged.

## Submission finishing steps
Add real appearances of Brian Mwangi and Patrick Leon in the reserved 8–22-second opening slot. Confirm silent-video acceptance with organisers or add optional narration. This delivery is the requested silent production cut, not a claim that those finishing requirements have been satisfied. Nothing was published or submitted.

## Integrity
MP4 SHA-256: efd0ac5e8b1b5192d2de5a624429adfd3337825282a9c213f1e1e7cc6a1afb4f

## Visual review
Reviewed all 22 scene midpoints extracted from the encoded MP4 and five additional frames through the actual storage-edit sequence. Captions, team credits and focused numerical results are readable. The complete sequence is present, including the actual changed input, Compare action and revised result. No missing visuals or clipped required text were found.
