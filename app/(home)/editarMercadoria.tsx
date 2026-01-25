import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
} from 'react-native';

interface Mercadoria {
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

export default function EditarMercadoriaScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { colors } = useTheme();
    const params = useLocalSearchParams();

    // Parse mercadoria from params
    const mercadoria: Mercadoria =
        params.mercadoria ?
            JSON.parse(decodeURIComponent(params.mercadoria as string))
        :   null;

    const [endereco, setEndereco] = useState(mercadoria?.endereco || '');
    const [codigoBarras, setCodigoBarras] = useState(
        mercadoria?.codigoBarras || '',
    );
    const [isSaving, setIsSaving] = useState(false);

    // Set header title
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Mercadoria',
        });
    }, [navigation]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: Implementar mutation para atualizar endereço e código de barras
            Alert.alert('Sucesso', 'Mercadoria atualizada com sucesso!');
            router.back();
        } catch (err) {
            Alert.alert('Erro', 'Falha ao atualizar mercadoria');
        } finally {
            setIsSaving(false);
        }
    };

    if (!mercadoria) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                <Text style={{ color: colors.text }}>
                    Nenhuma mercadoria selecionada
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View
                    style={[
                        styles.headerCard,
                        { backgroundColor: colors.cardBackground },
                    ]}
                >
                    <MaterialCommunityIcons
                        name="package"
                        size={32}
                        color={colors.tint}
                        style={styles.headerIcon}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>
                            {mercadoria.nome}
                        </Text>
                        {mercadoria.id && (
                            <Text
                                style={[
                                    styles.headerSubtitle,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                ID: {mercadoria.id}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Informações de Consulta */}
                <View style={styles.section}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Informações da Mercadoria
                    </Text>

                    {/* Código de Barras (consulta) */}
                    {mercadoria.codigoBarras && (
                        <View style={styles.infoField}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Código de Barras
                            </Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: colors.text },
                                ]}
                            >
                                {mercadoria.codigoBarras}
                            </Text>
                        </View>
                    )}

                    {/* Preço */}
                    {mercadoria.preco && (
                        <View style={styles.infoField}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Preço de Venda
                            </Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: colors.text },
                                ]}
                            >
                                R$ {mercadoria.preco.toFixed(2)}
                            </Text>
                        </View>
                    )}

                    {/* Estoque */}
                    {mercadoria.estoque !== undefined && (
                        <View style={styles.infoField}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Estoque Total
                            </Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: colors.text },
                                ]}
                            >
                                {mercadoria.estoque}
                            </Text>
                        </View>
                    )}

                    {/* Grupo */}
                    {mercadoria.grupo && (
                        <View style={styles.infoField}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Grupo
                            </Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: colors.text },
                                ]}
                            >
                                {mercadoria.grupo}
                            </Text>
                        </View>
                    )}

                    {/* Subgrupo */}
                    {mercadoria.subgrupo && (
                        <View style={styles.infoField}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Subgrupo
                            </Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: colors.text },
                                ]}
                            >
                                {mercadoria.subgrupo}
                            </Text>
                        </View>
                    )}

                    {/* Tipo */}
                    {mercadoria.tipo && (
                        <View style={styles.infoField}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Tipo
                            </Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: colors.text },
                                ]}
                            >
                                {mercadoria.tipo}
                            </Text>
                        </View>
                    )}

                    {/* Referência */}
                    {mercadoria.referencia && (
                        <View style={styles.infoField}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Referência
                            </Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: colors.text },
                                ]}
                            >
                                {mercadoria.referencia}
                            </Text>
                        </View>
                    )}

                    {/* Peso */}
                    {mercadoria.pesoLiquido && (
                        <View style={styles.infoField}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Peso Líquido
                            </Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: colors.text },
                                ]}
                            >
                                {mercadoria.pesoLiquido} kg
                            </Text>
                        </View>
                    )}
                </View>

                {/* Edição */}
                <View style={styles.section}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Editar
                    </Text>

                    {/* Endereço */}
                    <View style={styles.fieldGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            Endereçamento
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.inputBackground,
                                    borderColor: colors.inputBorder,
                                    color: colors.text,
                                },
                            ]}
                            value={endereco}
                            onChangeText={setEndereco}
                            placeholder="Ex: A-15-3-4"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    {/* Código de Barras (edição) */}
                    <View style={styles.fieldGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            Código de Barras
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.inputBackground,
                                    borderColor: colors.inputBorder,
                                    color: colors.text,
                                },
                            ]}
                            value={codigoBarras}
                            onChangeText={setCodigoBarras}
                            placeholder="Ex: 7908346303546"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>
                </View>

                {/* Botões de Ação */}
                <View style={styles.actionsContainer}>
                    <Button
                        onPress={() => router.back()}
                        style={styles.cancelButton}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onPress={handleSave}
                        disabled={isSaving}
                        style={styles.saveButton}
                    >
                        {isSaving ? 'Salvando...' : '💾 Salvar'}
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    headerCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 12,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    infoField: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 6,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    fieldGroup: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    cancelButton: {
        flex: 1,
    },
    saveButton: {
        flex: 1.2,
    },
});
