"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";

/**
 * Tracks the pointer position inside an element and exposes it as the CSS
 * custom properties --mx and --my (in px, relative to the element).
 *
 * Writing to the DOM directly (instead of React state) avoids a re-render on
 * every pointer move.
 *
 * Usage:
 *   const { ref, onPointerMove } = useSpotlight<HTMLElement>();
 *   <article ref={ref} onPointerMove={onPointerMove} className="lp-feature-card" />
 */
export function useSpotlight<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    const onPointerMove = (e: PointerEvent<T>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    return { ref, onPointerMove };
}
