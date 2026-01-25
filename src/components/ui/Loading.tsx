import { Text, View } from '@/components/Themed';
import { ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingProps {
    message?: string;
    size?: 'small' | 'large';
}

export function Loading({
    message = 'Carregando...',
    size = 'large',
}: LoadingProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color="#007AFF" />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    message: {
        fontSize: 16,
        opacity: 0.6,
    },
});
