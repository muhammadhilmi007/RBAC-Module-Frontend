'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  FiArrowLeft, FiRefreshCw, FiShield, FiLink, 
  FiList, FiSliders, FiCopy, FiCheckSquare 
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { roleHierarchyAPI } from '@/lib/roleHierarchyApi';
import { rolesAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import RoleHierarchyTree from '@/components/admin/RoleHierarchyTree';
import RoleParentModal from '@/components/admin/RoleParentModal';
import InheritanceActionsModal from '@/components/admin/InheritanceActionsModal';
import PermissionTable from '@/components/admin/PermissionTable';

export default function RoleHierarchyPage() {
  const [hierarchy, setHierarchy] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchRoleHierarchy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedRole) {
      fetchRolePermissions(selectedRole.id);
    }
  }, [selectedRole]);

  const fetchRoleHierarchy = async () => {
    try {
      setLoading(true);
      
      // Fetch role hierarchy
      const hierarchyResponse = await roleHierarchyAPI.getRoleHierarchy();
      
      // Fetch all roles for modals
      const rolesData = await rolesAPI.getAllRoles();
      
      if (hierarchyResponse.success && rolesData.success) {
        setHierarchy(hierarchyResponse.data);
        setAllRoles(rolesData.data);
        
        // Select first role by default if available
        if (hierarchyResponse.data.length > 0 && !selectedRole) {
          setSelectedRole(hierarchyResponse.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching role hierarchy:', error);
      toast.error('Gagal memuat hierarki role');
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = async (roleId) => {
    try {
      setIsLoadingPermissions(true);
      const response = await roleHierarchyAPI.getAllRolePermissions(roleId);
      if (response.success) {
        setRolePermissions(response.data);
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      toast.error('Gagal memuat permission role');
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleEditParent = (role) => {
    setSelectedRole(role);
    setShowParentModal(true);
  };

  const handleUpdateParent = async (roleId, parentRoleId) => {
    try {
      const response = await roleHierarchyAPI.updateParentRole(roleId, parentRoleId);
      if (response.success) {
        toast.success('Parent role berhasil diperbarui');
        fetchRoleHierarchy();
      }
    } catch (error) {
      console.error('Error updating parent role:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui parent role');
      throw error;
    }
  };

  const handleCopyPermissions = async (sourceRoleId, targetRoleId) => {
    try {
      const response = await roleHierarchyAPI.copyPermissions(sourceRoleId, targetRoleId);
      if (response.success) {
        toast.success(`Berhasil menyalin ${response.data.copiedCount} permission`);
        if (selectedRole && selectedRole.id === targetRoleId) {
          fetchRolePermissions(targetRoleId);
        }
      }
    } catch (error) {
      console.error('Error copying permissions:', error);
      toast.error(error.response?.data?.message || 'Gagal menyalin permission');
      throw error;
    }
  };

  const handleGrantFullAccess = async (roleId) => {
    try {
      const response = await roleHierarchyAPI.grantFullAccess(roleId);
      if (response.success) {
        toast.success(`Berhasil menambahkan ${response.data.addedCount} permission`);
        if (selectedRole && selectedRole.id === roleId) {
          fetchRolePermissions(roleId);
        }
      }
    } catch (error) {
      console.error('Error granting full access:', error);
      toast.error(error.response?.data?.message || 'Gagal memberikan akses penuh');
      throw error;
    }
  };

  // Find role in hierarchy (recursive)
  const findRoleInHierarchy = (roleId, roles) => {
    for (const role of roles || []) {
      if (role.id === roleId) return role;
      const foundInChildren = findRoleInHierarchy(roleId, role.children);
      if (foundInChildren) return foundInChildren;
    }
    return null;
  };

  // Group permissions by feature
  const groupPermissionsByFeature = (permissions) => {
    const grouped = {};
    
    permissions.forEach(permission => {
      const featureId = permission.feature.id;
      
      if (!grouped[featureId]) {
        grouped[featureId] = {
          feature: permission.feature,
          permissions: []
        };
      }
      
      grouped[featureId].permissions.push({
        id: permission.permission.id,
        name: permission.permission.name,
        inherited: permission.roleId !== selectedRole?.id,
        sourceRoleId: permission.roleId !== selectedRole?.id ? permission.roleId : null
      });
    });
    
    return Object.values(grouped);
  };

  const getFullRoleName = (role) => {
    if (!role) return '';
    
    let parentRole = null;
    if (role.parentRoleId) {
      // Find parent role
      const parent = allRoles.find(r => r.id === role.parentRoleId);
      if (parent) {
        parentRole = parent.name;
      }
    }
    
    return parentRole ? `${role.name} (inherits from ${parentRole})` : role.name;
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="light" 
            className="mr-3" 
            onClick={() => router.push('/admin/roles')}
          >
            <FiArrowLeft className="mr-2" />
            Kembali
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Hierarki Role</h1>
            <p className="text-gray-600">Kelola relasi dan inheritance antar role</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="light" 
            onClick={fetchRoleHierarchy}
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left panel - Role hierarchy */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold">Hierarki Role</h2>
            </Card.Header>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Memuat data...</span>
              </div>
            ) : (
              <div className="p-4">
                <RoleHierarchyTree 
                  hierarchy={hierarchy}
                  onSelectRole={handleSelectRole}
                  onEditParent={handleEditParent}
                  selectedRoleId={selectedRole?.id}
                />
              </div>
            )}
          </Card>
        </div>
        
        {/* Right panel - Role details and permissions */}
        <div className="lg:col-span-3">
          {selectedRole ? (
            <>
              <Card className="mb-6">
                <Card.Header className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Detail Role</h2>
                  <div>
                    <Button 
                      variant="primary" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => setShowActionsModal(true)}
                    >
                      <FiSliders className="mr-2" />
                      Tindakan
                    </Button>
                  </div>
                </Card.Header>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Nama Role</p>
                      <p className="font-medium">{selectedRole.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Parent Role</p>
                      <div className="flex items-center">
                        {selectedRole.parentRoleId ? (
                          <p className="font-medium">
                            {allRoles.find(r => r.id === selectedRole.parentRoleId)?.name || 'Unknown'}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">Tidak ada parent (Root role)</p>
                        )}
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => setShowParentModal(true)}
                        >
                          <FiLink size={14} />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Deskripsi</p>
                      <p>{selectedRole.description || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Child Roles</p>
                      <p>
                        {selectedRole.children && selectedRole.children.length > 0 
                          ? selectedRole.children.map(c => c.name).join(', ')
                          : '-'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Inheritance:</span> {' '}
                      {selectedRole.parentRoleId 
                        ? 'Role ini mewarisi permission dari parent role-nya.' 
                        : 'Role ini tidak mewarisi permission (root role).'}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <Card.Header>
                  <h2 className="text-lg font-semibold">Permission Role</h2>
                </Card.Header>
                
                {isLoadingPermissions ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Memuat permission...</span>
                  </div>
                ) : rolePermissions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FiList size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Tidak ada permission</h3>
                    <p>Role ini belum memiliki permission yang ditetapkan</p>
                    <Button 
                      variant="primary" 
                      className="mt-4"
                      onClick={() => setShowActionsModal(true)}
                    >
                      Tambah Permission
                    </Button>
                  </div>
                ) : (
                  <div className="p-4">
                    <PermissionTable 
                      permissions={groupPermissionsByFeature(rolePermissions)}
                      allRoles={allRoles}
                    />
                  </div>
                )}
              </Card>
            </>
          ) : (
            <Card>
              <div className="p-8 text-center text-gray-500">
                <FiShield size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Pilih Role</h3>
                <p>Pilih role dari hierarki untuk melihat detail dan permission-nya</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {showParentModal && selectedRole && (
        <RoleParentModal 
          role={selectedRole}
          allRoles={allRoles}
          onClose={() => setShowParentModal(false)}
          onUpdateParent={handleUpdateParent}
        />
      )}
      
      {showActionsModal && selectedRole && (
        <InheritanceActionsModal 
          role={selectedRole}
          allRoles={allRoles}
          onClose={() => setShowActionsModal(false)}
          onCopyPermissions={handleCopyPermissions}
          onGrantFullAccess={handleGrantFullAccess}
        />
      )}
    </DashboardLayout>
  );
}