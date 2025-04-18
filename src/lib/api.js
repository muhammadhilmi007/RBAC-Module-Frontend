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
  withCredentials: true // Penting untuk mengirim cookies saat request
});

// Token yang sedang di-refresh
let isRefreshing = false;
// Queue request yang menunggu token baru
let refreshSubscribers = [];

// Fungsi untuk memproses queue request
const onRefreshed = (accessToken) => {
  refreshSubscribers.forEach(callback => callback(accessToken));
  refreshSubscribers = [];
};

// Fungsi untuk menambahkan request ke queue
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Tambahkan interceptor untuk menambahkan token ke header
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
    
    // Jika response 401 (Unauthorized) dan bukan dari refresh token atau login endpoint
    if (
      error.response && 
      error.response.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('auth/refresh-token') &&
      !originalRequest.url.includes('auth/login')
    ) {
      if (isRefreshing) {
        // Jika sedang refresh token, tambahkan request ke queue
        return new Promise(resolve => {
          addRefreshSubscriber(accessToken => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Coba refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`, 
          {}, 
          { withCredentials: true }
        );
        
        if (response.data.success) {
          const { accessToken } = response.data.data;
          // Simpan access token baru
          Cookies.set('accessToken', accessToken, { expires: 1/96 }); // 15 menit
          
          // Update header Authorization
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          // Proses queue request
          onRefreshed(accessToken);
          isRefreshing = false;
          
          // Retry original request
          return axios(originalRequest);
        } else {
          // Jika refresh token gagal, redirect ke login
          logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Jika terjadi error saat refresh token, logout
        isRefreshing = false;
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Fungsi logout
const logout = () => {
  Cookies.remove('accessToken');
  // Redirect ke login
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { accessToken } = response.data.data;
      // Simpan access token di cookies (client-side)
      Cookies.set('accessToken', accessToken, { expires: 1/96 }); // 15 menit
    }
    return response.data;
  },
  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    if (response.data.success) {
      const { accessToken } = response.data.data;
      // Simpan access token baru
      Cookies.set('accessToken', accessToken, { expires: 1/96 }); // 15 menit
    }
    return response.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      Cookies.remove('accessToken');
    }
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