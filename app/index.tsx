import { useAuthStore } from '@/features/auth';
import { Redirect } from 'expo-router';

export default function Index() {
    const { isAuthenticated } = useAuthStore();

    // Redireciona para login ou tabs baseado na autenticação
    if (isAuthenticated) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/(auth)/login" />;
}
