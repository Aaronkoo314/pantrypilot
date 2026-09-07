import { useEffect, useRef, useState } from 'react';

/** How long the cover holds before it starts fading, in milliseconds. */
const HOLD_MS = 3000;
/** How long the fade itself takes. Must match the CSS transition on .splash. */
const FADE_MS = 450;
/** How often the bar is redrawn. 60 steps over the hold reads as smooth. */
const TICK_MS = 50;

/**
 * The cover screen.
 *
 * The three-second hold must not read as a frozen app, so the bar under the
 * wordmark is a real progress indicator.
 *
 * It is driven from state rather than from a CSS animation, and that is a
 * deliberate choice made after watching the CSS version fail. A keyframe
 * animation reported itself as `running` with the right duration while its
 * clock sat at zero, which left the bar at scaleX(0) - invisible and
 * motionless, which is precisely the impression this screen exists to prevent.
 * Driving it from the same timer that dismisses the cover means the two can
 * never disagree: if the environment throttles timers the bar jumps forward
 * instead of sitting still, and it always reaches full exactly as the cover
 * begins to leave.
 *
 * Skippable by tap, click or any key, and skipped outright for anyone who has
 * asked their system to reduce motion.
 */
export default function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);

  // One guarded exit, however it is triggered.
  function dismiss(immediate = false) {
    if (finished.current) return;
    finished.current = true;
    if (immediate) {
      onDone();
      return;
    }
    setProgress(1);
    setLeaving(true);
    window.setTimeout(onDone, FADE_MS);
  }

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      dismiss(true);
      return undefined;
    }

    const startedAt = performance.now();
    const tick = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      if (elapsed >= HOLD_MS) {
        window.clearInterval(tick);
        dismiss();
        return;
      }
      setProgress(elapsed / HOLD_MS);
    }, TICK_MS);

    const skip = () => dismiss();
    window.addEventListener('keydown', skip);

    return () => {
      window.clearInterval(tick);
      window.removeEventListener('keydown', skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`splash ${leaving ? 'splash-leaving' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Skip the intro"
      onClick={() => dismiss()}
    >
      <div className="splash-inner">
        <p className="splash-brand">
          <span aria-hidden="true">&#127813;</span> PantryPilot
        </p>
        <p className="splash-line">Cook what you already have</p>

        <div
          className="splash-track"
          role="progressbar"
          aria-label="Starting"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div className="splash-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>

        <p className={`splash-skip ${progress > 0.2 ? 'splash-skip-shown' : ''}`}>Tap to skip</p>
      </div>
    </div>
  );
}
