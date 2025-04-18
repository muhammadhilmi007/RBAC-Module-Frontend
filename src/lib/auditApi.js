// src/lib/auditApi.js
import api from './api';

/**
 * API client untuk audit logs
 */
export const auditAPI = {
  /**
   * Mendapatkan daftar audit logs dengan filter dan pagination
   * 
   * @param {Object} filter - Filter untuk audit logs
   * @param {Number} [filter.userId] - Filter berdasarkan user ID
   * @param {String} [filter.action] - Filter berdasarkan action
   * @param {String} [filter.module] - Filter berdasarkan module
   * @param {String} [filter.startDate] - Filter aktivitas setelah tanggal ini (format: YYYY-MM-DD)
   * @param {String} [filter.endDate] - Filter aktivitas sebelum tanggal ini (format: YYYY-MM-DD)
   * @param {Number} page - Halaman yang diminta
   * @param {Number} limit - Jumlah item per halaman
   * @returns {Promise<Object>} - Response dari API
   */
  getAuditLogs: async (filter = {}, page = 1, limit = 10) => {
    const queryParams = new URLSearchParams();
    
    // Tambahkan filter ke query params
    if (filter.userId) queryParams.append('userId', filter.userId);
    if (filter.action) queryParams.append('action', filter.action);
    if (filter.module) queryParams.append('module', filter.module);
    if (filter.startDate) queryParams.append('startDate', filter.startDate);
    if (filter.endDate) queryParams.append('endDate', filter.endDate);
    
    // Tambahkan pagination ke query params
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    const response = await api.get(`/audit?${queryParams.toString()}`);
    return response.data;
  },
  
  /**
   * Mendapatkan opsi untuk filter
   * @returns {Promise<Object>} - Response dari API
   */
  getFilterOptions: async () => {
    const response = await api.get('/audit/filter-options');
    return response.data;
  }
};

export default auditAPI;