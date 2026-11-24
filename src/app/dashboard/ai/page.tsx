'use client';

import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function AiInsightsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <PageHeader
        title="AI Insights"
        subtitle="Select a branch and date range to generate an AI-powered feedback summary."
      />
      <div
        className="rounded-md flex flex-col items-center justify-center py-20 gap-4 text-center"
        style={{ background: 'var(--ds-surface)', border: '1px dashed var(--ds-border-2)' }}
      >
        <div
          className="flex items-center justify-center w-10 h-10 rounded-md"
          style={{ background: 'var(--ds-violet-muted)', color: 'var(--ds-violet-text)' }}
        >
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--ds-text)' }}>
            AI Analysis coming soon
          </p>
          <p className="text-xs max-w-sm leading-relaxed" style={{ color: 'var(--ds-text-3)' }}>
            Once the AI summary endpoint is built, this page will generate full sentiment analysis,
            surface recurring complaints, praises, and improvement suggestions — all grounded in
            real customer comments.
          </p>
        </div>
      </div>
    </div>
  );
}
