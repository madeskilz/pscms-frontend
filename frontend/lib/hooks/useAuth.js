import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getMe, login as apiLogin } from '../api';

/**
 * Custom hook for authentication
 * Handles auth state, login, logout, and token management
 */
export function useAuth(requireAuth = false) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
    
    if (!token) {
      setLoading(false);
      if (requireAuth) {
        router.push('/admin/login');
      }
      return;
    }

    setAccessToken(token);
    
    getMe(token)
      .then(setUser)
      .catch((error) => {
        console.error('Auth error:', error);
        if (requireAuth) {
          router.push('/admin/login');
        }
      })
      .finally(() => setLoading(false));
  }, [requireAuth, router]);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
    }
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    }
    setAccessToken(null);
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  return {
    user,
    loading,
    accessToken,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
