'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PermissionGate from '@/components/auth/PermissionGate';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft, FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import PermissionFormModal from '@/components/admin/PermissionFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function PermissionsManagementPage() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/permissions');
      if (response.data.success) {
        setPermissions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Gagal memuat data permission');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermission = async (permissionData) => {
    try {
      const response = await api.post('/permissions', permissionData);
      if (response.data.success) {
        toast.success('Permission berhasil dibuat');
        fetchPermissions();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding permission:', error);
      throw new Error(error.response?.data?.message || 'Gagal membuat permission');
    }
  };

  const handleEditPermission = async (permissionData) => {
    try {
      const response = await api.put(`/permissions/${currentPermission.id}`, permissionData);
      if (response.data.success) {
        toast.success('Permission berhasil diperbarui');
        fetchPermissions();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error editing permission:', error);
      throw new Error(error.response?.data?.message || 'Gagal memperbarui permission');
    }
  };

  const handleDeletePermission = async () => {
    try {
      const response = await api.delete(`/permissions/${currentPermission.id}`);
      if (response.data.success) {
        toast.success('Permission berhasil dihapus');
        fetchPermissions();
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting permission:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus permission');
    }
  };

  const openEditModal = (permission) => {
    setCurrentPermission(permission);
    setShowEditModal(true);
  };

  const openDeleteModal = (permission) => {
    setCurrentPermission(permission);
    setShowDeleteModal(true);
  };

  // Filter permissions based on search query
  const filteredPermissions = permissions.filter(permission => 
    permission.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="light" 
            className="mr-3" 
            onClick={() => router.push('/admin/acl')}
          >
            <FiArrowLeft className="mr-2" />
            Kembali
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Permission</h1>
            <p className="text-gray-600">Kelola permission yang dapat diakses pengguna</p>
          </div>
        </div>
        
        <PermissionGate featureName="Pengaturan" permissionName="Create">
          <Button 
            variant="primary" 
            className="flex items-center"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus className="mr-2" />
            Tambah Permission
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <Card.Header className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Daftar Permission</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari permission..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </Card.Header>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadRow>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Nama Permission</Table.HeadCell>
                <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
              </Table.HeadRow>
            </Table.Head>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan="3" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                    <span className="block mt-2 text-gray-500">Memuat data...</span>
                  </Table.Cell>
                </Table.Row>
              ) : filteredPermissions.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan="3" className="text-center py-8 text-gray-500">
                    {searchQuery 
                      ? `Tidak ada hasil untuk "${searchQuery}"` 
                      : 'Tidak ada data permission'}
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredPermissions.map((permission) => (
                  <Table.Row key={permission.id}>
                    <Table.Cell className="text-gray-500">#{permission.id}</Table.Cell>
                    <Table.Cell className="font-medium text-gray-900">{permission.name}</Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <PermissionGate featureName="Pengaturan" permissionName="Edit">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-indigo-600"
                            onClick={() => openEditModal(permission)}
                            title="Edit Permission"
                          >
                            <FiEdit size={16} />
                          </Button>
                        </PermissionGate>
                        
                        <PermissionGate featureName="Pengaturan" permissionName="Delete">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => openDeleteModal(permission)}
                            title="Hapus Permission"
                          >
                            <FiTrash2 size={16} />
                          </Button>
                        </PermissionGate>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
        <Card.Footer className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Menampilkan {filteredPermissions.length} dari {permissions.length} permission
          </div>
        </Card.Footer>
      </Card>

      {/* Add Permission Modal */}
      {showAddModal && (
        <PermissionFormModal
          title="Tambah Permission Baru"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPermission}
        />
      )}

      {/* Edit Permission Modal */}
      {showEditModal && currentPermission && (
        <PermissionFormModal
          title="Edit Permission"
          permission={currentPermission}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditPermission}
        />
      )}

      {/* Delete Permission Modal */}
      {showDeleteModal && currentPermission && (
        <DeleteConfirmModal
          title="Hapus Permission"
          message={`Apakah Anda yakin ingin menghapus permission "${currentPermission.name}"?`}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeletePermission}
        />
      )}
    </DashboardLayout>
  );
}