import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

type Variant = 'primary' | 'orange' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantStyles: Record<Variant, string> = {
  primary:   'bg-[var(--ds-accent)] text-[var(--ds-cream)] hover:bg-[var(--ds-accent-hover)]',
  orange:    'bg-[var(--ds-orange)] text-white hover:bg-[var(--ds-orange-hover)]',
  secondary: 'bg-[var(--ds-elevated)] text-[var(--ds-text)] border border-[var(--ds-border-2)] hover:bg-[var(--ds-active)]',
  ghost:     'bg-transparent text-[var(--ds-text-2)] hover:bg-[var(--ds-hover)] hover:text-[var(--ds-text)]',
  danger:    'bg-[var(--ds-red-muted)] text-[var(--ds-red-text)] border border-[#ef444433] hover:bg-[#ef444420]',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-8 px-3 text-sm gap-2',
  lg: 'h-9 px-4 text-sm gap-2',
};

interface DsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const DsButton = forwardRef<HTMLButtonElement, DsButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded font-medium',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ds-accent)]',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);
DsButton.displayName = 'DsButton';
