import { fetchApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface HealthResponse {
    status: string;
    message: string;
    timestamp: string;
}

/**
 * Hook para verificar status de saúde da API
 * Endpoint: GET /health
 */
export function useHealth() {
    return useQuery({
        queryKey: ['health'],
        queryFn: () => fetchApi<HealthResponse>('/health', {
            method: 'GET',
        }),
        // Refetch a cada 30 segundos para monitorar API
        refetchInterval: 30000,
        // Retry rápido para health check
        retry: 1,
        staleTime: 10000, // 10 segundos
    });
}
