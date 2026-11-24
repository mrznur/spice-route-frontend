'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useBranches } from '@/hooks/useBranches';
import { GitBranch, QrCode, Users, ArrowRight, TrendingUp, MessageSquare, Sparkles, BarChart3 } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { useFeedbackStats } from '@/hooks/useFeedback';

export default function DashboardPage() {
  const { user, isOwner } = useAuth();
  const { data: branches, isLoading } = useBranches();
  const { data: stats } = useFeedbackStats();
  const activeBranches = branches?.filter((b) => b.active) ?? [];
  const inactiveBranches = branches?.filter((b) => !b.active) ?? [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--ds-text)' }}>
          Welcome back, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--ds-text-2)' }}>Here&apos;s an overview of your restaurant network.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Active Branches" value={isLoading ? '—' : activeBranches.length} sub={isLoading ? '' : `${inactiveBranches.length} inactive`} icon={<GitBranch className="h-3.5 w-3.5" />} loading={isLoading} />
        <MetricCard label="Total Feedback" value={stats?.totalFeedback ?? '—'} sub={stats?.totalFeedback ? 'All time' : 'No data yet'} icon={<MessageSquare className="h-3.5 w-3.5" />} />
        <MetricCard label="Avg. Rating" value={stats?.averageRating != null ? stats.averageRating.toFixed(2) : '—'} sub={stats?.totalFeedback ? 'out of 5.00' : 'No data yet'} icon={<TrendingUp className="h-3.5 w-3.5" />} iconColor="var(--ds-amber-text)" iconBg="var(--ds-amber-muted)" />
        <MetricCard label="Tables with QR" value="—" sub="Coming soon" icon={<QrCode className="h-3.5 w-3.5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Branches */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Branches</p>
            <Link href="/dashboard/branches" className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--ds-accent-text)' }}>
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-md px-4 py-3 flex items-center gap-3" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
                  <Skeleton className="w-7 h-7 rounded flex-shrink-0" />
                  <div className="flex-1 space-y-1.5"><Skeleton className="h-3 w-28" /><Skeleton className="h-2.5 w-44" /></div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && branches?.length === 0 && (
            <EmptyState icon={<GitBranch className="h-5 w-5" />} title="No branches yet" description="Add your first branch to start managing tables and collecting feedback."
              action={isOwner ? (
                <Link href="/dashboard/branches/new" className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}>
                  Add first branch
                </Link>
              ) : undefined}
            />
          )}

          {!isLoading && branches && branches.length > 0 && (
            <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)' }}>
              {branches.slice(0, 6).map((branch, i) => (
                <Link key={branch.id} href={`/dashboard/branches/${branch.id}/tables`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors group"
                  style={{ background: 'var(--ds-surface)', borderBottom: i < Math.min(branches.length, 6) - 1 ? '1px solid var(--ds-border)' : undefined }}
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

        {/* Quick actions */}
        <div className="space-y-3">
          <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Quick Actions</p>
          <div className="space-y-1.5">
            {[
              { href: '/dashboard/feedback', icon: MessageSquare, label: 'Customer Feedback', sub: 'Read submissions',  color: 'var(--ds-accent-text)',  bg: 'var(--ds-accent-muted)' },
              { href: '/dashboard/ai',       icon: Sparkles,      label: 'AI Insights',      sub: 'Generate summary',  color: 'var(--ds-violet-text)',  bg: 'var(--ds-violet-muted)' },
              { href: '/dashboard/qr',       icon: QrCode,        label: 'QR Codes',         sub: 'Download codes',    color: 'var(--ds-orange-text)',  bg: 'var(--ds-orange-muted)' },
              ...(isOwner ? [{ href: '/dashboard/managers', icon: Users, label: 'Team', sub: 'Manage managers', color: 'var(--ds-green-text)', bg: 'var(--ds-green-muted)' }] : []),
            ].map(({ href, icon: Icon, label, sub, color, bg }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors group"
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

          <div className="rounded-md p-4" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-3.5 w-3.5" style={{ color: 'var(--ds-text-3)' }} />
              <p className="text-xs font-semibold" style={{ color: 'var(--ds-text)' }}>Analytics</p>
            </div>
            <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>Rating trends and branch comparisons will appear here once feedback data is available.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
