'use client';

import React from 'react';
import AuthProvider from './AuthProvider';
import AccessControlProvider from './AccessControlProvider';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <AccessControlProvider>
        {children}
      </AccessControlProvider>
    </AuthProvider>
  );
};

export default AppProviders;