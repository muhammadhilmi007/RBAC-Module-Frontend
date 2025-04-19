'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccess } from '@/hooks/useAccess';
import { useAuth } from '@/hooks/useAuth';
import { 
  FiHome, FiUsers, FiFileText, FiSettings, FiLogOut, FiMenu,
  FiShield, FiLock, FiList, FiDatabase, FiLayers, FiChevronDown, FiChevronRight,
  FiActivity
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

// Map nama icon ke komponen icon
const iconMap = {
  'dashboard': FiHome,
  'users': FiUsers,
  'building': FaBuilding,
  'chart-bar': FiFileText,
  'cog': FiSettings,
  'shield': FiShield,
  'lock': FiLock,
  'list': FiList,
  'database': FiDatabase,
  'layers': FiLayers,
  'activity': FiActivity,
  'default-icon': FiHome
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { sidebarMenu, isLoading, checkPermission } = useAccess();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  
  // Check if the current path is part of the admin section
  const isAdminPath = pathname?.startsWith('/admin');
  
  // If in admin path and admin menu is not open, open it
  useEffect(() => {
    if (isAdminPath && !adminMenuOpen) {
      setAdminMenuOpen(true);
    }
  }, [isAdminPath, adminMenuOpen]);

  // Render icon berdasarkan nama
  const renderIcon = (iconName) => {
    const Icon = iconMap[iconName] || iconMap['default-icon'];
    return <Icon className="mr-3 text-xl" />;
  };

  // Check if user has permission to view admin section
  const canViewAdminSection = checkPermission('Pengaturan', 'View');

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button 
          onClick={toggleSidebar}
          className="p-2 bg-gray-800 text-white rounded-md"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo dan judul */}
          <div className="px-6 py-4 border-b border-gray-700">
            <h1 className="text-xl font-bold">RBAC Admin</h1>
            {user && (
              <p className="text-sm text-gray-400 mt-1">{user.name}</p>
            )}
          </div>

          {/* Menu navigasi */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center mt-10">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <ul className="space-y-1">
                {/* Dashboard */}
                <li>
                  <Link 
                    href="/dashboard" 
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === '/dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    <FiHome className="mr-3 text-xl" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                
                {/* Dynamic menu items from ACL */}
                {sidebarMenu
                  .filter(item => 
                    // Filter out admin-specific features from main menu
                    !['Pengaturan','Dashboard'].includes(item.name)
                  )
                  .map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.route} 
                        className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === item.route ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                      >
                        {renderIcon(item.icon)}
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))
                }
                
                {/* Admin Section */}
                {canViewAdminSection && (
                  <li className="mt-6">
                    <div className="px-4 mb-2">
                      <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Administrator</p>
                    </div>
                    
                    {/* Admin Menu Toggle */}
                    <button
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-md transition-colors ${isAdminPath ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      <div className="flex items-center">
                        <FiShield className="mr-3 text-xl" />
                        <span>Manajemen Sistem</span>
                      </div>
                      {adminMenuOpen ? <FiChevronDown /> : <FiChevronRight />}
                    </button>
                    
                    {/* Admin Submenu */}
                    {adminMenuOpen && (
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>
                          <Link
                            href="/admin/users"
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${pathname === '/admin/users' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                          >
                            <FiUsers className="mr-3 text-lg" />
                            <span>Pengguna</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/roles"
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${pathname === '/admin/roles' || pathname.startsWith('/admin/roles/') ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                          >
                            <FiLock className="mr-3 text-lg" />
                            <span>Role</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/role-hierarchy"
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${pathname === '/admin/role-hierarchy' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                          >
                            <FiLayers className="mr-3 text-lg" />
                            <span>Role Hierarchy</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/acl"
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${pathname === '/admin/acl' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                          >
                            <FiLayers className="mr-3 text-lg" />
                            <span>ACL</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/features"
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${pathname === '/admin/features' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                          >
                            <FiList className="mr-3 text-lg" />
                            <span>Fitur</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/permissions"
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${pathname === '/admin/permissions' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                          >
                            <FiDatabase className="mr-3 text-lg" />
                            <span>Permission</span>
                          </Link>
                        </li>
                        {/* Audit Logs Menu Item */}
                        <li>
                          <Link
                            href="/admin/audit-logs"
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${pathname === '/admin/audit-logs' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                          >
                            <FiActivity className="mr-3 text-lg" />
                            <span>Audit Logs</span>
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                )}
                
                {/* Settings */}
                <li className="mt-2">
                  <Link 
                    href="/settings" 
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === '/settings' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    <FiSettings className="mr-3 text-xl" />
                    <span>Pengaturan</span>
                  </Link>
                </li>
              </ul>
            )}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-700">
            <button 
              onClick={logout}
              className="flex items-center px-4 py-2 w-full text-left text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
            >
              <FiLogOut className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay untuk mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;