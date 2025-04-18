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
import FeatureFormModal from '@/components/admin/FeatureFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function FeaturesManagementPage() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await api.get('/features');
      if (response.data.success) {
        setFeatures(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Gagal memuat data fitur');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = async (featureData) => {
    try {
      const response = await api.post('/features', featureData);
      if (response.data.success) {
        toast.success('Fitur berhasil dibuat');
        fetchFeatures();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding feature:', error);
      throw new Error(error.response?.data?.message || 'Gagal membuat fitur');
    }
  };

  const handleEditFeature = async (featureData) => {
    try {
      const response = await api.put(`/features/${currentFeature.id}`, featureData);
      if (response.data.success) {
        toast.success('Fitur berhasil diperbarui');
        fetchFeatures();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error editing feature:', error);
      throw new Error(error.response?.data?.message || 'Gagal memperbarui fitur');
    }
  };

  const handleDeleteFeature = async () => {
    try {
      const response = await api.delete(`/features/${currentFeature.id}`);
      if (response.data.success) {
        toast.success('Fitur berhasil dihapus');
        fetchFeatures();
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus fitur');
    }
  };

  const openEditModal = (feature) => {
    setCurrentFeature(feature);
    setShowEditModal(true);
  };

  const openDeleteModal = (feature) => {
    setCurrentFeature(feature);
    setShowDeleteModal(true);
  };

  // Filter features based on search query
  const filteredFeatures = features.filter(feature => 
    feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (feature.route && feature.route.toLowerCase().includes(searchQuery.toLowerCase()))
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
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Fitur</h1>
            <p className="text-gray-600">Kelola fitur yang dapat diakses pengguna</p>
          </div>
        </div>
        
        <PermissionGate featureName="Pengaturan" permissionName="Create">
          <Button 
            variant="primary" 
            className="flex items-center"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus className="mr-2" />
            Tambah Fitur
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <Card.Header className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Daftar Fitur</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari fitur..."
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
                <Table.HeadCell>Nama Fitur</Table.HeadCell>
                <Table.HeadCell>Route</Table.HeadCell>
                <Table.HeadCell>Icon</Table.HeadCell>
                <Table.HeadCell className="text-right">Aksi</Table.HeadCell>
              </Table.HeadRow>
            </Table.Head>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan="5" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                    <span className="block mt-2 text-gray-500">Memuat data...</span>
                  </Table.Cell>
                </Table.Row>
              ) : filteredFeatures.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan="5" className="text-center py-8 text-gray-500">
                    {searchQuery 
                      ? `Tidak ada hasil untuk "${searchQuery}"` 
                      : 'Tidak ada data fitur'}
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredFeatures.map((feature) => (
                  <Table.Row key={feature.id}>
                    <Table.Cell className="text-gray-500">#{feature.id}</Table.Cell>
                    <Table.Cell className="font-medium text-gray-900">{feature.name}</Table.Cell>
                    <Table.Cell>{feature.route || '-'}</Table.Cell>
                    <Table.Cell>{feature.icon || '-'}</Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <PermissionGate featureName="Pengaturan" permissionName="Edit">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-indigo-600"
                            onClick={() => openEditModal(feature)}
                            title="Edit Fitur"
                          >
                            <FiEdit size={16} />
                          </Button>
                        </PermissionGate>
                        
                        <PermissionGate featureName="Pengaturan" permissionName="Delete">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => openDeleteModal(feature)}
                            title="Hapus Fitur"
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
            Menampilkan {filteredFeatures.length} dari {features.length} fitur
          </div>
        </Card.Footer>
      </Card>

      {/* Add Feature Modal */}
      {showAddModal && (
        <FeatureFormModal
          title="Tambah Fitur Baru"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddFeature}
        />
      )}

      {/* Edit Feature Modal */}
      {showEditModal && currentFeature && (
        <FeatureFormModal
          title="Edit Fitur"
          feature={currentFeature}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditFeature}
        />
      )}

      {/* Delete Feature Modal */}
      {showDeleteModal && currentFeature && (
        <DeleteConfirmModal
          title="Hapus Fitur"
          message={`Apakah Anda yakin ingin menghapus fitur "${currentFeature.name}"?`}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteFeature}
        />
      )}
    </DashboardLayout>
  );
}