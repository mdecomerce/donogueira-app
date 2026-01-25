import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useHealth } from '@/hooks/api/useHealth';
import { useLogin } from '@/hooks/api/useLogin';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/stores/useAppStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    Clipboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    TextInput,
} from 'react-native';

type LogLevel = 'info' | 'warn' | 'error';
type LogEntry = {
    timestamp: string;
    level: LogLevel;
    message: string;
};

const DEBUG_STORAGE_KEY = '@app:debug_logs';
const MAX_LOGS = 100;
const DEBUG_ENABLED = process.env.EXPO_PUBLIC_DEBUG_MODE === 'true';
const AUTO_DEBUG_MODE = DEBUG_ENABLED && __DEV__;

export default function LoginScreen() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [debugLog, setDebugLog] = useState<LogEntry[]>([]);
    const [showDebug, setShowDebug] = useState(AUTO_DEBUG_MODE);

    const { login: loginStore } = useAuthStore();
    const { showNotification } = useAppStore();
    const { colors, isDark } = useTheme();
    const { setColorScheme } = useThemeStore();
    const {
        data: healthData,
        isLoading: healthLoading,
        refetch: refetchHealth,
        error: healthError,
    } = useHealth();

    // Hook para fazer login via API
    const { mutate: loginMutation, isPending: isLoggingIn } = useLogin();

    // Carregar logs do AsyncStorage ao montar
    useEffect(() => {
        loadLogsFromStorage();
    }, []);

    const loadLogsFromStorage = async () => {
        try {
            const stored = await AsyncStorage.getItem(DEBUG_STORAGE_KEY);
            if (stored) {
                const logs: LogEntry[] = JSON.parse(stored);
                setDebugLog(logs.slice(0, MAX_LOGS));
            }
        } catch (error) {
            console.error('Erro ao carregar logs:', error);
        }
    };

    const saveLogsToStorage = async (logs: LogEntry[]) => {
        try {
            await AsyncStorage.setItem(DEBUG_STORAGE_KEY, JSON.stringify(logs));
        } catch (error) {
            console.error('Erro ao salvar logs:', error);
        }
    };

    const addDebugLog = (message: string, level: LogLevel = 'info') => {
        const timestamp = new Date().toLocaleTimeString('pt-BR');
        const newLog: LogEntry = { timestamp, level, message };

        setDebugLog((prev) => {
            const updated = [newLog, ...prev].slice(0, MAX_LOGS);
            saveLogsToStorage(updated);
            return updated;
        });
    };

    const clearLogs = async () => {
        setDebugLog([]);
        try {
            await AsyncStorage.removeItem(DEBUG_STORAGE_KEY);
        } catch (error) {
            console.error('Erro ao limpar logs:', error);
        }
    };

    const exportLogs = async () => {
        const logsText = debugLog
            .map(
                (log) =>
                    `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`,
            )
            .join('\n');

        try {
            await Share.share({
                message: logsText,
                title: 'Debug Logs',
            });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível compartilhar os logs');
        }
    };

    const copyLogs = async () => {
        const logsText = debugLog
            .map(
                (log) =>
                    `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`,
            )
            .join('\n');

        Clipboard.setString(logsText);
        showNotification('Logs copiados para a área de transferência!');
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

        addDebugLog('🔐 Iniciando autenticação via API...', 'info');
        addDebugLog(`👤 Usuário: ${usuario}`, 'info');

        // Chamar a API de login
        loginMutation(
            {
                codigoUsuario: parseInt(usuario),
                senha: password,
            },
            {
                onSuccess: (data) => {
                    addDebugLog('✅ Autenticação bem-sucedida!', 'info');
                    addDebugLog(`👤 Nome: ${data.data.nome}`, 'info');
                    addDebugLog(
                        `🏢 Empresas: ${data.data.empresas.join(', ')}`,
                        'info',
                    );

                    showNotification('Login realizado com sucesso!');

                    // Aguarda um pouco para o usuário ver a mensagem
                    setTimeout(() => {
                        //router.replace('/(home)');
                    }, 500);
                },
                onError: (error: any) => {
                    addDebugLog(
                        `❌ Exception capturada: ${error?.message || 'Erro desconhecido'}`,
                        'error',
                    );

                    // Tenta extrair mensagens de erro da resposta
                    let errorMessage = 'Erro ao fazer login';
                    let errorDetails = '';

                    // Se for erro de rede/axios
                    if (error?.response) {
                        const status = error.response.status;
                        addDebugLog(`📊 Status HTTP: ${status}`, 'error');

                        const responseData = error.response.data;
                        addDebugLog(
                            `📄 Response: ${JSON.stringify(responseData)}`,
                            'error',
                        );

                        // Tentar extrair mensagem de diferentes formatos
                        errorMessage =
                            responseData?.message ||
                            responseData?.error ||
                            responseData?.msg ||
                            error.message ||
                            `Erro ${status}`;

                        errorDetails =
                            responseData ?
                                `\n\nDetalhes:\n${JSON.stringify(responseData, null, 2)}`
                            :   '';
                    } else if (error?.request) {
                        addDebugLog(
                            `⚠️ Request feito mas sem resposta`,
                            'warn',
                        );
                        errorMessage = 'Nenhuma resposta da API';
                    } else {
                        addDebugLog(
                            `⚠️ Erro ao configurar request: ${error.message}`,
                            'warn',
                        );
                        errorMessage = error.message || 'Erro ao fazer login';
                    }

                    Alert.alert('Erro no Login', `${errorMessage}`, [
                        { text: 'OK' },
                    ]);
                },
            },
        );
    };

    const handleHealthCheck = async () => {
        const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'NÃO CONFIGURADA';
        const fullUrl =
            baseUrl === 'NÃO CONFIGURADA' ? 'NÃO CONFIGURADA' : (
                `${baseUrl}health`
            );

        addDebugLog('🔄 Iniciando verificação da API...', 'info');
        addDebugLog(`📍 URL Base: ${baseUrl}`, 'info');
        addDebugLog(`🔗 Rota Completa: ${fullUrl}`, 'info');

        try {
            const result = await refetchHealth();
            addDebugLog(`✅ Resposta recebida`, 'info');

            if (result.data) {
                addDebugLog(`✅ Status: ${result.data.status}`, 'info');
                addDebugLog(`📝 Mensagem: ${result.data.message}`, 'info');

                Alert.alert(
                    'Status da API',
                    `Status: ${result.data.status}\n${result.data.message}\n\nTimestamp: ${new Date(result.data.timestamp).toLocaleString('pt-BR')}`,
                    [{ text: 'OK' }],
                );
            } else if (result.error) {
                const errorObj = result.error as any;
                addDebugLog(
                    `❌ Erro no result: ${errorObj?.message || 'Erro desconhecido'}`,
                    'error',
                );

                if (errorObj?.response) {
                    addDebugLog(
                        `📊 Status HTTP: ${errorObj.response.status}`,
                        'error',
                    );
                    addDebugLog(
                        `📄 Data: ${JSON.stringify(errorObj.response.data)}`,
                        'error',
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
                'error',
            );

            if (error?.response) {
                addDebugLog(
                    `📊 Status HTTP: ${error.response.status}`,
                    'error',
                );
                addDebugLog(
                    `📄 Response: ${JSON.stringify(error.response.data)}`,
                    'error',
                );
            } else if (error?.request) {
                addDebugLog(`⚠️ Request feito mas sem resposta`, 'warn');
                addDebugLog(
                    `🔗 URL tentada: ${error.config?.url || 'desconhecida'}`,
                    'warn',
                );
            } else {
                addDebugLog(
                    `⚠️ Erro ao configurar request: ${error.message}`,
                    'warn',
                );
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
                    {DEBUG_ENABLED && (
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
                    )}
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
                                🐛 Debug Console {AUTO_DEBUG_MODE && '(Auto)'}
                            </Text>
                            <View style={styles.debugActions}>
                                <Pressable
                                    onPress={copyLogs}
                                    style={styles.debugActionButton}
                                    disabled={debugLog.length === 0}
                                >
                                    <MaterialCommunityIcons
                                        name="content-copy"
                                        size={16}
                                        color={
                                            debugLog.length === 0 ?
                                                colors.textSecondary
                                            :   colors.tint
                                        }
                                    />
                                </Pressable>
                                <Pressable
                                    onPress={exportLogs}
                                    style={styles.debugActionButton}
                                    disabled={debugLog.length === 0}
                                >
                                    <MaterialCommunityIcons
                                        name="share-variant"
                                        size={16}
                                        color={
                                            debugLog.length === 0 ?
                                                colors.textSecondary
                                            :   colors.tint
                                        }
                                    />
                                </Pressable>
                                <Pressable
                                    onPress={clearLogs}
                                    style={styles.debugActionButton}
                                >
                                    <MaterialCommunityIcons
                                        name="delete-outline"
                                        size={16}
                                        color={colors.tint}
                                    />
                                </Pressable>
                            </View>
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
                            :   debugLog.map((log, index) => {
                                    const logColor =
                                        log.level === 'error' ? '#ff4444'
                                        : log.level === 'warn' ? '#ffaa00'
                                        : colors.text;

                                    return (
                                        <Text
                                            key={index}
                                            style={[
                                                styles.debugLog,
                                                { color: logColor },
                                            ]}
                                        >
                                            [{log.timestamp}] {log.message}
                                        </Text>
                                    );
                                })
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
                            isLoading={isLoggingIn}
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
        flex: 1,
    },
    debugActions: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    debugActionButton: {
        padding: 4,
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
