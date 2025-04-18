// src/components/auth/FeatureGate.js
'use client';

import React from 'react';
import { useAccess } from '@/hooks/useAccess';

/**
 * Component untuk mengontrol render child berdasarkan akses ke fitur
 * @param {Object} props
 * @param {String} props.featureName - Nama fitur
 * @param {ReactNode} props.children - Child components
 * @param {ReactNode} props.fallback - Component yang ditampilkan jika tidak memiliki akses
 * @returns {ReactNode}
 */
const FeatureGate = ({ 
  featureName, 
  children, 
  fallback = null 
}) => {
  const { checkFeatureAccess, isLoading } = useAccess();

  // Jika masih loading, jangan tampilkan apapun
  if (isLoading) {
    return null;
  }

  // Cek apakah user memiliki akses ke fitur
  const hasAccess = checkFeatureAccess(featureName);

  // Jika memiliki akses, tampilkan children
  // Jika tidak, tampilkan fallback (jika ada)
  return hasAccess ? children : fallback;
};

export default FeatureGate;