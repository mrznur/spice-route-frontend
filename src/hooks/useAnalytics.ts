import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export type Interval = 'day' | 'week' | 'month';

export interface AnalyticsFilters {
    branchId?: string;
    tableId?: string;
    minRating?: number;
    maxRating?: number;
    from?: string; // yyyy-MM-dd, inclusive
    to?: string;   // yyyy-MM-dd, inclusive
}

export interface AnalyticsSummary {
    total: number;
    averageRating: number | null; // null when there is no feedback
    withComments: number;
    ratingCounts: Record<number, number>; // keys 1..5
}

export interface TrendPoint {
    period: string; // yyyy-MM-dd (start of the day / week / month)
    count: number;
    averageRating: number | null;
}

export interface BranchStat {
    branchId: string;
    branchName: string;
    count: number;
    averageRating: number | null;
    ratingCounts: Record<number, number>;
}

export interface TableOption {
    id: string;
    label: string;
    active: boolean;
}

/** Builds a query string, skipping empty values. */
function toQuery(values: Record<string, string | number | undefined | null>): string {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
    });
    const query = params.toString();
    return query ? `?${query}` : '';
}

export function useAnalyticsSummary(filters: AnalyticsFilters) {
    return useQuery<AnalyticsSummary>({
        queryKey: ['analytics-summary', filters],
        queryFn: async () => {
            const { data } = await api.get(`/api/analytics/summary${toQuery({ ...filters })}`);
            return data;
        },
    });
}

export function useAnalyticsTrend(filters: AnalyticsFilters, interval: Interval) {
    return useQuery<TrendPoint[]>({
        queryKey: ['analytics-trend', filters, interval],
        queryFn: async () => {
            const { data } = await api.get(`/api/analytics/trend${toQuery({ ...filters, interval })}`);
            return data;
        },
    });
}

/** Branch comparison: branch and table filters do not apply, only rating and dates. */
export function useAnalyticsBranches(filters: Pick<AnalyticsFilters, 'minRating' | 'maxRating' | 'from' | 'to'>) {
    return useQuery<BranchStat[]>({
        queryKey: ['analytics-branches', filters],
        queryFn: async () => {
            const { data } = await api.get(`/api/analytics/branches${toQuery({ ...filters })}`);
            return data;
        },
    });
}

/** Tables of one branch, for the table filter. */
export function useBranchTableOptions(branchId?: string) {
    return useQuery<TableOption[]>({
        queryKey: ['analytics-table-options', branchId],
        queryFn: async () => {
            const { data } = await api.get(`/api/branches/${branchId}/tables`);
            return data;
        },
        enabled: !!branchId,
    });
}