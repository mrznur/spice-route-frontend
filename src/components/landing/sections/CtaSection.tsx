import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section
      className="py-16"
      style={{ background: 'var(--ds-sidebar)', borderTop: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--ds-text)' }}>
          Ready to understand your customers?
        </h2>
        <p className="text-sm mb-7" style={{ color: 'var(--ds-text-2)' }}>
          Join restaurant chains already using Spice Route to close the feedback loop.
        </p>
        <Link
          href="/register"
          className="lp-btn-primary inline-flex items-center gap-2 rounded px-6 py-2.5 text-sm font-semibold"
        >
          Create free account <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
