'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { FiX } from 'react-icons/fi';

const FeatureFormModal = ({ title, feature = null, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    route: '',
    icon: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Pre-fill form if editing
  useEffect(() => {
    if (feature) {
      setFormData({
        name: feature.name || '',
        route: feature.route || '',
        icon: feature.icon || ''
      });
      setIsEditMode(true);
    }
  }, [feature]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama fitur tidak boleh kosong';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    try {
      // Prepare data for submission
      const featureData = {
        name: formData.name,
        route: formData.route || null,
        icon: formData.icon || null
      };
      
      await onSubmit(featureData);
    } catch (err) {
      setErrors({ submit: err.message || 'Terjadi kesalahan' });
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
              {errors.submit && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
                  {errors.submit}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Fitur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Masukkan nama fitur"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
                    Route
                  </label>
                  <input
                    type="text"
                    id="route"
                    name="route"
                    value={formData.route}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: /dashboard"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    URL path untuk mengakses fitur ini (opsional)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: dashboard"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Nama icon untuk fitur ini (opsional). Contoh: dashboard, users, cog, dll.
                  </p>
                </div>
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
                {isEditMode ? 'Perbarui' : 'Simpan'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeatureFormModal;