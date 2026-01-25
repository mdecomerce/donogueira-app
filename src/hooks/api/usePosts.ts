import { fetchApi } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Tipos de exemplo
export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

export interface CreatePostData {
    title: string;
    body: string;
    userId: number;
}

// Query Keys - Centralizados para fácil gerenciamento
export const postKeys = {
    all: ['posts'] as const,
    lists: () => [...postKeys.all, 'list'] as const,
    list: (filters?: any) => [...postKeys.lists(), filters] as const,
    details: () => [...postKeys.all, 'detail'] as const,
    detail: (id: number) => [...postKeys.details(), id] as const,
};

// Hook para listar posts
export function usePosts() {
    return useQuery({
        queryKey: postKeys.lists(),
        queryFn: () => fetchApi<Post[]>('/posts'),
    });
}

// Hook para pegar um post específico
export function usePost(id: number) {
    return useQuery({
        queryKey: postKeys.detail(id),
        queryFn: () => fetchApi<Post>(`/posts/${id}`),
        enabled: !!id, // Só executa se tiver ID
    });
}

// Hook para criar um post (mutation)
export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostData) =>
            fetchApi<Post>('/posts', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        // Invalidar cache após criar
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}

// Hook para atualizar um post
export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) =>
            fetchApi<Post>(`/posts/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),

        // Optimistic update
        onMutate: async ({ id, data }) => {
            // Cancelar queries em andamento
            await queryClient.cancelQueries({ queryKey: postKeys.detail(id) });

            // Snapshot do valor anterior
            const previousPost = queryClient.getQueryData(postKeys.detail(id));

            // Atualizar cache otimisticamente
            queryClient.setQueryData(postKeys.detail(id), (old: Post | undefined) =>
                old ? { ...old, ...data } : old
            );

            return { previousPost };
        },

        // Se falhar, reverter
        onError: (err, { id }, context) => {
            if (context?.previousPost) {
                queryClient.setQueryData(postKeys.detail(id), context.previousPost);
            }
        },

        // Sempre refetch após sucesso ou erro
        onSettled: (data, error, { id }) => {
            queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
        },
    });
}

// Hook para deletar um post
export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            fetchApi(`/posts/${id}`, { method: 'DELETE' }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}
