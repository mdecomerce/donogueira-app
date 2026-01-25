import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useThemeStore } from '@/stores/useThemeStore';

export function useTheme() {
    const colorScheme = useColorScheme();
    const { colorScheme: manualColorScheme } = useThemeStore();

    const effectiveColorScheme =
        manualColorScheme === 'auto' ? (colorScheme ?? 'light') : manualColorScheme;

    const isDark = effectiveColorScheme === 'dark';
    const colors = Colors[effectiveColorScheme];

    return {
        colors,
        isDark,
        colorScheme: effectiveColorScheme,
    };
}
