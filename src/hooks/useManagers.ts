import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ManagerResponse, CreateManagerRequest, UpdateManagerRequest } from '@/types';

export const MANAGERS_KEY = ['managers'];

export function useManagers() {
  return useQuery<ManagerResponse[]>({
    queryKey: MANAGERS_KEY,
    queryFn: async () => {
      const { data } = await api.get('/api/managers');
      return data;
    },
  });
}

export function useCreateManager() {
  const qc = useQueryClient();
  return useMutation<ManagerResponse, Error, CreateManagerRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post('/api/managers', body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MANAGERS_KEY }),
  });
}

export function useUpdateManager(id: string) {
  const qc = useQueryClient();
  return useMutation<ManagerResponse, Error, UpdateManagerRequest>({
    mutationFn: async (body) => {
      const { data } = await api.put(`/api/managers/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MANAGERS_KEY }),
  });
}

export function useDeleteManager() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/api/managers/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MANAGERS_KEY }),
  });
}
