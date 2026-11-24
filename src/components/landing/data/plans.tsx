import type { ReactNode } from 'react';
import { Building2, QrCode, Zap } from 'lucide-react';

export interface Plan {
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

export const PLANS: Plan[] = [
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
