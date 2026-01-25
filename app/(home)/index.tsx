import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import {
    useSearchMercadorias,
    type Mercadoria,
} from '@/hooks/api/useMercadorias';
import { useTheme } from '@/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
} from 'react-native';

export default function BuscarScreen() {
    const { user } = useAuthStore();
    const { colors } = useTheme();
    const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMercadoria, setSelectedMercadoria] =
        useState<Mercadoria | null>(null);
    const [editingField, setEditingField] = useState<
        'endereco' | 'codigo' | null
    >(null);
    const [endereco, setEndereco] = useState('');
    const [codigoBarras, setCodigoBarras] = useState('');

    // Buscar mercadorias quando termo + empresa selecionada
    const {
        data: mercadorias,
        isLoading,
        error,
    } = useSearchMercadorias(
        searchTerm.length >= 2 && selectedEmpresa ?
            {
                idEmpresa: selectedEmpresa,
                termo: searchTerm,
            }
        :   undefined,
        searchTerm.length >= 2 && !!selectedEmpresa,
    );

    // Atualizar campos quando seleciona mercadoria
    const handleSelectMercadoria = (mercadoria: Mercadoria) => {
        setSelectedMercadoria(mercadoria);
        setEndereco(mercadoria.endereco || '');
        setCodigoBarras(mercadoria.codigoBarras || '');
        setEditingField(null);
    };

    const handleSaveChanges = async () => {
        if (!selectedMercadoria) return;

        try {
            // TODO: Implementar mutation para atualizar mercadoria
            Alert.alert('Sucesso', 'Mercadoria atualizada com sucesso!');
            setSelectedMercadoria(null);
            setEditingField(null);
        } catch (err) {
            Alert.alert('Erro', 'Falha ao atualizar mercadoria');
        }
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
                        <View style={styles.empresasButtonsContainer}>
                            {user.empresas.map((empresa) => {
                                const empresaStr = String(empresa);
                                return (
                                    <Pressable
                                        key={empresaStr}
                                        onPress={() => {
                                            if (
                                                selectedEmpresa === empresaStr
                                            ) {
                                                setSelectedEmpresa(null);
                                                setSearchTerm('');
                                                setSelectedMercadoria(null);
                                            } else {
                                                setSelectedEmpresa(empresaStr);
                                            }
                                        }}
                                        style={[
                                            styles.empresaButton,
                                            {
                                                backgroundColor:
                                                    (
                                                        selectedEmpresa ===
                                                        empresaStr
                                                    ) ?
                                                        colors.tint
                                                    :   colors.cardBackground,
                                                borderColor: colors.border,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.empresaButtonText,
                                                {
                                                    color:
                                                        (
                                                            selectedEmpresa ===
                                                            empresaStr
                                                        ) ?
                                                            '#FFF'
                                                        :   colors.text,
                                                },
                                            ]}
                                        >
                                            {empresaStr}
                                        </Text>
                                    </Pressable>
                                );
                            })}
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
                                    'Buscar por SKU ou Código...'
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
                : searchTerm.length < 2 ?
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
                            Digite pelo menos 2 caracteres para buscar
                        </Text>
                    </View>
                : isLoading ?
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.tint} />
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
                : !mercadorias || mercadorias.length === 0 ?
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
                        {/* Lista de Resultados */}
                        <FlatList
                            scrollEnabled={false}
                            data={mercadorias}
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
                                const itemId =
                                    item.id ??
                                    (item as any)?.idMercadoria ??
                                    item.codigoBarras ??
                                    item.nome;

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
                                                borderColor:
                                                    (
                                                        selectedMercadoria?.id ===
                                                        itemId
                                                    ) ?
                                                        colors.tint
                                                    :   colors.border,
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
                                            {selectedMercadoria?.id ===
                                                itemId && (
                                                <MaterialCommunityIcons
                                                    name="check-circle"
                                                    size={20}
                                                    color={colors.tint}
                                                />
                                            )}
                                        </View>
                                        <Text
                                            style={[
                                                styles.resultDesc,
                                                { color: colors.textSecondary },
                                            ]}
                                        >
                                            Estoque: {item.estoque ?? 'N/A'}
                                        </Text>
                                    </Pressable>
                                );
                            }}
                        />

                        {/* Detalhe Selecionado */}
                        {selectedMercadoria && (
                            <View
                                style={[
                                    styles.detailSection,
                                    { backgroundColor: colors.cardBackground },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.sectionTitle,
                                        { color: colors.text },
                                    ]}
                                >
                                    Editar Propriedades
                                </Text>

                                {/* Endereçamento */}
                                <Pressable
                                    onPress={() =>
                                        setEditingField(
                                            editingField === 'endereco' ? null
                                            :   'endereco',
                                        )
                                    }
                                    style={[
                                        styles.propertyCard,
                                        {
                                            backgroundColor: colors.background,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                >
                                    <View style={styles.propertyHeader}>
                                        <View style={styles.propertyInfo}>
                                            <MaterialCommunityIcons
                                                name="map-marker"
                                                size={24}
                                                color={colors.tint}
                                            />
                                            <Text
                                                style={[
                                                    styles.propertyLabel,
                                                    {
                                                        color: colors.textSecondary,
                                                    },
                                                ]}
                                            >
                                                Endereçamento
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons
                                            name={
                                                editingField === 'endereco' ?
                                                    'chevron-up'
                                                :   'chevron-down'
                                            }
                                            size={24}
                                            color={colors.textSecondary}
                                        />
                                    </View>

                                    {editingField === 'endereco' && (
                                        <TextInput
                                            style={[
                                                styles.editInput,
                                                {
                                                    color: colors.text,
                                                    borderColor: colors.tint,
                                                },
                                            ]}
                                            value={endereco}
                                            onChangeText={setEndereco}
                                            placeholder="Ex: A-15-3-4"
                                            placeholderTextColor={
                                                colors.textSecondary
                                            }
                                        />
                                    )}

                                    {editingField !== 'endereco' && (
                                        <Text
                                            style={[
                                                styles.propertyValue,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {endereco || '-'}
                                        </Text>
                                    )}
                                </Pressable>

                                {/* Código de Barras */}
                                <Pressable
                                    onPress={() =>
                                        setEditingField(
                                            editingField === 'codigo' ? null : (
                                                'codigo'
                                            ),
                                        )
                                    }
                                    style={[
                                        styles.propertyCard,
                                        {
                                            backgroundColor: colors.background,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                >
                                    <View style={styles.propertyHeader}>
                                        <View style={styles.propertyInfo}>
                                            <MaterialCommunityIcons
                                                name="barcode"
                                                size={24}
                                                color={colors.tint}
                                            />
                                            <Text
                                                style={[
                                                    styles.propertyLabel,
                                                    {
                                                        color: colors.textSecondary,
                                                    },
                                                ]}
                                            >
                                                Código de Barras
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons
                                            name={
                                                editingField === 'codigo' ?
                                                    'chevron-up'
                                                :   'chevron-down'
                                            }
                                            size={24}
                                            color={colors.textSecondary}
                                        />
                                    </View>

                                    {editingField === 'codigo' && (
                                        <TextInput
                                            style={[
                                                styles.editInput,
                                                {
                                                    color: colors.text,
                                                    borderColor: colors.tint,
                                                },
                                            ]}
                                            value={codigoBarras}
                                            onChangeText={setCodigoBarras}
                                            placeholder="Ex: 8712938974029"
                                            placeholderTextColor={
                                                colors.textSecondary
                                            }
                                        />
                                    )}

                                    {editingField !== 'codigo' && (
                                        <Text
                                            style={[
                                                styles.propertyValue,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {codigoBarras || '-'}
                                        </Text>
                                    )}
                                </Pressable>

                                {/* Save Button */}
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onPress={handleSaveChanges}
                                    style={styles.saveButton}
                                >
                                    💾 Salvar Alterações
                                </Button>

                                {/* Auditoria */}
                                <View
                                    style={[
                                        styles.auditSection,
                                        { borderTopColor: colors.border },
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        name="history"
                                        size={16}
                                        color={colors.textSecondary}
                                    />
                                    <Text
                                        style={[
                                            styles.auditText,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        Última atualização: há 2 horas por João
                                    </Text>
                                </View>
                            </View>
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
    empresasButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    empresaButton: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
    },
    empresaButtonText: {
        fontSize: 13,
        fontWeight: '500',
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
    detailSection: {
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 16,
    },
    propertyCard: {
        borderRadius: 8,
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
    },
    propertyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    propertyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    propertyLabel: {
        fontSize: 12,
    },
    propertyValue: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 8,
    },
    editInput: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginTop: 8,
        fontSize: 14,
    },
    saveButton: {
        marginTop: 16,
    },
    auditSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingTop: 12,
        marginTop: 12,
        borderTopWidth: 1,
    },
    auditText: {
        fontSize: 12,
        flex: 1,
    },
});
