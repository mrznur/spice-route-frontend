'use client';

import { cn } from '@/lib/utils';

/* ── Dashboard variant (existing API) ───────────────────────────────────── */

type BadgeVariant = 'active' | 'inactive' | 'pending';

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  active:   { bg: 'var(--ds-green-muted)',  text: 'var(--ds-green-text)',  dot: 'var(--ds-green)' },
  inactive: { bg: 'var(--ds-red-muted)',    text: 'var(--ds-red-text)',    dot: 'var(--ds-red)' },
  pending:  { bg: 'var(--ds-amber-muted)',  text: 'var(--ds-amber-text)',  dot: 'var(--ds-amber)' },
};

interface StatusBadgeProps {
  /** Dashboard table usage: show a coloured dot + label */
  variant?: BadgeVariant;
  label?: string;
  /** Hero/landing usage: animated pulsing dot + arbitrary children */
  dot?: 'pulse-green' | 'pulse-orange' | 'pulse-violet' | 'static-green' | 'none';
  children?: React.ReactNode;
  className?: string;
}

/**
 * StatusBadge — two modes in one component.
 *
 * Dashboard mode (existing):
 *   <StatusBadge variant="active" label="Active" />
 *   <StatusBadge variant="inactive" label="Inactive" />
 *
 * Landing / hero mode (new):
 *   <StatusBadge dot="pulse-green">Scan · rate · done in 30 s</StatusBadge>
 *   <StatusBadge dot="pulse-orange">Beta feature</StatusBadge>
 */
export function StatusBadge({ variant, label, dot, children, className }: StatusBadgeProps) {
  /* ── Dashboard table badge ── */
  if (variant) {
    const s = variantStyles[variant] ?? variantStyles.inactive;
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium',
          className
        )}
        style={{ background: s.bg, color: s.text }}
      >
        <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
        {label}
      </span>
    );
  }

  /* ── Landing / hero animated badge ── */
  const dotType = dot ?? 'pulse-green';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border select-none',
        className
      )}
      style={{
        background: 'var(--ds-accent-muted)',
        color: 'var(--ds-accent-text)',
        borderColor: 'rgba(122,14,34,0.28)',
      }}
    >
      {dotType !== 'none' && <AnimatedDot type={dotType} />}
      {children}
    </span>
  );
}

/* ── Internal animated dot ── */

const dotColors = {
  'pulse-green':  { ring: 'rgba(34,197,94,0.35)',  core: 'var(--ds-green)' },
  'pulse-orange': { ring: 'rgba(245,124,0,0.35)',  core: 'var(--ds-orange)' },
  'pulse-violet': { ring: 'rgba(139,92,246,0.35)', core: 'var(--ds-violet)' },
  'static-green': { ring: 'transparent',           core: 'var(--ds-green)' },
  'none':         { ring: 'transparent',           core: 'transparent' },
};

function AnimatedDot({ type }: { type: NonNullable<StatusBadgeProps['dot']> }) {
  const { ring, core } = dotColors[type];
  const isPulse = type.startsWith('pulse');
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0 items-center justify-center">
      {isPulse && (
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
          style={{ background: ring }}
        />
      )}
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: core }} />
    </span>
  );
}
