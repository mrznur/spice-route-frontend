'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useMyRestaurant, useUpdateMyRestaurant } from '@/hooks/useRestaurant';
import { useAuth } from '@/lib/auth';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(150),
});
type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const { isOwner } = useAuth();
  const { data: restaurant, isLoading } = useMyRestaurant();
  const updateRestaurant = useUpdateMyRestaurant();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  // Populate form once data loads
  useEffect(() => {
    if (restaurant) reset({ name: restaurant.name });
  }, [restaurant, reset]);

  async function onSubmit(values: FormData) {
    try {
      await updateRestaurant.mutateAsync(values);
      toast.success('Restaurant name updated');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      toast.error(axiosErr.response?.data?.error || 'Failed to update');
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Restaurant Settings"
        subtitle="Manage your restaurant name and account preferences."
      />

      {/* Restaurant details */}
      <div className="rounded-md" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--ds-border)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Restaurant Details</p>
        </div>
        <div className="px-5 py-5 space-y-5">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-2/3" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Restaurant name — editable */}
              <div className="space-y-1.5">
                <Label htmlFor="name" style={{ color: 'var(--ds-text-2)' }}>Restaurant name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  disabled={!isOwner}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* Slug — read-only */}
              <div className="space-y-1.5">
                <Label style={{ color: 'var(--ds-text-2)' }}>URL slug</Label>
                <Input
                  value={restaurant?.slug ?? ''}
                  disabled
                  className="font-mono text-sm"
                />
                <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
                  Slug cannot be changed — it is embedded in existing QR code URLs.
                </p>
              </div>

              {/* Status — read-only */}
              <div className="space-y-1.5">
                <Label style={{ color: 'var(--ds-text-2)' }}>Status</Label>
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium"
                    style={restaurant?.status === 'ACTIVE'
                      ? { background: 'var(--ds-green-muted)', color: 'var(--ds-green-text)' }
                      : { background: 'var(--ds-red-muted)', color: 'var(--ds-red-text)' }
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full"
                      style={{ background: restaurant?.status === 'ACTIVE' ? 'var(--ds-green)' : 'var(--ds-red)' }}
                    />
                    {restaurant?.status ?? '—'}
                  </span>
                </div>
                {restaurant?.status === 'SUSPENDED' && (
                  <p className="text-xs" style={{ color: 'var(--ds-red-text)' }}>
                    Your restaurant is suspended. Contact platform support.
                  </p>
                )}
              </div>

              {isOwner && (
                <div className="pt-2">
                  <Button type="submit" disabled={isSubmitting || !isDirty} loading={isSubmitting}>
                    Save Changes
                  </Button>
                </div>
              )}

              {!isOwner && (
                <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
                  Editing restaurant settings requires Owner access.
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Account info — read-only display */}
      <div className="rounded-md" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--ds-border)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>Account Info</p>
        </div>
        <div className="px-5 py-5 space-y-3">
          <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--ds-border)' }}>
            <span className="text-xs" style={{ color: 'var(--ds-text-3)' }}>Restaurant ID</span>
            <span className="text-xs font-mono" style={{ color: 'var(--ds-text-2)' }}>{restaurant?.id?.slice(0, 8)}…</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs" style={{ color: 'var(--ds-text-3)' }}>Registered</span>
            <span className="text-xs" style={{ color: 'var(--ds-text-2)' }}>
              {restaurant?.createdAt
                ? new Date(restaurant.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
