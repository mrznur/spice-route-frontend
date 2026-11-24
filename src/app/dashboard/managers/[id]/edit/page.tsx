'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useManagers, useUpdateManager } from '@/hooks/useManagers';
import { useBranches } from '@/hooks/useBranches';
import { ManagerForm, UpdateManagerFormData } from '@/components/forms/ManagerForm';
import { FormShell } from '@/components/ui/form-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

export default function EditManagerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: managers, isLoading: managersLoading } = useManagers();
  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  const manager = managers?.find((m) => m.id === id);
  const updateManager = useUpdateManager(id);

  async function handleSubmit(data: UpdateManagerFormData) {
    try {
      await updateManager.mutateAsync(data);
      toast.success('Manager updated');
      router.push('/dashboard/managers');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      toast.error(axiosErr.response?.data?.error || 'Failed to update manager');
    }
  }

  return (
    <FormShell backHref="/dashboard/managers" backLabel="Team" title="Edit Manager" subtitle="Update account details and branch assignments.">
      {managersLoading && <div className="space-y-4"><Skeleton className="h-9 w-full" /><Skeleton className="h-9 w-full" /><Skeleton className="h-6 w-24" /></div>}
      {!managersLoading && !manager && <p className="text-sm text-red-500">Manager not found.</p>}
      {!managersLoading && manager && <ManagerForm mode="update" defaultValues={manager} branches={branches} branchesLoading={branchesLoading} onSubmit={handleSubmit} />}
    </FormShell>
  );
}
