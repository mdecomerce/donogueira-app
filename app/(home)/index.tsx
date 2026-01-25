import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/stores/useThemeStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
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
            {/* Theme Toggle */}
            <View style={styles.themeToggleContainer}>
                <Pressable
                    onPress={() =>
                        setColorScheme(isDark ? 'light' : 'dark')
                    }
                    style={[
                        styles.themeToggle,
                        { backgroundColor: colors.cardBackground },
                    ]}
                >
                    <MaterialCommunityIcons
                        name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'}
                        size={24}
                        color={colors.tint}
                    />
                </Pressable>
            </View>

            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Bem-vindo! 👋
                </Text>
                <Text
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                    {user?.name}
                </Text>
            </View>

            <View style={styles.content}>
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.cardTitle,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Usuário
                    </Text>
                    <Text style={[styles.cardText, { color: colors.text }]}>
                        {user?.email}
                    </Text>
                </View>

                <Button fullWidth variant="primary" onPress={handleLogout}>
                    Logout
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    themeToggleContainer: {
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    themeToggle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        opacity: 0.7,
        marginTop: 8,
    },
    content: {
        gap: 20,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 14,
        opacity: 0.6,
        marginBottom: 8,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
