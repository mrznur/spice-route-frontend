import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  trend?: { direction: 'up' | 'down'; value: string };
  loading?: boolean;
  className?: string;
}

export function MetricCard({ label, value, sub, icon, iconColor, iconBg, trend, loading, className }: MetricCardProps) {
  return (
    <div
      className={cn('rounded-md p-4', className)}
      style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-xs font-medium" style={{ color: 'var(--ds-text-2)' }}>{label}</p>
        {icon && (
          <div
            className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded"
            style={{ background: iconBg ?? 'var(--ds-accent-muted)', color: iconColor ?? 'var(--ds-accent-text)' }}
          >
            {icon}
          </div>
        )}
      </div>
      {loading ? (
        <Skeleton className="h-7 w-16" />
      ) : (
        <p className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--ds-text)' }}>
          {value}
        </p>
      )}
      {(sub || trend) && !loading && (
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span className="text-[11px] font-medium" style={{ color: trend.direction === 'up' ? 'var(--ds-green-text)' : 'var(--ds-red-text)' }}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {sub && <span className="text-[11px]" style={{ color: 'var(--ds-text-3)' }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}
