'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTables, downloadQrPng, useDeleteTable } from '@/hooks/useTables';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { Plus, Download, Layers, ChevronLeft, Pencil, QrCode, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { DsTable, DsThead, DsTh, DsTbody, DsTr, DsTd } from '@/components/ui/ds-table';

export default function TablesPage({ params }: { params: { id: string } }) {
  const { id: branchId } = params;
  const { data: tables, isLoading } = useTables(branchId);
  const { data: branches } = useBranches();
  const { isOwner } = useAuth();
  const branch = branches?.find((b) => b.id === branchId);
  const deleteMutation = useDeleteTable(branchId);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  async function handleDownloadPng(tableId: string, label: string) {
    try {
      await downloadQrPng(tableId, label);
      toast.success('Downloaded QR for ' + label);
    } catch {
      toast.error('Failed to download QR code');
    }
  }

  async function handleDeactivate(id: string, label: string) {
    if (!confirm(
      'Deactivate table "' + label + '"?\n\n' +
      'The QR code will stop accepting new feedback. All previous feedback is preserved.\n' +
      'You can reactivate it by clicking Edit on the table.'
    )) return;
    setDeactivating(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Table "' + label + '" deactivated');
    } catch {
      toast.error('Failed to deactivate table');
    } finally {
      setDeactivating(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <Link
          href="/dashboard/branches"
          className="inline-flex items-center gap-1 text-xs mb-3 hover:underline transition-colors"
          style={{ color: 'var(--ds-text-3)' }}
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Branches
        </Link>
        <PageHeader
          title={branch ? branch.name + ' — Tables' : 'Tables'}
          subtitle={tables ? tables.length + ' table' + (tables.length !== 1 ? 's' : '') : undefined}
          actions={
            isOwner ? (
              <div className="flex gap-2">
                <Link
                  href={'/dashboard/branches/' + branchId + '/tables/bulk'}
                  className="inline-flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium transition-colors"
                  style={{ border: '1px solid var(--ds-border-2)', color: 'var(--ds-text-2)' }}
                >
                  <Layers className="h-3.5 w-3.5" /> Bulk Add
                </Link>
                <Link
                  href={'/dashboard/branches/' + branchId + '/tables/new'}
                  className="inline-flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium"
                  style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}
                >
                  <Plus className="h-3.5 w-3.5" /> Add Table
                </Link>
              </div>
            ) : undefined
          }
        />
      </div>

      {isLoading && (
        <DsTable>
          <DsThead>
            <tr>
              <DsTh>Label</DsTh>
              <DsTh className="hidden sm:table-cell">QR Token</DsTh>
              <DsTh>Status</DsTh>
              <DsTh className="hidden md:table-cell">Created</DsTh>
              <DsTh right>Actions</DsTh>
            </tr>
          </DsThead>
          <DsTbody>
            {[1, 2, 3].map((i) => (
              <DsTr key={i}>
                <DsTd><Skeleton className="h-3.5 w-24" /></DsTd>
                <DsTd className="hidden sm:table-cell"><Skeleton className="h-3 w-28" /></DsTd>
                <DsTd><Skeleton className="h-5 w-14 rounded" /></DsTd>
                <DsTd className="hidden md:table-cell"><Skeleton className="h-3 w-20" /></DsTd>
                <DsTd right><Skeleton className="h-7 w-32 rounded ml-auto" /></DsTd>
              </DsTr>
            ))}
          </DsTbody>
        </DsTable>
      )}

      {!isLoading && tables?.length === 0 && (
        <EmptyState
          icon={<QrCode className="h-5 w-5" />}
          title="No tables yet"
          description="Add tables to generate QR codes for customer feedback."
          action={
            isOwner ? (
              <div className="flex gap-2">
                <Link
                  href={'/dashboard/branches/' + branchId + '/tables/bulk'}
                  className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{ border: '1px solid var(--ds-border-2)', color: 'var(--ds-text-2)' }}
                >
                  Bulk Add
                </Link>
                <Link
                  href={'/dashboard/branches/' + branchId + '/tables/new'}
                  className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium"
                  style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}
                >
                  Add Table
                </Link>
              </div>
            ) : undefined
          }
        />
      )}

      {!isLoading && tables && tables.length > 0 && (
        <DsTable>
          <DsThead>
            <tr>
              <DsTh>Label</DsTh>
              <DsTh className="hidden sm:table-cell">QR Token</DsTh>
              <DsTh>Status</DsTh>
              <DsTh className="hidden md:table-cell">Created</DsTh>
              <DsTh right>Actions</DsTh>
            </tr>
          </DsThead>
          <DsTbody>
            {tables.map((table) => (
              <DsTr key={table.id}>
                <DsTd>
                  <span className="font-medium text-sm" style={{ color: 'var(--ds-text)' }}>
                    {table.label}
                  </span>
                </DsTd>
                <DsTd muted className="hidden sm:table-cell font-mono text-xs">
                  {table.qrToken.slice(0, 14)}&hellip;
                </DsTd>
                <DsTd>
                  <StatusBadge
                    variant={table.active ? 'active' : 'inactive'}
                    label={table.active ? 'Active' : 'Inactive'}
                  />
                </DsTd>
                <DsTd muted className="hidden md:table-cell text-sm">
                  {formatDate(table.createdAt)}
                </DsTd>
                <DsTd right>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleDownloadPng(table.id, table.label)}
                      title="Download QR PNG"
                      className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium transition-colors"
                      style={{ color: 'var(--ds-text-2)', border: '1px solid var(--ds-border)' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--ds-border-2)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--ds-border)')}
                    >
                      <Download className="h-3 w-3" />
                      <span className="hidden sm:inline">QR</span>
                    </button>

                    {isOwner && (
                      <Link
                        href={'/dashboard/branches/' + branchId + '/tables/' + table.id + '/edit'}
                        className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium transition-colors"
                        style={{ color: 'var(--ds-text-2)', border: '1px solid var(--ds-border)' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--ds-accent)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--ds-border)')}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                    )}

                    {isOwner && table.active && (
                      <button
                        onClick={() => handleDeactivate(table.id, table.label)}
                        disabled={deactivating === table.id}
                        title="Deactivate this table"
                        className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ color: 'var(--ds-red-text)', border: '1px solid var(--ds-border)' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--ds-red-muted)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '')}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="hidden sm:inline">Deactivate</span>
                      </button>
                    )}
                  </div>
                </DsTd>
              </DsTr>
            ))}
          </DsTbody>
        </DsTable>
      )}

      {!isOwner && tables && tables.length > 0 && (
        <p className="text-xs text-right" style={{ color: 'var(--ds-text-3)' }}>
          Editing tables requires Owner access.
        </p>
      )}
    </div>
  );
}
