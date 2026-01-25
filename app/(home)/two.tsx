import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function TabTwoScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Em breve</Text>
            <Text style={styles.subtitle}>
                Esta aba ainda não foi configurada.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
        textAlign: 'center',
    },
});
