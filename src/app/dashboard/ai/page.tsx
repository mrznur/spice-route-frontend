'use client';

import { useState } from 'react';
import { useBranches } from '@/hooks/useBranches';
import { useAiSummary } from '@/hooks/useAiSummary';
import { PageHeader } from '@/components/ui/page-header';
import { AiFinding, ApiError } from '@/types';
import {
  Sparkles, ChevronDown, Loader2, AlertTriangle,
  ThumbsUp, ThumbsDown, RefreshCw, CheckCircle,
  Lightbulb, AlertCircle, Quote,
} from 'lucide-react';
import { AxiosError } from 'axios';

// ── helpers ───────────────────────────────────────────────────────────────
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const today = iso(new Date());
const thirtyDaysAgo = (() => { const d = new Date(); d.setDate(d.getDate() - 29); return iso(d); })();

const SENTIMENT_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  positive: { label: 'Positive',  color: 'var(--ds-green-text)',  bg: 'var(--ds-green-muted)' },
  mixed:    { label: 'Mixed',     color: 'var(--ds-amber-text)',  bg: 'var(--ds-amber-muted)' },
  negative: { label: 'Negative',  color: 'var(--ds-red-text)',    bg: 'var(--ds-red-muted)'   },
};

function FindingCard({ finding, type }: { finding: AiFinding; type: 'praise' | 'complaint' }) {
  const [expanded, setExpanded] = useState(false);
  const color = type === 'praise' ? 'var(--ds-green-text)' : 'var(--ds-red-text)';
  const bg    = type === 'praise' ? 'var(--ds-green-muted)' : 'var(--ds-red-muted)';

  return (
    <div className="rounded-md p-3 space-y-2" style={{ background: 'var(--ds-elevated)', border: '1px solid var(--ds-border)' }}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium flex-1" style={{ color: 'var(--ds-text)' }}>
          {finding.finding}
        </p>
        {/* F4.5 — mention count */}
        <span className="flex-shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold tabular-nums"
          style={{ background: bg, color }}>
          {finding.mentionCount}×
        </span>
      </div>

      {/* F4.6 — example quotes */}
      {finding.examples.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[11px] flex items-center gap-1"
            style={{ color: 'var(--ds-text-3)' }}
          >
            <Quote className="h-3 w-3" />
            {expanded ? 'Hide' : 'Show'} {finding.examples.length} quote{finding.examples.length !== 1 ? 's' : ''}
          </button>
          {expanded && (
            <div className="mt-2 space-y-1.5">
              {finding.examples.map((ex, i) => (
                <p key={i} className="text-xs italic pl-3 border-l-2"
                  style={{ color: 'var(--ds-text-2)', borderColor: 'var(--ds-border-2)' }}>
                  &ldquo;{ex}&rdquo;
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────
export default function AiInsightsPage() {
  const { data: branches } = useBranches();
  const [branchId, setBranchId] = useState('');
  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo);
  const [dateTo,   setDateTo]   = useState(today);

  const { mutate, data: result, isPending, error, reset } = useAiSummary();

  const apiError = error as AxiosError<ApiError> | null;
  const errorMsg = apiError?.response?.data?.error ?? apiError?.message ?? 'Something went wrong';
  const isInsufficient = apiError?.response?.status === 422;
  const isTimeout      = apiError?.response?.status === 504;

  function handleGenerate() {
    if (!branchId) return;
    reset();
    mutate({ branchId, dateFrom, dateTo });
  }

  const selectStyle = {
    border: '1px solid var(--ds-border-2)',
    background: 'var(--ds-elevated)',
    color: 'var(--ds-text)',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <PageHeader
        title="AI Insights"
        subtitle="Select a branch and date range to generate an AI-powered feedback analysis."
      />

      {/* F4.1 — Request form */}
      <div
        className="rounded-md p-5 space-y-4"
        style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Branch selector */}
          <div className="relative">
            <select
              className="flex h-9 w-full appearance-none rounded px-3 pr-8 text-sm focus:outline-none"
              style={selectStyle}
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            >
              <option value="">Select a branch…</option>
              {branches?.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--ds-text-3)' }} />
          </div>

          {/* Date from */}
          <input
            type="date"
            value={dateFrom}
            max={dateTo}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 w-full rounded px-3 text-sm focus:outline-none"
            style={{ ...selectStyle, colorScheme: 'dark' }}
          />

          {/* Date to */}
          <input
            type="date"
            value={dateTo}
            min={dateFrom}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 w-full rounded px-3 text-sm focus:outline-none"
            style={{ ...selectStyle, colorScheme: 'dark' }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
            Requires at least 5 customer comments in the selected period.
          </p>
          <button
            onClick={handleGenerate}
            disabled={!branchId || isPending}
            className="inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--ds-accent)' }}
          >
            {isPending
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Analysing…</>
              : <><Sparkles className="h-4 w-4" /> Generate Summary</>
            }
          </button>
        </div>
      </div>

      {/* F4.3 — Loading state */}
      {isPending && (
        <div
          className="rounded-md flex flex-col items-center justify-center py-16 gap-4 text-center"
          style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full" style={{ background: 'var(--ds-violet-muted)' }} />
            <Sparkles className="h-6 w-6 absolute top-3 left-3 animate-pulse" style={{ color: 'var(--ds-violet-text)' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Analysing feedback…</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ds-text-3)' }}>
              Sending comments to AI, stripping personal data, generating structured report
            </p>
          </div>
        </div>
      )}

      {/* F4.7 — Insufficient data */}
      {error && isInsufficient && (
        <div className="rounded-md px-4 py-4 flex items-start gap-3"
          style={{ background: 'var(--ds-amber-muted)', border: '1px solid #f59e0b33' }}>
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--ds-amber-text)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--ds-amber-text)' }}>Not enough data</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ds-amber-text)', opacity: 0.8 }}>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* F4.9 — Timeout error */}
      {error && isTimeout && (
        <div className="rounded-md px-4 py-4 flex items-start gap-3"
          style={{ background: 'var(--ds-red-muted)', border: '1px solid #ef444433' }}>
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--ds-red-text)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--ds-red-text)' }}>AI service timed out</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ds-red-text)', opacity: 0.8 }}>
              The AI service is under heavy load. Please try again in a moment.
            </p>
          </div>
        </div>
      )}

      {/* F4.9 — Generic error */}
      {error && !isInsufficient && !isTimeout && (
        <div className="rounded-md px-4 py-4 flex items-start gap-3"
          style={{ background: 'var(--ds-red-muted)', border: '1px solid #ef444433' }}>
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--ds-red-text)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--ds-red-text)' }}>Analysis failed</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ds-red-text)', opacity: 0.8 }}>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* F4.4 — Full report */}
      {result && !isPending && (
        <div className="space-y-4">
          {/* Report header */}
          <div
            className="rounded-md px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
            style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              {/* F4.8 — cached badge */}
              {result.cached && (
                <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium"
                  style={{ background: 'var(--ds-green-muted)', color: 'var(--ds-green-text)' }}>
                  <RefreshCw className="h-3 w-3" /> Cached result
                </span>
              )}

              {/* Sentiment */}
              {(() => {
                const s = SENTIMENT_STYLE[result.overallSentiment] ?? SENTIMENT_STYLE.mixed;
                return (
                  <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: s.bg, color: s.color }}>
                    Overall: {s.label}
                  </span>
                );
              })()}

              <span className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
                Based on {result.commentCount} comment{result.commentCount !== 1 ? 's' : ''} ·{' '}
                {result.dateFrom} → {result.dateTo}
              </span>
            </div>

            <button
              onClick={() => mutate({ branchId, dateFrom, dateTo })}
              className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium"
              style={{ border: '1px solid var(--ds-border-2)', color: 'var(--ds-text-2)' }}
            >
              <RefreshCw className="h-3 w-3" /> Regenerate
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Praises */}
            {result.praises.length > 0 && (
              <ReportSection
                title="What customers love"
                icon={<ThumbsUp className="h-4 w-4" />}
                color="var(--ds-green-text)"
                bg="var(--ds-green-muted)"
              >
                <div className="space-y-2">
                  {result.praises.map((f, i) => (
                    <FindingCard key={i} finding={f} type="praise" />
                  ))}
                </div>
              </ReportSection>
            )}

            {/* Complaints */}
            {result.complaints.length > 0 && (
              <ReportSection
                title="What needs attention"
                icon={<ThumbsDown className="h-4 w-4" />}
                color="var(--ds-red-text)"
                bg="var(--ds-red-muted)"
              >
                <div className="space-y-2">
                  {result.complaints.map((f, i) => (
                    <FindingCard key={i} finding={f} type="complaint" />
                  ))}
                </div>
              </ReportSection>
            )}

            {/* Recurring issues */}
            {result.recurringIssues.length > 0 && (
              <ReportSection
                title="Recurring issues"
                icon={<AlertCircle className="h-4 w-4" />}
                color="var(--ds-amber-text)"
                bg="var(--ds-amber-muted)"
              >
                <ul className="space-y-2">
                  {result.recurringIssues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--ds-amber-text)' }} />
                      <span className="text-sm" style={{ color: 'var(--ds-text-2)' }}>{issue}</span>
                    </li>
                  ))}
                </ul>
              </ReportSection>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <ReportSection
                title="Improvement suggestions"
                icon={<Lightbulb className="h-4 w-4" />}
                color="var(--ds-violet-text)"
                bg="var(--ds-violet-muted)"
              >
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--ds-violet-text)' }} />
                      <span className="text-sm" style={{ color: 'var(--ds-text-2)' }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </ReportSection>
            )}
          </div>

          {/* Empty report notice */}
          {result.praises.length === 0 && result.complaints.length === 0 &&
           result.recurringIssues.length === 0 && result.suggestions.length === 0 && (
            <div className="rounded-md px-4 py-4 text-center" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
              <p className="text-sm" style={{ color: 'var(--ds-text-3)' }}>
                The AI found no clear patterns in this period. Try a wider date range or more feedback.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial empty state */}
      {!result && !isPending && !error && (
        <div
          className="rounded-md flex flex-col items-center justify-center py-16 gap-3 text-center"
          style={{ background: 'var(--ds-surface)', border: '1px dashed var(--ds-border-2)' }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-md"
            style={{ background: 'var(--ds-violet-muted)', color: 'var(--ds-violet-text)' }}>
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--ds-text)' }}>
            Select a branch and date range to begin
          </p>
          <p className="text-xs max-w-sm" style={{ color: 'var(--ds-text-3)' }}>
            The AI reads customer comments, strips personal information, and returns a structured
            report of sentiment, common praises, complaints, recurring issues, and improvement suggestions.
          </p>
        </div>
      )}
    </div>
  );
}

function ReportSection({
  title, icon, color, bg, children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md p-4 space-y-3" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded flex-shrink-0"
          style={{ background: bg, color }}>
          {icon}
        </div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}
