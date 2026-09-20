# Official Conduit data

These three CSV files were downloaded from the Conduit Data CSV link on the official Hack The Weather Devpost resources page. That short link resolves to the public Google Drive folder HackTheWeather2026-Data.

| Local file | Original Drive file ID | SHA-256 |
|---|---|---|
| conduit-official-1.csv | 1uQLj3WHvGeX6WRU3EL0ZcLTDVI_Gl23P | A47659033C861155500DF0CF1E335E387D68EC7EA69B28FD94E73A8CF68FEC52 |
| conduit-official-2.csv | 192QZkcS3F3B1OnfxvARbvLs-ZGR3abwE | 1260FB7376977672480DF0CFD119CC9F222E95CD0133E3ED3D8912079CBE1BCB |
| conduit-official-3.csv | 1XQo9JstB_RzGi40MByI88TLQNQHqXV4Q | 1082CDBE145167A63A49FF74DD037662D4DD94E9E4D78ED8DA19455744200E30 |

The GeoCSV metadata identifies sensor 61 at 37.014528 E, -1.099736 N and 1,523 m elevation, attributes the data to 3d-fewsnet.icdp.ucar.edu, and cites DOI 10.5065/d6v1236q.

## Decision transformation

The app uses the consecutive 29 August-4 September 2026 window.

1. Deduplicate observations by timestamp across overlapping files.
2. Group approximately one-minute observations by UTC date.
3. Use the mean of each day's final Rain Gauge 1 Total Today and Rain Gauge 2 Total Today as measured daily rain. Both gauges report 0 mm throughout this replay.
4. Calculate daily minimum, maximum and mean from SHT Temperature.
5. Calculate daily extraterrestrial radiation from station latitude and day of year.
6. Calculate daily reference evapotranspiration with the FAO-56 Hargreaves equation.
7. Feed measured rain and daily reference evapotranspiration into the water balance, then compare with the same scenario using the fixed 4 mm/day evaporation assumption.

lib/conduit-history.ts contains the reviewed daily aggregate used by the browser. It is deliberately small and inspectable. Reference evapotranspiration is an estimate of climatic evaporative demand; it is not measured reservoir evaporation. A field deployment must calibrate an open-water coefficient, verify the reservoir surface area and validate against operator records.
