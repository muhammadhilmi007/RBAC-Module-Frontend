'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { FiSearch, FiX } from 'react-icons/fi';

const AuditFilterForm = ({ initialValues, filterOptions, onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState(initialValues || {
    userId: '',
    action: '',
    module: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  const clearAll = () => {
    setFormValues({
      userId: '',
      action: '',
      module: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filter Audit Logs</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onCancel}
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="text"
              name="userId"
              value={formValues.userId}
              onChange={handleChange}
              placeholder="Masukkan ID User"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Aksi
            </label>
            <select
              name="action"
              value={formValues.action}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Aksi</option>
              {filterOptions.actions?.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modul
            </label>
            <select
              name="module"
              value={formValues.module}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Modul</option>
              {filterOptions.modules?.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="startDate"
              value={formValues.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir
            </label>
            <input
              type="date"
              name="endDate"
              value={formValues.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2">
        <Button
          variant="light"
          type="button"
          onClick={clearAll}
        >
          Reset
        </Button>
        <Button
          variant="light"
          type="button"
          onClick={onCancel}
        >
          Batal
        </Button>
        <Button
          variant="primary"
          type="submit"
          className="flex items-center"
        >
          <FiSearch className="mr-2" />
          Filter
        </Button>
      </div>
    </form>
  );
};

export default AuditFilterForm;