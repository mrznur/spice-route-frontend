'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTables, useUpdateTable } from '@/hooks/useTables';
import { useBranches } from '@/hooks/useBranches';
import { TableForm, TableFormData } from '@/components/forms/TableForm';
import { FormShell } from '@/components/ui/form-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

export default function EditTablePage({ params }: { params: { id: string; tableId: string } }) {
  const { id: branchId, tableId } = params;
  const router = useRouter();
  const { data: branches } = useBranches();
  const branch = branches?.find((b) => b.id === branchId);
  const { data: tables, isLoading } = useTables(branchId);
  const table = tables?.find((t) => t.id === tableId);
  const updateTable = useUpdateTable();

  async function handleSubmit(data: TableFormData) {
    try {
      await updateTable.mutateAsync({ id: tableId, body: data, branchId });
      toast.success('Table updated');
      router.push(`/dashboard/branches/${branchId}/tables`);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      toast.error(axiosErr.response?.data?.error || 'Failed to update table');
    }
  }

  return (
    <FormShell
      backHref={`/dashboard/branches/${branchId}/tables`}
      backLabel={branch ? branch.name : 'Tables'}
      title="Edit Table"
      subtitle="Update table label or status."
    >
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-24" />
        </div>
      )}
      {!isLoading && !table && (
        <p className="text-sm" style={{ color: 'var(--ds-red-text)' }}>Table not found.</p>
      )}
      {!isLoading && table && (
        <TableForm defaultValues={table} onSubmit={handleSubmit} submitLabel="Save Changes" />
      )}
    </FormShell>
  );
}
