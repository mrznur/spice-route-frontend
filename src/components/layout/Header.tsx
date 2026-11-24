'use client';

import { Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface HeaderProps { onMenuClick: () => void; }

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard':              { title: 'Dashboard',         subtitle: 'Restaurant overview' },
  '/dashboard/performance':  { title: 'Performance',       subtitle: 'Ratings & trends' },
  '/dashboard/feedback':     { title: 'Customer Feedback', subtitle: 'Submissions & reviews' },
  '/dashboard/ai':           { title: 'AI Insights',       subtitle: 'Sentiment analysis' },
  '/dashboard/branches':     { title: 'Branches',          subtitle: 'Location management' },
  '/dashboard/qr':           { title: 'Tables & QR Codes', subtitle: 'QR code management' },
  '/dashboard/managers':     { title: 'Team',              subtitle: 'Manager accounts' },
  '/dashboard/settings':     { title: 'Settings',          subtitle: 'Restaurant preferences' },
};

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() { logout(); router.push('/login'); }

  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  const matched = Object.keys(pageTitles)
    .filter((k) => pathname === k || pathname.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0];
  const pageInfo = matched ? pageTitles[matched] : { title: 'Dashboard' };

  const roleLabel: Record<string, string> = { OWNER: 'Owner', MANAGER: 'Manager', SUPER_ADMIN: 'Super Admin' };

  return (
    <header
      className="sticky top-0 z-30 flex h-14 flex-shrink-0 items-center gap-4 px-5"
      style={{ background: 'var(--ds-bg)', borderBottom: '1px solid var(--ds-border)' }}
    >
      <button className="lg:hidden flex items-center justify-center w-8 h-8 rounded transition-colors hover:bg-white/5" style={{ color: 'var(--ds-text-2)' }} onClick={onMenuClick}>
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>{pageInfo.title}</span>
        {pageInfo.subtitle && (
          <span className="hidden sm:inline text-sm ml-2" style={{ color: 'var(--ds-text-3)' }}>— {pageInfo.subtitle}</span>
        )}
      </div>

      <div className="flex items-center gap-3" ref={menuRef}>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={cn('flex items-center gap-2 rounded px-2 py-1.5 transition-colors', menuOpen ? 'bg-white/5' : 'hover:bg-white/5')}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold flex-shrink-0" style={{ background: 'var(--ds-accent)', color: 'var(--ds-cream)' }}>
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium leading-tight" style={{ color: 'var(--ds-text)' }}>{user?.name}</p>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--ds-text-3)' }}>{user?.role ? roleLabel[user.role] ?? user.role : ''}</p>
            </div>
            <ChevronDown className={cn('h-3 w-3 hidden sm:block transition-transform', menuOpen ? 'rotate-180' : '')} style={{ color: 'var(--ds-text-3)' }} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 rounded shadow-xl py-1 z-50" style={{ background: 'var(--ds-elevated)', border: '1px solid var(--ds-border)' }}>
              <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--ds-border)' }}>
                <p className="text-xs font-medium truncate" style={{ color: 'var(--ds-text)' }}>{user?.name}</p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--ds-text-3)' }}>{user?.email}</p>
              </div>
              <button className="flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/5" style={{ color: 'var(--ds-text-2)' }} onClick={() => setMenuOpen(false)}>
                <User className="h-3.5 w-3.5" /> Profile
              </button>
              <button className="flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/5" style={{ color: 'var(--ds-red-text)' }} onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
