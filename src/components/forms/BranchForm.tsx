'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BranchResponse } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  address: z.string().optional(),
  active: z.boolean().optional(),
});

export type BranchFormData = z.infer<typeof schema>;

interface BranchFormProps {
  defaultValues?: Partial<BranchResponse>;
  onSubmit: (data: BranchFormData) => Promise<void>;
  submitLabel?: string;
}

export function BranchForm({ defaultValues, onSubmit, submitLabel = 'Save' }: BranchFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      address: defaultValues?.address ?? '',
      active: defaultValues?.active ?? true,
    },
  });

  const active = watch('active');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">
          Branch name <span style={{ color: 'var(--ds-red-text)' }}>*</span>
        </Label>
        <Input
          id="name"
          placeholder="Downtown"
          {...register('name')}
          className={errors.name ? 'border-[var(--ds-red)]' : ''}
        />
        {errors.name && <p className="text-xs" style={{ color: 'var(--ds-red-text)' }}>{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">
          Address <span className="font-normal" style={{ color: 'var(--ds-text-3)' }}>(optional)</span>
        </Label>
        <Input id="address" placeholder="123 Main St, City" {...register('address')} />
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
