import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { AiSummaryRequest, AiSummaryResponse } from '@/types';
import { AxiosError } from 'axios';

export function useAiSummary() {
  return useMutation<AiSummaryResponse, AxiosError, AiSummaryRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post('/api/ai/summary', body);
      return data;
    },
  });
}
