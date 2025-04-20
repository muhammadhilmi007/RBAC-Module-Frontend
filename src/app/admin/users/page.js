'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PermissionGate from '@/components/auth/PermissionGate';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiRefreshCw } from 'react-icons/fi';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import UserFormModal from '@/components/admin/UserFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await api.get('/users');
      
      // Fetch roles for dropdown
      const rolesResponse = await api.get('/roles');
      
      if (usersResponse.data.success && rolesResponse.data.success) {
        setUsers(usersResponse.data.data);
        setRoles(rolesResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const response = await api.post('/users', userData);
      if (response.data.success) {
        toast.success('Pengguna berhasil dibuat');
        fetchData();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      throw new Error(error.response?.data?.message || 'Gagal membuat pengguna');
    }
  };

  const handleEditUser = async (userData) => {
    try {
      const response = await api.put(`/users/${currentUser.id}`, userData);
      if (response.data.success) {
        toast.success('Pengguna berhasil diperbarui');
        fetchData();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error editing user:', error);
      throw new Error(error.response?.data?.message || 'Gagal memperbarui pengguna');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await api.delete(`/users/${currentUser.id}`);
      if (response.data.success) {
        toast.success('Pengguna berhasil dihapus');
        fetchData();
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus pengguna');
    }
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.role && user.role.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
          <p className="text-gray-600">Kelola data pengguna sistem</p>
        </div>
        
        <PermissionGate featureName="Manajemen Pengguna" permissionName="Create">
          <Button 
            variant="primary" 
            className="flex items-center"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus className="mr-2" />
            Tambah Pengguna
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <Card.Header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h2 className="text-lg font-semibold">Daftar Pengguna</h2>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pengguna..."
                className="w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Button 
              variant="light" 
              size="sm" 
              className="ml-0 md:ml-2"
              onClick={fetchData}
              title="Refresh data"
            >
              <FiRefreshCw size={16} />
            </Button>
          </div>
        </Card.Header>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadRow>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Nama</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Role</Table.HeadCell>
                <Table.HeadCell>Tanggal Dibuat</Table.HeadCell>
                <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
              </Table.HeadRow>
            </Table.Head>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan="6" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                    <span className="block mt-2 text-gray-500">Memuat data...</span>
                  </Table.Cell>
                </Table.Row>
              ) : filteredUsers.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan="6" className="text-center py-8 text-gray-500">
                    {searchQuery 
                      ? `Tidak ada hasil untuk "${searchQuery}"` 
                      : 'Tidak ada data pengguna'}
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredUsers.map((user, index) => (
                  <Table.Row key={user.id}>
                    <Table.Cell className="text-gray-500">#{index + 1}</Table.Cell>
                    <Table.Cell className="font-medium text-gray-900">{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role.name === 'Super Admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role.name === 'Kepala Cabang'
                            ? 'bg-blue-100 text-blue-800'
                            : user.role.name === 'Admin'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role.name}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <PermissionGate featureName="Manajemen Pengguna" permissionName="View">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-blue-600"
                            title="Lihat Detail"
                          >
                            <FiEye size={16} />
                          </Button>
                        </PermissionGate>
                        
                        <PermissionGate featureName="Manajemen Pengguna" permissionName="Edit">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-indigo-600"
                            onClick={() => openEditModal(user)}
                            title="Edit Pengguna"
                          >
                            <FiEdit size={16} />
                          </Button>
                        </PermissionGate>
                        
                        <PermissionGate featureName="Manajemen Pengguna" permissionName="Delete">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => openDeleteModal(user)}
                            title="Hapus Pengguna"
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
            Menampilkan {filteredUsers.length} dari {users.length} pengguna
          </div>
        </Card.Footer>
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <UserFormModal
          title="Tambah Pengguna Baru"
          roles={roles}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <UserFormModal
          title="Edit Pengguna"
          user={currentUser}
          roles={roles}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditUser}
        />
      )}

      {/* Delete User Modal */}
      {showDeleteModal && currentUser && (
        <DeleteConfirmModal
          title="Hapus Pengguna"
          message={`Apakah Anda yakin ingin menghapus pengguna "${currentUser.name}"?`}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteUser}
        />
      )}
    </DashboardLayout>
  );
}