'use client';

import { useEffect, useState } from 'react';
import './landing-motion.css';

/**
 * Intro splash — plays once on every page load.
 *
 * Each logo piece flies in from its own direction, all pieces hold together
 * for ~2 s, then they disperse as the cream backdrop fades into the dark page.
 *
 * Timing is controlled in landing-motion.css (--sr-intro). Keep TOTAL_MS
 * in sync with that value.
 *
 * Images are served from /public/splash/ (cloche.webp, pin.webp, …).
 */

const TOTAL_MS = 4800;

const PIECES = [
  'route',
  'spice',
  'swoosh',
  'cloche',
  'pin',
  'leaf',
  'steam',
] as const;

export default function Splash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVisible(false);
      return;
    }

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const t = setTimeout(() => {
      root.style.overflow = prevOverflow;
      setVisible(false);
    }, TOTAL_MS);

    return () => {
      clearTimeout(t);
      root.style.overflow = prevOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="sr-splash" aria-hidden="true">
      <div className="sr-splash-stage">
        {PIECES.map((name) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={name}
            src={`/splash/${name}.webp`}
            alt=""
            className={`sr-piece sr-piece-${name}`}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
