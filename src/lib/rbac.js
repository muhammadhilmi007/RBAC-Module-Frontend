// src/lib/rbac.js

/**
 * Fungsi untuk memeriksa apakah user memiliki permission tertentu pada fitur
 * @param {Array} userFeatures - Daftar fitur dan permission yang dimiliki user
 * @param {String} featureName - Nama fitur yang ingin diperiksa
 * @param {String} permissionName - Nama permission yang ingin diperiksa
 * @returns {Boolean} - True jika memiliki permission, false jika tidak
 */
export const hasPermission = (userFeatures, featureName, permissionName) => {
    if (!userFeatures || !Array.isArray(userFeatures)) return false;
  
    // Cari fitur berdasarkan nama
    const feature = userFeatures.find(f => f.name === featureName);
    if (!feature) return false;
  
    // Cek apakah user memiliki permission yang diminta
    return feature.permissions.some(p => p.name === permissionName);
  };
  
  /**
   * Fungsi untuk memeriksa apakah user memiliki setidaknya 1 permission pada fitur
   * @param {Array} userFeatures - Daftar fitur dan permission yang dimiliki user
   * @param {String} featureName - Nama fitur yang ingin diperiksa
   * @returns {Boolean} - True jika memiliki akses ke fitur, false jika tidak
   */
  export const hasFeatureAccess = (userFeatures, featureName) => {
    if (!userFeatures || !Array.isArray(userFeatures)) return false;
  
    // Cari fitur berdasarkan nama
    const feature = userFeatures.find(f => f.name === featureName);
    if (!feature) return false;
  
    // Cek apakah user memiliki setidaknya 1 permission pada fitur
    return feature.permissions.length > 0;
  };
  
  /**
   * Fungsi untuk mendapatkan daftar fitur yang dapat diakses user
   * @param {Array} userFeatures - Daftar fitur dan permission yang dimiliki user
   * @returns {Array} - Daftar fitur yang dapat diakses
   */
  export const getAccessibleFeatures = (userFeatures) => {
    if (!userFeatures || !Array.isArray(userFeatures)) return [];
  
    return userFeatures.filter(feature => feature.permissions.length > 0);
  };
  
  /**
   * Fungsi untuk membuat menu sidebar berdasarkan fitur yang dapat diakses
   * @param {Array} userFeatures - Daftar fitur dan permission yang dimiliki user
   * @returns {Array} - Daftar menu yang dapat diakses
   */
  export const buildSidebarMenu = (userFeatures) => {
    if (!userFeatures || !Array.isArray(userFeatures)) return [];
  
    return userFeatures
      .filter(feature => feature.permissions.length > 0) // Hanya tampilkan fitur yang memiliki permission
      .map(feature => ({
        name: feature.name,
        route: feature.route || '#',
        icon: feature.icon || 'default-icon',
        permissions: feature.permissions.map(p => p.name),
      }));
  };