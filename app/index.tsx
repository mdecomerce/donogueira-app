import { useAuthStore } from '@/features/auth';
import type { RedirectProps } from 'expo-router';
import { Redirect } from 'expo-router';

const HOME_ROUTE = '/(home)' as RedirectProps['href'];

export default function Index() {
    const { isAuthenticated } = useAuthStore();

    // Redireciona para login ou home baseado na autenticação
    if (isAuthenticated) {
        return <Redirect href={HOME_ROUTE} />;
    }

    return <Redirect href="/(auth)/login" />;
}
