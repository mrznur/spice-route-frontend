'use client';

import { useEffect, useRef, useState } from 'react';
import './landing-motion.css';

/**
 * HeroLogo: the logo sweeps in left-to-right, the flame glows, steam wisps
 * rise, and the map pin drops in with a bounce + ripple. No card wrapper —
 * mix-blend-mode: screen knocks out the white PNG background on the dark page.
 */
export function HeroLogo() {
  return (
    <div className="sr-logo-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/spice-route-logo.webp"
        alt="Spice Route"
        className="sr-logo-img"
        width={1375}
        height={702}
      />

      {/* Radial glow that pulses behind the flame */}
      <div className="sr-flame-glow" aria-hidden="true" />

      {/* Steam wisps rising above the cloche */}
      <svg className="sr-steam" viewBox="0 0 80 100" aria-hidden="true" preserveAspectRatio="none">
        <path className="sr-wisp w1" d="M40 95 C 24 76, 56 60, 40 42 C 30 28, 46 14, 40 4" />
        <path className="sr-wisp w2" d="M22 90 C 10 74, 34 60, 22 44 C 15 34, 26 20, 22 10" />
        <path className="sr-wisp w3" d="M58 90 C 48 76, 68 62, 58 46 C 50 36, 62 22, 58 12" />
      </svg>

      {/* Pin drop + ripple — positioned over the logo's map pin */}
      <div className="sr-pin-wrap" aria-hidden="true">
        <span className="sr-ripple">
          <i /><i /><i />
        </span>
      </div>
    </div>
  );
}

/**
 * NavLogo: the same animated logo scaled to fit the navbar.
 * Uses a plain img with explicit dimensions — no aspect-ratio wrapper
 * that would fight the fixed nav height.
 */
export function NavLogo() {
  return (
    <div style={{ position: 'relative', width: 110, height: 56, flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/spice-route-logo.webp"
        alt="Spice Route"
        className="sr-logo-img"
        width={1375}
        height={702}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <div className="sr-flame-glow" aria-hidden="true" />
      <svg className="sr-steam" viewBox="0 0 80 100" aria-hidden="true" preserveAspectRatio="none">
        <path className="sr-wisp w1" d="M40 95 C 24 76, 56 60, 40 42 C 30 28, 46 14, 40 4" />
        <path className="sr-wisp w2" d="M22 90 C 10 74, 34 60, 22 44 C 15 34, 26 20, 22 10" />
        <path className="sr-wisp w3" d="M58 90 C 48 76, 68 62, 58 46 C 50 36, 62 22, 58 12" />
      </svg>
      <div className="sr-pin-wrap" aria-hidden="true">
        <span className="sr-ripple"><i /><i /><i /></span>
      </div>
    </div>
  );
}

/**
 * ScrollRoute: a thin route line fixed to the left edge. It draws itself as
 * you scroll and the pin travels along it.
 * Visible from the xl breakpoint up so it never crowds mobile layouts.
 */
export function ScrollRoute() {
  const pathRef = useRef<SVGPathElement>(null);
  const pinRef = useRef<SVGGElement>(null);
  const [size, setSize] = useState({ h: 800 });

  useEffect(() => {
    const onResize = () => setSize({ h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // wavy vertical path, 40px wide
  const H = size.h;
  const pad = 56;
  const segs = 6;
  let d = `M20 ${pad}`;
  for (let i = 0; i < segs; i++) {
    const y0 = pad + ((H - pad * 2) / segs) * i;
    const y1 = pad + ((H - pad * 2) / segs) * (i + 1);
    const dir = i % 2 === 0 ? 1 : -1;
    d += ` C ${20 + dir * 14} ${y0 + (y1 - y0) * 0.3}, ${20 + dir * 14} ${y0 + (y1 - y0) * 0.7}, 20 ${y1}`;
  }

  useEffect(() => {
    const path = pathRef.current;
    const pin = pinRef.current;
    if (!path || !pin) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = reduce ? 1 : max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      const pt = path.getPointAtLength(len * p);
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      pin.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [H]);

  return (
    <svg
      className="sr-route"
      width="40"
      height={H}
      viewBox={`0 0 40 ${H}`}
      aria-hidden="true"
    >
      <path d={d} className="sr-route-track" />
      <path ref={pathRef} d={d} className="sr-route-trail" />
      <g ref={pinRef}>
        <ellipse className="sr-pin-ring" cx="0" cy="0" rx="9" ry="3.5" />
        <path
          className="sr-pin-svg"
          d="M0 -3 C -7 -12, -9 -16, -9 -20 a9 9 0 1 1 18 0 C 9 -16, 7 -12, 0 -3 Z"
        />
        <circle cx="0" cy="-20" r="3.2" className="sr-pin-eye" />
      </g>
    </svg>
  );
}
