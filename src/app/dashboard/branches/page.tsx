'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useBranches, useDeleteBranch } from '@/hooks/useBranches';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { Plus, GitBranch, Pencil, Table2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { DsTable, DsThead, DsTh, DsTbody, DsTr, DsTd } from '@/components/ui/ds-table';

export default function BranchesPage() {
  const { data: branches, isLoading } = useBranches();
  const { isOwner } = useAuth();
  const deleteMutation = useDeleteBranch();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deactivate branch "${name}"?\n\nThe branch and all its tables will be marked inactive. All feedback history is preserved. You can reactivate it later by editing the branch.`)) return;
    setDeleting(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Branch "${name}" deactivated`);
    } catch {
      toast.error('Failed to deactivate branch');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <PageHeader
        title="Branches"
        subtitle={branches ? `${branches.length} location${branches.length !== 1 ? 's' : ''} in your network` : undefined}
        actions={isOwner ? (
          <Link href="/dashboard/branches/new" className="inline-flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium transition-colors" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}>
            <Plus className="h-3.5 w-3.5" /> Add Branch
          </Link>
        ) : undefined}
      />

      {isLoading && (
        <DsTable>
          <DsThead><tr><DsTh>Branch</DsTh><DsTh>Address</DsTh><DsTh>Status</DsTh><DsTh>Created</DsTh><DsTh right /></tr></DsThead>
          <DsTbody>{[1,2,3].map((i) => (<DsTr key={i}><DsTd><div className="flex items-center gap-2.5"><Skeleton className="w-7 h-7 rounded" /><Skeleton className="h-3.5 w-28" /></div></DsTd><DsTd><Skeleton className="h-3 w-40" /></DsTd><DsTd><Skeleton className="h-5 w-14 rounded" /></DsTd><DsTd><Skeleton className="h-3 w-20" /></DsTd><DsTd /></DsTr>))}</DsTbody>
        </DsTable>
      )}

      {!isLoading && branches?.length === 0 && (
        <EmptyState icon={<GitBranch className="h-5 w-5" />} title="No branches yet" description="Add your first branch to start managing tables and collecting feedback."
          action={isOwner ? (<Link href="/dashboard/branches/new" className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}><Plus className="h-3 w-3" /> Add Branch</Link>) : undefined}
        />
      )}

      {!isLoading && branches && branches.length > 0 && (
        <DsTable>
          <DsThead>
            <tr>
              <DsTh>Branch</DsTh>
              <DsTh className="hidden sm:table-cell">Address</DsTh>
              <DsTh>Status</DsTh>
              <DsTh className="hidden md:table-cell">Created</DsTh>
              <DsTh right>Actions</DsTh>
            </tr>
          </DsThead>
          <DsTbody>
            {branches.map((branch) => (
              <DsTr key={branch.id}>
                <DsTd>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded text-xs font-semibold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}>
                      {branch.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm" style={{ color: 'var(--ds-text)' }}>{branch.name}</span>
                  </div>
                </DsTd>
                <DsTd muted className="hidden sm:table-cell text-sm">{branch.address ?? <span className="italic">—</span>}</DsTd>
                <DsTd><StatusBadge variant={branch.active ? 'active' : 'inactive'} label={branch.active ? 'Active' : 'Inactive'} /></DsTd>
                <DsTd muted className="hidden md:table-cell text-sm">{formatDate(branch.createdAt)}</DsTd>
                <DsTd right>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/dashboard/branches/${branch.id}/tables`} className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors hover:bg-white/5" style={{ color: 'var(--ds-text-2)' }}>
                      <Table2 className="h-3 w-3" /> Tables
                    </Link>
                    {isOwner && (
                      <>
                        <Link href={`/dashboard/branches/${branch.id}/edit`} className="inline-flex items-center justify-center w-7 h-7 rounded transition-colors hover:bg-white/5" style={{ color: 'var(--ds-text-2)' }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(branch.id, branch.name)}
                          disabled={deleting === branch.id}
                          className="inline-flex items-center justify-center w-7 h-7 rounded transition-colors hover:bg-[var(--ds-red-muted)] disabled:opacity-40"
                          style={{ color: 'var(--ds-red-text)' }}
                          title="Deactivate branch"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </DsTd>
              </DsTr>
            ))}
          </DsTbody>
        </DsTable>
      )}
    </div>
  );
}
