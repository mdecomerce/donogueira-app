import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache por 5 minutos
            staleTime: 5 * 60 * 1000,
            // Retry automático em caso de erro
            retry: 2,
            // Refetch quando a janela ganha foco
            refetchOnWindowFocus: false,
            // Tempo de cache para persistência (24 horas)
            gcTime: 1000 * 60 * 60 * 24,
        },
        mutations: {
            // Retry para mutations
            retry: 1,
        },
    },
});

// Persister apenas para plataformas mobile (iOS/Android)
export const asyncStoragePersister = Platform.OS !== 'web'
    ? createAsyncStoragePersister({
        storage: AsyncStorage,
        throttleTime: 3000, // Salva no máximo a cada 3 segundos
    })
    : undefined;
