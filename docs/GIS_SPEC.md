# GIS and 3D campus visualization specification

Status: the responsive atlas shell is implemented. It uses MapLibre/OpenFreeMap context, the OpenStreetMap JKUAT Dam point, a JKUAT campus reference point, 2D/3D controls, proposed/fixed comparison and a seven-day selector linked to the planner. Current JKUAT pipe, treatment, tank, demand-area and surveyed reservoir geometry have not been verified. GIS means geographic information system: features carry locations and attributes. A 3D view is one way of presenting that information; it does not by itself make a hydraulic model or a validated digital twin.

## Recommended scope

The implementation uses MapLibre GL JS 6.10 with OpenFreeMap's bright style and vector building layer. It defaults to pitched context and supports a flat 2D toggle. Do not add terrain until a suitable elevation source is verified and useful. CesiumJS remains an alternative only if a globe, streamed 3D Tiles or richer terrain becomes central; do not install two renderers for this deadline.

MapLibre's official examples demonstrate building extrusion and terrain/custom model integration. Cesium's quickstart demonstrates terrain and OSM buildings via ion. Those capabilities do not guarantee JKUAT-specific footprints, heights, terrain accuracy or asset identity. Check campus coverage before selecting a provider.

## The map must answer a decision question

“Where is the water, which verified connections depend on it, and how does this scenario change the plan over time?”

1. Select the reservoir: show source, latest valid reading, usable storage basis, confidence and related compartments.
2. Select a scenario/time: the same planner result updates chart, map card and daily table.
3. Toggle baseline/proposal: highlight affected verified supply links and irrigation service amounts. Show exact metrics in the side panel.
4. Select an asset/plot: show its evidence and permitted action, with unknowns visible.
5. Export the decision receipt with selected time/asset context and data attribution references.

Do not colour a hostel as “out of water” from a single aggregate reservoir balance. That requires a model of its actual supply path, downstream storage and allocation. Without that evidence, label “connected demand area; service outcome not modelled.”

## Layers and evidence requirements

| Layer | Source to seek | Required attributes | Fallback |
|---|---|---|---|
| Campus context | Licensed basemap / authorized campus GIS | Source, attribution, date | Context map only; boundary unknown |
| Reservoir | Operator-verified polygon/point | Stable assetId, identity verification, source, geometry confidence | Point marker; no guessed shoreline |
| Intake / pumps / treatment / tanks | Authorized coordinates and sketch | assetId, type, compartment linkage, evidence status | Schematic node with no asserted coordinates |
| Connections | Operator-confirmed topology; actual route if available | fromAssetId/toAssetId, link kind, routeAccuracy | Dashed schematic connection; not a buried pipe alignment |
| Demand / irrigation areas | Shareable plots/service zones | demandId, area basis, allocation-model status | Labelled connection without household/building service prediction |
| Conduit station | Data-owner coordinates | stationId, channel/time/quality metadata | Unknown location label, no pin at guessed site |
| Buildings | Licensed footprint/height dataset | Source and height origin | Flat footprints, or explicitly illustrative extrusion |
| Terrain | Licensed DEM with resolution/datum | Provider, date, resolution, datum | Flat map; never use visual terrain as bathymetry |

Use GeoJSON longitude, latitude in WGS84 for exchange. Store original CRS with source metadata and transform correctly if supplied survey data uses another CRS. Keep original geometry separately. Do not calculate square metres by multiplying degree differences; use an appropriate projected/geodesic method and record it. Surface area changes with water level; a static polygon is only an approximation where accepted.

## Water rendering: three evidence levels

- Level 1, default: reservoir outline/marker plus a numerical storage bar and timeline. A colour encodes modelled reserve state, with text and units.
- Level 2: illustrative water-volume extrusion. Explicitly label “illustrative fill, not measured water elevation.” No inundation footprint or depth claim.
- Level 3: true surface elevation only with a validated level-volume curve, surveyed geometry/bathymetry and consistent vertical datum. Do not derive it from a percentage of capacity or ordinary terrain tiles. This is optional and outside the critical path.

A dry/rainy scene effect must never stand in for a measurement. Prefer selected-day rainfall labels and a source card over dramatic weather animation.

## Implementation contract

Current module: `components/map/CampusMap.tsx`; the existing planner remains independent of the renderer. When verified assets arrive, move source metadata and runtime validation into `lib/gis/types.ts` and `lib/gis/validate.ts`; use `data/public/site-assets.geojson` only for assets authorized for public delivery. A separate fallback component is optional because the current component already keeps numerical details and displays a no-map message when WebGL initialization fails.

`MapAssetProperties`: assetId, name, kind, sourceId, evidenceStatus, geometryAccuracy (surveyed/operator_located/approximate/schematic), disclosureScope, verifiedAt, heightOrigin when relevant. Geometry may be null for a schematic-only asset. No actual JKUAT coordinates are supplied in this spec.

Component inputs: selectedAssetId, selectedInterval, comparisonMode, approved assets and DecisionReceipt. Events: selectAsset, selectInterval. No separate demand calculation inside map code. All links use stable IDs. Treat external feature properties as untrusted text.

Load the renderer client-side; clean up the map and listeners on unmount; avoid recreating the instance on every slider movement. Update sources/layers from state. Use responsive sizing, constrained campus bounds only after verification, visible attribution, legend, reset camera and 2D/3D toggle. Preserve keyboard-accessible asset list and table.

Tiles/tokens: select a provider after confirming coverage, terms, quotas and event demo use. MapLibre is a renderer, not a blanket licence for any tile service. Restrict any deliberately public browser token to permitted domains/capabilities; never expose a server API secret. Honor OSM and provider attribution. Do not assume permission to bulk-download or cache tiles for offline use.

Fallback: when WebGL/tiles/network fail, retain the asset list and schematic diagram with the same selected interval and numerical result. Offline demonstration may use approved bundled GeoJSON and a schematic; only cache basemap assets when provider terms permit it.

## GIS-specific acceptance

Operator identifies the correct reservoir; no swapped coordinates; documented approximate geometry; raw and treated nodes distinguishable; station relevance disclosed; matching map/chart/table values; unmodelled service effects labelled; all controls usable without colour alone; rendering failure does not disable planning; attribution visible; restricted location details absent from public payloads.

Performance targets to measure on the intended demo laptop: usable planner while map loads; slider update feels immediate; no duplicate map instances/listener leak after repeated scenario changes. Record actual browser/device observations rather than claiming an unmeasured frame rate.

## Demo storyboard

Campus context -> select verified pond -> follow confirmed supply chain -> show impending interruption -> advance timeline under current operating method -> switch to proposed plan -> expose additional pumping and any irrigation deferral -> inspect confidence/missing data -> export receipt. If only the irrigation branch survives, show plots and their watering windows instead of campus essential supply.

The map improves explanation when it exposes a real connection or consequence. It cannot compensate for missing Conduit use, an incorrect water balance or an unverified problem.

## Official technical sources reviewed 11 September 2026

- [MapLibre building extrusion example](https://maplibre.org/maplibre-gl-js/docs/examples/display-buildings-in-3d/)
- [MapLibre examples, including terrain](https://maplibre.org/maplibre-gl-js/docs/examples/)
- [CesiumJS quickstart](https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/)
- [OpenStreetMap attribution and licence](https://www.openstreetmap.org/copyright)

Stack choice and cut lines above are engineering recommendations for this project, not claims made by these sources.
