import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
    const { colors } = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.tint,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.cardBackground,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                },
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.cardBackground,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            {/* Buscar Mercadorias */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Buscar',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="magnify"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Editar Mercadoria */}
            <Tabs.Screen
                name="editarMercadoria"
                options={{
                    title: 'Mercadoria',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="package-variant-closed"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Perfil */}
            <Tabs.Screen
                name="perfil"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="account"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Configurações */}
            <Tabs.Screen
                name="configuracoes"
                options={{
                    title: 'Config',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="cog"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
