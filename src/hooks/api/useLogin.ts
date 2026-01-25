import { useAuthStore } from '@/features/auth';
import type { LoginRequest, LoginResponse } from '@/features/auth/types';
import { fetchApi } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const loginKeys = {
    all: ['login'] as const,
};

/**
 * Hook para fazer login
 */
export function useLogin() {
    const queryClient = useQueryClient();
    const { login } = useAuthStore();

    return useMutation({
        mutationFn: (credentials: LoginRequest) =>
            fetchApi<LoginResponse>('v1/auth/login', {
                method: 'POST',
                data: credentials,
            }),

        onSuccess: (data) => {
            // Salvar token e usuário no store
            login(
                {
                    id: data.data.id,
                    nome: data.data.nome,
                    empresas: data.data.empresas,
                },
                data.data.token,
            );

            // Invalidar queries
            queryClient.invalidateQueries({ queryKey: loginKeys.all });
        },
    });
}
