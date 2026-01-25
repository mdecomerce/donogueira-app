import { useAuthStore } from '@/features/auth';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// API Base URL - Configure conforme seu backend
const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/';

// Instância compartilhada do Axios
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptador para adicionar token de autenticação
api.interceptors.request.use(
    (config) => {
        // Pegar token do store de autenticação
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Interceptador para tratar erros globalmente
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            const authStore = useAuthStore.getState();
            authStore.logout();
        }
        return Promise.reject(error);
    },
);

// Helper para fazer requisições tipadas com Axios
export async function fetchApi<T>(
    endpoint: string,
    config: AxiosRequestConfig = {},
): Promise<T> {
    try {
        const response = await api.request<T>({
            url: endpoint,
            ...config,
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        const status = err.response?.status;
        const message = err.response?.statusText || err.message;
        throw new Error(`API Error: ${status ?? 'unknown'} ${message}`);
    }
}
