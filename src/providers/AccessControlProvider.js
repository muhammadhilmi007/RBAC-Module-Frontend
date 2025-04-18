// src/providers/AccessControlProvider.js
'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { aclAPI } from '@/lib/api';
import { hasPermission, hasFeatureAccess, getAccessibleFeatures, buildSidebarMenu } from '@/lib/rbac';

// Create context
export const AccessControlContext = createContext();

export const AccessControlProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [userFeatures, setUserFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarMenu, setSidebarMenu] = useState([]);

  // Ambil daftar fitur dan permission user saat user login
  useEffect(() => {
    const fetchUserAccess = async () => {
      if (!isAuthenticated || !user) {
        setUserFeatures([]);
        setSidebarMenu([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await aclAPI.getUserAccess();
        
        if (response.success) {
          const features = response.data.features;
          setUserFeatures(features);
          setSidebarMenu(buildSidebarMenu(features));
        }
      } catch (error) {
        console.error('Fetch user access error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAccess();
  }, [isAuthenticated, user]);

  // Check apakah user memiliki permission tertentu pada fitur
  const checkPermission = (featureName, permissionName) => {
    return hasPermission(userFeatures, featureName, permissionName);
  };

  // Check apakah user memiliki akses ke fitur
  const checkFeatureAccess = (featureName) => {
    return hasFeatureAccess(userFeatures, featureName);
  };

  // Get accessible features
  const getFeatures = () => {
    return getAccessibleFeatures(userFeatures);
  };

  // Value yang akan dishare ke semua komponen
  const value = {
    userFeatures,
    sidebarMenu,
    isLoading,
    checkPermission,
    checkFeatureAccess,
    getFeatures
  };

  return (
    <AccessControlContext.Provider value={value}>
      {children}
    </AccessControlContext.Provider>
  );
};

export default AccessControlProvider;