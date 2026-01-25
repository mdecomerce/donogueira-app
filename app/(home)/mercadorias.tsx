import { Text, View } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet } from 'react-native';

export default function MercadoriasScreen() {
    const { colors } = useTheme();

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={{ backgroundColor: colors.background }}
        >
            <View style={styles.placeholder}>
                <MaterialCommunityIcons
                    name="package"
                    size={64}
                    color={colors.tint}
                />
                <Text style={[styles.title, { color: colors.text }]}>
                    Mercadorias
                </Text>
                <Text
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                    Lista de todas as mercadorias cadastradas
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    placeholder: {
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
});
