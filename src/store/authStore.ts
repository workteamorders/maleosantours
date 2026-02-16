'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser } from '@/src/types';

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  
  // Actions
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  setUser: (user: AdminUser) => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
  setHasHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      hasHydrated: false,

      login: (token: string, user: AdminUser) => {
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        // Store token in localStorage for API calls
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', token);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
        }
      },

      setUser: (user: AdminUser) => {
        set({ user });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setHasHydrated: (val: boolean) => {
        set({ hasHydrated: val });
      },

      hydrate: () => {
        // Hydrate from localStorage
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('admin_token');
          if (token) {
            set({ token, isAuthenticated: true, hasHydrated: true });
          } else {
            set({ hasHydrated: true });
          }
        }
      },
    }),
    {
      name: 'admin-auth-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
