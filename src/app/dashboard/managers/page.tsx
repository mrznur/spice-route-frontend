'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useManagers, useDeleteManager } from '@/hooks/useManagers';
import { formatDate } from '@/lib/utils';
import { Plus, Users, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { DsTable, DsThead, DsTh, DsTbody, DsTr, DsTd } from '@/components/ui/ds-table';

export default function ManagersPage() {
  const { data: managers, isLoading } = useManagers();
  const deleteMutation = useDeleteManager();
  const [deleting, setDeleting] = useState<string | null>(null);
  const activeCount = managers?.filter((m) => m.active).length ?? 0;

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deactivate manager "${name}"?\n\nThey will be locked out immediately on their next login. All feedback they oversaw is preserved. You can reactivate them by editing their account.`)) return;
    setDeleting(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Manager "${name}" deactivated`);
    } catch {
      toast.error('Failed to deactivate manager');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <PageHeader
        title="Team"
        subtitle={managers ? `${managers.length} manager${managers.length !== 1 ? 's' : ''}` : undefined}
        actions={
          <Link href="/dashboard/managers/new" className="inline-flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium transition-colors" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}>
            <Plus className="h-3.5 w-3.5" /> Add Manager
          </Link>
        }
      />

      {!isLoading && managers && managers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Total Managers', value: managers.length },
            { label: 'Active',         value: activeCount },
            { label: 'Inactive',       value: managers.length - activeCount },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-md px-4 py-3" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
              <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>{label}</p>
              <p className="text-xl font-semibold mt-1 tabular-nums" style={{ color: 'var(--ds-text)' }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <DsTable>
          <DsThead><tr>{['Member','Email','Status','Branches','Added',''].map((h,i)=><DsTh key={i}>{h}</DsTh>)}</tr></DsThead>
          <DsTbody>{[1,2,3].map((i)=>(<DsTr key={i}><DsTd><div className="flex items-center gap-2.5"><Skeleton className="w-7 h-7 rounded-full"/><Skeleton className="h-3.5 w-28"/></div></DsTd><DsTd><Skeleton className="h-3 w-40"/></DsTd><DsTd><Skeleton className="h-5 w-14 rounded"/></DsTd><DsTd><Skeleton className="h-3 w-24"/></DsTd><DsTd><Skeleton className="h-3 w-16"/></DsTd><DsTd/></DsTr>))}</DsTbody>
        </DsTable>
      )}

      {!isLoading && managers?.length === 0 && (
        <EmptyState icon={<Users className="h-5 w-5" />} title="No managers yet" description="Add managers to give them branch-level access to feedback and tables."
          action={<Link href="/dashboard/managers/new" className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}><Plus className="h-3 w-3" /> Add Manager</Link>}
        />
      )}

      {!isLoading && managers && managers.length > 0 && (
        <DsTable>
          <DsThead>
            <tr>
              <DsTh>Member</DsTh>
              <DsTh className="hidden sm:table-cell">Email</DsTh>
              <DsTh>Status</DsTh>
              <DsTh className="hidden lg:table-cell">Branches</DsTh>
              <DsTh className="hidden md:table-cell">Added</DsTh>
              <DsTh right>Actions</DsTh>
            </tr>
          </DsThead>
          <DsTbody>
            {managers.map((manager) => {
              const initials = manager.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
              return (
                <DsTr key={manager.id}>
                  <DsTd>
                    <div className="flex items-center gap-2.5">
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-semibold" style={{ background: 'var(--ds-accent-muted)', color: 'var(--ds-accent-text)', border: '1px solid #7A0E2222' }}>
                        {initials}
                      </div>
                      <span className="font-medium text-sm" style={{ color: 'var(--ds-text)' }}>{manager.name}</span>
                    </div>
                  </DsTd>
                  <DsTd muted className="hidden sm:table-cell text-sm">{manager.email}</DsTd>
                  <DsTd><StatusBadge variant={manager.active ? 'active' : 'inactive'} label={manager.active ? 'Active' : 'Inactive'} /></DsTd>
                  <DsTd className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {manager.branches.length === 0 ? (
                        <span className="text-xs italic" style={{ color: 'var(--ds-text-3)' }}>None</span>
                      ) : (
                        manager.branches.map((b) => (
                          <span key={b.id} className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium" style={{ background: 'var(--ds-accent-muted)', color: 'var(--ds-accent-text)' }}>
                            {b.name}
                          </span>
                        ))
                      )}
                    </div>
                  </DsTd>
                  <DsTd muted className="hidden md:table-cell text-sm">{formatDate(manager.createdAt)}</DsTd>
                  <DsTd right>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/managers/${manager.id}/edit`} className="inline-flex items-center justify-center w-7 h-7 rounded transition-colors hover:bg-white/5" style={{ color: 'var(--ds-text-2)' }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(manager.id, manager.name)}
                        disabled={deleting === manager.id}
                        className="inline-flex items-center justify-center w-7 h-7 rounded transition-colors hover:bg-[var(--ds-red-muted)] disabled:opacity-40"
                        style={{ color: 'var(--ds-red-text)' }}
                        title="Deactivate manager"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </DsTd>
                </DsTr>
              );
            })}
          </DsTbody>
        </DsTable>
      )}
    </div>
  );
}
