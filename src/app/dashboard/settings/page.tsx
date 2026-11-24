'use client';

import { Settings } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Manage your restaurant name, preferences, and account options."
      />
      <div
        className="rounded-md flex flex-col items-center justify-center py-20 gap-4 text-center"
        style={{ background: 'var(--ds-surface)', border: '1px dashed var(--ds-border-2)' }}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-md" style={{ background: 'var(--ds-elevated)', color: 'var(--ds-text-2)' }}>
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--ds-text)' }}>Settings coming soon</p>
          <p className="text-xs max-w-sm" style={{ color: 'var(--ds-text-3)' }}>
            Restaurant name, slug editing, and account preferences will appear here once the settings endpoint is built.
          </p>
        </div>
      </div>
    </div>
  );
}
