"use client";

import type { CSSProperties } from "react";
import type { Feature } from "@/components/landing/data/features";
import { useSpotlight } from "@/lib/use-spotlight";

export function FeatureCard({ feature }: { feature: Feature }) {
  const { ref, onPointerMove } = useSpotlight<HTMLElement>();

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      className="lp-feature-card"
      style={{ "--card-accent": feature.color } as CSSProperties}
    >
      <div className="lp-feature-icon" aria-hidden="true">
        {feature.icon}
      </div>
      <h3 className="lp-feature-title">{feature.title}</h3>
      <p className="lp-feature-desc">{feature.description}</p>
    </article>
  );
}
