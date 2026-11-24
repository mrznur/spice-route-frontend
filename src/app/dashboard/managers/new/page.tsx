'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateManager } from '@/hooks/useManagers';
import { useBranches } from '@/hooks/useBranches';
import { ManagerForm, CreateManagerFormData } from '@/components/forms/ManagerForm';
import { FormShell } from '@/components/ui/form-shell';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

export default function NewManagerPage() {
  const router = useRouter();
  const createManager = useCreateManager();
  const { data: branches = [], isLoading: branchesLoading } = useBranches();

  async function handleSubmit(data: CreateManagerFormData) {
    try {
      await createManager.mutateAsync(data);
      toast.success('Manager created');
      router.push('/dashboard/managers');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const apiError = axiosErr.response?.data;
      if (apiError?.errors) {
        toast.error(Object.values(apiError.errors).join(', '));
      } else {
        toast.error(apiError?.error || 'Failed to create manager');
      }
    }
  }

  return (
    <FormShell backHref="/dashboard/managers" backLabel="Team" title="New Manager" subtitle="Create an account and assign branch access.">
      <ManagerForm mode="create" branches={branches} branchesLoading={branchesLoading} onSubmit={handleSubmit} />
    </FormShell>
  );
}
