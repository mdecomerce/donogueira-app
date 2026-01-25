import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache por 5 minutos
            staleTime: 5 * 60 * 1000,
            // Retry automático em caso de erro
            retry: 2,
            // Refetch quando a janela ganha foco
            refetchOnWindowFocus: false,
        },
        mutations: {
            // Retry para mutations
            retry: 1,
        },
    },
});
