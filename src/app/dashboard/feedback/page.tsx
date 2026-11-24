'use client';

import { useState } from 'react';
import { useBranches } from '@/hooks/useBranches';
import { useFeedback } from '@/hooks/useFeedback';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Star, ChevronDown, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

const ratingColor = (r: number) =>
  r >= 4 ? 'var(--ds-green-text)' : r === 3 ? 'var(--ds-amber-text)' : 'var(--ds-red-text)';

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className="h-3 w-3" style={{ color: s <= rating ? ratingColor(rating) : 'var(--ds-text-3)', fill: s <= rating ? ratingColor(rating) : 'transparent' }} />
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const { data: branches } = useBranches();
  const [branchId,  setBranchId]  = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [from,      setFrom]      = useState('');
  const [to,        setTo]        = useState('');
  const [page,      setPage]      = useState(0);

  const { data, isLoading } = useFeedback({
    branchId:  branchId  || undefined,
    minRating: minRating ? Number(minRating) : undefined,
    maxRating: maxRating ? Number(maxRating) : undefined,
    from:      from      || undefined,
    to:        to        || undefined,
    page,
    size: 20,
  });

  const selectCls = "flex h-9 appearance-none rounded px-3 pr-8 text-sm focus:outline-none focus:border-[var(--ds-accent-bright)]";
  const selectStyle = { border: '1px solid var(--ds-border-2)', background: 'var(--ds-elevated)', color: 'var(--ds-text)' };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <PageHeader
        title="Customer Feedback"
        subtitle={data ? `${data.totalElements.toLocaleString()} submission${data.totalElements !== 1 ? 's' : ''}` : 'Browse and filter customer submissions'}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Branch */}
        <div className="relative">
          <select className={selectCls} style={selectStyle} value={branchId} onChange={(e) => { setBranchId(e.target.value); setPage(0); }}>
            <option value="">All branches</option>
            {branches?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--ds-text-3)' }} />
        </div>

        {/* Rating from */}
        <div className="relative">
          <select className={selectCls} style={{ ...selectStyle, width: '9rem' }} value={minRating} onChange={(e) => { setMinRating(e.target.value); setPage(0); }}>
            <option value="">Min rating</option>
            {[1,2,3,4,5].map((r) => <option key={r} value={r}>{'★'.repeat(r)} {r}+</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--ds-text-3)' }} />
        </div>

        {/* Rating to */}
        <div className="relative">
          <select className={selectCls} style={{ ...selectStyle, width: '9rem' }} value={maxRating} onChange={(e) => { setMaxRating(e.target.value); setPage(0); }}>
            <option value="">Max rating</option>
            {[1,2,3,4,5].map((r) => <option key={r} value={r}>{'★'.repeat(r)} {r}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--ds-text-3)' }} />
        </div>

        {/* Date from */}
        <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }}
          className="h-9 rounded px-3 text-sm focus:outline-none focus:border-[var(--ds-accent-bright)]"
          style={{ border: '1px solid var(--ds-border-2)', background: 'var(--ds-elevated)', color: from ? 'var(--ds-text)' : 'var(--ds-text-3)', colorScheme: 'dark' }} />

        {/* Date to */}
        <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }}
          className="h-9 rounded px-3 text-sm focus:outline-none focus:border-[var(--ds-accent-bright)]"
          style={{ border: '1px solid var(--ds-border-2)', background: 'var(--ds-elevated)', color: to ? 'var(--ds-text)' : 'var(--ds-text-3)', colorScheme: 'dark' }} />

        {(branchId || minRating || maxRating || from || to) && (
          <button onClick={() => { setBranchId(''); setMinRating(''); setMaxRating(''); setFrom(''); setTo(''); setPage(0); }}
            className="h-9 px-3 text-xs rounded transition-colors hover:bg-white/5"
            style={{ color: 'var(--ds-text-2)', border: '1px solid var(--ds-border-2)' }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}>
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="px-4 py-4 flex items-start gap-3" style={{ borderBottom: '1px solid var(--ds-border)' }}>
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-24" /><Skeleton className="h-3 w-64" /></div>
              <Skeleton className="h-5 w-16 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && data?.content.length === 0 && (
        <EmptyState icon={<MessageSquare className="h-5 w-5" />} title="No feedback yet" description="Customer submissions will appear here once guests scan a QR code and submit their rating." />
      )}

      {/* Feedback list */}
      {!isLoading && data && data.content.length > 0 && (
        <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}>
          {data.content.map((fb, i) => (
            <div
              key={fb.id}
              className="px-4 py-4 flex items-start gap-3"
              style={{ borderBottom: i < data.content.length - 1 ? '1px solid var(--ds-border)' : undefined }}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: fb.anonymous ? 'var(--ds-elevated)' : 'var(--ds-accent-muted)', color: fb.anonymous ? 'var(--ds-text-3)' : 'var(--ds-accent-text)' }}>
                <User className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--ds-text)' }}>
                    {fb.anonymous || !fb.customerName ? 'Anonymous' : fb.customerName}
                  </span>
                  {fb.anonymous && <StatusBadge variant="inactive" label="Anonymous" />}
                  <StarRow rating={fb.rating} />
                  <span className="text-xs" style={{ color: 'var(--ds-text-3)' }}>{formatDate(fb.createdAt)}</span>
                </div>
                {fb.comment && (
                  <p className="text-sm" style={{ color: 'var(--ds-text-2)' }}>{fb.comment}</p>
                )}
              </div>

              {/* Rating badge */}
              <div className="flex-shrink-0">
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
              className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/5 disabled:opacity-40"
              style={{ border: '1px solid var(--ds-border-2)', color: 'var(--ds-text-2)' }}>
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page >= data.totalPages - 1}
              className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/5 disabled:opacity-40"
              style={{ border: '1px solid var(--ds-border-2)', color: 'var(--ds-text-2)' }}>
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
