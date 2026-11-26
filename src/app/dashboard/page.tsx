'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useBranches } from '@/hooks/useBranches';
import { useFeedback, useFeedbackStats } from '@/hooks/useFeedback';
import { useAnalyticsTrend, useAnalyticsBranches } from '@/hooks/useAnalytics';
import {
  GitBranch, QrCode, Users, ArrowRight,
  TrendingUp, MessageSquare, Sparkles, Star,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatDate } from '@/lib/utils';
import {
  ResponsiveContainer, AreaChart, Area,
  Tooltip, CartesianGrid, XAxis,
} from 'recharts';

// ── helpers ────────────────────────────────────────────────────────────────
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const today = iso(new Date());
const sevenDaysAgo = (() => { const d = new Date(); d.setDate(d.getDate() - 6); return iso(d); })();

const tooltipStyle = {
  background: '#111111',
  border: '1px solid #251916',
  borderRadius: 6,
  color: '#F5EDE8',
  fontSize: 12,
};

const ratingColor = (r: number) =>
  r >= 4 ? 'var(--ds-green-text)' : r === 3 ? 'var(--ds-amber-text)' : 'var(--ds-red-text)';

function StarRating({ rating }: { rating: number }) {
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
export default function DashboardPage() {
  const { user, isOwner } = useAuth();
  const { data: branches, isLoading: branchesLoading } = useBranches();
  const { data: stats } = useFeedbackStats();

  // F1.2 — 7-day trend sparkline
  const { data: trendData } = useAnalyticsTrend(
    { from: sevenDaysAgo, to: today },
    'day'
  );
  const sparkPoints = (trendData ?? []).map((p) => ({
    d: p.period.slice(5), // MM-DD
    avg: p.averageRating,
  }));

  // F1.3 — last 5 submissions
  const { data: recentPage } = useFeedback({ size: 5, page: 0 });
  const recent = recentPage?.content ?? [];

  // F1.4 — branch comparison
  const { data: branchStats } = useAnalyticsBranches({ from: sevenDaysAgo, to: today });

  const activeBranches = branches?.filter((b) => b.active) ?? [];
  const inactiveBranches = branches?.filter((b) => !b.active) ?? [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--ds-text)' }}>
          Welcome back, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--ds-text-2)' }}>
          Here&apos;s an overview of your restaurant network.
        </p>
      </div>

      {/* F1.1 — metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Active Branches"
          value={branchesLoading ? '—' : activeBranches.length}
          sub={branchesLoading ? '' : `${inactiveBranches.length} inactive`}
          icon={<GitBranch className="h-3.5 w-3.5" />}
          loading={branchesLoading}
        />
        <MetricCard
          label="Total Feedback"
          value={stats?.totalFeedback ?? '—'}
          sub={stats?.totalFeedback ? 'All time' : 'No data yet'}
          icon={<MessageSquare className="h-3.5 w-3.5" />}
        />
        <MetricCard
          label="Avg. Rating"
          value={stats?.averageRating != null ? stats.averageRating.toFixed(2) : '—'}
          sub={stats?.totalFeedback ? 'out of 5.00' : 'No data yet'}
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          iconColor="var(--ds-amber-text)"
          iconBg="var(--ds-amber-muted)"
        />
        <MetricCard
          label="Positive (4–5★)"
          value={
            stats?.totalFeedback
              ? `${Math.round(((stats.fourStar + stats.fiveStar) / stats.totalFeedback) * 100)}%`
              : '—'
          }
          sub={stats?.totalFeedback ? `${stats.fourStar + stats.fiveStar} reviews` : 'No data yet'}
          icon={<Star className="h-3.5 w-3.5" />}
          iconColor="var(--ds-green-text)"
          iconBg="var(--ds-green-muted)"
        />
      </div>

      {/* F1.2 — 7-day sparkline */}
      {sparkPoints.length > 0 && (
        <div
          className="rounded-md p-4"
          style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>
              Avg rating — last 7 days
            </p>
            <Link
              href="/dashboard/performance"
              className="text-xs flex items-center gap-1 hover:underline"
              style={{ color: 'var(--ds-accent-text)' }}
            >
              Full analytics <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div style={{ height: 72 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkPoints} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
                <defs>
                  <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#F57C00" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#F57C00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#1C1210" />
                <XAxis dataKey="d" tick={{ fill: '#5C4F4A', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => [Number(v).toFixed(2), 'Avg rating']}
                />
                <Area
                  type="monotone"
                  dataKey="avg"
                  stroke="#F57C00"
                  strokeWidth={2}
                  fill="url(#spark)"
                  connectNulls
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — branches + recent feedback */}
        <div className="lg:col-span-2 space-y-5">
          {/* Branches */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Branches</p>
              <Link href="/dashboard/branches" className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--ds-accent-text)' }}>
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {branchesLoading && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-md px-4 py-3 flex items-center gap-3" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
                    <Skeleton className="w-7 h-7 rounded flex-shrink-0" />
                    <div className="flex-1 space-y-1.5"><Skeleton className="h-3 w-28" /><Skeleton className="h-2.5 w-44" /></div>
                  </div>
                ))}
              </div>
            )}

            {!branchesLoading && branches?.length === 0 && (
              <EmptyState icon={<GitBranch className="h-5 w-5" />} title="No branches yet" description="Add your first branch to start collecting feedback."
                action={isOwner ? (
                  <Link href="/dashboard/branches/new" className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}>
                    Add first branch
                  </Link>
                ) : undefined}
              />
            )}

            {!branchesLoading && branches && branches.length > 0 && (
              <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)' }}>
                {branches.slice(0, 5).map((branch, i) => (
                  <Link key={branch.id} href={`/dashboard/branches/${branch.id}/tables`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors group"
                    style={{ background: 'var(--ds-surface)', borderBottom: i < Math.min(branches.length, 5) - 1 ? '1px solid var(--ds-border)' : undefined }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ds-hover)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ds-surface)'; }}
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded font-semibold text-xs" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}>
                      {branch.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--ds-text)' }}>{branch.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--ds-text-3)' }}>{branch.address ?? 'No address set'}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge variant={branch.active ? 'active' : 'inactive'} label={branch.active ? 'Active' : 'Inactive'} />
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--ds-text-3)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* F1.3 — Recent feedback */}
          {recent.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Recent Feedback</p>
                <Link href="/dashboard/feedback" className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--ds-accent-text)' }}>
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}>
                {recent.map((fb, i) => (
                  <div
                    key={fb.id}
                    className="px-4 py-3 flex items-start gap-3"
                    style={{ borderBottom: i < recent.length - 1 ? '1px solid var(--ds-border)' : undefined }}
                  >
                    {/* Rating indicator */}
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded font-semibold text-xs mt-0.5"
                      style={
                        fb.rating <= 2
                          ? { background: 'var(--ds-red-muted)', color: 'var(--ds-red-text)' }
                          : fb.rating === 3
                          ? { background: 'var(--ds-amber-muted)', color: 'var(--ds-amber-text)' }
                          : { background: 'var(--ds-green-muted)', color: 'var(--ds-green-text)' }
                      }
                    >
                      {fb.rating}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <StarRating rating={fb.rating} />
                        <span className="text-xs" style={{ color: 'var(--ds-text-3)' }}>{formatDate(fb.createdAt)}</span>
                        {fb.anonymous && (
                          <span className="text-[10px] rounded px-1.5 py-0.5" style={{ background: 'var(--ds-elevated)', color: 'var(--ds-text-3)' }}>
                            Anonymous
                          </span>
                        )}
                      </div>
                      {fb.comment ? (
                        <p className="text-xs line-clamp-2" style={{ color: 'var(--ds-text-2)' }}>{fb.comment}</p>
                      ) : (
                        <p className="text-xs italic" style={{ color: 'var(--ds-text-disabled)' }}>Rating only — no comment</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column — quick actions + F1.4 branch comparison */}
        <div className="space-y-4">
          <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Quick Actions</p>
          <div className="space-y-1.5">
            {[
              { href: '/dashboard/feedback', icon: MessageSquare, label: 'Customer Feedback', sub: 'Read submissions',  color: 'var(--ds-accent-text)', bg: 'var(--ds-accent-muted)' },
              { href: '/dashboard/ai',       icon: Sparkles,      label: 'AI Insights',      sub: 'Generate summary', color: 'var(--ds-violet-text)', bg: 'var(--ds-violet-muted)' },
              { href: '/dashboard/qr',       icon: QrCode,        label: 'QR Codes',         sub: 'Download codes',   color: 'var(--ds-orange-text)', bg: 'var(--ds-orange-muted)' },
              ...(isOwner ? [{ href: '/dashboard/managers', icon: Users, label: 'Team', sub: 'Manage managers', color: 'var(--ds-green-text)', bg: 'var(--ds-green-muted)' }] : []),
            ].map(({ href, icon: Icon, label, sub, color, bg }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 group"
                style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ds-hover)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ds-surface)'; }}
              >
                <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded" style={{ background: bg, color }}><Icon className="h-3.5 w-3.5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: 'var(--ds-text)' }}>{label}</p>
                  <p className="text-[11px]" style={{ color: 'var(--ds-text-3)' }}>{sub}</p>
                </div>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: 'var(--ds-text-3)' }} />
              </Link>
            ))}
          </div>

          {/* F1.4 — Branch comparison (last 7 days) */}
          {branchStats && branchStats.length > 0 && (
            <div className="rounded-md p-4" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--ds-text)' }}>
                Branch performance · 7 days
              </p>
              <div className="space-y-2.5">
                {branchStats
                  .filter((b) => b.count > 0)
                  .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
                  .map((b) => (
                    <div key={b.branchId}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs truncate" style={{ color: 'var(--ds-text-2)' }}>{b.branchName}</span>
                        <span className="text-xs tabular-nums flex-shrink-0 ml-2" style={{ color: 'var(--ds-text-3)' }}>
                          {b.averageRating != null ? b.averageRating.toFixed(1) : '—'} · {b.count}
                        </span>
                      </div>
                      {b.averageRating != null && (
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--ds-elevated)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(b.averageRating / 5) * 100}%`,
                              background: b.averageRating >= 4 ? 'var(--ds-green)' : b.averageRating >= 3 ? 'var(--ds-amber)' : 'var(--ds-red)',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              <Link href="/dashboard/performance" className="text-xs flex items-center gap-1 mt-3 hover:underline" style={{ color: 'var(--ds-accent-text)' }}>
                Full comparison <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
