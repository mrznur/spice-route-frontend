import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle,
  GitBranch,
  MessageSquare,
  QrCode,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

import { HeroLogo, ScrollRoute } from '@/components/landing/LandingMotion';
import Splash from '@/components/landing/Splash';
import { PricingCarousel } from '@/components/landing/PricingCarousel';

/* ── Shared style objects ───────────────────────────────────────────────── */

const logoFilter: CSSProperties = { filter: 'brightness(0) invert(1)' };

/* ── Content data ───────────────────────────────────────────────────────── */

interface Feature { title: string; description: string; icon: ReactNode; color: string; }

const FEATURES: Feature[] = [
  {
    title: 'Table-level QR codes',
    description: 'Give every table its own QR code. Guests scan, rate, and comment in under 30 seconds with no app to download.',
    icon: <QrCode className="h-4 w-4" />,
    color: 'var(--ds-accent-text)',
  },
  {
    title: 'One dashboard for every branch',
    description: 'Monitor all locations in a single view. Compare branch performance side by side and spot patterns across your network.',
    icon: <GitBranch className="h-4 w-4" />,
    color: 'var(--ds-green-text)',
  },
  {
    title: 'Centralized feedback inbox',
    description: 'Review every submission in one place. Filter by branch, table, rating, date range, or language to find what needs attention.',
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'var(--ds-orange-text)',
  },
  {
    title: 'Rating analytics',
    description: 'Track average ratings over time, catch trends early, and measure how service changes affect guest satisfaction.',
    icon: <BarChart3 className="h-4 w-4" />,
    color: 'var(--ds-amber-text)',
  },
  {
    title: 'Role-based access',
    description: "Branch managers see only their own location's data. Owners keep full visibility across every branch.",
    icon: <Users className="h-4 w-4" />,
    color: 'var(--ds-green-text)',
  },
  {
    title: 'AI-generated insights',
    description: 'Turn open-ended comments into a structured report covering sentiment, recurring complaints, common praise, and suggested improvements.',
    icon: <Sparkles className="h-4 w-4" />,
    color: 'var(--ds-violet-text)',
  },
];

interface Plan {
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

const PLANS: Plan[] = [
  {
    name: 'Starter',
    price: '$0',
    priceSuffix: '/mo',
    tagline: 'For a single restaurant. No credit card required.',
    cta: 'Start for free',
    href: '/register',
    icon: <QrCode className="h-4 w-4" />,
    iconColor: 'var(--ds-green-text)',
    barColor: 'var(--ds-green)',
    featuresLabel: 'Includes',
    features: [
      '1 branch',
      'Up to 20 tables',
      'A unique QR code for every table',
      'Basic rating analytics',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '$29',
    priceSuffix: '/mo',
    tagline: 'For expanding restaurant groups',
    cta: 'Start free trial',
    href: '/register',
    featured: true,
    icon: <Zap className="h-4 w-4" />,
    iconColor: 'var(--ds-accent-text)',
    barColor: 'var(--ds-accent)',
    featuresLabel: 'Includes',
    features: [
      '5 branches',
      'Unlimited tables',
      'Full analytics & trends',
      'Manager accounts',
      'AI summaries',
      'PDF exports',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    tagline: 'For large chains and franchises. Priced to fit your setup.',
    cta: 'Contact sales',
    href: '/login',
    icon: <Building2 className="h-4 w-4" />,
    iconColor: 'var(--ds-violet-text)',
    barColor: 'var(--ds-violet)',
    featuresLabel: 'Everything in Growth, plus',
    features: [
      'Unlimited branches',
      'Custom integrations',
      'SSO / SAML',
      'Dedicated onboarding',
      'SLA and dedicated support',
    ],
  },
];

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ds-bg)' }}>
      <Splash />
      <ScrollRoute />
      <SiteHeader />
      <main>
        <Hero />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ── Sections ───────────────────────────────────────────────────────────── */

function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'var(--ds-sidebar)', borderBottom: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
        <Link href="/" aria-label="Spice Route home">
          <Image
            src="/spice-route-logo.webp"
            alt="Spice Route"
            width={110}
            height={56}
            className="object-contain"
            style={{ ...logoFilter, opacity: 0.88 }}
            priority
          />
        </Link>
        <nav className="flex items-center gap-2" aria-label="Account">
          <Link
            href="/login"
            className="text-sm font-medium px-3 py-1.5 rounded hover:bg-white/5"
            style={{ color: 'var(--ds-text-2)', transition: 'background 0.15s' }}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="lp-btn-primary text-sm font-semibold px-3 py-1.5 rounded"
          >
            Get started free
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      className="py-20 sm:py-28"
      style={{ background: 'var(--ds-sidebar)', borderBottom: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight"
              style={{ color: 'var(--ds-text)' }}
            >
              Get feedback from every table, at every branch.
            </h1>
            <p
              className="mt-5 text-lg leading-relaxed max-w-xl"
              style={{ color: 'var(--ds-text-2)' }}
            >
              Guests scan a QR code at their table to leave a rating and a comment. You read it
              all in one dashboard and filter by branch, table, or date.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="lp-btn-primary inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-sm font-semibold"
              >
                Start for free <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="lp-btn-outline inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-sm font-medium"
              >
                Sign in to dashboard
              </Link>
            </div>
          </div>
          <HeroLogo />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
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

function PricingSection() {
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

        {/* Mobile — carousel, Growth centred by default */}
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

function CtaSection() {
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

function SiteFooter() {
  return (
    <footer
      className="py-5"
      style={{ background: 'var(--ds-bg)', borderTop: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Image
          src="/spice-route-logo.webp"
          alt="Spice Route"
          width={80}
          height={41}
          className="object-contain"
          style={{ ...logoFilter, opacity: 0.5 }}
        />
        <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
          © {new Date().getFullYear()} Spice Route. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ── Cards ──────────────────────────────────────────────────────────────── */

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <article
      className="rounded-md p-5"
      style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}
    >
      <div
        className="inline-flex items-center justify-center w-8 h-8 rounded mb-3"
        style={{ background: 'var(--ds-elevated)', color: feature.color }}
        aria-hidden="true"
      >
        {feature.icon}
      </div>
      <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--ds-text)' }}>
        {feature.title}
      </h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--ds-text-2)' }}>
        {feature.description}
      </p>
    </article>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  const featured = plan.featured ?? false;

  const cardStyle: CSSProperties = {
    background: featured ? 'var(--ds-elevated)' : 'var(--ds-bg)',
    border: featured ? '1px solid var(--ds-accent)' : '1px solid var(--ds-border)',
    ...(featured && {
      boxShadow: '0 4px 32px rgba(122,14,34,0.18)',
      transform: 'translateY(-6px)',
    }),
  };

  const barStyle: CSSProperties = {
    background: featured
      ? 'linear-gradient(90deg, var(--ds-accent) 0%, var(--ds-orange) 100%)'
      : plan.barColor,
    opacity: featured ? 1 : 0.5,
  };

  return (
    <article className="rounded-md flex flex-col" style={cardStyle}>
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
          <h3 className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>
            {plan.name}
          </h3>
        </div>

        <p className="mb-1">
          <span
            className="text-3xl font-bold"
            style={{ color: featured ? 'var(--ds-accent-text)' : 'var(--ds-text)' }}
          >
            {plan.price}
          </span>
          {plan.priceSuffix && (
            <span className="text-sm ml-1" style={{ color: 'var(--ds-text-3)' }}>
              {plan.priceSuffix}
            </span>
          )}
        </p>
        <p className="text-xs mb-5" style={{ color: 'var(--ds-text-3)' }}>
          {plan.tagline}
        </p>

        <Link
          href={plan.href}
          className={featured ? 'lp-btn-primary block text-center rounded px-4 py-2 text-sm font-medium mb-5' : 'lp-btn-outline block text-center rounded px-4 py-2 text-sm font-medium mb-5'}
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
