import { useState, useEffect, useCallback, useRef } from 'react';
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
    const isCheckingAuth = useRef(false);

  useEffect(() => {
      // Prevent duplicate checks (especially in React Strict Mode)
      if (isCheckingAuth.current) {
          return;
      }
      isCheckingAuth.current = true;

      const checkAuth = async () => {
          const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;

          if (!token) {
              setLoading(false);
          if (requireAuth && router.pathname !== '/admin/login') {
              // Clear all sensitive data before redirecting to login
              if (typeof window !== 'undefined') {
                  sessionStorage.clear();
                  // Also clear localStorage if you use it
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
              }
            // Prevent redirect loop
            const now = Date.now();
            sessionStorage.setItem('_lastAuthRedirect', now.toString());
            router.replace('/admin/login');
        }
          return;
          } setAccessToken(token);

          try {
              const userData = await getMe(token);
              setUser(userData);
              setLoading(false);
              // Clear redirect tracker on successful auth
              if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('_lastAuthRedirect');
            }
        } catch (error) {
        console.error('Auth error:', error);
            // Clear ALL sensitive data on auth failure
            if (typeof window !== 'undefined') {
                sessionStorage.clear();
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
            setAccessToken(null);
            setUser(null);
            setLoading(false);
            if (requireAuth && router.pathname !== '/admin/login') {
                // Prevent redirect loop
                const now = Date.now();
                sessionStorage.setItem('_lastAuthRedirect', now.toString());
                router.replace('/admin/login');
            }
        }
      }; checkAuth();

      // Cleanup function to reset the flag when component unmounts
      return () => {
          isCheckingAuth.current = false;
      };
  }, []);

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
        // Clear ALL sensitive data on logout
        sessionStorage.clear();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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
