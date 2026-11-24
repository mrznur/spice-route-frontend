import { cn } from '@/lib/utils';

export function DsTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn('rounded-md overflow-hidden', className)}
      style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

export function DsThead({ children }: { children: React.ReactNode }) {
  return (
    <thead style={{ background: 'var(--ds-table-header)', borderBottom: '1px solid var(--ds-border)' }}>
      {children}
    </thead>
  );
}

export function DsTh({
  children,
  className,
  right,
}: {
  children?: React.ReactNode;
  className?: string;
  right?: boolean;
}) {
  return (
    <th
      className={cn(
        'px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap',
        right && 'text-right',
        className
      )}
      style={{ color: 'var(--ds-text-3)' }}
    >
      {children}
    </th>
  );
}

export function DsTbody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function DsTr({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      className={cn('transition-colors group', onClick && 'cursor-pointer', className)}
      style={{ borderBottom: '1px solid var(--ds-border)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ds-hover)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function DsTd({
  children,
  className,
  right,
  muted,
}: {
  children?: React.ReactNode;
  className?: string;
  right?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={cn('px-4 py-3', right && 'text-right', className)}
      style={{ color: muted ? 'var(--ds-text-2)' : 'var(--ds-text)' }}
    >
      {children}
    </td>
  );
}
