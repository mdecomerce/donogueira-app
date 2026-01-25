import { Text, View } from '@/components/Themed';
import { useAuthStore } from '@/features/auth';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/stores/useAppStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
} from 'react-native';

export default function LoginScreen() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuthStore();
    const { showNotification } = useAppStore();
    const { colors, isDark } = useTheme();
    const { colorScheme, setColorScheme } = useThemeStore();

    const handleUsuarioChange = (text: string) => {
        // Aceita somente números
        const numericValue = text.replace(/[^0-9]/g, '');
        setUsuario(numericValue);
    };

    const handleLogin = async () => {
        if (!usuario || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        if (usuario.length < 3) {
            Alert.alert('Erro', 'Usuário deve ter no mínimo 3 dígitos');
            return;
        }

        setIsLoading(true);

        // Simular chamada de API
        setTimeout(() => {
            // Aqui você faria a chamada real para sua API
            login(
                {
                    id: usuario,
                    name: `Usuário ${usuario}`,
                    email: `${usuario}@app.com`,
                },
                'fake-jwt-token-123',
            );

            showNotification('Login realizado com sucesso!');
            setIsLoading(false);

            // Navegar para a tela principal
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: colors.background }}
            >
                {/* Theme Toggle Button */}
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
                            name={
                                isDark ?
                                    'white-balance-sunny'
                                :   'moon-waning-crescent'
                            }
                            size={24}
                            color={colors.tint}
                        />
                    </Pressable>
                </View>

                <View style={styles.content}>
                    {/* Logo/Icon */}
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons
                            name="shield-account"
                            size={80}
                            color={colors.tint}
                        />
                        <Text style={[styles.title, { color: colors.text }]}>
                            Bem-vindo!
                        </Text>
                        <Text
                            style={[
                                styles.subtitle,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Entre para continuar
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Usuario Input */}
                        <View
                            style={[
                                styles.inputContainer,
                                {
                                    borderColor: colors.inputBorder,
                                    backgroundColor: colors.inputBackground,
                                },
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="account-outline"
                                size={24}
                                color={colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Usuário"
                                placeholderTextColor={colors.textSecondary}
                                value={usuario}
                                onChangeText={handleUsuarioChange}
                                keyboardType="numeric"
                                autoCapitalize="none"
                                maxLength={15}
                            />
                        </View>

                        {/* Password Input */}
                        <View
                            style={[
                                styles.inputContainer,
                                {
                                    borderColor: colors.inputBorder,
                                    backgroundColor: colors.inputBackground,
                                },
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="lock-outline"
                                size={24}
                                color={colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Senha"
                                placeholderTextColor={colors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoComplete="password"
                            />
                            <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <MaterialCommunityIcons
                                    name={
                                        showPassword ? 'eye-off-outline' : (
                                            'eye-outline'
                                        )
                                    }
                                    size={24}
                                    color={colors.textSecondary}
                                />
                            </Pressable>
                        </View>

                        {/* Login Button */}
                        <Pressable
                            style={[
                                styles.loginButton,
                                { backgroundColor: colors.tint },
                                isLoading && styles.loginButtonDisabled,
                            ]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ?
                                    <MaterialCommunityIcons
                                        name="loading"
                                        size={24}
                                        color={isDark ? '#000' : 'white'}
                                        style={styles.spinner}
                                    />
                                :   <Text
                                        style={[
                                            styles.loginButtonText,
                                            { color: isDark ? '#000' : 'white' },
                                        ]}
                                    >
                                        Entrar
                                    </Text>
                                }
                        </Pressable>
                    </View>
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
        flexGrow: 1,
    },
    themeToggleContainer: {
        padding: 16,
        alignItems: 'flex-end',
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
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 16,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
        marginTop: 8,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 4,
    },
    loginButton: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    spinner: {
        transform: [{ rotate: '360deg' }],
    },
});
