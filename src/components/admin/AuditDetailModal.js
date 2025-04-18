'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { FiX, FiInfo } from 'react-icons/fi';

const AuditDetailModal = ({ auditLog, onClose }) => {
  if (!auditLog) return null;
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'text-green-600';
      case 'READ':
        return 'text-blue-600';
      case 'UPDATE':
        return 'text-yellow-600';
      case 'DELETE':
        return 'text-red-600';
      case 'LOGIN':
        return 'text-purple-600';
      case 'LOGOUT':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
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
              <FiInfo className="mr-2" />
              Detail Audit Log
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
            <dl className="space-y-3">
              <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Waktu:</dt>
                <dd className="text-sm text-gray-900 col-span-2">{formatDateTime(auditLog.createdAt)}</dd>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">User:</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {auditLog.user ? (
                    <>
                      <div>{auditLog.user.name}</div>
                      <div className="text-xs text-gray-500">{auditLog.user.email}</div>
                      <div className="text-xs text-gray-500">Role: {auditLog.user.role?.name || '-'}</div>
                    </>
                  ) : (
                    `User ID: ${auditLog.userId}`
                  )}
                </dd>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Aksi:</dt>
                <dd className={`text-sm font-medium col-span-2 ${getActionColor(auditLog.action)}`}>
                  {auditLog.action}
                </dd>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Modul:</dt>
                <dd className="text-sm text-gray-900 col-span-2">{auditLog.module}</dd>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Deskripsi:</dt>
                <dd className="text-sm text-gray-900 col-span-2">{auditLog.description}</dd>
              </div>
              
              {auditLog.resourceId && (
                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Resource ID:</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{auditLog.resourceId}</dd>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">IP Address:</dt>
                <dd className="text-sm text-gray-900 col-span-2">{auditLog.ipAddress || '-'}</dd>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">User Agent:</dt>
                <dd className="text-sm text-gray-500 col-span-2 break-words">{auditLog.userAgent || '-'}</dd>
              </div>
              
              {auditLog.oldValues && Object.keys(auditLog.oldValues).length > 0 && (
                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Nilai Lama:</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(auditLog.oldValues, null, 2)}
                    </pre>
                  </dd>
                </div>
              )}
              
              {auditLog.newValues && Object.keys(auditLog.newValues).length > 0 && (
                <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Nilai Baru:</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(auditLog.newValues, null, 2)}
                    </pre>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Modal footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end">
            <Button
              variant="primary"
              onClick={onClose}
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailModal;