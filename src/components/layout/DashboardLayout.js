'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col md:ml-64">
          {/* Header */}
          <Navbar />
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6 mt-16">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;