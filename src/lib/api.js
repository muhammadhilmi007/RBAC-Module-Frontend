// src/lib/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Buat instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan interceptor untuk menambahkan token ke header
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    console.log('Auth token from cookies:', token ? 'Token exists' : 'No token found');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tambahkan interceptor untuk handling response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Jika response 401 (Unauthorized) dan bukan dari login, redirect ke login
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Hanya jika request bukan dari login endpoint
      if (!originalRequest.url.includes('auth/login')) {
        Cookies.remove('token');
        
        // Jika kode dijalankan di browser, redirect ke login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// ACL API
export const aclAPI = {
  getUserAccess: async () => {
    const response = await api.get('/acl/access');
    return response.data;
  },
  checkAccess: async (featureName, permissionName) => {
    const response = await api.post('/acl/check', { featureName, permissionName });
    return response.data;
  },
  getAllFeatures: async () => {
    const response = await api.get('/acl/features');
    return response.data;
  },
  getAllPermissions: async () => {
    const response = await api.get('/acl/permissions');
    return response.data;
  },
};

export default api;