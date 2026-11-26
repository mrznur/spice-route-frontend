import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface RestaurantResponse {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
}

export interface UpdateRestaurantRequest {
  name: string;
}

export const RESTAURANT_KEY = ['restaurant-me'];

export function useMyRestaurant() {
  return useQuery<RestaurantResponse>({
    queryKey: RESTAURANT_KEY,
    queryFn: async () => {
      const { data } = await api.get('/api/restaurants/me');
      return data;
    },
  });
}

export function useUpdateMyRestaurant() {
  const qc = useQueryClient();
  return useMutation<RestaurantResponse, Error, UpdateRestaurantRequest>({
    mutationFn: async (body) => {
      const { data } = await api.put('/api/restaurants/me', body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: RESTAURANT_KEY }),
  });
}
