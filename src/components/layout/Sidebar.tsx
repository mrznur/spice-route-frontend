'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard, GitBranch, Users, QrCode,
  LogOut, X, ChevronLeft, ChevronRight,
  TrendingUp, MessageSquare, Sparkles, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem { href: string; label: string; icon: React.ReactNode; ownerOnly?: boolean; }
interface NavGroup { label: string; items: NavItem[]; }

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard',             label: 'Dashboard',        icon: <LayoutDashboard className="h-4 w-4" /> },
      { href: '/dashboard/performance', label: 'Performance',      icon: <TrendingUp className="h-4 w-4" /> },
      { href: '/dashboard/feedback',    label: 'Feedback',         icon: <MessageSquare className="h-4 w-4" /> },
      { href: '/dashboard/ai',          label: 'AI Insights',      icon: <Sparkles className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Restaurant',
    items: [
      { href: '/dashboard/branches',  label: 'Branches',   icon: <GitBranch className="h-4 w-4" /> },
      { href: '/dashboard/qr',        label: 'Tables & QR', icon: <QrCode className="h-4 w-4" /> },
      { href: '/dashboard/managers',  label: 'Team',        icon: <Users className="h-4 w-4" />, ownerOnly: true },
    ],
  },
  {
    label: 'Admin',
    items: [
      { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="h-4 w-4" />, ownerOnly: true },
    ],
  },
];

interface SidebarProps { collapsed?: boolean; onClose?: () => void; onToggleCollapse?: () => void; }

export function Sidebar({ collapsed = false, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, isOwner } = useAuth();
  const router = useRouter();

  function handleLogout() { logout(); router.push('/login'); }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';
  const roleLabel: Record<string, string> = { OWNER: 'Owner', MANAGER: 'Manager', SUPER_ADMIN: 'Super Admin' };

  return (
    <aside
      className={cn('flex h-full flex-col select-none transition-all duration-200 flex-shrink-0', collapsed ? 'w-14' : 'w-56')}
      style={{ background: 'var(--ds-sidebar)', borderRight: '1px solid var(--ds-border)' }}
    >
      {/* Logo */}
      <div
        className={cn('flex items-center h-14 flex-shrink-0 px-3', collapsed ? 'justify-center' : 'justify-between')}
        style={{ borderBottom: '1px solid var(--ds-border)' }}
      >
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded text-xs font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}>
              SR
            </div>
            <span className="text-sm font-semibold truncate" style={{ color: 'var(--ds-text)' }}>Spice Route</span>
          </Link>
        ) : (
          <div className="flex items-center justify-center w-6 h-6 rounded text-xs font-bold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}>
            SR
          </div>
        )}
        <div className="flex items-center gap-1">
          {!collapsed && onToggleCollapse && (
            <button onClick={onToggleCollapse} className="hidden lg:flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-white/5" style={{ color: 'var(--ds-text-3)' }}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-white/5" style={{ color: 'var(--ds-text-3)' }}>
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => !item.ownerOnly || isOwner);
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ds-text-3)' }}>
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-2.5 rounded text-sm transition-colors',
                        collapsed ? 'justify-center h-9 w-9 mx-auto' : 'px-2.5 py-2',
                      )}
                      style={
                        active
                          ? { background: 'var(--ds-accent-muted)', color: 'var(--ds-accent-text)', borderLeft: '2px solid var(--ds-accent-bright)' }
                          : { color: 'var(--ds-text-2)', paddingLeft: collapsed ? undefined : '0.625rem' }
                      }
                      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--ds-hover)'; }}
                      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = ''; }}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!collapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Expand button when collapsed */}
      {collapsed && onToggleCollapse && (
        <div className="hidden lg:flex justify-center pb-3">
          <button onClick={onToggleCollapse} className="flex items-center justify-center w-7 h-7 rounded transition-colors hover:bg-white/5" style={{ color: 'var(--ds-text-3)' }}>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* User footer */}
      <div className={cn('flex-shrink-0', collapsed ? 'p-2' : 'p-3')} style={{ borderTop: '1px solid var(--ds-border)' }}>
        {collapsed ? (
          <button onClick={handleLogout} title="Sign out" className="flex items-center justify-center w-full h-8 rounded transition-colors hover:bg-white/5" style={{ color: 'var(--ds-text-3)' }}>
            <LogOut className="h-3.5 w-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-2.5 group">
            <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--ds-text)' }}>{user?.name}</p>
              <p className="text-[10px] truncate" style={{ color: 'var(--ds-text-3)' }}>{user?.role ? roleLabel[user.role] ?? user.role : ''}</p>
            </div>
            <button onClick={handleLogout} title="Sign out" className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-white/5 opacity-0 group-hover:opacity-100" style={{ color: 'var(--ds-text-3)' }}>
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
