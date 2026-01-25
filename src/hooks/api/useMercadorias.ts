import { fetchApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface Mercadoria {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    empresa: string;
}

export interface SearchMercadoriaParams {
    empresa: string;
    termo: string;
}

export const mercadoriaKeys = {
    all: ['mercadorias'] as const,
    search: (empresa: string, termo: string) =>
        [...mercadoriaKeys.all, 'search', empresa, termo] as const,
};

/**
 * Hook para buscar mercadorias por empresa e termo
 */
export function useSearchMercadorias(
    params?: SearchMercadoriaParams,
    enabled?: boolean,
) {
    return useQuery({
        queryKey: params
            ? mercadoriaKeys.search(params.empresa, params.termo)
            : mercadoriaKeys.all,
        queryFn: () => {
            if (!params) {
                throw new Error('Parâmetros de busca obrigatórios');
            }
            return fetchApi<Mercadoria[]>('v1/mercadorias/buscar', {
                params: {
                    empresa: params.empresa,
                    termo: params.termo,
                },
            });
        },
        enabled: enabled ?? !!params,
    });
}
