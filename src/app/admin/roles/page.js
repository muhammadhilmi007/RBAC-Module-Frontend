'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PermissionGate from '@/components/auth/PermissionGate';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import { FiPlus, FiEdit, FiTrash2, FiShield, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import RoleFormModal from '@/components/admin/RoleFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function RolesManagementPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/roles');
      if (response.data.success) {
        setRoles(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Gagal memuat data role');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (roleData) => {
    try {
      const response = await api.post('/roles', roleData);
      if (response.data.success) {
        toast.success('Role berhasil dibuat');
        fetchRoles();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error(error.response?.data?.message || 'Gagal membuat role');
    }
  };

  const handleEditRole = async (roleData) => {
    try {
      const response = await api.put(`/roles/${currentRole.id}`, roleData);
      if (response.data.success) {
        toast.success('Role berhasil diperbarui');
        fetchRoles();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error editing role:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui role');
    }
  };

  const handleDeleteRole = async () => {
    try {
      const response = await api.delete(`/roles/${currentRole.id}`);
      if (response.data.success) {
        toast.success('Role berhasil dihapus');
        fetchRoles();
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus role');
    }
  };

  const openEditModal = (role) => {
    setCurrentRole(role);
    setShowEditModal(true);
  };

  const openDeleteModal = (role) => {
    setCurrentRole(role);
    setShowDeleteModal(true);
  };

  const navigateToRolePermissions = (role) => {
    router.push(`/admin/roles/${role.id}/permissions`);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Role</h1>
          <p className="text-gray-600">Kelola role dan hak akses pengguna</p>
        </div>
        
        <PermissionGate featureName="Pengaturan" permissionName="Create">
          <Button 
            variant="primary" 
            className="flex items-center"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus className="mr-2" />
            Tambah Role
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <Card.Header className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Daftar Role</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Cari role..."
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </Card.Header>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadRow>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Nama Role</Table.HeadCell>
                <Table.HeadCell>Jumlah Pengguna</Table.HeadCell>
                <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
              </Table.HeadRow>
            </Table.Head>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan="4" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                    <span className="block mt-2 text-gray-500">Memuat data...</span>
                  </Table.Cell>
                </Table.Row>
              ) : roles.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan="4" className="text-center py-8 text-gray-500">
                    Tidak ada data role
                  </Table.Cell>
                </Table.Row>
              ) : (
                roles.map((role) => (
                  <Table.Row key={role.id}>
                    <Table.Cell className="text-gray-500">#{role.id}</Table.Cell>
                    <Table.Cell className="font-medium text-gray-900">{role.name}</Table.Cell>
                    <Table.Cell>{role._count?.users || 0} pengguna</Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <PermissionGate featureName="Pengaturan" permissionName="View">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-blue-600"
                            onClick={() => navigateToRolePermissions(role)}
                            title="Kelola Permission"
                          >
                            <FiShield size={16} />
                          </Button>
                        </PermissionGate>
                        
                        <PermissionGate featureName="Pengaturan" permissionName="Edit">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-indigo-600"
                            onClick={() => openEditModal(role)}
                            title="Edit Role"
                          >
                            <FiEdit size={16} />
                          </Button>
                        </PermissionGate>
                        
                        <PermissionGate featureName="Pengaturan" permissionName="Delete">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => openDeleteModal(role)}
                            disabled={role._count?.users > 0}
                            title={role._count?.users > 0 ? "Tidak dapat dihapus (masih digunakan)" : "Hapus Role"}
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
      </Card>

      {/* Add Role Modal */}
      {showAddModal && (
        <RoleFormModal
          title="Tambah Role Baru"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddRole}
        />
      )}

      {/* Edit Role Modal */}
      {showEditModal && currentRole && (
        <RoleFormModal
          title="Edit Role"
          role={currentRole}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditRole}
        />
      )}

      {/* Delete Role Modal */}
      {showDeleteModal && currentRole && (
        <DeleteConfirmModal
          title="Hapus Role"
          message={`Apakah Anda yakin ingin menghapus role "${currentRole.name}"?`}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteRole}
        />
      )}
    </DashboardLayout>
  );
}