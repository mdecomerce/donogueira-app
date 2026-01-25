import { create } from 'zustand';

interface AppState {
    // UI State
    isLoading: boolean;
    notification: string | null;

    // Settings
    language: 'pt' | 'en';
    theme: 'light' | 'dark' | 'auto';

    // Actions
    setLoading: (loading: boolean) => void;
    showNotification: (message: string) => void;
    clearNotification: () => void;
    setLanguage: (lang: 'pt' | 'en') => void;
    setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export const useAppStore = create<AppState>((set) => ({
    isLoading: false,
    notification: null,
    language: 'pt',
    theme: 'auto',

    setLoading: (loading) => set({ isLoading: loading }),

    showNotification: (message) => set({ notification: message }),

    clearNotification: () => set({ notification: null }),

    setLanguage: (lang) => set({ language: lang }),

    setTheme: (theme) => set({ theme }),
}));
