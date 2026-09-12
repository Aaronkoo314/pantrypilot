import { useEffect, useRef, useState } from 'react';

/** How long the cover holds before it starts fading, in milliseconds. */
const HOLD_MS = 3000;
/** How long the fade itself takes. Must match the CSS transition on .splash. */
const FADE_MS = 450;

/**
 * The cover screen.
 *
 * **There used to be a progress bar here, and removing it was the point.**
 *
 * It carried `role="progressbar"` with `aria-label="Starting"`, and it counted
 * from 0 to 100 over three seconds. Nothing was starting. There was no fetch,
 * no await and no async anywhere in `src/` when it was written, so the bar
 * reported the progress of a timer against itself and announced that to
 * assistive technology as the app loading. It was the clearest example in this
 * product of a number that existed because the shape of the screen suggested
 * one, which Problem Set 2 calls a claim that should not be there at all.
 *
 * It became untenable rather than merely wrong once the product gained a real
 * back end: there is now a genuine loading state on the meal detail screen and
 * a genuine one in the status row, and a screen cannot have two progress
 * indicators where only one of them means anything.
 *
 * What the screen does instead: it holds for three seconds showing the wordmark
 * and says "Tap to skip" from the first frame rather than waiting for a bar to
 * move. The hold is shorter than the patience of anybody who has already
 * decided to open a cooking app, and it asserts nothing.
 *
 * Skippable by tap, click or any key, and skipped outright for anyone who has
 * asked their system to reduce motion.
 */
export default function SplashScreen({ onDone }) {
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
    setLeaving(true);
    window.setTimeout(onDone, FADE_MS);
  }

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      dismiss(true);
      return undefined;
    }

    const hold = window.setTimeout(() => dismiss(), HOLD_MS);

    const skip = () => dismiss();
    window.addEventListener('keydown', skip);

    return () => {
      window.clearTimeout(hold);
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

        <p className="splash-skip">Tap to skip</p>
      </div>
    </div>
  );
}
