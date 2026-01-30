import { fetchApi } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mercadoriaKeys } from './useMercadorias';

interface UpdateMercadoriaParams {
    idEmpresa: string | number;
    codigoPri: string | number;
    codigoSec: string | number;
    data: {
        rua?: string;
        bloco?: string;
        andar?: string;
        apartamento?: string;
        codigoBarras?: string;
    };
}

export function useUpdateMercadoria() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ idEmpresa, codigoPri, codigoSec, data }: UpdateMercadoriaParams) => {
            return fetchApi(`/v1/mercadorias/${idEmpresa}/${codigoPri}/${codigoSec}`, {
                method: 'PATCH',
                data,
            });
        },
        onSuccess: (_data, variables) => {
            // Invalida cache de mercadorias da empresa
            queryClient.invalidateQueries({ queryKey: mercadoriaKeys.all });
            // Poderia ser mais específico se necessário
        },
    });
}
