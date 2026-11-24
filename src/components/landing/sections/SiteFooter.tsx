import Image from 'next/image';
import { logoFilter } from '@/components/landing/styles';

export function SiteFooter() {
  return (
    <footer
      className="py-5"
      style={{ background: 'var(--ds-bg)', borderTop: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Image
          src="/spice-route-logo.webp"
          alt="Spice Route"
          width={80}
          height={41}
          className="object-contain"
          style={{ ...logoFilter, opacity: 0.5 }}
        />
        <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
          © {new Date().getFullYear()} Spice Route. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
