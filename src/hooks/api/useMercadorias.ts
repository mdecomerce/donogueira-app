import { fetchApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface Mercadoria {
    // Normalized fields
    id?: number;
    nome: string;
    descricao?: string;
    preco?: number;
    empresa?: string | number;
    endereco?: string;
    codigoBarras?: string;
    estoque?: number; // Total stock
    grupo?: string;
    tipo?: string;
    codigoBarrasDun?: string;
    referencia?: string;
    codigoOriginal?: string;
    aplicacao?: string;
    pesoLiquido?: number;
    qtdeEmbVenda?: number;
    qtdeEmbDun?: number;
    // Backend fields (prefixed with TMER_)
    TMER_UNIDADE_FK_PK?: number;
    TMER_CODIGO_PRI_PK?: number;
    TMER_CODIGO_SEC_PK?: number;
    TMER_NOME?: string;
    TMER_CODIGO_BARRAS_UKN?: string;
    TMER_CODIGO_BARRAS_DUN_UKN?: string;
    TMER_REFERENCIA?: string;
    TMER_CODIGO_ORIGINAL?: string;
    TMER_APLICACAO?: string;
    TMER_PESO_LIQUIDO?: number;
    TMER_QTDE_EMB_DUN?: number;
    TMER_QTDE_EMB_VENDA?: number;
    TMER_PRECO_VENDA?: number;
    TMER_ESTOQUE_TOTAL?: number;
    TMER_RUA?: string;
    TMER_BLOCO?: string;
    TMER_ANDAR?: string;
    TMER_APARTAMENTO?: string;
    TMER_GRUPO_NOME?: string;
    TMER_SUBGRUPO_NOME?: string;
    TMER_TIPO_NOME?: string;
    RN?: string;
    [key: string]: any;
}

// Mapper para converter campos do backend (TMER_*) para interface Mercadoria
function mapBackendMercadoria(item: any): Mercadoria {
    return {
        // Map backend fields to normalized fields
        id: item.TMER_CODIGO_PRI_PK ?? item.id,
        nome: item.TMER_NOME ?? item.nome ?? '',
        descricao: item.TMER_SUBGRUPO_NOME ?? item.descricao ?? '',
        preco: item.TMER_PRECO_VENDA ?? item.preco,
        estoque: item.TMER_ESTOQUE_TOTAL,
        grupo: item.TMER_GRUPO_NOME,
        tipo: item.TMER_TIPO_NOME,
        codigoBarras: item.TMER_CODIGO_BARRAS_UKN ?? item.codigoBarras,
        codigoBarrasDun: item.TMER_CODIGO_BARRAS_DUN_UKN,
        referencia: item.TMER_REFERENCIA,
        codigoOriginal: item.TMER_CODIGO_ORIGINAL,
        aplicacao: item.TMER_APLICACAO,
        pesoLiquido: item.TMER_PESO_LIQUIDO,
        qtdeEmbVenda: item.TMER_QTDE_EMB_VENDA,
        qtdeEmbDun: item.TMER_QTDE_EMB_DUN,
        endereco: `${item.TMER_RUA ?? ''}/${item.TMER_BLOCO ?? ''}/${item.TMER_ANDAR ?? ''}/${item.TMER_APARTAMENTO ?? ''}`.replace(/\/+/g, '/').replace(/^\/|\/$/g, '') ?? item.endereco,
        empresa: item.TMER_UNIDADE_FK_PK ?? item.empresa,
        // Keep original backend fields for reference
        ...item,
    };
}

// Algumas APIs retornam envelope { data: Mercadoria[] }, outras retornam o array direto ou paginação
type MercadoriaApiResponse =
    | Mercadoria[]
    | { data: Mercadoria[] }
    | { data: { items: Mercadoria[] } }
    | { data: { data: Mercadoria[] } };

function normalizeMercadoriasResponse(response: MercadoriaApiResponse) {
    let items: any[] = [];
    if (Array.isArray(response)) {
        items = response;
    } else {
        const data: any = (response as any)?.data;
        if (Array.isArray(data)) {
            items = data;
        } else if (Array.isArray(data?.items)) {
            items = data.items;
        } else if (Array.isArray(data?.data)) {
            items = data.data;
        }
    }
    // Map each item through the backend->frontend converter
    return items.map((item) => mapBackendMercadoria(item));
}

export interface SearchMercadoriaParams {
    idEmpresa: string | number;
    termo: string;
}

export const mercadoriaKeys = {
    all: ['mercadorias'] as const,
    search: (idEmpresa: string | number, termo: string) =>
        [...mercadoriaKeys.all, 'search', String(idEmpresa), termo] as const,
};

/**
 * Hook para buscar mercadorias por empresa e termo
 */
export function useSearchMercadorias(
    params?: SearchMercadoriaParams,
    enabled?: boolean,
) {
    if (__DEV__) {
        console.log('🪝 useSearchMercadorias invoked', { params, enabled });
    }

    return useQuery({
        queryKey: params
            ? mercadoriaKeys.search(params.idEmpresa, params.termo)
            : mercadoriaKeys.all,
        queryFn: () => {
            if (__DEV__) {
                console.log('📡 queryFn executando...');
            }
            if (!params) {
                throw new Error('Parâmetros de busca obrigatórios');
            }
            const idEmpresaValue = typeof params.idEmpresa === 'string'
                ? Number(params.idEmpresa) || params.idEmpresa
                : params.idEmpresa;

            if (__DEV__) {
                console.log('🔎 buscando mercadorias', {
                    endpoint: 'v1/mercadorias/buscar',
                    params: { idEmpresa: idEmpresaValue, termo: params.termo },
                });
            }

            return fetchApi<MercadoriaApiResponse>('v1/mercadorias/buscar', {
                params: {
                    idEmpresa: idEmpresaValue,
                    termo: params.termo,
                },
            }).then((resp) => {
                if (__DEV__) {
                    console.log('✅ resposta mercadorias:', resp);
                }
                const normalized = normalizeMercadoriasResponse(resp);
                if (__DEV__) {
                    console.log('🔍 mercadorias - total itens:', normalized.length);
                    if (normalized.length > 0) {
                        console.log('🔍 primeiro item:', normalized[0]);
                        console.log('🔍 chaves do item:', Object.keys(normalized[0]));
                    }
                }
                return normalized;
            });
        },
        enabled: enabled ?? !!params,
    });
}
