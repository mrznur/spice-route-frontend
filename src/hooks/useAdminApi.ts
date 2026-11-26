import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AdminRestaurant {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  ownerName: string | null;
  ownerEmail: string | null;
  branchCount: number;
  feedbackCount: number;
}

export interface AdminStats {
  restaurantCount: number;
  userCount: number;
  feedbackTotal: number;
  feedbackToday: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  restaurantName: string | null;
}

export function useAdminRestaurants() {
  return useQuery<AdminRestaurant[]>({
    queryKey: ['admin-restaurants'],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/restaurants');
      return data;
    },
  });
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/stats');
      return data;
    },
  });
}

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/users');
      return data;
    },
  });
}

export function useUpdateRestaurantStatus() {
  const qc = useQueryClient();
  return useMutation<AdminRestaurant, Error, { id: string; status: 'ACTIVE' | 'SUSPENDED' }>({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.patch(`/api/admin/restaurants/${id}/status`, { status });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-restaurants'] }),
  });
}
