import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface FormShellProps {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function FormShell({ backHref, backLabel, title, subtitle, children }: FormShellProps) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-5">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-xs mb-4 hover:underline transition-colors"
          style={{ color: 'var(--ds-text-3)' }}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
        <h1 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--ds-text)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--ds-text-2)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="rounded-md p-6"
        style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}
      >
        {children}
      </div>
    </div>
  );
}
