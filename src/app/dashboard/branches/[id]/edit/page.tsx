'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useBranches, useUpdateBranch } from '@/hooks/useBranches';
import { BranchForm, BranchFormData } from '@/components/forms/BranchForm';
import { FormShell } from '@/components/ui/form-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

export default function EditBranchPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: branches, isLoading } = useBranches();
  const branch = branches?.find((b) => b.id === id);
  const updateBranch = useUpdateBranch(id);

  async function handleSubmit(data: BranchFormData) {
    try {
      await updateBranch.mutateAsync(data);
      toast.success('Branch updated');
      router.push('/dashboard/branches');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      toast.error(axiosErr.response?.data?.error || 'Failed to update branch');
    }
  }

  return (
    <FormShell backHref="/dashboard/branches" backLabel="Branches" title="Edit Branch" subtitle="Update location details.">
      {isLoading && <div className="space-y-4"><Skeleton className="h-9 w-full" /><Skeleton className="h-9 w-full" /><Skeleton className="h-9 w-24" /></div>}
      {!isLoading && !branch && <p className="text-sm text-red-500">Branch not found.</p>}
      {!isLoading && branch && <BranchForm defaultValues={branch} onSubmit={handleSubmit} submitLabel="Save Changes" />}
    </FormShell>
  );
}
