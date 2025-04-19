// src/lib/roleHierarchyApi.js
import api from './api';

/**
 * API client untuk role hierarchy
 */
export const roleHierarchyAPI = {
  /**
   * Mendapatkan hierarki role
   * @returns {Promise<Object>} - Response dari API
   */
  getRoleHierarchy: async () => {
    const response = await api.get('/role-hierarchy/hierarchy');
    return response.data;
  },

  /**
   * Mendapatkan semua permission role (termasuk yang diwarisi)
   * @param {Number} roleId - ID role
   * @returns {Promise<Object>} - Response dari API
   */
  getAllRolePermissions: async (roleId) => {
    const response = await api.get(`/role-hierarchy/${roleId}/permissions`);
    return response.data;
  },

  /**
   * Mengubah parent role
   * @param {Number} roleId - ID role
   * @param {Number|null} parentRoleId - ID parent role baru (null untuk menghapus parent)
   * @returns {Promise<Object>} - Response dari API
   */
  updateParentRole: async (roleId, parentRoleId) => {
    const response = await api.put(`/role-hierarchy/${roleId}/parent`, { parentRoleId });
    return response.data;
  },

  /**
   * Memberikan akses penuh pada semua fitur
   * @param {Number} roleId - ID role
   * @returns {Promise<Object>} - Response dari API
   */
  grantFullAccess: async (roleId) => {
    const response = await api.post(`/role-hierarchy/${roleId}/grant-full-access`);
    return response.data;
  },

  /**
   * Menyalin permission dari satu role ke role lainnya
   * @param {Number} sourceRoleId - ID role sumber
   * @param {Number} targetRoleId - ID role target
   * @returns {Promise<Object>} - Response dari API
   */
  copyPermissions: async (sourceRoleId, targetRoleId) => {
    const response = await api.post('/role-hierarchy/copy-permissions', { sourceRoleId, targetRoleId });
    return response.data;
  }
};

export default roleHierarchyAPI;