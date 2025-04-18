'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PermissionGate from '@/components/auth/PermissionGate';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiArrowLeft, FiArrowRight, FiRefreshCw, FiShield } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function ACLManagementPage() {
  const [roles, setRoles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, featuresRes, permissionsRes] = await Promise.all([
        api.get(`/roles`),
        api.get(`/features`),
        api.get(`/permissions`),
      ]);

      if (rolesRes.data.success && featuresRes.data.success && permissionsRes.data.success) {
        setRoles(rolesRes.data.data);
        setFeatures(featuresRes.data.data);
        setPermissions(permissionsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role) {
      router.push(`/admin/roles/${role.id}/permissions`);
    }
  };

  const createNewFeature = () => {
    // Redirect to feature management page or open modal
    router.push('/admin/features');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen ACL</h1>
        <p className="text-gray-600">Kelola hak akses berdasarkan role, fitur, dan permission</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
              <Card.Body>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-500 text-white mr-3">
                    <FiShield size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Total Roles</h3>
                    <p className="text-2xl font-bold text-blue-600">{roles.length}</p>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => router.push('/admin/roles')}
                >
                  Kelola Roles
                </Button>
              </Card.Body>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
              <Card.Body>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-500 text-white mr-3">
                    <FiShield size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Total Fitur</h3>
                    <p className="text-2xl font-bold text-green-600">{features.length}</p>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => router.push('/admin/features')}
                >
                  Kelola Fitur
                </Button>
              </Card.Body>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
              <Card.Body>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-purple-500 text-white mr-3">
                    <FiShield size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Total Permission</h3>
                    <p className="text-2xl font-bold text-purple-600">{permissions.length}</p>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => router.push('/admin/permissions')}
                >
                  Kelola Permission
                </Button>
              </Card.Body>
            </Card>
          </div>

          <Card>
            <Card.Header className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Konfigurasi ACL berdasarkan Role</h2>
              <Button 
                variant="light" 
                size="sm" 
                onClick={fetchData}
                title="Refresh data"
              >
                <FiRefreshCw size={16} />
              </Button>
            </Card.Header>

            <Card.Body>
              <p className="mb-4 text-gray-600">
                Pilih role di bawah ini untuk mengkonfigurasi hak aksesnya ke berbagai fitur:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map(role => (
                  <div 
                    key={role.id}
                    className={`
                      p-4 border rounded-md cursor-pointer transition-all
                      hover:shadow-md hover:border-blue-300
                      ${selectedRole?.id === role.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    `}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{role.name}</h3>
                        <p className="text-sm text-gray-500">
                          {role._count?.users || 0} pengguna
                        </p>
                      </div>
                      <FiArrowRight className="text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>

            <Card.Footer className="bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Pilih role untuk mengkonfigurasi permissions
                </div>
                <PermissionGate featureName="Pengaturan" permissionName="Create">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => router.push('/admin/roles')}
                  >
                    Tambah Role Baru
                  </Button>
                </PermissionGate>
              </div>
            </Card.Footer>
          </Card>

          <div className="mt-6">
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold">Ringkasan Sistem ACL</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Role-Based Access Control (RBAC)</h3>
                    <p className="text-gray-600">
                      Sistem RBAC memberikan izin kepada pengguna berdasarkan peran (role) yang dimilikinya. 
                      Setiap pengguna memiliki satu role, dan setiap role memiliki satu set permission terhadap fitur tertentu.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Access Control List (ACL)</h3>
                    <p className="text-gray-600">
                      ACL mendefinisikan kombinasi Role-Feature-Permission yang menentukan hak akses dalam sistem. 
                      Dengan ACL, Anda dapat mengontrol secara detail fitur apa saja yang dapat diakses oleh setiap role
                      dan apa saja yang dapat mereka lakukan pada fitur tersebut.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">Petunjuk Penggunaan:</h3>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1">
                      <li>Pilih role untuk mengonfigurasi permissionnya</li>
                      <li>Pada halaman konfigurasi, aktifkan atau nonaktifkan permission untuk setiap fitur</li>
                      <li>Klik Simpan Perubahan untuk menyimpan konfigurasi</li>
                      <li>Permission akan langsung berlaku tanpa perlu restart aplikasi</li>
                    </ol>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}