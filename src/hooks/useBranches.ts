import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { BranchResponse, BranchRequest } from '@/types';

export const BRANCHES_KEY = ['branches'];

export function useBranches() {
  return useQuery<BranchResponse[]>({
    queryKey: BRANCHES_KEY,
    queryFn: async () => {
      const { data } = await api.get('/api/branches');
      return data;
    },
  });
}

export function useBranch(id: string) {
  return useQuery<BranchResponse>({
    queryKey: ['branches', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/branches/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation<BranchResponse, Error, BranchRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post('/api/branches', body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: BRANCHES_KEY }),
  });
}

export function useUpdateBranch(id: string) {
  const qc = useQueryClient();
  return useMutation<BranchResponse, Error, BranchRequest>({
    mutationFn: async (body) => {
      const { data } = await api.put(`/api/branches/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: BRANCHES_KEY }),
  });
}

export function useDeleteBranch() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/api/branches/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: BRANCHES_KEY }),
  });
}
