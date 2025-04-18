'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import FeatureGate from '@/components/auth/FeatureGate';
import PermissionGate from '@/components/auth/PermissionGate';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Selamat datang, {user?.name || 'User'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistik - Dapat dilihat oleh semua yang memiliki akses ke Dashboard */}
        <FeatureGate featureName="Dashboard">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Statistik</h2>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Total User</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Cabang</p>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Aktif</p>
                <p className="text-2xl font-bold text-purple-600">18</p>
              </div>
            </div>
          </div>
        </FeatureGate>

        {/* Grafik Keuangan - Hanya dapat dilihat oleh yang memiliki akses ke Laporan Keuangan */}
        <FeatureGate 
          featureName="Laporan Keuangan"
          fallback={
            <div className="bg-gray-100 rounded-lg p-6 border border-dashed border-gray-300">
              <p className="text-gray-500 text-center">Anda tidak memiliki akses ke data Keuangan</p>
            </div>
          }
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Keuangan Bulanan</h2>
            <div className="h-40 flex items-center justify-center">
              <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-blue-50 rounded-md flex items-end">
                <div className="h-20 w-1/5 mx-1 bg-blue-500 rounded-t"></div>
                <div className="h-14 w-1/5 mx-1 bg-blue-500 rounded-t"></div>
                <div className="h-24 w-1/5 mx-1 bg-blue-500 rounded-t"></div>
                <div className="h-16 w-1/5 mx-1 bg-blue-500 rounded-t"></div>
                <div className="h-28 w-1/5 mx-1 bg-blue-500 rounded-t"></div>
              </div>
            </div>
          </div>
        </FeatureGate>

        {/* User Info - Hanya dapat dilihat oleh yang memiliki akses ke Manajemen Pengguna */}
        <FeatureGate 
          featureName="Manajemen Pengguna"
          fallback={
            <div className="bg-gray-100 rounded-lg p-6 border border-dashed border-gray-300">
              <p className="text-gray-500 text-center">Anda tidak memiliki akses ke data Pengguna</p>
            </div>
          }
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Pengguna Terbaru</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-600">John Doe</span>
                <span className="text-sm text-gray-400">Admin</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Jane Smith</span>
                <span className="text-sm text-gray-400">Kepala Cabang</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Michael Brown</span>
                <span className="text-sm text-gray-400">Admin</span>
              </li>
            </ul>
          </div>
        </FeatureGate>
      </div>

      {/* Tabel Tindakan - Contoh penggunaan permission gate */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Tindakan</h2>
          
          {/* Tombol Tambah hanya muncul jika punya permission Create */}
          <PermissionGate featureName="Dashboard" permissionName="Create">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm">
              Tambah Baru
            </button>
          </PermissionGate>
        </div>

        <div className="bg-white shadow overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{item}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Tindakan {item}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {/* Tombol View hanya muncul jika punya permission View */}
                      <PermissionGate featureName="Dashboard" permissionName="View">
                        <button className="text-blue-600 hover:text-blue-900">
                          View
                        </button>
                      </PermissionGate>
                      
                      {/* Tombol Edit hanya muncul jika punya permission Edit */}
                      <PermissionGate featureName="Dashboard" permissionName="Edit">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </button>
                      </PermissionGate>
                      
                      {/* Tombol Delete hanya muncul jika punya permission Delete */}
                      <PermissionGate featureName="Dashboard" permissionName="Delete">
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </PermissionGate>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}