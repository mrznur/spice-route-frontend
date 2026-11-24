import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded px-3 py-1 text-sm',
        'bg-[var(--ds-surface)] text-[var(--ds-text)]',
        'border border-[var(--ds-border)] placeholder:text-[var(--ds-text-3)]',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:border-[var(--ds-accent-bright)] focus-visible:ring-1 focus-visible:ring-[rgba(122,14,34,0.15)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
