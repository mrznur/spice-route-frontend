'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TableResponse } from '@/types';

const schema = z.object({
  label: z.string().min(1, 'Table label is required'),
  active: z.boolean().optional(),
});

export type TableFormData = z.infer<typeof schema>;

interface TableFormProps {
  defaultValues?: Partial<TableResponse>;
  onSubmit: (data: TableFormData) => Promise<void>;
  submitLabel?: string;
}

export function TableForm({ defaultValues, onSubmit, submitLabel = 'Save' }: TableFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TableFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: defaultValues?.label ?? '',
      active: defaultValues?.active ?? true,
    },
  });

  const active = watch('active');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="label">
          Table label <span style={{ color: 'var(--ds-red-text)' }}>*</span>
        </Label>
        <Input
          id="label"
          placeholder="Table 1"
          {...register('label')}
          className={errors.label ? 'border-[var(--ds-red)]' : ''}
        />
        {errors.label && (
          <p className="text-xs" style={{ color: 'var(--ds-red-text)' }}>{errors.label.message}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="active"
          checked={active ?? true}
          onCheckedChange={(v) => setValue('active', v)}
        />
        <Label htmlFor="active" className="cursor-pointer">Active</Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
