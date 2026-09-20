import {
  BrainCircuit,
  CloudRain,
  Gauge,
  Radio,
  RefreshCw,
  Thermometer,
  Wind,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConduitReading } from '@/lib/conduit';

type Props = {
  reading: ConduitReading | null;
  state: 'loading' | 'live' | 'fallback';
  error: string | null;
  onRefresh: () => void;
};

const value = (number: number, digits = 1) => number.toFixed(digits);

export function ConduitObservation({
  reading,
  state,
  error,
  onRefresh,
}: Props) {
  const observed = reading ? new Date(reading.observedAt) : null;
  const validDate = observed && !Number.isNaN(observed.valueOf());

  return (
    <section className="intelligence-grid" aria-label="Data and model pipeline">
      <article className="conduit-card">
        <div className="source-card-head">
          <div>
            <p className="eyebrow">CONDUIT@EMPATHY · STATION 61</p>
            <h2>JKUAT observation</h2>
          </div>
          <span className={`source-state ${state}`}>
            <Radio size={13} />
            {state === 'live'
              ? 'Live feed'
              : state === 'loading'
                ? 'Connecting'
                : 'Fallback'}
          </span>
        </div>

        {reading ? (
          <>
            <div className="sensor-values">
              <div>
                <CloudRain />
                <span>Rain today</span>
                <strong>{value(reading.rain.planningMm)} mm</strong>
              </div>
              <div>
                <Thermometer />
                <span>Temperature</span>
                <strong>{value(reading.temperatureC)}°C</strong>
              </div>
              <div>
                <Gauge />
                <span>Humidity</span>
                <strong>{value(reading.humidityPct)}%</strong>
              </div>
              <div>
                <Wind />
                <span>Wind</span>
                <strong>{value(reading.windSpeedMs)} m/s</strong>
              </div>
            </div>
            <p className="source-meta">
              Day 1 uses the mean of the two cumulative rain gauges. Gauge 1:{' '}
              {value(reading.rain.gauge1TotalMm)} mm · Gauge 2:{' '}
              {value(reading.rain.gauge2TotalMm)} mm · Observed{' '}
              {validDate
                ? observed.toLocaleString('en-KE', {
                    timeZone: 'Africa/Nairobi',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : reading.observedAt}
              .
            </p>
          </>
        ) : (
          <p className="source-error">
            {state === 'loading'
              ? 'Reading the latest station observation…'
              : (error ?? 'The live observation is unavailable.')}
          </p>
        )}

        <div className="source-actions">
          <Button type="button" variant="outline" onClick={onRefresh}>
            <RefreshCw size={15} /> Refresh observation
          </Button>
          <a
            href="https://conduit.jhubafrica.com/"
            target="_blank"
            rel="noreferrer"
          >
            Open source platform ↗
          </a>
        </div>
      </article>

      <article className="adaption-card">
        <div className="adaption-icon">
          <BrainCircuit />
        </div>
        <div>
          <p className="eyebrow">ADAPTION ACTION MODEL</p>
          <h2>Observation to operator brief</h2>
          <p>
            Conduit conditions and the checked water balance form the model
            context. The adapted model turns that context into a short,
            localizable explanation; it never changes the calculated volumes.
          </p>
          <div className="model-flow" aria-label="Decision pipeline">
            <span>Conduit data</span>
            <i>→</i>
            <span>Water balance</span>
            <i>→</i>
            <span>Adaption brief</span>
            <i>→</i>
            <span>Operator review</span>
          </div>
          <p className="model-status">
            <strong>Integration state:</strong> Adaptive Data completed 160 rows.
            The first 30B AutoScientist run trained for three iterations and
            scored 53.71% against an 80% target. The enhanced-label experiment
            also completed three iterations and scored 55.67%. A corrected 4B
            experiment now fuses every scenario into its prompt and uses much
            less augmentation. Model serving and held-out validation are not
            connected yet.
          </p>
        </div>
      </article>
    </section>
  );
}
