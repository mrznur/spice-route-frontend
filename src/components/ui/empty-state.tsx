import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center rounded-md py-16 px-6 text-center', className)}
      style={{ background: 'var(--ds-surface)', border: '1px dashed var(--ds-border-2)' }}
    >
      {icon && (
        <div
          className="flex items-center justify-center w-10 h-10 rounded-md mb-4"
          style={{ background: 'var(--ds-elevated)', color: 'var(--ds-text-2)' }}
        >
          {icon}
        </div>
      )}
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--ds-text)' }}>
        {title}
      </p>
      {description && (
        <p className="text-xs max-w-xs" style={{ color: 'var(--ds-text-2)' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
