// src/providers/AuthProvider.js
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
        const token = Cookies.get('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Ambil data profile
        const response = await authAPI.getProfile();
        if (response.success) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          // Jika gagal, hapus token
          Cookies.remove('token');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Jika error, hapus token
        Cookies.remove('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Simpan token ke cookies
        Cookies.set('token', token, { expires: 1 }); // Expires in 1 day
        
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
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
    toast.success('Logout berhasil');
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