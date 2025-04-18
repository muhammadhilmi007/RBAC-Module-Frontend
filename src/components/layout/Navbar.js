'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { FiSearch, FiBell, FiSettings, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50 md:left-64">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center justify-start">
          {/* Mobile Sidebar Toggle */}
          <button
            type="button"
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="w-6 h-6" />
          </button>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative ml-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="search-navbar"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cari..."
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleNotifications}
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100"
            >
              <span className="sr-only">View notifications</span>
              <div className="relative">
                <FiBell className="w-6 h-6" />
                <div className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  3
                </div>
              </div>
            </button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                <div className="px-4 py-2 font-medium text-gray-700 border-b border-gray-200">
                  Notifikasi
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <a href="#" className="flex px-4 py-3 hover:bg-gray-100 border-b border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <FiUser className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="ml-3 w-full">
                      <div className="text-sm font-medium text-gray-900">
                        Pengumuman: Update Sistem
                      </div>
                      <div className="text-xs text-gray-500">
                        Sistem akan mengalami pemeliharaan pada tanggal 20 April 2025
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        2 jam yang lalu
                      </div>
                    </div>
                  </a>
                  <a href="#" className="flex px-4 py-3 hover:bg-gray-100 border-b border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                        <FiUser className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="ml-3 w-full">
                      <div className="text-sm font-medium text-gray-900">
                        Laporan Bulanan
                      </div>
                      <div className="text-xs text-gray-500">
                        Laporan keuangan bulan Maret telah tersedia
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        1 hari yang lalu
                      </div>
                    </div>
                  </a>
                  <a href="#" className="flex px-4 py-3 hover:bg-gray-100">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                        <FiUser className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="ml-3 w-full">
                      <div className="text-sm font-medium text-gray-900">
                        Pengingat: Rapat Mingguan
                      </div>
                      <div className="text-xs text-gray-500">
                        Rapat mingguan akan dimulai 30 menit lagi
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        30 menit yang lalu
                      </div>
                    </div>
                  </a>
                </div>
                <a
                  href="#"
                  className="block py-2 text-sm font-medium text-center text-blue-600 bg-gray-50 hover:bg-gray-100 hover:underline"
                >
                  Lihat semua notifikasi
                </a>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative ml-3">
            <button
              type="button"
              onClick={toggleUserMenu}
              className="flex items-center text-sm rounded-full focus:ring-4 focus:ring-gray-300 ml-2"
            >
              <span className="sr-only">Open user menu</span>
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="ml-2 text-gray-700 font-medium hidden md:inline-block">
                {user?.name || 'User'}
              </span>
            </button>
            
            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <ul>
                  <li>
                    <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FiUser className="w-4 h-4 mr-2" />
                      Profil
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FiSettings className="w-4 h-4 mr-2" />
                      Pengaturan
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;