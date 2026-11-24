import type { ReactNode } from 'react';
import { BarChart3, GitBranch, MessageSquare, QrCode, Sparkles, Users } from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}

export const FEATURES: Feature[] = [
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
