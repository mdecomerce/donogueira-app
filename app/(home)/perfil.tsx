import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/stores/useThemeStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

export default function PerfilScreen() {
    const { user, logout } = useAuthStore();
    const { colors, isDark } = useTheme();
    const { setColorScheme } = useThemeStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={{ backgroundColor: colors.background }}
        >
            {/* Avatar */}
            <View style={styles.avatarSection}>
                <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                    <MaterialCommunityIcons
                        name="account"
                        size={48}
                        color="#fff"
                    />
                </View>
                <Text style={[styles.name, { color: colors.text }]}>
                    {user?.nome || 'Usuário'}
                </Text>
            </View>

            {/* Informações */}
            <View style={styles.section}>
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: colors.textSecondary },
                    ]}
                >
                    Informações Pessoais
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
                            name="account-circle"
                            size={20}
                            color={colors.tint}
                        />
                        <Text
                            style={[
                                styles.infoLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Nome
                        </Text>
                    </View>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                        {user?.nome || 'N/A'}
                    </Text>
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
                            name="office-building"
                            size={20}
                            color={colors.tint}
                        />
                        <Text
                            style={[
                                styles.infoLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Empresas
                        </Text>
                    </View>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                        {user?.empresas?.join(', ') || 'N/A'}
                    </Text>
                </View>
            </View>

            {/* Preferências */}
            <View style={styles.section}>
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: colors.textSecondary },
                    ]}
                >
                    Preferências
                </Text>

                <Pressable
                    onPress={() => setColorScheme(isDark ? 'light' : 'dark')}
                    style={[
                        styles.preferenceCard,
                        {
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.preferenceRow}>
                        <MaterialCommunityIcons
                            name={
                                isDark ?
                                    'white-balance-sunny'
                                :   'moon-waning-crescent'
                            }
                            size={20}
                            color={colors.tint}
                        />
                        <Text
                            style={[
                                styles.preferenceLabel,
                                { color: colors.text },
                            ]}
                        >
                            Modo {isDark ? 'Claro' : 'Escuro'}
                        </Text>
                    </View>
                    <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color={colors.textSecondary}
                    />
                </Pressable>
            </View>

            {/* Logout */}
            <Button
                fullWidth
                variant="primary"
                onPress={handleLogout}
                style={styles.logoutButton}
            >
                🚪 Sair
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
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
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 12,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 32,
    },
    preferenceCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    preferenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    preferenceLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    logoutButton: {
        marginTop: 12,
        marginBottom: 24,
    },
});
