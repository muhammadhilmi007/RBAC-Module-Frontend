// src/components/auth/ProtectedRoute.js
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * HOC untuk mengamankan halaman yang membutuhkan autentikasi
 * @param {ReactNode} children - Child components
 * @returns {ReactNode}
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Jika sudah selesai loading dan tidak terautentikasi, redirect ke login
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Jika masih loading atau belum terautentikasi, tampilkan loading
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Jika terautentikasi, tampilkan children
  return children;
};

export default ProtectedRoute;