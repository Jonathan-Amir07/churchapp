import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type Role = 'admin' | 'priest' | 'instructor' | 'parent' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string;
  classId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignout: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isSignout: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  login: async (user, token) => {
    await SecureStore.setItemAsync('auth_token', token);
    await SecureStore.setItemAsync('user_data', JSON.stringify(user));
    set({ user, token, isSignout: false });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
    set({ user: null, token: null, isSignout: true });
  },
  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userData = await SecureStore.getItemAsync('user_data');
      if (token && userData) {
        set({ user: JSON.parse(userData), token, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
