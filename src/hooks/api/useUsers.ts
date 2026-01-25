import { fetchApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface User {
    id: number;
    name: string;
    email: string;
}

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    profile: () => [...userKeys.all, 'profile'] as const,
    detail: (id: number) => [...userKeys.all, 'detail', id] as const,
};

/**
 * Hook para obter perfil do usuário autenticado
 */
export function useUserProfile() {
    return useQuery({
        queryKey: userKeys.profile(),
        queryFn: () => fetchApi<User>('v1/usuarios/profile'),
    });
}

/**
 * Hook para listar todos os usuários
 */
export function useUsers() {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: () => fetchApi<User[]>('v1/usuarios'),
    });
}
