import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(persist(
    (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,

        login: (user, token) => set({
            user,
            token,
            isAuthenticated: true
        }),

        logout: () => set({
            user: null,
            token: null,
            isAuthenticated: false
        }),

        updateUser: (userData) => set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null
        })),
    }),
    {
        name: 'auth-storage', // Nome da chave no AsyncStorage
        storage: createJSONStorage(() => AsyncStorage),
    }
));
