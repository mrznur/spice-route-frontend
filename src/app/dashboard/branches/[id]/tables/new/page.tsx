'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateTable } from '@/hooks/useTables';
import { useBranches } from '@/hooks/useBranches';
import { TableForm, TableFormData } from '@/components/forms/TableForm';
import { FormShell } from '@/components/ui/form-shell';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

export default function NewTablePage({ params }: { params: { id: string } }) {
  const { id: branchId } = params;
  const router = useRouter();
  const { data: branches } = useBranches();
  const branch = branches?.find((b) => b.id === branchId);
  const createTable = useCreateTable(branchId);

  async function handleSubmit(data: TableFormData) {
    try {
      await createTable.mutateAsync(data);
      toast.success('Table created');
      router.push(`/dashboard/branches/${branchId}/tables`);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      toast.error(axiosErr.response?.data?.error || 'Failed to create table');
    }
  }

  return (
    <FormShell
      backHref={`/dashboard/branches/${branchId}/tables`}
      backLabel={branch ? branch.name : 'Tables'}
      title="New Table"
      subtitle="Add a table to generate a QR code."
    >
      <TableForm onSubmit={handleSubmit} submitLabel="Create Table" />
    </FormShell>
  );
}
