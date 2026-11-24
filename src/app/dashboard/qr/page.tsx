'use client';

import { useState, useEffect } from 'react';
import { useBranches } from '@/hooks/useBranches';
import { useTables, downloadQrPng, fetchQrBlobUrl, downloadBranchQrPdf } from '@/hooks/useTables';
import { toast } from 'sonner';
import { Download, FileDown, QrCode, ChevronDown, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { TableResponse } from '@/types';

/* ── single QR card ─────────────────────────────────────────────── */
function QrCard({ table }: { table: TableResponse }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  /* Fetch QR image as blob on mount so it renders inline */
  useEffect(() => {
    let revoked = false;
    setLoading(true);
    setError(false);

    fetchQrBlobUrl(table.id)
      .then((url) => {
        if (!revoked) setBlobUrl(url);
      })
      .catch(() => {
        if (!revoked) setError(true);
      })
      .finally(() => {
        if (!revoked) setLoading(false);
      });

    return () => {
      revoked = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.id]);

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadQrPng(table.id, table.label);
      toast.success(`Downloaded QR for ${table.label}`);
    } catch {
      toast.error('Failed to download QR code');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className="flex flex-col rounded-md overflow-hidden transition-colors"
      style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}
    >
      {/* QR image area */}
      <div
        className="flex items-center justify-center p-5"
        style={{ background: 'var(--ds-elevated)', borderBottom: '1px solid var(--ds-border)' }}
      >
        {loading && (
          <div className="w-40 h-40 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--ds-text-3)' }} />
          </div>
        )}
        {error && !loading && (
          <div
            className="w-40 h-40 flex flex-col items-center justify-center gap-2 rounded"
            style={{ background: 'var(--ds-bg)', color: 'var(--ds-text-3)' }}
          >
            <QrCode className="h-8 w-8" />
            <span className="text-xs">Failed to load</span>
          </div>
        )}
        {blobUrl && !loading && (
          /* White border so the QR is readable on the dark background */
          <div className="rounded p-2" style={{ background: '#ffffff' }}>
            <img
              src={blobUrl}
              alt={`QR code for ${table.label}`}
              className="w-40 h-40 block"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        )}
      </div>

      {/* Label + status + download */}
      <div className="px-4 py-3 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>
              {table.label}
            </p>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--ds-text-3)' }}>
              {table.qrToken.slice(0, 14)}…
            </p>
          </div>
          {!table.active && (
            <span
              className="text-[10px] font-semibold rounded px-1.5 py-0.5 flex-shrink-0"
              style={{ background: 'var(--ds-red-muted)', color: 'var(--ds-red-text)' }}
            >
              Inactive
            </span>
          )}
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading || loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ border: '1px solid var(--ds-border-2)', color: 'var(--ds-text-2)' }}
          onMouseEnter={(e) => { if (!downloading && !loading) (e.currentTarget as HTMLElement).style.borderColor = 'var(--ds-accent)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ds-border-2)'; }}
        >
          {downloading
            ? <><Loader2 className="h-3 w-3 animate-spin" /> Downloading…</>
            : <><Download className="h-3 w-3" /> Download PNG</>
          }
        </button>
      </div>
    </div>
  );
}

/* ── main page ──────────────────────────────────────────────────── */
export default function QrPage() {
  const { data: branches, isLoading: branchesLoading } = useBranches();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [pdfDownloading, setPdfDownloading] = useState(false);

  const { data: tables, isLoading: tablesLoading } = useTables(selectedBranchId);
  const selectedBranch = branches?.find((b) => b.id === selectedBranchId);

  const activeTables = tables?.filter((t) => t.active) ?? [];

  async function handleDownloadPdf() {
    if (!selectedBranchId || !selectedBranch) return;
    if (activeTables.length === 0) {
      toast.error('No active tables in this branch — add tables before downloading the PDF');
      return;
    }
    setPdfDownloading(true);
    try {
      await downloadBranchQrPdf(selectedBranchId, selectedBranch.name);
      toast.success(`Downloaded PDF for ${selectedBranch.name}`);
    } catch {
      toast.error('Failed to download PDF');
    } finally {
      setPdfDownloading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Tables & QR Codes"
        subtitle="View, download, and print QR codes for your tables."
      />

      {/* Branch selector row */}
      <div
        className="rounded-md p-4"
        style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Select */}
          <div className="relative flex-1">
            {branchesLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <>
                <select
                  className="flex h-9 w-full appearance-none rounded px-3 pr-9 text-sm focus:outline-none"
                  style={{
                    border: '1px solid var(--ds-border-2)',
                    background: 'var(--ds-elevated)',
                    color: selectedBranchId ? 'var(--ds-text)' : 'var(--ds-text-3)',
                  }}
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                >
                  <option value="">Select a branch…</option>
                  {branches?.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: 'var(--ds-text-3)' }}
                />
              </>
            )}
          </div>

          {/* Download all PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={!selectedBranchId || pdfDownloading || tablesLoading || activeTables.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            style={{ background: 'var(--ds-accent)' }}
            title={activeTables.length === 0 && selectedBranchId ? 'No active tables — add tables first' : 'Download all table QR codes as a print-ready PDF'}
          >
            {pdfDownloading
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
              : <><FileDown className="h-4 w-4" /> Download all as PDF</>
            }
          </button>
        </div>

        {/* Helpful hint when branch selected but no tables */}
        {selectedBranchId && !tablesLoading && activeTables.length === 0 && tables && tables.length > 0 && (
          <p className="text-xs mt-3" style={{ color: 'var(--ds-amber-text)' }}>
            All tables in this branch are inactive — reactivate a table to generate its QR code.
          </p>
        )}
        {selectedBranchId && !tablesLoading && selectedBranch && (
          <p className="text-xs mt-2" style={{ color: 'var(--ds-text-3)' }}>
            {activeTables.length} active table{activeTables.length !== 1 ? 's' : ''} in {selectedBranch.name}
          </p>
        )}
      </div>

      {/* Loading skeletons */}
      {selectedBranchId && tablesLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-md overflow-hidden"
              style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}
            >
              <div className="p-5 flex justify-center" style={{ background: 'var(--ds-elevated)' }}>
                <Skeleton className="w-40 h-40" />
              </div>
              <div className="px-4 py-3 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No branch selected yet */}
      {!selectedBranchId && !branchesLoading && (
        <EmptyState
          icon={<QrCode className="h-5 w-5" />}
          title="Select a branch above"
          description="Choose a branch to view its QR codes."
        />
      )}

      {/* No branches exist at all */}
      {!branchesLoading && branches?.length === 0 && (
        <EmptyState
          icon={<QrCode className="h-5 w-5" />}
          title="No branches yet"
          description="Create a branch and add tables to generate QR codes."
        />
      )}

      {/* Empty branch */}
      {selectedBranchId && !tablesLoading && tables?.length === 0 && (
        <EmptyState
          icon={<QrCode className="h-5 w-5" />}
          title="No tables in this branch"
          description="Add tables to this branch to generate QR codes."
        />
      )}

      {/* QR card grid */}
      {selectedBranchId && !tablesLoading && tables && tables.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <QrCard key={table.id} table={table} />
          ))}
        </div>
      )}
    </div>
  );
}
