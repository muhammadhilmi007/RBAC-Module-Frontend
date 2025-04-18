'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiRefreshCw, FiFilter, FiArrowLeft, FiSearch, FiDownload, FiCalendar } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { auditAPI } from '@/lib/auditApi';
import { toast } from 'react-toastify';
import AuditFilterForm from '@/components/admin/AuditFilterForm';

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({ actions: [], modules: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    module: '',
    startDate: '',
    endDate: ''
  });

  const router = useRouter();

  useEffect(() => {
    fetchFilterOptions();
    fetchAuditLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit]);

  const fetchFilterOptions = async () => {
    try {
      const response = await auditAPI.getFilterOptions();
      if (response.success) {
        setFilterOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      toast.error('Gagal memuat opsi filter');
    }
  };

  const fetchAuditLogs = async (newFilters = null) => {
    try {
      setLoading(true);
      
      // Gunakan filter baru jika tersedia, jika tidak gunakan filter yang ada
      const activeFilters = newFilters || filters;
      
      const response = await auditAPI.getAuditLogs(activeFilters, currentPage, limit);
      
      if (response.success) {
        setAuditLogs(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Gagal memuat data audit');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (formFilters) => {
    setFilters(formFilters);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
    fetchAuditLogs(formFilters);
    setShowFilterForm(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getActionStyle = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'READ':
        return 'bg-blue-100 text-blue-800';
      case 'UPDATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'LOGIN':
        return 'bg-purple-100 text-purple-800';
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    // Implementasi export data ke CSV
    toast.info('Fitur export sedang dalam pengembangan');
  };

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
            <h1 className="text-2xl font-bold text-gray-800">Audit Logs</h1>
            <p className="text-gray-600">Riwayat aktivitas pengguna dalam sistem</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="light" 
            onClick={() => setShowFilterForm(!showFilterForm)}
          >
            <FiFilter className="mr-2" />
            Filter
          </Button>
          
          <Button 
            variant="light" 
            onClick={() => fetchAuditLogs()}
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
          
          <Button 
            variant="primary" 
            onClick={exportToCSV}
          >
            <FiDownload className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filter Form */}
      {showFilterForm && (
        <Card className="mb-6">
          <AuditFilterForm 
            initialValues={filters}
            filterOptions={filterOptions}
            onSubmit={handleFilterSubmit}
            onCancel={() => setShowFilterForm(false)}
          />
        </Card>
      )}

      {/* Tampilkan filter aktif */}
      {(filters.userId || filters.action || filters.module || filters.startDate || filters.endDate) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiFilter className="text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-700">Filter Aktif:</span>
            </div>
            <Button 
              variant="light" 
              size="sm" 
              onClick={() => {
                setFilters({
                  userId: '',
                  action: '',
                  module: '',
                  startDate: '',
                  endDate: ''
                });
                fetchAuditLogs({
                  userId: '',
                  action: '',
                  module: '',
                  startDate: '',
                  endDate: ''
                });
              }}
            >
              Reset
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {filters.userId && (
              <span className="px-2 py-1 text-xs bg-white border border-blue-200 rounded-md">
                User ID: {filters.userId}
              </span>
            )}
            {filters.action && (
              <span className="px-2 py-1 text-xs bg-white border border-blue-200 rounded-md">
                Action: {filters.action}
              </span>
            )}
            {filters.module && (
              <span className="px-2 py-1 text-xs bg-white border border-blue-200 rounded-md">
                Module: {filters.module}
              </span>
            )}
            {filters.startDate && (
              <span className="px-2 py-1 text-xs bg-white border border-blue-200 rounded-md flex items-center">
                <FiCalendar className="mr-1" />
                Dari: {filters.startDate}
              </span>
            )}
            {filters.endDate && (
              <span className="px-2 py-1 text-xs bg-white border border-blue-200 rounded-md flex items-center">
                <FiCalendar className="mr-1" />
                Sampai: {filters.endDate}
              </span>
            )}
          </div>
        </div>
      )}

      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold">Riwayat Aktivitas</h2>
        </Card.Header>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Memuat data...</span>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Tidak ada data audit logs</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengguna</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.user?.name || `User ID: ${log.userId}`}</div>
                          <div className="text-sm text-gray-500">{log.user?.email || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getActionStyle(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.module}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ipAddress || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <Card.Footer className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Menampilkan {auditLogs.length} dari {totalItems} aktivitas
          </div>
          <div className="flex space-x-1">
            <Button
              variant="light"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic untuk menampilkan 5 halaman sekitar current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "primary" : "light"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="light"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </DashboardLayout>
  );
}