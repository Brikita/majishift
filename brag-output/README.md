# MajiShift demo package

## Deliverables
- `MajiShift-demo.mp4`: four-minute silent video, 1920×1080, burned-in captions.
- `MajiShift-captions.srt`: matching closed-caption text. When uploading the burned-in version, avoid showing both caption layers simultaneously.
- `narration-script.md`: optional timecoded voiceover script, matching the captions.
- `composition/index.html`: editable Hyperframes composition.
- `build-video.mjs`: editable scene content and composition generator.
- `brag-plan.md` and `composition-brief.md`: storyboard and creative contract.
- `evidence/`: actual exported scenario, numerical checks, browser QA and final media verification.

## Team and finishing steps
The 8–22-second opening names Brian Mwangi and Patrick Leon and lists their roles. This slot is reserved for real team clips to be added later. Names are not a substitute for the competition's requirement that all members appear. The silent cut follows the requested production brief; confirm silent-video acceptance or add narration before submitting. Official rules: https://hack-the-weather.devpost.com/rules

Nothing has been published or submitted.

## Rebuild
From the project root, install isolated production dependencies with `npm ci --prefix brag-output/tools`, then run `node brag-output/build-video.mjs`.

The composition uses local assets, GSAP, and Hyperframes 0.8.56. Add the directories containing the installed `ffmpeg-static/ffmpeg.exe` and `ffprobe-static/bin/win32/x64/ffprobe.exe` to PATH for the current shell. Run:

```
node brag-output/tools/node_modules/hyperframes/bin/hyperframes.mjs render brag-output/composition --output brag-output/MajiShift-demo.mp4 --fps 24 --quality high --workers 1 --low-memory-mode --video-frame-format png
node brag-output/verify-package.mjs
```

`capture.mjs` and `record-edit.mjs` reproduce the real application captures with the app running on localhost:3000. Update their Chrome executable path for another computer. Raw inputs and exported results are kept as evidence, not relabelled as measured campus operations.

## QA correction
Production QA found that the earlier precomputed Hargreaves values omitted the 0.408 conversion of extraterrestrial radiation from MJ/m²/day to equivalent mm/day. The app now calculates this explicitly in `lib/reference-et.ts`, with a regression test. FAO specifies equivalent-depth radiation in equation 52: https://www.fao.org/4/x0490e/x0490e07.htm

The corrected seven-day estimate is 32.45 mm. In the default synthetic 8,000 m² surface-area scenario, that adds 35.6 m³ estimated loss compared with 4 mm/day. Pumping remains 7,875 m³ at these defaults. The video does not repeat the earlier 413 m³ / 8,250 m³ claims.
