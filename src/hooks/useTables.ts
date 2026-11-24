import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { TableResponse, TableRequest, BulkTablesRequest, BulkTablesResponse } from '@/types';

export const tablesKey = (branchId: string) => ['tables', branchId];

export function useTables(branchId: string) {
  return useQuery<TableResponse[]>({
    queryKey: tablesKey(branchId),
    queryFn: async () => {
      const { data } = await api.get(`/api/branches/${branchId}/tables`);
      return data;
    },
    enabled: !!branchId,
  });
}

export function useCreateTable(branchId: string) {
  const qc = useQueryClient();
  return useMutation<TableResponse, Error, TableRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post(`/api/branches/${branchId}/tables`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: tablesKey(branchId) }),
  });
}

export function useBulkCreateTables(branchId: string) {
  const qc = useQueryClient();
  return useMutation<BulkTablesResponse, Error, BulkTablesRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post(`/api/branches/${branchId}/tables/bulk`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: tablesKey(branchId) }),
  });
}

export function useUpdateTable() {
  const qc = useQueryClient();
  return useMutation<TableResponse, Error, { id: string; body: TableRequest; branchId: string }>({
    mutationFn: async ({ id, body }) => {
      const { data } = await api.put(`/api/tables/${id}`, body);
      return data;
    },
    onSuccess: (data) => qc.invalidateQueries({ queryKey: tablesKey(data.branchId) }),
  });
}

export function useDeleteTable(branchId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/api/tables/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: tablesKey(branchId) }),
  });
}

export async function downloadQrPng(tableId: string, label: string) {
  const response = await api.get(`/api/tables/${tableId}/qr.png`, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${label}-qr.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Fetches a QR PNG and returns a blob: URL suitable for use in <img src>. Caller must revoke it. */
export async function fetchQrBlobUrl(tableId: string): Promise<string> {
  const response = await api.get(`/api/tables/${tableId}/qr.png`, { responseType: 'blob' });
  return URL.createObjectURL(response.data);
}

export async function downloadBranchQrPdf(branchId: string, branchName: string) {
  const response = await api.get(`/api/branches/${branchId}/qr.pdf`, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${branchName}-qr-codes.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
