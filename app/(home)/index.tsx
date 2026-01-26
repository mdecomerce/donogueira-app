import { Text, View } from '@/components/Themed';
import { useAuthStore } from '@/features/auth';
import {
    useSearchMercadorias,
    type Mercadoria,
} from '@/hooks/api/useMercadorias';
import { useTheme } from '@/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
} from 'react-native';

export default function BuscarScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { colors } = useTheme();
    const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [allMercadorias, setAllMercadorias] = useState<Mercadoria[]>([]);
    const PAGE_SIZE = 20;

    // Debounce adaptativo: menor delay para códigos curtos (1-3 dígitos), maior para termos longos
    useEffect(() => {
        // Se é um código numérico curto (1-3 dígitos), busca imediata
        const isShortCode = /^\d{1,3}$/.test(searchTerm.trim());
        const delayMs = isShortCode ? 0 : 500; // Sem delay para códigos curtos, 500ms para outros

        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1); // Reseta para primeira página ao fazer nova busca
            setAllMercadorias([]); // Limpa lista acumulada
        }, delayMs);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Verificar se termo de busca é válido (1+ caractere para números, 2+ para texto)
    const isValidSearchTerm = (term: string) => {
        const trimmed = term.trim();
        return /^\d+$/.test(trimmed) ?
                trimmed.length >= 1
            :   trimmed.length >= 2;
    };

    // Buscar mercadorias quando termo + empresa selecionada
    const {
        data: searchResult,
        isLoading,
        error,
        isFetching,
    } = useSearchMercadorias(
        isValidSearchTerm(debouncedSearchTerm) && selectedEmpresa ?
            {
                idEmpresa: selectedEmpresa,
                termo: debouncedSearchTerm,
                page,
                limit: PAGE_SIZE,
            }
        :   undefined,
        isValidSearchTerm(debouncedSearchTerm) && !!selectedEmpresa,
    );

    // Acumular resultados quando novas páginas são carregadas
    useEffect(() => {
        if (searchResult?.items) {
            setAllMercadorias((prev) => {
                // Se é página 1, substitui tudo
                if (page === 1) {
                    return searchResult.items;
                }
                // Senão, adiciona novos itens sem duplicar
                const existingIds = new Set(prev.map((m) => m.id));
                const newItems = searchResult.items.filter(
                    (m) => !existingIds.has(m.id),
                );
                return [...prev, ...newItems];
            });
        }
    }, [searchResult, page]);

    const pagination = searchResult?.pagination;

    // Debug da paginação
    useEffect(() => {
        if (!pagination) return;
    }, [pagination, allMercadorias]);

    // Navegar para tela de edição
    const handleSelectMercadoria = (mercadoria: Mercadoria) => {
        router.push({
            pathname: '/editarMercadoria',
            params: {
                mercadoria: encodeURIComponent(JSON.stringify(mercadoria)),
            },
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Seletor de Empresas */}
                {user?.empresas && user.empresas.length > 0 && (
                    <View style={styles.empresasSection}>
                        <Text
                            style={[
                                styles.empresasLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Empresa
                        </Text>
                        <View
                            style={[
                                styles.pickerContainer,
                                {
                                    backgroundColor: colors.inputBackground,
                                    borderColor: colors.inputBorder,
                                },
                            ]}
                        >
                            <Picker
                                selectedValue={selectedEmpresa}
                                onValueChange={(itemValue: string | null) => {
                                    setSelectedEmpresa(itemValue);
                                    if (!itemValue) setSearchTerm('');
                                }}
                                style={[styles.picker, { color: colors.text }]}
                                dropdownIconColor={colors.textSecondary}
                            >
                                <Picker.Item
                                    label="Selecione uma empresa"
                                    value={null}
                                />
                                {user.empresas.map((empresa) => {
                                    const empresaStr = String(empresa);
                                    return (
                                        <Picker.Item
                                            key={empresaStr}
                                            label={empresaStr}
                                            value={empresaStr}
                                        />
                                    );
                                })}
                            </Picker>
                        </View>
                    </View>
                )}

                {/* Search Bar (só habilita após escolher empresa) */}
                <View style={styles.searchSection}>
                    <View
                        style={[
                            styles.searchBar,
                            {
                                backgroundColor: colors.inputBackground,
                                borderColor: colors.inputBorder,
                                opacity: selectedEmpresa ? 1 : 0.6,
                            },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="magnify"
                            size={20}
                            color={colors.textSecondary}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={[styles.searchInput, { color: colors.text }]}
                            placeholder={
                                selectedEmpresa ?
                                    'Buscar por SKU, EAN, nome...'
                                :   'Selecione uma empresa para buscar'
                            }
                            placeholderTextColor={colors.textSecondary}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            editable={!!selectedEmpresa}
                        />
                        {searchTerm.length > 0 && selectedEmpresa && (
                            <Pressable onPress={() => setSearchTerm('')}>
                                <MaterialCommunityIcons
                                    name="close-circle"
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Resultados */}
                {!selectedEmpresa ?
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons
                            name="office-building"
                            size={48}
                            color={colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.emptyText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Selecione uma empresa para buscar
                        </Text>
                    </View>
                : !isValidSearchTerm(searchTerm) ?
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons
                            name="magnify"
                            size={48}
                            color={colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.emptyText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Digite pelo menos 2 caracteres (ou 1 número) para
                            buscar
                        </Text>
                    </View>
                : isLoading ?
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color={colors.tint}
                            style={{ marginBottom: 12 }}
                        />
                        <Text
                            style={[
                                styles.loadingText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Buscando mercadorias...
                        </Text>
                    </View>
                : error ?
                    <View style={styles.errorContainer}>
                        <MaterialCommunityIcons
                            name="alert-circle"
                            size={48}
                            color="#ff4444"
                        />
                        <Text
                            style={[styles.errorText, { color: colors.text }]}
                        >
                            Erro ao buscar mercadorias
                        </Text>
                    </View>
                : !allMercadorias || allMercadorias.length === 0 ?
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons
                            name="package-variant"
                            size={48}
                            color={colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.emptyText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Nenhuma mercadoria encontrada
                        </Text>
                    </View>
                :   <>
                        {/* Informação de paginação */}
                        {pagination && pagination.total > 0 && (
                            <View style={styles.paginationInfo}>
                                <MaterialCommunityIcons
                                    name="information"
                                    size={16}
                                    color={colors.tint}
                                    style={{ marginRight: 8 }}
                                />
                                <Text
                                    style={[
                                        styles.paginationText,
                                        { color: colors.tint },
                                    ]}
                                >
                                    Mostrando {allMercadorias.length} de{' '}
                                    {pagination.total} resultados
                                </Text>
                            </View>
                        )}

                        {/* Lista de Resultados */}
                        <FlatList
                            scrollEnabled={false}
                            data={allMercadorias}
                            keyExtractor={(item, index) =>
                                String(
                                    item?.id ??
                                        (item as any)?.idMercadoria ??
                                        item?.codigoBarras ??
                                        item?.nome ??
                                        index,
                                )
                            }
                            renderItem={({ item }) => {
                                if (!item) return null;

                                return (
                                    <Pressable
                                        onPress={() =>
                                            handleSelectMercadoria(
                                                item as Mercadoria,
                                            )
                                        }
                                        style={[
                                            styles.resultCard,
                                            {
                                                backgroundColor:
                                                    colors.cardBackground,
                                                borderColor: colors.border,
                                            },
                                        ]}
                                    >
                                        <View style={styles.resultHeader}>
                                            <Text
                                                style={[
                                                    styles.resultSku,
                                                    { color: colors.text },
                                                ]}
                                            >
                                                {item.nome || 'Sem nome'}
                                            </Text>
                                            <MaterialCommunityIcons
                                                name="chevron-right"
                                                size={20}
                                                color={colors.tint}
                                            />
                                        </View>
                                        <Text
                                            style={[
                                                styles.resultDesc,
                                                { color: colors.textSecondary },
                                            ]}
                                        >
                                            código:{item.id} estoque:
                                            {item.estoque ?? 'N/A'}
                                        </Text>
                                    </Pressable>
                                );
                            }}
                        />

                        {/* Botão Carregar Mais */}
                        {pagination &&
                            allMercadorias.length < pagination.total && (
                                <Pressable
                                    onPress={() => setPage(page + 1)}
                                    disabled={isFetching}
                                    style={[
                                        styles.loadMoreButton,
                                        {
                                            backgroundColor: colors.tint,
                                            opacity: isFetching ? 0.6 : 1,
                                        },
                                    ]}
                                >
                                    {isFetching ?
                                        <>
                                            <ActivityIndicator
                                                size="small"
                                                color="#FFF"
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text style={styles.loadMoreText}>
                                                Carregando...
                                            </Text>
                                        </>
                                    :   <Text style={styles.loadMoreText}>
                                            Carregar Mais (
                                            {pagination.total -
                                                allMercadorias.length}{' '}
                                            restantes)
                                        </Text>
                                    }
                                </Pressable>
                            )}
                    </>
                }
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
    },
    searchSection: {
        marginBottom: 24,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
        height: 48,
        gap: 8,
    },
    searchIcon: {
        marginRight: 4,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    empresasSection: {
        marginBottom: 24,
    },
    empresasLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
    },
    loadingContainer: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        marginTop: 8,
    },
    paginationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(33,150,243,0.1)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    paginationText: {
        fontSize: 12,
        flex: 1,
        fontWeight: '500',
    },
    loadMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 32,
    },
    loadMoreText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    errorContainer: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        marginTop: 12,
    },
    resultCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    resultSku: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    resultDesc: {
        fontSize: 12,
    },
});
