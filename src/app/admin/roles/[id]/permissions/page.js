'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PermissionGate from '@/components/auth/PermissionGate';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiSave } from 'react-icons/fi';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function RolePermissionsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [features, setFeatures] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissionsChanged, setPermissionsChanged] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch role details
        const roleResponse = await api.get(`/roles/${id}`);
        
        // Fetch all features
        const featuresResponse = await api.get(`/features`);
        
        // Fetch all permissions
        const permissionsResponse = await api.get(`/permissions`);
        
        if (roleResponse.data.success && featuresResponse.data.success && permissionsResponse.data.success) {
          setRole(roleResponse.data.data);
          setFeatures(featuresResponse.data.data);
          setPermissions(permissionsResponse.data.data);
          
          // Create a matrix of role permissions for easier manipulation
          const permissionMatrix = [];
          
          if (roleResponse.data.data.acl) {
            roleResponse.data.data.acl.forEach(aclItem => {
              permissionMatrix.push({
                roleId: aclItem.roleId,
                featureId: aclItem.featureId,
                permissionId: aclItem.permissionId
              });
            });
          }
          
          setRolePermissions(permissionMatrix);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Check if a specific feature-permission combination is enabled for this role
  const isPermissionEnabled = (featureId, permissionId) => {
    return rolePermissions.some(
      p => p.featureId === featureId && p.permissionId === permissionId
    );
  };

  // Toggle a permission for a feature
  const togglePermission = (featureId, permissionId) => {
    // Create a new copy of the permissions array
    const updatedPermissions = [...rolePermissions];
    
    // Check if this permission is already enabled
    const existingIndex = updatedPermissions.findIndex(
      p => p.featureId === featureId && p.permissionId === permissionId
    );
    
    if (existingIndex >= 0) {
      // Remove the permission if it exists
      updatedPermissions.splice(existingIndex, 1);
    } else {
      // Add the permission if it doesn't exist
      updatedPermissions.push({
        roleId: parseInt(id),
        featureId: featureId,
        permissionId: permissionId
      });
    }
    
    setRolePermissions(updatedPermissions);
    setPermissionsChanged(true);
  };

  // Toggle all permissions for a feature
  const toggleAllPermissionsForFeature = (featureId) => {
    // Check if all permissions are already enabled for this feature
    const allEnabled = permissions.every(permission => 
      isPermissionEnabled(featureId, permission.id)
    );
    
    // Create a new copy of the permissions array
    const updatedPermissions = [...rolePermissions];
    
    // Remove all permissions for this feature
    const withoutFeature = updatedPermissions.filter(p => p.featureId !== featureId);
    
    if (!allEnabled) {
      // Add all permissions for this feature if not all are enabled
      const newPermissions = permissions.map(permission => ({
        roleId: parseInt(id),
        featureId: featureId,
        permissionId: permission.id
      }));
      
      setRolePermissions([...withoutFeature, ...newPermissions]);
    } else {
      // Otherwise, just remove all permissions
      setRolePermissions(withoutFeature);
    }
    
    setPermissionsChanged(true);
  };

  // Save permissions changes
  const savePermissions = async () => {
    try {
      setSaving(true);
      
      // First, get the current ACL for this role to compare
      const roleResponse = await api.get(`/roles/${id}`);
      const currentAcl = roleResponse.data.data.acl || [];
      
      // Identify permissions to add and remove
      const toAdd = [];
      const toRemove = [];
      
      // Find permissions to add (in rolePermissions but not in currentAcl)
      rolePermissions.forEach(newPerm => {
        const exists = currentAcl.some(
          current => 
            current.roleId === newPerm.roleId && 
            current.featureId === newPerm.featureId && 
            current.permissionId === newPerm.permissionId
        );
        
        if (!exists) {
          toAdd.push(newPerm);
        }
      });
      
      // Find permissions to remove (in currentAcl but not in rolePermissions)
      currentAcl.forEach(current => {
        const stillExists = rolePermissions.some(
          newPerm => 
            newPerm.roleId === current.roleId && 
            newPerm.featureId === current.featureId && 
            newPerm.permissionId === current.permissionId
        );
        
        if (!stillExists) {
          toRemove.push(current);
        }
      });
      
      // Add new permissions
      for (const perm of toAdd) {
        await api.post(`/roles/permission/add`, perm);
      }
      
      // Remove old permissions
      for (const perm of toRemove) {
        await api.post(`/roles/permission/remove`, {
          roleId: perm.roleId,
          featureId: perm.featureId,
          permissionId: perm.permissionId
        });
      }
      
      toast.success('Permissions berhasil disimpan');
      setPermissionsChanged(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Gagal menyimpan permissions');
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-800">
              Kelola Permissions: {role?.name || '...'}
            </h1>
            <p className="text-gray-600">
              Atur hak akses yang dimiliki role ini ke berbagai fitur
            </p>
          </div>
        </div>
        
        <PermissionGate featureName="Pengaturan" permissionName="Edit">
          <Button 
            variant="primary" 
            className="flex items-center"
            onClick={savePermissions}
            disabled={!permissionsChanged || saving}
            isLoading={saving}
          >
            <FiSave className="mr-2" />
            Simpan Perubahan
          </Button>
        </PermissionGate>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {features.map(feature => (
            <Card key={feature.id}>
              <Card.Header className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-800">{feature.name}</h3>
                  <span className="text-xs text-gray-500">{feature.route}</span>
                </div>
                
                <div className="flex items-center">
                  <Button 
                    variant="light" 
                    size="sm"
                    className="text-sm"
                    onClick={() => toggleAllPermissionsForFeature(feature.id)}
                  >
                    {permissions.every(p => isPermissionEnabled(feature.id, p.id))
                      ? 'Batalkan Semua'
                      : 'Pilih Semua'
                    }
                  </Button>
                </div>
              </Card.Header>
              
              <div className="p-4">
                <div className="flex flex-wrap gap-3">
                  {permissions.map(permission => (
                    <div 
                      key={`${feature.id}-${permission.id}`}
                      className={`
                        flex items-center border rounded-md p-2 cursor-pointer
                        ${isPermissionEnabled(feature.id, permission.id) 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-gray-50 border-gray-200 text-gray-700'}
                      `}
                      onClick={() => togglePermission(feature.id, permission.id)}
                    >
                      {isPermissionEnabled(feature.id, permission.id) 
                        ? <FiCheckCircle className="mr-2 text-green-500" /> 
                        : <FiXCircle className="mr-2 text-gray-400" />
                      }
                      <span>{permission.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}