'use client';

import { useState } from 'react';
import { useBranches } from '@/hooks/useBranches';
import { useFeedbackStats } from '@/hooks/useFeedback';
import { Star, TrendingUp, MessageSquare, ChevronDown } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { Skeleton } from '@/components/ui/skeleton';

function RatingBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-16 flex-shrink-0" style={{ color: 'var(--ds-text-2)' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--ds-elevated)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs w-10 text-right tabular-nums" style={{ color: 'var(--ds-text-3)' }}>{count}</span>
    </div>
  );
}

export default function PerformancePage() {
  const { data: branches } = useBranches();
  const [branchId, setBranchId] = useState('');
  const { data: stats, isLoading } = useFeedbackStats(branchId || undefined);

  const avg = stats?.averageRating != null ? stats.averageRating.toFixed(2) : '—';
  const total = stats?.totalFeedback ?? 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap pb-5" style={{ borderBottom: '1px solid var(--ds-border)' }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--ds-text)' }}>Performance</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ds-text-2)' }}>Rating breakdown and feedback volume.</p>
        </div>
        {/* Branch filter */}
        <div className="relative">
          <select
            className="flex h-9 appearance-none rounded px-3 pr-8 text-sm focus:outline-none"
            style={{ border: '1px solid var(--ds-border-2)', background: 'var(--ds-elevated)', color: 'var(--ds-text)', minWidth: '10rem' }}
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          >
            <option value="">All branches</option>
            {branches?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--ds-text-3)' }} />
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Average Rating"
          value={isLoading ? '—' : avg}
          sub={total > 0 ? `out of 5.00` : 'No data yet'}
          icon={<Star className="h-3.5 w-3.5" />}
          iconColor="var(--ds-amber-text)"
          iconBg="var(--ds-amber-muted)"
          loading={isLoading}
        />
        <MetricCard
          label="Total Feedback"
          value={isLoading ? '—' : total.toLocaleString()}
          sub={branchId ? 'This branch' : 'All branches'}
          icon={<MessageSquare className="h-3.5 w-3.5" />}
          loading={isLoading}
        />
        <MetricCard
          label="5-Star Reviews"
          value={isLoading ? '—' : stats?.fiveStar ?? 0}
          sub={total > 0 ? `${Math.round(((stats?.fiveStar ?? 0) / total) * 100)}% of total` : '—'}
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          iconColor="var(--ds-green-text)"
          iconBg="var(--ds-green-muted)"
          loading={isLoading}
        />
      </div>

      {/* Rating distribution */}
      <div className="rounded-md p-5 space-y-4" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Rating Distribution</p>
        {isLoading ? (
          <div className="space-y-3">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-4 w-full" />)}</div>
        ) : total === 0 ? (
          <p className="text-sm" style={{ color: 'var(--ds-text-3)' }}>No feedback data yet. Ratings will appear here once customers submit reviews.</p>
        ) : (
          <div className="space-y-3">
            <RatingBar label="5 stars" count={stats?.fiveStar  ?? 0} total={total} color="var(--ds-green)" />
            <RatingBar label="4 stars" count={stats?.fourStar  ?? 0} total={total} color="#86efac" />
            <RatingBar label="3 stars" count={stats?.threeStar ?? 0} total={total} color="var(--ds-amber)" />
            <RatingBar label="2 stars" count={stats?.twoStar   ?? 0} total={total} color="#f97316" />
            <RatingBar label="1 star"  count={stats?.oneStar   ?? 0} total={total} color="var(--ds-red)" />
          </div>
        )}
      </div>

      {/* Trends placeholder */}
      <div className="rounded-md p-5" style={{ background: 'var(--ds-surface)', border: '1px dashed var(--ds-border-2)' }}>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--ds-text)' }}>Rating trends over time</p>
        <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
          A time-series chart of daily average ratings will appear here once a charting library is added.
        </p>
      </div>
    </div>
  );
}
