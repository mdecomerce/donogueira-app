import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useHealth } from '@/hooks/api/useHealth';
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
    const [debugLog, setDebugLog] = useState<string[]>([]);
    const [showDebug, setShowDebug] = useState(false);

    const { login } = useAuthStore();
    const { showNotification } = useAppStore();
    const { colors, isDark } = useTheme();
    const { setColorScheme } = useThemeStore();
    const {
        data: healthData,
        isLoading: healthLoading,
        refetch: refetchHealth,
        error: healthError,
    } = useHealth();

    const addDebugLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString('pt-BR');
        setDebugLog((prev) =>
            [`[${timestamp}] ${message}`, ...prev].slice(0, 20),
        );
    };

    const handleUsuarioChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setUsuario(numericValue);
    };

    const handleLogin = async () => {
        if (!usuario || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        if (usuario.length < 1) {
            Alert.alert('Erro', 'Usuário deve ter no mínimo 1 dígito');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            login(
                {
                    id: parseInt(usuario) || 1,
                    nome: `Usuário ${usuario}`,
                    empresas: [1],
                },
                'fake-jwt-token-123',
            );

            showNotification('Login realizado com sucesso!');
            setIsLoading(false);
            router.replace('/(home)');
        }, 1500);
    };

    const handleHealthCheck = async () => {
        const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'NÃO CONFIGURADA';
        const fullUrl =
            baseUrl === 'NÃO CONFIGURADA' ? 'NÃO CONFIGURADA' : (
                `${baseUrl}health`
            );

        addDebugLog('🔄 Iniciando verificação da API...');
        addDebugLog(`📍 URL Base: ${baseUrl}`);
        addDebugLog(`🔗 Rota Completa: ${fullUrl}`);

        try {
            const result = await refetchHealth();
            addDebugLog(`✅ Resposta recebida`);

            if (result.data) {
                addDebugLog(`✅ Status: ${result.data.status}`);
                addDebugLog(`📝 Mensagem: ${result.data.message}`);

                Alert.alert(
                    'Status da API',
                    `Status: ${result.data.status}\n${result.data.message}\n\nTimestamp: ${new Date(result.data.timestamp).toLocaleString('pt-BR')}`,
                    [{ text: 'OK' }],
                );
            } else if (result.error) {
                const errorObj = result.error as any;
                addDebugLog(
                    `❌ Erro no result: ${errorObj?.message || 'Erro desconhecido'}`,
                );

                if (errorObj?.response) {
                    addDebugLog(`📊 Status HTTP: ${errorObj.response.status}`);
                    addDebugLog(
                        `📄 Data: ${JSON.stringify(errorObj.response.data)}`,
                    );
                }

                // Tenta extrair mensagem de erro da resposta da API
                const errorMessage =
                    errorObj?.response?.data?.message ||
                    errorObj?.message ||
                    'Não foi possível verificar o status da API';

                const errorDetails =
                    errorObj?.response?.data ?
                        JSON.stringify(errorObj.response.data, null, 2)
                    :   null;

                Alert.alert('Erro na API', errorDetails || errorMessage);
            }
        } catch (error: any) {
            addDebugLog(
                `❌ Exception capturada: ${error?.message || 'Erro desconhecido'}`,
            );

            if (error?.response) {
                addDebugLog(`📊 Status HTTP: ${error.response.status}`);
                addDebugLog(
                    `📄 Response: ${JSON.stringify(error.response.data)}`,
                );
            } else if (error?.request) {
                addDebugLog(`⚠️ Request feito mas sem resposta`);
                addDebugLog(
                    `🔗 URL tentada: ${error.config?.url || 'desconhecida'}`,
                );
            } else {
                addDebugLog(`⚠️ Erro ao configurar request: ${error.message}`);
            }

            // Tenta extrair informações detalhadas do erro
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'API indisponível ou sem conexão';

            const errorStatus =
                error?.response?.status ?
                    `\nStatus: ${error.response.status}`
                :   '';

            const errorDetails =
                error?.response?.data ?
                    `\n\nDetalhes:\n${JSON.stringify(error.response.data, null, 2)}`
                :   '';

            Alert.alert(
                'Erro de Conexão',
                `${errorMessage}${errorStatus}${errorDetails}`,
            );
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
                style={{ backgroundColor: colors.background }}
            >
                {/* Ações do topo: config + tema */}
                <View style={styles.topActions}>
                    <Pressable
                        onPress={() => setShowDebug(!showDebug)}
                        style={[
                            styles.actionButton,
                            {
                                backgroundColor:
                                    showDebug ?
                                        colors.tint
                                    :   colors.cardBackground,
                            },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="bug-outline"
                            size={22}
                            color={showDebug ? '#FFF' : colors.tint}
                        />
                    </Pressable>
                    <Pressable
                        onPress={handleHealthCheck}
                        disabled={healthLoading}
                        style={[
                            styles.actionButton,
                            { backgroundColor: colors.cardBackground },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={healthLoading ? 'loading' : 'cog-outline'}
                            size={22}
                            color={colors.tint}
                        />
                    </Pressable>
                    <Pressable
                        onPress={() =>
                            setColorScheme(isDark ? 'light' : 'dark')
                        }
                        style={[
                            styles.actionButton,
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

                {/* Console de Debug */}
                {showDebug && (
                    <View
                        style={[
                            styles.debugContainer,
                            {
                                backgroundColor: colors.cardBackground,
                                borderColor: colors.tint,
                            },
                        ]}
                    >
                        <View style={styles.debugHeader}>
                            <Text
                                style={[
                                    styles.debugTitle,
                                    { color: colors.text },
                                ]}
                            >
                                🐛 Debug Console
                            </Text>
                            <Pressable onPress={() => setDebugLog([])}>
                                <Text style={{ color: colors.tint }}>
                                    Limpar
                                </Text>
                            </Pressable>
                        </View>
                        <ScrollView style={styles.debugScroll}>
                            {debugLog.length === 0 ?
                                <Text
                                    style={[
                                        styles.debugLog,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    Nenhum log ainda. Clique no ícone de config
                                    para testar a API.
                                </Text>
                            :   debugLog.map((log, index) => (
                                    <Text
                                        key={index}
                                        style={[
                                            styles.debugLog,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {log}
                                    </Text>
                                ))
                            }
                        </ScrollView>
                    </View>
                )}

                <View style={styles.content}>
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

                    <View style={styles.form}>
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

                        <Button
                            fullWidth
                            variant="primary"
                            onPress={handleLogin}
                            isLoading={isLoading}
                        >
                            Entrar
                        </Button>
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
    topActions: {
        padding: 16,
        paddingTop: 28,
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
    },
    actionButton: {
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
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
    },
    inputIcon: {
        marginRight: 4,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 4,
    },
    debugContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        borderWidth: 2,
        borderRadius: 12,
        padding: 12,
        maxHeight: 250,
    },
    debugHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    debugTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    debugScroll: {
        maxHeight: 180,
    },
    debugLog: {
        fontSize: 11,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        marginBottom: 4,
        lineHeight: 16,
    },
});
