'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateBranch } from '@/hooks/useBranches';
import { BranchForm, BranchFormData } from '@/components/forms/BranchForm';
import { FormShell } from '@/components/ui/form-shell';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

export default function NewBranchPage() {
  const router = useRouter();
  const createBranch = useCreateBranch();

  async function handleSubmit(data: BranchFormData) {
    try {
      await createBranch.mutateAsync(data);
      toast.success('Branch created');
      router.push('/dashboard/branches');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      toast.error(axiosErr.response?.data?.error || 'Failed to create branch');
    }
  }

  return (
    <FormShell backHref="/dashboard/branches" backLabel="Branches" title="New Branch" subtitle="Add a new location to your restaurant network.">
      <BranchForm onSubmit={handleSubmit} submitLabel="Create Branch" />
    </FormShell>
  );
}
