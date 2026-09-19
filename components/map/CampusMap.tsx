'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Building2,
  CloudRain,
  Droplets,
  Factory,
  LocateFixed,
  MapPinned,
  Sprout,
} from 'lucide-react';
import type { Day } from '@/lib/planner';
import { Button } from '@/components/ui/button';

type CampusMapProps = {
  baseline: Day[];
  capacity: number;
  plan: Day[];
  reserve: number;
  stationCoordinates: [number, number] | null;
};

const JKUAT_DAM: [number, number] = [37.0186, -1.0926];
const JKUAT_CAMPUS: [number, number] = [37.01136, -1.09153];
const CONDUIT_STATION: [number, number] = [37.014528, -1.099736];
const number = (value: number) => Math.round(value).toLocaleString('en-KE');

export function CampusMap({
  baseline,
  capacity,
  plan,
  reserve,
  stationCoordinates,
}: CampusMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('maplibre-gl').Map | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [comparison, setComparison] = useState<'plan' | 'baseline'>('plan');
  const [is3d, setIs3d] = useState(true);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'fallback'>(
    'loading',
  );
  const stationLongitude = stationCoordinates?.[0] ?? CONDUIT_STATION[0];
  const stationLatitude = stationCoordinates?.[1] ?? CONDUIT_STATION[1];

  const row = comparison === 'plan' ? plan[selectedDay] : baseline[selectedDay];
  const fill = Math.max(0, Math.min(100, (row.end / capacity) * 100));
  const reserveFill = Math.max(0, Math.min(100, (reserve / capacity) * 100));
  const belowReserve = row.end < reserve;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let disposed = false;

    void import('maplibre-gl')
      .then((maplibre) => {
        if (disposed || !containerRef.current) return;
        const map = new maplibre.Map({
          container: containerRef.current,
          style: 'https://tiles.openfreemap.org/styles/bright',
          center: [37.0152, -1.092],
          zoom: 15.2,
          pitch: 48,
          bearing: -18,
          maxBounds: [
            [36.995, -1.11],
            [37.035, -1.073],
          ],
          attributionControl: false,
          canvasContextAttributes: { antialias: true },
        });
        mapRef.current = map;
        map.addControl(
          new maplibre.NavigationControl({ visualizePitch: true }),
          'bottom-right',
        );
        map.addControl(
          new maplibre.AttributionControl({ compact: true }),
          'bottom-left',
        );

        map.once('style.load', () => {
          if (disposed) return;
          const layers = map.getStyle().layers ?? [];
          const labelLayer = layers.find(
            (layer) =>
              layer.type === 'symbol' &&
              Boolean(layer.layout && layer.layout['text-field']),
          )?.id;

          map.addSource('majishift-openfreemap', {
            type: 'vector',
            url: 'https://tiles.openfreemap.org/planet',
          });
          map.addLayer(
            {
              id: 'majishift-3d-buildings',
              source: 'majishift-openfreemap',
              'source-layer': 'building',
              type: 'fill-extrusion',
              minzoom: 15,
              filter: ['!=', ['get', 'hide_3d'], true],
              paint: {
                'fill-extrusion-color': '#aec0c7',
                'fill-extrusion-opacity': 0.72,
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  16,
                  ['coalesce', ['get', 'render_height'], 8],
                ],
                'fill-extrusion-base': [
                  'coalesce',
                  ['get', 'render_min_height'],
                  0,
                ],
              },
            },
            labelLayer,
          );

          map.addSource('majishift-assets', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: { id: 'dam', label: 'JKUAT Dam' },
                  geometry: { type: 'Point', coordinates: JKUAT_DAM },
                },
                {
                  type: 'Feature',
                  properties: { id: 'campus', label: 'JKUAT campus reference' },
                  geometry: { type: 'Point', coordinates: JKUAT_CAMPUS },
                },
                {
                  type: 'Feature',
                  properties: {
                    id: 'conduit',
                    label: 'Conduit station 61',
                  },
                  geometry: {
                    type: 'Point',
                    coordinates: [stationLongitude, stationLatitude],
                  },
                },
              ],
            },
          });
          map.addLayer({
            id: 'majishift-asset-halo',
            type: 'circle',
            source: 'majishift-assets',
            paint: {
              'circle-radius': ['case', ['==', ['get', 'id'], 'dam'], 18, 11],
              'circle-color': [
                'match',
                ['get', 'id'],
                'dam',
                '#087f84',
                'conduit',
                '#d58a1f',
                '#173342',
              ],
              'circle-opacity': 0.18,
              'circle-stroke-width': 2,
              'circle-stroke-color': [
                'match',
                ['get', 'id'],
                'dam',
                '#087f84',
                'conduit',
                '#d58a1f',
                '#173342',
              ],
            },
          });
          map.addLayer({
            id: 'majishift-asset-core',
            type: 'circle',
            source: 'majishift-assets',
            paint: {
              'circle-radius': ['case', ['==', ['get', 'id'], 'dam'], 7, 5],
              'circle-color': [
                'match',
                ['get', 'id'],
                'dam',
                '#087f84',
                'conduit',
                '#d58a1f',
                '#173342',
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            },
          });
          map.addLayer({
            id: 'majishift-asset-labels',
            type: 'symbol',
            source: 'majishift-assets',
            layout: {
              'text-field': ['get', 'label'],
              'text-size': 13,
              'text-anchor': 'left',
              'text-offset': [1.1, 0],
              'text-allow-overlap': true,
            },
            paint: {
              'text-color': '#173342',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
            },
          });
          const damMarker = document.createElement('div');
          damMarker.className = 'atlas-map-marker dam';
          damMarker.innerHTML = '<span></span><strong>JKUAT Dam</strong>';
          new maplibre.Marker({ element: damMarker, anchor: 'bottom' })
            .setLngLat(JKUAT_DAM)
            .addTo(map);

          const campusMarker = document.createElement('div');
          campusMarker.className = 'atlas-map-marker campus';
          campusMarker.innerHTML =
            '<span></span><strong>Campus reference</strong>';
          new maplibre.Marker({ element: campusMarker, anchor: 'bottom' })
            .setLngLat(JKUAT_CAMPUS)
            .addTo(map);

          const conduitMarker = document.createElement('div');
          conduitMarker.className = 'atlas-map-marker conduit';
          conduitMarker.innerHTML =
            '<span></span><strong>Conduit station 61</strong>';
          new maplibre.Marker({ element: conduitMarker, anchor: 'bottom' })
            .setLngLat([stationLongitude, stationLatitude])
            .addTo(map);

          map.on('click', 'majishift-asset-core', (event) => {
            const feature = event.features?.[0];
            if (!feature || feature.geometry.type !== 'Point') return;
            const coordinates = feature.geometry.coordinates as [
              number,
              number,
            ];
            new maplibre.Popup({ offset: 14 })
              .setLngLat(coordinates)
              .setText(String(feature.properties?.label ?? 'Campus asset'))
              .addTo(map);
          });
          map.on('mouseenter', 'majishift-asset-core', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'majishift-asset-core', () => {
            map.getCanvas().style.cursor = '';
          });
          setMapStatus('ready');
        });
        map.getCanvas().addEventListener('webglcontextlost', () => {
          setMapStatus('fallback');
        });
      })
      .catch(() => setMapStatus('fallback'));

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [stationLatitude, stationLongitude]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || mapStatus !== 'ready') return;
    map.easeTo({
      pitch: is3d ? 48 : 0,
      bearing: is3d ? -18 : 0,
      duration: 600,
    });
    if (map.getLayer('majishift-3d-buildings')) {
      map.setLayoutProperty(
        'majishift-3d-buildings',
        'visibility',
        is3d ? 'visible' : 'none',
      );
    }
  }, [is3d, mapStatus]);

  function recenter() {
    mapRef.current?.easeTo({
      center: JKUAT_DAM,
      zoom: 16,
      pitch: is3d ? 48 : 0,
      bearing: is3d ? -18 : 0,
      duration: 700,
    });
  }

  return (
    <section className="campus-atlas" aria-labelledby="campus-atlas-title">
      <div className="atlas-heading">
        <div>
          <p className="eyebrow">CAMPUS WATER ATLAS</p>
          <h2 id="campus-atlas-title">See the plan in place.</h2>
          <p>
            The dam and campus reference come from OpenStreetMap. Station 61 is
            placed from the Conduit observation feed. Supply connections still
            need operator confirmation.
          </p>
        </div>
        <div className="atlas-view-controls" aria-label="Map view">
          <Button
            type="button"
            variant="outline"
            aria-pressed={is3d}
            onClick={() => setIs3d((value) => !value)}
          >
            <Box size={16} /> {is3d ? '3D context' : '2D context'}
          </Button>
          <Button type="button" variant="outline" onClick={recenter}>
            <LocateFixed size={16} /> Find dam
          </Button>
        </div>
      </div>

      <div className="atlas-grid">
        <div className="map-frame">
          <div ref={containerRef} className="campus-map" aria-hidden="true" />
          {mapStatus === 'loading' && (
            <div className="map-state">Loading campus context…</div>
          )}
          {mapStatus === 'fallback' && (
            <output className="map-fallback">
              <MapPinned size={28} />
              <strong>Map view unavailable</strong>
              <span>
                The scenario details and asset list remain available. JKUAT Dam:
                1.0926° S, 37.0186° E.
              </span>
            </output>
          )}
          <div className="map-disclosure">
            <span>Open-map dam + Conduit station</span>
            <strong>Topology pending operator review</strong>
          </div>
        </div>

        <aside className="atlas-panel">
          <div className="asset-title">
            <span className="asset-icon">
              <Droplets size={19} />
            </span>
            <div>
              <span>Selected asset</span>
              <strong>JKUAT Dam</strong>
            </div>
          </div>

          <div className="comparison-switch" aria-label="Operating plan">
            <button
              type="button"
              className={comparison === 'plan' ? 'active' : ''}
              aria-pressed={comparison === 'plan'}
              onClick={() => setComparison('plan')}
            >
              Proposed
            </button>
            <button
              type="button"
              className={comparison === 'baseline' ? 'active' : ''}
              aria-pressed={comparison === 'baseline'}
              onClick={() => setComparison('baseline')}
            >
              Fixed schedule
            </button>
          </div>

          <div className="atlas-storage">
            <div className="atlas-value-row">
              <span>End of day {row.day}</span>
              <strong>{number(row.end)} m³</strong>
            </div>
            <div className="storage-track" aria-hidden="true">
              <i className="reserve-mark" style={{ left: `${reserveFill}%` }} />
              <span
                className={belowReserve ? 'below' : ''}
                style={{ width: `${fill}%` }}
              />
            </div>
            <div className="storage-scale">
              <span>0</span>
              <span>Reserve {number(reserve)}</span>
              <span>{number(capacity)} m³</span>
            </div>
          </div>

          <div className="atlas-stats" aria-live="polite">
            <div>
              <CloudRain size={17} />
              <span>Rain</span>
              <strong>{row.rainMm.toFixed(1)} mm</strong>
            </div>
            <div>
              <Droplets size={17} />
              <span>Pumped</span>
              <strong>{number(row.pumped)} m³</strong>
            </div>
            <div>
              <Building2 size={17} />
              <span>Essential served</span>
              <strong>{number(row.essential)} m³</strong>
            </div>
          </div>

          <div className={`atlas-decision ${belowReserve ? 'risk' : ''}`}>
            <strong>
              {belowReserve ? 'Reserve crossed' : 'Reserve maintained'}
            </strong>
            <span>{row.reason}</span>
          </div>

          <div className="assumed-network">
            <div className="assumed-network-head">
              <span>Assumed pilot network</span>
              <strong>Current routing unverified</strong>
            </div>
            <div className="network-flow">
              <span>
                <Droplets size={15} /> Ndarugu source / intake
              </span>
              <i>↓</i>
              <span>
                <Droplets size={15} /> JKUAT Dam
              </span>
              <i>↓</i>
              <span>
                <Factory size={15} /> Treatment + essential use
              </span>
              <span className="network-branch">
                <Sprout size={15} /> Irrigation branch
              </span>
            </div>
            <p>
              Schematic from historical context; asset links are not mapped pipe
              routes.
            </p>
          </div>

          <div className="asset-evidence">
            <span>
              <i className="verified" /> Dam point: OpenStreetMap way 330895323
            </span>
            <span>
              <i /> Campus reference: OpenStreetMap
            </span>
            <span>
              <i className="verified" /> Weather station: Conduit station 61
            </span>
            <span>
              <i className="pending" /> Current pipes, treatment and demand
              areas: assumed
            </span>
          </div>
        </aside>
      </div>

      <div className="atlas-timeline" aria-label="Select scenario day">
        {plan.map((day, index) => (
          <button
            key={day.day}
            type="button"
            className={selectedDay === index ? 'active' : ''}
            aria-pressed={selectedDay === index}
            onClick={() => setSelectedDay(index)}
          >
            <span>Day {day.day}</span>
            <strong>
              {day.outage
                ? 'Pump unavailable'
                : `${day.hours.toFixed(1)} h pump`}
            </strong>
          </button>
        ))}
      </div>

      <p className="atlas-footnote">
        Map © OpenStreetMap contributors · Building context © OpenFreeMap. Map
        geometry does not establish storage capacity, pipe routes or service
        outcomes.
      </p>
    </section>
  );
}
