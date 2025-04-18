'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { FiX } from 'react-icons/fi';

const PermissionFormModal = ({ title, permission = null, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill form if editing
  useEffect(() => {
    if (permission) {
      setName(permission.name || '');
    }
  }, [permission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError('Nama permission tidak boleh kosong');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await onSubmit({ name });
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
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Permission
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan nama permission"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Contoh: View, Create, Edit, Delete
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
              <Button
                variant="secondary"
                type="button"
                onClick={onClose}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={loading}
              >
                {permission ? 'Perbarui' : 'Simpan'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PermissionFormModal;