import { View } from '@/components/Themed';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

interface CardProps extends PressableProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outlined' | 'filled';
    padding?: number;
}

export function Card({
    children,
    variant = 'elevated',
    padding = 16,
    style,
    onPress,
    ...props
}: CardProps) {
    const cardStyle: any = [styles.card, styles[variant], { padding }, style];

    if (onPress) {
        return (
            <Pressable style={cardStyle} onPress={onPress} {...props}>
                {children}
            </Pressable>
        );
    }

    return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    outlined: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filled: {
        backgroundColor: '#f5f5f5',
    },
});
