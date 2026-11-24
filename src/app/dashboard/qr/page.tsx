'use client';

import { useState } from 'react';
import { useBranches } from '@/hooks/useBranches';
import { useTables, downloadQrPng, downloadBranchQrPdf } from '@/hooks/useTables';
import { toast } from 'sonner';
import { Download, FileDown, QrCode, ChevronDown } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { DsTable, DsThead, DsTh, DsTbody, DsTr, DsTd } from '@/components/ui/ds-table';

export default function QrPage() {
  const { data: branches, isLoading: branchesLoading } = useBranches();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const { data: tables, isLoading: tablesLoading } = useTables(selectedBranchId);
  const selectedBranch = branches?.find((b) => b.id === selectedBranchId);

  async function handleDownloadPdf() {
    if (!selectedBranchId || !selectedBranch) return;
    try {
      await downloadBranchQrPdf(selectedBranchId, selectedBranch.name);
      toast.success(`Downloaded QR PDF for ${selectedBranch.name}`);
    } catch {
      toast.error('Failed to download PDF');
    }
  }

  async function handleDownloadPng(tableId: string, label: string) {
    try {
      await downloadQrPng(tableId, label);
      toast.success(`Downloaded QR for ${label}`);
    } catch {
      toast.error('Failed to download QR code');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <PageHeader
        title="Tables & QR Codes"
        subtitle="Download QR codes for individual tables or the full branch as a PDF."
      />

      {/* Branch selector */}
      <div className="rounded-md p-4 space-y-3" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
        <div>
          <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--ds-text)' }}>Select a branch</p>
          <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
            Download all QR codes as a print-ready PDF or pick individual PNGs below.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5">
          {branchesLoading ? (
            <Skeleton className="h-9 flex-1" />
          ) : (
            <div className="relative flex-1">
              <select
                className="flex h-9 w-full appearance-none rounded px-3 pr-8 text-sm focus:outline-none focus:border-[var(--ds-accent)] focus:ring-1 focus:ring-[#3b82f630]"
                style={{
                  border: '1px solid var(--ds-border-2)',
                  background: 'var(--ds-elevated)',
                  color: selectedBranchId ? 'var(--ds-text)' : 'var(--ds-text-3)',
                }}
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
              >
                <option value="">Choose branch…</option>
                {branches?.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--ds-text-3)' }} />
            </div>
          )}
          <button
            onClick={handleDownloadPdf}
            disabled={!selectedBranchId}
            className="inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--ds-accent)' }}
          >
            <FileDown className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Table list */}
      {selectedBranchId && (
        <>
          {tablesLoading && (
            <DsTable>
              <DsThead><tr><DsTh>Table</DsTh><DsTh className="hidden sm:table-cell">QR Token</DsTh><DsTh>Status</DsTh><DsTh right /></tr></DsThead>
              <DsTbody>
                {[1, 2, 3].map((i) => (
                  <DsTr key={i}>
                    <DsTd><Skeleton className="h-3.5 w-20" /></DsTd>
                    <DsTd className="hidden sm:table-cell"><Skeleton className="h-3 w-28" /></DsTd>
                    <DsTd><Skeleton className="h-5 w-14 rounded" /></DsTd>
                    <DsTd right><Skeleton className="h-7 w-16 rounded ml-auto" /></DsTd>
                  </DsTr>
                ))}
              </DsTbody>
            </DsTable>
          )}

          {!tablesLoading && (!tables || tables.length === 0) && (
            <EmptyState
              icon={<QrCode className="h-5 w-5" />}
              title="No tables in this branch"
              description="Add tables to this branch first to generate QR codes."
            />
          )}

          {!tablesLoading && tables && tables.length > 0 && (
            <DsTable>
              <DsThead>
                <tr>
                  <DsTh>Table</DsTh>
                  <DsTh className="hidden sm:table-cell">QR Token</DsTh>
                  <DsTh>Status</DsTh>
                  <DsTh right>Download</DsTh>
                </tr>
              </DsThead>
              <DsTbody>
                {tables.map((table) => (
                  <DsTr key={table.id}>
                    <DsTd>
                      <div className="flex items-center gap-2.5">
                        <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded" style={{ background: 'var(--ds-elevated)', color: 'var(--ds-accent-text)' }}>
                          <QrCode className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium text-sm" style={{ color: 'var(--ds-text)' }}>{table.label}</span>
                      </div>
                    </DsTd>
                    <DsTd muted className="hidden sm:table-cell font-mono text-xs">{table.qrToken.slice(0, 14)}…</DsTd>
                    <DsTd>
                      <StatusBadge variant={table.active ? 'active' : 'inactive'} label={table.active ? 'Active' : 'Inactive'} />
                    </DsTd>
                    <DsTd right>
                      <button
                        onClick={() => handleDownloadPng(table.id, table.label)}
                        className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-white/5"
                        style={{ border: '1px solid var(--ds-border-2)', color: 'var(--ds-text-2)' }}
                      >
                        <Download className="h-3 w-3" /> PNG
                      </button>
                    </DsTd>
                  </DsTr>
                ))}
              </DsTbody>
            </DsTable>
          )}
        </>
      )}

      {!selectedBranchId && !branchesLoading && (
        <EmptyState
          icon={<QrCode className="h-5 w-5" />}
          title="Select a branch above"
          description="Then download individual PNGs per table or the full branch PDF."
        />
      )}
    </div>
  );
}
