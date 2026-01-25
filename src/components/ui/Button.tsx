import { Text } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    StyleSheet,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
    children: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    style,
    ...props
}: ButtonProps) {
    const { colors } = useTheme();
    const isDisabled = disabled || isLoading;

    const getColorForVariant = (variant: ButtonVariant) => {
        switch (variant) {
            case 'primary':
                return colors.tint;
            case 'secondary':
                return colors.success;
            case 'outline':
                return 'transparent';
            case 'ghost':
                return 'transparent';
            default:
                return colors.tint;
        }
    };

    const getTextColorForVariant = (variant: ButtonVariant) => {
        switch (variant) {
            case 'primary':
                // Se o tint é amarelo (dark mode Smartfit), usar texto preto
                return colors.tint === '#FFB80D' ? '#000' : 'white';
            case 'secondary':
                return 'white';
            case 'outline':
                return colors.tint;
            case 'ghost':
                return colors.tint;
            default:
                return 'white';
        }
    };

    const textColor = getTextColorForVariant(variant);
    const borderColor = variant === 'outline' ? colors.tint : 'transparent';

    // Utilitário simples para escurecer uma cor hex
    const darken = (hex: string, amount = 0.12) => {
        const h = hex.replace('#', '');
        const bigint = parseInt(
            h.length === 3 ?
                h
                    .split('')
                    .map((c) => c + c)
                    .join('')
            :   h,
            16,
        );
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        const dr = Math.max(0, Math.floor(r * (1 - amount)));
        const dg = Math.max(0, Math.floor(g * (1 - amount)));
        const db = Math.max(0, Math.floor(b * (1 - amount)));
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(dr)}${toHex(dg)}${toHex(db)}`;
    };

    const computeBackground = (variant: ButtonVariant, pressed: boolean) => {
        const base = getColorForVariant(variant);
        if (variant === 'primary' || variant === 'secondary') {
            return pressed ? darken(base) : base;
        }
        return base; // outline/ghost permanecem transparentes
    };

    return (
        <Pressable
            style={({ pressed }) => {
                const styleArray = [
                    styles.button,
                    styles[size],
                    fullWidth && styles.fullWidth,
                    variant === 'outline' && styles.outlineBase,
                    isDisabled && styles.disabled,
                    {
                        backgroundColor: computeBackground(variant, !!pressed),
                        borderColor,
                    },
                ];
                return styleArray;
            }}
            disabled={isDisabled}
            {...props}
        >
            {isLoading ?
                <ActivityIndicator color={textColor} />
            :   <>
                    {leftIcon && (
                        <MaterialCommunityIcons
                            name={leftIcon}
                            size={
                                size === 'sm' ? 16
                                : size === 'lg' ?
                                    24
                                :   20
                            }
                            color={textColor}
                            style={styles.leftIcon}
                        />
                    )}
                    <Text
                        style={[
                            styles.text,
                            { color: textColor },
                            styles[`${size}Text`],
                        ]}
                    >
                        {children}
                    </Text>
                    {rightIcon && (
                        <MaterialCommunityIcons
                            name={rightIcon}
                            size={
                                size === 'sm' ? 16
                                : size === 'lg' ?
                                    24
                                :   20
                            }
                            color={textColor}
                            style={styles.rightIcon}
                        />
                    )}
                </>
            }
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        gap: 8,
    },
    // Sizes
    sm: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 36,
    },
    md: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 48,
    },
    lg: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        minHeight: 56,
    },
    // Text styles
    text: {
        fontWeight: '600',
    },
    smText: {
        fontSize: 14,
    },
    mdText: {
        fontSize: 16,
    },
    lgText: {
        fontSize: 18,
    },
    // States
    disabled: {
        opacity: 0.5,
    },
    fullWidth: {
        width: '100%',
    },
    outlineBase: {
        borderWidth: 1.5,
    },
    leftIcon: {
        marginRight: -4,
    },
    rightIcon: {
        marginLeft: -4,
    },
});
