'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Shield, Building2, BarChart3, CreditCard, AlertOctagon, LogOut } from 'lucide-react';

export default function AdminPage() {
  const { user, isSuperAdmin, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !isSuperAdmin) router.push('/dashboard');
    if (!isLoading && !user) router.push('/login');
  }, [user, isSuperAdmin, isLoading, router]);

  if (isLoading || !user || !isSuperAdmin) return null;

  const initials = user.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const planned = [
    { icon: Building2, label: 'All restaurants', desc: 'View and manage every registered tenant' },
    { icon: AlertOctagon, label: 'Restaurant status', desc: 'Suspend or reactivate tenants' },
    { icon: BarChart3, label: 'Platform statistics', desc: 'System-wide feedback and usage data' },
    { icon: CreditCard, label: 'Subscriptions', desc: 'Billing and plan management' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ds-bg)' }}>
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 flex-shrink-0"
        style={{ background: 'var(--ds-sidebar)', borderRight: '1px solid var(--ds-border)' }}
      >
        <div className="flex items-center gap-2.5 h-14 px-4" style={{ borderBottom: '1px solid var(--ds-border)' }}>
          <div className="flex items-center justify-center w-6 h-6 rounded text-white text-xs font-bold" style={{ background: 'var(--ds-accent)' }}>SR</div>
          <span className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Spice Route</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          <div className="px-2 py-1.5 mb-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ds-text-3)' }}>Platform</p>
          </div>
          <div
            className="flex items-center gap-2.5 rounded px-2.5 py-2 text-sm font-medium"
            style={{ background: 'var(--ds-accent-muted)', color: 'var(--ds-accent-text)' }}
          >
            <Shield className="h-4 w-4 flex-shrink-0" />
            Admin Console
          </div>
        </nav>
        <div className="p-3 group" style={{ borderTop: '1px solid var(--ds-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ background: 'var(--ds-accent)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--ds-text)' }}>{user.name}</p>
              <p className="text-[10px] truncate" style={{ color: 'var(--ds-text-3)' }}>Super Admin</p>
            </div>
            <button onClick={handleLogout} title="Sign out" className="flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-white/5 opacity-0 group-hover:opacity-100" style={{ color: 'var(--ds-text-3)' }}>
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between h-14 px-6" style={{ borderBottom: '1px solid var(--ds-border)', background: 'var(--ds-bg)' }}>
          <div>
            <span className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Admin Console</span>
            <span className="hidden sm:inline text-sm ml-2" style={{ color: 'var(--ds-text-3)' }}>— Platform administration</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs rounded px-3 py-1.5 transition-colors hover:bg-white/5" style={{ color: 'var(--ds-text-2)', border: '1px solid var(--ds-border)' }}>
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-9 h-9 rounded" style={{ background: 'var(--ds-accent-muted)' }}>
                <Shield className="h-5 w-5" style={{ color: 'var(--ds-accent-text)' }} />
              </div>
              <div>
                <h1 className="text-lg font-semibold" style={{ color: 'var(--ds-text)' }}>Super Admin Console</h1>
                <p className="text-sm" style={{ color: 'var(--ds-text-2)' }}>Signed in as {user.email}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--ds-text-3)' }}>Planned features</p>
            <div className="rounded-md overflow-hidden" style={{ border: '1px solid var(--ds-border)' }}>
              {planned.map(({ icon: Icon, label, desc }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-4 px-4 py-3.5"
                  style={{ borderBottom: i < planned.length - 1 ? '1px solid var(--ds-border)' : undefined, background: 'var(--ds-surface)' }}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded flex-shrink-0" style={{ background: 'var(--ds-elevated)' }}>
                    <Icon className="h-4 w-4" style={{ color: 'var(--ds-text-2)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--ds-text)' }}>{label}</p>
                    <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>{desc}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ background: 'var(--ds-elevated)', color: 'var(--ds-text-3)', border: '1px solid var(--ds-border)' }}>
                      Planned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md p-4 flex items-start gap-3" style={{ background: 'var(--ds-amber-muted)', border: '1px solid var(--ds-amber)/20' }}>
            <AlertOctagon className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ds-amber-text)' }} />
            <p className="text-xs" style={{ color: 'var(--ds-amber-text)' }}>
              Admin API endpoints are not yet built. This console will be fully functional once the backend Day 4 endpoints are implemented.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
