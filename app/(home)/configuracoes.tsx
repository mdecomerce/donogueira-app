import { Text, View } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/stores/useThemeStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

export default function ConfigScreen() {
    const { colors, isDark } = useTheme();
    const { setColorScheme } = useThemeStore();

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={{ backgroundColor: colors.background }}
        >
            {/* Tema */}
            <View style={styles.section}>
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: colors.textSecondary },
                    ]}
                >
                    Aparência
                </Text>

                <Pressable
                    onPress={() => setColorScheme(isDark ? 'light' : 'dark')}
                    style={[
                        styles.configCard,
                        {
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.configRow}>
                        <MaterialCommunityIcons
                            name={
                                isDark ?
                                    'white-balance-sunny'
                                :   'moon-waning-crescent'
                            }
                            size={24}
                            color={colors.tint}
                        />
                        <View style={styles.configInfo}>
                            <Text
                                style={[
                                    styles.configLabel,
                                    { color: colors.text },
                                ]}
                            >
                                Modo {isDark ? 'Claro' : 'Escuro'}
                            </Text>
                            <Text
                                style={[
                                    styles.configDesc,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                {isDark ?
                                    'Modo escuro ativado'
                                :   'Modo claro ativado'}
                            </Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={colors.textSecondary}
                    />
                </Pressable>
            </View>

            {/* Informações */}
            <View style={styles.section}>
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: colors.textSecondary },
                    ]}
                >
                    Informações do Aplicativo
                </Text>

                <View
                    style={[
                        styles.infoCard,
                        {
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons
                            name="package"
                            size={20}
                            color={colors.tint}
                        />
                        <View style={styles.infoContent}>
                            <Text
                                style={[
                                    styles.infoLabel,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Versão
                            </Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: colors.text },
                                ]}
                            >
                                1.0.0
                            </Text>
                        </View>
                    </View>
                </View>

                <View
                    style={[
                        styles.infoCard,
                        {
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons
                            name="information"
                            size={20}
                            color={colors.tint}
                        />
                        <View style={styles.infoContent}>
                            <Text
                                style={[
                                    styles.infoLabel,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Desenvolvedor
                            </Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: colors.text },
                                ]}
                            >
                                Do Nogueira
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Debug Info */}
            <View style={styles.section}>
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: colors.textSecondary },
                    ]}
                >
                    Debug
                </Text>

                <View
                    style={[
                        styles.debugCard,
                        {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.debugLabel,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Debug Mode: {__DEV__ ? 'ON' : 'OFF'}
                    </Text>
                    <Text
                        style={[
                            styles.debugLabel,
                            { color: colors.textSecondary },
                        ]}
                    >
                        API URL:{'\n'}
                        {process.env.EXPO_PUBLIC_API_URL || 'N/A'}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    configCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    configRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    configInfo: {
        flex: 1,
    },
    configLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    configDesc: {
        fontSize: 12,
    },
    infoCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    debugCard: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        borderStyle: 'dashed',
    },
    debugLabel: {
        fontSize: 11,
        fontFamily: 'monospace',
        marginBottom: 8,
    },
});
