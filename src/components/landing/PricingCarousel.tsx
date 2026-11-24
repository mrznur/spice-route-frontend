'use client';

import { useState, useRef, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export interface CarouselPlan {
  name: string;
  price: string;
  priceSuffix?: string;
  tagline: string;
  cta: string;
  href: string;
  featured?: boolean;
  icon: ReactNode;
  iconColor: string;
  barColor: string;
  featuresLabel: string;
  features: string[];
}

export function PricingCarousel({ plans }: { plans: CarouselPlan[] }) {
  const [active, setActive] = useState(1); // start on Growth
  const touchStartX = useRef<number | null>(null);

  const prev = () => setActive((i) => Math.max(0, i - 1));
  const next = () => setActive((i) => Math.min(plans.length - 1, i + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) {
      if (dx > 0) next(); else prev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      // enough horizontal room so the peeking edges aren't clipped
      style={{ paddingLeft: '28px', paddingRight: '28px' }}
    >
      {/* Stack — height driven by the active card */}
      <div className="relative" style={{ minHeight: '480px' }}>
        {plans.map((plan, i) => {
          const offset = i - active; // -1 = left, 0 = top, 1 = right

          /*
           * Layer logic:
           *   active  → z-20, full width, no translate, full opacity
           *   left    → z-10, shifted left so only right edge peeks, slightly scaled + dim
           *   right   → z-10, shifted right so only left edge peeks, slightly scaled + dim
           */
          let transform = '';
          let zIndex = 1;
          let opacity = 1;
          let pointerEvents: CSSProperties['pointerEvents'] = 'none';

          if (offset === 0) {
            transform = 'translateX(0) scale(1)';
            zIndex = 20;
            opacity = 1;
            pointerEvents = 'auto';
          } else if (offset === -1) {
            // left card — peek right edge
            transform = 'translateX(-88%) scale(0.9)';
            zIndex = 10;
            opacity = 0.7;
          } else if (offset === 1) {
            // right card — peek left edge
            transform = 'translateX(88%) scale(0.9)';
            zIndex = 10;
            opacity = 0.7;
          } else {
            // further cards — hidden behind
            transform = offset < 0 ? 'translateX(-96%) scale(0.84)' : 'translateX(96%) scale(0.84)';
            zIndex = 1;
            opacity = 0;
          }

          const style: CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease, z-index 0s',
            transform,
            zIndex,
            opacity,
            pointerEvents,
          };

          return (
            <div key={plan.name} style={style} aria-hidden={offset !== 0}>
              <CarouselCard
                plan={plan}
                onTapPrev={offset === -1 ? prev : undefined}
                onTapNext={offset === 1 ? next : undefined}
              />
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-6">
        {plans.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to ${plans[i].name}`}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === active ? '20px' : '6px',
              height: '6px',
              background: i === active ? 'var(--ds-accent)' : 'var(--ds-border-2)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Card ───────────────────────────────────────────────────────────────── */

function CarouselCard({
  plan,
  onTapPrev,
  onTapNext,
}: {
  plan: CarouselPlan;
  onTapPrev?: () => void;
  onTapNext?: () => void;
}) {
  const featured = plan.featured ?? false;

  const cardStyle: CSSProperties = {
    background: featured ? 'var(--ds-elevated)' : 'var(--ds-bg)',
    border: featured ? '1px solid var(--ds-accent)' : '1px solid var(--ds-border)',
    ...(featured && { boxShadow: '0 4px 32px rgba(122,14,34,0.18)' }),
    // tap the peeking card to navigate
    cursor: onTapPrev || onTapNext ? 'pointer' : 'default',
  };

  const barStyle: CSSProperties = {
    background: featured
      ? 'linear-gradient(90deg, var(--ds-accent) 0%, var(--ds-orange) 100%)'
      : plan.barColor,
    opacity: featured ? 1 : 0.5,
  };

  const handleClick = () => {
    if (onTapPrev) onTapPrev();
    else if (onTapNext) onTapNext();
  };

  return (
    <article
      className="rounded-md flex flex-col"
      style={cardStyle}
      onClick={handleClick}
    >
      <div className="h-[3px] rounded-t-md" style={barStyle} aria-hidden="true" />
      <div className="p-6 flex flex-col flex-1">
        {featured && (
          <span
            className="self-start text-[10px] font-semibold uppercase tracking-wide rounded px-2 py-0.5 mb-4"
            style={{ background: 'var(--ds-accent-muted)', color: 'var(--ds-accent-text)' }}
          >
            Most popular
          </span>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span style={{ color: plan.iconColor }} aria-hidden="true">{plan.icon}</span>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>{plan.name}</h3>
        </div>

        <p className="mb-1">
          <span className="text-3xl font-bold"
            style={{ color: featured ? 'var(--ds-accent-text)' : 'var(--ds-text)' }}>
            {plan.price}
          </span>
          {plan.priceSuffix && (
            <span className="text-sm ml-1" style={{ color: 'var(--ds-text-3)' }}>{plan.priceSuffix}</span>
          )}
        </p>
        <p className="text-xs mb-5" style={{ color: 'var(--ds-text-3)' }}>{plan.tagline}</p>

        <Link
          href={plan.href}
          className={
            featured
              ? 'lp-btn-primary block text-center rounded px-4 py-2 text-sm font-medium mb-5'
              : 'lp-btn-outline block text-center rounded px-4 py-2 text-sm font-medium mb-5'
          }
          onClick={(e) => e.stopPropagation()}
        >
          {plan.cta}
        </Link>

        <div className="pt-4 mt-auto" style={{ borderTop: '1px solid var(--ds-border)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--ds-text-2)' }}>
            {plan.featuresLabel}
          </p>
          <ul className="space-y-2">
            {plan.features.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ds-text-2)' }}>
                <CheckCircle
                  className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
                  style={{ color: featured ? 'var(--ds-accent-text)' : 'var(--ds-green-text)' }}
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
