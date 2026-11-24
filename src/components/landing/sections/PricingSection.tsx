import { PricingCarousel } from '@/components/landing/PricingCarousel';
import { PricingCard } from '@/components/landing/cards/PricingCard';
import { PLANS } from '@/components/landing/data/plans';

export function PricingSection() {
  return (
    <section
      aria-labelledby="pricing-heading"
      className="py-20"
      style={{ background: 'var(--ds-surface)' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 id="pricing-heading" className="text-xl font-bold" style={{ color: 'var(--ds-text)' }}>
            Simple pricing
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--ds-text-2)' }}>
            Start free. Scale as your network grows.
          </p>
        </div>

        {/* Mobile — stacked card carousel */}
        <div className="sm:hidden overflow-hidden px-6">
          <PricingCarousel plans={PLANS} />
        </div>

        {/* Desktop — 3-column grid */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4 items-start">
          {PLANS.map((p) => <PricingCard key={p.name} plan={p} />)}
        </div>
      </div>
    </section>
  );
}
