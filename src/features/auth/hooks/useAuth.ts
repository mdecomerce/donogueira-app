import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';

interface LoginCredentials {
    usuario: string;
    password: string;
}

interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}

export function useLogin(options?: UseMutationOptions<LoginResponse, Error, LoginCredentials>) {
    const { login } = useAuthStore();

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            // Aqui você fará a chamada real para sua API
            // Por enquanto, simulando resposta
            return new Promise<LoginResponse>((resolve) => {
                setTimeout(() => {
                    resolve({
                        user: {
                            id: credentials.usuario,
                            name: `Usuário ${credentials.usuario}`,
                            email: `${credentials.usuario}@app.com`,
                        },
                        token: 'fake-jwt-token-123',
                    });
                }, 1500);
            });
        },
        onSuccess: (data) => {
            login(data.user, data.token);
        },
        ...options,
    });
}

export function useLogout() {
    const { logout } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            // Aqui você pode chamar endpoint de logout se necessário
            await new Promise((resolve) => setTimeout(resolve, 500));
        },
        onSuccess: () => {
            logout();
        },
    });
}
