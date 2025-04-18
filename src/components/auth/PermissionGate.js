// src/components/auth/PermissionGate.js
'use client';

import React from 'react';
import { useAccess } from '@/hooks/useAccess';

/**
 * Component untuk mengontrol render child berdasarkan permission
 * @param {Object} props
 * @param {String} props.featureName - Nama fitur
 * @param {String} props.permissionName - Nama permission
 * @param {ReactNode} props.children - Child components
 * @param {ReactNode} props.fallback - Component yang ditampilkan jika tidak memiliki permission
 * @returns {ReactNode}
 */
const PermissionGate = ({ 
  featureName, 
  permissionName, 
  children, 
  fallback = null 
}) => {
  const { checkPermission, isLoading } = useAccess();

  // Jika masih loading, jangan tampilkan apapun
  if (isLoading) {
    return null;
  }

  // Cek apakah user memiliki permission
  const hasPermission = checkPermission(featureName, permissionName);

  // Jika memiliki permission, tampilkan children
  // Jika tidak, tampilkan fallback (jika ada)
  return hasPermission ? children : fallback;
};

export default PermissionGate;