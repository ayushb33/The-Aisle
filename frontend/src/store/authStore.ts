import { create } from 'zustand';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  updateProfile: (data: { firstName: string; lastName: string; phone?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts loading to check session on mount
  error: null,
  setUser: (user) => set({ user, isAuthenticated: true, error: null }),
  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.get('/auth/me');
      set({ user: res.data.data.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
  updateProfile: async (data) => {
    try {
      const res = await api.patch('/auth/profile', data);
      set({ user: res.data.data.user });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },
}));
