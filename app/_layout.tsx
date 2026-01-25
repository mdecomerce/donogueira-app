import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { useAuthStore } from '@/features/auth';
import { useTheme } from '@/hooks/useTheme';
import { asyncStoragePersister, queryClient } from '@/lib/queryClient';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(home)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const { colorScheme, isDark } = useTheme();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    // Monitorar mudanças de autenticação e redirecionar
    useEffect(() => {
        if (!isAuthenticated) {
            // Pequeno delay pra garantir que a navegação está pronta
            const timer = setTimeout(() => {
                router.replace('/(auth)/login');
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, router]);

    // Inicializa persist para mobile
    useEffect(() => {
        if (Platform.OS !== 'web' && asyncStoragePersister) {
            const {
                persistQueryClient,
            } = require('@tanstack/query-persist-client-core');
            persistQueryClient({
                queryClient,
                persister: asyncStoragePersister,
                maxAge: 1000 * 60 * 60 * 24, // 24 horas
            });
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
                <StatusBar
                    translucent={false}
                    style={isDark ? 'light' : 'dark'}
                    backgroundColor={Colors[colorScheme ?? 'light'].background}
                />
                <Stack
                    screenOptions={{
                        statusBarStyle: isDark ? 'light' : 'dark',
                        statusBarBackgroundColor:
                            Colors[colorScheme ?? 'light'].background,
                    }}
                >
                    <Stack.Screen
                        name="(auth)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="(home)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="modal"
                        options={{ presentation: 'modal' }}
                    />
                </Stack>
                {Platform.OS === 'web' && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}
            </ThemeProvider>
        </QueryClientProvider>
    );
}
