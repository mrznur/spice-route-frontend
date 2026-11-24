import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn('flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-5', className)}
      style={{ borderBottom: '1px solid var(--ds-border)' }}
    >
      <div>
        <h1 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--ds-text)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--ds-text-2)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
