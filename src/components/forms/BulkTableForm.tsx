'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { BulkTablesResponse } from '@/types';

const schema = z.object({
  count: z
    .number({ message: 'Count must be a number' })
    .int()
    .min(1, 'Must be at least 1')
    .max(100, 'Maximum 100'),
  prefix: z.string().optional(),
});

export type BulkTableFormData = z.infer<typeof schema>;

interface BulkTableFormProps {
  onSubmit: (data: BulkTableFormData) => Promise<BulkTablesResponse>;
}

export function BulkTableForm({ onSubmit }: BulkTableFormProps) {
  const [result, setResult] = useState<BulkTablesResponse | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BulkTableFormData>({
    resolver: zodResolver(schema),
    defaultValues: { count: 10, prefix: 'Table' },
  });

  async function handleFormSubmit(data: BulkTableFormData) {
    const res = await onSubmit(data);
    setResult(res);
  }

  if (result) {
    return (
      <div className="space-y-3">
        <div className="rounded px-4 py-3 flex items-start gap-3" style={{ background: 'var(--ds-green-muted)', border: '1px solid #22c55e33' }}>
          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ds-green-text)' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--ds-green-text)' }}>
              Created {result.created.length} table{result.created.length !== 1 ? 's' : ''}
            </p>
            {result.created.length > 0 && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--ds-green-text)' }}>
                {result.created.map((t) => t.label).join(', ')}
              </p>
            )}
          </div>
        </div>
        {result.skipped.length > 0 && (
          <div className="rounded px-4 py-3 flex items-start gap-3" style={{ background: 'var(--ds-amber-muted)', border: '1px solid #f59e0b33' }}>
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ds-amber-text)' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ds-amber-text)' }}>
                Skipped {result.skipped.length} existing table{result.skipped.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ds-amber-text)' }}>{result.skipped.join(', ')}</p>
            </div>
          </div>
        )}
        <button onClick={() => setResult(null)} className="text-sm font-medium hover:underline" style={{ color: 'var(--ds-accent-text)' }}>
          Create more tables
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="count">Number of tables <span style={{ color: 'var(--ds-red-text)' }}>*</span></Label>
        <Input id="count" type="number" min={1} max={100} {...register('count', { valueAsNumber: true })} className={errors.count ? 'border-[var(--ds-red)]' : ''} />
        {errors.count && <p className="text-xs" style={{ color: 'var(--ds-red-text)' }}>{errors.count.message}</p>}
        <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>Between 1 and 100</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="prefix">Label prefix <span className="font-normal" style={{ color: 'var(--ds-text-3)' }}>(optional)</span></Label>
        <Input id="prefix" placeholder="Table" {...register('prefix')} />
        <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>Tables will be named: Table 1, Table 2… (or your prefix + number)</p>
      </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create Tables'}</Button>
    </form>
  );
}
