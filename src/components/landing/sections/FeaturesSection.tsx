import { FeatureCard } from '@/components/landing/cards/FeatureCard';
import { FEATURES } from '@/components/landing/data/features';

export function FeaturesSection() {
  return (
    <section
      aria-labelledby="features-heading"
      className="py-20"
      style={{ background: 'var(--ds-bg)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 id="features-heading" className="text-xl font-bold" style={{ color: 'var(--ds-text)' }}>
            Everything a restaurant chain needs
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--ds-text-2)' }}>
            Built for multi-branch operations, not single-location cafes.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f) => <FeatureCard key={f.title} feature={f} />)}
        </div>
      </div>
    </section>
  );
}
