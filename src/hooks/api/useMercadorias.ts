import { fetchApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface Mercadoria {
    id?: number;
    nome: string;
    preco?: number;
    empresa?: string | number;
    endereco?: string;
    codigoBarras?: string;
    codigoBarrasDun?: string | null;
    estoque?: number;
    grupo?: string;
    subgrupo?: string;
    tipo?: string;
    referencia?: string;
    codigoOriginal?: string;
    codigoSecundario?: number;
    aplicacao?: string;
    pesoLiquido?: number;
    qtdeEmbDun?: number;
    qtdeEmbVenda?: number;
    rn?: number;
    [key: string]: any;
}

function mapBackendMercadoria(item: any): Mercadoria {
    const endereco = [item.TMER_RUA, item.TMER_BLOCO, item.TMER_ANDAR, item.TMER_APARTAMENTO]
        .filter(Boolean)
        .filter(val => val !== '0')
        .join('/') || item.endereco;

    return {
        id: item.TMER_CODIGO_PRI_PK ?? item.id,
        nome: item.TMER_NOME ?? item.nome ?? '',
        preco: item.TMER_PRECO_VENDA ?? item.preco,
        estoque: item.TMER_ESTOQUE_TOTAL ?? item.estoque,
        grupo: item.TMER_GRUPO_NOME ?? item.grupo,
        subgrupo: item.TMER_SUBGRUPO_NOME ?? item.subgrupo,
        tipo: item.TMER_TIPO_NOME ?? item.tipo,
        codigoBarras: item.TMER_CODIGO_BARRAS_UKN ?? item.codigoBarras,
        codigoBarrasDun: item.TMER_CODIGO_BARRAS_DUN_UKN,
        referencia: item.TMER_REFERENCIA ?? item.referencia,
        codigoOriginal: item.TMER_CODIGO_ORIGINAL ?? item.codigoOriginal,
        codigoSecundario: item.TMER_CODIGO_SEC_PK ?? item.codigoSecundario,
        aplicacao: item.TMER_APLICACAO ?? item.aplicacao,
        pesoLiquido: item.TMER_PESO_LIQUIDO ?? item.pesoLiquido,
        qtdeEmbDun: item.TMER_QTDE_EMB_DUN ?? item.qtdeEmbDun,
        qtdeEmbVenda: item.TMER_QTDE_EMB_VENDA ?? item.qtdeEmbVenda,
        empresa: item.TMER_UNIDADE_FK_PK ?? item.empresa,
        rn: item.RN,
        endereco,
        ...item,
    };
}

// Algumas APIs retornam envelope { data: Mercadoria[] }, outras retornam o array direto ou paginação
type MercadoriaApiResponse =
    | Mercadoria[]
    | { status: string; data: Mercadoria[] }
    | { data: Mercadoria[] }
    | { data: { items: Mercadoria[] } }
    | { data: { data: Mercadoria[] } };

function normalizeMercadoriasResponse(response: MercadoriaApiResponse) {
    let items: any[] = [];

    if (Array.isArray(response)) {
        items = response;
    } else if ((response as any)?.status === 'success' && Array.isArray((response as any)?.data)) {
        items = (response as any).data;
    } else if (Array.isArray((response as any)?.data)) {
        items = (response as any).data;
    } else if (Array.isArray((response as any)?.data?.items)) {
        items = (response as any).data.items;
    } else if (Array.isArray((response as any)?.data?.data)) {
        items = (response as any).data.data;
    }

    return Array.isArray(items) ? items.map(mapBackendMercadoria) : [];
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

export function useSearchMercadorias(params?: SearchMercadoriaParams, enabled?: boolean) {
    return useQuery({
        queryKey: params ? mercadoriaKeys.search(params.idEmpresa, params.termo) : mercadoriaKeys.all,
        queryFn: async () => {
            if (!params) throw new Error('Parâmetros de busca obrigatórios');

            const idEmpresa = typeof params.idEmpresa === 'string' ? Number(params.idEmpresa) || params.idEmpresa : params.idEmpresa;
            const resp = await fetchApi<MercadoriaApiResponse>('v1/mercadorias/buscar', {
                params: { idEmpresa, termo: params.termo },
            });

            return normalizeMercadoriasResponse(resp);
        },
        enabled: enabled ?? !!params,
    });
}
