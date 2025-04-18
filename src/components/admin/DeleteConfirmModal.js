'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

const DeleteConfirmModal = ({ title, message, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error during deletion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal container */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Modal header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiAlertTriangle className="mr-2 text-red-500" />
              {title}
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
          <div className="px-6 py-4">
            <p className="text-gray-700">{message}</p>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm text-yellow-700">
              <strong>Perhatian:</strong> Tindakan ini tidak dapat dibatalkan.
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
              variant="danger"
              type="button"
              isLoading={loading}
              onClick={handleConfirm}
            >
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;