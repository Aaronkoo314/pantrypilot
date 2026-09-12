import { useEffect, useState } from 'react';

/**
 * A standing statement of whether the live lookup is working, on every screen.
 *
 * It reads our own /api/health, which is the endpoint that exists so that
 * somebody who is not me can answer two questions without guessing: did the
 * credential reach the running site, and did the provider answer us.
 *
 * Two rules govern what it may say.
 *
 * First, it speaks to a home cook, not to an operator. "keyConfigured: false"
 * is the right thing for /api/health to return and the wrong thing to print on
 * a screen somebody opened to decide what to cook, so each state is translated
 * into what it means for them: whether the sourced figure on a meal will be
 * there tonight.
 *
 * Second, it reveals nothing about the credential beyond whether one is
 * configured — no length, no prefix, no hash. That is already public at
 * /api/health by design, so surfacing it here adds no disclosure; anything
 * more would.
 *
 * It also has to survive its own failure. If /api/health does not answer, this
 * component says so rather than rendering nothing, because a status line that
 * disappears when things break is worse than no status line at all.
 */

const POLL_MS = 60000;

function readState(body) {
  if (!body || typeof body.keyConfigured !== 'boolean') return 'unknown';
  if (!body.keyConfigured) return 'not-configured';
  if (body.upstreamStatus === 'unreachable') return 'unreachable';
  if (typeof body.upstreamStatus === 'number' && body.upstreamStatus >= 400) return 'refused';
  if (body.upstreamStatus === 200) return 'live';
  return 'unknown';
}

const COPY = {
  checking: { tone: 'idle', label: 'Checking the live nutrition lookup…' },
  live: {
    tone: 'ok',
    label: 'Live nutrition lookup is working',
    detail: 'One figure on each meal comes from USDA FoodData Central.',
  },
  refused: {
    tone: 'warn',
    label: 'Live nutrition lookup is being refused',
    detail: 'USDA FoodData Central is turning our requests away. Every figure is our own estimate.',
  },
  unreachable: {
    tone: 'warn',
    label: 'Live nutrition lookup cannot be reached',
    detail: 'We cannot get through to USDA FoodData Central. Every figure is our own estimate.',
  },
  'not-configured': {
    tone: 'warn',
    label: 'Live nutrition lookup is switched off',
    detail: 'This copy has no credential configured, so nothing can be looked up.',
  },
  down: {
    tone: 'warn',
    label: 'Our own lookup service is not answering',
    detail: 'That is a fault at our end. Every figure is our own estimate.',
  },
  unknown: {
    tone: 'warn',
    label: 'Live nutrition lookup is in an unknown state',
    detail: 'The health check answered in a shape we did not expect.',
  },
};

export default function ServiceStatus() {
  const [state, setState] = useState('checking');
  const [checkedAt, setCheckedAt] = useState(null);

  useEffect(() => {
    let live = true;

    async function check() {
      try {
        const reply = await fetch('/api/health');
        const body = await reply.json().catch(() => null);
        if (!live) return;
        // A non-2xx from our own health endpoint means our service is the
        // problem, whatever the body claims.
        setState(reply.ok ? readState(body) : 'down');
        setCheckedAt(body && body.checkedAt ? body.checkedAt : null);
      } catch (err) {
        if (live) {
          setState('down');
          setCheckedAt(null);
        }
      }
    }

    check();
    const timer = setInterval(check, POLL_MS);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, []);

  const copy = COPY[state] || COPY.unknown;

  return (
    <div className={`service-status tone-${copy.tone}`} aria-live="polite">
      <span className="service-dot" aria-hidden="true" />
      <span className="service-text">
        <strong>{copy.label}</strong>
        {copy.detail ? <span className="service-detail"> {copy.detail}</span> : null}
      </span>
      <a className="service-link" href="/api/health" target="_blank" rel="noreferrer">
        Check it yourself
        {checkedAt ? <span className="visually-hidden"> — last checked {checkedAt}</span> : null}
      </a>
    </div>
  );
}
