'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { FiX, FiLink, FiSlash } from 'react-icons/fi';

const RoleParentModal = ({ role, allRoles, onClose, onUpdateParent }) => {
  const [parentRoleId, setParentRoleId] = useState(role?.parentRoleId || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill parent role ID if available
  useEffect(() => {
    if (role?.parentRoleId) {
      setParentRoleId(role.parentRoleId);
    } else {
      setParentRoleId('');
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Convert empty string to null
      const newParentId = parentRoleId === '' ? null : Number(parentRoleId);
      
      // Call the update function
      await onUpdateParent(role.id, newParentId);
      onClose();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto transition-opacity bg-gray-500 bg-opacity-75">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Modal container */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Modal header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiLink className="mr-2" />
              {parentRoleId ? 'Update Parent Role' : 'Tetapkan Parent Role'}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Modal content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="font-medium">{role?.name}</p>
                  {role?.description && (
                    <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="parentRoleId" className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Role
                </label>
                <select
                  id="parentRoleId"
                  value={parentRoleId}
                  onChange={(e) => setParentRoleId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tidak ada parent (Root Role)</option>
                  {allRoles
                    .filter(r => r.id !== role?.id) // Filter out current role
                    .map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))
                  }
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Pilih parent role untuk mengaktifkan inheritance permission
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-md text-sm text-yellow-800">
                <p className="font-medium">Catatan tentang inheritance:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Role akan mewarisi semua permission dari parent role-nya</li>
                  <li>Permission yang diwarisi tidak dapat dihapus (hanya dapat ditambahkan)</li>
                  <li>Perubahan permission pada parent role akan otomatis mempengaruhi semua child roles</li>
                  <li>Pastikan tidak ada circular dependency (misalnya: Role A → Role B → Role A)</li>
                </ul>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
              <Button
                variant="light"
                type="button"
                onClick={onClose}
              >
                Batal
              </Button>
              
              {role?.parentRoleId && (
                <Button
                  variant="danger"
                  type="button"
                  className="flex items-center"
                  onClick={() => {
                    setParentRoleId('');
                    handleSubmit({ preventDefault: () => {} });
                  }}
                >
                  <FiSlash className="mr-2" />
                  Lepaskan Parent
                </Button>
              )}
              
              <Button
                variant="primary"
                type="submit"
                isLoading={loading}
                className="flex items-center"
              >
                <FiLink className="mr-2" />
                {parentRoleId ? 'Update Parent' : 'Tetapkan Parent'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleParentModal;