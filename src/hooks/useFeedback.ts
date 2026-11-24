import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { FeedbackPageResponse, FeedbackStatsResponse } from '@/types';

interface FeedbackFilters {
  branchId?: string;
  minRating?: number;
  maxRating?: number;
  from?: string;   // ISO date yyyy-MM-dd
  to?: string;
  page?: number;
  size?: number;
}

export function useFeedback(filters: FeedbackFilters = {}) {
  const params = new URLSearchParams();
  if (filters.branchId)             params.set('branchId',  filters.branchId);
  if (filters.minRating != null)    params.set('minRating', String(filters.minRating));
  if (filters.maxRating != null)    params.set('maxRating', String(filters.maxRating));
  if (filters.from)                 params.set('from',      filters.from);
  if (filters.to)                   params.set('to',        filters.to);
  if (filters.page   != null)       params.set('page',      String(filters.page));
  if (filters.size   != null)       params.set('size',      String(filters.size));

  return useQuery<FeedbackPageResponse>({
    queryKey: ['feedback', filters],
    queryFn: async () => {
      const { data } = await api.get(`/api/feedback?${params.toString()}`);
      return data;
    },
  });
}

export function useFeedbackStats(branchId?: string) {
  const params = branchId ? `?branchId=${branchId}` : '';
  return useQuery<FeedbackStatsResponse>({
    queryKey: ['feedback-stats', branchId],
    queryFn: async () => {
      const { data } = await api.get(`/api/feedback/stats${params}`);
      return data;
    },
  });
}
