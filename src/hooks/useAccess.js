// src/hooks/useAccess.js
'use client';

import { useContext } from 'react';
import { AccessControlContext } from '@/providers/AccessControlProvider';

/**
 * Custom hook untuk mengakses AccessControlContext
 * @returns {Object} - Nilai dari AccessControlContext
 */
export const useAccess = () => {
  const context = useContext(AccessControlContext);
  
  if (context === undefined) {
    throw new Error('useAccess must be used within an AccessControlProvider');
  }
  
  return context;
};

export default useAccess;