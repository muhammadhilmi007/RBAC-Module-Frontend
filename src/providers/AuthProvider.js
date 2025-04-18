'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { authAPI } from '@/lib/api';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Cek apakah user sudah login saat load aplikasi
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get('accessToken');
        
        if (!token) {
          // Coba refresh token jika tidak ada access token
          try {
            const refreshResponse = await authAPI.refreshToken();
            if (refreshResponse.success) {
              const { user } = refreshResponse.data;
              setUser(user);
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } catch (refreshError) {
            setIsAuthenticated(false);
          }
        } else {
          // Jika ada token, ambil data profile
          try {
            const response = await authAPI.getProfile();
            if (response.success) {
              setUser(response.data);
              setIsAuthenticated(true);
            } else {
              // Jika gagal, coba refresh token
              const refreshResponse = await authAPI.refreshToken();
              if (refreshResponse.success) {
                const { user } = refreshResponse.data;
                setUser(user);
                setIsAuthenticated(true);
              } else {
                setIsAuthenticated(false);
                Cookies.remove('accessToken');
              }
            }
          } catch (error) {
            setIsAuthenticated(false);
            Cookies.remove('accessToken');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        Cookies.remove('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Setup periodic token refresh
  useEffect(() => {
    if (isAuthenticated) {
      // Refresh token setiap 10 menit (600000ms)
      const refreshInterval = setInterval(async () => {
        try {
          await authAPI.refreshToken();
        } catch (error) {
          console.error('Token refresh error:', error);
        }
      }, 600000);

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated]);

  // Login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { user } = response.data;
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        toast.success('Login berhasil!');
        router.push('/dashboard');
        return true;
      } else {
        toast.error(response.message || 'Login gagal');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login gagal');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/auth/login');
      toast.success('Logout berhasil');
      setIsLoading(false);
    }
  };

  // Value yang akan dishare ke semua komponen
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;