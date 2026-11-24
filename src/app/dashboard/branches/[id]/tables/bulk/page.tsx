'use client';
import { toast } from 'sonner';
import { useBulkCreateTables } from '@/hooks/useTables';
import { useBranches } from '@/hooks/useBranches';
import { BulkTableForm, BulkTableFormData } from '@/components/forms/BulkTableForm';
import { FormShell } from '@/components/ui/form-shell';
import { AxiosError } from 'axios';
import { ApiError, BulkTablesResponse } from '@/types';

export default function BulkTablesPage({ params }: { params: { id: string } }) {
  const { id: branchId } = params;
  const bulkCreate = useBulkCreateTables(branchId);
  const { data: branches } = useBranches();
  const branch = branches?.find((b) => b.id === branchId);

  async function handleSubmit(data: BulkTableFormData): Promise<BulkTablesResponse> {
    try {
      const result = await bulkCreate.mutateAsync(data);
      toast.success(`Created ${result.created.length} tables`);
      return result;
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      toast.error(axiosErr.response?.data?.error || 'Failed to create tables');
      throw err;
    }
  }

  return (
    <FormShell
      backHref={`/dashboard/branches/${branchId}/tables`}
      backLabel={branch ? branch.name : 'Tables'}
      title="Bulk Add Tables"
      subtitle="Create multiple tables at once. Labels that already exist are skipped."
    >
      <BulkTableForm onSubmit={handleSubmit} />
    </FormShell>
  );
}
