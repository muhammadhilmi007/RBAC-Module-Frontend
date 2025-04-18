'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PermissionGate from '@/components/auth/PermissionGate';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { FiSave, FiInfo, FiLock, FiUsers, FiShield, FiCpu } from 'react-icons/fi';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
        <p className="text-gray-600">Kelola pengaturan aplikasi dan profil</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Menu */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card>
            <div className="space-y-1 p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-2 text-left rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                <FiInfo className="mr-3" />
                Profil
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-2 text-left rounded-md ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                <FiLock className="mr-3" />
                Keamanan
              </button>
              
              <PermissionGate featureName="Pengaturan" permissionName="View">
                <button
                  onClick={() => setActiveTab('roles')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-md ${activeTab === 'roles' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                >
                  <FiShield className="mr-3" />
                  Peran & Izin
                </button>
              </PermissionGate>
              
              <PermissionGate featureName="Pengaturan" permissionName="View">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-md ${activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                >
                  <FiUsers className="mr-3" />
                  Pengguna
                </button>
              </PermissionGate>
              
              <PermissionGate featureName="Pengaturan" permissionName="View">
                <button
                  onClick={() => setActiveTab('system')}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-md ${activeTab === 'system' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                >
                  <FiCpu className="mr-3" />
                  Sistem
                </button>
              </PermissionGate>
            </div>
          </Card>
        </div>
        
        {/* Content Area */}
        <div className="flex-1">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-800">Informasi Profil</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      defaultValue={user?.name}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      defaultValue={user?.email}
                      disabled
                    />
                    <p className="mt-1 text-sm text-gray-500">Email tidak dapat diubah</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      value={user?.role?.name || ''}
                      disabled
                    />
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="flex justify-end">
                <Button variant="primary" className="flex items-center">
                  <FiSave className="mr-2" />
                  Simpan Perubahan
                </Button>
              </Card.Footer>
            </Card>
          )}
          
          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-800">Keamanan</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-3">Ubah Password</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                        <input 
                          type="password" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                        <input 
                          type="password" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                        <input 
                          type="password" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-md font-medium mb-3">Otentikasi Dua Faktor</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Status: <span className="text-red-600 font-medium">Nonaktif</span></p>
                        <p className="text-sm text-gray-500 mt-1">Aktifkan otentikasi dua faktor untuk keamanan tambahan</p>
                      </div>
                      <Button variant="secondary">Aktifkan</Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="flex justify-end">
                <Button variant="primary" className="flex items-center">
                  <FiSave className="mr-2" />
                  Simpan Perubahan
                </Button>
              </Card.Footer>
            </Card>
          )}
          
          {/* Roles Settings */}
          {activeTab === 'roles' && (
            <PermissionGate 
              featureName="Pengaturan" 
              permissionName="View"
              fallback={
                <Card>
                  <div className="p-8 text-center text-gray-500">
                    <FiShield size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Akses Terbatas</h3>
                    <p>Anda tidak memiliki akses untuk melihat halaman ini</p>
                  </div>
                </Card>
              }
            >
              <Card>
                <Card.Header className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Peran & Izin</h2>
                  <PermissionGate featureName="Pengaturan" permissionName="Create">
                    <Button variant="primary" size="sm">Tambah Role</Button>
                  </PermissionGate>
                </Card.Header>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengguna</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Super Admin</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Akses penuh ke semua fitur</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <PermissionGate featureName="Pengaturan" permissionName="Edit">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          </PermissionGate>
                          <PermissionGate featureName="Pengaturan" permissionName="View">
                            <button className="text-blue-600 hover:text-blue-900">Lihat</button>
                          </PermissionGate>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Kepala Cabang</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Manajemen cabang dan laporan keuangan</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <PermissionGate featureName="Pengaturan" permissionName="Edit">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          </PermissionGate>
                          <PermissionGate featureName="Pengaturan" permissionName="View">
                            <button className="text-blue-600 hover:text-blue-900">Lihat</button>
                          </PermissionGate>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Admin</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Manajemen pengguna dan dashboard</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <PermissionGate featureName="Pengaturan" permissionName="Edit">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          </PermissionGate>
                          <PermissionGate featureName="Pengaturan" permissionName="View">
                            <button className="text-blue-600 hover:text-blue-900">Lihat</button>
                          </PermissionGate>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </PermissionGate>
          )}
          
          {/* Users Management */}
          {activeTab === 'users' && (
            <PermissionGate 
              featureName="Pengaturan" 
              permissionName="View"
              fallback={
                <Card>
                  <div className="p-8 text-center text-gray-500">
                    <FiUsers size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Akses Terbatas</h3>
                    <p>Anda tidak memiliki akses untuk melihat halaman ini</p>
                  </div>
                </Card>
              }
            >
              <Card>
                <Card.Header className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Pengaturan Pengguna</h2>
                  <PermissionGate featureName="Pengaturan" permissionName="Create">
                    <Button variant="primary" size="sm">Tambah Pengguna</Button>
                  </PermissionGate>
                </Card.Header>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Direktur Utama</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">direktur@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Super Admin</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Aktif</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <PermissionGate featureName="Pengaturan" permissionName="Edit">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          </PermissionGate>
                          <PermissionGate featureName="Pengaturan" permissionName="Delete">
                            <button className="text-red-600 hover:text-red-900">Hapus</button>
                          </PermissionGate>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Kepala Cabang Jakarta</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">cabang.jakarta@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Kepala Cabang</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Aktif</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <PermissionGate featureName="Pengaturan" permissionName="Edit">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          </PermissionGate>
                          <PermissionGate featureName="Pengaturan" permissionName="Delete">
                            <button className="text-red-600 hover:text-red-900">Hapus</button>
                          </PermissionGate>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Admin</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">admin@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Aktif</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <PermissionGate featureName="Pengaturan" permissionName="Edit">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          </PermissionGate>
                          <PermissionGate featureName="Pengaturan" permissionName="Delete">
                            <button className="text-red-600 hover:text-red-900">Hapus</button>
                          </PermissionGate>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </PermissionGate>
          )}
          
          {/* System Settings */}
          {activeTab === 'system' && (
            <PermissionGate 
              featureName="Pengaturan" 
              permissionName="View"
              fallback={
                <Card>
                  <div className="p-8 text-center text-gray-500">
                    <FiCpu size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Akses Terbatas</h3>
                    <p>Anda tidak memiliki akses untuk melihat halaman ini</p>
                  </div>
                </Card>
              }
            >
              <Card>
                <Card.Header>
                  <h2 className="text-lg font-semibold text-gray-800">Pengaturan Sistem</h2>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium mb-3">Informasi Aplikasi</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Aplikasi</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            defaultValue="RBAC-ACL Admin System"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Versi</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            defaultValue="1.0.0"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-md font-medium mb-3">Keamanan Sistem</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="force_2fa" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="force_2fa" className="ml-2 block text-sm text-gray-900">
                            Wajibkan 2FA untuk semua pengguna
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="strong_password" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="strong_password" className="ml-2 block text-sm text-gray-900">
                            Wajibkan password kuat
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="auto_logout" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="auto_logout" className="ml-2 block text-sm text-gray-900">
                            Logout otomatis setelah tidak aktif
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-md font-medium mb-3">Email</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Server</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            defaultValue="smtp.example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            defaultValue="587"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Sender</label>
                          <input 
                            type="email" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            defaultValue="noreply@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="flex justify-end">
                  <Button variant="primary" className="flex items-center">
                    <FiSave className="mr-2" />
                    Simpan Perubahan
                  </Button>
                </Card.Footer>
              </Card>
            </PermissionGate>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}