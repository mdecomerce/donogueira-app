import { Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    TextInputProps,
    ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
}

export function Input({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    style,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    error && styles.inputContainerError,
                ]}
            >
                {leftIcon && (
                    <MaterialCommunityIcons
                        name={leftIcon}
                        size={24}
                        color={
                            error ? '#FF3B30'
                            : isFocused ?
                                '#007AFF'
                            :   '#666'
                        }
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor="#999"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {rightIcon && (
                    <Pressable
                        onPress={onRightIconPress}
                        style={styles.rightIcon}
                    >
                        <MaterialCommunityIcons
                            name={rightIcon}
                            size={24}
                            color={error ? '#FF3B30' : '#666'}
                        />
                    </Pressable>
                )}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        opacity: 0.8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: 'transparent',
    },
    inputContainerFocused: {
        borderColor: '#007AFF',
    },
    inputContainerError: {
        borderColor: '#FF3B30',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    leftIcon: {
        marginRight: 12,
    },
    rightIcon: {
        padding: 4,
        marginLeft: 8,
    },
    error: {
        fontSize: 12,
        color: '#FF3B30',
        marginTop: 4,
        marginLeft: 4,
    },
});
