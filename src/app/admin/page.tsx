'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useAdminRestaurants, useAdminStats, useAdminUsers, useUpdateRestaurantStatus } from '@/hooks/useAdminApi';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Shield, Building2, Users, MessageSquare, TrendingUp,
  LogOut, ChevronDown, CheckCircle, XCircle, Loader2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// ── helpers ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, loading }: { label: string; value: number | string; icon: React.ReactNode; loading?: boolean }) {
  return (
    <div className="rounded-md p-4" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-medium" style={{ color: 'var(--ds-text-2)' }}>{label}</p>
        <div className="flex items-center justify-center w-7 h-7 rounded flex-shrink-0"
          style={{ background: 'var(--ds-accent-muted)', color: 'var(--ds-accent-text)' }}>
          {icon}
        </div>
      </div>
      {loading
        ? <Skeleton className="h-7 w-16" />
        : <p className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--ds-text)' }}>{value}</p>
      }
    </div>
  );
}

type Tab = 'restaurants' | 'users';

// ── page ──────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, isSuperAdmin, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('restaurants');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && !isSuperAdmin) router.push('/dashboard');
  }, [user, isSuperAdmin, authLoading, router]);

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: restaurants, isLoading: restLoading } = useAdminRestaurants();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const updateStatus = useUpdateRestaurantStatus();

  if (authLoading || !user || !isSuperAdmin) return null;

  const initials = user.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  async function handleToggle(id: string, current: 'ACTIVE' | 'SUSPENDED', name: string) {
    const next = current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toast.success(`${name} is now ${next.toLowerCase()}`);
    } catch {
      toast.error('Failed to update status');
    }
  }

  const filteredRest = restaurants?.filter(
    (r) => statusFilter === 'ALL' || r.status === statusFilter
  ) ?? [];

  const selectStyle = {
    border: '1px solid var(--ds-border-2)',
    background: 'var(--ds-elevated)',
    color: 'var(--ds-text)',
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ds-bg)' }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0"
        style={{ background: 'var(--ds-sidebar)', borderRight: '1px solid var(--ds-border)' }}>
        <div className="flex items-center gap-2.5 h-14 px-4" style={{ borderBottom: '1px solid var(--ds-border)' }}>
          <div className="flex items-center justify-center w-6 h-6 rounded text-white text-xs font-bold" style={{ background: 'var(--ds-accent)' }}>SR</div>
          <span className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Spice Route</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--ds-text-3)' }}>Platform</p>
          {(['restaurants', 'users'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="w-full flex items-center gap-2.5 rounded px-2.5 py-2 text-sm font-medium text-left transition-colors"
              style={tab === t
                ? { background: 'var(--ds-accent)', color: '#fff' }
                : { color: 'var(--ds-text-2)' }
              }
            >
              {t === 'restaurants' ? <Building2 className="h-4 w-4 flex-shrink-0" /> : <Users className="h-4 w-4 flex-shrink-0" />}
              {t === 'restaurants' ? 'Restaurants' : 'Users'}
            </button>
          ))}
        </nav>
        <div className="p-3 group" style={{ borderTop: '1px solid var(--ds-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ background: 'var(--ds-accent)' }}>{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--ds-text)' }}>{user.name}</p>
              <p className="text-[10px] truncate" style={{ color: 'var(--ds-text-3)' }}>Super Admin</p>
            </div>
            <button onClick={() => { logout(); router.push('/login'); }} title="Sign out"
              className="flex items-center justify-center w-6 h-6 rounded opacity-0 group-hover:opacity-100 transition-all"
              style={{ color: 'var(--ds-text-3)' }}>
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-14 px-6 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--ds-border)', background: 'var(--ds-bg)' }}>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" style={{ color: 'var(--ds-accent-text)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Admin Console</span>
          </div>
          <button onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center gap-2 text-xs rounded px-3 py-1.5 transition-colors"
            style={{ color: 'var(--ds-text-2)', border: '1px solid var(--ds-border)' }}>
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* F5.4 — Platform stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Restaurants" value={stats?.restaurantCount ?? '—'} icon={<Building2 className="h-3.5 w-3.5" />} loading={statsLoading} />
            <StatCard label="Total Users" value={stats?.userCount ?? '—'} icon={<Users className="h-3.5 w-3.5" />} loading={statsLoading} />
            <StatCard label="Feedback Today" value={stats?.feedbackToday ?? '—'} icon={<MessageSquare className="h-3.5 w-3.5" />} loading={statsLoading} />
            <StatCard label="Total Feedback" value={stats?.feedbackTotal ?? '—'} icon={<TrendingUp className="h-3.5 w-3.5" />} loading={statsLoading} />
          </div>

          {/* F5.2 — Restaurant list */}
          {tab === 'restaurants' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>
                  Registered Restaurants
                  {restaurants && <span className="ml-2 text-xs font-normal" style={{ color: 'var(--ds-text-3)' }}>({filteredRest.length})</span>}
                </h2>
                <div className="relative">
                  <select className="flex h-8 appearance-none rounded px-3 pr-8 text-xs focus:outline-none"
                    style={selectStyle} value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
                    <option value="ALL">All statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3" style={{ color: 'var(--ds-text-3)' }} />
                </div>
              </div>

              {restLoading && (
                <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}>
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3.5" style={{ borderBottom: '1px solid var(--ds-border)' }}>
                      <Skeleton className="w-8 h-8 rounded flex-shrink-0" />
                      <div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-36" /><Skeleton className="h-3 w-48" /></div>
                      <Skeleton className="h-6 w-20 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {!restLoading && filteredRest.length === 0 && (
                <div className="rounded-md flex items-center justify-center py-12 text-sm"
                  style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)', color: 'var(--ds-text-3)' }}>
                  No restaurants found
                </div>
              )}

              {!restLoading && filteredRest.length > 0 && (
                <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead style={{ background: 'var(--ds-table-header)', borderBottom: '1px solid var(--ds-border)' }}>
                        <tr>
                          {['Restaurant', 'Owner', 'Branches', 'Feedback', 'Status', 'Created', ''].map((h, i) => (
                            <th key={i} className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide ${i >= 2 && i <= 3 ? 'hidden md:table-cell' : ''} ${i === 5 ? 'hidden lg:table-cell' : ''} ${i === 6 ? 'text-right' : ''}`}
                              style={{ color: 'var(--ds-text-3)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRest.map((r) => (
                          <tr key={r.id} style={{ borderBottom: '1px solid var(--ds-border)' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ds-hover)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm font-medium" style={{ color: 'var(--ds-text)' }}>{r.name}</p>
                                <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>{r.slug}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm" style={{ color: 'var(--ds-text-2)' }}>{r.ownerName ?? '—'}</p>
                                <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>{r.ownerEmail ?? ''}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-sm tabular-nums" style={{ color: 'var(--ds-text-2)' }}>{r.branchCount}</td>
                            <td className="px-4 py-3 hidden md:table-cell text-sm tabular-nums" style={{ color: 'var(--ds-text-2)' }}>{r.feedbackCount}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium"
                                style={r.status === 'ACTIVE'
                                  ? { background: 'var(--ds-green-muted)', color: 'var(--ds-green-text)' }
                                  : { background: 'var(--ds-red-muted)', color: 'var(--ds-red-text)' }}>
                                {r.status === 'ACTIVE'
                                  ? <CheckCircle className="h-3 w-3" />
                                  : <XCircle className="h-3 w-3" />}
                                {r.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell text-sm" style={{ color: 'var(--ds-text-3)' }}>{formatDate(r.createdAt)}</td>
                            {/* F5.3 — suspend/activate toggle */}
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleToggle(r.id, r.status, r.name)}
                                disabled={updateStatus.isPending}
                                className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
                                style={r.status === 'ACTIVE'
                                  ? { border: '1px solid var(--ds-border-2)', color: 'var(--ds-red-text)' }
                                  : { border: '1px solid var(--ds-border-2)', color: 'var(--ds-green-text)' }}
                              >
                                {updateStatus.isPending && updateStatus.variables?.id === r.id
                                  ? <Loader2 className="h-3 w-3 animate-spin" />
                                  : r.status === 'ACTIVE' ? 'Suspend' : 'Activate'
                                }
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Users tab */}
          {tab === 'users' && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>
                All Users
                {users && <span className="ml-2 text-xs font-normal" style={{ color: 'var(--ds-text-3)' }}>({users.length})</span>}
              </h2>

              {usersLoading && (
                <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}>
                  {[1,2,3].map((i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3.5" style={{ borderBottom: '1px solid var(--ds-border)' }}>
                      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-32" /><Skeleton className="h-3 w-48" /></div>
                    </div>
                  ))}
                </div>
              )}

              {!usersLoading && users && (
                <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead style={{ background: 'var(--ds-table-header)', borderBottom: '1px solid var(--ds-border)' }}>
                        <tr>
                          {['User', 'Email', 'Role', 'Restaurant', 'Status', 'Joined'].map((h, i) => (
                            <th key={i} className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide ${i === 1 ? 'hidden sm:table-cell' : ''} ${i === 3 ? 'hidden lg:table-cell' : ''} ${i === 5 ? 'hidden md:table-cell' : ''}`}
                              style={{ color: 'var(--ds-text-3)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} style={{ borderBottom: '1px solid var(--ds-border)' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ds-hover)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-semibold text-white flex-shrink-0"
                                  style={{ background: u.role === 'SUPER_ADMIN' ? 'var(--ds-accent)' : 'var(--ds-elevated)' }}>
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-sm" style={{ color: 'var(--ds-text)' }}>{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell text-sm" style={{ color: 'var(--ds-text-2)' }}>{u.email}</td>
                            <td className="px-4 py-3">
                              <span className="text-[11px] rounded px-1.5 py-0.5"
                                style={u.role === 'SUPER_ADMIN'
                                  ? { background: 'var(--ds-accent-muted)', color: 'var(--ds-accent-text)' }
                                  : u.role === 'OWNER'
                                  ? { background: 'var(--ds-amber-muted)', color: 'var(--ds-amber-text)' }
                                  : { background: 'var(--ds-elevated)', color: 'var(--ds-text-2)' }
                                }>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell text-sm" style={{ color: 'var(--ds-text-3)' }}>{u.restaurantName ?? '—'}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 text-[11px] rounded px-1.5 py-0.5"
                                style={u.active
                                  ? { background: 'var(--ds-green-muted)', color: 'var(--ds-green-text)' }
                                  : { background: 'var(--ds-red-muted)', color: 'var(--ds-red-text)' }}>
                                {u.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-sm" style={{ color: 'var(--ds-text-3)' }}>{formatDate(u.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
