// API Base URL - Configure conforme seu backend
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';

// Helper para fazer requisições
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
