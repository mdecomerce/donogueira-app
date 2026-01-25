import { create } from 'zustand';

export type ColorScheme = 'light' | 'dark' | 'auto';

interface ThemeStore {
    colorScheme: ColorScheme;
    setColorScheme: (scheme: ColorScheme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
    colorScheme: 'auto',
    setColorScheme: (scheme) => set({ colorScheme: scheme }),
}));
