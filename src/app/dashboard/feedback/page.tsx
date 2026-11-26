'use client';

import { useState } from 'react';
import { useBranches } from '@/hooks/useBranches';
import { useFeedback } from '@/hooks/useFeedback';
import { formatDate } from '@/lib/utils';
import {
  MessageSquare, Star, ChevronDown,
  ChevronLeft, ChevronRight, User, UserX,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

// ── helpers ────────────────────────────────────────────────────────────────
const ratingColor = (r: number) =>
  r >= 4 ? 'var(--ds-green-text)' : r === 3 ? 'var(--ds-amber-text)' : 'var(--ds-red-text)';

const ratingBg = (r: number) =>
  r >= 4 ? 'var(--ds-green-muted)' : r === 3 ? 'var(--ds-amber-muted)' : 'var(--ds-red-muted)';

const LANG_LABEL: Record<string, string> = {
  en: 'EN',
  bn: 'বাংলা',
  banglish: 'Banglish',
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="h-3 w-3"
          style={{
            color: s <= rating ? ratingColor(rating) : 'var(--ds-text-disabled)',
            fill: s <= rating ? ratingColor(rating) : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────
export default function FeedbackPage() {
  const { data: branches } = useBranches();
  const [branchId,  setBranchId]  = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [from,      setFrom]      = useState('');
  const [to,        setTo]        = useState('');
  const [page,      setPage]      = useState(0);

  // Build a branchId → name map for F3.1
  const branchNameById = Object.fromEntries(
    (branches ?? []).map((b) => [b.id, b.name])
  );

  const { data, isLoading } = useFeedback({
    branchId:  branchId  || undefined,
    minRating: minRating ? Number(minRating) : undefined,
    maxRating: maxRating ? Number(maxRating) : undefined,
    from:      from      || undefined,
    to:        to        || undefined,
    page,
    size: 20,
  });

  const selectCls = 'flex h-9 appearance-none rounded px-3 pr-8 text-sm focus:outline-none';
  const selectStyle = {
    border: '1px solid var(--ds-border-2)',
    background: 'var(--ds-elevated)',
    color: 'var(--ds-text)',
  };
  const hasFilters = !!(branchId || minRating || maxRating || from || to);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <PageHeader
        title="Customer Feedback"
        subtitle={
          data
            ? `${data.totalElements.toLocaleString()} submission${data.totalElements !== 1 ? 's' : ''}`
            : 'Browse and filter customer submissions'
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Branch */}
        <div className="relative">
          <select className={selectCls} style={selectStyle} value={branchId}
            onChange={(e) => { setBranchId(e.target.value); setPage(0); }}>
            <option value="">All branches</option>
            {branches?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--ds-text-3)' }} />
        </div>

        {/* Min rating */}
        <div className="relative">
          <select className={selectCls} style={{ ...selectStyle, width: '9rem' }} value={minRating}
            onChange={(e) => { setMinRating(e.target.value); setPage(0); }}>
            <option value="">Min rating</option>
            {[1,2,3,4,5].map((r) => <option key={r} value={r}>{'★'.repeat(r)} {r}+</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--ds-text-3)' }} />
        </div>

        {/* Max rating */}
        <div className="relative">
          <select className={selectCls} style={{ ...selectStyle, width: '9rem' }} value={maxRating}
            onChange={(e) => { setMaxRating(e.target.value); setPage(0); }}>
            <option value="">Max rating</option>
            {[1,2,3,4,5].map((r) => <option key={r} value={r}>{'★'.repeat(r)} {r}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--ds-text-3)' }} />
        </div>

        {/* From date */}
        <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }}
          className="h-9 rounded px-3 text-sm focus:outline-none"
          style={{ ...selectStyle, color: from ? 'var(--ds-text)' : 'var(--ds-text-3)', colorScheme: 'dark' }} />

        {/* To date */}
        <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }}
          className="h-9 rounded px-3 text-sm focus:outline-none"
          style={{ ...selectStyle, color: to ? 'var(--ds-text)' : 'var(--ds-text-3)', colorScheme: 'dark' }} />

        {hasFilters && (
          <button
            onClick={() => { setBranchId(''); setMinRating(''); setMaxRating(''); setFrom(''); setTo(''); setPage(0); }}
            className="h-9 px-3 text-xs rounded"
            style={{ color: 'var(--ds-text-2)', border: '1px solid var(--ds-border-2)' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}>
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="px-4 py-4 flex items-start gap-3" style={{ borderBottom: '1px solid var(--ds-border)' }}>
              <Skeleton className="w-8 h-8 rounded flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && data?.content.length === 0 && (
        <EmptyState
          icon={<MessageSquare className="h-5 w-5" />}
          title="No feedback yet"
          description="Customer submissions will appear here once guests scan a QR code and submit their rating."
        />
      )}

      {/* Feedback list */}
      {!isLoading && data && data.content.length > 0 && (
        <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}>
          {data.content.map((fb, i) => (
            <div
              key={fb.id}
              className="px-4 py-4 flex items-start gap-3"
              style={{
                // F3.2 — red left border on 1–2 star submissions
                borderLeft: fb.rating <= 2 ? '3px solid var(--ds-red)' : '3px solid transparent',
                borderBottom: i < data.content.length - 1 ? '1px solid var(--ds-border)' : undefined,
              }}
            >
              {/* Rating bubble */}
              <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm"
                style={{ background: ratingBg(fb.rating), color: ratingColor(fb.rating) }}
              >
                {fb.rating}
              </div>

              <div className="flex-1 min-w-0">
                {/* Meta row */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <StarRow rating={fb.rating} />

                  {/* F3.4 — customer name or anonymous */}
                  {fb.anonymous ? (
                    <span className="inline-flex items-center gap-1 text-[11px] rounded px-1.5 py-0.5"
                      style={{ background: 'var(--ds-elevated)', color: 'var(--ds-text-3)' }}>
                      <UserX className="h-2.5 w-2.5" /> Anonymous
                    </span>
                  ) : fb.customerName ? (
                    <span className="inline-flex items-center gap-1 text-[11px] rounded px-1.5 py-0.5"
                      style={{ background: 'var(--ds-elevated)', color: 'var(--ds-text-2)' }}>
                      <User className="h-2.5 w-2.5" /> {fb.customerName}
                    </span>
                  ) : null}

                  {/* F3.1 — branch name */}
                  {branchNameById[fb.branchId] && (
                    <span className="text-[11px] rounded px-1.5 py-0.5"
                      style={{ background: 'var(--ds-accent-muted)', color: 'var(--ds-accent-text)' }}>
                      {branchNameById[fb.branchId]}
                    </span>
                  )}

                  {/* F3.3 — language badge */}
                  {LANG_LABEL[fb.language] && (
                    <span className="text-[10px] rounded px-1.5 py-0.5"
                      style={{ background: 'var(--ds-elevated)', color: 'var(--ds-text-3)', fontFamily: 'monospace' }}>
                      {LANG_LABEL[fb.language]}
                    </span>
                  )}

                  <span className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
                    {formatDate(fb.createdAt)}
                  </span>
                </div>

                {/* Comment */}
                {fb.comment ? (
                  <p className="text-sm" style={{ color: 'var(--ds-text-2)' }}>{fb.comment}</p>
                ) : (
                  <p className="text-xs italic" style={{ color: 'var(--ds-text-disabled)' }}>
                    Rating only — no comment
                  </p>
                )}
              </div>

              {/* Star count on right */}
              <div className="flex-shrink-0 text-right">
                <span className="text-sm font-semibold tabular-nums" style={{ color: ratingColor(fb.rating) }}>
                  {fb.rating}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
            Page {data.page + 1} of {data.totalPages} · {data.totalElements.toLocaleString()} total
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium disabled:opacity-40"
              style={{ border: '1px solid var(--ds-border-2)', color: 'var(--ds-text-2)' }}>
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page >= data.totalPages - 1}
              className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium disabled:opacity-40"
              style={{ border: '1px solid var(--ds-border-2)', color: 'var(--ds-text-2)' }}>
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
