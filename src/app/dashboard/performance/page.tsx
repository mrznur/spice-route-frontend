'use client';

import { useState, type ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, ChevronDown, FileText, MessageSquare, Star, TrendingUp } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import {
  useAnalyticsBranches,
  useAnalyticsSummary,
  useAnalyticsTrend,
  useBranchTableOptions,
  type Interval,
} from '@/hooks/useAnalytics';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { MetricCard } from '@/components/ui/metric-card';

// Recharts draws SVG, so it gets hex values (same colours as the --ds-* tokens in globals.css)
const ORANGE = '#F57C00';
const AXIS = '#5C4F4A';
const GRID = '#1C1210';
const tooltipStyle = {
  background: '#111111',
  border: '1px solid #251916',
  borderRadius: 6,
  color: '#F5EDE8',
  fontSize: 12,
};

const RANGES = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: '365', label: 'Last 12 months' },
  { value: 'custom', label: 'Custom range' },
];

const INTERVALS: { value: Interval; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function rangeDates(range: string, customFrom: string, customTo: string) {
  if (range === 'custom') return { from: customFrom || undefined, to: customTo || undefined };
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (Number(range) - 1));
  return { from: iso(from), to: iso(to) };
}

function spanDays(range: string, from?: string, to?: string) {
  if (range !== 'custom') return Number(range);
  if (!from || !to) return 30;
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000) + 1;
}

function autoInterval(days: number): Interval {
  if (days <= 31) return 'day';
  if (days <= 120) return 'week';
  return 'month';
}

function formatPeriod(period: string, interval: Interval) {
  const d = new Date(`${period}T00:00:00`);
  return interval === 'month'
    ? d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const STAR_COLORS: Record<number, string> = {
  5: 'var(--ds-green)',
  4: '#86efac',
  3: 'var(--ds-amber)',
  2: '#f97316',
  1: 'var(--ds-red)',
};
const barColor = (star: number) => STAR_COLORS[star];

const errorMessage = (err: unknown) =>
  (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Could not load this data.';

const cardStyle = { border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' };
const selectCls =
  'flex h-9 appearance-none rounded px-3 pr-8 text-sm focus:outline-none focus:border-[var(--ds-accent-bright)]';
const selectStyle = {
  border: '1px solid var(--ds-border-2)',
  background: 'var(--ds-elevated)',
  color: 'var(--ds-text)',
};
const dateCls = 'h-9 rounded px-3 text-sm focus:outline-none focus:border-[var(--ds-accent-bright)]';

function SelectField({
  value,
  onChange,
  children,
  width,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  width?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        className={selectCls}
        style={{ ...selectStyle, width, opacity: disabled ? 0.5 : 1 }}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
        style={{ color: 'var(--ds-text-3)' }}
      />
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-md p-4 ${className ?? ''}`} style={cardStyle}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs" style={{ color: 'var(--ds-text-3)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ErrorNotice({ error }: { error: unknown }) {
  return (
    <p
      className="rounded-md px-3 py-2 text-sm"
      style={{ background: 'var(--ds-red-muted)', color: 'var(--ds-red-text)' }}
    >
      {errorMessage(error)}
    </p>
  );
}

function RatingDistribution({ counts, total }: { counts: Record<number, number>; total: number }) {
  return (
    <div className="space-y-3">
      {[5, 4, 3, 2, 1].map((star) => {
        const n = counts[star] ?? 0;
        const share = total ? (n / total) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-3 text-xs">
            <span className="flex w-8 items-center gap-1 tabular-nums" style={{ color: 'var(--ds-text-2)' }}>
              {star}
              <Star className="h-3 w-3" style={{ color: barColor(star), fill: barColor(star) }} />
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--ds-elevated)' }}>
              <div className="h-full rounded-full" style={{ width: `${share}%`, background: barColor(star) }} />
            </div>
            <span className="w-20 text-right tabular-nums" style={{ color: 'var(--ds-text-2)' }}>
              {n.toLocaleString()} · {share.toFixed(0)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-60 w-full" />;
}

const axisTick = { fill: AXIS, fontSize: 11 };

export default function PerformancePage() {
  const { data: branches } = useBranches();

  const [branchId, setBranchId] = useState('');
  const [tableId, setTableId] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [range, setRange] = useState('30');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [intervalOverride, setIntervalOverride] = useState<Interval | null>(null);

  const { data: tableOptions } = useBranchTableOptions(branchId || undefined);

  const { from, to } = rangeDates(range, customFrom, customTo);
  const interval = intervalOverride ?? autoInterval(spanDays(range, from, to));

  const base = {
    minRating: minRating ? Number(minRating) : undefined,
    maxRating: maxRating ? Number(maxRating) : undefined,
    from,
    to,
  };
  const filters = { ...base, branchId: branchId || undefined, tableId: tableId || undefined };

  const summary = useAnalyticsSummary(filters);
  const trend = useAnalyticsTrend(filters, interval);
  const comparison = useAnalyticsBranches(base);

  const total = summary.data?.total ?? 0;
  const counts = summary.data?.ratingCounts ?? {};
  const positive = total ? (((counts[4] ?? 0) + (counts[5] ?? 0)) / total) * 100 : 0;
  const commentShare = total && summary.data ? (summary.data.withComments / total) * 100 : 0;

  const trendData = (trend.data ?? []).map((p) => ({
    label: formatPeriod(p.period, interval),
    count: p.count,
    avg: p.averageRating,
  }));
  const compareData = (comparison.data ?? []).map((b) => ({
    name: b.branchName,
    avg: b.averageRating ?? 0,
    count: b.count,
  }));
  const showComparison = compareData.length > 1;

  const hasFilters = !!(branchId || tableId || minRating || maxRating || range !== '30');
  const clearFilters = () => {
    setBranchId('');
    setTableId('');
    setMinRating('');
    setMaxRating('');
    setRange('30');
    setCustomFrom('');
    setCustomTo('');
    setIntervalOverride(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="Performance"
        subtitle={
          summary.data
            ? `${total.toLocaleString()} submission${total !== 1 ? 's' : ''} in this period`
            : 'Ratings, trends and branch comparison'
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <SelectField
          value={branchId}
          onChange={(v) => {
            setBranchId(v);
            setTableId('');
          }}
        >
          <option value="">All branches</option>
          {branches?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </SelectField>

        <SelectField value={tableId} onChange={setTableId} disabled={!branchId} width="9rem">
          <option value="">{branchId ? 'All tables' : 'Pick a branch'}</option>
          {tableOptions?.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </SelectField>

        <SelectField value={minRating} onChange={setMinRating} width="9rem">
          <option value="">Min rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {'★'.repeat(r)} {r}+
            </option>
          ))}
        </SelectField>

        <SelectField value={maxRating} onChange={setMaxRating} width="9rem">
          <option value="">Max rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {'★'.repeat(r)} {r}
            </option>
          ))}
        </SelectField>

        <SelectField
          value={range}
          onChange={(v) => {
            setRange(v);
            setIntervalOverride(null);
          }}
          width="10rem"
        >
          {RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </SelectField>

        {range === 'custom' && (
          <>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className={dateCls}
              style={{ ...selectStyle, color: customFrom ? 'var(--ds-text)' : 'var(--ds-text-3)', colorScheme: 'dark' }}
            />
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className={dateCls}
              style={{ ...selectStyle, color: customTo ? 'var(--ds-text)' : 'var(--ds-text-3)', colorScheme: 'dark' }}
            />
          </>
        )}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="h-9 rounded px-3 text-xs transition-colors hover:bg-white/5"
            style={{ color: 'var(--ds-text-2)', border: '1px solid var(--ds-border-2)' }}
          >
            Reset
          </button>
        )}
      </div>

      {summary.isError && <ErrorNotice error={summary.error} />}

      {summary.isLoading && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      )}

      {summary.data && total === 0 && (
        <EmptyState
          icon={<BarChart3 className="h-5 w-5" />}
          title="No feedback in this period"
          description="Try a wider date range or clear the filters. Charts appear as soon as customers submit feedback."
        />
      )}

      {summary.data && total > 0 && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard
              label="Average Rating"
              value={summary.data.averageRating != null ? summary.data.averageRating.toFixed(2) : '—'}
              sub="out of 5.00"
              icon={<Star className="h-3.5 w-3.5" />}
              iconColor="var(--ds-amber-text)"
              iconBg="var(--ds-amber-muted)"
            />
            <MetricCard
              label="Total Feedback"
              value={total.toLocaleString()}
              sub="in this period"
              icon={<MessageSquare className="h-3.5 w-3.5" />}
            />
            <MetricCard
              label="Positive (4–5 stars)"
              value={`${positive.toFixed(0)}%`}
              sub={`${((counts[4] ?? 0) + (counts[5] ?? 0)).toLocaleString()} reviews`}
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              iconColor="var(--ds-green-text)"
              iconBg="var(--ds-green-muted)"
            />
            <MetricCard
              label="With a Comment"
              value={`${commentShare.toFixed(0)}%`}
              sub={`${summary.data.withComments.toLocaleString()} of ${total.toLocaleString()}`}
              icon={<FileText className="h-3.5 w-3.5" />}
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {/* Volume */}
            <ChartCard
              className="lg:col-span-2"
              title="Feedback volume"
              subtitle="Submissions over time"
              action={
                <div className="flex overflow-hidden rounded" style={{ border: '1px solid var(--ds-border-2)' }}>
                  {INTERVALS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setIntervalOverride(opt.value)}
                      className="px-2.5 py-1 text-xs transition-colors"
                      style={{
                        background: interval === opt.value ? 'var(--ds-accent)' : 'transparent',
                        color: interval === opt.value ? '#fff' : 'var(--ds-text-2)',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              }
            >
              {trend.isLoading && <ChartSkeleton />}
              {trend.isError && <ErrorNotice error={trend.error} />}
              {trend.data && (
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke={GRID} />
                      <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} minTickGap={24} />
                      <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{ color: '#9A8880' }}
                        cursor={{ fill: 'rgba(122,14,34,0.10)' }}
                        formatter={(value) => [Number(value).toLocaleString(), 'Feedback']}
                      />
                      <Bar dataKey="count" fill={ORANGE} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>

            {/* Distribution */}
            <ChartCard title="Rating distribution" subtitle="Share of each star rating">
              <RatingDistribution counts={counts} total={total} />
            </ChartCard>

            {/* Rating trend */}
            <ChartCard
              className={showComparison ? 'lg:col-span-2' : 'lg:col-span-3'}
              title="Average rating"
              subtitle="Trend over the same period"
            >
              {trend.isLoading && <ChartSkeleton />}
              {trend.data && (
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                      <defs>
                        <linearGradient id="avgFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor={ORANGE} stopOpacity={0.28} />
                          <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke={GRID} />
                      <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} minTickGap={24} />
                      <YAxis
                        domain={[1, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{ color: '#9A8880' }}
                        formatter={(value) => [Number(value).toFixed(2), 'Average rating']}
                      />
                      <Area
                        type="monotone"
                        dataKey="avg"
                        stroke={ORANGE}
                        strokeWidth={2.5}
                        fill="url(#avgFill)"
                        connectNulls
                        dot={false}
                        activeDot={{ r: 4, fill: ORANGE }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>

            {/* Branch comparison (hidden when there is only one branch to compare) */}
            {showComparison && (
              <ChartCard title="Branch comparison" subtitle="Average rating per branch">
                <div style={{ height: Math.max(160, compareData.length * 44 + 30) }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareData} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                      <CartesianGrid horizontal={false} stroke={GRID} />
                      <XAxis
                        type="number"
                        domain={[0, 5]}
                        ticks={[0, 1, 2, 3, 4, 5]}
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        cursor={{ fill: 'rgba(122,14,34,0.10)' }}
                        formatter={(value) => [Number(value).toFixed(2), 'Average rating']}
                      />
                      <Bar dataKey="avg" fill={ORANGE} radius={[0, 3, 3, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-1.5">
                  {comparison.data?.map((b) => (
                    <div key={b.branchId} className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--ds-text-2)' }}>{b.branchName}</span>
                      <span className="tabular-nums" style={{ color: 'var(--ds-text-3)' }}>
                        {b.count.toLocaleString()} feedback · {b.averageRating != null ? b.averageRating.toFixed(2) : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            )}
          </div>
        </>
      )}
    </div>
  );
}