'use client';

import { useAuthStore } from '@/src/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    setUser,
    setLoading,
    hydrate,
  } = useAuthStore();

  // Hydrate on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleLogin = (newToken: string, newUser: any) => {
    login(newToken, newUser);
    router.push('/admin');
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    setUser,
    setLoading,
  };
};

// Hook to protect routes
export const useProtectedRoute = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, hasHydrated, router]);

  return { isLoading: isLoading || !hasHydrated, isAuthenticated };
};
