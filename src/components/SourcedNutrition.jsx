import { useEffect, useState } from 'react';

/**
 * The one panel on this screen whose numbers are not ours.
 *
 * Everything above it — this meal's protein, carbs, fat and calories — is
 * invented sample data. This panel fetches one real published record for one
 * ingredient through our own /api/nutrition, and says plainly that the rest is
 * still an estimate. It is a provenance feature, not a nutrition feature: the
 * useful part is knowing which number on the screen you can check.
 *
 * The four states below are decided here rather than left to a spinner,
 * because three of the four are situations the reader can act on.
 */
/**
 * USDA's derivation strings are long and repeat themselves across nutrients —
 * "manufacturer supplied; calculated by manufacturer or unknown if analytical
 * or calculated", three times over, is not a sentence anybody reads. The part
 * before the first semicolon is the part that matters, so keep that and group
 * the nutrients that share one rather than repeating it.
 */
function derivationLine(nutrients) {
  const groups = new Map();

  // "carbs" is one nutrient with a plural name, so the verb cannot be chosen
  // from the count alone.
  const LABELS = [
    { key: 'protein', label: 'protein', plural: false },
    { key: 'carbohydrate', label: 'carbs', plural: true },
    { key: 'fat', label: 'fat', plural: false },
  ];

  for (const { key, label, plural } of LABELS) {
    const entry = nutrients[key];
    if (!entry || !entry.derivation) continue;
    const short = entry.derivation.split(';')[0].trim().toLowerCase();
    if (!groups.has(short)) groups.set(short, []);
    groups.get(short).push({ label, plural });
  }

  if (groups.size === 0) return null;

  return [...groups.entries()]
    .map(([derivation, items]) => {
      const labels = items.map((i) => i.label);
      const names =
        labels.length > 1 ? `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}` : labels[0];
      const verb = labels.length > 1 || items[0].plural ? 'are' : 'is';
      return `${names} ${verb} ${derivation}`;
    })
    .join('; ');
}

export default function SourcedNutrition({ ingredients }) {
  const [selected, setSelected] = useState(() => ingredients[0]?.ingredient?.name || '');
  const [status, setStatus] = useState('loading');
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    if (!selected) return undefined;

    // A slow reply must not overwrite a newer one if the reader taps twice.
    let live = true;
    setStatus('loading');
    setPayload(null);

    fetch(`/api/nutrition?ingredient=${encodeURIComponent(selected)}`)
      .then(async (reply) => {
        const body = await reply.json().catch(() => null);
        if (!live) return;

        // Key off the state our own function reports rather than guessing from
        // the HTTP status. A 404 or a 500 here means OUR service is broken and
        // the provider was never contacted — calling that "USDA refused" would
        // blame the wrong party and hide a deployment fault from us.
        const state = body && typeof body.state === 'string' ? body.state : null;

        if (!state) {
          setStatus('service-down');
          return;
        }

        setPayload(body);
        setStatus(
          state === 'ok' || state === 'empty' || state === 'refused' ||
          state === 'unreachable' || state === 'not-configured'
            ? state
            : 'service-down'
        );
      })
      .catch(() => {
        // The browser could not complete the request to our own address at all
        // — offline, or our service is down. Distinct from USDA being
        // unreachable, which our function would have told us about.
        if (live) setStatus('service-down');
      });

    return () => {
      live = false;
    };
  }, [selected]);

  return (
    <section className="sourced-panel" aria-labelledby="sourced-heading">
      <h3 id="sourced-heading" className="group-title">
        One figure you can check
      </h3>

      <div className="sourced-picker" role="group" aria-label="Choose an ingredient to look up">
        {ingredients.map((line) => {
          const name = line.ingredient.name;
          return (
            <button
              key={line.id}
              type="button"
              className={`sourced-chip${name === selected ? ' is-selected' : ''}`}
              aria-pressed={name === selected}
              onClick={() => setSelected(name)}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="sourced-body" aria-live="polite">
        {status === 'loading' && (
          <p className="sourced-state">Checking USDA FoodData Central for {selected}…</p>
        )}

        {status === 'empty' && (
          <p className="sourced-state">
            USDA FoodData Central publishes no record matching “{selected}”, so this ingredient has
            no sourced figure. Everything shown for it above is our own estimate.
          </p>
        )}

        {status === 'refused' && (
          <p className="sourced-state">
            USDA FoodData Central refused the request
            {payload && payload.upstreamStatus ? ` (status ${payload.upstreamStatus})` : ''}. The
            figures above are unchanged and are still our own estimate. This is our problem to fix,
            not yours — the numbers you can see are no less reliable than they were.
          </p>
        )}

        {status === 'unreachable' && (
          <p className="sourced-state">
            We could not reach USDA FoodData Central at all, so there is nothing to check this
            ingredient against right now. Try again in a few minutes. The figures above are our own
            estimate either way.
          </p>
        )}

        {status === 'service-down' && (
          <p className="sourced-state">
            PantryPilot’s own lookup service is not answering, so we never got as far as asking
            USDA. That is a fault at our end. Everything above is our own estimate, as it always
            was.
          </p>
        )}

        {status === 'not-configured' && (
          <p className="sourced-state">
            This copy of PantryPilot has no credential configured for USDA FoodData Central, so it
            cannot look anything up. Every nutrition figure on this screen is our own estimate.
          </p>
        )}

        {status === 'ok' && payload && (
          <>
            <p className="sourced-record">
              <strong>{payload.record.description}</strong> · {payload.basis}
            </p>

            <dl className="stat-row three">
              <div className="stat">
                <dt>Protein</dt>
                <dd>
                  {payload.nutrients.protein ? `${payload.nutrients.protein.value} g` : '—'}
                </dd>
              </div>
              <div className="stat">
                <dt>Carbs</dt>
                <dd>
                  {payload.nutrients.carbohydrate
                    ? `${payload.nutrients.carbohydrate.value} g`
                    : '—'}
                </dd>
              </div>
              <div className="stat">
                <dt>Fat</dt>
                <dd>{payload.nutrients.fat ? `${payload.nutrients.fat.value} g` : '—'}</dd>
              </div>
            </dl>

            {payload.nutrients.energy && (
              <p className="sourced-note">
                {payload.nutrients.energy.value} kcal ({payload.nutrients.energy.basis})
                {payload.energyAlternative &&
                  `. The same record also lists ${payload.energyAlternative.value} kcal by ${payload.energyAlternative.basis}; we show the first.`}
              </p>
            )}

            {derivationLine(payload.nutrients) && (
              <p className="sourced-note">
                How these were obtained — {derivationLine(payload.nutrients)}. USDA publishes which
                of its figures were measured and which were worked out, and the difference is worth
                knowing before you rely on one.
              </p>
            )}

            <p className="sourced-credit">
              Source: U.S. Department of Agriculture, Agricultural Research Service. FoodData
              Central, fdc.nal.usda.gov — record{' '}
              {payload.record.url ? (
                <a href={payload.record.url} target="_blank" rel="noreferrer">
                  {payload.record.fdcId}
                </a>
              ) : (
                payload.record.fdcId
              )}
              {payload.record.dataType ? `, ${payload.record.dataType}` : ''}
              {payload.record.publishedDate ? `, published ${payload.record.publishedDate}` : ''}.
              We ask FoodData Central for its analysed reference records only, not for packaged
              products, because label figures are rounded on the pack and go wrong when scaled.
            </p>
          </>
        )}
      </div>

      <p className="disclaimer">
        This panel is the only sourced nutrition on the screen, and it describes the raw ingredient
        rather than the cooked dish. Every other nutrition figure in PantryPilot, including this
        meal’s own protein, carbs and fat, is our own estimate and is not sourced.
      </p>
    </section>
  );
}
