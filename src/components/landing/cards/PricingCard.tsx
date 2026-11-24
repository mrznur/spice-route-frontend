"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { Plan } from "@/components/landing/data/plans";
import { useSpotlight } from "@/lib/use-spotlight";

export function PricingCard({ plan }: { plan: Plan }) {
  const featured = plan.featured ?? false;
  const { ref, onPointerMove } = useSpotlight<HTMLElement>();

  const barStyle: CSSProperties = {
    background: featured
      ? "linear-gradient(90deg, var(--ds-accent) 0%, var(--ds-orange) 100%)"
      : plan.barColor,
    opacity: featured ? 1 : 0.5,
  };

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      className={`lp-pricing-card ${featured ? "lp-pricing-card--featured" : ""}`}
      style={
        {
          "--card-accent": featured ? "var(--ds-accent)" : plan.barColor,
        } as CSSProperties
      }
    >
      <div className="h-[3px]" style={barStyle} aria-hidden="true" />

      <div className="p-6 flex flex-col flex-1">
        {featured && (
          <span
            className="self-start text-[10px] font-semibold uppercase tracking-wide rounded px-2 py-0.5 mb-4"
            style={{
              background: "var(--ds-accent-muted)",
              color: "var(--ds-accent-text)",
            }}
          >
            Most popular
          </span>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span style={{ color: plan.iconColor }} aria-hidden="true">
            {plan.icon}
          </span>
          <h3
            className="text-base font-semibold"
            style={{ color: "var(--ds-text)" }}
          >
            {plan.name}
          </h3>
        </div>

        <p className="mb-1">
          <span
            className="text-4xl font-bold tracking-tight"
            style={{
              color: featured ? "var(--ds-accent-text)" : "var(--ds-text)",
            }}
          >
            {plan.price}
          </span>
          {plan.priceSuffix && (
            <span
              className="text-sm ml-1"
              style={{ color: "var(--ds-text-3)" }}
            >
              {plan.priceSuffix}
            </span>
          )}
        </p>
        <p className="text-sm mb-6" style={{ color: "var(--ds-text-3)" }}>
          {plan.tagline}
        </p>

        <Link
          href={plan.href}
          className={
            featured
              ? "lp-btn-primary block text-center rounded-lg px-4 py-2.5 text-sm font-medium mb-6"
              : "lp-btn-outline block text-center rounded-lg px-4 py-2.5 text-sm font-medium mb-6"
          }
        >
          {plan.cta}
        </Link>

        <div
          className="pt-5 mt-auto"
          style={{ borderTop: "1px solid var(--ds-border)" }}
        >
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--ds-text-2)" }}
          >
            {plan.featuresLabel}
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm"
                style={{ color: "var(--ds-text-2)" }}
              >
                <CheckCircle
                  className="h-4 w-4 flex-shrink-0 mt-0.5"
                  style={{
                    color: featured
                      ? "var(--ds-accent-text)"
                      : "var(--ds-green-text)",
                  }}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
