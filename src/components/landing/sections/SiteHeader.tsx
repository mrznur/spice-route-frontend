import Link from 'next/link';
import { NavLogo } from '@/components/landing/LandingMotion';

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'var(--ds-sidebar)', borderBottom: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
        <Link href="/" aria-label="Spice Route home" className="flex items-center">
          <NavLogo />
        </Link>

        <nav className="flex items-center gap-2" aria-label="Account">
          <Link
            href="/login"
            className="text-sm font-medium px-3 py-1.5 rounded hover:border lp-btn-outline"
            style={{ color: 'var(--ds-text-2)', transition: 'background 0.15s' }}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="lp-btn-primary text-sm font-semibold px-3 py-1.5 rounded"
          >
            Get started free
          </Link>
        </nav>
      </div>
    </header>
  );
}
